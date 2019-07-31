export default class MsgStoreClass {
    public sessMap:any = {} //跟所有用户或群的聊天记录MAP
    public sessTimeline:any = [] //按时间降序排列的会话列表
    public msgCache:any = {} //消息缓存，用于判重

    public cookie: any
    public syncFlag: any
    // public sessMap: any
    public sessCount: any
    public sessByTypeId: any
    public delSessByTypeId: any
    public resetCookieAndSyncFlag: any
    public setAutoRead: any
    public c2CMsgReaded: any
    public addSession: any
    public delSession: any
    public clear: any
    public addMsg: any
    public updateTimeline: any
    public visitSess = (visitor:any) => {
        for (let i in this.sessMap) {
            visitor(this.sessMap[i])
        }
    }
    //消息查重
    public checkDupMsg = (msg:any) => {
        let dup = false
        let first_key = msg.sess._impl.skey
        let second_key = [!!msg.isSend ? '1' : '0', msg.seq, msg.random].join(
            ''
        )
        let tempMsg = this.msgCache[first_key] && this.msgCache[first_key][second_key]
        if (tempMsg) {
            dup = true
        }
        if (this.msgCache[first_key]) {
            this.msgCache[first_key][second_key] = {
                time: msg.time
            }
        } else {
            this.msgCache[first_key] = {}
            this.msgCache[first_key][second_key] = {
                time: msg.time
            }
        }
        return dup
    }

    constructor(Session:any, C2CMsgReadedItem:any, SESSION_TYPE:any, proto_c2CMsgReaded:any, log:any, proto_groupMsgReaded:any) {
        //C2C
        this.cookie = '' //上一次拉取新c2c消息的cookie
        this.syncFlag = 0 //上一次拉取新c2c消息的是否继续拉取标记
        this.sessMap = () => {
            return this.sessMap
        }
        this.sessCount = () => {
            return this.sessTimeline.length
        }
        this.sessByTypeId = (type:any, id:any) => {
            let skey = Session.skey(type, id)
            if (skey === undefined || skey == null) return null
            return this.sessMap[skey]
        }
        this.delSessByTypeId = (type:any, id:any) => {
            let skey = Session.skey(type, id)
            if (skey === undefined || skey == null) return false
            if (this.sessMap[skey]) {
                delete this.sessMap[skey]
                delete this.msgCache[skey]
            }
            return true
        }
        this.resetCookieAndSyncFlag = () => {
            this.cookie = ''
            this.syncFlag = 0
        }

        //切换将当前会话的自动读取消息标志为isOn,重置其他会话的自动读取消息标志为false
        this.setAutoRead = (selSess:any, isOn:any, isResetAll:any) => {
            if (isResetAll)
                this.visitSess(function(s:any) {
                    s._impl.isAutoRead = false
                })
            if (selSess) {
                selSess._impl.isAutoRead = isOn //
                if (isOn) {
                    //是否调用已读上报接口
                    selSess._impl.unread = 0

                    if (selSess._impl.type === SESSION_TYPE.C2C) {
                        //私聊消息已读上报
                        let tmpC2CMsgReadedItem = []
                        tmpC2CMsgReadedItem.push(
                            new C2CMsgReadedItem(
                                selSess._impl.id,
                                selSess._impl.time
                            )
                        )
                        //调用C2C消息已读上报接口
                        proto_c2CMsgReaded(
                            this.cookie,
                            tmpC2CMsgReadedItem,
                            function(resp: any) {
                                log.info('[setAutoRead]: c2CMsgReaded success')
                            },
                            function(err:any) {
                                log.error(
                                    '[setAutoRead}: c2CMsgReaded failed:' +
                                        err.ErrorInfo
                                )
                            }
                        )
                    } else if (selSess._impl.type === SESSION_TYPE.GROUP) {
                        //群聊消息已读上报
                        let tmpOpt = {
                            GroupId: selSess._impl.id,
                            MsgReadedSeq: selSess._impl.curMaxMsgSeq
                        }
                        //调用group消息已读上报接口
                        proto_groupMsgReaded(
                            tmpOpt,
                            function(resp: any) {
                                log.info('groupMsgReaded success')
                            },
                            function(err: any) {
                                log.error(
                                    'groupMsgReaded failed:' + err.ErrorInfo
                                )
                            }
                        )
                    }
                }
            }
        }

        this.c2CMsgReaded = (opts: any, cbOk: any, cbErr: any) => {
            let tmpC2CMsgReadedItem = []
            tmpC2CMsgReadedItem.push(
                new C2CMsgReadedItem(opts.To_Account, opts.LastedMsgTime)
            )
            //调用C2C消息已读上报接口
            proto_c2CMsgReaded(
                this.cookie,
                tmpC2CMsgReadedItem,
                function(resp: any) {
                    if (cbOk) {
                        log.info('c2CMsgReaded success')
                        cbOk(resp)
                    }
                },
                function(err: any) {
                    if (cbErr) {
                        log.error('c2CMsgReaded failed:' + err.ErrorInfo)
                        cbErr(err)
                    }
                }
            )
        }

        this.addSession = (sess: any) => {
            this.sessMap[sess._impl.skey] = sess
        }
        this.delSession = (sess: any) => {
            delete this.sessMap[sess._impl.skey]
        }
        this.clear = () => {
            this.sessMap = {} //跟所有用户或群的聊天记录MAP
            this.sessTimeline = [] //按时间降序排列的会话列表
            this.msgCache = {} //消息缓存，用于判重
            this.cookie = '' //上一次拉取新c2c消息的cookie
            this.syncFlag = 0 //上一次拉取新c2c消息的是否继续拉取标记
        }
        this.addMsg = (msg: any, unread: any) => {
            if (this.checkDupMsg(msg)) return false
            let sess = msg.sess
            if (!this.sessMap[sess._impl.skey]) this.addSession(sess)
            sess._impl_addMsg(msg, unread)
            return true
        }
        this.updateTimeline = () => {
            // let arr:any = new Array()
            let arr:any = []
            this.visitSess(function(sess: any) {
                arr.push(sess)
            })
            arr.sort(function(a: any, b: any) {
                return b.time - a.time
            })
            this.sessTimeline = arr
        }
    }
}
