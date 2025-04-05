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
        reconnectPeriod: 30,   // 禁用库自带重连
        keepalive: 60,        // 心跳检测
        protocolVersion: 4,    // 强制使用 MQTT v3.1.1
        reconnect: true
    };

    return {
        client: null,
        opt: {},
        topicMap: {},
        reconnectTimes: 0,
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
                logInfo('清理旧连接');
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
                // 直接重新刷新页面，简单粗暴
                if (location) {
                    location.reload();
                }
            });

            this.client.on('reconnect', () => {
                logInfo(`第${_this.reconnectTimes ++}次重连尝试`);
            });

            this.client.on('message', (topic, message) => {
                let msg;
                try {
                    msg = JSON.parse(message.toString());
                } catch (e) {
                    msg = message.toString();
                }
                logInfo('收到消息:', msg)
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
            });

            this.client.on('offline', () => {
                logError(`客户端离线`, '', 'red');
            });
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
                    logError(`订阅失败: ${topic}, 直接重载页面刷新`);
                    location.reload();
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
                        logError(`发送失败: ${topic}, 客户端连接状态:${this.client}`);
                        return reject(err);
                    }
                    this.publishTimeoutId = setTimeout(() => {
                        const timeoutError = new Error('MQTT publish 超时');
                        logError(`发送超时: ${topic}`) ;
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