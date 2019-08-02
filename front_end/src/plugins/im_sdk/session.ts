export default class SessionClass {
    private _impl:any;
    public skey:any
    constructor (type:any, id:any, name:any, icon:any, time:any, seq:any) {
        this._impl = {
            skey: this.skey(type, id),
            type: type,
            id: id,
            name: name,
            icon: icon,
            unread: 0, //未读消息数
            isAutoRead: false,
            time: time >= 0 ? time : 0,
            curMaxMsgSeq: seq >= 0 ? seq : 0,
            msgs: [],
            isFinished: 1
        };

        this.skey = (type:any, id:any) => {
            return type + id;
        };

    };
    type () {
        return this._impl.type;
    };
    id () {
        return this._impl.id;
    };
    name () {
        return this._impl.name;
    };
    icon () {
        return this._impl.icon;
    };
    unread (val:any) {
        if (typeof val !== 'undefined') {
            this._impl.unread = val;
        } else {
            return this._impl.unread;
        }
    };
    isFinished (val:any) {
        if (typeof val !== 'undefined') {
            this._impl.isFinished = val;
        } else {
            return this._impl.isFinished;
        }
    };
    time () {
        return this._impl.time;
    };
    curMaxMsgSeq (seq:any) {
        if (typeof seq !== 'undefined') {
            this._impl.curMaxMsgSeq = seq;
        } else {
            return this._impl.curMaxMsgSeq;
        }
    };
    msgCount () {
        return this._impl.msgs.length;
    };
    msg (index:any) {
        return this._impl.msgs[index];
    };
    msgs () {
        return this._impl.msgs;
    };
    _impl_addMsg (msg:any, unread:any) {
        this._impl.msgs.push(msg);
        //if (!msg.isSend && msg.time > this._impl.time)
        if (msg.time > this._impl.time)
            this._impl.time = msg.time;
        //if (!msg.isSend && msg.seq > this._impl.curMaxMsgSeq)
        if (msg.seq > this._impl.curMaxMsgSeq)
            this._impl.curMaxMsgSeq = msg.seq;
        //自己发送的消息不计入未读数
        if (!msg.isSend && !this._impl.isAutoRead && unread) {
            this._impl.unread++;
        }
    };
}