import MsgElemClass from './msg-elem';
import { nextSeq, createRandom, unixtime, calcUniqId } from './methods';
import { SESSION_TYPE, MSG_ELEMENT_TYPE } from './store';
export default class MsgClass {
    public sess:any;
    public subType:any;
    public fromAccount:any;
    public fromAccountNick:any;
    public fromAccountHeadurl:any;
    public isSend:any;
    public seq:any;
    public random:any;
    public time:any;
    public elems:any;
    public uniqueId:any;
    public offlinePushInfo:any;
    public Elem:any;

    constructor (sess:any, isSend:any, seq:any, random:any, time:any, fromAccount:any, subType:any, fromAccountNick:any, fromAccountHeadurl:any) {
        this.sess = sess;
        this.subType = subType >= 0 ? subType : 0; //消息类型,c2c消息时，type取值为0；group消息时，type取值0和1，0-普通群消息，1-群提示消息
        this.fromAccount = fromAccount;
        this.fromAccountNick = fromAccountNick ? fromAccountNick : fromAccount;
        this.fromAccountHeadurl = fromAccountHeadurl || null;
        this.isSend = Boolean(isSend);
        this.seq = seq >= 0 ? seq : nextSeq();
        this.random = random >= 0 ? random : createRandom();
        this.time = time >= 0 ? time : unixtime();
        this.elems = [];
        this.Elem = MsgElemClass;

        let type = sess.type();
        switch (type) {
            case SESSION_TYPE.GROUP:
                this.uniqueId = calcUniqId(this.seq, this.random);
                break;
            case SESSION_TYPE.C2C:
            default:
                this.uniqueId = calcUniqId(this.time, this.random);
                break;
        }


    };
    getSession () {
        return this.sess;
    };
    getType () {
        return this.subType;
    };
    getSubType () {
        return this.subType;
    };
    getFromAccount () {
        return this.fromAccount;
    };
    getFromAccountNick () {
        return this.fromAccountNick;
    };
    getIsSend () {
        return this.isSend;
    };
    getSeq () {
        return this.seq;
    };
    getTime () {
        return this.time;
    };
    getRandom () {
        return this.random;
    };
    getElems () {
        return this.elems;
    };
    getMsgUniqueId () {
        return this.uniqueId;
    };
    //文本
    addText (text:any) {
        this.addElem(new this.Elem(MSG_ELEMENT_TYPE.TEXT, text));
    };
    //表情
    addFace (face:any) {
        this.addElem(new this.Elem(MSG_ELEMENT_TYPE.FACE, face));
    };
    //图片
    addImage (image:any) {
        this.addElem(new this.Elem(MSG_ELEMENT_TYPE.IMAGE, image));
    };
    //地理位置
    addLocation (location:any) {
        this.addElem(new this.Elem(MSG_ELEMENT_TYPE.LOCATION, location));
    };
    //文件
    addFile (file:any) {
        this.addElem(new this.Elem(MSG_ELEMENT_TYPE.FILE, file));
    };
    //自定义
    addCustom (custom:any) {
        this.addElem(new this.Elem(MSG_ELEMENT_TYPE.CUSTOM, custom));
    };
    addElem (elem:any) {
        this.elems.push(elem);
    };
    toHtml () {
        let html = "";
        for (let i in this.elems) {
            let elem = this.elems[i];
            html += elem.toHtml();
        }
        return html;
    };

    // 暴力点 直接添加，内部的配置不细写
    setOfflinePushInfo (offlinePushInfo:any) {
        this.offlinePushInfo = offlinePushInfo;
    };
}