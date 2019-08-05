import {store} from './store'
export default class MsgManagerClass {
    public onMsgCallback: any = null //新消息(c2c和group)回调

    public onGroupInfoChangeCallback: any = null //群资料变化回调
    //收到新群系统消息回调列表
    public onGroupSystemNotifyCallbacks: any = {
        '1': null,
        '2': null,
        '3': null,
        '4': null,
        '5': null,
        '6': null,
        '7': null,
        '8': null,
        '9': null,
        '10': null,
        '11': null,
        '15': null,
        '255': null,
        '12': null
    }
    //监听好友系统通知函数
    public onFriendSystemNotifyCallbacks: any = {
        '1': null,
        '2': null,
        '3': null,
        '4': null,
        '5': null,
        '6': null,
        '7': null,
        '8': null
    }

    public onProfileSystemNotifyCallbacks: any = {
        '1': null
    }

    public onKickedEventCall: any = null

    public onMsgReadCallback = null

    //普通长轮询
    public longPollingOn = false //是否开启普通长轮询
    public isLongPollingRequesting = false //是否在长轮询ing
    public notifySeq: any = 0 //c2c通知seq
    public noticeSeq = 0 //群消息seq

    //大群长轮询
    public onBigGroupMsgCallback: any = null //大群消息回调
    public bigGroupLongPollingOn = false //是否开启长轮询
    public bigGroupLongPollingStartSeqMap: any = {} //请求拉消息的起始seq(大群长轮询)
    public bigGroupLongPollingHoldTime = 90 //客户端长轮询的超时时间，单位是秒(大群长轮询)
    public bigGroupLongPollingKeyMap: any = null //客户端加入群组后收到的的Key(大群长轮询)
    public bigGroupLongPollingMsgMap: any = {} //记录收到的群消息数
    public onC2cEventCallbacks: any = {
        '92': null, //消息已读通知,
        '96': null
    }
    // let onAppliedDownloadUrl = null;

    public getLostGroupMsgCount = 0 //补拉丢失的群消息次数
    //我的群当前最大的seq
    public myGroupMaxSeqs: any = {} //用于补拉丢失的群消息

    public groupSystemMsgsCache: any = {} //群组系统消息缓存,用于判重
    public setLongPollingOn: any
    public getLongPollingOn: any
    public resetLongPollingInfo: any
    public setBigGroupLongPollingOn: any
    public checkBigGroupLongPollingOn: any
    public setBigGroupLongPollingKey: any
    public resetBigGroupLongPollingInfo: any
    public setBigGroupLongPollingMsgMap: any
    public clear: any
    public longPolling: any
    public bigGroupLongPolling: any
    public syncMsgs: any
    public getC2CHistoryMsgs: any
    public syncGroupMsgs: any
    public init: any
    public sendMsg: any
    public handlerFriendSystemNotices: any
    public handlerProfileSystemNotices: any
    public handlerGroupSystemMsg: any
    public handlerC2cNotifyMsgArray: any
    public handlerC2cEventMsg: any
    public initIpAndAuthkey: any
    public initMyGroupMaxSeqs: any
    public getLostGroupMsgs: any
    public updateMyGroupCurMaxSeq: any
    public addGroupMsgList: any
    public handlerOrdinaryAndTipC2cMsgs: any
    public handlerOrdinaryAndTipGroupMsgs: any
    public handlerGroupTips: any
    public handlerGroupSystemMsgs: any
    // public handlerOrdinaryAndTipC2cMsgs: any
    public updatecLongPollingStatus: any
    public startNextLongPolling: any
    public handlerApplyJoinGroupSystemMsgs: any
    public handlerGroupMsg: any

    public doPolling(
        proto_longPolling: any,
        opts: any,
        LONG_POLLINNG_EVENT_TYPE: any,
        log: any,
        ACTION_STATUS: any,
        cbErr: any
    ) {
        proto_longPolling(
            opts,
            (resp: any) => {
                for (let i in resp.EventArray) {
                    let e = resp.EventArray[i]
                    switch (e.Event) {
                        case LONG_POLLINNG_EVENT_TYPE.C2C: //c2c消息通知
                            //更新C2C消息通知seq
                            this.notifySeq = e.NotifySeq
                            log.warn('longpolling: received new c2c msg')
                            //获取新消息
                            this.syncMsgs()
                            break
                        case LONG_POLLINNG_EVENT_TYPE.GROUP_COMMON: //普通群消息通知
                            log.warn('longpolling: received new group msgs')
                            this.handlerOrdinaryAndTipGroupMsgs(
                                e.Event,
                                e.GroupMsgArray
                            )
                            break
                        case LONG_POLLINNG_EVENT_TYPE.GROUP_TIP: //（全员广播）群提示消息
                            log.warn('longpolling: received new group tips')
                            this.handlerOrdinaryAndTipGroupMsgs(
                                e.Event,
                                e.GroupTips
                            )
                            break
                        case LONG_POLLINNG_EVENT_TYPE.GROUP_TIP2: //群提示消息
                            log.warn('longpolling: received new group tips')
                            this.handlerOrdinaryAndTipGroupMsgs(
                                e.Event,
                                e.GroupTips
                            )
                            break
                        case LONG_POLLINNG_EVENT_TYPE.GROUP_SYSTEM: //（多终端同步）群系统消息
                            log.warn(
                                'longpolling: received new group system msgs'
                            )
                            //false 表示 通过长轮询收到的群系统消息，可以不判重
                            this.handlerGroupSystemMsgs(e.GroupTips, false)
                            break
                        case LONG_POLLINNG_EVENT_TYPE.FRIEND_NOTICE: //好友系统通知
                            log.warn(
                                'longpolling: received new friend system notice'
                            )
                            //false 表示 通过长轮询收到的好友系统通知，可以不判重
                            this.handlerFriendSystemNotices(
                                e.FriendListMod,
                                false
                            )
                            break
                        case LONG_POLLINNG_EVENT_TYPE.PROFILE_NOTICE: //资料系统通知
                            log.warn(
                                'longpolling: received new profile system notice'
                            )
                            //false 表示 通过长轮询收到的资料系统通知，可以不判重
                            this.handlerProfileSystemNotices(
                                e.ProfileDataMod,
                                false
                            )
                            break
                        case LONG_POLLINNG_EVENT_TYPE.C2C_COMMON: //c2c消息通知
                            this.noticeSeq = e.C2cMsgArray[0].NoticeSeq
                            //更新C2C消息通知seq
                            log.warn(
                                'longpolling: received new c2c_common msg',
                                this.noticeSeq
                            )
                            this.handlerOrdinaryAndTipC2cMsgs(
                                e.Event,
                                e.C2cMsgArray
                            )
                            break
                        case LONG_POLLINNG_EVENT_TYPE.C2C_EVENT: //c2c已读消息通知
                            this.noticeSeq = e.C2cNotifyMsgArray[0].NoticeSeq
                            log.warn('longpolling: received new c2c_event msg')
                            this.handlerC2cNotifyMsgArray(e.C2cNotifyMsgArray)
                            break
                        default:
                            log.error(
                                'longpolling收到未知新消息类型: Event=' +
                                    e.Event
                            )
                            break
                    }
                }
                let successInfo = {
                    ActionStatus: ACTION_STATUS.OK,
                    ErrorCode: 0
                }
                this.updatecLongPollingStatus(successInfo)
            },
            (err: any) => {
                //log.error(err);
                this.updatecLongPollingStatus(err)
                if (cbErr) cbErr(err)
            }
        )
    }

    constructor(
        proto_getLongPollingId: any,
        proto_longPolling: any,
        LONG_POLLINNG_EVENT_TYPE: any,
        log: any,
        ACTION_STATUS: any,
        proto_bigGroupLongPolling: any,
        tool: any,
        CONNECTION_STATUS: any,
        ConnManager: any,
        longPollingPackageTooLargeErrorCode: any,
        longPollingTimeOutErrorCode: any,
        longPollingKickedErrorCode: any,
        proto_getMsgs: any,
        MsgStore: any,
        SESSION_TYPE: any,
        Session: any,
        Msg: any,
        C2C_MSG_SUB_TYPE: any,
        MSG_ELEMENT_TYPE: any,
        FRIEND_WRITE_MSG_ACTION: any,
        proto_getC2CHistoryMsgs: any,
        proto_getGroupMsgs: any,
        proto_sendMsg: any,
        FRIEND_NOTICE_TYPE: any,
        PROFILE_NOTICE_TYPE: any,
        GROUP_SYSTEM_TYPE: any,
        C2C_EVENT_SUB_TYPE: any,
        proto_logout: any,
        proto_getIpAndAuthkey: any,
        proto_getJoinedGroupListHigh: any,
        longPollingOffCallbackFlag: any,
        curLongPollingStatus: any,
        LONG_POLLING_MAX_RET_ERROR_COUNT: any,
        longPollingIntervalTime: any,
        GROUP_MSG_SUB_TYPE: any,
        GROUP_MSG_PRIORITY_TYPE: any,
        getFileDownUrl: any,
        GROUP_TIP_TYPE: any,
        GROUP_TIP_MODIFY_GROUP_INFO_TYPE: any
    ) {
        //设置长轮询开关
        //isOn=true 开启
        //isOn=false 停止
        this.setLongPollingOn = (isOn: any) => {
            this.longPollingOn = isOn
        }
        this.getLongPollingOn = () => {
            return this.longPollingOn
        }

        //重置长轮询变量
        this.resetLongPollingInfo = () => {
            this.longPollingOn = false
            this.notifySeq = 0
            this.noticeSeq = 0
        }

        //设置大群长轮询开关
        //isOn=true 开启
        //isOn=false 停止
        this.setBigGroupLongPollingOn = (isOn: any) => {
            this.bigGroupLongPollingOn = isOn
        }

        //查看是否存在该轮询，防止多次入群
        this.checkBigGroupLongPollingOn = (groupId: any) => {
            return !!this.bigGroupLongPollingKeyMap[groupId]
        }
        //设置大群长轮询key
        this.setBigGroupLongPollingKey = (GroupId: any, key: any) => {
            this.bigGroupLongPollingKeyMap[GroupId] = key
        }
        //重置大群长轮询变量
        this.resetBigGroupLongPollingInfo = (groupId: any) => {
            this.bigGroupLongPollingOn = false

            this.bigGroupLongPollingStartSeqMap[groupId] = 0
            this.bigGroupLongPollingKeyMap[groupId] = null
            this.bigGroupLongPollingMsgMap[groupId] = {}

            this.bigGroupLongPollingStartSeqMap[groupId].delete()
            this.bigGroupLongPollingKeyMap[groupId].delete()
            this.bigGroupLongPollingMsgMap[groupId].delete()
        }

        //设置群消息数据条数
        this.setBigGroupLongPollingMsgMap = (groupId: any, count: any) => {
            let bigGroupLongPollingMsgCount = this.bigGroupLongPollingMsgMap[
                groupId
            ]
            if (bigGroupLongPollingMsgCount) {
                bigGroupLongPollingMsgCount =
                    parseInt(bigGroupLongPollingMsgCount) + count
                this.bigGroupLongPollingMsgMap[
                    groupId
                ] = bigGroupLongPollingMsgCount
            } else {
                this.bigGroupLongPollingMsgMap[groupId] = count
            }
        }

        //重置
        this.clear = () => {
            this.onGroupInfoChangeCallback = null
            this.onGroupSystemNotifyCallbacks = {
                '1': null, //申请加群请求（只有管理员会收到）
                '2': null, //申请加群被同意（只有申请人能够收到）
                '3': null, //申请加群被拒绝（只有申请人能够收到）
                '4': null, //被管理员踢出群(只有被踢者接收到)
                '5': null, //群被解散(全员接收)
                '6': null, //创建群(创建者接收)
                '7': null, //邀请加群(被邀请者接收)
                '8': null, //主动退群(主动退出者接收)
                '9': null, //设置管理员(被设置者接收)
                '10': null, //取消管理员(被取消者接收)
                '11': null, //群已被回收(全员接收)
                '15': null, //群已被回收(全员接收)
                '255': null, //用户自定义通知(默认全员接收)
                '12': null //邀请加群(被邀请者需要同意)
            }
            this.onFriendSystemNotifyCallbacks = {
                '1': null, //好友表增加
                '2': null, //好友表删除
                '3': null, //未决增加
                '4': null, //未决删除
                '5': null, //黑名单增加
                '6': null, //黑名单删除
                '7': null, //未决已读上报
                '8': null //好友信息(备注，分组)变更
            }
            this.onProfileSystemNotifyCallbacks = {
                '1': null //资料修改
            }
            //重置普通长轮询参数
            this.onMsgCallback = null
            this.longPollingOn = false
            this.notifySeq = 0 //c2c新消息通知seq
            this.noticeSeq = 0 //group新消息seq

            //重置大群长轮询参数
            this.onBigGroupMsgCallback = null
            this.bigGroupLongPollingOn = false
            this.bigGroupLongPollingStartSeqMap = {}
            this.bigGroupLongPollingKeyMap = {}
            this.bigGroupLongPollingMsgMap = {}

            this.groupSystemMsgsCache = {}

            store.ipList = [] //文件下载地址
            store.authkey = null //文件下载票据
            store.expireTime = null //票据超时时间
        }

        //长轮询
        this.longPolling = (cbOk: any, cbErr: any) => {
            let opts: any = {
                Timeout: store.longPollingDefaultTimeOut / 1000,
                Cookie: {
                    NotifySeq: this.notifySeq,
                    NoticeSeq: this.noticeSeq
                }
            }
            if (store.LongPollingId) {
                opts.Cookie.LongPollingId = store.LongPollingId
                this.doPolling(
                    proto_longPolling,
                    opts,
                    LONG_POLLINNG_EVENT_TYPE,
                    log,
                    ACTION_STATUS,
                    cbErr
                )
            } else {
                proto_getLongPollingId({}, (resp: any) => {
                    store.LongPollingId = opts.Cookie.LongPollingId =
                        resp.LongPollingId
                    //根据回包设置超时时间，超时时长不能>60秒，因为webkit手机端的最长超时时间不能大于60s
                    store.longPollingDefaultTimeOut =
                        resp.Timeout > 60
                            ? store.longPollingDefaultTimeOut
                            : resp.Timeout * 1000
                    this.doPolling(
                        proto_longPolling,
                        opts,
                        LONG_POLLINNG_EVENT_TYPE,
                        log,
                        ACTION_STATUS,
                        cbErr
                    )
                })
            }
        }

        //大群 长轮询
        this.bigGroupLongPolling = (GroupId: any, cbOk: any, cbErr: any) => {
            // if( !GroupId ){
            //     for(let a in bigGroupLongPollingMsgMap){
            //         this.bigGroupLongPolling( a )
            //     }
            //     return;
            // }
            // let GroupId = BigGroupId;
            let opts = {
                USP: 1,
                StartSeq: this.bigGroupLongPollingStartSeqMap[GroupId], //请求拉消息的起始seq
                HoldTime: this.bigGroupLongPollingHoldTime, //客户端长轮询的超时时间，单位是秒
                Key: this.bigGroupLongPollingKeyMap[GroupId] //客户端加入群组后收到的的Key
            }

            proto_bigGroupLongPolling(
                opts,
                (resp: any) => {
                    // if (GroupId != BigGroupId) return;

                    let msgObjList = []
                    this.bigGroupLongPollingStartSeqMap[GroupId] = resp.NextSeq
                    this.bigGroupLongPollingHoldTime = resp.HoldTime
                    this.bigGroupLongPollingKeyMap[GroupId] = resp.Key

                    if (resp.RspMsgList && resp.RspMsgList.length > 0) {
                        let msgCount = 0,
                            msgInfo,
                            event,
                            msg
                        for (let i = resp.RspMsgList.length - 1; i >= 0; i--) {
                            msgInfo = resp.RspMsgList[i]
                            //后台这里做了调整，缩短字段名，以下是兼容代码
                            let keyMap = {
                                F_Account: 'From_Account',
                                T_Account: 'To_Account',
                                FAType: 'EnumFrom_AccountType',
                                TAType: 'EnumTo_AccountType',
                                GCode: 'GroupCode',
                                GName: 'GroupName',
                                GId: 'GroupId',
                                MFlg: 'MsgFlag',
                                FAEInfo: 'MsgFrom_AccountExtraInfo',
                                Evt: 'Event',
                                GInfo: 'GroupInfo',
                                BPlc: 'IsPlaceMsg',
                                MBody: 'MsgBody',
                                Pri: 'MsgPriority',
                                Rdm: 'MsgRandom',
                                MSeq: 'MsgSeq',
                                TStp: 'MsgTimeStamp',
                                TGId: 'ToGroupId',
                                UEInfo: 'UinExtInfo',
                                UId: 'UserId',
                                BSys: 'IsSystemMsg',
                                FAHUrl: 'From_AccountHeadurl',
                                FANick: 'From_AccountNick'
                            }
                            msgInfo = tool.replaceObject(keyMap, msgInfo)
                            //如果是已经删除的消息或者发送者帐号为空或者消息内容为空
                            //IsPlaceMsg=1
                            if (
                                msgInfo.IsPlaceMsg ||
                                !msgInfo.From_Account ||
                                !msgInfo.MsgBody ||
                                msgInfo.MsgBody.length === 0
                            ) {
                                continue
                            }

                            event = msgInfo.Event //群消息类型
                            switch (event) {
                                case LONG_POLLINNG_EVENT_TYPE.GROUP_COMMON: //群普通消息
                                    log.info(
                                        'bigGroupLongPolling: return new group msg'
                                    )
                                    msg = this.handlerGroupMsg(
                                        msgInfo,
                                        false,
                                        false
                                    )
                                    msg && msgObjList.push(msg)
                                    msgCount = msgCount + 1
                                    break
                                case LONG_POLLINNG_EVENT_TYPE.GROUP_TIP: //群提示消息
                                case LONG_POLLINNG_EVENT_TYPE.GROUP_TIP2: //群提示消息
                                    log.info(
                                        'bigGroupLongPolling: return new group tip'
                                    )
                                    msg = this.handlerGroupMsg(
                                        msgInfo,
                                        false,
                                        false
                                    )
                                    msg && msgObjList.push(msg)
                                    //msgCount=msgCount+1;
                                    break
                                case LONG_POLLINNG_EVENT_TYPE.GROUP_SYSTEM: //群系统消息
                                    log.info(
                                        'bigGroupLongPolling: new group system msg'
                                    )
                                    this.handlerGroupSystemMsg(msgInfo)
                                    break
                                default:
                                    log.error(
                                        'bigGroupLongPolling收到未知新消息类型: Event=' +
                                            event
                                    )
                                    break
                            }
                        } // for loop
                        if (msgCount > 0) {
                            this.setBigGroupLongPollingMsgMap(
                                msgInfo.ToGroupId,
                                msgCount
                            ) //
                            log.warn(
                                'current bigGroupLongPollingMsgMap: ' +
                                    JSON.stringify(
                                        this.bigGroupLongPollingMsgMap
                                    )
                            )
                        }
                    }
                    store.curBigGroupLongPollingRetErrorCount = 0
                    //返回连接状态
                    let successInfo = {
                        ActionStatus: ACTION_STATUS.OK,
                        ErrorCode: CONNECTION_STATUS.ON,
                        ErrorInfo: 'connection is ok...'
                    }
                    ConnManager.callBack(successInfo)

                    if (cbOk) cbOk(msgObjList)
                    else if (this.onBigGroupMsgCallback)
                        this.onBigGroupMsgCallback(msgObjList) //返回新消息

                    //重新启动长轮询
                    this.bigGroupLongPollingOn &&
                        this.bigGroupLongPolling(GroupId)
                },
                (err: any) => {
                    if (err.ErrorCode === longPollingPackageTooLargeErrorCode) {
                        this.bigGroupLongPollingStartSeqMap[GroupId] = 0
                    } else if (err.ErrorCode !== longPollingTimeOutErrorCode) {
                        log.error(err.ErrorInfo)
                        //记录长轮询返回错误次数
                        store.curBigGroupLongPollingRetErrorCount++
                    }
                    if (err.ErrorCode === longPollingKickedErrorCode) {
                        //登出
                        log.error('多实例登录，被kick')
                        if (this.onKickedEventCall) {
                            this.onKickedEventCall()
                        }
                    }
                    this.bigGroupLongPollingOn &&
                        this.bigGroupLongPolling(GroupId)
                    //累计超过一定次数，不再发起长轮询请求 - 去掉轮询次数限制的逻辑 SaxonGao
                    // if (curBigGroupLongPollingRetErrorCount < LONG_POLLING_MAX_RET_ERROR_COUNT) {
                    //     bigGroupLongPollingOn && MsgManager.bigGroupLongPolling( GroupId );
                    // } else {
                    //     let errInfo = {
                    //         'ActionStatus': ACTION_STATUS.FAIL,
                    //         'ErrorCode': CONNECTION_STATUS.OFF,
                    //         'ErrorInfo': 'connection is off'
                    //     };
                    //     ConnManager.callBack(errInfo);
                    // }
                    if (cbErr) cbErr(err)
                },
                this.bigGroupLongPollingHoldTime * 1000
            )
        }

        //拉取c2c消息(包含加群未决消息，需要处理)
        this.syncMsgs = (cbOk: any, cbErr: any) => {
            let notifyInfo: any = []
            let msgInfos = []
            //读取C2C消息
            proto_getMsgs(
                MsgStore.cookie,
                MsgStore.syncFlag,
                (resp: any) => {
                    //拉取完毕
                    if (resp.SyncFlag === 2) {
                        MsgStore.syncFlag = 0
                    }
                    //处理c2c消息
                    msgInfos = resp.MsgList //返回的消息列表
                    MsgStore.cookie = resp.Cookie //cookies，记录当前读到的最新消息位置

                    for (let i in msgInfos) {
                        let msgInfo = msgInfos[i]
                        let isSendMsg, id, headUrl
                        if (msgInfo.From_Account === store.ctx.identifier) {
                            //当前用户发送的消息
                            isSendMsg = true
                            id = msgInfo.To_Account //读取接收者信息
                            headUrl = ''
                        } else {
                            //当前用户收到的消息
                            isSendMsg = false
                            id = msgInfo.From_Account //读取发送者信息
                            headUrl = ''
                        }
                        let sess = MsgStore.sessByTypeId(SESSION_TYPE.C2C, id)
                        if (!sess) {
                            sess = new Session(
                                SESSION_TYPE.C2C,
                                id,
                                id,
                                headUrl,
                                0,
                                0
                            )
                        }
                        let msg = new Msg(
                            sess,
                            isSendMsg,
                            msgInfo.MsgSeq,
                            msgInfo.MsgRandom,
                            msgInfo.MsgTimeStamp,
                            msgInfo.From_Account,
                            C2C_MSG_SUB_TYPE.COMMON,
                            msgInfo.From_AccountNick,
                            msgInfo.From_AccountHeadurl
                        )
                        let msgBody = null
                        let msgContent = null
                        let msgType = null
                        for (let mi in msgInfo.MsgBody) {
                            msgBody = msgInfo.MsgBody[mi]
                            msgType = msgBody.MsgType
                            switch (msgType) {
                                case MSG_ELEMENT_TYPE.TEXT:
                                    msgContent = new Msg.Elem.Text(
                                        msgBody.MsgContent.Text
                                    )
                                    break
                                case MSG_ELEMENT_TYPE.FACE:
                                    msgContent = new Msg.Elem.Face(
                                        msgBody.MsgContent.Index,
                                        msgBody.MsgContent.Data
                                    )
                                    break
                                case MSG_ELEMENT_TYPE.IMAGE:
                                    msgContent = new Msg.Elem.Images(
                                        msgBody.MsgContent.UUID,
                                        msgBody.MsgContent.ImageFormat
                                    )
                                    for (let j in msgBody.MsgContent
                                        .ImageInfoArray) {
                                        let tempImg =
                                            msgBody.MsgContent.ImageInfoArray[j]
                                        msgContent.addImage(
                                            new Msg.Elem.Images.Image(
                                                tempImg.Type,
                                                tempImg.Size,
                                                tempImg.Width,
                                                tempImg.Height,
                                                tempImg.URL
                                            )
                                        )
                                    }
                                    break
                                case MSG_ELEMENT_TYPE.SOUND:
                                    // let soundUrl = getSoundDownUrl(msgBody.MsgContent.UUID, msgInfo.From_Account);
                                    if (msgBody.MsgContent) {
                                        msgContent = new Msg.Elem.Sound(
                                            msgBody.MsgContent.UUID,
                                            msgBody.MsgContent.Second,
                                            msgBody.MsgContent.Size,
                                            msgInfo.From_Account,
                                            msgInfo.To_Account,
                                            msgBody.MsgContent.Download_Flag,
                                            SESSION_TYPE.C2C,
                                            msgBody.MsgContent.Url || null
                                        )
                                    } else {
                                        msgType = MSG_ELEMENT_TYPE.TEXT
                                        msgContent = new Msg.Elem.Text(
                                            '[语音消息]下载地址解析出错'
                                        )
                                    }
                                    break
                                case MSG_ELEMENT_TYPE.LOCATION:
                                    msgContent = new Msg.Elem.Location(
                                        msgBody.MsgContent.Longitude,
                                        msgBody.MsgContent.Latitude,
                                        msgBody.MsgContent.Desc
                                    )
                                    break
                                case MSG_ELEMENT_TYPE.FILE:
                                case MSG_ELEMENT_TYPE.FILE + ' ':
                                    msgType = MSG_ELEMENT_TYPE.FILE
                                    // let fileUrl = getFileDownUrl(msgBody.MsgContent.UUID, msgInfo.From_Account, msgBody.MsgContent.FileName);
                                    if (msgBody.MsgContent) {
                                        msgContent = new Msg.Elem.File(
                                            msgBody.MsgContent.UUID,
                                            msgBody.MsgContent.FileName,
                                            msgBody.MsgContent.FileSize,
                                            msgInfo.From_Account,
                                            msgInfo.To_Account,
                                            msgBody.MsgContent.Download_Flag,
                                            SESSION_TYPE.C2C,
                                            msgBody.MsgContent.Url
                                                ? msgBody.MsgContent.Url
                                                : null
                                        )
                                    } else {
                                        msgType = MSG_ELEMENT_TYPE.TEXT
                                        msgContent = new Msg.Elem.Text(
                                            '[文件消息下载地址解析出错]'
                                        )
                                    }
                                    break
                                case MSG_ELEMENT_TYPE.CUSTOM:
                                    try {
                                        let data = JSON.parse(
                                            msgBody.MsgContent.Data
                                        )
                                        if (
                                            data &&
                                            data.userAction &&
                                            data.userAction ===
                                                FRIEND_WRITE_MSG_ACTION.ING
                                        ) {
                                            //过滤安卓或ios的正在输入自定义消息
                                            continue
                                        }
                                    } catch (e) {}

                                    msgType = MSG_ELEMENT_TYPE.CUSTOM
                                    msgContent = new Msg.Elem.Custom(
                                        msgBody.MsgContent.Data,
                                        msgBody.MsgContent.Desc,
                                        msgBody.MsgContent.Ext
                                    )
                                    break
                                default:
                                    msgType = MSG_ELEMENT_TYPE.TEXT
                                    msgContent = new Msg.Elem.Text(
                                        'web端暂不支持' +
                                            msgBody.MsgType +
                                            '消息'
                                    )
                                    break
                            }
                            msg.elems.push(new Msg.Elem(msgType, msgContent))
                        }

                        if (
                            msg.elems.length > 0 &&
                            MsgStore.addMsg(msg, true)
                        ) {
                            notifyInfo.push(msg)
                        }
                    } // for loop

                    //处理加群未决申请消息
                    this.handlerApplyJoinGroupSystemMsgs(resp.EventArray)

                    if (notifyInfo.length > 0) MsgStore.updateTimeline()
                    if (cbOk) cbOk(notifyInfo)
                    else if (notifyInfo.length > 0) {
                        if (this.onMsgCallback) this.onMsgCallback(notifyInfo)
                    }
                },
                (err: any) => {
                    log.error('getMsgs failed:' + err.ErrorInfo)
                    if (cbErr) cbErr(err)
                }
            )
        }

        //拉取C2C漫游消息
        this.getC2CHistoryMsgs = (options: any, cbOk: any, cbErr: any) => {
            if (!options.Peer_Account) {
                if (cbErr) {
                    cbErr(tool.getReturnError('Peer_Account is empty', -13))
                    return
                }
            }
            if (!options.MaxCnt) {
                options.MaxCnt = 15
            }
            if (options.MaxCnt <= 0) {
                if (cbErr) {
                    cbErr(
                        tool.getReturnError(
                            'MaxCnt should be greater than 0',
                            -14
                        )
                    )
                    return
                }
            }
            if (options.MaxCnt > 15) {
                if (cbErr) {
                    cbErr(
                        tool.getReturnError(
                            'MaxCnt can not be greater than 15',
                            -15
                        )
                    )
                    return
                }
                return
            }
            if (options.MsgKey === null || options.MsgKey === undefined) {
                options.MsgKey = ''
            }
            let opts = {
                Peer_Account: options.Peer_Account,
                MaxCnt: options.MaxCnt,
                LastMsgTime: options.LastMsgTime,
                MsgKey: options.MsgKey
            }
            //读取c2c漫游消息
            proto_getC2CHistoryMsgs(
                opts,
                (resp: any) => {
                    let msgObjList = []
                    let msgInfos = []
                    //处理c2c消息
                    msgInfos = resp.MsgList //返回的消息列表
                    let sess = MsgStore.sessByTypeId(
                        SESSION_TYPE.C2C,
                        options.Peer_Account
                    )
                    if (!sess) {
                        sess = new Session(
                            SESSION_TYPE.C2C,
                            options.Peer_Account,
                            options.Peer_Account,
                            '',
                            0,
                            0
                        )
                    }
                    for (let i in msgInfos) {
                        let msgInfo = msgInfos[i]
                        let isSendMsg, id
                        let headUrl = msgInfo.From_AccountHeadurl || ''
                        if (msgInfo.From_Account === store.ctx.identifier) {
                            //当前用户发送的消息
                            isSendMsg = true
                            id = msgInfo.To_Account //读取接收者信息
                        } else {
                            //当前用户收到的消息
                            isSendMsg = false
                            id = msgInfo.From_Account //读取发送者信息
                        }
                        let msg = new Msg(
                            sess,
                            isSendMsg,
                            msgInfo.MsgSeq,
                            msgInfo.MsgRandom,
                            msgInfo.MsgTimeStamp,
                            msgInfo.From_Account,
                            C2C_MSG_SUB_TYPE.COMMON,
                            msgInfo.From_AccountNick,
                            headUrl
                        )
                        let msgBody = null
                        let msgContent = null
                        let msgType = null
                        for (let mi in msgInfo.MsgBody) {
                            msgBody = msgInfo.MsgBody[mi]
                            msgType = msgBody.MsgType
                            switch (msgType) {
                                case MSG_ELEMENT_TYPE.TEXT:
                                    msgContent = new Msg.Elem.Text(
                                        msgBody.MsgContent.Text
                                    )
                                    break
                                case MSG_ELEMENT_TYPE.FACE:
                                    msgContent = new Msg.Elem.Face(
                                        msgBody.MsgContent.Index,
                                        msgBody.MsgContent.Data
                                    )
                                    break
                                case MSG_ELEMENT_TYPE.IMAGE:
                                    msgContent = new Msg.Elem.Images(
                                        msgBody.MsgContent.UUID,
                                        msgBody.MsgContent.ImageFormat
                                    )
                                    for (let j in msgBody.MsgContent
                                        .ImageInfoArray) {
                                        let tempImg =
                                            msgBody.MsgContent.ImageInfoArray[j]
                                        msgContent.addImage(
                                            new Msg.Elem.Images.Image(
                                                tempImg.Type,
                                                tempImg.Size,
                                                tempImg.Width,
                                                tempImg.Height,
                                                tempImg.URL
                                            )
                                        )
                                    }
                                    break
                                case MSG_ELEMENT_TYPE.SOUND:
                                    // let soundUrl = getSoundDownUrl(msgBody.MsgContent.UUID, msgInfo.From_Account);

                                    if (msgBody.MsgContent) {
                                        msgContent = new Msg.Elem.Sound(
                                            msgBody.MsgContent.UUID,
                                            msgBody.MsgContent.Second,
                                            msgBody.MsgContent.Size,
                                            msgInfo.From_Account,
                                            msgInfo.To_Account,
                                            msgBody.MsgContent.Download_Flag,
                                            SESSION_TYPE.C2C,
                                            msgBody.MsgContent.Url || null
                                        )
                                    } else {
                                        msgType = MSG_ELEMENT_TYPE.TEXT
                                        msgContent = new Msg.Elem.Text(
                                            '[语音消息]下载地址解析出错'
                                        )
                                    }
                                    break
                                case MSG_ELEMENT_TYPE.LOCATION:
                                    msgContent = new Msg.Elem.Location(
                                        msgBody.MsgContent.Longitude,
                                        msgBody.MsgContent.Latitude,
                                        msgBody.MsgContent.Desc
                                    )
                                    break
                                case MSG_ELEMENT_TYPE.FILE:
                                case MSG_ELEMENT_TYPE.FILE + ' ':
                                    msgType = MSG_ELEMENT_TYPE.FILE
                                    // let fileUrl = getFileDownUrl(msgBody.MsgContent.UUID, msgInfo.From_Account, msgBody.MsgContent.FileName);

                                    if (msgBody.MsgContent) {
                                        msgContent = new Msg.Elem.File(
                                            msgBody.MsgContent.UUID,
                                            msgBody.MsgContent.FileName,
                                            msgBody.MsgContent.FileSize,
                                            msgInfo.From_Account,
                                            msgInfo.To_Account,
                                            msgBody.MsgContent.Download_Flag,
                                            SESSION_TYPE.C2C,
                                            msgBody.MsgContent.Url || null
                                        )
                                    } else {
                                        msgType = MSG_ELEMENT_TYPE.TEXT
                                        msgContent = new Msg.Elem.Text(
                                            '[文件消息下载地址解析出错]'
                                        )
                                    }
                                    break
                                case MSG_ELEMENT_TYPE.CUSTOM:
                                    msgType = MSG_ELEMENT_TYPE.CUSTOM
                                    msgContent = new Msg.Elem.Custom(
                                        msgBody.MsgContent.Data,
                                        msgBody.MsgContent.Desc,
                                        msgBody.MsgContent.Ext
                                    )

                                    break
                                default:
                                    msgType = MSG_ELEMENT_TYPE.TEXT
                                    msgContent = new Msg.Elem.Text(
                                        'web端暂不支持' +
                                            msgBody.MsgType +
                                            '消息'
                                    )
                                    break
                            }
                            msg.elems.push(new Msg.Elem(msgType, msgContent))
                        }
                        MsgStore.addMsg(msg)
                        msgObjList.push(msg)
                    } // for loop

                    MsgStore.updateTimeline()
                    if (cbOk) {
                        let newResp = {
                            Complete: resp.Complete,
                            MsgCount: msgObjList.length,
                            LastMsgTime: resp.LastMsgTime,
                            MsgKey: resp.MsgKey,
                            MsgList: msgObjList
                        }
                        sess.isFinished(resp.Complete)
                        cbOk(newResp)
                    }
                },
                (err: any) => {
                    log.error('getC2CHistoryMsgs failed:' + err.ErrorInfo)
                    if (cbErr) cbErr(err)
                }
            )
        }

        //拉群历史消息
        //不传cbOk 和 cbErr，则会调用新消息回调函数
        this.syncGroupMsgs = (options: any, cbOk: any, cbErr: any) => {
            if (options.ReqMsgSeq <= 0) {
                if (cbErr) {
                    let errInfo = 'ReqMsgSeq must be greater than 0'
                    let error = tool.getReturnError(errInfo, -16)
                    cbErr(error)
                }
                return
            }
            let opts = {
                GroupId: options.GroupId,
                ReqMsgSeq: options.ReqMsgSeq,
                ReqMsgNumber: options.ReqMsgNumber
            }
            //读群漫游消息
            proto_getGroupMsgs(
                opts,
                (resp: any) => {
                    let notifyInfo = []
                    let group_id = resp.GroupId //返回的群id
                    let msgInfos = resp.RspMsgList //返回的消息列表
                    let isFinished = resp.IsFinished

                    if (msgInfos === null || msgInfos === undefined) {
                        if (cbOk) {
                            cbOk([])
                        }
                        return
                    }
                    for (let i = msgInfos.length - 1; i >= 0; i--) {
                        let msgInfo = msgInfos[i]
                        //如果是已经删除的消息或者发送者帐号为空或者消息内容为空
                        //IsPlaceMsg=1
                        if (
                            msgInfo.IsPlaceMsg ||
                            !msgInfo.From_Account ||
                            !msgInfo.MsgBody ||
                            msgInfo.MsgBody.length === 0
                        ) {
                            continue
                        }
                        let msg = this.handlerGroupMsg(
                            msgInfo,
                            true,
                            true,
                            isFinished
                        )
                        if (msg) {
                            notifyInfo.push(msg)
                        }
                    } // for loop
                    if (notifyInfo.length > 0) MsgStore.updateTimeline()
                    if (cbOk) cbOk(notifyInfo)
                    else if (notifyInfo.length > 0) {
                        if (this.onMsgCallback) this.onMsgCallback(notifyInfo)
                    }
                },
                (err: any) => {
                    log.error('getGroupMsgs failed:' + err.ErrorInfo)
                    if (cbErr) cbErr(err)
                }
            )
        }

        //初始化
        this.init = (listeners: any, cbOk: any, cbErr: any) => {
            if (!listeners.onMsgNotify) {
                log.warn('listeners.onMsgNotify is empty')
            }
            this.onMsgCallback = listeners.onMsgNotify

            if (listeners.onBigGroupMsgNotify) {
                this.onBigGroupMsgCallback = listeners.onBigGroupMsgNotify
            } else {
                log.warn('listeners.onBigGroupMsgNotify is empty')
            }

            if (listeners.onC2cEventNotifys) {
                this.onC2cEventCallbacks = listeners.onC2cEventNotifys
            } else {
                log.warn('listeners.onC2cEventNotifys is empty')
            }
            if (listeners.onGroupSystemNotifys) {
                this.onGroupSystemNotifyCallbacks =
                    listeners.onGroupSystemNotifys
            } else {
                log.warn('listeners.onGroupSystemNotifys is empty')
            }
            if (listeners.onGroupInfoChangeNotify) {
                this.onGroupInfoChangeCallback =
                    listeners.onGroupInfoChangeNotify
            } else {
                log.warn('listeners.onGroupInfoChangeNotify is empty')
            }
            if (listeners.onFriendSystemNotifys) {
                this.onFriendSystemNotifyCallbacks =
                    listeners.onFriendSystemNotifys
            } else {
                log.warn('listeners.onFriendSystemNotifys is empty')
            }
            if (listeners.onProfileSystemNotifys) {
                this.onProfileSystemNotifyCallbacks =
                    listeners.onProfileSystemNotifys
            } else {
                log.warn('listeners.onProfileSystemNotifys is empty')
            }
            if (listeners.onKickedEventCall) {
                this.onKickedEventCall = listeners.onKickedEventCall
            } else {
                log.warn('listeners.onKickedEventCall is empty')
            }
            if (listeners.onLongPullingNotify) {
                store.onLongPullingNotify = listeners.onLongPullingNotify
            } else {
                log.warn('listeners.onKickedEventCall is empty')
            }

            if (listeners.onAppliedDownloadUrl) {
                store.onAppliedDownloadUrl = listeners.onAppliedDownloadUrl
            } else {
                log.warn('listeners.onAppliedDownloadUrl is empty')
            }

            if (!store.ctx.identifier || !store.ctx.userSig) {
                if (cbOk) {
                    let success = {
                        ActionStatus: ACTION_STATUS.OK,
                        ErrorCode: 0,
                        ErrorInfo: 'login success(no login state)'
                    }
                    cbOk(success)
                }
                return
            }

            //初始化
            this.initMyGroupMaxSeqs((resp: any) => {
                log.info('initMyGroupMaxSeqs success')
                //初始化文件
                this.initIpAndAuthkey((initIpAndAuthkeyResp: any) => {
                    log.info('initIpAndAuthkey success')
                    if (cbOk) {
                        log.info('login success(have login state))')
                        let success = {
                            ActionStatus: ACTION_STATUS.OK,
                            ErrorCode: 0,
                            ErrorInfo: 'login success'
                        }
                        cbOk(success)
                    }
                    this.setLongPollingOn(true) //开启长轮询
                    this.longPollingOn && this.longPolling(cbOk)
                }, cbErr)
            }, cbErr)
        }

        //发消息（私聊或群聊）
        this.sendMsg = (msg: any, cbOk: any, cbErr: any) => {
            proto_sendMsg(
                msg,
                (resp: any) => {
                    //私聊时，加入自己的发的消息，群聊时，由于seq和服务器的seq不一样，所以不作处理
                    if (msg.sess.type() === SESSION_TYPE.C2C) {
                        if (!MsgStore.addMsg(msg)) {
                            let errInfo = 'sendMsg: addMsg failed!'
                            let error = tool.getReturnError(errInfo, -17)
                            log.error(errInfo)
                            if (cbErr) cbErr(error)
                            return
                        }
                        //更新信息流时间
                        MsgStore.updateTimeline()
                    }
                    if (cbOk) cbOk(resp)
                },
                (err: any) => {
                    if (cbErr) cbErr(err)
                }
            )
        }

        //处理新的好友系统通知
        //isNeedValidRepeatMsg 是否需要判重
        this.handlerFriendSystemNotices = (
            friendSystemNotices: any,
            isNeedValidRepeatMsg: any
        ) => {
            let friendNotice, type, notify: any
            for (let k in friendSystemNotices) {
                friendNotice = friendSystemNotices[k]
                type = friendNotice.PushType
                //当长轮询返回的群系统消息，才需要更新通知seq
                if (
                    isNeedValidRepeatMsg === false &&
                    friendNotice.NoticeSeq &&
                    friendNotice.NoticeSeq > this.noticeSeq
                ) {
                    this.noticeSeq = friendNotice.NoticeSeq
                }
                notify = {
                    Type: type
                }
                switch (type) {
                    case FRIEND_NOTICE_TYPE.FRIEND_ADD: //好友表增加
                        notify['Accounts'] = friendNotice.FriendAdd_Account
                        break
                    case FRIEND_NOTICE_TYPE.FRIEND_DELETE: //好友表删除
                        notify['Accounts'] = friendNotice.FriendDel_Account
                        break
                    case FRIEND_NOTICE_TYPE.PENDENCY_ADD: //未决增加
                        notify['PendencyList'] = friendNotice.PendencyAdd
                        break
                    case FRIEND_NOTICE_TYPE.PENDENCY_DELETE: //未决删除
                        notify['Accounts'] = friendNotice.FrienPencydDel_Account
                        break
                    case FRIEND_NOTICE_TYPE.BLACK_LIST_ADD: //黑名单增加
                        notify['Accounts'] = friendNotice.BlackListAdd_Account
                        break
                    case FRIEND_NOTICE_TYPE.BLACK_LIST_DELETE: //黑名单删除
                        notify['Accounts'] = friendNotice.BlackListDel_Account
                        break
                    /*case FRIEND_NOTICE_TYPE.PENDENCY_REPORT://未决已读上报

             break;
             case FRIEND_NOTICE_TYPE.FRIEND_UPDATE://好友数据更新

             break;
             */
                    default:
                        log.error(
                            '未知好友系统通知类型：friendNotice=' +
                                JSON.stringify(friendNotice)
                        )
                        break
                }

                if (isNeedValidRepeatMsg) {
                    if (type === FRIEND_NOTICE_TYPE.PENDENCY_ADD) {
                        //回调
                        if (this.onFriendSystemNotifyCallbacks[type])
                            this.onFriendSystemNotifyCallbacks[type](notify)
                    }
                } else {
                    //回调
                    if (this.onFriendSystemNotifyCallbacks[type])
                        this.onFriendSystemNotifyCallbacks[type](notify)
                }
            } //loop
        }

        //处理新的资料系统通知
        //isNeedValidRepeatMsg 是否需要判重
        this.handlerProfileSystemNotices = (
            profileSystemNotices: any,
            isNeedValidRepeatMsg: any
        ) => {
            let profileNotice, type, notify: any
            for (let k in profileSystemNotices) {
                profileNotice = profileSystemNotices[k]
                type = profileNotice.PushType
                //当长轮询返回的群系统消息，才需要更新通知seq
                if (
                    isNeedValidRepeatMsg === false &&
                    profileNotice.NoticeSeq &&
                    profileNotice.NoticeSeq > this.noticeSeq
                ) {
                    this.noticeSeq = profileNotice.NoticeSeq
                }
                notify = {
                    Type: type
                }
                switch (type) {
                    case PROFILE_NOTICE_TYPE.PROFILE_MODIFY: //资料修改
                        notify['Profile_Account'] =
                            profileNotice.Profile_Account
                        notify['ProfileList'] = profileNotice.ProfileList
                        break
                    default:
                        log.error(
                            '未知资料系统通知类型：profileNotice=' +
                                JSON.stringify(profileNotice)
                        )
                        break
                }

                if (isNeedValidRepeatMsg) {
                    if (type === PROFILE_NOTICE_TYPE.PROFILE_MODIFY) {
                        //回调
                        if (this.onProfileSystemNotifyCallbacks[type])
                            this.onProfileSystemNotifyCallbacks[type](notify)
                    }
                } else {
                    //回调
                    if (this.onProfileSystemNotifyCallbacks[type])
                        this.onProfileSystemNotifyCallbacks[type](notify)
                }
            } //loop
        }

        //处理新的群系统消息(用于直播大群长轮询)
        this.handlerGroupSystemMsg = (groupTip: any) => {
            let groupReportTypeMsg = groupTip.MsgBody
            let reportType = groupReportTypeMsg.ReportType
            let toAccount = groupTip.GroupInfo.To_Account
            //过滤本不应该给自己的系统消息
            //if(!toAccount || toAccount!=store.ctx.identifier){
            //    log.error("收到本不应该给自己的系统消息: To_Account="+toAccount);
            //    continue;
            //}
            let notify: any = {
                SrcFlag: 1,
                ReportType: reportType,
                GroupId: groupTip.ToGroupId,
                GroupName: groupTip.GroupInfo.GroupName,
                Operator_Account: groupReportTypeMsg.Operator_Account,
                MsgTime: groupTip.MsgTimeStamp
            }
            switch (reportType) {
                case GROUP_SYSTEM_TYPE.JOIN_GROUP_REQUEST: //申请加群(只有管理员会接收到)
                    notify['RemarkInfo'] = groupReportTypeMsg.RemarkInfo
                    notify['MsgKey'] = groupReportTypeMsg.MsgKey
                    notify['Authentication'] = groupReportTypeMsg.Authentication
                    notify['UserDefinedField'] = groupTip.UserDefinedField
                    notify['From_Account'] = groupTip.From_Account
                    notify['MsgSeq'] = groupTip.ClientSeq
                    notify['MsgRandom'] = groupTip.MsgRandom
                    break
                case GROUP_SYSTEM_TYPE.JOIN_GROUP_ACCEPT: //申请加群被同意(只有申请人自己接收到)
                case GROUP_SYSTEM_TYPE.JOIN_GROUP_REFUSE: //申请加群被拒绝(只有申请人自己接收到)
                    notify['RemarkInfo'] = groupReportTypeMsg.RemarkInfo
                    break
                case GROUP_SYSTEM_TYPE.KICK: //被管理员踢出群(只有被踢者接收到)
                case GROUP_SYSTEM_TYPE.DESTORY: //群被解散(全员接收)
                case GROUP_SYSTEM_TYPE.CREATE: //创建群(创建者接收, 不展示)
                case GROUP_SYSTEM_TYPE.INVITED_JOIN_GROUP_REQUEST: //邀请加群(被邀请者接收)
                case GROUP_SYSTEM_TYPE.INVITED_JOIN_GROUP_REQUEST_AGREE: //邀请加群(被邀请者需要同意)
                case GROUP_SYSTEM_TYPE.QUIT: //主动退群(主动退出者接收, 不展示)
                case GROUP_SYSTEM_TYPE.SET_ADMIN: //群设置管理员(被设置者接收)
                case GROUP_SYSTEM_TYPE.CANCEL_ADMIN: //取消管理员(被取消者接收)
                case GROUP_SYSTEM_TYPE.REVOKE: //群已被回收(全员接收, 不展示)
                    break
                case GROUP_SYSTEM_TYPE.CUSTOM: //用户自定义通知(默认全员接收)
                    notify['MsgSeq'] = groupTip.MsgSeq
                    notify['UserDefinedField'] =
                        groupReportTypeMsg.UserDefinedField
                    break
                default:
                    log.error('未知群系统消息类型：reportType=' + reportType)
                    break
            }
            //回调
            if (this.onGroupSystemNotifyCallbacks[reportType])
                this.onGroupSystemNotifyCallbacks[reportType](notify)
        }

        //处理C2C EVENT 消息通道Array
        this.handlerC2cNotifyMsgArray = (arr: any) => {
            for (let i = 0, l = arr.length; i < l; i++) {
                this.handlerC2cEventMsg(arr[i])
            }
        }

        //处理C2C EVENT 消息通道Item
        /* 
        {
            "ActionStatus": "OK",
            "ErrorInfo": "",
            "ErrorCode": 0,
            "EventArray": [{
                "Event": 10,
                "C2cNotifyMsgArray": [{
                    "SubMsgType": 96,
                    "NoticeSeq": 2,
                    "KickoutMsgNotify": {
                        "To_Account": "22",
                        "SdkAppid": 1400111560,
                        "Instid": 537042377
                    }
                }]
            }],
            "NextTimeOut": 5
        }
    */
        this.handlerC2cEventMsg = (notify: any) => {
            let subType = notify.SubMsgType
            switch (subType) {
                case C2C_EVENT_SUB_TYPE.READED:
                    log.warn('C2C已读消息通知')
                    if (
                        notify.ReadC2cMsgNotify &&
                        notify.ReadC2cMsgNotify.UinPairReadArray &&
                        this.onC2cEventCallbacks[subType]
                    ) {
                        for (
                            let i = 0,
                                l =
                                    notify.ReadC2cMsgNotify.UinPairReadArray
                                        .length;
                            i < l;
                            i++
                        ) {
                            let item =
                                notify.ReadC2cMsgNotify.UinPairReadArray[i]
                            this.onC2cEventCallbacks[subType](item)
                        }
                    }
                    break
                case C2C_EVENT_SUB_TYPE.KICKEDOUT:
                    log.warn('多终端互踢通知')
                    proto_logout('instance')
                    if (this.onC2cEventCallbacks[subType]) {
                        this.onC2cEventCallbacks[subType]()
                    }
                    break
                default:
                    log.error('未知C2c系统消息：subType=' + subType)
                    break
            }
        }

        //初始化文件下载ip和票据
        this.initIpAndAuthkey = (cbOk: any, cbErr: any) => {
            proto_getIpAndAuthkey(
                (resp: any) => {
                    store.ipList = resp.IpList
                    store.authkey = resp.AuthKey
                    store.expireTime = resp.ExpireTime
                    if (cbOk) cbOk(resp)
                },
                (err: any) => {
                    log.error('initIpAndAuthkey failed:' + err.ErrorInfo)
                    if (cbErr) cbErr(err)
                }
            )
        }

        //初始化我的群当前最大的seq，用于补拉丢失的群消息
        this.initMyGroupMaxSeqs = (cbOk: any, cbErr: any) => {
            let opts = {
                Member_Account: store.ctx.identifier,
                Limit: 1000,
                Offset: 0,
                GroupBaseInfoFilter: ['NextMsgSeq']
            }
            proto_getJoinedGroupListHigh(
                opts,
                (resp: any) => {
                    if (!resp.GroupIdList || resp.GroupIdList.length === 0) {
                        log.info('initMyGroupMaxSeqs: 目前还没有加入任何群组')
                        if (cbOk) cbOk(resp)
                        return
                    }
                    for (let i = 0; i < resp.GroupIdList.length; i++) {
                        let group_id = resp.GroupIdList[i].GroupId
                        let curMaxSeq = resp.GroupIdList[i].NextMsgSeq - 1
                        this.myGroupMaxSeqs[group_id] = curMaxSeq
                    }

                    if (cbOk) cbOk(resp)
                },
                (err: any) => {
                    log.error('initMyGroupMaxSeqs failed:' + err.ErrorInfo)
                    if (cbErr) cbErr(err)
                }
            )
        }

        //补拉群消息
        this.getLostGroupMsgs = (
            groupId: any,
            reqMsgSeq: any,
            reqMsgNumber: any
        ) => {
            this.getLostGroupMsgCount++
            //发起一个拉群群消息请求
            let tempOpts = {
                GroupId: groupId,
                ReqMsgSeq: reqMsgSeq,
                ReqMsgNumber: reqMsgNumber
            }
            //发起一个拉群群消息请求
            log.warn(
                '第' +
                    this.getLostGroupMsgCount +
                    '次补齐群消息,参数=' +
                    JSON.stringify(tempOpts)
            )
            this.syncGroupMsgs(tempOpts)
        }

        //更新群当前最大消息seq
        this.updateMyGroupCurMaxSeq = (groupId: any, msgSeq: any) => {
            //更新myGroupMaxSeqs中的群最大seq
            let curMsgSeq = this.myGroupMaxSeqs[groupId]
            if (curMsgSeq) {
                //如果存在，比较大小
                if (msgSeq > curMsgSeq) {
                    this.myGroupMaxSeqs[groupId] = msgSeq
                }
            } else {
                //不存在，新增
                this.myGroupMaxSeqs[groupId] = msgSeq
            }
        }

        //添加群消息列表
        this.addGroupMsgList = (msgs: any, new_group_msgs: any) => {
            for (let p in msgs) {
                let newGroupMsg = msgs[p]
                //发群消息时，长轮询接口会返回用户自己发的群消息
                //if(newGroupMsg.From_Account && newGroupMsg.From_Account!=store.ctx.identifier ){
                if (newGroupMsg.From_Account) {
                    //false-不是主动拉取的历史消息
                    //true-需要保存到sdk本地session,并且需要判重
                    let msg = this.handlerGroupMsg(newGroupMsg, false, true)
                    if (msg) {
                        //不为空，加到新消息里
                        new_group_msgs.push(msg)
                    }
                    //更新myGroupMaxSeqs中的群最大seq
                    this.updateMyGroupCurMaxSeq(
                        newGroupMsg.ToGroupId,
                        newGroupMsg.MsgSeq
                    )
                }
            }
            return new_group_msgs
        }

        //处理收到的群普通和提示消息
        this.handlerOrdinaryAndTipC2cMsgs = (
            eventType: any,
            groupMsgArray: any
        ) => {
            let groupMsgMap: any = {} //保存收到的C2c消息信息（群号，最小，最大消息seq，消息列表）
            let new_group_msgs: any = []
            let minGroupMsgSeq = 99999999
            let maxGroupMsgSeq = -1
            for (let j in groupMsgArray) {
                let groupMsgs = groupMsgMap[groupMsgArray[j].ToGroupId]
                if (!groupMsgs) {
                    groupMsgs = groupMsgMap[groupMsgArray[j].ToGroupId] = {
                        min: minGroupMsgSeq, //收到新消息最小seq
                        max: maxGroupMsgSeq, //收到新消息最大seq
                        msgs: [] //收到的新消息
                    }
                }
                //更新长轮询的群NoticeSeq
                if (groupMsgArray[j].NoticeSeq > this.noticeSeq) {
                    log.warn(
                        'noticeSeq=' +
                            this.noticeSeq +
                            ',msgNoticeSeq=' +
                            groupMsgArray[j].NoticeSeq
                    )
                    this.noticeSeq = groupMsgArray[j].NoticeSeq
                }
                groupMsgArray[j].Event = eventType
                groupMsgMap[groupMsgArray[j].ToGroupId].msgs.push(
                    groupMsgArray[j]
                ) //新增一条消息
                if (groupMsgArray[j].MsgSeq < groupMsgs.min) {
                    //记录最小的消息seq
                    groupMsgMap[groupMsgArray[j].ToGroupId].min =
                        groupMsgArray[j].MsgSeq
                }
                if (groupMsgArray[j].MsgSeq > groupMsgs.max) {
                    //记录最大的消息seq
                    groupMsgMap[groupMsgArray[j].ToGroupId].max =
                        groupMsgArray[j].MsgSeq
                }
            }

            for (let groupId in groupMsgMap) {
                new_group_msgs = this.addGroupMsgList(
                    groupMsgMap[groupId].msgs,
                    new_group_msgs
                )
            }
            if (new_group_msgs.length) {
                MsgStore.updateTimeline()
            }
            if (this.onMsgCallback && new_group_msgs.length)
                this.onMsgCallback(new_group_msgs)
        }

        //处理收到的群普通和提示消息
        this.handlerOrdinaryAndTipGroupMsgs = (
            eventType: any,
            groupMsgArray: any
        ) => {
            let groupMsgMap: any = {} //保存收到的群消息信息（群号，最小，最大消息seq，消息列表）
            let new_group_msgs: any = []
            let minGroupMsgSeq = 99999999
            let maxGroupMsgSeq = -1
            for (let j in groupMsgArray) {
                let groupMsgs = groupMsgMap[groupMsgArray[j].ToGroupId]
                if (!groupMsgs) {
                    groupMsgs = groupMsgMap[groupMsgArray[j].ToGroupId] = {
                        min: minGroupMsgSeq, //收到新消息最小seq
                        max: maxGroupMsgSeq, //收到新消息最大seq
                        msgs: [] //收到的新消息
                    }
                }
                //更新长轮询的群NoticeSeq
                if (groupMsgArray[j].NoticeSeq > this.noticeSeq) {
                    log.warn(
                        'noticeSeq=' +
                            this.noticeSeq +
                            ',msgNoticeSeq=' +
                            groupMsgArray[j].NoticeSeq
                    )
                    this.noticeSeq = groupMsgArray[j].NoticeSeq
                }
                groupMsgArray[j].Event = eventType
                groupMsgMap[groupMsgArray[j].ToGroupId].msgs.push(
                    groupMsgArray[j]
                ) //新增一条消息
                if (groupMsgArray[j].MsgSeq < groupMsgs.min) {
                    //记录最小的消息seq
                    groupMsgMap[groupMsgArray[j].ToGroupId].min =
                        groupMsgArray[j].MsgSeq
                }
                if (groupMsgArray[j].MsgSeq > groupMsgs.max) {
                    //记录最大的消息seq
                    groupMsgMap[groupMsgArray[j].ToGroupId].max =
                        groupMsgArray[j].MsgSeq
                }
            }

            for (let groupId in groupMsgMap) {
                new_group_msgs = this.addGroupMsgList(
                    groupMsgMap[groupId].msgs,
                    new_group_msgs
                )
            }
            if (new_group_msgs.length) {
                MsgStore.updateTimeline()
            }
            if (this.onMsgCallback && new_group_msgs.length)
                this.onMsgCallback(new_group_msgs)
        }

        //处理新的群提示消息
        this.handlerGroupTips = (groupTips: any) => {
            let new_group_msgs = []
            for (let o in groupTips) {
                let groupTip = groupTips[o]
                //添加event字段
                groupTip.Event = LONG_POLLINNG_EVENT_TYPE.GROUP_TIP
                //更新群消息通知seq
                if (groupTip.NoticeSeq > this.noticeSeq) {
                    this.noticeSeq = groupTip.NoticeSeq
                }
                let msg = this.handlerGroupMsg(groupTip, false, true)
                if (msg) {
                    new_group_msgs.push(msg)
                }
            }
            if (new_group_msgs.length) {
                MsgStore.updateTimeline()
            }
            if (this.onMsgCallback && new_group_msgs.length)
                this.onMsgCallback(new_group_msgs)
        }

        //处理新的群系统消息
        //isNeedValidRepeatMsg 是否需要判重
        this.handlerGroupSystemMsgs = (
            groupSystemMsgs: any,
            isNeedValidRepeatMsg: any
        ) => {
            for (let k in groupSystemMsgs) {
                let groupTip = groupSystemMsgs[k]
                let groupReportTypeMsg = groupTip.MsgBody
                let reportType = groupReportTypeMsg.ReportType
                //当长轮询返回的群系统消息，才需要更新群消息通知seq
                if (
                    isNeedValidRepeatMsg === false &&
                    groupTip.NoticeSeq &&
                    groupTip.NoticeSeq > this.noticeSeq
                ) {
                    this.noticeSeq = groupTip.NoticeSeq
                }
                let toAccount = groupTip.GroupInfo.To_Account
                //过滤本不应该给自己的系统消息
                /*if (!toAccount || toAccount != store.ctx.identifier) {
             log.error("收到本不应该给自己的系统消息: To_Account=" + toAccount);
             continue;
             }*/
                if (isNeedValidRepeatMsg) {
                    //let key=groupTip.ToGroupId+"_"+reportType+"_"+groupTip.MsgTimeStamp+"_"+groupReportTypeMsg.Operator_Account;
                    let key =
                        groupTip.ToGroupId +
                        '_' +
                        reportType +
                        '_' +
                        groupReportTypeMsg.Operator_Account +
                        '_' +
                        groupTip.ClientSeq
                    let isExist = this.groupSystemMsgsCache[key]
                    if (isExist) {
                        log.warn('收到重复的群系统消息：key=' + key)
                        continue
                    }
                    this.groupSystemMsgsCache[key] = true
                }

                let notify: any = {
                    SrcFlag: 0,
                    ReportType: reportType,
                    GroupId: groupTip.ToGroupId,
                    GroupName: groupTip.GroupInfo.GroupName,
                    Operator_Account: groupReportTypeMsg.Operator_Account,
                    MsgTime: groupTip.MsgTimeStamp,
                    groupReportTypeMsg: groupReportTypeMsg,
                    MsgSeq: groupTip.ClientSeq, //群系统消息的 ClientSeq 才是可用的，如删除群系统消息的接口 (deleteMsg) 中传的 MsgSeq 参数即 ClientSeq
                    MsgRandom: groupTip.MsgRandom,
                    sourceGroupTip: groupTip
                }
                switch (reportType) {
                    case GROUP_SYSTEM_TYPE.JOIN_GROUP_REQUEST: //申请加群(只有管理员会接收到)
                        notify['RemarkInfo'] = groupReportTypeMsg.RemarkInfo
                        notify['MsgKey'] = groupReportTypeMsg.MsgKey
                        notify['Authentication'] =
                            groupReportTypeMsg.Authentication
                        notify['UserDefinedField'] = groupTip.UserDefinedField
                        notify['From_Account'] = groupTip.From_Account
                        break
                    case GROUP_SYSTEM_TYPE.JOIN_GROUP_ACCEPT: //申请加群被同意(只有申请人自己接收到)
                    case GROUP_SYSTEM_TYPE.JOIN_GROUP_REFUSE: //申请加群被拒绝(只有申请人自己接收到)
                        notify['RemarkInfo'] = groupReportTypeMsg.RemarkInfo
                        break
                    case GROUP_SYSTEM_TYPE.KICK: //被管理员踢出群(只有被踢者接收到)
                    case GROUP_SYSTEM_TYPE.DESTORY: //群被解散(全员接收)
                    case GROUP_SYSTEM_TYPE.CREATE: //创建群(创建者接收, 不展示)
                    case GROUP_SYSTEM_TYPE.INVITED_JOIN_GROUP_REQUEST: //邀请加群(被邀请者接收)
                    case GROUP_SYSTEM_TYPE.INVITED_JOIN_GROUP_REQUEST_AGREE: //邀请加群(被邀请者需同意)
                    case GROUP_SYSTEM_TYPE.QUIT: //主动退群(主动退出者接收, 不展示)
                    case GROUP_SYSTEM_TYPE.SET_ADMIN: //群设置管理员(被设置者接收)
                    case GROUP_SYSTEM_TYPE.CANCEL_ADMIN: //取消管理员(被取消者接收)
                    case GROUP_SYSTEM_TYPE.REVOKE: //群已被回收(全员接收, 不展示)
                        break
                    case GROUP_SYSTEM_TYPE.READED: //群消息已读同步
                        break
                    case GROUP_SYSTEM_TYPE.CUSTOM: //用户自定义通知(默认全员接收)
                        notify['UserDefinedField'] =
                            groupReportTypeMsg.UserDefinedField
                        break
                    default:
                        log.error(
                            '未知群系统消息类型：reportType=' + reportType
                        )
                        break
                }

                if (isNeedValidRepeatMsg) {
                    //注释只收取一种通知
                    // if (reportType === GROUP_SYSTEM_TYPE.JOIN_GROUP_REQUEST) {
                    //回调
                    if (this.onGroupSystemNotifyCallbacks[reportType]) {
                        this.onGroupSystemNotifyCallbacks[reportType](notify)
                    } else {
                        log.error(
                            '未知群系统消息类型：reportType=' + reportType
                        )
                    }
                    //}
                } else {
                    //回调
                    if (this.onGroupSystemNotifyCallbacks[reportType]) {
                        if (reportType === GROUP_SYSTEM_TYPE.READED) {
                            let arr =
                                notify.groupReportTypeMsg.GroupReadInfoArray
                            for (let i = 0, l = arr.length; i < l; i++) {
                                let item = arr[i]
                                this.onGroupSystemNotifyCallbacks[reportType](
                                    item
                                )
                            }
                        } else {
                            this.onGroupSystemNotifyCallbacks[reportType](
                                notify
                            )
                        }
                    }
                }
            } //loop
        }

        //处理收到的普通C2C消息
        this.handlerOrdinaryAndTipC2cMsgs = (
            eventType: any,
            C2cMsgArray: any
        ) => {
            //处理c2c消息
            let notifyInfo = []
            let msgInfos = []
            msgInfos = C2cMsgArray //返回的消息列表
            // MsgStore.cookie = resp.Cookie;//cookies，记录当前读到的最新消息位置

            for (let i in msgInfos) {
                let msgInfo = msgInfos[i]
                let isSendMsg, id
                let headUrl = msgInfo.From_AccountHeadurl || ''
                if (msgInfo.From_Account === store.ctx.identifier) {
                    //当前用户发送的消息
                    isSendMsg = true
                    id = msgInfo.To_Account //读取接收者信息
                } else {
                    //当前用户收到的消息
                    isSendMsg = false
                    id = msgInfo.From_Account //读取发送者信息
                }
                let sess = MsgStore.sessByTypeId(SESSION_TYPE.C2C, id)
                if (!sess) {
                    sess = new Session(SESSION_TYPE.C2C, id, id, headUrl, 0, 0)
                }
                let msg = new Msg(
                    sess,
                    isSendMsg,
                    msgInfo.MsgSeq,
                    msgInfo.MsgRandom,
                    msgInfo.MsgTimeStamp,
                    msgInfo.From_Account,
                    C2C_MSG_SUB_TYPE.COMMON,
                    msgInfo.From_AccountNick,
                    headUrl
                )
                let msgBody = null
                let msgContent = null
                let msgType = null
                for (let mi in msgInfo.MsgBody) {
                    msgBody = msgInfo.MsgBody[mi]
                    msgType = msgBody.MsgType
                    switch (msgType) {
                        case MSG_ELEMENT_TYPE.TEXT:
                            msgContent = new Msg.Elem.Text(
                                msgBody.MsgContent.Text
                            )
                            break
                        case MSG_ELEMENT_TYPE.FACE:
                            msgContent = new Msg.Elem.Face(
                                msgBody.MsgContent.Index,
                                msgBody.MsgContent.Data
                            )
                            break
                        case MSG_ELEMENT_TYPE.IMAGE:
                            msgContent = new Msg.Elem.Images(
                                msgBody.MsgContent.UUID,
                                msgBody.MsgContent.ImageFormat || ''
                            )
                            for (let j in msgBody.MsgContent.ImageInfoArray) {
                                let tempImg =
                                    msgBody.MsgContent.ImageInfoArray[j]
                                msgContent.addImage(
                                    new Msg.Elem.Images.Image(
                                        tempImg.Type,
                                        tempImg.Size,
                                        tempImg.Width,
                                        tempImg.Height,
                                        tempImg.URL
                                    )
                                )
                            }
                            break
                        case MSG_ELEMENT_TYPE.SOUND:
                            if (msgBody.MsgContent) {
                                msgContent = new Msg.Elem.Sound(
                                    msgBody.MsgContent.UUID,
                                    msgBody.MsgContent.Second,
                                    msgBody.MsgContent.Size,
                                    msgInfo.From_Account,
                                    msgInfo.To_Account,
                                    msgBody.MsgContent.Download_Flag,
                                    SESSION_TYPE.C2C,
                                    msgBody.MsgContent.Url || null
                                )
                            } else {
                                msgType = MSG_ELEMENT_TYPE.TEXT
                                msgContent = new Msg.Elem.Text(
                                    '[语音消息]下载地址解析出错'
                                )
                            }
                            break
                        case MSG_ELEMENT_TYPE.LOCATION:
                            msgContent = new Msg.Elem.Location(
                                msgBody.MsgContent.Longitude,
                                msgBody.MsgContent.Latitude,
                                msgBody.MsgContent.Desc
                            )
                            break
                        case MSG_ELEMENT_TYPE.FILE:
                        case MSG_ELEMENT_TYPE.FILE + ' ':
                            msgType = MSG_ELEMENT_TYPE.FILE
                            if (msgBody.MsgContent) {
                                msgContent = new Msg.Elem.File(
                                    msgBody.MsgContent.UUID,
                                    msgBody.MsgContent.FileName,
                                    msgBody.MsgContent.FileSize,
                                    msgInfo.From_Account,
                                    msgInfo.To_Account,
                                    msgBody.MsgContent.Download_Flag,
                                    SESSION_TYPE.C2C,
                                    msgBody.MsgContent.Url || null
                                )
                            } else {
                                msgType = MSG_ELEMENT_TYPE.TEXT
                                msgContent = new Msg.Elem.Text(
                                    '[文件消息下载地址解析出错]'
                                )
                            }
                            break
                        case MSG_ELEMENT_TYPE.CUSTOM:
                            try {
                                let data = JSON.parse(msgBody.MsgContent.Data)
                                if (
                                    data &&
                                    data.userAction &&
                                    data.userAction ===
                                        FRIEND_WRITE_MSG_ACTION.ING
                                ) {
                                    //过滤安卓或ios的正在输入自定义消息
                                    continue
                                }
                            } catch (e) {}

                            msgType = MSG_ELEMENT_TYPE.CUSTOM
                            msgContent = new Msg.Elem.Custom(
                                msgBody.MsgContent.Data,
                                msgBody.MsgContent.Desc,
                                msgBody.MsgContent.Ext
                            )
                            break
                        default:
                            msgType = MSG_ELEMENT_TYPE.TEXT
                            msgContent = new Msg.Elem.Text(
                                'web端暂不支持' + msgBody.MsgType + '消息'
                            )
                            break
                    }
                    msg.elems.push(new Msg.Elem(msgType, msgContent))
                }

                // msg.random= [Math.ceil(Math.random()*10000000000)].join('');
                if (msg.elems.length > 0 && MsgStore.addMsg(msg, true)) {
                    notifyInfo.push(msg)
                }
            } // for loop
            if (notifyInfo.length > 0) MsgStore.updateTimeline()
            if (notifyInfo.length > 0) {
                if (this.onMsgCallback) this.onMsgCallback(notifyInfo)
            }
        }

        //更新连接状态
        this.updatecLongPollingStatus = (errObj: any) => {
            if (
                errObj.ErrorCode === 0 ||
                errObj.ErrorCode === longPollingTimeOutErrorCode
            ) {
                store.curLongPollingRetErrorCount = 0
                longPollingOffCallbackFlag = false
                let errorInfo
                let isNeedCallback = false
                switch (curLongPollingStatus) {
                    case CONNECTION_STATUS.INIT:
                        isNeedCallback = true
                        curLongPollingStatus = CONNECTION_STATUS.ON
                        errorInfo = 'create connection successfully(INIT->ON)'
                        break
                    case CONNECTION_STATUS.ON:
                        errorInfo = 'connection is on...(ON->ON)'
                        break
                    case CONNECTION_STATUS.RECONNECT:
                        curLongPollingStatus = CONNECTION_STATUS.ON
                        errorInfo = 'connection is on...(RECONNECT->ON)'
                        break
                    case CONNECTION_STATUS.OFF:
                        isNeedCallback = true
                        curLongPollingStatus = CONNECTION_STATUS.RECONNECT
                        errorInfo = 'reconnect successfully(OFF->RECONNECT)'
                        break
                }
                let successInfo = {
                    ActionStatus: ACTION_STATUS.OK,
                    ErrorCode: curLongPollingStatus,
                    ErrorInfo: errorInfo
                }
                isNeedCallback && ConnManager.callBack(successInfo)
                this.longPollingOn && this.longPolling()
            } else if (errObj.ErrorCode === longPollingKickedErrorCode) {
                //登出
                log.error('多实例登录，被kick')
                if (this.onKickedEventCall) {
                    this.onKickedEventCall()
                }
            } else {
                //记录长轮询返回解析json错误次数
                store.curLongPollingRetErrorCount++
                log.warn(
                    'longPolling接口第' +
                    store.curLongPollingRetErrorCount +
                        '次报错: ' +
                        errObj.ErrorInfo
                )
                //累计超过一定次数
                if (
                    store.curLongPollingRetErrorCount <=
                    LONG_POLLING_MAX_RET_ERROR_COUNT
                ) {
                    setTimeout(this.startNextLongPolling, 100) //
                } else {
                    curLongPollingStatus = CONNECTION_STATUS.OFF
                    let errInfo = {
                        ActionStatus: ACTION_STATUS.FAIL,
                        ErrorCode: CONNECTION_STATUS.OFF,
                        ErrorInfo: 'connection is off'
                    }
                    longPollingOffCallbackFlag === false &&
                        ConnManager.callBack(errInfo)
                    longPollingOffCallbackFlag = true
                    log.warn(
                        longPollingIntervalTime +
                            '毫秒之后,SDK会发起新的longPolling请求...'
                    )
                    setTimeout(
                        this.startNextLongPolling,
                        longPollingIntervalTime
                    ) //长轮询接口报错次数达到一定值，每间隔5s发起新的长轮询
                }
            }
        }

        //发起新的长轮询请求
        this.startNextLongPolling = () => {
            this.longPollingOn && this.longPolling()
        }

        //处理未决的加群申请消息列表
        this.handlerApplyJoinGroupSystemMsgs = (eventArray: any) => {
            for (let i in eventArray) {
                let e = eventArray[i]
                this.handlerGroupSystemMsgs(e.GroupTips, true)
                switch (e.Event) {
                    case LONG_POLLINNG_EVENT_TYPE.GROUP_SYSTEM: //（多终端同步）群系统消息
                        log.warn(
                            'handlerApplyJoinGroupSystemMsgs： handler new group system msg'
                        )
                        //true 表示 解决加群申请通知存在重复的问题（已处理的通知，下次登录还会拉到），需要判重
                        this.handlerGroupSystemMsgs(e.GroupTips, true)
                        break
                    default:
                        log.error(
                            'syncMsgs收到未知的群系统消息类型: Event=' + e.Event
                        )
                        break
                }
            }
        }

        //处理群消息(普通消息+提示消息)
        //isSyncGroupMsgs 是否主动拉取群消息标志
        //isAddMsgFlag 是否需要保存到MsgStore，如果需要，这里会存在判重逻辑
        this.handlerGroupMsg = (
            msgInfo: any,
            isSyncGroupMsgs: any,
            isAddMsgFlag: any,
            isFinished: any = undefined
        ) => {
            if (
                msgInfo.IsPlaceMsg ||
                !msgInfo.From_Account ||
                !msgInfo.MsgBody ||
                msgInfo.MsgBody.length === 0
            ) {
                return null
            }
            let isSendMsg, id, headUrl, fromAccountNick, fromAccountHeadurl
            let group_id = msgInfo.ToGroupId
            let group_name = group_id
            if (msgInfo.GroupInfo) {
                //取出群名称
                if (msgInfo.GroupInfo.GroupName) {
                    group_name = msgInfo.GroupInfo.GroupName
                }
            }
            //取出成员昵称
            fromAccountNick = msgInfo.From_Account
            //fromAccountHeadurl = msgInfo.GroupInfo.From_AccountHeadurl;
            if (msgInfo.GroupInfo) {
                if (msgInfo.GroupInfo.From_AccountNick) {
                    fromAccountNick = msgInfo.GroupInfo.From_AccountNick
                }
                if (msgInfo.GroupInfo.From_AccountHeadurl) {
                    fromAccountHeadurl = msgInfo.GroupInfo.From_AccountHeadurl
                } else {
                    fromAccountHeadurl = null
                }
            }
            if (msgInfo.From_Account === store.ctx.identifier) {
                //当前用户发送的消息
                isSendMsg = true
                id = msgInfo.From_Account //读取接收者信息
                headUrl = ''
            } else {
                //当前用户收到的消息
                isSendMsg = false
                id = msgInfo.From_Account //读取发送者信息
                headUrl = ''
            }
            let sess = MsgStore.sessByTypeId(SESSION_TYPE.GROUP, group_id)
            if (!sess) {
                sess = new Session(
                    SESSION_TYPE.GROUP,
                    group_id,
                    group_name,
                    headUrl,
                    0,
                    0
                )
            }
            if (typeof isFinished !== 'undefined') {
                sess.isFinished(isFinished || 0)
            }
            let subType = GROUP_MSG_SUB_TYPE.COMMON //消息类型
            //群提示消息,重新封装下
            if (
                LONG_POLLINNG_EVENT_TYPE.GROUP_TIP === msgInfo.Event ||
                LONG_POLLINNG_EVENT_TYPE.GROUP_TIP2 === msgInfo.Event
            ) {
                subType = GROUP_MSG_SUB_TYPE.TIP
                let groupTip = msgInfo.MsgBody
                msgInfo.MsgBody = []
                msgInfo.MsgBody.push({
                    MsgType: MSG_ELEMENT_TYPE.GROUP_TIP,
                    MsgContent: groupTip
                })
            } else if (msgInfo.MsgPriority) {
                //群点赞消息
                if (msgInfo.MsgPriority === GROUP_MSG_PRIORITY_TYPE.REDPACKET) {
                    subType = GROUP_MSG_SUB_TYPE.REDPACKET
                } else if (
                    msgInfo.MsgPriority === GROUP_MSG_PRIORITY_TYPE.LOVEMSG
                ) {
                    subType = GROUP_MSG_SUB_TYPE.LOVEMSG
                }
            }
            let msg = new Msg(
                sess,
                isSendMsg,
                msgInfo.MsgSeq,
                msgInfo.MsgRandom,
                msgInfo.MsgTimeStamp,
                msgInfo.From_Account,
                subType,
                fromAccountNick,
                fromAccountHeadurl
            )
            let msgBody = null
            let msgContent = null
            let msgType = null
            for (let mi in msgInfo.MsgBody) {
                msgBody = msgInfo.MsgBody[mi]
                msgType = msgBody.MsgType
                switch (msgType) {
                    case MSG_ELEMENT_TYPE.TEXT:
                        msgContent = new Msg.Elem.Text(msgBody.MsgContent.Text)
                        break
                    case MSG_ELEMENT_TYPE.FACE:
                        msgContent = new Msg.Elem.Face(
                            msgBody.MsgContent.Index,
                            msgBody.MsgContent.Data
                        )
                        break
                    case MSG_ELEMENT_TYPE.IMAGE:
                        msgContent = new Msg.Elem.Images(
                            msgBody.MsgContent.UUID,
                            msgBody.MsgContent.ImageFormat || ''
                        )
                        for (let j in msgBody.MsgContent.ImageInfoArray) {
                            msgContent.addImage(
                                new Msg.Elem.Images.Image(
                                    msgBody.MsgContent.ImageInfoArray[j].Type,
                                    msgBody.MsgContent.ImageInfoArray[j].Size,
                                    msgBody.MsgContent.ImageInfoArray[j].Width,
                                    msgBody.MsgContent.ImageInfoArray[j].Height,
                                    msgBody.MsgContent.ImageInfoArray[j].URL
                                )
                            )
                        }
                        break
                    case MSG_ELEMENT_TYPE.SOUND:
                        if (msgBody.MsgContent) {
                            msgContent = new Msg.Elem.Sound(
                                msgBody.MsgContent.UUID,
                                msgBody.MsgContent.Second,
                                msgBody.MsgContent.Size,
                                msgInfo.From_Account,
                                msgInfo.To_Account,
                                msgBody.MsgContent.Download_Flag,
                                SESSION_TYPE.GROUP,
                                msgBody.MsgContent.Url || null
                            )
                        } else {
                            msgType = MSG_ELEMENT_TYPE.TEXT
                            msgContent = new Msg.Elem.Text(
                                '[语音消息]下载地址解析出错'
                            )
                        }
                        break
                    case MSG_ELEMENT_TYPE.LOCATION:
                        msgContent = new Msg.Elem.Location(
                            msgBody.MsgContent.Longitude,
                            msgBody.MsgContent.Latitude,
                            msgBody.MsgContent.Desc
                        )
                        break
                    case MSG_ELEMENT_TYPE.FILE:
                    case MSG_ELEMENT_TYPE.FILE + ' ':
                        msgType = MSG_ELEMENT_TYPE.FILE
                        let fileUrl = getFileDownUrl(
                            msgBody.MsgContent.UUID,
                            msgInfo.From_Account,
                            msgBody.MsgContent.FileName
                        )

                        if (msgBody.MsgContent) {
                            msgContent = new Msg.Elem.File(
                                msgBody.MsgContent.UUID,
                                msgBody.MsgContent.FileName,
                                msgBody.MsgContent.FileSize,
                                msgInfo.From_Account,
                                msgInfo.To_Account,
                                msgBody.MsgContent.Download_Flag,
                                SESSION_TYPE.GROUP,
                                msgBody.MsgContent.Url || null
                            )
                        } else {
                            msgType = MSG_ELEMENT_TYPE.TEXT
                            msgContent = new Msg.Elem.Text(
                                '[文件消息]地址解析出错'
                            )
                        }
                        break
                    case MSG_ELEMENT_TYPE.GROUP_TIP:
                        let opType = msgBody.MsgContent.OpType
                        msgContent = new Msg.Elem.GroupTip(
                            opType,
                            msgBody.MsgContent.Operator_Account,
                            group_id,
                            msgInfo.GroupInfo.GroupName,
                            msgBody.MsgContent.List_Account,
                            msgBody.MsgContent.MsgMemberExtraInfo
                        )
                        if (
                            GROUP_TIP_TYPE.JOIN === opType ||
                            GROUP_TIP_TYPE.QUIT === opType
                        ) {
                            //加群或退群时，设置最新群成员数
                            msgContent.setGroupMemberNum(
                                msgBody.MsgContent.MemberNum
                            )
                        } else if (
                            GROUP_TIP_TYPE.MODIFY_GROUP_INFO === opType
                        ) {
                            //群资料变更
                            let tempIsCallbackFlag = false
                            let tempNewGroupInfo = {
                                GroupId: group_id,
                                GroupFaceUrl: null,
                                GroupName: null,
                                OwnerAccount: null,
                                GroupNotification: null,
                                GroupIntroduction: null
                            }
                            let msgGroupNewInfo =
                                msgBody.MsgContent.MsgGroupNewInfo
                            if (msgGroupNewInfo.GroupFaceUrl) {
                                let tmpNGIFaceUrl = new Msg.Elem.GroupTip.GroupInfo(
                                    GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL,
                                    msgGroupNewInfo.GroupFaceUrl
                                )
                                msgContent.addGroupInfo(tmpNGIFaceUrl)
                                tempIsCallbackFlag = true
                                tempNewGroupInfo.GroupFaceUrl =
                                    msgGroupNewInfo.GroupFaceUrl
                            }
                            if (msgGroupNewInfo.GroupName) {
                                let tmpNGIName = new Msg.Elem.GroupTip.GroupInfo(
                                    GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME,
                                    msgGroupNewInfo.GroupName
                                )
                                msgContent.addGroupInfo(tmpNGIName)
                                tempIsCallbackFlag = true
                                tempNewGroupInfo.GroupName =
                                    msgGroupNewInfo.GroupName
                            }
                            if (msgGroupNewInfo.Owner_Account) {
                                let tmpNGIOwner = new Msg.Elem.GroupTip.GroupInfo(
                                    GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER,
                                    msgGroupNewInfo.Owner_Account
                                )
                                msgContent.addGroupInfo(tmpNGIOwner)
                                tempIsCallbackFlag = true
                                tempNewGroupInfo.OwnerAccount =
                                    msgGroupNewInfo.Owner_Account
                            }
                            if (msgGroupNewInfo.GroupNotification) {
                                let tmpNGINotification = new Msg.Elem.GroupTip.GroupInfo(
                                    GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION,
                                    msgGroupNewInfo.GroupNotification
                                )
                                msgContent.addGroupInfo(tmpNGINotification)
                                tempIsCallbackFlag = true
                                tempNewGroupInfo.GroupNotification =
                                    msgGroupNewInfo.GroupNotification
                            }
                            if (msgGroupNewInfo.GroupIntroduction) {
                                let tmpNGIIntroduction = new Msg.Elem.GroupTip.GroupInfo(
                                    GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION,
                                    msgGroupNewInfo.GroupIntroduction
                                )
                                msgContent.addGroupInfo(tmpNGIIntroduction)
                                tempIsCallbackFlag = true
                                tempNewGroupInfo.GroupIntroduction =
                                    msgGroupNewInfo.GroupIntroduction
                            }

                            //回调群资料变化通知方法
                            if (
                                isSyncGroupMsgs === false &&
                                tempIsCallbackFlag &&
                                this.onGroupInfoChangeCallback
                            ) {
                                this.onGroupInfoChangeCallback(tempNewGroupInfo)
                            }
                        } else if (
                            GROUP_TIP_TYPE.MODIFY_MEMBER_INFO === opType
                        ) {
                            //群成员变更
                            let memberInfos = msgBody.MsgContent.MsgMemberInfo
                            for (let n in memberInfos) {
                                let memberInfo = memberInfos[n]
                                msgContent.addMemberInfo(
                                    new Msg.Elem.GroupTip.MemberInfo(
                                        memberInfo.User_Account,
                                        memberInfo.ShutupTime
                                    )
                                )
                            }
                        }
                        break
                    case MSG_ELEMENT_TYPE.CUSTOM:
                        msgType = MSG_ELEMENT_TYPE.CUSTOM
                        msgContent = new Msg.Elem.Custom(
                            msgBody.MsgContent.Data,
                            msgBody.MsgContent.Desc,
                            msgBody.MsgContent.Ext
                        )
                        break
                    default:
                        msgType = MSG_ELEMENT_TYPE.TEXT
                        msgContent = new Msg.Elem.Text(
                            'web端暂不支持' + msgBody.MsgType + '消息'
                        )
                        break
                }
                msg.elems.push(new Msg.Elem(msgType, msgContent))
            }

            if (isAddMsgFlag === false) {
                //不需要保存消息
                return msg
            }

            if (MsgStore.addMsg(msg, true)) {
                msg.extraInfo = msgInfo.GroupInfo.MsgFrom_AccountExtraInfo
                return msg
            } else {
                return null
            }
        }
    }
}
