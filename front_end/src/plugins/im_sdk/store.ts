import Log from './log'
import Tool from './tool'
import MsgClass from './msg'
import MsgStoreClass from './msg-store'
import SessionClass from './session'
import C2CMsgReadedItemClass from './c2c-msg-readed-item'
import {
    proto_c2CMsgReaded,
    proto_groupMsgReaded,
    proto_getLongPollingId,
    proto_longPolling,
    proto_bigGroupLongPolling,
    getApiUrl,
    ajaxRequestJson,
    reportApiQuality,
    proto_getMsgs,
    proto_getC2CHistoryMsgs,
    proto_getGroupMsgs,
    proto_sendMsg,
    proto_logout,
    proto_getIpAndAuthkey,
    proto_getJoinedGroupListHigh,
    getFileDownUrl,
    isAccessFormalEnv,
    nextSeq,
    unixtime,
    createRandom,
    proto_uploadPic
} from './methods'
import MsgManagerClass from './msg-manager'
import FileUploaderClass from './file-uploader'
import { HConnManager, LConnManager } from './conn-manager'

export const Version = '1.7.3'
export let msgCache = {}

export const SDK = {
    VERSION: Version, // sdk版本号
    APPID: '537048168', //web im sdk 版本 APPID
    PLAATFORM: '10' // 发送请求时判断其是来自web端的请求
}

//是否启用正式环境，默认启用
export let isAccessFormaEnvironment = true
// 是否需要进行XSS Filter
export let xssFilterEnable = true

//后台接口主机
export const SRV_HOST = {
    FORMAL: {
        COMMON: 'https://webim.tim.qq.com',
        PIC: 'https://pic.tim.qq.com'
    },
    TEST: {
        COMMON: 'https://test.tim.qq.com',
        PIC: 'https://pic.tim.qq.com'
    }
}

//浏览器版本信息
export let BROWSER_INFO: any = {}
//是否为ie9（含）以下
export let lowerBR = false

//服务名称
export const SRV_NAME = {
    OPEN_IM: 'openim', //私聊（拉取未读c2c消息，长轮询，c2c消息已读上报等）服务名
    GROUP: 'group_open_http_svc', //群组管理（拉取群消息，创建群，群成员管理，群消息已读上报等）服务名
    FRIEND: 'sns', //关系链管理（好友管理，黑名单管理等）服务名
    PROFILE: 'profile', //资料管理（查询，设置个人资料等）服务名
    RECENT_CONTACT: 'recentcontact', //最近联系人服务名
    PIC: 'openpic', //图片（或文件）服务名
    BIG_GROUP: 'group_open_http_noauth_svc', //直播大群 群组管理（申请加大群）服务名
    BIG_GROUP_LONG_POLLING: 'group_open_long_polling_http_noauth_svc', //直播大群 长轮询（拉取消息等）服务名
    IM_OPEN_STAT: 'imopenstat', //质量上报，统计接口错误率
    DEL_CHAT: 'recentcontact', //删除会话
    WEB_IM: 'webim'
}

//不同服务对应的版本号
export const SRV_NAME_VER: any = {
    openim: 'v4',
    group_open_http_svc: 'v4',
    sns: 'v4',
    profile: 'v4',
    recentcontact: 'v4',
    openpic: 'v4',
    group_open_http_noauth_svc: 'v1',
    group_open_long_polling_http_noauth_svc: 'v1',
    imopenstat: 'v4',
    webim: 'v3'
}

//不同的命令名对应的上报类型ID，用于接口质量上报
export const CMD_EVENT_ID_MAP: any = {
    login: 1, //登录
    pic_up: 3, //上传图片
    apply_join_group: 9, //申请加入群组
    create_group: 10, //创建群组
    longpolling: 18, //普通长轮询
    send_group_msg: 19, //群聊
    sendmsg: 20 //私聊
}

//聊天类型
export const SESSION_TYPE = {
    C2C: 'C2C', //私聊
    GROUP: 'GROUP' //群聊
}

//最近联系人类型
export const RECENT_CONTACT_TYPE = {
    C2C: 1, //好友
    GROUP: 2 //群
}

//消息最大长度（字节）
export const MSG_MAX_LENGTH = {
    C2C: 12000, //私聊消息
    GROUP: 8898 //群聊
}

//后台接口返回类型
export const ACTION_STATUS = {
    OK: 'OK', //成功
    FAIL: 'FAIL' //失败
}

export const ERROR_CODE_CUSTOM = 99999 //自定义后台接口返回错误码

//消息元素类型
export const MSG_ELEMENT_TYPE = {
    TEXT: 'TIMTextElem', //文本
    FACE: 'TIMFaceElem', //表情
    IMAGE: 'TIMImageElem', //图片
    CUSTOM: 'TIMCustomElem', //自定义
    SOUND: 'TIMSoundElem', //语音,只支持显示
    FILE: 'TIMFileElem', //文件,只支持显示
    LOCATION: 'TIMLocationElem', //地理位置
    GROUP_TIP: 'TIMGroupTipElem' //群提示消息,只支持显示
}

//图片类型
export const IMAGE_TYPE = {
    ORIGIN: 1, //原图
    LARGE: 2, //缩略大图
    SMALL: 3 //缩略小图
}
//图片格式
export const IMAGE_FORMAT:any = {
    JPG: 0x1,
    JPEG: 0x1,
    GIF: 0x2,
    PNG: 0x3,
    BMP: 0x4,
    UNKNOWN: 0xff
}

//上传资源包类型
export const UPLOAD_RES_PKG_FLAG = {
    RAW_DATA: 0, //原始数据
    BASE64_DATA: 1 //base64编码数据
}

//下载文件配置
export const DOWNLOAD_FILE = {
    BUSSINESS_ID: '10001', //下载文件业务ID
    AUTH_KEY: '617574686b6579', //下载文件authkey
    SERVER_IP: '182.140.186.147', //下载文件服务器IP
    SOUND_SERVER_DOMAIN: 'grouptalk.c2c.qq.com'
}

//下载文件类型
export const DOWNLOAD_FILE_TYPE = {
    SOUND: 2106, //语音
    FILE: 2107 //普通文件
}

//上传资源类型
export const UPLOAD_RES_TYPE = {
    IMAGE: 1, //图片
    FILE: 2, //文件
    SHORT_VIDEO: 3, //短视频
    SOUND: 4 //语音，PTT
}

//版本号，用于上传图片或文件接口
export const VERSION_INFO = {
    APP_VERSION: '2.1', //应用版本号
    SERVER_VERSION: 1 //服务端版本号
}

//长轮询消息类型
export const LONG_POLLINNG_EVENT_TYPE = {
    C2C: 1, //新的c2c消息通知
    GROUP_COMMON: 3, //新的群普通消息
    GROUP_TIP: 4, //新的群提示消息
    GROUP_SYSTEM: 5, //新的群系统消息
    GROUP_TIP2: 6, //新的群提示消息2
    FRIEND_NOTICE: 7, //好友系统通知
    PROFILE_NOTICE: 8, //资料系统通知
    C2C_COMMON: 9, //新的C2C消息
    C2C_EVENT: 10
}

//c2c消息子类型
export const C2C_MSG_SUB_TYPE = {
    COMMON: 0 //普通消息
}
//c2c消息子类型
export const C2C_EVENT_SUB_TYPE = {
    READED: 92, //已读消息同步
    KICKEDOUT: 96
}

//群消息子类型
export const GROUP_MSG_SUB_TYPE = {
    COMMON: 0, //普通消息
    LOVEMSG: 1, //点赞消息
    TIP: 2, //提示消息
    REDPACKET: 3 //红包消息
}

//群消息优先级类型
export const GROUP_MSG_PRIORITY_TYPE = {
    REDPACKET: 1, //红包消息
    COMMON: 2, //普通消息
    LOVEMSG: 3 //点赞消息
}

//群提示消息类型
export const GROUP_TIP_TYPE: any = {
    JOIN: 1, //加入群组
    QUIT: 2, //退出群组
    KICK: 3, //被踢出群组
    SET_ADMIN: 4, //被设置为管理员
    CANCEL_ADMIN: 5, //被取消管理员
    MODIFY_GROUP_INFO: 6, //修改群资料
    MODIFY_MEMBER_INFO: 7 //修改群成员信息
}

//群提示消息-群资料变更类型
export const GROUP_TIP_MODIFY_GROUP_INFO_TYPE = {
    FACE_URL: 1, //修改群头像URL
    NAME: 2, //修改群名称
    OWNER: 3, //修改群主
    NOTIFICATION: 4, //修改群公告
    INTRODUCTION: 5 //修改群简介
}

//群系统消息类型
export const GROUP_SYSTEM_TYPE = {
    JOIN_GROUP_REQUEST: 1, //申请加群请求（只有管理员会收到）
    JOIN_GROUP_ACCEPT: 2, //申请加群被同意（只有申请人能够收到）
    JOIN_GROUP_REFUSE: 3, //申请加群被拒绝（只有申请人能够收到）
    KICK: 4, //被管理员踢出群(只有被踢者接收到)
    DESTORY: 5, //群被解散(全员接收)
    CREATE: 6, //创建群(创建者接收, 不展示)
    INVITED_JOIN_GROUP_REQUEST: 7, //邀请加群(被邀请者接收)
    QUIT: 8, //主动退群(主动退出者接收, 不展示)
    SET_ADMIN: 9, //设置管理员(被设置者接收)
    CANCEL_ADMIN: 10, //取消管理员(被取消者接收)
    REVOKE: 11, //群已被回收(全员接收, 不展示)
    READED: 15, //群消息已读同步
    CUSTOM: 255, //用户自定义通知(默认全员接收)
    INVITED_JOIN_GROUP_REQUEST_AGREE: 12 //邀请加群(被邀请者需同意)
}

//好友系统通知子类型
export const FRIEND_NOTICE_TYPE = {
    FRIEND_ADD: 1, //好友表增加
    FRIEND_DELETE: 2, //好友表删除
    PENDENCY_ADD: 3, //未决增加
    PENDENCY_DELETE: 4, //未决删除
    BLACK_LIST_ADD: 5, //黑名单增加
    BLACK_LIST_DELETE: 6, //黑名单删除
    PENDENCY_REPORT: 7, //未决已读上报
    FRIEND_UPDATE: 8 //好友数据更新
}

//资料系统通知子类型
export const PROFILE_NOTICE_TYPE = {
    PROFILE_MODIFY: 1 //资料修改
}

//腾讯登录服务错误码（用于托管模式）
export const TLS_ERROR_CODE = {
    OK: 0, //成功
    SIGNATURE_EXPIRATION: 11 //用户身份凭证过期
}

//长轮询连接状态
export const CONNECTION_STATUS = {
    INIT: -1, //初始化
    ON: 0, //连接正常
    RECONNECT: 1, //连接恢复正常
    OFF: 9999 //连接已断开,可能是用户网络问题，或者长轮询接口报错引起的
}

export const UPLOAD_PIC_BUSSINESS_TYPE = {
    //图片业务类型
    GROUP_MSG: 1, //私聊图片
    C2C_MSG: 2, //群聊图片
    USER_HEAD: 3, //用户头像
    GROUP_HEAD: 4 //群头像
}

export const FRIEND_WRITE_MSG_ACTION = {
    //好友输入消息状态
    ING: 14, //正在输入
    STOP: 15 //停止输入
}

//ajax默认超时时间，单位：毫秒
export let ajaxDefaultTimeOut = 15000

//大群长轮询接口返回正常时，延时一定时间再发起下一次请求
export const OK_DELAY_TIME = 1000

//大群长轮询接口发生错误时，延时一定时间再发起下一次请求
export const ERROR_DELAY_TIME = 5000

//群提示消息最多显示人数
export const GROUP_TIP_MAX_USER_COUNT = 10

//长轮询连接状态
export let curLongPollingStatus = CONNECTION_STATUS.INIT

//当长轮询连接断开后，是否已经回调过
export let longPollingOffCallbackFlag = false

//当前长轮询返回错误次数
export let curLongPollingRetErrorCount = 0

//长轮询默认超时时间，单位：毫秒
export let longPollingDefaultTimeOut = 60000

//长轮询返回错误次数达到一定值后，发起新的长轮询请求间隔时间，单位：毫秒
export let longPollingIntervalTime = 5000

//没有新消息时，长轮询返回60008错误码是正常的
export let longPollingTimeOutErrorCode = 60008

//多实例登录被kick的错误码
export let longPollingKickedErrorCode = 91101

export let longPollingPackageTooLargeErrorCode = 10018

export let LongPollingId: any = null

//当前大群长轮询返回错误次数
export let curBigGroupLongPollingRetErrorCount = 0

//最大允许长轮询返回错误次数
export const LONG_POLLING_MAX_RET_ERROR_COUNT = 10

//上传重试累计
export let Upload_Retry_Times = 0
//最大上传重试
export let Upload_Retry_Max_Times = 20

//ie7/8/9采用jsonp方法解决ajax跨域限制
export let jsonpRequestId = 0 //jsonp请求id
//最新jsonp请求返回的json数据
export let jsonpLastRspData: any = null
//兼容ie7/8/9,jsonp回调函数
export let jsonpCallback: any = null

export let uploadResultIframeId = 0 //用于上传图片的iframe id

export let ipList: any = [] //文件下载地址
export let authkey: any = null //文件下载票据
export let expireTime = null //文件下载票据超时时间

//错误码
export let ERROR = {}
//当前登录用户
export let ctx: any = {
    sdkAppID: null,
    appIDAt3rd: null,
    accountType: null,
    identifier: null,
    tinyid: null,
    identifierNick: null,
    userSig: null,
    a2: null,
    contentType: 'json',
    apn: 1
}
export let opt: any = {}
export let tempC2CMsgList: any = [] //新c2c消息临时缓存
export let tempC2CHistoryMsgList: any = [] //漫游c2c消息临时缓存

export let maxApiReportItemCount = 20 //一次最多上报条数
export let apiReportItems: any = [] //暂存api接口质量上报数据
export let onLongPullingNotify: any = null

export let Resources: any = {
    downloadMap: {}
}

export let onAppliedDownloadUrl: any = null

//表情标识字符和索引映射关系对象，用户可以自定义
export const emotionDataIndexs:any = {
    '[惊讶]': 0,
    '[撇嘴]': 1,
    '[色]': 2,
    '[发呆]': 3,
    '[得意]': 4,
    '[流泪]': 5,
    '[害羞]': 6,
    '[闭嘴]': 7,
    '[睡]': 8,
    '[大哭]': 9,
    '[尴尬]': 10,
    '[发怒]': 11,
    '[调皮]': 12,
    '[龇牙]': 13,
    '[微笑]': 14,
    '[难过]': 15,
    '[酷]': 16,
    '[冷汗]': 17,
    '[抓狂]': 18,
    '[吐]': 19,
    '[偷笑]': 20,
    '[可爱]': 21,
    '[白眼]': 22,
    '[傲慢]': 23,
    '[饿]': 24,
    '[困]': 25,
    '[惊恐]': 26,
    '[流汗]': 27,
    '[憨笑]': 28,
    '[大兵]': 29,
    '[奋斗]': 30,
    '[咒骂]': 31,
    '[疑问]': 32,
    '[嘘]': 33,
    '[晕]': 34
}

//表情对象，用户可以自定义
export let emotions:any = {}

//日志对象
export const log = new Log(true)

//工具类
export const tool = new Tool(xssFilterEnable, ACTION_STATUS, log)

// class Session
export let Session: any = SessionClass
//class C2CMsgReadedItem
export let C2CMsgReadedItem = C2CMsgReadedItemClass

// class Msg
export let Msg: any = MsgClass

// singleton object MsgStore
export let MsgStore = new MsgStoreClass(
    Session,
    C2CMsgReadedItem,
    SESSION_TYPE,
    proto_c2CMsgReaded,
    log,
    proto_groupMsgReaded
)
//上传文件
export let FileUploader = new FileUploaderClass(
    tool,
    uploadResultIframeId,
    isAccessFormalEnv,
    ctx,
    VERSION_INFO,
    nextSeq,
    unixtime,
    createRandom,
    UPLOAD_RES_PKG_FLAG,
    authkey,
    ACTION_STATUS,
    UPLOAD_RES_TYPE,
    getFileDownUrl,
    Upload_Retry_Times,
    Upload_Retry_Max_Times,
    proto_uploadPic,
    log
)

// singleton object ConnManager
export let ConnManager =
    lowerBR === false
        ? new HConnManager(
              null,
              getApiUrl,
              ajaxRequestJson,
              ACTION_STATUS,
              longPollingTimeOutErrorCode,
              reportApiQuality,
              log
          )
        : new LConnManager(
              null,
              getApiUrl,
              jsonpRequestId,
              jsonpCallback,
              jsonpLastRspData,
              ACTION_STATUS,
              longPollingTimeOutErrorCode,
              log
          )

// singleton object MsgManager
export let MsgManager = new MsgManagerClass(
    ipList,
    authkey,
    expireTime,
    longPollingDefaultTimeOut,
    LongPollingId,
    proto_getLongPollingId,
    proto_longPolling,
    LONG_POLLINNG_EVENT_TYPE,
    log,
    ACTION_STATUS,
    proto_bigGroupLongPolling,
    tool,
    curBigGroupLongPollingRetErrorCount,
    CONNECTION_STATUS,
    ConnManager,
    longPollingPackageTooLargeErrorCode,
    longPollingTimeOutErrorCode,
    longPollingKickedErrorCode,
    proto_getMsgs,
    MsgStore,
    ctx,
    SESSION_TYPE,
    Session,
    Msg,
    C2C_MSG_SUB_TYPE,
    MSG_ELEMENT_TYPE,
    FRIEND_WRITE_MSG_ACTION,
    proto_getC2CHistoryMsgs,
    proto_getGroupMsgs,
    onLongPullingNotify,
    onAppliedDownloadUrl,
    proto_sendMsg,
    FRIEND_NOTICE_TYPE,
    PROFILE_NOTICE_TYPE,
    GROUP_SYSTEM_TYPE,
    C2C_EVENT_SUB_TYPE,
    proto_logout,
    proto_getIpAndAuthkey,
    proto_getJoinedGroupListHigh,
    curLongPollingRetErrorCount,
    longPollingOffCallbackFlag,
    curLongPollingStatus,
    LONG_POLLING_MAX_RET_ERROR_COUNT,
    longPollingIntervalTime,
    GROUP_MSG_SUB_TYPE,
    GROUP_MSG_PRIORITY_TYPE,
    getFileDownUrl,
    GROUP_TIP_TYPE,
    GROUP_TIP_MODIFY_GROUP_INFO_TYPE
)
