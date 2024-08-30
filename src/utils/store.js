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
        this._name = value;
        window.localStorage.setItem('printer.name', value);
    }

    get isOnline(){
        return String(this._onlineAttribute) === String(this.currAttribute) || String(this._offlineAttribute) !== String(this.currAttribute);
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
}

let user = new User();
let client = new Client();
let printer = new Pinter();
export {user, client, printer};