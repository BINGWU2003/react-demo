class Client {
    constructor() {
        this._id = window.localStorage.getItem('client.id');
        this._baseUrl = window.localStorage.getItem('client.baseUrl');
        this._computerName = window.localStorage.getItem('client.computerName');
    }

    set computerName(value) {
        this._computerName = value;
        window.localStorage.setItem('client.computerName', value);
    }

    get computerName() {
        return this._computerName;
    }

    get baseUrl() {
        return this._baseUrl;
    }

    set baseUrl(value) {
        this._baseUrl = value;
        window.localStorage.setItem('client.baseUrl', value);
        window.localStorage.setItem('baseUrl', value);
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
        window.localStorage.setItem('client.id', value);
    }
}

class User {
    constructor() {
        this._token = window.localStorage.getItem('user.token');
        this._cid = window.localStorage.getItem('user.cid');
    }

    get token() {
        return this._token;
    }

    set token(value) {
        this._token = value;
        window.localStorage.setItem('token', value);
    }

    get cid() {
        return this._cid;
    }

    set cid(value) {
        this._cid = value;
        window.localStorage.setItem('user.cid', value);
    }
}

class Pinter {
    constructor() {
        this._name = window.localStorage.getItem('printer.name');
        this._onlineAttribute = window.localStorage.getItem('printer.onlineAttribute');
        this._offlineAttribute = window.localStorage.getItem('printer.offlineAttribute');
        this.currAttribute = this._onlineAttribute;
    }
    set name(value) {
        if(this._name === value){
            return;
        }
        this._name = value;
        // 打印机切换后清除之前的属性
        this.clearAttributes();
        window.localStorage.setItem('printer.name', value);
    }

    get isOnline(){
        // 离线时属性值比在线值大，_onlineAttribute和_offlineAttribute识别可能会出错
        // 若出现当前值大于在线值和离线值，则直接设置为离线
        if(this._onlineAttribute){
            return String(this.currAttribute) <= Number(this._onlineAttribute);
        }
        return Number(this.currAttribute) < Number(this._offlineAttribute);
    }

    get name() {
        return this._name;
    }

    set onlineAttribute(value) {
        this._onlineAttribute = value;
        window.localStorage.setItem('printer.onlineAttribute', value);
    }

    set offlineAttribute(value) {
        this._offlineAttribute = value;
        window.localStorage.setItem('printer.offlineAttribute', value);
    }

    clearAttributes(){
        this.onlineAttribute = '';
        this.offlineAttribute = '';
        this.currAttribute = '';
    }
}

let user = new User();
let client = new Client();
let printer = new Pinter();
export {user, client, printer};