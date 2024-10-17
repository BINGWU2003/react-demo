import mqtt from 'mqtt'
let isDev = process.env.NODE_ENV === 'development';
let showLog = false;
import { useCollectLogs } from '@/hooks/collect-logs';
const { collectLogs, currentTopic } = useCollectLogs()
function log() {
    if (isDev && showLog) {
        console.log(...arguments);
    }
}
function MqttPlugin(enableLog = false) {
    showLog = enableLog;
    let defaultOpt = {
        host: '',
        port: 8083,
        username: '',
        password: '',
    };
    return {
        client: null,
        opt: {},
        topicMap: {},
        init(opt, onSuccess) {
            let _this = this;
            this.opt = Object.assign(defaultOpt, opt);
            let url = `wxs://${this.opt.host}/mqtt`;
            if (isDev) {
                url = `wx://${this.opt.host}/mqtt`;
                this.opt.port = 80;
            }
            url = `ws://${this.opt.host}/mqtt`;
            const maxReconnectAttempts = 10;
            let reconnectAttempts = 0;
            this.opt.port = opt.port;
            this.client = mqtt.connect(url, this.opt);
            this.client.on('connect', e => {
                log('mqtt连接成功',e);
                collectLogs(`mqtt连接成功,topic:${opt.topic}`);
                reconnectAttempts = 0;
                // 重连
                if (Object.keys(this.topicMap).length > 0) {
                    log('重连后重新进行订阅');
                    collectLogs(`重连后重新进行订阅:${opt.topic}`);
                    for (let topic in this.topicMap) {
                        this.sub(topic, this.topicMap[topic].callback, this.topicMap[topic].qos);
                    }
                } else
                if (typeof(onSuccess) == 'function') {
                    onSuccess();
                };
            })
            this.client.on('error', e => {
                log('mqtt连接失败', e);
                collectLogs('mqtt连接失败',e);
            });
            this.client.on('reconnect', e => {
                if (reconnectAttempts >= maxReconnectAttempts) {
                    log('重连次数超过最大重连次数，停止重连')
                    collectLogs(`重连次数超过最大重连次数，停止重连,topic:${opt.topic}`)
                    this.client.end()
                }
                reconnectAttempts++
                log('重连中...', e);
                collectLogs(`重连中...,重连次数:${reconnectAttempts}`, e);
            });
            //mqtt消息回调
            this.client.on('message', (topic, message) => {
                let msg = message.toString();
                log("收到mqtt消息,topic:" + topic);
                collectLogs('收到mqtt消息:' + msg + ',topic:' + topic);
                let callback = this.findTopic(topic);
                if (callback) {
                    try {
                        msg = JSON.parse(msg)
                    } catch (e) {
                        log('消息格式化异常:' + e);
                        collectLogs('消息格式化异常:' + e);
                    }
                    try {
                        callback(msg);
                    } catch (e) {
                        console.error('回调异常:' + e);
                        collectLogs('回调异常:' + e);
                    }
                } else {
                    log(`topic callback not found. the topic is: ${topic}`);
                    collectLogs(`topic callback not found. the topic is: ${topic}`);
                }
            });
            this.client.on('close', (e) => {
                console.log('客户端和服务端已断开连接')
            })

            this.client.on('offline', (e) => {
                console.log('客户端已离线')
            });
        },
        onConnectionLost(err) {
            if (err) {
                log('连接已断开');
                log('断开原因:' + err);
                collectLogs('连接已断开,断开原因:' + err);
                if (instance.opt.autoReconnection) {
                    instance.reconnect();
                }
            }
        },
        reconnect() {
            this.client.connect({
                userName: this.opt.userName,
                password: this.opt.password,
                keepAliveInterval: this.opt.keepAliveInterval,
                onSuccess: () => {
                    log('mqtt重新连接成功');
                    log('开始重新订阅消息');
                    collectLogs(`开始重新订阅消息,mqtt重新连接成功.topic:${currentTopic.value}`);

                }
            });
        },
        sub(topic, callback, qos = 2) {
            log("订阅主题:" + topic);
            collectLogs("订阅主题:" + topic);
            this.topicMap[topic] = {
                callback: callback,
                qos: qos
            };
            this.client.subscribe(topic, {
                qos: qos,
                onFailure: function onFailure() {
                    log(`主题${topic}订阅失败`);
                    collectLogs(`主题${topic}订阅失败`);
                }
            }, (err, granted) => {
                if (err) {
                    log(`主题${topic}订阅异常`);
                    collectLogs(`主题${topic}订阅异常`, err);
                    console.error(err);
                }
            });
        },
        unsub(topic) {
            this.client.unsubscribe(topic);
        },
        pub(topic, msg, qos = 0) {
            log("发送消息:" + msg);
            collectLogs(`发送消息:${msg},topic:${topic}`);
            this.client.publish(topic, msg, {
                qos
            });
        },
        disconnect(e) {
            log('断开mqtt连接',e);
            collectLogs(`断开mqtt连接`, e);
            if(this.client){
                this.client.end();
            }
        },
        findTopic(topic) {
            let topics = Object.keys(this.topicMap).filter(key => {
                if (key == topic) {
                    return true;
                }
                let topicItems = topic.split('/');
                let keys = key.split('/');
                for (let i = 0; i < topicItems.length; i++) {
                    let t1 = topicItems[i];
                    let t2 = keys[i];
                    // #号通配后面所有
                    if (t2 == '#') {
                        return true;
                    }
                    if (t1 == t2 || t2 == '+') {
                        continue;
                    }
                    return false;
                }
                return true;
            });
            if (topics.length > 0) {
                return this.topicMap[topics[0]].callback;
            }
            return null;
        }
    }
}
let mqttClient = new MqttPlugin();
export default mqttClient;
