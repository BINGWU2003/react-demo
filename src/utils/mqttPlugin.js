import mqtt from 'mqtt'

let isDev = process.env.NODE_ENV === 'development';
let showLog = false;
import { useCollectLogs } from '@/hooks/collect-logs';

const { logSuccess, logInfo, logError } = useCollectLogs()

function log() {
    if (isDev && showLog) {
        console.log(...arguments);
    }
}

const MAX_RECONNECT_TIMES = 2000;  // 最大重连次数
const BASE_RECONNECT_DELAY = 1000; // 初始延迟1秒
const MAX_RECONNECT_DELAY = 30000; // 最大延迟60秒

function MqttPlugin(enableLog = false) {
    showLog = enableLog;
    const defaultOpt = {
        host: '',
        port: 8083,
        username: '',
        password: '',
        clean: true,          // 明确清理会话
        reconnectPeriod: 0,   // 禁用库自带重连
        keepalive: 60,        // 心跳检测
        protocolVersion: 4    // 强制使用 MQTT v3.1.1
    };

    return {
        client: null,
        opt: {},
        topicMap: {},
        reconnecting: false,
        reconnectTimes: 0,
        reconnectId: null,
        publishTimeoutId: null,
        url: '',
        init(opt, onSuccess) {
            this.opt = Object.assign({}, defaultOpt, opt);
            // 动态选择协议
            let protocol = 'ws';
            this.url = `${protocol}://${this.opt.host}/mqtt`;

            // 清理旧客户端
            this._cleanupClient();

            // 创建新连接
            this.client = mqtt.connect(this.url, this.opt);
            this._configListener(onSuccess);
        },

        _cleanupClient() {
            if (this.client) {
                this.client.removeAllListeners();
                this.client.end(true, () => {
                    this.client = null;
                    log('旧连接已完全清理');
                });
            }
        },

        _configListener(onSuccess) {
            const _this = this;

            this.client.on('connect', (e) => {
                log('MQTT连接成功', e);
                logSuccess(`MQTT连接成功`);
                _this.reconnectTimes = 0;
                _this.reconnecting = false;

                // 自动重新订阅
                if (Object.keys(_this.topicMap).length > 0) {
                    log('执行自动重新订阅');
                    Object.entries(_this.topicMap).forEach(([topic, config]) => {
                        _this.sub(topic, config.callback, config.qos);
                    });
                } else if (typeof onSuccess === 'function') {
                    onSuccess();
                }
            });

            this.client.on('error', (e) => {
                log('MQTT连接错误:', e);
                logError(`连接错误: ${e.message}`, '', 'red');
                this.reconnecting = false;
                // 可恢复错误处理
                _this.reconnect();
            });

            this.client.on('reconnect', () => {
                log(`第${_this.reconnectTimes + 1}次重连尝试`);
            });

            this.client.on('message', (topic, message) => {
                let msg;
                try {
                    msg = JSON.parse(message.toString());
                } catch (e) {
                    msg = message.toString();
                }
                console.log(this.opt.clientId)
                log('收到消息:', msg)
                const callback = _this.findTopic(topic);
                if (callback) {
                    try {
                        callback(msg);
                        logInfo(`消息处理成功: ${topic}`);

                    } catch (e) {
                        console.error('回调执行错误:', e);
                        logError(`回调错误: ${e.message}`);
                    }
                } else {
                    log(`未注册的Topic: ${topic}`);
                }
            });

            this.client.on('close', () => {
                logError(`连接关闭`, '', 'red');
                if (!_this.reconnecting) {
                    _this.reconnect();
                }
            });

            this.client.on('offline', () => {
                logError(`客户端离线`, '', 'red');
            });
        },

        reconnect() {
            if (this.reconnecting) {
                logInfo('正在重连中，请稍等...')
                return;
            }
            if (this.reconnectTimes >= MAX_RECONNECT_TIMES) {
                logInfo(`重连已停止，当前尝试次数: ${this.reconnectTimes}`);
                return;
            }
            this.reconnecting = true;
            const delay = Math.min(
                BASE_RECONNECT_DELAY * Math.pow(2, this.reconnectTimes),
                MAX_RECONNECT_DELAY
            );
            logInfo(`等待 ${delay / 1000} 秒后重试...`);
            if(this.reconnectId){
                clearTimeout(this.reconnectId);
                this.reconnectId = null;
            }
            this.reconnectId = setTimeout(() => {
                this.reconnectTimes++;
                logInfo('重建客户端连接');
                this.init(this.opt, () => {
                    this.reconnecting = false;
                });
                setTimeout(() => {
                    if(this.reconnecting){
                        this.reconnecting = false;
                    }
                    // 重试超时，重置重连标识
                }, delay);
            }, delay);
        },

        sub(topic, callback, qos = 2) {
            if (!this.client || this.client.disconnected) {
                logInfo('客户端未连接，延迟订阅');
                setTimeout(() => this.sub(topic, callback, qos), 1000);
                return;
            }

            logInfo(`订阅Topic: ${topic}`);
            this.topicMap[topic] = { callback, qos };
            this.client.unsubscribe(topic);
            this.client.subscribe(topic, { qos }, (err) => {
                if (err) {
                    logError(`订阅失败: ${topic}`);
                    if (err.message === 'client disconnecting') {
                        this.reconnect();
                    }
                } else {
                    logSuccess(`订阅成功:${topic}`);
                }
            });
        },

        unsub(topic) {
            if (this.client && !this.client.disconnected) {
                this.client.unsubscribe(topic, {}, (err) => {
                    if (err) {
                        logError(`取消订阅失败: ${topic}`, err);
                    } else {
                        delete this.topicMap[topic];
                        logInfo(`取消订阅成功: ${topic}`);
                    }
                });
            }
        },

        pub(topic, message, qos = 0, timeout = 10000) {
            return new Promise((resolve, reject) => {
                try {
                    if (!this.client || this.client.disconnected) {
                        const err = new Error('客户端未连接');
                        logError(`发送失败: ${topic}, 客户端连接状态:${this.client?.disconnected}`);
                        // 延时重连
                        setTimeout(() => {
                            if(!this.client || this.client.disconnected){
                                this.reconnect()
                            }
                        }, 3000)
                        return reject(err);
                    }
                    this.publishTimeoutId = setTimeout(() => {
                        const timeoutError = new Error('MQTT publish 超时');
                        logError(`发送超时: ${topic}`) ;
                        // 尝试重连
                        this.reconnect();
                        this.publishTimeoutId = null;
                        reject(timeoutError);
                    }, timeout);
                    const payload = typeof message === 'object'
                        ? JSON.stringify(message)
                        : message.toString();

                    this.client.publish(topic, payload, { qos }, (err) => {
                        clearTimeout(this.publishTimeoutId);
                        if (err) {
                            logError(`发送失败: ${topic}, ${err.message}`);
                            if (err.message === 'client disconnecting') {
                                this.reconnect();
                            }
                            reject(err);
                        } else {
                            logSuccess(`发送成功: ${topic}`);
                            resolve();
                        }
                    }, (err) => {
                        logError(`发送失败: ${topic}, ${err.message}`);
                        reject(err);
                    });
                } catch (err) {
                    logError(`发送mqtt前失败: ${topic}, ${err.message}`)
                    reject(err);
                }
            });
        },

        disconnect() {
            if (this.client) {
                logInfo('主动断开连接');
                this.client.end(true, () => {
                    this.client = null;
                    this.reconnectTimes = 0;
                });
            }
        },

        findTopic(topic) {
            const match = Object.keys(this.topicMap).find((storedTopic) => {
                const storedParts = storedTopic.split('/');
                const targetParts = topic.split('/');

                for (let i = 0; i < storedParts.length; i++) {
                    if (storedParts[i] === '#') return true;
                    if (storedParts[i] !== '+' && storedParts[i] !== targetParts[i]) return false;
                }
                return storedParts.length === targetParts.length;
            });

            return match ? this.topicMap[match].callback : null;
        }
    }
}

const mqttClient = new MqttPlugin(false);
export default mqttClient;