import { tool, log, ajaxDefaultTimeOut, SRV_HOST, SRV_NAME, SRV_NAME_VER, SDK, DOWNLOAD_FILE, DOWNLOAD_FILE_TYPE, Resources, VERSION_INFO, MsgManager, MsgStore, longPollingTimeOutErrorCode, longPollingKickedErrorCode, CMD_EVENT_ID_MAP, maxApiReportItemCount, ConnManager, ACTION_STATUS, SESSION_TYPE, GROUP_MSG_SUB_TYPE, MSG_ELEMENT_TYPE, ERROR_CODE_CUSTOM } from "./store";
import {store} from './store'
import Long from "./long";

let curSeq:any = 0 //消息seq
let xmlHttpObjSeq = 0 //ajax请求id
let xmlHttpObjMap: any = {} //发起的ajax请求

//获取unix时间戳
export function unixtime (d = new Date()): number {
    // if (!d) d = new Date();
    return Math.round(d.getTime() / 1000)
}
//时间戳转日期
export function fromunixtime (t: any) {
    return new Date(t * 1000)
}
//获取下一个消息序号
export function nextSeq () {
    if (curSeq) {
        curSeq = curSeq + 1
    } else {
        curSeq = Math.round(Math.random() * 10000000)
    }
    return curSeq
}
//产生随机数
export function createRandom () {
    return Math.round(Math.random() * 4294967296)
}

//获取ajax请求对象
export function getXmlHttp () {
    let xmlhttp = null
    // if (window.XMLHttpRequest) {
    //     xmlhttp = new XMLHttpRequest();
    // } else {
    //     try {
    //         xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    //     } catch (e) {
    //         try {
    //             xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    //         } catch (e) {
    //             return null;
    //         }
    //     }
    // }
    xmlhttp = new XMLHttpRequest()
    return xmlhttp
}
//发起ajax请求
function ajaxRequest (
    meth: any,
    url: any,
    req: any,
    timeout: any,
    content_type: any,
    isLongPolling: any,
    cbOk: any,
    cbErr: any
) {
    let xmlHttpObj: any = getXmlHttp()

    let error, errInfo
    if (!xmlHttpObj) {
        errInfo = '创建请求失败'
        let error = tool.getReturnError(errInfo, -1)
        log.error(errInfo)
        if (cbErr) cbErr(error)
        return
    }
    //保存ajax请求对象
    xmlHttpObjSeq++
    xmlHttpObjMap[xmlHttpObjSeq] = xmlHttpObj

    xmlHttpObj.open(meth, url, true)
    xmlHttpObj.onreadystatechange = function() {
        if (xmlHttpObj.readyState === 4) {
            xmlHttpObjMap[xmlHttpObjSeq] = null //清空
            if (xmlHttpObj.status === 200) {
                if (cbOk) cbOk(xmlHttpObj.responseText)
                xmlHttpObj = null
                store.curLongPollingRetErrorCount = store.curBigGroupLongPollingRetErrorCount = 0
            } else {
                xmlHttpObj = null
                //避免刷新的时候，由于abord ajax引起的错误回调
                setTimeout(function() {
                    let errInfo = '请求服务器失败,请检查你的网络是否正常'
                    let error = tool.getReturnError(errInfo, -2)
                    //if (!isLongPolling && cbErr) cbErr(error);
                    if (isLongPolling && store.onLongPullingNotify) {
                        store.onLongPullingNotify(error)
                    }
                    if (cbErr) cbErr(error)
                }, 16)
            }
        }
    }
    xmlHttpObj.setRequestHeader('Content-Type', content_type)
    //设置超时时间
    if (!timeout) {
        timeout = ajaxDefaultTimeOut //设置ajax默认超时时间
    }
    if (timeout) {
        xmlHttpObj.timeout = timeout
        xmlHttpObj.ontimeout = function(event: any) {
            xmlHttpObj = null
            //let errInfo = "请求服务器超时";
            //let error = tool.getReturnError(errInfo, -3);
            //if (cbErr) cbErr(error);
        }
    }
    //
    if (xmlHttpObj.overrideMimeType) {
        // xmlHttpObj.overrideMimeType("application/json;charset=utf-8");
    }

    xmlHttpObj.send(req)
}
//发起ajax请求（json格式数据）
export function ajaxRequestJson(
    meth: any,
    url: any,
    req: any,
    timeout: any,
    content_type: any,
    isLongPolling: any,
    cbOk: any,
    cbErr: any
) {
    ajaxRequest(
        meth,
        url,
        JSON.stringify(req),
        timeout,
        content_type,
        isLongPolling,
        function(resp: any) {
            let json = null
            if (resp) json = JSON.parse(resp) //将返回的json字符串转换成json对象
            if (isLongPolling && store.onLongPullingNotify) {
                store.onLongPullingNotify(json)
            }
            if (cbOk) cbOk(json)
        },
        cbErr
    )
}
//判断用户是否已登录
export function isLogin () {
    return store.ctx.sdkAppID && store.ctx.identifier
}
//检查是否登录
export function checkLogin (cbErr: any, isNeedCallBack: any) {
    if (!isLogin()) {
        if (isNeedCallBack) {
            let errInfo = '请登录'
            let error = tool.getReturnError(errInfo, -4)

            if (cbErr) cbErr(error)
        }
        return false
    }
    return true
}

//检查是否访问正式环境
export function isAccessFormalEnv () {
    return store.isAccessFormaEnvironment
}

//根据不同的服务名和命令，获取对应的接口地址
export function getApiUrl (srvName: any, cmd: any, cbOk: any, cbErr: any) {
    let srvHost: any = SRV_HOST
    if (isAccessFormalEnv()) {
        srvHost = SRV_HOST.FORMAL.COMMON
    } else {
        srvHost = SRV_HOST.TEST.COMMON
    }

    //if (srvName === SRV_NAME.RECENT_CONTACT) {
    //    srvHost = SRV_HOST.TEST.COMMON;
    //}

    if (srvName === SRV_NAME.PIC) {
        if (isAccessFormalEnv()) {
            srvHost = SRV_HOST.FORMAL.PIC
        } else {
            srvHost = SRV_HOST.TEST.PIC
        }
    }

    let url =
        srvHost +
        '/' +
        SRV_NAME_VER[srvName] +
        '/' +
        srvName +
        '/' +
        cmd +
        '?websdkappid=' +
        SDK.APPID +
        '&v=' +
        SDK.VERSION +
        '&platform=' +
        SDK.PLAATFORM

    if (isLogin()) {
        if (cmd === 'login' || cmd === 'accesslayer') {
            url +=
                '&identifier=' +
                encodeURIComponent(store.ctx.identifier) +
                '&usersig=' +
                store.ctx.userSig
        } else {
            if (store.ctx.tinyid && store.ctx.a2) {
                url += '&tinyid=' + store.ctx.tinyid + '&a2=' + store.ctx.a2
            } else {
                if (cbErr) {
                    log.error('tinyid或a2为空[' + srvName + '][' + cmd + ']')
                    cbErr(
                        tool.getReturnError(
                            'tinyid或a2为空[' + srvName + '][' + cmd + ']',
                            -5
                        )
                    )
                    return false
                }
            }
        }
        url += '&contenttype=' + store.ctx.contentType
    }
    url +=
        '&sdkappid=' +
        store.ctx.sdkAppID +
        '&accounttype=' +
        store.ctx.accountType +
        '&apn=' +
        store.ctx.apn +
        '&reqtime=' +
        unixtime()
    return url
}

//获取语音下载url
export function getSoundDownUrl (uuid: any, senderId: any) {
    let soundUrl = null
    if (store.authkey && store.ipList[0]) {
        // soundUrl = "http://" + store.ipList[0] + "/asn.com/stddownload_common_file?authkey=" + store.authkey + "&bid=" + DOWNLOAD_FILE.BUSSINESS_ID + "&subbid=" + store.ctx.sdkAppID + "&fileid=" + uuid + "&filetype=" + DOWNLOAD_FILE_TYPE.SOUND + "&openid=" + senderId + "&ver=0";
        soundUrl =
            'https://' +
            DOWNLOAD_FILE.SOUND_SERVER_DOMAIN +
            '/asn.com/stddownload_common_file?authkey=' +
            store.authkey +
            '&bid=' +
            DOWNLOAD_FILE.BUSSINESS_ID +
            '&subbid=' +
            store.ctx.sdkAppID +
            '&fileid=' +
            uuid +
            '&filetype=' +
            DOWNLOAD_FILE_TYPE.SOUND +
            '&openid=' +
            senderId +
            '&ver=0'
    } else {
        log.error('拼接语音下载url不报错：ip或者authkey为空')
    }
    return soundUrl
}

//获取文件下载地址
export function getFileDownUrl (uuid: any, senderId: any, fileName: any) {
    let fileUrl = null
    if (store.authkey && store.ipList[0]) {
        fileUrl =
            'http://' +
            store.ipList[0] +
            '/asn.com/stddownload_common_file?authkey=' +
            store.authkey +
            '&bid=' +
            DOWNLOAD_FILE.BUSSINESS_ID +
            '&subbid=' +
            store.ctx.sdkAppID +
            '&fileid=' +
            uuid +
            '&filetype=' +
            DOWNLOAD_FILE_TYPE.FILE +
            '&openid=' +
            senderId +
            '&ver=0&filename=' +
            encodeURIComponent(fileName)
    } else {
        log.error('拼接文件下载url不报错：ip或者authkey为空')
    }
    Resources.downloadMap['uuid_' + uuid] = fileUrl
    return fileUrl
}

//获取文件下载地址
export function getFileDownUrlV2 (
    uuid: any,
    senderId: any,
    fileName: any,
    downFlag: any,
    receiverId: any,
    busiId: any,
    type: any
) {
    let options: any = {
        From_Account: senderId, //"identifer_0",       // 类型: String, 发送者tinyid
        To_Account: receiverId, //"identifer_1",         // 类型: String, 接收者tinyid
        os_platform: 10, // 类型: Number, 终端的类型 1(android) 2(ios) 3(windows) 10(others...)
        Timestamp: unixtime().toString(), // 类型: Number, 时间戳
        Random: createRandom().toString(), // 类型: Number, 随机值
        request_info: [
            // 类型: Array
            {
                busi_id: busiId, // 类型: Number, 群(1) C2C(2) 其他请联系sdk开发者分配
                download_flag: downFlag, // 类型: Number, 申请下载地址标识  0(申请架平下载地址)  1(申请COS平台下载地址)  2(不需要申请, 直接拿url下载(这里应该不会为2))
                type: type, // 类型: Number, 0(短视频缩略图), 1(文件), 2(短视频), 3(ptt), 其他待分配
                uuid: uuid, // 类型: Number, 唯一标识一个文件的uuid
                version: VERSION_INFO.SERVER_VERSION, // 类型: Number, 架平server版本
                auth_key: store.authkey, // 类型: String, 认证签名
                ip: store.ipList[0] // 类型: Number, 架平IP
            }
        ]
    }
    //获取下载地址
    proto_applyDownload(
        options,
        function(resp: any) {
            if (resp.error_code === 0 && resp.response_info) {
                Resources.downloadMap['uuid_' + options.uuid] =
                    resp.response_info.url
            }
            if (store.onAppliedDownloadUrl) {
                store.onAppliedDownloadUrl({
                    uuid: options.uuid,
                    url: resp.response_info.url,
                    maps: Resources.downloadMap
                })
            }
        },
        function(resp: any) {
            log.error('获取下载地址失败', options.uuid)
        }
    )
}

//重置ajax请求
export function clearXmlHttpObjMap () {
    //遍历xmlHttpObjMap{}
    for (let seq in xmlHttpObjMap) {
        let xmlHttpObj = xmlHttpObjMap[seq]
        if (xmlHttpObj) {
            xmlHttpObj.abort() //中断ajax请求(长轮询)
            xmlHttpObjMap[xmlHttpObjSeq] = null //清空
        }
    }
    xmlHttpObjSeq = 0
    xmlHttpObjMap = {}
}

//重置sdk全局变量
export function clearSdk () {
    clearXmlHttpObjMap()

    //当前登录用户
    store.ctx = {
        sdkAppID: null,
        appIDAt3rd: null,
        accountType: null,
        identifier: null,
        identifierNick: null,
        userSig: null,
        contentType: 'json',
        apn: 1
    }
    store.opt = {}

    curSeq = 0

    //ie8,9采用jsonp方法解决ajax跨域限制
    store.jsonpRequestId = 0 //jsonp请求id
    //最新jsonp请求返回的json数据
    store.jsonpLastRspData = null

    store.apiReportItems = []

    MsgManager.clear()
    MsgStore.clear()

    //重置longpollingId
    store.LongPollingId = null
}

//登录
export function _login (
    loginInfo: any,
    listeners: any,
    options: any,
    cbOk: any,
    cbErr: any
) {
    debugger
    clearSdk()

    if (options) store.opt = options
    if (store.opt.isAccessFormalEnv === false) {
        log.error('请切换为正式环境！！！！')
        store.isAccessFormaEnvironment = store.opt.isAccessFormalEnv
    }
    if (store.opt.isLogOn === false) {
        log.setOn(store.opt.isLogOn)
    }
    if (typeof store.opt.xssFilterEnable !== 'undefined') {
        store.xssFilterEnable = store.opt.xssFilterEnable
    }
    /*
     if(opt.emotions){
     emotions=opt.emotions;
     webim.Emotions= emotions;
     }
     if(opt.emotionDataIndexs){
     emotionDataIndexs=opt.emotionDataIndexs;
     webim.EmotionDataIndexs= emotionDataIndexs;
     }*/

    if (!loginInfo) {
        if (cbErr) {
            cbErr(tool.getReturnError('loginInfo is empty', -6))
            return
        }
    }
    if (!loginInfo.sdkAppID) {
        if (cbErr) {
            cbErr(tool.getReturnError('loginInfo.sdkAppID is empty', -7))
            return
        }
    }
    // if (!loginInfo.accountType) {
    //     if (cbErr) {
    //         cbErr(tool.getReturnError("loginInfo.accountType is empty", -8));
    //         return;
    //     }
    // }

    if (loginInfo.identifier) {
        store.ctx.identifier = loginInfo.identifier.toString()
    }
    if (loginInfo.identifier && !loginInfo.userSig) {
        if (cbErr) {
            cbErr(tool.getReturnError('loginInfo.userSig is empty', -9))
            return
        }
    }
    if (loginInfo.userSig) {
        store.ctx.userSig = loginInfo.userSig.toString()
    }
    store.ctx.sdkAppID = loginInfo.sdkAppID
    store.ctx.accountType = Math.ceil(Math.random() * 10000)

    if (store.ctx.identifier && store.ctx.userSig) {
        //带登录态
        proto_accesslayer(() => {
            //登录
            proto_login((identifierNick: any, headurl: any) => {
                MsgManager.init(
                    listeners,
                    (mmInitResp: any) => {
                        if (cbOk) {
                            mmInitResp.identifierNick = identifierNick
                            mmInitResp.headurl = headurl
                            cbOk(mmInitResp)
                        }
                    },
                    cbErr
                )
            }, cbErr)
        })
    } else {
        //不带登录态，进入直播场景sdk
        MsgManager.init(listeners, cbOk, cbErr)
    }
}

//初始化浏览器信息
export function initBrowserInfo () {
    //初始化浏览器类型
    store.BROWSER_INFO = tool.getBrowserInfo()
    log.info(
        'BROWSER_INFO: type=' + store.BROWSER_INFO.type + ', ver=' + store.BROWSER_INFO.ver
    )
    if (store.BROWSER_INFO.type === 'ie') {
        if (parseInt(store.BROWSER_INFO.ver) < 10) {
            store.lowerBR = true
        }
    }
}

//接口质量上报
export function reportApiQuality (cmd: any, errorCode: any, errorInfo: any) {
    if (
        cmd === 'longpolling' &&
        (errorCode === longPollingTimeOutErrorCode ||
            errorCode === longPollingKickedErrorCode)
    ) {
        //longpolling 返回60008错误可以视为正常,可以不上报
        return
    }
    let eventId = CMD_EVENT_ID_MAP[cmd]
    if (eventId) {
        let reportTime = unixtime()
        let uniqKey = null
        let msgCmdErrorCode = {
            Code: errorCode,
            ErrMsg: errorInfo
        }
        if (store.ctx.a2) {
            uniqKey =
            store.ctx.a2.substring(0, 10) +
                '_' +
                reportTime +
                '_' +
                createRandom()
        } else if (store.ctx.userSig) {
            uniqKey =
            store.ctx.userSig.substring(0, 10) +
                '_' +
                reportTime +
                '_' +
                createRandom()
        }

        if (uniqKey) {
            let rptEvtItem = {
                UniqKey: uniqKey,
                EventId: eventId,
                ReportTime: reportTime,
                MsgCmdErrorCode: msgCmdErrorCode
            }

            if (cmd === 'login') {
                let loginApiReportItems: any = []
                loginApiReportItems.push(rptEvtItem)
                let loginReportOpt = {
                    EvtItems: loginApiReportItems,
                    MainVersion: SDK.VERSION,
                    Version: '0'
                }
                proto_reportApiQuality(
                    loginReportOpt,
                    function(resp: any) {
                        loginApiReportItems = null //
                    },
                    function(err: any) {
                        loginApiReportItems = null //
                    }
                )
            } else {
                store.apiReportItems.push(rptEvtItem)
                if (store.apiReportItems.length >= maxApiReportItemCount) {
                    //累计一定条数再上报
                    let reportOpt = {
                        EvtItems: store.apiReportItems,
                        MainVersion: SDK.VERSION,
                        Version: '0'
                    }
                    proto_reportApiQuality(
                        reportOpt,
                        function(resp: any) {
                            store.apiReportItems = [] //清空
                        },
                        function(err: any) {
                            store.apiReportItems = [] //清空
                        }
                    )
                }
            }
        }
    }
}

export function proto_accesslayer (callback: any) {
    ConnManager.apiCall(
        SRV_NAME.WEB_IM,
        'accesslayer',
        {},
        function(data: any) {
            if (data.ErrorCode === 0 && data.WebImAccessLayer === 1) {
                SRV_HOST.FORMAL.COMMON = 'https://events.tim.qq.com'
            }
            callback()
        },
        function() {
            callback()
        }
    )
}
// REST API calls
//上线
export function proto_login (cbOk: any, cbErr: any) {
    ConnManager.apiCall(
        SRV_NAME.OPEN_IM,
        'login',
        {
            State: 'Online'
        },
        function(loginResp: any) {
            if (loginResp.TinyId) {
                store.ctx.tinyid = loginResp.TinyId
            } else {
                if (cbErr) {
                    cbErr(tool.getReturnError('TinyId is empty', -10))
                    return
                }
            }
            if (loginResp.A2Key) {
                store.ctx.a2 = loginResp.A2Key
            } else {
                if (cbErr) {
                    cbErr(tool.getReturnError('A2Key is empty', -11))
                    return
                }
            }
            let tag_list = ['Tag_Profile_IM_Nick', 'Tag_Profile_IM_Image']
            let options = {
                From_Account: store.ctx.identifier,
                To_Account: [store.ctx.identifier],
                LastStandardSequence: 0,
                TagList: tag_list
            }
            proto_getProfilePortrait(
                options,
                function(resp: any) {
                    let nick, image
                    if (
                        resp.UserProfileItem &&
                        resp.UserProfileItem.length > 0
                    ) {
                        for (let i in resp.UserProfileItem) {
                            for (let j in resp.UserProfileItem[i].ProfileItem) {
                                switch (
                                    resp.UserProfileItem[i].ProfileItem[j].Tag
                                ) {
                                    case 'Tag_Profile_IM_Nick':
                                        nick =
                                            resp.UserProfileItem[i].ProfileItem[
                                                j
                                            ].Value
                                        if (nick) store.ctx.identifierNick = nick
                                        break
                                    case 'Tag_Profile_IM_Image':
                                        image =
                                            resp.UserProfileItem[i].ProfileItem[
                                                j
                                            ].Value
                                        if (image) store.ctx.headurl = image
                                        break
                                }
                            }
                        }
                    }
                    if (cbOk) cbOk(store.ctx.identifierNick, store.ctx.headurl) //回传当前用户昵称
                },
                cbErr
            )
        },
        cbErr
    )
}
//下线
export function proto_logout (
    type: any,
    cbOk: any = undefined,
    cbErr: any = undefined
) {
    if (!checkLogin(cbErr, false)) {
        //不带登录态
        clearSdk()
        if (cbOk)
            cbOk({
                ActionStatus: ACTION_STATUS.OK,
                ErrorCode: 0,
                ErrorInfo: 'logout success'
            })
        return
    }
    if (type === 'all') {
        ConnManager.apiCall(
            SRV_NAME.OPEN_IM,
            'logout',
            {},
            function(resp: any) {
                clearSdk()
                if (cbOk) cbOk(resp)
            },
            cbErr
        )
    } else {
        ConnManager.apiCall(
            SRV_NAME.OPEN_IM,
            'longpollinglogout',
            {
                LongPollingId: store.LongPollingId
            },
            function(resp: any) {
                clearSdk()
                if (cbOk) cbOk(resp)
            },
            cbErr
        )
    }
}
//发送消息，包括私聊和群聊
export function proto_sendMsg (msg: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    let msgInfo: any = null

    switch (msg.sess.type()) {
        case SESSION_TYPE.C2C:
            msgInfo = {
                From_Account: store.ctx.identifier,
                To_Account: msg.sess.id().toString(),
                MsgTimeStamp: msg.time,
                MsgSeq: msg.seq,
                MsgRandom: msg.random,
                MsgBody: [],
                OfflinePushInfo: msg.offlinePushInfo
            }
            break
        case SESSION_TYPE.GROUP:
            let subType = msg.getSubType()
            msgInfo = {
                GroupId: msg.sess.id().toString(),
                From_Account: store.ctx.identifier,
                Random: msg.random,
                MsgBody: []
            }
            switch (subType) {
                case GROUP_MSG_SUB_TYPE.COMMON:
                    msgInfo.MsgPriority = 'COMMON'
                    break
                case GROUP_MSG_SUB_TYPE.REDPACKET:
                    msgInfo.MsgPriority = 'REDPACKET'
                    break
                case GROUP_MSG_SUB_TYPE.LOVEMSG:
                    msgInfo.MsgPriority = 'LOVEMSG'
                    break
                case GROUP_MSG_SUB_TYPE.TIP:
                    log.error('不能主动发送群提示消息,subType=' + subType)
                    break
                default:
                    log.error(
                        '发送群消息时，出现未知子消息类型：subType=' + subType
                    )
                    return
                    break
            }
            break
        default:
            break
    }

    for (let i in msg.elems) {
        let elem = msg.elems[i]
        let msgContent = null
        let msgType = elem.type
        switch (msgType) {
            case MSG_ELEMENT_TYPE.TEXT: //文本
                msgContent = {
                    Text: elem.content.text
                }
                break
            case MSG_ELEMENT_TYPE.FACE: //表情
                msgContent = {
                    Index: elem.content.index,
                    Data: elem.content.data
                }
                break
            case MSG_ELEMENT_TYPE.IMAGE: //图片
                let ImageInfoArray = []
                for (let j in elem.content.ImageInfoArray) {
                    ImageInfoArray.push({
                        Type: elem.content.ImageInfoArray[j].type,
                        Size: elem.content.ImageInfoArray[j].size,
                        Width: elem.content.ImageInfoArray[j].width,
                        Height: elem.content.ImageInfoArray[j].height,
                        URL: elem.content.ImageInfoArray[j].url
                    })
                }
                msgContent = {
                    ImageFormat: elem.content.ImageFormat,
                    UUID: elem.content.UUID,
                    ImageInfoArray: ImageInfoArray
                }
                break
            case MSG_ELEMENT_TYPE.SOUND: //
                log.warn('web端暂不支持发送语音消息')
                continue
                break
            case MSG_ELEMENT_TYPE.LOCATION: //
                log.warn('web端暂不支持发送地理位置消息')
                continue
                break
            case MSG_ELEMENT_TYPE.FILE: //
                msgContent = {
                    UUID: elem.content.uuid,
                    FileName: elem.content.name,
                    FileSize: elem.content.size,
                    DownloadFlag: elem.content.downFlag
                }
                break
            case MSG_ELEMENT_TYPE.CUSTOM: //
                msgContent = {
                    Data: elem.content.data,
                    Desc: elem.content.desc,
                    Ext: elem.content.ext
                }
                msgType = MSG_ELEMENT_TYPE.CUSTOM
                break
            default:
                log.warn('web端暂不支持发送' + elem.type + '消息')
                continue
                break
        }

        if (msg.PushInfoBoolean) {
            msgInfo.OfflinePushInfo = msg.PushInfo //当android终端进程被杀掉时才走push，IOS退到后台即可
        }

        msgInfo.MsgBody.push({
            MsgType: msgType,
            MsgContent: msgContent
        })
    }
    if (msg.sess.type() === SESSION_TYPE.C2C) {
        //私聊
        ConnManager.apiCall(SRV_NAME.OPEN_IM, 'sendmsg', msgInfo, cbOk, cbErr)
    } else if (msg.sess.type() === SESSION_TYPE.GROUP) {
        //群聊
        ConnManager.apiCall(
            SRV_NAME.GROUP,
            'send_group_msg',
            msgInfo,
            cbOk,
            cbErr
        )
    }
}
//长轮询接口
export function proto_longPolling (options: any, cbOk: any, cbErr: any) {
    // if (!store.isAccessFormaEnvironment && typeof stopPolling != "undefined" && stopPolling === true) {
    //     return;
    // }
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.OPEN_IM,
        'longpolling',
        options,
        cbOk,
        cbErr,
        store.longPollingDefaultTimeOut,
        true
    )
}

//长轮询接口(拉取直播聊天室新消息)
export function proto_bigGroupLongPolling (
    options: any,
    cbOk: any,
    cbErr: any,
    timeout: any
) {
    ConnManager.apiCall(
        SRV_NAME.BIG_GROUP_LONG_POLLING,
        'get_msg',
        options,
        cbOk,
        cbErr,
        timeout
    )
}

//拉取未读c2c消息接口
export function proto_getMsgs (
    cookie: any,
    syncFlag: any,
    cbOk: any,
    cbErr: any
) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.OPEN_IM,
        'getmsg',
        {
            Cookie: cookie,
            SyncFlag: syncFlag
        },
        function(resp: any) {
            if (resp.MsgList && resp.MsgList.length) {
                for (let i in resp.MsgList) {
                    store.tempC2CMsgList.push(resp.MsgList[i])
                }
            }
            if (resp.SyncFlag === 1) {
                proto_getMsgs(resp.Cookie, resp.SyncFlag, cbOk, cbErr)
            } else {
                resp.MsgList = store.tempC2CMsgList
                store.tempC2CMsgList = []
                if (cbOk) cbOk(resp)
            }
        },
        cbErr
    )
}
//C2C消息已读上报接口
export function proto_c2CMsgReaded (
    cookie: any,
    c2CMsgReadedItem: any,
    cbOk: any,
    cbErr: any
) {
    if (!checkLogin(cbErr, true)) return
    let tmpC2CMsgReadedItem = []
    for (let i in c2CMsgReadedItem) {
        let item = {
            To_Account: c2CMsgReadedItem[i].toAccount,
            LastedMsgTime: c2CMsgReadedItem[i].lastedMsgTime
        }
        tmpC2CMsgReadedItem.push(item)
    }
    ConnManager.apiCall(
        SRV_NAME.OPEN_IM,
        'msgreaded',
        {
            C2CMsgReaded: {
                Cookie: cookie,
                C2CMsgReadedItem: tmpC2CMsgReadedItem
            }
        },
        cbOk,
        cbErr
    )
}

//删除c2c消息
export function proto_deleteC2CMsg (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(SRV_NAME.OPEN_IM, 'deletemsg', options, cbOk, cbErr)
}

//拉取c2c历史消息接口
export function proto_getC2CHistoryMsgs (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.OPEN_IM,
        'getroammsg',
        options,
        function(resp: any) {
            let reqMsgCount = options.MaxCnt
            let complete = resp.Complete
            let rspMsgCount = resp.MaxCnt
            let msgKey = resp.MsgKey
            let lastMsgTime = resp.LastMsgTime

            if (resp.MsgList && resp.MsgList.length) {
                for (let i in resp.MsgList) {
                    store.tempC2CHistoryMsgList.push(resp.MsgList[i])
                }
            }
            let netxOptions = null
            if (complete === 0) {
                //还有历史消息可拉取
                if (rspMsgCount < reqMsgCount) {
                    netxOptions = {
                        Peer_Account: options.Peer_Account,
                        MaxCnt: reqMsgCount - rspMsgCount,
                        LastMsgTime: lastMsgTime,
                        MsgKey: msgKey
                    }
                }
            }

            if (netxOptions) {
                //继续拉取
                proto_getC2CHistoryMsgs(netxOptions, cbOk, cbErr)
            } else {
                resp.MsgList = store.tempC2CHistoryMsgList
                store.tempC2CHistoryMsgList = []
                if (cbOk) cbOk(resp)
            }
        },
        cbErr
    )
}

//群组接口
//创建群组
//协议参考：https://www.qcloud.com/doc/product/269/1615
export function proto_createGroup (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    let opt: any = {
        //必填    群组形态，包括Public（公开群），Private（私有群），ChatRoom（聊天室），AVChatRoom（互动直播聊天室）。
        Type: options.Type,
        //必填    群名称，最长30字节。
        Name: options.Name
    }
    let member_list = []

    //Array 选填  初始群成员列表，最多500个。成员信息字段详情参见：群成员资料。
    for (let i = 0; i < options.MemberList.length; i++) {
        member_list.push({
            Member_Account: options.MemberList[i]
        })
    }
    opt.MemberList = member_list
    //选填    为了使得群组ID更加简单，便于记忆传播，腾讯云支持APP在通过REST API创建群组时自定义群组ID。详情参见：自定义群组ID。
    if (options.GroupId) {
        opt.GroupId = options.GroupId
    }
    //选填    群主id，自动添加到群成员中。如果不填，群没有群主。
    if (options.Owner_Account) {
        opt.Owner_Account = options.Owner_Account
    }
    //选填    群简介，最长240字节。
    if (options.Introduction) {
        opt.Introduction = options.Introduction
    }
    //选填    群公告，最长300字节。
    if (options.Notification) {
        opt.Notification = options.Notification
    }
    //选填    最大群成员数量，最大为10000，不填默认为2000个。
    if (options.MaxMemberCount) {
        opt.MaxMemberCount = options.MaxMemberCount
    }
    //选填    申请加群处理方式。包含FreeAccess（自由加入），NeedPermission（需要验证），DisableApply（禁止加群），不填默认为NeedPermission（需要验证）。
    if (options.ApplyJoinOption) {
        //
        opt.ApplyJoinOption = options.ApplyJoinOption
    }
    //Array 选填  群组维度的自定义字段，默认情况是没有的，需要开通，详情参见：自定义字段。
    if (options.AppDefinedData) {
        opt.AppDefinedData = options.AppDefinedData
    }
    //选填    群头像URL，最长100字节。
    if (options.FaceUrl) {
        opt.FaceUrl = options.FaceUrl
    }
    ConnManager.apiCall(SRV_NAME.GROUP, 'create_group', opt, cbOk, cbErr)
}

//创建群组-高级接口
//协议参考：https://www.qcloud.com/doc/product/269/1615
export function proto_createGroupHigh (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(SRV_NAME.GROUP, 'create_group', options, cbOk, cbErr)
}

//修改群组基本资料
//协议参考：https://www.qcloud.com/doc/product/269/1620
export function proto_modifyGroupBaseInfo (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'modify_group_base_info',
        options,
        cbOk,
        cbErr
    )
}

//申请加群
export function proto_applyJoinGroup (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    options.GroupId = String(options.GroupId)
    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'apply_join_group',
        {
            GroupId: options.GroupId,
            ApplyMsg: options.ApplyMsg,
            UserDefinedField: options.UserDefinedField
        },
        cbOk,
        cbErr
    )
}

//申请加入大群
// let BigGroupId;
export function proto_applyJoinBigGroup (options: any, cbOk: any, cbErr: any) {
    options.GroupId = String(options.GroupId)
    //BigGroupId = options.GroupId;
    let srvName
    if (!checkLogin(cbErr, false)) {
        //未登录
        srvName = SRV_NAME.BIG_GROUP
    } else {
        //已登录
        srvName = SRV_NAME.GROUP
    }
    if (MsgManager.checkBigGroupLongPollingOn(options.GroupId)) {
        cbErr &&
            cbErr(
                tool.getReturnError(
                    'Join Group failed; You have already been in this group, you have to quit group before you rejoin',
                    10013
                )
            )
        return
    }
    ConnManager.apiCall(
        srvName,
        'apply_join_group',
        {
            GroupId: options.GroupId,
            ApplyMsg: options.ApplyMsg,
            UserDefinedField: options.UserDefinedField
        },
        function(resp: any) {
            if (resp.JoinedStatus && resp.JoinedStatus === 'JoinedSuccess') {
                if (resp.LongPollingKey) {
                    MsgManager.setBigGroupLongPollingOn(true) //开启长轮询
                    MsgManager.setBigGroupLongPollingKey(
                        options.GroupId,
                        resp.LongPollingKey
                    ) //更新大群长轮询key
                    MsgManager.setBigGroupLongPollingMsgMap(options.GroupId, 0) //收到的群消息置0
                    MsgManager.bigGroupLongPolling(options.GroupId) //开启长轮询
                } else {
                    //没有返回LongPollingKey，说明申请加的群不是直播聊天室(AVChatRoom)
                    cbErr &&
                        cbErr(
                            tool.getReturnError(
                                'Join Group succeed; But the type of group is not AVChatRoom: groupid=' +
                                    options.GroupId,
                                -12
                            )
                        )
                    return
                }
            }
            if (cbOk) cbOk(resp)
        },
        function(err: any) {
            if (cbErr) cbErr(err)
        }
    )
}

//处理加群申请(同意或拒绝)
export function proto_handleApplyJoinGroupPendency (
    options: any,
    cbOk: any,
    cbErr: any
) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'handle_apply_join_group',
        {
            GroupId: options.GroupId,
            Applicant_Account: options.Applicant_Account,
            HandleMsg: options.HandleMsg,
            Authentication: options.Authentication,
            MsgKey: options.MsgKey,
            ApprovalMsg: options.ApprovalMsg,
            UserDefinedField: options.UserDefinedField
        },
        cbOk,
        function(err: any) {
            if (err.ErrorCode === 10024) {
                //apply has be handled
                if (cbOk) {
                    let resp = {
                        ActionStatus: ACTION_STATUS.OK,
                        ErrorCode: 0,
                        ErrorInfo: '该申请已经被处理过'
                    }
                    cbOk(resp)
                }
            } else {
                if (cbErr) cbErr(err)
            }
        }
    )
}

//获取群组未决列表
export function proto_getPendencyGroup (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'get_pendency',
        {
            StartTime: options.StartTime,
            Limit: options.Limit,
            Handle_Account: store.ctx.identifier
        },
        cbOk,
        function(err: any) {}
    )
}

//群组未决已经上报
export function proto_getPendencyGroupRead (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'report_pendency',
        {
            ReportTime: options.ReportTime,
            From_Account: store.ctx.identifier
        },
        cbOk,
        function(err: any) {}
    )
}

//处理被邀请进群申请(同意或拒绝)
export function proto_handleInviteJoinGroupRequest (
    options: any,
    cbOk: any,
    cbErr: any
) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'handle_invite_join_group',
        {
            GroupId: options.GroupId,
            Inviter_Account: options.Inviter_Account,
            HandleMsg: options.HandleMsg,
            Authentication: options.Authentication,
            MsgKey: options.MsgKey,
            ApprovalMsg: options.ApprovalMsg,
            UserDefinedField: options.UserDefinedField
        },
        cbOk,
        function(err: any) {}
    )
}

//主动退群
export function proto_quitGroup (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'quit_group',
        {
            GroupId: options.GroupId
        },
        cbOk,
        cbErr
    )
}

//退出大群
export function proto_quitBigGroup (options: any, cbOk: any, cbErr: any) {
    let srvName
    if (!checkLogin(cbErr, false)) {
        //未登录
        srvName = SRV_NAME.BIG_GROUP
    } else {
        //已登录
        srvName = SRV_NAME.GROUP
    }
    MsgManager.resetBigGroupLongPollingInfo(options.GroupId)
    ConnManager.apiCall(
        srvName,
        'quit_group',
        {
            GroupId: options.GroupId
        },
        function(resp: any) {
            MsgStore.delSessByTypeId(SESSION_TYPE.GROUP, options.GroupId)
            //重置当前再请求中的ajax
            //clearXmlHttpObjMap();
            //退出大群成功之后需要重置长轮询信息 - bigGroupLongPollingKeyMap
            // MsgManager.resetBigGroupLongPollingInfo();
            if (cbOk) cbOk(resp)
        },
        cbErr
    )
}
//查找群(按名称)
export function proto_searchGroupByName (options: any, cbOk: any, cbErr: any) {
    ConnManager.apiCall(SRV_NAME.GROUP, 'search_group', options, cbOk, cbErr)
}

//获取群组公开资料
export function proto_getGroupPublicInfo (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'get_group_public_info',
        {
            GroupIdList: options.GroupIdList,
            ResponseFilter: {
                GroupBasePublicInfoFilter: options.GroupBasePublicInfoFilter
            }
        },
        function(resp: any) {
            resp.ErrorInfo = ''
            if (resp.GroupInfo) {
                for (let i in resp.GroupInfo) {
                    let errorCode = resp.GroupInfo[i].ErrorCode
                    if (errorCode > 0) {
                        resp.ActionStatus = ACTION_STATUS.FAIL
                        resp.GroupInfo[i].ErrorInfo =
                            '[' + errorCode + ']' + resp.GroupInfo[i].ErrorInfo
                        resp.ErrorInfo += resp.GroupInfo[i].ErrorInfo + '\n'
                    }
                }
            }
            if (resp.ActionStatus === ACTION_STATUS.FAIL) {
                if (cbErr) {
                    cbErr(resp)
                }
            } else if (cbOk) {
                cbOk(resp)
            }
        },
        cbErr
    )
}

//获取群组详细资料--高级
//请求协议参考：https://www.qcloud.com/doc/product/269/1616
export function proto_getGroupInfo (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    let opt: any = {
        GroupIdList: options.GroupIdList,
        ResponseFilter: {
            GroupBaseInfoFilter: options.GroupBaseInfoFilter,
            MemberInfoFilter: options.MemberInfoFilter
        }
    }
    if (options.AppDefinedDataFilter_Group) {
        opt.ResponseFilter.AppDefinedDataFilter_Group =
            options.AppDefinedDataFilter_Group
    }
    if (options.AppDefinedDataFilter_GroupMember) {
        opt.ResponseFilter.AppDefinedDataFilter_GroupMember =
            options.AppDefinedDataFilter_GroupMember
    }
    ConnManager.apiCall(SRV_NAME.GROUP, 'get_group_info', opt, cbOk, cbErr)
}

//获取群组成员-高级接口
//协议参考：https://www.qcloud.com/doc/product/269/1617
export function proto_getGroupMemberInfo (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'get_group_member_info',
        {
            GroupId: options.GroupId,
            Offset: options.Offset,
            Limit: options.Limit,
            MemberInfoFilter: options.MemberInfoFilter,
            MemberRoleFilter: options.MemberRoleFilter,
            AppDefinedDataFilter_GroupMember:
                options.AppDefinedDataFilter_GroupMember
        },
        cbOk,
        cbErr
    )
}

//增加群组成员
//协议参考：https://www.qcloud.com/doc/product/269/1621
export function proto_addGroupMember (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'add_group_member',
        {
            GroupId: options.GroupId,
            Silence: options.Silence,
            MemberList: options.MemberList
        },
        cbOk,
        cbErr
    )
}
//修改群组成员资料
//协议参考：https://www.qcloud.com/doc/product/269/1623
export function proto_modifyGroupMember (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    let opt: any = {}
    if (options.GroupId) {
        opt.GroupId = options.GroupId
    }
    if (options.Member_Account) {
        opt.Member_Account = options.Member_Account
    }
    //Admin或者Member
    if (options.Role) {
        opt.Role = options.Role
    }
    // AcceptAndNotify代表解收并提示消息，Discard代表不接收也不提示消息，AcceptNotNotify代表接收消息但不提示
    if (options.MsgFlag) {
        opt.MsgFlag = options.MsgFlag
    }
    if (options.ShutUpTime) {
        //禁言时间
        opt.ShutUpTime = options.ShutUpTime
    }
    if (options.NameCard) {
        //群名片,最大不超过50个字节
        opt.NameCard = options.NameCard
    }
    if (options.AppMemberDefinedData) {
        //群成员维度的自定义字段，默认情况是没有的，需要开通
        opt.AppMemberDefinedData = options.AppMemberDefinedData
    }
    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'modify_group_member_info',
        opt,
        cbOk,
        cbErr
    )
}
//删除群组成员
//协议参考：https://www.qcloud.com/doc/product/269/1622
export function proto_deleteGroupMember (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'delete_group_member',
        {
            GroupId: options.GroupId,
            Silence: options.Silence,
            MemberToDel_Account: options.MemberToDel_Account,
            Reason: options.Reason
        },
        cbOk,
        cbErr
    )
}
//解散群组
//协议参考：https://www.qcloud.com/doc/product/269/1624
export function proto_destroyGroup (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'destroy_group',
        {
            GroupId: options.GroupId
        },
        cbOk,
        cbErr
    )
}
//转让群组
//协议参考：https://www.qcloud.com/doc/product/269/1633
export function proto_changeGroupOwner (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'change_group_owner',
        options,
        cbOk,
        cbErr
    )
}
//获取用户所加入的群组-高级接口
//协议参考：https://www.qcloud.com/doc/product/269/1625
export function proto_getJoinedGroupListHigh (
    options: any,
    cbOk: any,
    cbErr: any
) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'get_joined_group_list',
        {
            Member_Account: options.Member_Account,
            Limit: options.Limit,
            Offset: options.Offset,
            GroupType: options.GroupType,
            ResponseFilter: {
                GroupBaseInfoFilter: options.GroupBaseInfoFilter,
                SelfInfoFilter: options.SelfInfoFilter
            }
        },
        cbOk,
        cbErr
    )
}
//查询一组UserId在群中的身份
//协议参考：https://www.qcloud.com/doc/product/269/1626
export function proto_getRoleInGroup (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'get_role_in_group',
        {
            GroupId: options.GroupId,
            User_Account: options.User_Account
        },
        cbOk,
        cbErr
    )
}
//设置取消成员禁言时间
//协议参考：https://www.qcloud.com/doc/product/269/1627
export function proto_forbidSendMsg (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'forbid_send_msg',
        {
            GroupId: options.GroupId,
            Members_Account: options.Members_Account,
            ShutUpTime: options.ShutUpTime //单位为秒，为0时表示取消禁言
        },
        cbOk,
        cbErr
    )
}

//发送自定义群系统通知
export function proto_sendCustomGroupNotify (
    options: any,
    cbOk: any,
    cbErr: any
) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'send_group_system_notification',
        options,
        cbOk,
        cbErr
    )
}

//拉取群消息接口
export function proto_getGroupMsgs (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'group_msg_get',
        {
            GroupId: options.GroupId,
            ReqMsgSeq: options.ReqMsgSeq,
            ReqMsgNumber: options.ReqMsgNumber
        },
        cbOk,
        cbErr
    )
}
//群消息已读上报接口
export function proto_groupMsgReaded (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.GROUP,
        'msg_read_report',
        {
            GroupId: options.GroupId,
            MsgReadedSeq: options.MsgReadedSeq
        },
        cbOk,
        cbErr
    )
}
//end

//好友接口
//处理好友接口返回的错误码
export function convertErrorEn2ZhFriend (resp: any) {
    let errorAccount = []
    if (resp.Fail_Account && resp.Fail_Account.length) {
        errorAccount = resp.Fail_Account
    }
    if (resp.Invalid_Account && resp.Invalid_Account.length) {
        for (let k in resp.Invalid_Account) {
            errorAccount.push(resp.Invalid_Account[k])
        }
    }
    if (errorAccount.length) {
        resp.ActionStatus = ACTION_STATUS.FAIL
        resp.ErrorCode = ERROR_CODE_CUSTOM
        resp.ErrorInfo = ''
        for (let i in errorAccount) {
            let failCount = errorAccount[i]
            for (let j in resp.ResultItem) {
                if (resp.ResultItem[j].To_Account === failCount) {
                    let resultCode = resp.ResultItem[j].ResultCode
                    resp.ResultItem[j].ResultInfo =
                        '[' + resultCode + ']' + resp.ResultItem[j].ResultInfo
                    resp.ErrorInfo += resp.ResultItem[j].ResultInfo + '\n'
                    break
                }
            }
        }
    }
    return resp
}
//添加好友
export function proto_applyAddFriend (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'friend_add',
        {
            From_Account: store.ctx.identifier,
            AddFriendItem: options.AddFriendItem
        },
        function(resp: any) {
            let newResp = convertErrorEn2ZhFriend(resp)
            if (newResp.ActionStatus === ACTION_STATUS.FAIL) {
                if (cbErr) cbErr(newResp)
            } else if (cbOk) {
                cbOk(newResp)
            }
        },
        cbErr
    )
}
//删除好友
export function proto_deleteFriend (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'friend_delete',
        {
            From_Account: store.ctx.identifier,
            To_Account: options.To_Account,
            DeleteType: options.DeleteType
        },
        function(resp: any) {
            let newResp = convertErrorEn2ZhFriend(resp)
            if (newResp.ActionStatus === ACTION_STATUS.FAIL) {
                if (cbErr) cbErr(newResp)
            } else if (cbOk) {
                cbOk(newResp)
            }
        },
        cbErr
    )
}
//删除会话
export function proto_deleteChat (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return

    if (options.chatType === 1) {
        ConnManager.apiCall(
            SRV_NAME.DEL_CHAT,
            'delete',
            {
                From_Account: store.ctx.identifier,
                Type: options.chatType,
                To_Account: options.To_Account
            },
            cbOk,
            cbErr
        )
    } else {
        ConnManager.apiCall(
            SRV_NAME.DEL_CHAT,
            'delete',
            {
                From_Account: store.ctx.identifier,
                Type: options.chatType,
                ToGroupid: options.To_Account
            },
            cbOk,
            cbErr
        )
    }
}
//获取好友申请
export function proto_getPendency (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'pendency_get',
        {
            From_Account: store.ctx.identifier,
            PendencyType: options.PendencyType,
            StartTime: options.StartTime,
            MaxLimited: options.MaxLimited,
            LastSequence: options.LastSequence
        },
        cbOk,
        cbErr
    )
}
//好友申请已读上报
export function proto_getPendencyReport (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'PendencyReport',
        {
            From_Account: store.ctx.identifier,
            LatestPendencyTimeStamp: options.LatestPendencyTimeStamp
        },
        cbOk,
        cbErr
    )
}
//删除好友申请
export function proto_deletePendency (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'pendency_delete',
        {
            From_Account: store.ctx.identifier,
            PendencyType: options.PendencyType,
            To_Account: options.To_Account
        },
        function(resp: any) {
            let newResp = convertErrorEn2ZhFriend(resp)
            if (newResp.ActionStatus === ACTION_STATUS.FAIL) {
                if (cbErr) cbErr(newResp)
            } else if (cbOk) {
                cbOk(newResp)
            }
        },
        cbErr
    )
}
//处理好友申请
export function proto_responseFriend (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'friend_response',
        {
            From_Account: store.ctx.identifier,
            ResponseFriendItem: options.ResponseFriendItem
        },
        function(resp: any) {
            let newResp = convertErrorEn2ZhFriend(resp)
            if (newResp.ActionStatus === ACTION_STATUS.FAIL) {
                if (cbErr) cbErr(newResp)
            } else if (cbOk) {
                cbOk(newResp)
            }
        },
        cbErr
    )
}
//我的好友
export function proto_getAllFriend (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'friend_get_all',
        {
            From_Account: store.ctx.identifier,
            TimeStamp: options.TimeStamp,
            StartIndex: options.StartIndex,
            GetCount: options.GetCount,
            LastStandardSequence: options.LastStandardSequence,
            TagList: options.TagList
        },
        cbOk,
        cbErr
    )
}

//资料接口
//查看个人资料
export function proto_getProfilePortrait (options: any, cbOk: any, cbErr: any) {
    if (options.To_Account.length > 100) {
        options.To_Account.length = 100
        log.error('获取用户资料人数不能超过100人')
    }
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.PROFILE,
        'portrait_get',
        {
            From_Account: store.ctx.identifier,
            To_Account: options.To_Account,
            //'LastStandardSequence':options.LastStandardSequence,
            TagList: options.TagList
        },
        function(resp: any) {
            let errorAccount = []
            if (resp.Fail_Account && resp.Fail_Account.length) {
                errorAccount = resp.Fail_Account
            }
            if (resp.Invalid_Account && resp.Invalid_Account.length) {
                for (let k in resp.Invalid_Account) {
                    errorAccount.push(resp.Invalid_Account[k])
                }
            }
            if (errorAccount.length) {
                resp.ActionStatus = ACTION_STATUS.FAIL
                resp.ErrorCode = ERROR_CODE_CUSTOM
                resp.ErrorInfo = ''
                for (let i in errorAccount) {
                    let failCount = errorAccount[i]
                    for (let j in resp.UserProfileItem) {
                        if (resp.UserProfileItem[j].To_Account === failCount) {
                            let resultCode = resp.UserProfileItem[j].ResultCode
                            resp.UserProfileItem[j].ResultInfo =
                                '[' +
                                resultCode +
                                ']' +
                                resp.UserProfileItem[j].ResultInfo
                            resp.ErrorInfo +=
                                '账号:' +
                                failCount +
                                ',' +
                                resp.UserProfileItem[j].ResultInfo +
                                '\n'
                            break
                        }
                    }
                }
            }
            if (resp.ActionStatus === ACTION_STATUS.FAIL) {
                if (cbErr) cbErr(resp)
            } else if (cbOk) {
                cbOk(resp)
            }
        },
        cbErr
    )
}

//设置个人资料
export function proto_setProfilePortrait (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.PROFILE,
        'portrait_set',
        {
            From_Account: store.ctx.identifier,
            ProfileItem: options.ProfileItem
        },
        function(resp: any) {
            for (let i in options.ProfileItem) {
                let profile = options.ProfileItem[i]
                if (profile.Tag === 'Tag_Profile_IM_Nick') {
                    store.ctx.identifierNick = profile.Value //更新昵称
                    break
                }
            }
            if (cbOk) cbOk(resp)
        },
        cbErr
    )
}

//增加黑名单
export function proto_addBlackList (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'black_list_add',
        {
            From_Account: store.ctx.identifier,
            To_Account: options.To_Account
        },
        function(resp: any) {
            let newResp = convertErrorEn2ZhFriend(resp)
            if (newResp.ActionStatus === ACTION_STATUS.FAIL) {
                if (cbErr) cbErr(newResp)
            } else if (cbOk) {
                cbOk(newResp)
            }
        },
        cbErr
    )
}

//删除黑名单
export function proto_deleteBlackList (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'black_list_delete',
        {
            From_Account: store.ctx.identifier,
            To_Account: options.To_Account
        },
        function(resp: any) {
            let newResp = convertErrorEn2ZhFriend(resp)
            if (newResp.ActionStatus === ACTION_STATUS.FAIL) {
                if (cbErr) cbErr(newResp)
            } else if (cbOk) {
                cbOk(newResp)
            }
        },
        cbErr
    )
}

//我的黑名单
export function proto_getBlackList (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.FRIEND,
        'black_list_get',
        {
            From_Account: store.ctx.identifier,
            StartIndex: options.StartIndex,
            MaxLimited: options.MaxLimited,
            LastSequence: options.LastSequence
        },
        cbOk,
        cbErr
    )
}

//获取最近联系人
export function proto_getRecentContactList (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.RECENT_CONTACT,
        'get',
        {
            From_Account: store.ctx.identifier,
            Count: options.Count
        },
        cbOk,
        cbErr
    )
}

//上传图片或文件
export function proto_uploadPic (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    let cmdName
    if (isAccessFormalEnv()) {
        cmdName = 'pic_up'
    } else {
        cmdName = 'pic_up_test'
    }
    ConnManager.apiCall(
        SRV_NAME.PIC,
        cmdName,
        {
            App_Version: VERSION_INFO.APP_VERSION,
            From_Account: store.ctx.identifier,
            To_Account: options.To_Account,
            Seq: options.Seq,
            Timestamp: options.Timestamp,
            Random: options.Random,
            File_Str_Md5: options.File_Str_Md5,
            File_Size: options.File_Size,
            File_Type: options.File_Type,
            Server_Ver: VERSION_INFO.SERVER_VERSION,
            Auth_Key: store.authkey,
            Busi_Id: options.Busi_Id,
            PkgFlag: options.PkgFlag,
            Slice_Offset: options.Slice_Offset,
            Slice_Size: options.Slice_Size,
            Slice_Data: options.Slice_Data,
            content_type: 'application/x-www-form-urlencoded'
        },
        cbOk,
        cbErr
    )
}

//获取语音和文件下载IP和authkey
export function proto_getIpAndAuthkey (cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(SRV_NAME.OPEN_IM, 'authkey', {}, cbOk, cbErr)
}

//接口质量上报
export function proto_reportApiQuality (options: any, cbOk: any, cbErr: any) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.IM_OPEN_STAT,
        'web_report',
        options,
        cbOk,
        cbErr
    )
}

export function proto_getLongPollingId (
    options: any,
    cbOk: any = undefined,
    cbErr: any = undefined
) {
    if (!checkLogin(cbErr, true)) return
    ConnManager.apiCall(
        SRV_NAME.OPEN_IM,
        'getlongpollingid',
        {},
        function(resp: any) {
            cbOk && cbOk(resp)
        },
        cbErr
    )
}

export function proto_applyDownload (options: any, cbOk: any, cbErr: any) {
    //把下载地址push到map中
    ConnManager.apiCall(SRV_NAME.PIC, 'apply_download', options, cbOk, cbErr)
}

export function calcUniqId (num1: any, num2: any) {
    let str1 = parseInt(num1).toString(2) + '00000000000000000000000000000000'
    let str2 = parseInt(num2).toString(2)
    let arr1 = str1.split('').reverse()
    let arr2 = str2.split('').reverse()
    let sig = null,
        res = []
    let length = arr1.length > arr2.length ? arr1.length : arr2.length
    for (let a = 0; a < length; a++) {
        sig = Number(arr1[a] || 0) || Number(arr2[a] || 0)
        res.push(sig)
    }
    let numstr = res.reverse().join('')
    let long = {
        high:
            '0x' +
            parseInt(numstr.substr(0, numstr.length - 32), 2).toString(16),
        low:
            '0x' +
            parseInt(numstr.substr(numstr.length - 32 - 1), 2).toString(16)
    }
    let longVal = new Long(long.low, long.high, true)
    return longVal.toString()
}