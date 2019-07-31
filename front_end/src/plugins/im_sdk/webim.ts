import Long from './long';
import SparkMD5 from './spark-md5';
import Tool from './tool';
import Log from './log';
import {HConnManager, LConnManager} from './conn-manager';
import MsgStoreClass from './msg-store';
import MsgManagerClass from './msg-manager';


//import {Version} from "../version.js";
const Version = '1.7.3';
/* webim javascript SDK
 */


/* webim API definitions
 */
let msgCache = {};
let webim:any = { // namespace object webim

    /* function init
     *   sdk登录
     * params:
     *   loginInfo      - Object, 登录身份相关参数集合，详见下面
     *   {
     *     sdkAppID     - String, 用户标识接入SDK的应用ID，必填
     *     accountType  - int, 账号类型，必填
     *     identifier   - String, 用户帐号,必须是字符串类型，必填
     *     identifierNick   - String, 用户昵称，选填
     *     userSig      - String, 鉴权Token，必须是字符串类型，必填
     *   }
     *   listeners      - Object, 事件回调函数集合, 详见下面
     *   {
     *     onConnNotify - function(connInfo), 用于收到连接状态相关通知的回调函数,目前未使用
     *     jsonpCallback -function(rspData),//IE9(含)以下浏览器用到的jsonp回调函数
     *     onMsgNotify  - function(newMsgList), 用于收到消息通知的回调函数,
     *      newMsgList为新消息数组，格式为[Msg对象]
     *      使用方有两种处理回调: 1)处理newMsgList中的增量消息,2)直接访问webim.MsgStore获取最新的消息
     *     onGroupInfoChangeNotify  - function(groupInfo), 用于监听群组资料变更的回调函数,
     *          groupInfo为新的群组资料信息
     *     onGroupSystemNotifys - Object, 用于监听（多终端同步）群系统消息的回调函数对象
     *
     *   }
     *   options        - Object, 其它选项, 目前未使用
     * return:
     *   (无)
     */
    login: function (loginInfo:any, listeners:any, options:any) { },

    /* function syncMsgs
     *   拉取最新C2C消息
     *   一般不需要使用方直接调用, SDK底层会自动同步最新消息并通知使用方, 一种有用的调用场景是用户手动触发刷新消息
     * params:
     *   cbOk   - function(msgList)类型, 当同步消息成功时的回调函数, msgList为新消息数组，格式为[Msg对象],
     *            如果此参数为null或undefined则同步消息成功后会像自动同步那样回调cbNotify
     *   cbErr  - function(err)类型, 当同步消息失败时的回调函数, err为错误对象
     * return:
     *   (无)
     */
    syncMsgs: function (cbOk:any, cbErr:any) { },


    /* function getC2CHistoryMsgs
     * 拉取C2C漫游消息
     * params:
     *   options    - 请求参数
     *   cbOk   - function(msgList)类型, 成功时的回调函数, msgList为消息数组，格式为[Msg对象],
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getC2CHistoryMsgs: function (options:any, cbOk:any, cbErr:any) { },

    /* function syncGroupMsgs
     * 拉取群漫游消息
     * params:
     *   options    - 请求参数
     *   cbOk   - function(msgList)类型, 成功时的回调函数, msgList为消息数组，格式为[Msg对象],
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    syncGroupMsgs: function (options:any, cbOk:any, cbErr:any) { },

    /* function sendMsg
     *   发送一条消息
     * params:
     *   msg    - webim.Msg类型, 要发送的消息对象
     *   cbOk   - function()类型, 当发送消息成功时的回调函数
     *   cbErr  - function(err)类型, 当发送消息失败时的回调函数, err为错误对象
     * return:
     *   (无)
     */
    sendMsg: function (msg:any, cbOk:any, cbErr:any) { },

    /* function logout
     *   sdk登出
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    logout: function (cbOk:any, cbErr:any) { },

    /* function setAutoRead
     * 设置会话自动已读上报标志
     * params:
     *   selSess    - webim.Session类型, 当前会话
     *   isOn   - boolean, 将selSess的自动已读消息标志改为isOn，同时是否上报当前会话已读消息
     *   isResetAll - boolean，是否重置所有会话的自动已读标志
     * return:
     *   (无)
     */
    setAutoRead: function (selSess:any, isOn:any, isResetAll:any) { },

    /* function getProfilePortrait
     *   拉取资料（搜索用户）
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getProfilePortrait: function (options:any, cbOk:any, cbErr:any) { },

    /* function setProfilePortrait
     *   设置个人资料
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    setProfilePortrait: function (options:any, cbOk:any, cbErr:any) { },

    /* function applyAddFriend
     *   申请添加好友
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    applyAddFriend: function (options:any, cbOk:any, cbErr:any) { },

    /* function getPendency
     *   拉取好友申请
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getPendency: function (options:any, cbOk:any, cbErr:any) { },

    /* function deletePendency
     *   删除好友申请
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    deletePendency: function (options:any, cbOk:any, cbErr:any) { },

    /* function responseFriend
     *   响应好友申请
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    responseFriend: function (options:any, cbOk:any, cbErr:any) { },

    /* function getAllFriend
     *   拉取我的好友
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getAllFriend: function (options:any, cbOk:any, cbErr:any) { },

    /* function deleteFriend
     *   删除好友
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    deleteFriend: function (options:any, cbOk:any, cbErr:any) { },

    /* function addBlackList
     *   增加黑名单
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    addBlackList: function (options:any, cbOk:any, cbErr:any) { },

    /* function getBlackList
     *   删除黑名单
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getBlackList: function (options:any, cbOk:any, cbErr:any) { },

    /* function deleteBlackList
     *   我的黑名单
     * params:
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    deleteBlackList: function (options:any, cbOk:any, cbErr:any) { },

    /* function uploadPic
     *   上传图片
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    uploadPic: function (options:any, cbOk:any, cbErr:any) { },

    /* function createGroup
     *   创建群
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    createGroup: function (options:any, cbOk:any, cbErr:any) { },

    /* function applyJoinGroup
     *   申请加群
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    applyJoinGroup: function (options:any, cbOk:any, cbErr:any) { },

    /* function handleApplyJoinGroup
     *   处理申请加群(同意或拒绝)
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    handleApplyJoinGroup: function (options:any, cbOk:any, cbErr:any) { },

    /* function deleteApplyJoinGroupPendency
     *   删除加群申请
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    deleteApplyJoinGroupPendency: function (options:any, cbOk:any, cbErr:any) { },


    /* function quitGroup
     *  主动退群
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    quitGroup: function (options:any, cbOk:any, cbErr:any) { },

    /* function getGroupPublicInfo
     *   读取群公开资料-高级接口
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getGroupPublicInfo: function (options:any, cbOk:any, cbErr:any) { },

    /* function getGroupInfo
     *   读取群详细资料-高级接口
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getGroupInfo: function (options:any, cbOk:any, cbErr:any) { },

    /* function modifyGroupBaseInfo
     *   修改群基本资料
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    modifyGroupBaseInfo: function (options:any, cbOk:any, cbErr:any) { },

    /* function destroyGroup
     *  解散群
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    destroyGroup: function (options:any, cbOk:any, cbErr:any) { },

    /* function getJoinedGroupListHigh
     *   获取我的群组-高级接口
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getJoinedGroupListHigh: function (options:any, cbOk:any, cbErr:any) { },

    /* function getGroupMemberInfo
     *   获取群组成员列表
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getGroupMemberInfo: function (options:any, cbOk:any, cbErr:any) { },

    /* function addGroupMember
     *   邀请好友加群
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    addGroupMember: function (options:any, cbOk:any, cbErr:any) { },

    /* function modifyGroupMember
     *   修改群成员资料（角色或者群消息提类型示）
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    modifyGroupMember: function (options:any, cbOk:any, cbErr:any) { },

    /* function forbidSendMsg
     *   设置群成员禁言时间
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    forbidSendMsg: function (options:any, cbOk:any, cbErr:any) { },

    /* function deleteGroupMember
     *   删除群成员
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    deleteGroupMember: function (options:any, cbOk:any, cbErr:any) { },

    /* function getPendencyGroup
     *   获取群组未决列表
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getPendencyGroup: function (options:any, cbOk:any, cbErr:any) { },

    /* function getPendencyReport
     *   好友未决已读上报
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getPendencyReport: function (options:any, cbOk:any, cbErr:any) { },

    /* function getPendencyGroupRead
     *   群组未决已读上报
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    getPendencyGroupRead: function (options:any, cbOk:any, cbErr:any) { },

    /* function sendCustomGroupNotify
     *   发送自定义群通知
     * params:
     *   options    - 请求参数，详见api文档
     *   cbOk   - function()类型, 成功时回调函数
     *   cbErr  - function(err)类型, 失败时回调函数, err为错误对象
     * return:
     *   (无)
     */
    sendCustomGroupNotify: function (options:any, cbOk:any, cbErr:any) { },

    /* class webim.Msg
     *   一条消息的描述类, 消息发送、接收的API中都会涉及此类型的对象
     * properties:
     *   sess   - Session object-ref, 消息所属的会话(e.g:我与好友A的C2C会话，我与群组G的GROUP会话)
     *   isSend - Boolean, true表示是我发出消息, false表示是发给我的消息)
     *   seq    - Integer, 消息序列号, 用于判断消息是否同一条
     *   random - Integer, 消息随机数,用于判断消息是否同一条
     *   time   - Integer, 消息时间戳, 为unix timestamp
     *   fromAccount -String,  消息发送者帐号
     *   subType -Integer,  消息子类型，c2c消息时，0-表示普通消息；群消息时，0-普通消息，1-点赞消息，2-提示消息
     *   fromAccountNick -String,  消息发送者昵称
     *   elems  - Array of webim.Msg.Elem, 描述消息内容的元素列表
     * constructor:
     *   Msg(sess, isSend, seq,random time,fromAccount) - 构造函数, 参数定义同上面properties中定义
     * methods:
     *   addText(text)  - 向elems中添加一个TEXT元素
     *   addFace(face)  - 向elems中添加一个FACE元素
     *   toHtml()       - 转成可展示的html String
     *addFace
     * sub-class webim.Msg.Elem
     *   消息中一个组成元素的描述类, 一条消息的内容被抽象描述为N个元素的有序列表
     * properties:
     *   type   - 元素类型, 目前有TEXT(文本)、FACE(表情)、IMAGE(图片)等
     *   content- 元素内容体, 当TEXT时为String, 当PIC时为UrlString
     * constructor:
     *   Elem(type, content) - 构造函数, 参数定义同上面properties中定义
     *
     * sub-class webim.Msg.Elem.TextElem
     *   文本
     * properties:
     *   text  - String 内容
     * constructor:
     *   TextElem(text) - 构造函数, 参数定义同上面properties中定义
     *
     * sub-class webim.Msg.Elem.FaceElem
     *   表情
     * properties:
     *   index  - Integer 表情索引, 用户自定义
     *   data   - String 额外数据，用户自定义
     * constructor:
     *   FaceElem(index,data) - 构造函数, 参数定义同上面properties中定义
     *
     *
     */
    Msg: function (sess:any, isSend:any, seq:any, random:any, time:any, fromAccount:any, subType:any, fromAccountNick:any, fromAccountHeadurl:any) { /*Class constructor*/ },

    /* singleton object MsgStore
     * webim.MsgStore是消息数据的Model对象(参考MVC概念), 它提供接口访问当前存储的会话和消息数据
     * 下面说明下会话数据类型: Session
     *
     * class Session
     *   一个Session对象描述一个会话，会话可简单理解为最近会话列表的一个条目，它由两个字段唯一标识:
     *     type - String, 会话类型(如"C2C", "GROUP", ...)
     *     id   - String, 会话ID(如C2C类型中为对方帐号,"C2C"时为好友ID,"GROUP"时为群ID)
     * properties:
     *   (Session对象未对外暴露任何属性字段, 所有访问通过下面的getter方法进行)
     * methods:
     *   type()     - String, 返回会话类型,"C2C"表示与好友私聊，"GROUP"表示群聊
     *   id()       - String, 返回会话ID
     *   name()     - String, 返回会话标题(如C2C类型中为对方的昵称,暂不支持)
     *   icon()     - String, 返回会话图标(对C2C类型中为对方的头像URL，暂不支持)
     *   unread()           - Integer, 返回会话未读条数
     *   time()     - Integer, 返回会话最后活跃时间, 为unix timestamp
     *   curMaxMsgSeq() - Integer, 返回会话最大消息序列号
     *   msgCount() - Integer, 返回会话中所有消息条数
     *   msg(index) - webim.Msg, 返回会话中第index条消息
     */
    MsgStore: {
        /* function sessMap
         *   获取所有会话
         * return:
         *   所有会话对象
         */
        sessMap: function () {
            return { /*Object*/ };
        },
        /* function sessCount
         *   获取当前会话的个数
         * return:
         *   Integer, 会话个数
         */
        sessCount: function () {
            return 0;
        },

        /* function sessByTypeId
         *   根据会话类型和会话ID取得相应会话
         * params:
         *   type   - String, 会话类型(如"C2C", "GROUP", ...)
         *   id     - String, 会话ID(如对方ID)
         * return:
         *   Session, 会话对象(说明见上面)
         */
        sessByTypeId: function (type:any, id:any) {
            return { /*Session Object*/ };
        },
        /* function delSessByTypeId
         *   根据会话类型和会话ID删除相应会话
         * params:
         *   type   - String, 会话类型(如"C2C", "GROUP", ...)
         *   id     - String, 会话ID(如对方ID)
         * return:
         *   Boolean, 布尔类型
         */
        delSessByTypeId: function (type:any, id:any) {
            return true;
        },

        /* function resetCookieAndSyncFlag
         *   重置上一次读取新c2c消息Cookie和是否继续拉取标记
         * return:
         *
         */
        resetCookieAndSyncFlag: function () { },

        downloadMap: {}
    }

};

/* webim API implementation
 */
(function (webim) {
    //sdk版本
    const SDK = {
        'VERSION': Version, // sdk版本号
        'APPID': '537048168', //web im sdk 版本 APPID
        'PLAATFORM': "10" // 发送请求时判断其是来自web端的请求
    };

    //是否启用正式环境，默认启用
    let isAccessFormaEnvironment = true;
    // 是否需要进行XSS Filter
    let xssFilterEnable = true;

    //后台接口主机
    const SRV_HOST = {
        'FORMAL': {
            'COMMON': 'https://webim.tim.qq.com',
            'PIC': 'https://pic.tim.qq.com'
        },
        'TEST': {
            'COMMON': 'https://test.tim.qq.com',
            'PIC': 'https://pic.tim.qq.com'
        }
    };

    //浏览器版本信息
    let BROWSER_INFO: any = {};
    //是否为ie9（含）以下
    let lowerBR = false;

    //服务名称
    const SRV_NAME = {
        'OPEN_IM': 'openim', //私聊（拉取未读c2c消息，长轮询，c2c消息已读上报等）服务名
        'GROUP': 'group_open_http_svc', //群组管理（拉取群消息，创建群，群成员管理，群消息已读上报等）服务名
        'FRIEND': 'sns', //关系链管理（好友管理，黑名单管理等）服务名
        'PROFILE': 'profile', //资料管理（查询，设置个人资料等）服务名
        'RECENT_CONTACT': 'recentcontact', //最近联系人服务名
        'PIC': 'openpic', //图片（或文件）服务名
        'BIG_GROUP': 'group_open_http_noauth_svc', //直播大群 群组管理（申请加大群）服务名
        'BIG_GROUP_LONG_POLLING': 'group_open_long_polling_http_noauth_svc', //直播大群 长轮询（拉取消息等）服务名
        'IM_OPEN_STAT': 'imopenstat', //质量上报，统计接口错误率
        'DEL_CHAT': 'recentcontact', //删除会话
        'WEB_IM': 'webim'
    };

    //不同服务对应的版本号
    const SRV_NAME_VER:any = {
        'openim': 'v4',
        'group_open_http_svc': 'v4',
        'sns': 'v4',
        'profile': 'v4',
        'recentcontact': 'v4',
        'openpic': 'v4',
        'group_open_http_noauth_svc': 'v1',
        'group_open_long_polling_http_noauth_svc': 'v1',
        'imopenstat': 'v4',
        'webim': 'v3'
    };

    //不同的命令名对应的上报类型ID，用于接口质量上报
    const CMD_EVENT_ID_MAP:any = {
        'login': 1, //登录
        'pic_up': 3, //上传图片
        'apply_join_group': 9, //申请加入群组
        'create_group': 10, //创建群组
        'longpolling': 18, //普通长轮询
        'send_group_msg': 19, //群聊
        'sendmsg': 20 //私聊
    };

    //聊天类型
    const SESSION_TYPE = {
        'C2C': 'C2C', //私聊
        'GROUP': 'GROUP' //群聊
    };

    //最近联系人类型
    const RECENT_CONTACT_TYPE = {
        'C2C': 1, //好友
        'GROUP': 2 //群
    };

    //消息最大长度（字节）
    const MSG_MAX_LENGTH = {
        'C2C': 12000, //私聊消息
        'GROUP': 8898 //群聊
    };

    //后台接口返回类型
    const ACTION_STATUS = {
        'OK': 'OK', //成功
        'FAIL': 'FAIL' //失败
    };

    const ERROR_CODE_CUSTOM = 99999; //自定义后台接口返回错误码

    //消息元素类型
    const MSG_ELEMENT_TYPE = {
        'TEXT': 'TIMTextElem', //文本
        'FACE': 'TIMFaceElem', //表情
        'IMAGE': 'TIMImageElem', //图片
        'CUSTOM': 'TIMCustomElem', //自定义
        'SOUND': 'TIMSoundElem', //语音,只支持显示
        'FILE': 'TIMFileElem', //文件,只支持显示
        'LOCATION': 'TIMLocationElem', //地理位置
        'GROUP_TIP': 'TIMGroupTipElem' //群提示消息,只支持显示
    };

    //图片类型
    const IMAGE_TYPE = {
        'ORIGIN': 1, //原图
        'LARGE': 2, //缩略大图
        'SMALL': 3 //缩略小图
    };
    //图片格式
    const IMAGE_FORMAT = {
        JPG: 0x1,
        JPEG: 0x1,
        GIF: 0x2,
        PNG: 0x3,
        BMP: 0x4,
        UNKNOWN: 0xff
    };

    //上传资源包类型
    const UPLOAD_RES_PKG_FLAG = {
        'RAW_DATA': 0, //原始数据
        'BASE64_DATA': 1 //base64编码数据
    };

    //下载文件配置
    const DOWNLOAD_FILE = {
        'BUSSINESS_ID': '10001', //下载文件业务ID
        'AUTH_KEY': '617574686b6579', //下载文件authkey
        'SERVER_IP': '182.140.186.147', //下载文件服务器IP
        'SOUND_SERVER_DOMAIN': 'grouptalk.c2c.qq.com'
    };

    //下载文件类型
    const DOWNLOAD_FILE_TYPE = {
        "SOUND": 2106, //语音
        "FILE": 2107 //普通文件
    };

    //上传资源类型
    const UPLOAD_RES_TYPE = {
        "IMAGE": 1, //图片
        "FILE": 2, //文件
        "SHORT_VIDEO": 3, //短视频
        "SOUND": 4 //语音，PTT
    };

    //版本号，用于上传图片或文件接口
    const VERSION_INFO = {
        'APP_VERSION': '2.1', //应用版本号
        'SERVER_VERSION': 1 //服务端版本号
    };

    //长轮询消息类型
    const LONG_POLLINNG_EVENT_TYPE = {
        "C2C": 1 //新的c2c消息通知
        ,
        "GROUP_COMMON": 3 //新的群普通消息
        ,
        "GROUP_TIP": 4 //新的群提示消息
        ,
        "GROUP_SYSTEM": 5 //新的群系统消息
        ,
        "GROUP_TIP2": 6 //新的群提示消息2
        ,
        "FRIEND_NOTICE": 7 //好友系统通知
        ,
        "PROFILE_NOTICE": 8 //资料系统通知
        ,
        "C2C_COMMON": 9 //新的C2C消息
        ,
        "C2C_EVENT": 10
    };

    //c2c消息子类型
    const C2C_MSG_SUB_TYPE = {
        "COMMON": 0 //普通消息
    };
    //c2c消息子类型
    const C2C_EVENT_SUB_TYPE = {
        "READED": 92, //已读消息同步
        "KICKEDOUT": 96
    };

    //群消息子类型
    const GROUP_MSG_SUB_TYPE = {
        "COMMON": 0, //普通消息
        "LOVEMSG": 1, //点赞消息
        "TIP": 2, //提示消息
        "REDPACKET": 3 //红包消息
    };

    //群消息优先级类型
    const GROUP_MSG_PRIORITY_TYPE = {
        "REDPACKET": 1, //红包消息
        "COMMON": 2, //普通消息
        "LOVEMSG": 3 //点赞消息
    };

    //群提示消息类型
    const GROUP_TIP_TYPE:any = {
        "JOIN": 1, //加入群组
        "QUIT": 2, //退出群组
        "KICK": 3, //被踢出群组
        "SET_ADMIN": 4, //被设置为管理员
        "CANCEL_ADMIN": 5, //被取消管理员
        "MODIFY_GROUP_INFO": 6, //修改群资料
        "MODIFY_MEMBER_INFO": 7 //修改群成员信息
    };

    //群提示消息-群资料变更类型
    const GROUP_TIP_MODIFY_GROUP_INFO_TYPE = {
        "FACE_URL": 1, //修改群头像URL
        "NAME": 2, //修改群名称
        "OWNER": 3, //修改群主
        "NOTIFICATION": 4, //修改群公告
        "INTRODUCTION": 5 //修改群简介
    };

    //群系统消息类型
    const GROUP_SYSTEM_TYPE = {
        "JOIN_GROUP_REQUEST": 1, //申请加群请求（只有管理员会收到）
        "JOIN_GROUP_ACCEPT": 2, //申请加群被同意（只有申请人能够收到）
        "JOIN_GROUP_REFUSE": 3, //申请加群被拒绝（只有申请人能够收到）
        "KICK": 4, //被管理员踢出群(只有被踢者接收到)
        "DESTORY": 5, //群被解散(全员接收)
        "CREATE": 6, //创建群(创建者接收, 不展示)
        "INVITED_JOIN_GROUP_REQUEST": 7, //邀请加群(被邀请者接收)
        "QUIT": 8, //主动退群(主动退出者接收, 不展示)
        "SET_ADMIN": 9, //设置管理员(被设置者接收)
        "CANCEL_ADMIN": 10, //取消管理员(被取消者接收)
        "REVOKE": 11, //群已被回收(全员接收, 不展示)
        "READED": 15, //群消息已读同步
        "CUSTOM": 255, //用户自定义通知(默认全员接收)
        "INVITED_JOIN_GROUP_REQUEST_AGREE": 12, //邀请加群(被邀请者需同意)
    };

    //好友系统通知子类型
    const FRIEND_NOTICE_TYPE = {
        "FRIEND_ADD": 1, //好友表增加
        "FRIEND_DELETE": 2, //好友表删除
        "PENDENCY_ADD": 3, //未决增加
        "PENDENCY_DELETE": 4, //未决删除
        "BLACK_LIST_ADD": 5, //黑名单增加
        "BLACK_LIST_DELETE": 6, //黑名单删除
        "PENDENCY_REPORT": 7, //未决已读上报
        "FRIEND_UPDATE": 8 //好友数据更新
    };

    //资料系统通知子类型
    const PROFILE_NOTICE_TYPE = {
        "PROFILE_MODIFY": 1 //资料修改
    };

    //腾讯登录服务错误码（用于托管模式）
    const TLS_ERROR_CODE = {
        'OK': 0, //成功
        'SIGNATURE_EXPIRATION': 11 //用户身份凭证过期
    };

    //长轮询连接状态
    const CONNECTION_STATUS = {
        'INIT': -1, //初始化
        'ON': 0, //连接正常
        'RECONNECT': 1, //连接恢复正常
        'OFF': 9999 //连接已断开,可能是用户网络问题，或者长轮询接口报错引起的
    };

    const UPLOAD_PIC_BUSSINESS_TYPE = { //图片业务类型
        'GROUP_MSG': 1, //私聊图片
        'C2C_MSG': 2, //群聊图片
        'USER_HEAD': 3, //用户头像
        'GROUP_HEAD': 4 //群头像
    };

    const FRIEND_WRITE_MSG_ACTION = { //好友输入消息状态
        'ING': 14, //正在输入
        'STOP': 15 //停止输入
    };

    //ajax默认超时时间，单位：毫秒
    let ajaxDefaultTimeOut = 15000;

    //大群长轮询接口返回正常时，延时一定时间再发起下一次请求
    const OK_DELAY_TIME = 1000;

    //大群长轮询接口发生错误时，延时一定时间再发起下一次请求
    const ERROR_DELAY_TIME = 5000;

    //群提示消息最多显示人数
    const GROUP_TIP_MAX_USER_COUNT = 10;

    //长轮询连接状态
    let curLongPollingStatus = CONNECTION_STATUS.INIT;

    //当长轮询连接断开后，是否已经回调过
    let longPollingOffCallbackFlag = false;

    //当前长轮询返回错误次数
    let curLongPollingRetErrorCount = 0;

    //长轮询默认超时时间，单位：毫秒
    let longPollingDefaultTimeOut = 60000;

    //长轮询返回错误次数达到一定值后，发起新的长轮询请求间隔时间，单位：毫秒
    let longPollingIntervalTime = 5000;

    //没有新消息时，长轮询返回60008错误码是正常的
    let longPollingTimeOutErrorCode = 60008;

    //多实例登录被kick的错误码
    let longPollingKickedErrorCode = 91101;

    let longPollingPackageTooLargeErrorCode = 10018;

    let LongPollingId:any = null;

    //当前大群长轮询返回错误次数
    let curBigGroupLongPollingRetErrorCount = 0;

    //最大允许长轮询返回错误次数
    const LONG_POLLING_MAX_RET_ERROR_COUNT = 10;

    //上传重试累计
    let Upload_Retry_Times = 0;
    //最大上传重试
    let Upload_Retry_Max_Times = 20;

    //ie7/8/9采用jsonp方法解决ajax跨域限制
    let jsonpRequestId = 0; //jsonp请求id
    //最新jsonp请求返回的json数据
    let jsonpLastRspData:any = null;
    //兼容ie7/8/9,jsonp回调函数
    let jsonpCallback:any = null;

    let uploadResultIframeId = 0; //用于上传图片的iframe id

    let ipList:any = []; //文件下载地址
    let authkey:any = null; //文件下载票据
    let expireTime = null; //文件下载票据超时时间

    //错误码
    let ERROR = {};
    //当前登录用户
    let ctx:any = {
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
    };
    let opt:any = {};
    let xmlHttpObjSeq = 0; //ajax请求id
    let xmlHttpObjMap:any = {}; //发起的ajax请求
    let curSeq = 0; //消息seq
    let tempC2CMsgList:any = []; //新c2c消息临时缓存
    let tempC2CHistoryMsgList:any = []; //漫游c2c消息临时缓存

    let maxApiReportItemCount = 20; //一次最多上报条数
    let apiReportItems:any = []; //暂存api接口质量上报数据
    let onLongPullingNotify:any = null;

    let Resources:any = {
        downloadMap: {}
    };

    let onAppliedDownloadUrl:any = null;

    //表情标识字符和索引映射关系对象，用户可以自定义
    const emotionDataIndexs = {
        "[惊讶]": 0,
        "[撇嘴]": 1,
        "[色]": 2,
        "[发呆]": 3,
        "[得意]": 4,
        "[流泪]": 5,
        "[害羞]": 6,
        "[闭嘴]": 7,
        "[睡]": 8,
        "[大哭]": 9,
        "[尴尬]": 10,
        "[发怒]": 11,
        "[调皮]": 12,
        "[龇牙]": 13,
        "[微笑]": 14,
        "[难过]": 15,
        "[酷]": 16,
        "[冷汗]": 17,
        "[抓狂]": 18,
        "[吐]": 19,
        "[偷笑]": 20,
        "[可爱]": 21,
        "[白眼]": 22,
        "[傲慢]": 23,
        "[饿]": 24,
        "[困]": 25,
        "[惊恐]": 26,
        "[流汗]": 27,
        "[憨笑]": 28,
        "[大兵]": 29,
        "[奋斗]": 30,
        "[咒骂]": 31,
        "[疑问]": 32,
        "[嘘]": 33,
        "[晕]": 34
    };

    //表情对象，用户可以自定义
    let emotions = {};

    //日志对象
    const log = new Log(true)

    //工具类
    const tool = new Tool(xssFilterEnable, ACTION_STATUS, log)
    //获取unix时间戳
    let unixtime = function (d = new Date()):number {
        // if (!d) d = new Date();
        return Math.round(d.getTime() / 1000);
    };
    //时间戳转日期
    let fromunixtime = function (t:any) {
        return new Date(t * 1000);
    };
    //获取下一个消息序号
    let nextSeq = function () {
        if (curSeq) {
            curSeq = curSeq + 1;
        } else {
            curSeq = Math.round(Math.random() * 10000000);
        }
        return curSeq;
    };
    //产生随机数
    let createRandom = function () {
        return Math.round(Math.random() * 4294967296);
    };

    //获取ajax请求对象
    let getXmlHttp = function () {
        let xmlhttp = null;
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
        xmlhttp = new XMLHttpRequest();
        return xmlhttp;
    }
    //发起ajax请求
    let ajaxRequest = function (meth:any, url:any, req:any, timeout:any, content_type:any, isLongPolling:any, cbOk:any, cbErr:any) {

        let xmlHttpObj:any = getXmlHttp();

        let error, errInfo;
        if (!xmlHttpObj) {
            errInfo = "创建请求失败";
            let error = tool.getReturnError(errInfo, -1);
            log.error(errInfo);
            if (cbErr) cbErr(error);
            return;
        }
        //保存ajax请求对象
        xmlHttpObjSeq++;
        xmlHttpObjMap[xmlHttpObjSeq] = xmlHttpObj;

        xmlHttpObj.open(meth, url, true);
        xmlHttpObj.onreadystatechange = function () {
            if (xmlHttpObj.readyState == 4) {
                xmlHttpObjMap[xmlHttpObjSeq] = null; //清空
                if (xmlHttpObj.status == 200) {
                    if (cbOk) cbOk(xmlHttpObj.responseText);
                    xmlHttpObj = null;
                    curLongPollingRetErrorCount = curBigGroupLongPollingRetErrorCount = 0;
                } else {
                    xmlHttpObj = null;
                    //避免刷新的时候，由于abord ajax引起的错误回调
                    setTimeout(function () {
                        let errInfo = "请求服务器失败,请检查你的网络是否正常";
                        let error = tool.getReturnError(errInfo, -2);
                        //if (!isLongPolling && cbErr) cbErr(error);
                        if (isLongPolling && onLongPullingNotify) {
                            onLongPullingNotify(error);
                        }
                        if (cbErr) cbErr(error);
                    }, 16);
                }
            }
        };
        xmlHttpObj.setRequestHeader('Content-Type', content_type);
        //设置超时时间
        if (!timeout) {
            timeout = ajaxDefaultTimeOut; //设置ajax默认超时时间
        }
        if (timeout) {
            xmlHttpObj.timeout = timeout;
            xmlHttpObj.ontimeout = function (event:any) {
                xmlHttpObj = null;
                //let errInfo = "请求服务器超时";
                //let error = tool.getReturnError(errInfo, -3);
                //if (cbErr) cbErr(error);
            };
        }
        //
        if (xmlHttpObj.overrideMimeType) {
            // xmlHttpObj.overrideMimeType("application/json;charset=utf-8");
        }

        xmlHttpObj.send(req);
    }
    //发起ajax请求（json格式数据）
    let ajaxRequestJson = function (meth:any, url:any, req:any, timeout:any, content_type:any, isLongPolling:any, cbOk:any, cbErr:any) {
        ajaxRequest(meth, url, JSON.stringify(req), timeout, content_type, isLongPolling, function (resp:any) {
            let json = null;
            if (resp) json = JSON.parse(resp); //将返回的json字符串转换成json对象
            if (isLongPolling && onLongPullingNotify) {
                onLongPullingNotify(json);
            }
            if (cbOk) cbOk(json);
        }, cbErr);
    }
    //判断用户是否已登录
    let isLogin = function () {
        return ctx.sdkAppID && ctx.identifier;
    };
    //检查是否登录
    let checkLogin = function (cbErr:any, isNeedCallBack:any) {
        if (!isLogin()) {
            if (isNeedCallBack) {
                let errInfo = "请登录";
                let error = tool.getReturnError(errInfo, -4);

                if (cbErr) cbErr(error);
            }
            return false;
        }
        return true;
    };

    //检查是否访问正式环境
    let isAccessFormalEnv = function () {
        return isAccessFormaEnvironment;
    };

    //根据不同的服务名和命令，获取对应的接口地址
    let getApiUrl = function (srvName:any, cmd:any, cbOk:any, cbErr:any) {
        let srvHost:any = SRV_HOST;
        if (isAccessFormalEnv()) {
            srvHost = SRV_HOST.FORMAL.COMMON;
        } else {
            srvHost = SRV_HOST.TEST.COMMON;
        }

        //if (srvName == SRV_NAME.RECENT_CONTACT) {
        //    srvHost = SRV_HOST.TEST.COMMON;
        //}

        if (srvName == SRV_NAME.PIC) {
            if (isAccessFormalEnv()) {
                srvHost = SRV_HOST.FORMAL.PIC;
            } else {
                srvHost = SRV_HOST.TEST.PIC;
            }
        }

        let url = srvHost + '/' + SRV_NAME_VER[srvName] + '/' + srvName + '/' + cmd + '?websdkappid=' + SDK.APPID + "&v=" + SDK.VERSION + "&platform=" + SDK.PLAATFORM;;

        if (isLogin()) {
            if (cmd == 'login' || cmd == 'accesslayer') {
                url += '&identifier=' + encodeURIComponent(ctx.identifier) + '&usersig=' + ctx.userSig;
            } else {
                if (ctx.tinyid && ctx.a2) {
                    url += '&tinyid=' + ctx.tinyid + '&a2=' + ctx.a2;
                } else {
                    if (cbErr) {
                        log.error("tinyid或a2为空[" + srvName + "][" + cmd + "]");
                        cbErr(tool.getReturnError("tinyid或a2为空[" + srvName + "][" + cmd + "]", -5));
                        return false;
                    }
                }
            }
            url += '&contenttype=' + ctx.contentType;
        }
        url += '&sdkappid=' + ctx.sdkAppID + '&accounttype=' + ctx.accountType + '&apn=' + ctx.apn + '&reqtime=' + unixtime();
        return url;
    };

    //获取语音下载url
    let getSoundDownUrl = function (uuid:any, senderId:any) {
        let soundUrl = null;
        if (authkey && ipList[0]) {
            // soundUrl = "http://" + ipList[0] + "/asn.com/stddownload_common_file?authkey=" + authkey + "&bid=" + DOWNLOAD_FILE.BUSSINESS_ID + "&subbid=" + ctx.sdkAppID + "&fileid=" + uuid + "&filetype=" + DOWNLOAD_FILE_TYPE.SOUND + "&openid=" + senderId + "&ver=0";
            soundUrl = "https://" + DOWNLOAD_FILE.SOUND_SERVER_DOMAIN + "/asn.com/stddownload_common_file?authkey=" + authkey + "&bid=" + DOWNLOAD_FILE.BUSSINESS_ID + "&subbid=" + ctx.sdkAppID + "&fileid=" + uuid + "&filetype=" + DOWNLOAD_FILE_TYPE.SOUND + "&openid=" + senderId + "&ver=0";
        } else {
            log.error("拼接语音下载url不报错：ip或者authkey为空");
        }
        return soundUrl;
    };

    //获取文件下载地址
    let getFileDownUrl = function (uuid:any, senderId:any, fileName:any) {
        let fileUrl = null;
        if (authkey && ipList[0]) {
            fileUrl = "http://" + ipList[0] + "/asn.com/stddownload_common_file?authkey=" + authkey + "&bid=" + DOWNLOAD_FILE.BUSSINESS_ID + "&subbid=" + ctx.sdkAppID + "&fileid=" + uuid + "&filetype=" + DOWNLOAD_FILE_TYPE.FILE + "&openid=" + senderId + "&ver=0&filename=" + encodeURIComponent(fileName);
        } else {
            log.error("拼接文件下载url不报错：ip或者authkey为空");
        }
        Resources.downloadMap["uuid_" + uuid] = fileUrl;
        return fileUrl;
    };

    //获取文件下载地址
    let getFileDownUrlV2 = function (uuid:any, senderId:any, fileName:any, downFlag:any, receiverId:any, busiId:any, type:any) {
        let options:any = {
            "From_Account": senderId, //"identifer_0",       // 类型: String, 发送者tinyid
            "To_Account": receiverId, //"identifer_1",         // 类型: String, 接收者tinyid
            "os_platform": 10, // 类型: Number, 终端的类型 1(android) 2(ios) 3(windows) 10(others...)
            "Timestamp": unixtime().toString(), // 类型: Number, 时间戳
            "Random": createRandom().toString(), // 类型: Number, 随机值
            "request_info": [ // 类型: Array
                {
                    "busi_id": busiId, // 类型: Number, 群(1) C2C(2) 其他请联系sdk开发者分配
                    "download_flag": downFlag, // 类型: Number, 申请下载地址标识  0(申请架平下载地址)  1(申请COS平台下载地址)  2(不需要申请, 直接拿url下载(这里应该不会为2))
                    "type": type, // 类型: Number, 0(短视频缩略图), 1(文件), 2(短视频), 3(ptt), 其他待分配
                    "uuid": uuid, // 类型: Number, 唯一标识一个文件的uuid
                    "version": VERSION_INFO.SERVER_VERSION, // 类型: Number, 架平server版本
                    "auth_key": authkey, // 类型: String, 认证签名
                    "ip": ipList[0] // 类型: Number, 架平IP
                }
            ]
        };
        //获取下载地址
        proto_applyDownload(options, function (resp:any) {
            if (resp.error_code == 0 && resp.response_info) {
                Resources.downloadMap["uuid_" + options.uuid] = resp.response_info.url;
            }
            if (onAppliedDownloadUrl) {
                onAppliedDownloadUrl({
                    uuid: options.uuid,
                    url: resp.response_info.url,
                    maps: Resources.downloadMap
                });
            }
        }, function (resp:any) {
            log.error("获取下载地址失败", options.uuid)
        });
    };


    //重置ajax请求
    let clearXmlHttpObjMap = function () {
        //遍历xmlHttpObjMap{}
        for (let seq in xmlHttpObjMap) {
            let xmlHttpObj = xmlHttpObjMap[seq];
            if (xmlHttpObj) {
                xmlHttpObj.abort(); //中断ajax请求(长轮询)
                xmlHttpObjMap[xmlHttpObjSeq] = null; //清空
            }
        }
        xmlHttpObjSeq = 0;
        xmlHttpObjMap = {};
    };

    //重置sdk全局变量
    let clearSdk = function () {

        clearXmlHttpObjMap();

        //当前登录用户
        ctx = {
            sdkAppID: null,
            appIDAt3rd: null,
            accountType: null,
            identifier: null,
            identifierNick: null,
            userSig: null,
            contentType: 'json',
            apn: 1
        };
        opt = {};

        curSeq = 0;

        //ie8,9采用jsonp方法解决ajax跨域限制
        jsonpRequestId = 0; //jsonp请求id
        //最新jsonp请求返回的json数据
        jsonpLastRspData = null;

        apiReportItems = [];

        MsgManager.clear();
        MsgStore.clear();

        //重置longpollingId
        LongPollingId = null;
    };

    //登录
    let _login = function (loginInfo:any, listeners:any, options:any, cbOk:any, cbErr:any) {

        clearSdk();

        if (options) opt = options;
        if (opt.isAccessFormalEnv == false) {
            log.error("请切换为正式环境！！！！");
            isAccessFormaEnvironment = opt.isAccessFormalEnv;
        }
        if (opt.isLogOn == false) {
            log.setOn(opt.isLogOn);
        }
        if (typeof opt.xssFilterEnable !== 'undefined') {
            xssFilterEnable = opt.xssFilterEnable;
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
                cbErr(tool.getReturnError("loginInfo is empty", -6));
                return;
            }
        }
        if (!loginInfo.sdkAppID) {
            if (cbErr) {
                cbErr(tool.getReturnError("loginInfo.sdkAppID is empty", -7));
                return;
            }
        }
        // if (!loginInfo.accountType) {
        //     if (cbErr) {
        //         cbErr(tool.getReturnError("loginInfo.accountType is empty", -8));
        //         return;
        //     }
        // }

        if (loginInfo.identifier) {
            ctx.identifier = loginInfo.identifier.toString();
        }
        if (loginInfo.identifier && !loginInfo.userSig) {
            if (cbErr) {
                cbErr(tool.getReturnError("loginInfo.userSig is empty", -9));
                return;
            }
        }
        if (loginInfo.userSig) {
            ctx.userSig = loginInfo.userSig.toString();
        }
        ctx.sdkAppID = loginInfo.sdkAppID;
        ctx.accountType = Math.ceil(Math.random() * 10000);

        if (ctx.identifier && ctx.userSig) { //带登录态
            proto_accesslayer(function () {
                //登录
                proto_login(
                    function (identifierNick:any, headurl:any) {
                        MsgManager.init(
                            listeners,
                            function (mmInitResp:any) {
                                if (cbOk) {
                                    mmInitResp.identifierNick = identifierNick;
                                    mmInitResp.headurl = headurl;
                                    cbOk(mmInitResp);
                                }
                            }, cbErr
                        );
                    },
                    cbErr
                );
            })
        } else { //不带登录态，进入直播场景sdk
            MsgManager.init(
                listeners,
                cbOk,
                cbErr
            );
        }
    };

    //初始化浏览器信息
    let initBrowserInfo = function () {
        //初始化浏览器类型
        BROWSER_INFO = tool.getBrowserInfo();
        log.info('BROWSER_INFO: type=' + BROWSER_INFO.type + ', ver=' + BROWSER_INFO.ver);
        if (BROWSER_INFO.type == "ie") {
            if (parseInt(BROWSER_INFO.ver) < 10) {
                lowerBR = true;
            }
        }
    };

    //接口质量上报
    let reportApiQuality = function (cmd:any, errorCode:any, errorInfo:any) {
        if (cmd == 'longpolling' && (errorCode == longPollingTimeOutErrorCode || errorCode == longPollingKickedErrorCode)) { //longpolling 返回60008错误可以视为正常,可以不上报
            return;
        }
        let eventId = CMD_EVENT_ID_MAP[cmd];
        if (eventId) {
            let reportTime = unixtime();
            let uniqKey = null;
            let msgCmdErrorCode = {
                'Code': errorCode,
                'ErrMsg': errorInfo
            };
            if (ctx.a2) {
                uniqKey = ctx.a2.substring(0, 10) + "_" + reportTime + "_" + createRandom();
            } else if (ctx.userSig) {
                uniqKey = ctx.userSig.substring(0, 10) + "_" + reportTime + "_" + createRandom();
            }

            if (uniqKey) {

                let rptEvtItem = {
                    "UniqKey": uniqKey,
                    "EventId": eventId,
                    "ReportTime": reportTime,
                    "MsgCmdErrorCode": msgCmdErrorCode
                };

                if (cmd == 'login') {
                    let loginApiReportItems:any = [];
                    loginApiReportItems.push(rptEvtItem);
                    let loginReportOpt = {
                        "EvtItems": loginApiReportItems,
                        "MainVersion": SDK.VERSION,
                        "Version": "0"
                    };
                    proto_reportApiQuality(loginReportOpt,
                        function (resp:any) {
                            loginApiReportItems = null; //
                        },
                        function (err:any) {
                            loginApiReportItems = null; //
                        }
                    );
                } else {
                    apiReportItems.push(rptEvtItem);
                    if (apiReportItems.length >= maxApiReportItemCount) { //累计一定条数再上报
                        let reportOpt = {
                            "EvtItems": apiReportItems,
                            "MainVersion": SDK.VERSION,
                            "Version": "0"
                        };
                        proto_reportApiQuality(reportOpt,
                            function (resp:any) {
                                apiReportItems = []; //清空
                            },
                            function (err:any) {
                                apiReportItems = []; //清空
                            }
                        );
                    }
                }

            }
        }
    };

    let proto_accesslayer = function (callback:any) {
        ConnManager.apiCall(SRV_NAME.WEB_IM, "accesslayer", {}, function (data:any) {
            if (data.ErrorCode === 0 && data.WebImAccessLayer === 1) {
                SRV_HOST.FORMAL.COMMON = 'https://events.tim.qq.com';
            }
            callback();
        }, function () {
            callback();
        });
    };
    // REST API calls
    //上线
    let proto_login = function (cbOk:any, cbErr:any) {
        ConnManager.apiCall(SRV_NAME.OPEN_IM, "login", {
            "State": "Online"
        },
            function (loginResp:any) {
                if (loginResp.TinyId) {
                    ctx.tinyid = loginResp.TinyId;
                } else {
                    if (cbErr) {
                        cbErr(tool.getReturnError("TinyId is empty", -10));
                        return;
                    }
                }
                if (loginResp.A2Key) {
                    ctx.a2 = loginResp.A2Key;
                } else {
                    if (cbErr) {
                        cbErr(tool.getReturnError("A2Key is empty", -11));
                        return;
                    }
                }
                let tag_list = [
                    "Tag_Profile_IM_Nick",
                    "Tag_Profile_IM_Image"
                ];
                let options = {
                    'From_Account': ctx.identifier,
                    'To_Account': [ctx.identifier],
                    'LastStandardSequence': 0,
                    'TagList': tag_list
                };
                proto_getProfilePortrait(
                    options,
                    function (resp:any) {
                        let nick, image;
                        if (resp.UserProfileItem && resp.UserProfileItem.length > 0) {
                            for (let i in resp.UserProfileItem) {
                                for (let j in resp.UserProfileItem[i].ProfileItem) {
                                    switch (resp.UserProfileItem[i].ProfileItem[j].Tag) {
                                        case 'Tag_Profile_IM_Nick':
                                            nick = resp.UserProfileItem[i].ProfileItem[j].Value;
                                            if (nick) ctx.identifierNick = nick;
                                            break;
                                        case 'Tag_Profile_IM_Image':
                                            image = resp.UserProfileItem[i].ProfileItem[j].Value;
                                            if (image) ctx.headurl = image;
                                            break;
                                    }
                                }
                            }
                        }
                        if (cbOk) cbOk(ctx.identifierNick, ctx.headurl); //回传当前用户昵称
                    }, cbErr);
            }, cbErr);
    };
    //下线
    let proto_logout = function (type:any, cbOk:any = undefined, cbErr:any = undefined) {
        if (!checkLogin(cbErr, false)) { //不带登录态
            clearSdk();
            if (cbOk) cbOk({
                'ActionStatus': ACTION_STATUS.OK,
                'ErrorCode': 0,
                'ErrorInfo': 'logout success'
            });
            return;
        }
        if (type == "all") {
            ConnManager.apiCall(SRV_NAME.OPEN_IM, "logout", {},
                function (resp:any) {
                    clearSdk();
                    if (cbOk) cbOk(resp);
                },
                cbErr);
        } else {
            ConnManager.apiCall(SRV_NAME.OPEN_IM, "longpollinglogout", {
                LongPollingId: LongPollingId
            },
                function (resp:any) {
                    clearSdk();
                    if (cbOk) cbOk(resp);
                },
                cbErr);
        }
    };
    //发送消息，包括私聊和群聊
    let proto_sendMsg = function (msg:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        let msgInfo:any = null;

        switch (msg.sess.type()) {
            case SESSION_TYPE.C2C:
                msgInfo = {
                    'From_Account': ctx.identifier,
                    'To_Account': msg.sess.id().toString(),
                    'MsgTimeStamp': msg.time,
                    'MsgSeq': msg.seq,
                    'MsgRandom': msg.random,
                    'MsgBody': [],
                    'OfflinePushInfo': msg.offlinePushInfo
                };
                break;
            case SESSION_TYPE.GROUP:
                let subType = msg.getSubType();
                msgInfo = {
                    'GroupId': msg.sess.id().toString(),
                    'From_Account': ctx.identifier,
                    'Random': msg.random,
                    'MsgBody': []
                };
                switch (subType) {
                    case GROUP_MSG_SUB_TYPE.COMMON:
                        msgInfo.MsgPriority = "COMMON";
                        break;
                    case GROUP_MSG_SUB_TYPE.REDPACKET:
                        msgInfo.MsgPriority = "REDPACKET";
                        break;
                    case GROUP_MSG_SUB_TYPE.LOVEMSG:
                        msgInfo.MsgPriority = "LOVEMSG";
                        break;
                    case GROUP_MSG_SUB_TYPE.TIP:
                        log.error("不能主动发送群提示消息,subType=" + subType);
                        break;
                    default:
                        log.error("发送群消息时，出现未知子消息类型：subType=" + subType);
                        return;
                        break;
                }
                break;
            default:
                break;
        }

        for (let i in msg.elems) {
            let elem = msg.elems[i];
            let msgContent = null;
            let msgType = elem.type;
            switch (msgType) {
                case MSG_ELEMENT_TYPE.TEXT: //文本
                    msgContent = {
                        'Text': elem.content.text
                    };
                    break;
                case MSG_ELEMENT_TYPE.FACE: //表情
                    msgContent = {
                        'Index': elem.content.index,
                        'Data': elem.content.data
                    };
                    break;
                case MSG_ELEMENT_TYPE.IMAGE: //图片
                    let ImageInfoArray = [];
                    for (let j in elem.content.ImageInfoArray) {
                        ImageInfoArray.push({
                            'Type': elem.content.ImageInfoArray[j].type,
                            'Size': elem.content.ImageInfoArray[j].size,
                            'Width': elem.content.ImageInfoArray[j].width,
                            'Height': elem.content.ImageInfoArray[j].height,
                            'URL': elem.content.ImageInfoArray[j].url
                        });
                    }
                    msgContent = {
                        'ImageFormat': elem.content.ImageFormat,
                        'UUID': elem.content.UUID,
                        'ImageInfoArray': ImageInfoArray
                    };
                    break;
                case MSG_ELEMENT_TYPE.SOUND: //
                    log.warn('web端暂不支持发送语音消息');
                    continue;
                    break;
                case MSG_ELEMENT_TYPE.LOCATION: //
                    log.warn('web端暂不支持发送地理位置消息');
                    continue;
                    break;
                case MSG_ELEMENT_TYPE.FILE: //
                    msgContent = {
                        'UUID': elem.content.uuid,
                        'FileName': elem.content.name,
                        'FileSize': elem.content.size,
                        'DownloadFlag': elem.content.downFlag
                    };
                    break;
                case MSG_ELEMENT_TYPE.CUSTOM: //
                    msgContent = {
                        'Data': elem.content.data,
                        'Desc': elem.content.desc,
                        'Ext': elem.content.ext
                    };
                    msgType = MSG_ELEMENT_TYPE.CUSTOM;
                    break;
                default:
                    log.warn('web端暂不支持发送' + elem.type + '消息');
                    continue;
                    break;
            }

            if (msg.PushInfoBoolean) {
                msgInfo.OfflinePushInfo = msg.PushInfo; //当android终端进程被杀掉时才走push，IOS退到后台即可
            }

            msgInfo.MsgBody.push({
                'MsgType': msgType,
                'MsgContent': msgContent
            });
        }
        if (msg.sess.type() == SESSION_TYPE.C2C) { //私聊
            ConnManager.apiCall(SRV_NAME.OPEN_IM, "sendmsg", msgInfo, cbOk, cbErr);
        } else if (msg.sess.type() == SESSION_TYPE.GROUP) { //群聊
            ConnManager.apiCall(SRV_NAME.GROUP, "send_group_msg", msgInfo, cbOk, cbErr);
        }
    };
    //长轮询接口
    let proto_longPolling = function (options:any, cbOk:any, cbErr:any) {
        // if (!isAccessFormaEnvironment && typeof stopPolling != "undefined" && stopPolling == true) {
        //     return;
        // }
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.OPEN_IM, "longpolling", options, cbOk, cbErr, longPollingDefaultTimeOut, true);
    };

    //长轮询接口(拉取直播聊天室新消息)
    let proto_bigGroupLongPolling = function (options:any, cbOk:any, cbErr:any, timeout:any) {
        ConnManager.apiCall(SRV_NAME.BIG_GROUP_LONG_POLLING, "get_msg", options, cbOk, cbErr, timeout);
    };

    //拉取未读c2c消息接口
    let proto_getMsgs = function (cookie:any, syncFlag:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.OPEN_IM, "getmsg", {
            'Cookie': cookie,
            'SyncFlag': syncFlag
        },
            function (resp:any) {

                if (resp.MsgList && resp.MsgList.length) {
                    for (let i in resp.MsgList) {
                        tempC2CMsgList.push(resp.MsgList[i]);
                    }
                }
                if (resp.SyncFlag == 1) {
                    proto_getMsgs(resp.Cookie, resp.SyncFlag, cbOk, cbErr);
                } else {
                    resp.MsgList = tempC2CMsgList;
                    tempC2CMsgList = [];
                    if (cbOk) cbOk(resp);
                }
            },
            cbErr);
    };
    //C2C消息已读上报接口
    let proto_c2CMsgReaded = function (cookie:any, c2CMsgReadedItem:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        let tmpC2CMsgReadedItem = [];
        for (let i in c2CMsgReadedItem) {
            let item = {
                'To_Account': c2CMsgReadedItem[i].toAccount,
                'LastedMsgTime': c2CMsgReadedItem[i].lastedMsgTime
            };
            tmpC2CMsgReadedItem.push(item);
        }
        ConnManager.apiCall(SRV_NAME.OPEN_IM, "msgreaded", {
            C2CMsgReaded: {
                'Cookie': cookie,
                'C2CMsgReadedItem': tmpC2CMsgReadedItem
            }
        }, cbOk, cbErr);
    };

    //删除c2c消息
    let proto_deleteC2CMsg = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.OPEN_IM, "deletemsg", options,
            cbOk, cbErr);
    };

    //拉取c2c历史消息接口
    let proto_getC2CHistoryMsgs = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.OPEN_IM, "getroammsg", options,
            function (resp:any) {
                let reqMsgCount = options.MaxCnt;
                let complete = resp.Complete;
                let rspMsgCount = resp.MaxCnt;
                let msgKey = resp.MsgKey;
                let lastMsgTime = resp.LastMsgTime;

                if (resp.MsgList && resp.MsgList.length) {
                    for (let i in resp.MsgList) {
                        tempC2CHistoryMsgList.push(resp.MsgList[i]);
                    }
                }
                let netxOptions = null;
                if (complete == 0) { //还有历史消息可拉取
                    if (rspMsgCount < reqMsgCount) {
                        netxOptions = {
                            'Peer_Account': options.Peer_Account,
                            'MaxCnt': reqMsgCount - rspMsgCount,
                            'LastMsgTime': lastMsgTime,
                            'MsgKey': msgKey
                        };
                    }
                }

                if (netxOptions) { //继续拉取
                    proto_getC2CHistoryMsgs(netxOptions, cbOk, cbErr);
                } else {
                    resp.MsgList = tempC2CHistoryMsgList;
                    tempC2CHistoryMsgList = [];
                    if (cbOk) cbOk(resp);
                }
            },
            cbErr);
    };

    //群组接口
    //创建群组
    //协议参考：https://www.qcloud.com/doc/product/269/1615
    let proto_createGroup = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        let opt:any = {
            //必填    群组形态，包括Public（公开群），Private（私有群），ChatRoom（聊天室），AVChatRoom（互动直播聊天室）。
            'Type': options.Type,
            //必填    群名称，最长30字节。
            'Name': options.Name
        };
        let member_list = [];

        //Array 选填  初始群成员列表，最多500个。成员信息字段详情参见：群成员资料。
        for (let i = 0; i < options.MemberList.length; i++) {
            member_list.push({
                'Member_Account': options.MemberList[i]
            })
        }
        opt.MemberList = member_list;
        //选填    为了使得群组ID更加简单，便于记忆传播，腾讯云支持APP在通过REST API创建群组时自定义群组ID。详情参见：自定义群组ID。
        if (options.GroupId) {
            opt.GroupId = options.GroupId;
        }
        //选填    群主id，自动添加到群成员中。如果不填，群没有群主。
        if (options.Owner_Account) {
            opt.Owner_Account = options.Owner_Account;
        }
        //选填    群简介，最长240字节。
        if (options.Introduction) {
            opt.Introduction = options.Introduction;
        }
        //选填    群公告，最长300字节。
        if (options.Notification) {
            opt.Notification = options.Notification;
        }
        //选填    最大群成员数量，最大为10000，不填默认为2000个。
        if (options.MaxMemberCount) {
            opt.MaxMemberCount = options.MaxMemberCount;
        }
        //选填    申请加群处理方式。包含FreeAccess（自由加入），NeedPermission（需要验证），DisableApply（禁止加群），不填默认为NeedPermission（需要验证）。
        if (options.ApplyJoinOption) { //
            opt.ApplyJoinOption = options.ApplyJoinOption;
        }
        //Array 选填  群组维度的自定义字段，默认情况是没有的，需要开通，详情参见：自定义字段。
        if (options.AppDefinedData) {
            opt.AppDefinedData = options.AppDefinedData;
        }
        //选填    群头像URL，最长100字节。
        if (options.FaceUrl) {
            opt.FaceUrl = options.FaceUrl;
        }
        ConnManager.apiCall(SRV_NAME.GROUP, "create_group", opt,
            cbOk, cbErr);
    };

    //创建群组-高级接口
    //协议参考：https://www.qcloud.com/doc/product/269/1615
    let proto_createGroupHigh = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.GROUP, "create_group", options,
            cbOk, cbErr);
    };

    //修改群组基本资料
    //协议参考：https://www.qcloud.com/doc/product/269/1620
    let proto_modifyGroupBaseInfo = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "modify_group_base_info", options,
            cbOk, cbErr);
    };

    //申请加群
    let proto_applyJoinGroup = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        options.GroupId = String(options.GroupId)
        ConnManager.apiCall(SRV_NAME.GROUP, "apply_join_group", {
            'GroupId': options.GroupId,
            'ApplyMsg': options.ApplyMsg,
            'UserDefinedField': options.UserDefinedField
        },
            cbOk, cbErr);
    };

    //申请加入大群
    // let BigGroupId;
    let proto_applyJoinBigGroup = function (options:any, cbOk:any, cbErr:any) {
        options.GroupId = String(options.GroupId)
        //BigGroupId = options.GroupId;
        let srvName;
        if (!checkLogin(cbErr, false)) { //未登录
            srvName = SRV_NAME.BIG_GROUP;
        } else { //已登录
            srvName = SRV_NAME.GROUP;
        }
        if (MsgManager.checkBigGroupLongPollingOn(options.GroupId)) {
            cbErr && cbErr(tool.getReturnError("Join Group failed; You have already been in this group, you have to quit group before you rejoin", 10013));
            return;
        }
        ConnManager.apiCall(srvName, "apply_join_group", {
            'GroupId': options.GroupId,
            'ApplyMsg': options.ApplyMsg,
            'UserDefinedField': options.UserDefinedField
        },
            function (resp:any) {
                if (resp.JoinedStatus && resp.JoinedStatus === 'JoinedSuccess') {
                    if (resp.LongPollingKey) {
                        MsgManager.setBigGroupLongPollingOn(true); //开启长轮询
                        MsgManager.setBigGroupLongPollingKey(options.GroupId, resp.LongPollingKey); //更新大群长轮询key
                        MsgManager.setBigGroupLongPollingMsgMap(options.GroupId, 0); //收到的群消息置0
                        MsgManager.bigGroupLongPolling(options.GroupId); //开启长轮询
                    } else { //没有返回LongPollingKey，说明申请加的群不是直播聊天室(AVChatRoom)
                        cbErr && cbErr(tool.getReturnError("Join Group succeed; But the type of group is not AVChatRoom: groupid=" + options.GroupId, -12));
                        return;
                    }
                }
                if (cbOk) cbOk(resp);
            },
            function (err:any) {

                if (cbErr) cbErr(err);
            });
    };

    //处理加群申请(同意或拒绝)
    let proto_handleApplyJoinGroupPendency = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "handle_apply_join_group", {
            'GroupId': options.GroupId,
            'Applicant_Account': options.Applicant_Account,
            'HandleMsg': options.HandleMsg,
            'Authentication': options.Authentication,
            'MsgKey': options.MsgKey,
            'ApprovalMsg': options.ApprovalMsg,
            'UserDefinedField': options.UserDefinedField
        },
            cbOk,
            function (err:any) {
                if (err.ErrorCode === 10024) { //apply has be handled
                    if (cbOk) {
                        let resp = {
                            'ActionStatus': ACTION_STATUS.OK,
                            'ErrorCode': 0,
                            'ErrorInfo': '该申请已经被处理过'
                        };
                        cbOk(resp);
                    }
                } else {
                    if (cbErr) cbErr(err);
                }
            }
        );
    };

    //获取群组未决列表
    let proto_getPendencyGroup = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "get_pendency", {
            'StartTime': options.StartTime,
            'Limit': options.Limit,
            'Handle_Account': ctx.identifier
        },
            cbOk,
            function (err:any) {

            }
        );
    };


    //群组未决已经上报
    let proto_getPendencyGroupRead = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "report_pendency", {
            'ReportTime': options.ReportTime,
            'From_Account': ctx.identifier
        },
            cbOk,
            function (err:any) {

            }
        );
    };

    //处理被邀请进群申请(同意或拒绝)
    let proto_handleInviteJoinGroupRequest = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "handle_invite_join_group", {
            'GroupId': options.GroupId,
            'Inviter_Account': options.Inviter_Account,
            'HandleMsg': options.HandleMsg,
            'Authentication': options.Authentication,
            'MsgKey': options.MsgKey,
            'ApprovalMsg': options.ApprovalMsg,
            'UserDefinedField': options.UserDefinedField
        },
            cbOk,
            function (err:any) {

            }
        );
    };

    //主动退群
    let proto_quitGroup = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "quit_group", {
            'GroupId': options.GroupId
        },
            cbOk, cbErr);
    };

    //退出大群
    let proto_quitBigGroup = function (options:any, cbOk:any, cbErr:any) {
        let srvName;
        if (!checkLogin(cbErr, false)) { //未登录
            srvName = SRV_NAME.BIG_GROUP;
        } else { //已登录
            srvName = SRV_NAME.GROUP;
        }
        MsgManager.resetBigGroupLongPollingInfo(options.GroupId);
        ConnManager.apiCall(srvName, "quit_group", {
            'GroupId': options.GroupId
        },
            function (resp:any) {

                MsgStore.delSessByTypeId(SESSION_TYPE.GROUP, options.GroupId);
                //重置当前再请求中的ajax
                //clearXmlHttpObjMap();
                //退出大群成功之后需要重置长轮询信息 - bigGroupLongPollingKeyMap
                // MsgManager.resetBigGroupLongPollingInfo();
                if (cbOk) cbOk(resp);
            },
            cbErr);
    };
    //查找群(按名称)
    let proto_searchGroupByName = function (options:any, cbOk:any, cbErr:any) {
        ConnManager.apiCall(SRV_NAME.GROUP, "search_group", options, cbOk, cbErr);
    };

    //获取群组公开资料
    let proto_getGroupPublicInfo = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "get_group_public_info", {
            'GroupIdList': options.GroupIdList,
            'ResponseFilter': {
                'GroupBasePublicInfoFilter': options.GroupBasePublicInfoFilter
            }
        },
            function (resp:any) {
                resp.ErrorInfo = '';
                if (resp.GroupInfo) {
                    for (let i in resp.GroupInfo) {
                        let errorCode = resp.GroupInfo[i].ErrorCode;
                        if (errorCode > 0) {
                            resp.ActionStatus = ACTION_STATUS.FAIL;
                            resp.GroupInfo[i].ErrorInfo = "[" + errorCode + "]" + resp.GroupInfo[i].ErrorInfo;
                            resp.ErrorInfo += resp.GroupInfo[i].ErrorInfo + '\n';
                        }
                    }
                }
                if (resp.ActionStatus == ACTION_STATUS.FAIL) {
                    if (cbErr) {
                        cbErr(resp);
                    }
                } else if (cbOk) {
                    cbOk(resp);
                }

            },
            cbErr);
    };

    //获取群组详细资料--高级
    //请求协议参考：https://www.qcloud.com/doc/product/269/1616
    let proto_getGroupInfo = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        let opt:any = {
            'GroupIdList': options.GroupIdList,
            'ResponseFilter': {
                'GroupBaseInfoFilter': options.GroupBaseInfoFilter,
                'MemberInfoFilter': options.MemberInfoFilter
            }
        };
        if (options.AppDefinedDataFilter_Group) {
            opt.ResponseFilter.AppDefinedDataFilter_Group = options.AppDefinedDataFilter_Group;
        }
        if (options.AppDefinedDataFilter_GroupMember) {
            opt.ResponseFilter.AppDefinedDataFilter_GroupMember = options.AppDefinedDataFilter_GroupMember;
        }
        ConnManager.apiCall(SRV_NAME.GROUP, "get_group_info", opt,
            cbOk, cbErr);
    };

    //获取群组成员-高级接口
    //协议参考：https://www.qcloud.com/doc/product/269/1617
    let proto_getGroupMemberInfo = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "get_group_member_info", {
            'GroupId': options.GroupId,
            'Offset': options.Offset,
            'Limit': options.Limit,
            'MemberInfoFilter': options.MemberInfoFilter,
            'MemberRoleFilter': options.MemberRoleFilter,
            'AppDefinedDataFilter_GroupMember': options.AppDefinedDataFilter_GroupMember
        },
            cbOk, cbErr);
    };


    //增加群组成员
    //协议参考：https://www.qcloud.com/doc/product/269/1621
    let proto_addGroupMember = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "add_group_member", {
            'GroupId': options.GroupId,
            'Silence': options.Silence,
            'MemberList': options.MemberList
        },
            cbOk, cbErr);
    };
    //修改群组成员资料
    //协议参考：https://www.qcloud.com/doc/product/269/1623
    let proto_modifyGroupMember = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        let opt:any = {};
        if (options.GroupId) {
            opt.GroupId = options.GroupId;
        }
        if (options.Member_Account) {
            opt.Member_Account = options.Member_Account;
        }
        //Admin或者Member
        if (options.Role) {
            opt.Role = options.Role;
        }
        // AcceptAndNotify代表解收并提示消息，Discard代表不接收也不提示消息，AcceptNotNotify代表接收消息但不提示
        if (options.MsgFlag) {
            opt.MsgFlag = options.MsgFlag;
        }
        if (options.ShutUpTime) { //禁言时间
            opt.ShutUpTime = options.ShutUpTime;
        }
        if (options.NameCard) { //群名片,最大不超过50个字节
            opt.NameCard = options.NameCard;
        }
        if (options.AppMemberDefinedData) { //群成员维度的自定义字段，默认情况是没有的，需要开通
            opt.AppMemberDefinedData = options.AppMemberDefinedData;
        }
        ConnManager.apiCall(SRV_NAME.GROUP, "modify_group_member_info", opt,
            cbOk, cbErr);
    };
    //删除群组成员
    //协议参考：https://www.qcloud.com/doc/product/269/1622
    let proto_deleteGroupMember = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "delete_group_member", {
            'GroupId': options.GroupId,
            'Silence': options.Silence,
            'MemberToDel_Account': options.MemberToDel_Account,
            'Reason': options.Reason
        },
            cbOk, cbErr);
    };
    //解散群组
    //协议参考：https://www.qcloud.com/doc/product/269/1624
    let proto_destroyGroup = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "destroy_group", {
            'GroupId': options.GroupId
        },
            cbOk, cbErr);
    };
    //转让群组
    //协议参考：https://www.qcloud.com/doc/product/269/1633
    let proto_changeGroupOwner = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.GROUP, "change_group_owner", options, cbOk, cbErr);
    };
    //获取用户所加入的群组-高级接口
    //协议参考：https://www.qcloud.com/doc/product/269/1625
    let proto_getJoinedGroupListHigh = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "get_joined_group_list", {
            'Member_Account': options.Member_Account,
            'Limit': options.Limit,
            'Offset': options.Offset,
            'GroupType': options.GroupType,
            'ResponseFilter': {
                'GroupBaseInfoFilter': options.GroupBaseInfoFilter,
                'SelfInfoFilter': options.SelfInfoFilter
            }
        },
            cbOk, cbErr);
    };
    //查询一组UserId在群中的身份
    //协议参考：https://www.qcloud.com/doc/product/269/1626
    let proto_getRoleInGroup = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "get_role_in_group", {
            'GroupId': options.GroupId,
            'User_Account': options.User_Account
        },
            cbOk, cbErr);
    };
    //设置取消成员禁言时间
    //协议参考：https://www.qcloud.com/doc/product/269/1627
    let proto_forbidSendMsg = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        ConnManager.apiCall(SRV_NAME.GROUP, "forbid_send_msg", {
            'GroupId': options.GroupId,
            'Members_Account': options.Members_Account,
            'ShutUpTime': options.ShutUpTime //单位为秒，为0时表示取消禁言
        },
            cbOk, cbErr);
    };

    //发送自定义群系统通知
    let proto_sendCustomGroupNotify = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.GROUP, "send_group_system_notification", options,
            cbOk, cbErr);
    };

    //拉取群消息接口
    let proto_getGroupMsgs = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.GROUP, "group_msg_get", {
            "GroupId": options.GroupId,
            "ReqMsgSeq": options.ReqMsgSeq,
            "ReqMsgNumber": options.ReqMsgNumber
        },
            cbOk, cbErr);
    };
    //群消息已读上报接口
    let proto_groupMsgReaded = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.GROUP, "msg_read_report", {
            'GroupId': options.GroupId,
            'MsgReadedSeq': options.MsgReadedSeq
        },
            cbOk, cbErr);
    };
    //end

    //好友接口
    //处理好友接口返回的错误码
    let convertErrorEn2ZhFriend = function (resp:any) {
        let errorAccount = [];
        if (resp.Fail_Account && resp.Fail_Account.length) {
            errorAccount = resp.Fail_Account;
        }
        if (resp.Invalid_Account && resp.Invalid_Account.length) {
            for (let k in resp.Invalid_Account) {
                errorAccount.push(resp.Invalid_Account[k]);
            }
        }
        if (errorAccount.length) {
            resp.ActionStatus = ACTION_STATUS.FAIL;
            resp.ErrorCode = ERROR_CODE_CUSTOM;
            resp.ErrorInfo = '';
            for (let i in errorAccount) {
                let failCount = errorAccount[i];
                for (let j in resp.ResultItem) {
                    if (resp.ResultItem[j].To_Account == failCount) {

                        let resultCode = resp.ResultItem[j].ResultCode;
                        resp.ResultItem[j].ResultInfo = "[" + resultCode + "]" + resp.ResultItem[j].ResultInfo;
                        resp.ErrorInfo += resp.ResultItem[j].ResultInfo + "\n";
                        break;
                    }
                }
            }
        }
        return resp;
    };
    //添加好友
    let proto_applyAddFriend = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "friend_add", {
            'From_Account': ctx.identifier,
            'AddFriendItem': options.AddFriendItem
        },
            function (resp:any) {
                let newResp = convertErrorEn2ZhFriend(resp);
                if (newResp.ActionStatus == ACTION_STATUS.FAIL) {
                    if (cbErr) cbErr(newResp);
                } else if (cbOk) {
                    cbOk(newResp);
                }
            }, cbErr);
    };
    //删除好友
    let proto_deleteFriend = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "friend_delete", {
            'From_Account': ctx.identifier,
            'To_Account': options.To_Account,
            'DeleteType': options.DeleteType
        },
            function (resp:any) {
                let newResp = convertErrorEn2ZhFriend(resp);
                if (newResp.ActionStatus == ACTION_STATUS.FAIL) {
                    if (cbErr) cbErr(newResp);
                } else if (cbOk) {
                    cbOk(newResp);
                }
            }, cbErr);
    };
    //删除会话
    let proto_deleteChat = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;

        if (options.chatType == 1) {
            ConnManager.apiCall(SRV_NAME.DEL_CHAT, "delete", {
                'From_Account': ctx.identifier,
                'Type': options.chatType,
                'To_Account': options.To_Account
            },
                cbOk, cbErr);
        } else {
            ConnManager.apiCall(SRV_NAME.DEL_CHAT, "delete", {
                'From_Account': ctx.identifier,
                'Type': options.chatType,
                'ToGroupid': options.To_Account
            },
                cbOk, cbErr);

        }

    };
    //获取好友申请
    let proto_getPendency = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "pendency_get", {
            "From_Account": ctx.identifier,
            "PendencyType": options.PendencyType,
            "StartTime": options.StartTime,
            "MaxLimited": options.MaxLimited,
            "LastSequence": options.LastSequence
        },
            cbOk, cbErr);
    };
    //好友申请已读上报
    let proto_getPendencyReport = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "PendencyReport", {
            "From_Account": ctx.identifier,
            "LatestPendencyTimeStamp": options.LatestPendencyTimeStamp
        },
            cbOk, cbErr);
    };
    //删除好友申请
    let proto_deletePendency = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "pendency_delete", {
            "From_Account": ctx.identifier,
            "PendencyType": options.PendencyType,
            "To_Account": options.To_Account

        },
            function (resp:any) {
                let newResp = convertErrorEn2ZhFriend(resp);
                if (newResp.ActionStatus == ACTION_STATUS.FAIL) {
                    if (cbErr) cbErr(newResp);
                } else if (cbOk) {
                    cbOk(newResp);
                }
            }, cbErr);
    };
    //处理好友申请
    let proto_responseFriend = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "friend_response", {
            'From_Account': ctx.identifier,
            'ResponseFriendItem': options.ResponseFriendItem
        },
            function (resp:any) {
                let newResp = convertErrorEn2ZhFriend(resp);
                if (newResp.ActionStatus == ACTION_STATUS.FAIL) {
                    if (cbErr) cbErr(newResp);
                } else if (cbOk) {
                    cbOk(newResp);
                }
            }, cbErr);
    };
    //我的好友
    let proto_getAllFriend = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "friend_get_all", {
            'From_Account': ctx.identifier,
            'TimeStamp': options.TimeStamp,
            'StartIndex': options.StartIndex,
            'GetCount': options.GetCount,
            'LastStandardSequence': options.LastStandardSequence,
            'TagList': options.TagList
        },
            cbOk, cbErr);
    };

    //资料接口
    //查看个人资料
    let proto_getProfilePortrait = function (options:any, cbOk:any, cbErr:any) {
        if (options.To_Account.length > 100) {
            options.To_Account.length = 100;
            log.error('获取用户资料人数不能超过100人')
        }
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.PROFILE, "portrait_get", {
            'From_Account': ctx.identifier,
            'To_Account': options.To_Account,
            //'LastStandardSequence':options.LastStandardSequence,
            'TagList': options.TagList
        },
            function (resp:any) {
                let errorAccount = [];
                if (resp.Fail_Account && resp.Fail_Account.length) {
                    errorAccount = resp.Fail_Account;
                }
                if (resp.Invalid_Account && resp.Invalid_Account.length) {
                    for (let k in resp.Invalid_Account) {
                        errorAccount.push(resp.Invalid_Account[k]);
                    }
                }
                if (errorAccount.length) {
                    resp.ActionStatus = ACTION_STATUS.FAIL;
                    resp.ErrorCode = ERROR_CODE_CUSTOM;
                    resp.ErrorInfo = '';
                    for (let i in errorAccount) {
                        let failCount = errorAccount[i];
                        for (let j in resp.UserProfileItem) {
                            if (resp.UserProfileItem[j].To_Account == failCount) {
                                let resultCode = resp.UserProfileItem[j].ResultCode;
                                resp.UserProfileItem[j].ResultInfo = "[" + resultCode + "]" + resp.UserProfileItem[j].ResultInfo;
                                resp.ErrorInfo += "账号:" + failCount + "," + resp.UserProfileItem[j].ResultInfo + "\n";
                                break;
                            }
                        }
                    }
                }
                if (resp.ActionStatus == ACTION_STATUS.FAIL) {
                    if (cbErr) cbErr(resp);
                } else if (cbOk) {
                    cbOk(resp);
                }
            },
            cbErr);
    };

    //设置个人资料
    let proto_setProfilePortrait = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.PROFILE, "portrait_set", {
            'From_Account': ctx.identifier,
            'ProfileItem': options.ProfileItem
        },
            function (resp:any) {
                for (let i in options.ProfileItem) {
                    let profile = options.ProfileItem[i];
                    if (profile.Tag == 'Tag_Profile_IM_Nick') {
                        ctx.identifierNick = profile.Value; //更新昵称
                        break;
                    }
                }
                if (cbOk) cbOk(resp);
            }, cbErr);
    };

    //增加黑名单
    let proto_addBlackList = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "black_list_add", {
            'From_Account': ctx.identifier,
            'To_Account': options.To_Account
        },
            function (resp:any) {
                let newResp = convertErrorEn2ZhFriend(resp);
                if (newResp.ActionStatus == ACTION_STATUS.FAIL) {
                    if (cbErr) cbErr(newResp);
                } else if (cbOk) {
                    cbOk(newResp);
                }
            }, cbErr);
    };

    //删除黑名单
    let proto_deleteBlackList = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "black_list_delete", {
            'From_Account': ctx.identifier,
            'To_Account': options.To_Account
        },
            function (resp:any) {
                let newResp = convertErrorEn2ZhFriend(resp);
                if (newResp.ActionStatus == ACTION_STATUS.FAIL) {
                    if (cbErr) cbErr(newResp);
                } else if (cbOk) {
                    cbOk(newResp);
                }
            }, cbErr);
    };

    //我的黑名单
    let proto_getBlackList = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.FRIEND, "black_list_get", {
            'From_Account': ctx.identifier,
            'StartIndex': options.StartIndex,
            'MaxLimited': options.MaxLimited,
            'LastSequence': options.LastSequence
        },
            cbOk, cbErr);
    };

    //获取最近联系人
    let proto_getRecentContactList = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.RECENT_CONTACT, "get", {
            'From_Account': ctx.identifier,
            'Count': options.Count
        },
            cbOk, cbErr);
    };

    //上传图片或文件
    let proto_uploadPic = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        let cmdName;
        if (isAccessFormalEnv()) {
            cmdName = 'pic_up';
        } else {
            cmdName = 'pic_up_test';
        }
        ConnManager.apiCall(SRV_NAME.PIC, cmdName, {
            'App_Version': VERSION_INFO.APP_VERSION,
            'From_Account': ctx.identifier,
            'To_Account': options.To_Account,
            'Seq': options.Seq,
            'Timestamp': options.Timestamp,
            'Random': options.Random,
            'File_Str_Md5': options.File_Str_Md5,
            'File_Size': options.File_Size,
            'File_Type': options.File_Type,
            'Server_Ver': VERSION_INFO.SERVER_VERSION,
            'Auth_Key': authkey,
            'Busi_Id': options.Busi_Id,
            'PkgFlag': options.PkgFlag,
            'Slice_Offset': options.Slice_Offset,
            'Slice_Size': options.Slice_Size,
            'Slice_Data': options.Slice_Data,
            'content_type': "application/x-www-form-urlencoded"
        },
            cbOk, cbErr);
    };

    //获取语音和文件下载IP和authkey
    let proto_getIpAndAuthkey = function (cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.OPEN_IM, "authkey", {}, cbOk, cbErr);
    };

    //接口质量上报
    let proto_reportApiQuality = function (options:any, cbOk:any, cbErr:any) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.IM_OPEN_STAT, "web_report", options, cbOk, cbErr);
    };


    let proto_getLongPollingId = function (options:any, cbOk:any = undefined, cbErr:any = undefined) {
        if (!checkLogin(cbErr, true)) return;
        ConnManager.apiCall(SRV_NAME.OPEN_IM, "getlongpollingid", {},
            function (resp:any) {
                cbOk && cbOk(resp);
            }, cbErr);
    }


    let proto_applyDownload = function (options:any, cbOk:any, cbErr:any) {
        //把下载地址push到map中
        ConnManager.apiCall(SRV_NAME.PIC, "apply_download", options, cbOk, cbErr);
    }

    //end
    initBrowserInfo();
    // singleton object ConnManager
    let ConnManager = lowerBR === false ? new HConnManager(null, getApiUrl, ajaxRequestJson, ACTION_STATUS, longPollingTimeOutErrorCode, reportApiQuality, log) : new LConnManager(null, getApiUrl, jsonpRequestId, jsonpCallback, jsonpLastRspData, ACTION_STATUS, longPollingTimeOutErrorCode, log);
    // class Session
    let Session:any = function (type:any, id:any, name:any, icon:any, time:any, seq:any) {
        this._impl = {
            skey: Session.skey(type, id),
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
    };
    Session.skey = function (type, id) {
        return type + id;
    };
    Session.prototype.type = function () {
        return this._impl.type;
    };
    Session.prototype.id = function () {
        return this._impl.id;
    };
    Session.prototype.name = function () {
        return this._impl.name;
    };
    Session.prototype.icon = function () {
        return this._impl.icon;
    };
    Session.prototype.unread = function (val) {
        if (typeof val !== 'undefined') {
            this._impl.unread = val;
        } else {
            return this._impl.unread;
        }
    };
    Session.prototype.isFinished = function (val) {
        if (typeof val !== 'undefined') {
            this._impl.isFinished = val;
        } else {
            return this._impl.isFinished;
        }
    };
    Session.prototype.time = function () {
        return this._impl.time;
    };
    Session.prototype.curMaxMsgSeq = function (seq) {
        if (typeof seq !== 'undefined') {
            this._impl.curMaxMsgSeq = seq;
        } else {
            return this._impl.curMaxMsgSeq;
        }
    };
    Session.prototype.msgCount = function () {
        return this._impl.msgs.length;
    };
    Session.prototype.msg = function (index) {
        return this._impl.msgs[index];
    };
    Session.prototype.msgs = function () {
        return this._impl.msgs;
    };
    Session.prototype._impl_addMsg = function (msg, unread) {
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
    //class C2CMsgReadedItem
    let C2CMsgReadedItem = function (toAccount, lastedMsgTime) {
        this.toAccount = toAccount;
        this.lastedMsgTime = lastedMsgTime;
    }

    let calcUniqId = function (num1, num2) {
        let str1 = parseInt(num1).toString(2) + '00000000000000000000000000000000';
        let str2 = parseInt(num2).toString(2);
        let arr1 = str1.split('').reverse();
        let arr2 = str2.split('').reverse();
        let sig = null,
            res = [];
        let length = arr1.length > arr2.length ? arr1.length : arr2.length;
        for (let a = 0; a < length; a++) {
            sig = Number(arr1[a] || 0) || Number(arr2[a] || 0);
            res.push(sig);
        }
        let numstr = res.reverse().join("");
        let long = {
            high: "0x" + parseInt(numstr.substr(0, numstr.length - 32), 2).toString(16),
            low: "0x" + parseInt(numstr.substr(numstr.length - 32 - 1), 2).toString(16)
        }
        let longVal = new Long(long.low, long.high, true);
        return longVal.toString();
    };
    // class Msg
    let Msg:any = function (sess, isSend, seq, random, time, fromAccount, subType, fromAccountNick, fromAccountHeadurl) {
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
    Msg.prototype.getSession = function () {
        return this.sess;
    };
    Msg.prototype.getType = function () {
        return this.subType;
    };
    Msg.prototype.getSubType = function () {
        return this.subType;
    };
    Msg.prototype.getFromAccount = function () {
        return this.fromAccount;
    };
    Msg.prototype.getFromAccountNick = function () {
        return this.fromAccountNick;
    };
    Msg.prototype.getIsSend = function () {
        return this.isSend;
    };
    Msg.prototype.getSeq = function () {
        return this.seq;
    };
    Msg.prototype.getTime = function () {
        return this.time;
    };
    Msg.prototype.getRandom = function () {
        return this.random;
    };
    Msg.prototype.getElems = function () {
        return this.elems;
    };
    Msg.prototype.getMsgUniqueId = function () {
        return this.uniqueId;
    };
    //文本
    Msg.prototype.addText = function (text) {
        this.addElem(new webim.Msg.Elem(MSG_ELEMENT_TYPE.TEXT, text));
    };
    //表情
    Msg.prototype.addFace = function (face) {
        this.addElem(new webim.Msg.Elem(MSG_ELEMENT_TYPE.FACE, face));
    };
    //图片
    Msg.prototype.addImage = function (image) {
        this.addElem(new webim.Msg.Elem(MSG_ELEMENT_TYPE.IMAGE, image));
    };
    //地理位置
    Msg.prototype.addLocation = function (location) {
        this.addElem(new webim.Msg.Elem(MSG_ELEMENT_TYPE.LOCATION, location));
    };
    //文件
    Msg.prototype.addFile = function (file) {
        this.addElem(new webim.Msg.Elem(MSG_ELEMENT_TYPE.FILE, file));
    };
    //自定义
    Msg.prototype.addCustom = function (custom) {
        this.addElem(new webim.Msg.Elem(MSG_ELEMENT_TYPE.CUSTOM, custom));
    };
    Msg.prototype.addElem = function (elem) {
        this.elems.push(elem);
    };
    Msg.prototype.toHtml = function () {
        let html = "";
        for (let i in this.elems) {
            let elem = this.elems[i];
            html += elem.toHtml();
        }
        return html;
    };

    // 暴力点 直接添加，内部的配置不细写
    Msg.prototype.setOfflinePushInfo = function (offlinePushInfo) {
        this.offlinePushInfo = offlinePushInfo;
    };

    // class Msg.Elem
    Msg.Elem = function (type, value) {
        this.type = type;
        this.content = value;
    };
    Msg.Elem.prototype.getType = function () {
        return this.type;
    };
    Msg.Elem.prototype.getContent = function () {
        return this.content;
    };
    Msg.Elem.prototype.toHtml = function () {
        let html;
        html = this.content.toHtml();
        return html;
    };

    // class Msg.Elem.Text
    Msg.Elem.Text = function (text) {
        this.text = tool.xssFilter(text);
    };
    Msg.Elem.Text.prototype.getText = function () {
        return this.text;
    };
    Msg.Elem.Text.prototype.toHtml = function () {
        return this.text;
    };

    // class Msg.Elem.Face
    Msg.Elem.Face = function (index, data) {
        this.index = index;
        this.data = data;
    };
    Msg.Elem.Face.prototype.getIndex = function () {
        return this.index;
    };
    Msg.Elem.Face.prototype.getData = function () {
        return this.data;
    };
    Msg.Elem.Face.prototype.toHtml = function () {
        let faceUrl = null;
        let index = emotionDataIndexs[this.data];
        let emotion = emotions[index];
        if (emotion && emotion[1]) {
            faceUrl = emotion[1];
        }
        if (faceUrl) {
            return "<img src='" + faceUrl + "'/>";
        } else {
            return this.data;
        }
    };

    // 地理位置消息 class Msg.Elem.Location
    Msg.Elem.Location = function (longitude, latitude, desc) {
        this.latitude = latitude; //纬度
        this.longitude = longitude; //经度
        this.desc = desc; //描述
    };
    Msg.Elem.Location.prototype.getLatitude = function () {
        return this.latitude;
    };
    Msg.Elem.Location.prototype.getLongitude = function () {
        return this.longitude;
    };
    Msg.Elem.Location.prototype.getDesc = function () {
        return this.desc;
    };
    Msg.Elem.Location.prototype.toHtml = function () {
        return '经度=' + this.longitude + ',纬度=' + this.latitude + ',描述=' + this.desc;
    };

    //图片消息
    // class Msg.Elem.Images
    Msg.Elem.Images = function (imageId, format) {
        this.UUID = imageId;
        if (typeof format !== 'number') {
            format = parseInt(IMAGE_FORMAT[format] || IMAGE_FORMAT['UNKNOWN'], 10);
        }
        this.ImageFormat = format;
        this.ImageInfoArray = [];
    };
    Msg.Elem.Images.prototype.addImage = function (image) {
        this.ImageInfoArray.push(image);
    };
    Msg.Elem.Images.prototype.toHtml = function () {
        let smallImage = this.getImage(IMAGE_TYPE.SMALL);
        let bigImage = this.getImage(IMAGE_TYPE.LARGE);
        let oriImage = this.getImage(IMAGE_TYPE.ORIGIN);
        if (!bigImage) {
            bigImage = smallImage;
        }
        if (!oriImage) {
            oriImage = smallImage;
        }
        return "<img src='" + smallImage.getUrl() + "#" + bigImage.getUrl() + "#" + oriImage.getUrl() + "' style='CURSOR: hand' id='" + this.getImageId() + "' bigImgUrl='" + bigImage.getUrl() + "' onclick='imageClick(this)' />";

    };
    Msg.Elem.Images.prototype.getImageId = function () {
        return this.UUID;
    };
    Msg.Elem.Images.prototype.getImageFormat = function () {
        return this.ImageFormat;
    };
    Msg.Elem.Images.prototype.getImage = function (type) {
        for (let i in this.ImageInfoArray) {
            if (this.ImageInfoArray[i].getType() == type) {
                return this.ImageInfoArray[i];
            }
        }
        let img = null;
        this.ImageInfoArray.forEach(function (image) {
            if (image.getType() == type) {
                img = image;
            }
        })
        return img;
    };
    // class Msg.Elem.Images.Image
    Msg.Elem.Images.Image = function (type, size, width, height, url) {
        this.type = type;
        this.size = size;
        this.width = width;
        this.height = height;
        this.url = url;
    };
    Msg.Elem.Images.Image.prototype.getType = function () {
        return this.type;
    };
    Msg.Elem.Images.Image.prototype.getSize = function () {
        return this.size;
    };
    Msg.Elem.Images.Image.prototype.getWidth = function () {
        return this.width;
    };
    Msg.Elem.Images.Image.prototype.getHeight = function () {
        return this.height;
    };
    Msg.Elem.Images.Image.prototype.getUrl = function () {
        return this.url;
    };

    // class Msg.Elem.Sound
    Msg.Elem.Sound = function (uuid, second, size, senderId, receiverId, downFlag, chatType, url) {
        this.uuid = uuid; //文件id
        this.second = second; //时长，单位：秒
        this.size = size; //大小，单位：字节
        this.senderId = senderId; //发送者
        this.receiverId = receiverId; //接收方id
        this.downFlag = downFlag; //下载标志位
        this.busiId = chatType == SESSION_TYPE.C2C ? 2 : 1; //busi_id ( 1：群    2:C2C)

        //根据不同情况拉取数据
        //是否需要申请下载地址  0:到架平申请  1:到cos申请  2:不需要申请, 直接拿url下载
        if (downFlag == 2 && url != null) {
            this.downUrl = url;
        } else {
            if (this.downFlag !== undefined && this.busiId !== undefined) {
                getFileDownUrlV2(uuid, senderId, second, downFlag, receiverId, this.busiId, UPLOAD_RES_TYPE.SOUND);
            } else {
                // this.downUrl = getSoundDownUrl(uuid, senderId, second); //下载地址
                this.downUrl = getSoundDownUrl(uuid, senderId); //下载地址
            }
        }
    };
    Msg.Elem.Sound.prototype.getUUID = function () {
        return this.uuid;
    };
    Msg.Elem.Sound.prototype.getSecond = function () {
        return this.second;
    };
    Msg.Elem.Sound.prototype.getSize = function () {
        return this.size;
    };
    Msg.Elem.Sound.prototype.getSenderId = function () {
        return this.senderId;
    };
    Msg.Elem.Sound.prototype.getDownUrl = function () {
        return this.downUrl;
    };
    Msg.Elem.Sound.prototype.toHtml = function () {
        if (BROWSER_INFO.type == 'ie' && parseInt(BROWSER_INFO.ver) <= 8) {
            return '[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:' + this.downUrl;
        }
        return '<audio id="uuid_' + this.uuid + '" src="' + this.downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
    };

    // class Msg.Elem.File
    Msg.Elem.File = function (uuid, name, size, senderId, receiverId, downFlag, chatType, url) {
        this.uuid = uuid; //文件id
        this.name = name; //文件名
        this.size = size; //大小，单位：字节
        this.senderId = senderId; //发送者
        this.receiverId = receiverId; //接收方id
        this.downFlag = downFlag; //下载标志位

        this.busiId = chatType == SESSION_TYPE.C2C ? 2 : 1; //busi_id ( 1：群    2:C2C)
        //根据不同情况拉取数据
        //是否需要申请下载地址  0:到架平申请  1:到cos申请  2:不需要申请, 直接拿url下载
        if (downFlag == 2 && url != null) {
            this.downUrl = url;
        } else {
            if (downFlag !== undefined && this.busiId !== undefined) {
                getFileDownUrlV2(uuid, senderId, name, downFlag, receiverId, this.busiId, UPLOAD_RES_TYPE.FILE);
            } else {
                this.downUrl = getFileDownUrl(uuid, senderId, name); //下载地址
            }
        }
    };
    Msg.Elem.File.prototype.getUUID = function () {
        return this.uuid;
    };
    Msg.Elem.File.prototype.getName = function () {
        return this.name;
    };
    Msg.Elem.File.prototype.getSize = function () {
        return this.size;
    };
    Msg.Elem.File.prototype.getSenderId = function () {
        return this.senderId;
    };
    Msg.Elem.File.prototype.getDownUrl = function () {
        return this.downUrl;
    };
    Msg.Elem.File.prototype.getDownFlag = function () {
        return this.downFlag;
    };
    Msg.Elem.File.prototype.toHtml = function () {
        let fileSize, unitStr;
        fileSize = this.size;
        unitStr = "Byte";
        if (this.size >= 1024) {
            fileSize = Math.round(this.size / 1024);
            unitStr = "KB";
        }
        return '<a href="javascript" onclick="webim.onDownFile("' + this.uuid + '")" title="点击下载文件" ><i class="glyphicon glyphicon-file">&nbsp;' + this.name + '(' + fileSize + unitStr + ')</i></a>';
    };

    // class Msg.Elem.GroupTip 群提示消息对象
    Msg.Elem.GroupTip = function (opType, opUserId, groupId, groupName, userIdList, userinfo) {
        this.opType = opType; //操作类型
        this.opUserId = opUserId; //操作者id
        this.groupId = groupId; //群id
        this.groupName = groupName; //群名称
        this.userIdList = userIdList ? userIdList : []; //被操作的用户id列表
        this.groupInfoList = []; //新的群资料信息，群资料变更时才有值
        this.memberInfoList = []; //新的群成员资料信息，群成员资料变更时才有值
        this.groupMemberNum = null; //群成员数，操作类型为加群或者退群时才有值
        this.userinfo = userinfo ? userinfo : []; //被操作的用户信息列表列表
    };
    Msg.Elem.GroupTip.prototype.addGroupInfo = function (groupInfo) {
        this.groupInfoList.push(groupInfo);
    };
    Msg.Elem.GroupTip.prototype.addMemberInfo = function (memberInfo) {
        this.memberInfoList.push(memberInfo);
    };
    Msg.Elem.GroupTip.prototype.getOpType = function () {
        return this.opType;
    };
    Msg.Elem.GroupTip.prototype.getOpUserId = function () {
        return this.opUserId;
    };
    Msg.Elem.GroupTip.prototype.getGroupId = function () {
        return this.groupId;
    };
    Msg.Elem.GroupTip.prototype.getGroupName = function () {
        return this.groupName;
    };
    Msg.Elem.GroupTip.prototype.getUserIdList = function () {
        return this.userIdList;
    };
    Msg.Elem.GroupTip.prototype.getUserInfo = function () {
        return this.userinfo;
    };
    Msg.Elem.GroupTip.prototype.getGroupInfoList = function () {
        return this.groupInfoList;
    };
    Msg.Elem.GroupTip.prototype.getMemberInfoList = function () {
        return this.memberInfoList;
    };
    Msg.Elem.GroupTip.prototype.getGroupMemberNum = function () {
        return this.groupMemberNum;
    };
    Msg.Elem.GroupTip.prototype.setGroupMemberNum = function (groupMemberNum) {
        return this.groupMemberNum = groupMemberNum;
    };
    Msg.Elem.GroupTip.prototype.toHtml = function () {
        let text = "[群提示消息]";
        let maxIndex = GROUP_TIP_MAX_USER_COUNT - 1;
        switch (this.opType) {
            case GROUP_TIP_TYPE.JOIN: //加入群
                text += this.opUserId + "邀请了";
                for (let m in this.userIdList) {
                    text += this.userIdList[m] + ",";
                    if (this.userIdList.length > GROUP_TIP_MAX_USER_COUNT && m+'' === maxIndex+'') {
                        text += "等" + this.userIdList.length + "人";
                        break;
                    }
                }
                text += "加入该群";
                break;
            case GROUP_TIP_TYPE.QUIT: //退出群
                text += this.opUserId + "主动退出该群";
                break;
            case GROUP_TIP_TYPE.KICK: //踢出群
                text += this.opUserId + "将";
                for (let m in this.userIdList) {
                    text += this.userIdList[m] + ",";
                    if (this.userIdList.length > GROUP_TIP_MAX_USER_COUNT && m+'' == maxIndex+'') {
                        text += "等" + this.userIdList.length + "人";
                        break;
                    }
                }
                text += "踢出该群";
                break;
            case GROUP_TIP_TYPE.SET_ADMIN: //设置管理员
                text += this.opUserId + "将";
                for (let m in this.userIdList) {
                    text += this.userIdList[m] + ",";
                    if (this.userIdList.length > GROUP_TIP_MAX_USER_COUNT && m+'' == maxIndex+'') {
                        text += "等" + this.userIdList.length + "人";
                        break;
                    }
                }
                text += "设为管理员";
                break;
            case GROUP_TIP_TYPE.CANCEL_ADMIN: //取消管理员
                text += this.opUserId + "取消";
                for (let m in this.userIdList) {
                    text += this.userIdList[m] + ",";
                    if (this.userIdList.length > GROUP_TIP_MAX_USER_COUNT && m+'' == maxIndex+'') {
                        text += "等" + this.userIdList.length + "人";
                        break;
                    }
                }
                text += "的管理员资格";
                break;


            case GROUP_TIP_TYPE.MODIFY_GROUP_INFO: //群资料变更
                text += this.opUserId + "修改了群资料：";
                for (let m in this.groupInfoList) {
                    let type = this.groupInfoList[m].getType();
                    let value = this.groupInfoList[m].getValue();
                    switch (type) {
                        case GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
                            text += "群头像为" + value + "; ";
                            break;
                        case GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
                            text += "群名称为" + value + "; ";
                            break;
                        case GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
                            text += "群主为" + value + "; ";
                            break;
                        case GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
                            text += "群公告为" + value + "; ";
                            break;
                        case GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
                            text += "群简介为" + value + "; ";
                            break;
                        default:
                            text += "未知信息为:type=" + type + ",value=" + value + "; ";
                            break;
                    }
                }
                break;

            case GROUP_TIP_TYPE.MODIFY_MEMBER_INFO: //群成员资料变更(禁言时间)
                text += this.opUserId + "修改了群成员资料:";
                for (let m in this.memberInfoList) {
                    let userId = this.memberInfoList[m].getUserId();
                    let shutupTime = this.memberInfoList[m].getShutupTime();
                    text += userId + ": ";
                    if (shutupTime != null && shutupTime !== undefined) {
                        if (shutupTime == 0) {
                            text += "取消禁言; ";
                        } else {
                            text += "禁言" + shutupTime + "秒; ";
                        }
                    } else {
                        text += " shutupTime为空";
                    }
                    if (this.memberInfoList.length > GROUP_TIP_MAX_USER_COUNT && m+'' == maxIndex+'') {
                        text += "等" + this.memberInfoList.length + "人";
                        break;
                    }
                }
                break;

            case GROUP_TIP_TYPE.READED: //消息已读
                /**/
                webim.Log.info("消息已读同步")
                break;
            default:
                text += "未知群提示消息类型：type=" + this.opType;
                break;
        }
        return text;
    };

    // class Msg.Elem.GroupTip.GroupInfo，变更的群资料信息对象
    Msg.Elem.GroupTip.GroupInfo = function (type, value) {
        this.type = type; //群资料信息类型
        this.value = value; //对应的值
    };
    Msg.Elem.GroupTip.GroupInfo.prototype.getType = function () {
        return this.type;
    };
    Msg.Elem.GroupTip.GroupInfo.prototype.getValue = function () {
        return this.value;
    };

    // class Msg.Elem.GroupTip.MemberInfo，变更的群成员资料信息对象
    Msg.Elem.GroupTip.MemberInfo = function (userId, shutupTime) {
        this.userId = userId; //群成员id
        this.shutupTime = shutupTime; //群成员被禁言时间，0表示取消禁言，大于0表示被禁言时长，单位：秒
    };
    Msg.Elem.GroupTip.MemberInfo.prototype.getUserId = function () {
        return this.userId;
    };
    Msg.Elem.GroupTip.MemberInfo.prototype.getShutupTime = function () {
        return this.shutupTime;
    };

    // 自定义消息类型 class Msg.Elem.Custom
    Msg.Elem.Custom = function (data, desc, ext) {
        this.data = data; //数据
        this.desc = desc; //描述
        this.ext = ext; //扩展字段
    };
    Msg.Elem.Custom.prototype.getData = function () {
        return this.data;
    };
    Msg.Elem.Custom.prototype.getDesc = function () {
        return this.desc;
    };
    Msg.Elem.Custom.prototype.getExt = function () {
        return this.ext;
    };
    Msg.Elem.Custom.prototype.toHtml = function () {
        return this.data;
    };

    // singleton object MsgStore
    let MsgStore = new MsgStoreClass(Session, C2CMsgReadedItem, SESSION_TYPE, proto_c2CMsgReaded, log, proto_groupMsgReaded)
    // singleton object MsgManager
    let MsgManager = new MsgManagerClass(
        ipList, authkey, expireTime, 
        longPollingDefaultTimeOut, LongPollingId, 
        proto_getLongPollingId, proto_longPolling, 
        LONG_POLLINNG_EVENT_TYPE, log, ACTION_STATUS, 
        proto_bigGroupLongPolling, tool, 
        curBigGroupLongPollingRetErrorCount, CONNECTION_STATUS,
        ConnManager, longPollingPackageTooLargeErrorCode, 
        longPollingTimeOutErrorCode, longPollingKickedErrorCode, 
        proto_getMsgs, MsgStore, ctx, SESSION_TYPE, Session, Msg, C2C_MSG_SUB_TYPE,
        MSG_ELEMENT_TYPE, FRIEND_WRITE_MSG_ACTION, proto_getC2CHistoryMsgs, proto_getGroupMsgs,
        onLongPullingNotify, onAppliedDownloadUrl, proto_sendMsg, FRIEND_NOTICE_TYPE,
        PROFILE_NOTICE_TYPE, GROUP_SYSTEM_TYPE, C2C_EVENT_SUB_TYPE, proto_logout,
        proto_getIpAndAuthkey, proto_getJoinedGroupListHigh, curLongPollingRetErrorCount, longPollingOffCallbackFlag,
        curLongPollingStatus, LONG_POLLING_MAX_RET_ERROR_COUNT, longPollingIntervalTime,
        GROUP_MSG_SUB_TYPE, GROUP_MSG_PRIORITY_TYPE, getFileDownUrl,
        GROUP_TIP_TYPE, GROUP_TIP_MODIFY_GROUP_INFO_TYPE
        )

    //上传文件
    let FileUploader = new function () {
        this.fileMd5 = null;
        //获取文件MD5
        let getFileMD5 = function (file, cbOk, cbErr) {

            //FileReader pc浏览器兼容性
            //Feature   Firefox (Gecko) Chrome  Internet Explorer   Opera   Safari
            //Basic support 3.6 7   10                      12.02   6.0.2
            let fileReader = null;
            try {
                fileReader = new FileReader(); //分块读取文件对象
            } catch (e) {
                if (cbErr) {
                    cbErr(tool.getReturnError('当前浏览器不支持FileReader', -18));
                    return;
                }
            }
            //file的slice方法，注意它的兼容性，在不同浏览器的写法不同
            let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
            if (!blobSlice) {
                if (cbErr) {
                    cbErr(tool.getReturnError('当前浏览器不支持FileAPI', -19));
                    return;
                }
            }

            let chunkSize = 2 * 1024 * 1024; //分块大小，2M
            let chunks = Math.ceil(file.size / chunkSize); //总块数
            let currentChunk = 0; //当前块数
            let spark = new SparkMD5(); //获取MD5对象

            fileReader.onload = function (e) { //数据加载完毕事件

                let binaryStr = "";
                let bytes = new Uint8Array(e.target.result);
                let length = bytes.byteLength;
                for (let i = 0; i < length; i++) {
                    binaryStr += String.fromCharCode(bytes[i]); //二进制转换字符串
                }
                spark.appendBinary(binaryStr);
                currentChunk++;
                if (currentChunk < chunks) {
                    loadNext(); //读取下一块数据
                } else {
                    this.fileMd5 = spark.end(); //得到文件MD5值
                    if (cbOk) {
                        cbOk(this.fileMd5);
                    }
                }
            };
            //分片读取文件

            function loadNext() {
                let start = currentChunk * chunkSize,
                    end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                //根据开始和结束位置，切割文件
                let b = blobSlice.call(file, start, end);
                //readAsBinaryString ie浏览器不兼容此方法
                //fileReader.readAsBinaryString(blobSlice.call(file, start, end));
                fileReader.readAsArrayBuffer(b); //ie，chrome，firefox等主流浏览器兼容此方法

            }

            loadNext(); //开始读取
        };
        //提交上传图片表单(用于低版本IE9以下)
        this.submitUploadFileForm = function (options:any, cbOk:any, cbErr:any) {
            let errInfo;
            let error;
            let formId = options.formId;
            let fileId = options.fileId;
            let iframeNum = uploadResultIframeId++;
            let iframeName = "uploadResultIframe_" + iframeNum;
            let toAccount = options.To_Account;
            let businessType = options.businessType;

            let form:any = document.getElementById(formId);
            if (!form) {
                errInfo = "获取表单对象为空: formId=" + formId + "(formId非法)";
                error = tool.getReturnError(errInfo, -20);
                if (cbErr) cbErr(error);
                return;
            }

            let fileObj:any = document.getElementById(fileId);
            if (!fileObj) {
                errInfo = "获取文件对象为空: fileId=" + fileId + "(没有选择文件或者fileId非法)";
                error = tool.getReturnError(errInfo, -21);
                if (cbErr) cbErr(error);
                return;
            }
            //fileObj.type="file";//ie8下不起作用，必须由业务自己设置
            fileObj.name = "file";

            let iframe = document.createElement("iframe");
            iframe.name = iframeName;
            iframe.id = iframeName;
            iframe.style.display = "none";
            document.body.appendChild(iframe);

            let cmdName;
            if (isAccessFormalEnv()) {
                cmdName = 'pic_up';
            } else {
                cmdName = 'pic_up_test';
            }
            let uploadApiUrl = "https://pic.tim.qq.com/v4/openpic/" + cmdName + "?tinyid=" + ctx.tinyid + "&a2=" + ctx.a2 + "&sdkappid=" + ctx.sdkAppID + "&accounttype=" + ctx.accountType + "&contenttype=http";
            form.action = uploadApiUrl;
            form.method = 'post';
            //form.enctype='multipart/form-data';//ie8下不起作用，必须由业务自己设置
            form.target = iframeName;

            function createFormInput(name, value) {
                let tempInput = document.createElement("input");
                tempInput.type = "hidden";
                tempInput.name = name;
                tempInput.value = value;
                form.appendChild(tempInput);
            }

            createFormInput("App_Version", VERSION_INFO.APP_VERSION);
            createFormInput("From_Account", ctx.identifier);
            createFormInput("To_Account", toAccount);
            createFormInput("Seq", nextSeq().toString());
            createFormInput("Timestamp", unixtime().toString());
            createFormInput("Random", createRandom().toString());
            createFormInput("Busi_Id", businessType);
            createFormInput("PkgFlag", UPLOAD_RES_PKG_FLAG.RAW_DATA.toString());
            createFormInput("Auth_Key", authkey);
            createFormInput("Server_Ver", VERSION_INFO.SERVER_VERSION.toString());
            createFormInput("File_Type", options.fileType);


            //检测iframe.contentWindow.name是否有值

            function checkFrameName() {
                let resp;
                try {
                    resp = JSON.parse(iframe.contentWindow.name) || {};
                } catch (e) {
                    resp = {};
                }
                if (resp.ActionStatus) { //上传接口返回
                    // We've got what we need. Stop the iframe from loading further content.
                    iframe.src = "about:blank";
                    iframe.parentNode.removeChild(iframe);
                    iframe = null;

                    if (resp.ActionStatus == ACTION_STATUS.OK) {
                        cbOk && cbOk(resp);
                    } else {
                        cbErr && cbErr(resp);
                    }
                } else {
                    setTimeout(checkFrameName, 100);
                }
            }

            setTimeout(checkFrameName, 500);

            form.submit(); //提交上传图片表单
        };
        //上传图片或文件(用于高版本浏览器，支持FileAPI)
        this.uploadFile = function (options:any, cbOk:any, cbErr:any) {

            let file_upload = {
                //初始化
                init: function (options:any, cbOk:any, cbErr:any) {
                    let me = this;
                    me.file = options.file;
                    //分片上传进度回调事件
                    me.onProgressCallBack = options.onProgressCallBack;
                    //停止上传图片按钮
                    if (options.abortButton) {
                        options.abortButton.onclick = me.abortHandler;
                    }
                    me.total = me.file.size; //文件总大小
                    me.loaded = 0; //已读取字节数
                    me.step = 1080 * 1024; //分块大小，1080K
                    me.sliceSize = 0; //分片大小
                    me.sliceOffset = 0; //当前分片位置
                    me.timestamp = unixtime(); //当前时间戳
                    me.seq = nextSeq(); //请求seq
                    me.random = createRandom(); //请求随机数
                    me.fromAccount = ctx.identifier; //发送者
                    me.toAccount = options.To_Account; //接收者
                    me.fileMd5 = options.fileMd5; //文件MD5
                    me.businessType = options.businessType; //图片或文件的业务类型，群消息:1; c2c消息:2; 个人头像：3; 群头像：4;
                    me.fileType = options.fileType; //文件类型，不填为默认认为上传的是图片；1：图片；2：文件；3：短视频；4：PTT

                    me.cbOk = cbOk; //上传成功回调事件
                    me.cbErr = cbErr; //上传失败回调事件

                    me.reader = new FileReader(); //读取文件对象
                    me.blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice; //file的slice方法,不同浏览器不一样

                    me.reader.onloadstart = me.onLoadStart; //开始读取回调事件
                    me.reader.onprogress = me.onProgress; //读取文件进度回调事件
                    me.reader.onabort = me.onAbort; //停止读取回调事件
                    me.reader.onerror = me.onerror; //读取发生错误回调事件
                    me.reader.onload = me.onLoad; //分片加载完毕回调事件
                    me.reader.onloadend = me.onLoadEnd; //读取文件完毕回调事件
                },
                //上传方法
                upload: function () {
                    let me = file_upload;
                    //读取第一块
                    me.readBlob(0);
                },
                onLoadStart: function () {
                    let me = file_upload;
                },
                onProgress: function (e) {
                    let me:any = file_upload;
                    me.loaded += e.loaded;
                    if (me.onProgressCallBack) {
                        me.onProgressCallBack(me.loaded, me.total);
                    }
                },
                onAbort: function () {
                    let me = file_upload;
                },
                onError: function () {
                    let me = file_upload;
                },
                onLoad: function (e) {
                    let me:any = file_upload;
                    if (e.target.readyState == FileReader.DONE) {
                        let slice_data_base64 = e.target.result;
                        //注意，一定要去除base64编码头部
                        let pos = slice_data_base64.indexOf(",");
                        if (pos != -1) {
                            slice_data_base64 = slice_data_base64.substr(pos + 1);
                        }
                        //封装上传图片接口的请求参数
                        let opt = {
                            'From_Account': me.fromAccount,
                            'To_Account': me.toAccount,
                            'Busi_Id': me.businessType,
                            'File_Type': me.fileType,
                            'File_Str_Md5': me.fileMd5,
                            'PkgFlag': UPLOAD_RES_PKG_FLAG.BASE64_DATA,
                            'File_Size': me.total,
                            'Slice_Offset': me.sliceOffset,
                            'Slice_Size': me.sliceSize,
                            'Slice_Data': slice_data_base64,
                            'Seq': me.seq,
                            'Timestamp': me.timestamp,
                            'Random': me.random
                        };

                        //上传成功的成功回调
                        let succCallback = function (resp:any) {
                            if (resp.IsFinish == 0) {
                                me.loaded = resp.Next_Offset;
                                if (me.loaded < me.total) {
                                    me.readBlob(me.loaded);
                                } else {
                                    me.loaded = me.total;
                                }
                            } else {

                                if (me.cbOk) {
                                    let tempResp = {
                                        'ActionStatus': resp.ActionStatus,
                                        'ErrorCode': resp.ErrorCode,
                                        'ErrorInfo': resp.ErrorInfo,
                                        'File_UUID': resp.File_UUID,
                                        'File_Size': resp.Next_Offset,
                                        'URL_INFO': resp.URL_INFO,
                                        'Download_Flag': resp.Download_Flag
                                    };
                                    if (me.fileType == UPLOAD_RES_TYPE.FILE) { //如果上传的是文件，下载地址需要sdk内部拼接
                                        tempResp.URL_INFO = getFileDownUrl(resp.File_UUID, ctx.identifier, me.file.name);
                                    }
                                    me.cbOk(tempResp);
                                }
                            }
                            Upload_Retry_Times = 0;
                        };
                        //上传失败的回调
                        let errorCallback = function (resp:any) {
                            if (Upload_Retry_Times < Upload_Retry_Max_Times) {
                                Upload_Retry_Times++;
                                setTimeout(function () {
                                    proto_uploadPic(opt, succCallback, errorCallback);
                                }, 1000);
                            } else {
                                me.cbErr(resp);
                            }
                            //me.cbErr
                        };
                        //分片上传图片接口
                        proto_uploadPic(opt, succCallback, errorCallback);
                    }
                },
                onLoadEnd: function () {
                    let me = file_upload;
                },
                //分片读取文件方法
                readBlob: function (start) {
                    let me:any = file_upload;
                    let blob, file = me.file;
                    let end = start + me.step;
                    if (end > me.total) {
                        end = me.total;
                        me.sliceSize = end - start;
                    } else {
                        me.sliceSize = me.step;
                    }
                    me.sliceOffset = start;
                    //根据起始和结束位置，分片读取文件
                    blob = me.blobSlice.call(file, start, end);
                    //将分片的二进制数据转换为base64编码
                    me.reader.readAsDataURL(blob);
                },
                abortHandler: function () {
                    let me:any = file_upload;
                    if (me.reader) {
                        me.reader.abort();
                    }
                }
            };

            //读取文件MD5
            getFileMD5(options.file,
                function (fileMd5) {
                    log.info('fileMd5: ' + fileMd5);
                    options.fileMd5 = fileMd5;
                    //初始化上传参数
                    file_upload.init(options, cbOk, cbErr);
                    //开始上传文件
                    file_upload.upload();
                },
                cbErr
            );
        };
    };


    //web im 基础对象

    //常量对象

    //会话类型
    webim.SESSION_TYPE = SESSION_TYPE;

    webim.MSG_MAX_LENGTH = MSG_MAX_LENGTH;

    //c2c消息子类型
    webim.C2C_MSG_SUB_TYPE = C2C_MSG_SUB_TYPE;

    //群消息子类型
    webim.GROUP_MSG_SUB_TYPE = GROUP_MSG_SUB_TYPE;

    //消息元素类型
    webim.MSG_ELEMENT_TYPE = MSG_ELEMENT_TYPE;

    //群提示消息类型
    webim.GROUP_TIP_TYPE = GROUP_TIP_TYPE;

    //图片类型
    webim.IMAGE_TYPE = IMAGE_TYPE;

    //群系统消息类型
    webim.GROUP_SYSTEM_TYPE = GROUP_SYSTEM_TYPE;

    //好友系统通知子类型
    webim.FRIEND_NOTICE_TYPE = FRIEND_NOTICE_TYPE;

    //群提示消息-群资料变更类型
    webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE = GROUP_TIP_MODIFY_GROUP_INFO_TYPE;

    //浏览器信息
    webim.BROWSER_INFO = BROWSER_INFO;

    //表情对象
    webim.Emotions = webim.EmotionPicData = emotions;
    //表情标识符和index Map
    webim.EmotionDataIndexs = webim.EmotionPicDataIndex = emotionDataIndexs;

    //腾讯登录服务错误码(托管模式)
    webim.TLS_ERROR_CODE = TLS_ERROR_CODE;

    //连接状态
    webim.CONNECTION_STATUS = CONNECTION_STATUS;

    //上传图片业务类型
    webim.UPLOAD_PIC_BUSSINESS_TYPE = UPLOAD_PIC_BUSSINESS_TYPE;

    //最近联系人类型
    webim.RECENT_CONTACT_TYPE = RECENT_CONTACT_TYPE;

    //上传资源类型
    webim.UPLOAD_RES_TYPE = UPLOAD_RES_TYPE;


    /**************************************/

    //类对象
    //
    //工具对象
    webim.Tool = tool;
    //控制台打印日志对象
    webim.Log = log;

    //消息对象
    webim.Msg = Msg;
    //会话对象
    webim.Session = Session;
    //会话存储对象
    webim.MsgStore = {
        sessMap: function () {
            return MsgStore.sessMap();
        },
        sessCount: function () {
            return MsgStore.sessCount();
        },
        sessByTypeId: function (type, id) {
            return MsgStore.sessByTypeId(type, id);
        },
        delSessByTypeId: function (type, id) {
            return MsgStore.delSessByTypeId(type, id);
        },
        resetCookieAndSyncFlag: function () {
            return MsgStore.resetCookieAndSyncFlag();
        }
    };

    webim.Resources = Resources;

    /**************************************/

    // webim API impl
    //
    //基本接口
    //登录
    webim.login = webim.init = function (loginInfo, listeners, opts, cbOk, cbErr) {

        //初始化连接状态回调函数
        ConnManager.init(listeners.onConnNotify, cbOk, cbErr);

        //设置ie9以下浏览器jsonp回调
        if (listeners.jsonpCallback) jsonpCallback = listeners.jsonpCallback;
        //登录
        _login(loginInfo, listeners, opts, cbOk, cbErr);
    };
    //登出
    //需要传长轮询id
    //这样登出之后其他的登录实例还可以继续收取消息
    webim.logout = webim.offline = function (cbOk:any, cbErr:any) {
        return proto_logout('instance', cbOk, cbErr);
    };

    //登出
    //这种登出方式，所有的实例都将不会收到消息推送，直到重新登录
    webim.logoutAll = function (cbOk:any, cbErr:any) {
        return proto_logout('all', cbOk, cbErr);
    };


    //消息管理接口
    //发消息接口（私聊和群聊）
    webim.sendMsg = function (msg, cbOk, cbErr) {
        return MsgManager.sendMsg(msg, cbOk, cbErr);
    };
    //拉取未读c2c消息
    webim.syncMsgs = function (cbOk:any, cbErr:any) {
        return MsgManager.syncMsgs(cbOk, cbErr);
    };
    //拉取C2C漫游消息
    webim.getC2CHistoryMsgs = function (options:any, cbOk:any, cbErr:any) {
        return MsgManager.getC2CHistoryMsgs(options, cbOk, cbErr);
    };
    //拉取群漫游消息
    webim.syncGroupMsgs = function (options:any, cbOk:any, cbErr:any) {
        return MsgManager.syncGroupMsgs(options, cbOk, cbErr);
    };

    //上报c2c消息已读
    webim.c2CMsgReaded = function (options:any, cbOk:any, cbErr:any) {
        return MsgStore.c2CMsgReaded(options, cbOk, cbErr);
    };

    //上报群消息已读
    webim.groupMsgReaded = function (options:any, cbOk:any, cbErr:any) {
        return proto_groupMsgReaded(options, cbOk, cbErr);
    };

    //设置聊天会话自动标记已读
    webim.setAutoRead = function (selSess, isOn, isResetAll) {
        return MsgStore.setAutoRead(selSess, isOn, isResetAll);
    };

    //群组管理接口
    //
    //创建群
    webim.createGroup = function (options:any, cbOk:any, cbErr:any) {
        return proto_createGroup(options, cbOk, cbErr);
    };
    //创建群-高级接口
    webim.createGroupHigh = function (options:any, cbOk:any, cbErr:any) {
        return proto_createGroupHigh(options, cbOk, cbErr);
    };
    //申请加群
    webim.applyJoinGroup = function (options:any, cbOk:any, cbErr:any) {
        return proto_applyJoinGroup(options, cbOk, cbErr);
    };
    //处理加群申请(同意或拒绝)
    webim.handleApplyJoinGroupPendency = function (options:any, cbOk:any, cbErr:any) {
        return proto_handleApplyJoinGroupPendency(options, cbOk, cbErr);
    };

    //获取群组未决列表
    webim.getPendencyGroup = function (options:any, cbOk:any, cbErr:any) {
        return proto_getPendencyGroup(options, cbOk, cbErr);
    };

    //群未决已读上报
    webim.getPendencyGroupRead = function (options:any, cbOk:any, cbErr:any) {
        return proto_getPendencyGroupRead(options, cbOk, cbErr);
    };

    //处理邀请进群申请(同意或拒绝)
    webim.handleInviteJoinGroupRequest = function (options:any, cbOk:any, cbErr:any) {
        return proto_handleInviteJoinGroupRequest(options, cbOk, cbErr);
    };

    //删除加群申请
    webim.deleteApplyJoinGroupPendency = function (options:any, cbOk:any, cbErr:any) {
        return proto_deleteC2CMsg(options, cbOk, cbErr);
    };

    //删除群系统消息
    webim.deleteGroupSystemMsgs = function (options:any, cbOk:any, cbErr:any) {
        options.DelMsgList.forEach( function(item) {
            item.From_Account = '@TIM#SYSTEM'
        })
        return proto_deleteC2CMsg(options, cbOk, cbErr);
    }

    //主动退群
    webim.quitGroup = function (options:any, cbOk:any, cbErr:any) {
        return proto_quitGroup(options, cbOk, cbErr);
    };
    //搜索群组(根据名称)
    webim.searchGroupByName = function (options:any, cbOk:any, cbErr:any) {
        return proto_searchGroupByName(options, cbOk, cbErr);
    };
    //获取群组公开资料(根据群id搜索)
    webim.getGroupPublicInfo = function (options:any, cbOk:any, cbErr:any) {
        return proto_getGroupPublicInfo(options, cbOk, cbErr);
    };
    //获取群组详细资料-高级接口
    webim.getGroupInfo = function (options:any, cbOk:any, cbErr:any) {
        return proto_getGroupInfo(options, cbOk, cbErr);
    };
    //修改群基本资料
    webim.modifyGroupBaseInfo = function (options:any, cbOk:any, cbErr:any) {
        return proto_modifyGroupBaseInfo(options, cbOk, cbErr);
    };
    //获取群成员列表
    webim.getGroupMemberInfo = function (options:any, cbOk:any, cbErr:any) {
        return proto_getGroupMemberInfo(options, cbOk, cbErr);
    };
    //邀请好友加群
    webim.addGroupMember = function (options:any, cbOk:any, cbErr:any) {
        return proto_addGroupMember(options, cbOk, cbErr);
    };
    //修改群成员资料
    webim.modifyGroupMember = function (options:any, cbOk:any, cbErr:any) {
        return proto_modifyGroupMember(options, cbOk, cbErr);
    };
    //删除群成员
    webim.deleteGroupMember = function (options:any, cbOk:any, cbErr:any) {
        return proto_deleteGroupMember(options, cbOk, cbErr);
    };
    //解散群
    webim.destroyGroup = function (options:any, cbOk:any, cbErr:any) {
        return proto_destroyGroup(options, cbOk, cbErr);
    };
    //转让群组
    webim.changeGroupOwner = function (options:any, cbOk:any, cbErr:any) {
        return proto_changeGroupOwner(options, cbOk, cbErr);
    };

    //获取我的群组列表-高级接口
    webim.getJoinedGroupListHigh = function (options:any, cbOk:any, cbErr:any) {
        return proto_getJoinedGroupListHigh(options, cbOk, cbErr);
    };
    //获取群成员角色
    webim.getRoleInGroup = function (options:any, cbOk:any, cbErr:any) {
        return proto_getRoleInGroup(options, cbOk, cbErr);
    };
    //设置群成员禁言时间
    webim.forbidSendMsg = function (options:any, cbOk:any, cbErr:any) {
        return proto_forbidSendMsg(options, cbOk, cbErr);
    };
    //发送自定义群系统通知
    webim.sendCustomGroupNotify = function (options:any, cbOk:any, cbErr:any) {
        return proto_sendCustomGroupNotify(options, cbOk, cbErr);
    };

    //进入大群
    webim.applyJoinBigGroup = function (options:any, cbOk:any, cbErr:any) {
        return proto_applyJoinBigGroup(options, cbOk, cbErr);
    };
    //退出大群
    webim.quitBigGroup = function (options:any, cbOk:any, cbErr:any) {
        return proto_quitBigGroup(options, cbOk, cbErr);
    };

    //资料关系链管理接口
    //
    //获取个人资料接口，可用于搜索用户
    webim.getProfilePortrait = function (options:any, cbOk:any, cbErr:any) {
        return proto_getProfilePortrait(options, cbOk, cbErr);
    };
    //设置个人资料
    webim.setProfilePortrait = function (options:any, cbOk:any, cbErr:any) {
        return proto_setProfilePortrait(options, cbOk, cbErr);
    };
    //申请加好友
    webim.applyAddFriend = function (options:any, cbOk:any, cbErr:any) {
        return proto_applyAddFriend(options, cbOk, cbErr);
    };
    //获取好友申请列表
    webim.getPendency = function (options:any, cbOk:any, cbErr:any) {
        return proto_getPendency(options, cbOk, cbErr);
    };
    //好友申请列表已读上报
    webim.getPendencyReport = function (options:any, cbOk:any, cbErr:any) {
        return proto_getPendencyReport(options, cbOk, cbErr);
    };
    //删除好友申请
    webim.deletePendency = function (options:any, cbOk:any, cbErr:any) {
        return proto_deletePendency(options, cbOk, cbErr);
    };
    //处理好友申请
    webim.responseFriend = function (options:any, cbOk:any, cbErr:any) {
        return proto_responseFriend(options, cbOk, cbErr);
    };
    //获取我的好友
    webim.getAllFriend = function (options:any, cbOk:any, cbErr:any) {
        return proto_getAllFriend(options, cbOk, cbErr);
    };
    //删除会话
    webim.deleteChat = function (options:any, cbOk:any, cbErr:any) {
        return proto_deleteChat(options, cbOk, cbErr);
    };
    //删除好友
    webim.deleteFriend = function (options:any, cbOk:any, cbErr:any) {
        return proto_deleteFriend(options, cbOk, cbErr);
    };
    //拉黑
    webim.addBlackList = function (options:any, cbOk:any, cbErr:any) {
        return proto_addBlackList(options, cbOk, cbErr);
    };
    //删除黑名单
    webim.deleteBlackList = function (options:any, cbOk:any, cbErr:any) {
        return proto_deleteBlackList(options, cbOk, cbErr);
    };
    //获取我的黑名单
    webim.getBlackList = function (options:any, cbOk:any, cbErr:any) {
        return proto_getBlackList(options, cbOk, cbErr);
    };

    //获取最近会话
    webim.getRecentContactList = function (options:any, cbOk:any, cbErr:any) {
        return proto_getRecentContactList(options, cbOk, cbErr);
    };

    //图片或文件服务接口
    //
    //上传文件接口（高版本浏览器）
    webim.uploadFile = webim.uploadPic = function (options:any, cbOk:any, cbErr:any) {
        return FileUploader.uploadFile(options, cbOk, cbErr);
    };
    //提交上传图片表单接口（用于低版本ie）
    webim.submitUploadFileForm = function (options:any, cbOk:any, cbErr:any) {
        return FileUploader.submitUploadFileForm(options, cbOk, cbErr);
    };
    //上传图片或文件(Base64)接口
    webim.uploadFileByBase64 = webim.uploadPicByBase64 = function (options:any, cbOk:any, cbErr:any) {
        //请求参数
        let opt = {
            'To_Account': options.toAccount,
            'Busi_Id': options.businessType,
            'File_Type': options.File_Type,
            'File_Str_Md5': options.fileMd5,
            'PkgFlag': UPLOAD_RES_PKG_FLAG.BASE64_DATA,
            'File_Size': options.totalSize,
            'Slice_Offset': 0,
            'Slice_Size': options.totalSize,
            'Slice_Data': options.base64Str,
            'Seq': nextSeq(),
            'Timestamp': unixtime(),
            'Random': createRandom()
        };
        return proto_uploadPic(opt, cbOk, cbErr);
    };

    //设置jsonp返回的值
    webim.setJsonpLastRspData = function (rspData) {
        jsonpLastRspData = typeof (rspData) == "string" ? JSON.parse(rspData) : rspData;
    };

    //获取长轮询ID
    webim.getLongPollingId = function (options:any, cbOk:any, cbErr:any) {
        return proto_getLongPollingId(options, cbOk, cbErr);
    };

    //获取下载地址
    webim.applyDownload = function (options:any, cbOk:any, cbErr:any) {
        return proto_applyDownload(options, cbOk, cbErr);
    };

    //获取下载地址
    webim.onDownFile = function (uuid) {
        window.open(Resources.downloadMap["uuid_" + uuid]);
    };

    //检查是否登录
    webim.checkLogin = function (cbErr, isNeedCallBack) {
        return checkLogin(cbErr, isNeedCallBack);
    };
})(webim);

export default webim