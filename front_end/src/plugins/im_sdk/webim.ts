import { store } from "./store";

export default class WebIm {
    public SESSION_TYPE: any
    public MSG_MAX_LENGTH: any
    public C2C_MSG_SUB_TYPE: any
    public GROUP_MSG_SUB_TYPE: any
    public MSG_ELEMENT_TYPE: any
    public GROUP_TIP_TYPE: any
    public IMAGE_TYPE: any
    public GROUP_SYSTEM_TYPE: any
    public FRIEND_NOTICE_TYPE: any
    public GROUP_TIP_MODIFY_GROUP_INFO_TYPE: any
    public BROWSER_INFO: any
    public EmotionPicData: any
    public EmotionPicDataIndex: any
    public TLS_ERROR_CODE: any
    public CONNECTION_STATUS: any
    public UPLOAD_PIC_BUSSINESS_TYPE: any
    public RECENT_CONTACT_TYPE: any
    public UPLOAD_RES_TYPE: any
    public Tool: any
    public Log: any
    public Msg: any
    public Session: any
    public MsgStore: any
    public Resources: any

    public login: any
    public logout: any
    public logoutAll: any
    public sendMsg: any
    public syncMsgs: any
    public getC2CHistoryMsgs: any
    public syncGroupMsgs: any
    public c2CMsgReaded: any
    public groupMsgReaded: any
    public setAutoRead: any
    public createGroup: any
    public createGroupHigh: any
    public applyJoinGroup: any
    public handleApplyJoinGroupPendency: any
    public getPendencyGroup: any
    public getPendencyGroupRead: any
    public handleInviteJoinGroupRequest: any
    public deleteApplyJoinGroupPendency: any
    public deleteGroupSystemMsgs: any
    public quitGroup: any
    public searchGroupByName: any
    public getGroupPublicInfo: any
    public getGroupInfo: any
    public modifyGroupBaseInfo: any
    public getGroupMemberInfo: any
    public addGroupMember: any
    public modifyGroupMember: any
    public deleteGroupMember: any
    public destroyGroup: any
    public changeGroupOwner: any
    public getJoinedGroupListHigh: any
    public getRoleInGroup: any
    public forbidSendMsg: any
    public sendCustomGroupNotify: any
    public applyJoinBigGroup: any
    public quitBigGroup: any
    public getProfilePortrait: any
    public setProfilePortrait: any
    public applyAddFriend: any
    public getPendency: any
    public getPendencyReport: any
    public deletePendency: any
    public responseFriend: any
    public getAllFriend: any
    public deleteChat: any
    public deleteFriend: any
    public addBlackList: any
    public deleteBlackList: any
    public getBlackList: any
    public getRecentContactList: any
    public uploadFile: any
    public submitUploadFileForm: any
    public uploadFileByBase64: any
    public setJsonpLastRspData: any
    public getLongPollingId: any
    public applyDownload: any
    public onDownFile: any
    public checkLogin: any

    public init: any
    public offline: any
    public uploadPic: any
    public uploadPicByBase64: any

    constructor(
        SESSION_TYPE: any,
        MSG_MAX_LENGTH: any,
        C2C_MSG_SUB_TYPE: any,
        GROUP_MSG_SUB_TYPE: any,
        MSG_ELEMENT_TYPE: any,
        GROUP_TIP_TYPE: any,
        IMAGE_TYPE: any,
        GROUP_SYSTEM_TYPE: any,
        FRIEND_NOTICE_TYPE: any,
        GROUP_TIP_MODIFY_GROUP_INFO_TYPE: any,
        emotions: any,
        emotionDataIndexs: any,
        TLS_ERROR_CODE: any,
        CONNECTION_STATUS: any,
        UPLOAD_PIC_BUSSINESS_TYPE: any,
        RECENT_CONTACT_TYPE: any,
        UPLOAD_RES_TYPE: any,
        tool: any,
        log: any,
        Msg: any,
        Session: any,
        MsgStore: any,
        Resources: any,
        ConnManager: any,
        jsonpCallback: any,
        _login: any,
        proto_logout: any,
        MsgManager: any,
        proto_groupMsgReaded: any,
        proto_createGroup: any,
        proto_createGroupHigh: any,
        proto_applyJoinGroup: any,
        proto_handleApplyJoinGroupPendency: any,
        proto_getPendencyGroup: any,
        proto_getPendencyGroupRead: any,
        proto_handleInviteJoinGroupRequest: any,
        proto_deleteC2CMsg: any,
        proto_quitGroup: any,
        proto_searchGroupByName: any,
        proto_getGroupPublicInfo: any,
        proto_getGroupInfo: any,
        proto_modifyGroupBaseInfo: any,
        proto_getGroupMemberInfo: any,
        proto_addGroupMember: any,
        proto_modifyGroupMember: any,
        proto_deleteGroupMember: any,
        proto_destroyGroup: any,
        proto_changeGroupOwner: any,
        proto_getJoinedGroupListHigh: any,
        proto_getRoleInGroup: any,
        proto_forbidSendMsg: any,
        proto_sendCustomGroupNotify: any,
        proto_applyJoinBigGroup: any,
        proto_quitBigGroup: any,
        proto_getProfilePortrait: any,
        proto_setProfilePortrait: any,
        proto_applyAddFriend: any,
        proto_getPendency: any,
        proto_getPendencyReport: any,
        proto_deletePendency: any,
        proto_responseFriend: any,
        proto_getAllFriend: any,
        proto_deleteChat: any,
        proto_deleteFriend: any,
        proto_addBlackList: any,
        proto_deleteBlackList: any,
        proto_getBlackList: any,
        proto_getRecentContactList: any,
        FileUploader: any,
        UPLOAD_RES_PKG_FLAG: any,
        nextSeq: any,
        unixtime: any,
        createRandom: any,
        proto_uploadPic: any,
        proto_getLongPollingId: any,
        proto_applyDownload: any,
        checkLogin: any
    ) {
        //web im 基础对象

        //常量对象

        //会话类型
        this.SESSION_TYPE = SESSION_TYPE

        this.MSG_MAX_LENGTH = MSG_MAX_LENGTH

        //c2c消息子类型
        this.C2C_MSG_SUB_TYPE = C2C_MSG_SUB_TYPE

        //群消息子类型
        this.GROUP_MSG_SUB_TYPE = GROUP_MSG_SUB_TYPE

        //消息元素类型
        this.MSG_ELEMENT_TYPE = MSG_ELEMENT_TYPE

        //群提示消息类型
        this.GROUP_TIP_TYPE = GROUP_TIP_TYPE

        //图片类型
        this.IMAGE_TYPE = IMAGE_TYPE

        //群系统消息类型
        this.GROUP_SYSTEM_TYPE = GROUP_SYSTEM_TYPE

        //好友系统通知子类型
        this.FRIEND_NOTICE_TYPE = FRIEND_NOTICE_TYPE

        //群提示消息-群资料变更类型
        this.GROUP_TIP_MODIFY_GROUP_INFO_TYPE = GROUP_TIP_MODIFY_GROUP_INFO_TYPE

        //浏览器信息
        this.BROWSER_INFO = store.BROWSER_INFO

        //表情对象
        this.EmotionPicData = emotions
        //表情标识符和index Map
        this.EmotionPicDataIndex = emotionDataIndexs

        //腾讯登录服务错误码(托管模式)
        this.TLS_ERROR_CODE = TLS_ERROR_CODE

        //连接状态
        this.CONNECTION_STATUS = CONNECTION_STATUS

        //上传图片业务类型
        this.UPLOAD_PIC_BUSSINESS_TYPE = UPLOAD_PIC_BUSSINESS_TYPE

        //最近联系人类型
        this.RECENT_CONTACT_TYPE = RECENT_CONTACT_TYPE

        //上传资源类型
        this.UPLOAD_RES_TYPE = UPLOAD_RES_TYPE

        /**************************************/

        //类对象
        //
        //工具对象
        this.Tool = tool
        //控制台打印日志对象
        this.Log = log

        //消息对象
        this.Msg = Msg
        //会话对象
        this.Session = Session
        //会话存储对象
        this.MsgStore = {
            sessMap: function() {
                return MsgStore.sessMap()
            },
            sessCount: function() {
                return MsgStore.sessCount()
            },
            sessByTypeId: function(type: any, id: any) {
                return MsgStore.sessByTypeId(type, id)
            },
            delSessByTypeId: function(type: any, id: any) {
                return MsgStore.delSessByTypeId(type, id)
            },
            resetCookieAndSyncFlag: function() {
                return MsgStore.resetCookieAndSyncFlag()
            }
        }

        this.Resources = Resources

        /**************************************/

        // webim API impl
        //
        //基本接口
        //登录
        this.init = this.login
        this.login = (
            loginInfo: any,
            listeners: any,
            opts: any,
            cbOk: any,
            cbErr: any
        ) => {
            //初始化连接状态回调函数
            ConnManager.init(listeners.onConnNotify, cbOk, cbErr)

            //设置ie9以下浏览器jsonp回调
            if (listeners.jsonpCallback) jsonpCallback = listeners.jsonpCallback
            //登录
            _login(loginInfo, listeners, opts, cbOk, cbErr)
        }
        //登出
        //需要传长轮询id
        //这样登出之后其他的登录实例还可以继续收取消息
        this.offline = this.logout
        this.logout = (cbOk: any, cbErr: any) => {
            return proto_logout('instance', cbOk, cbErr)
        }

        //登出
        //这种登出方式，所有的实例都将不会收到消息推送，直到重新登录
        this.logoutAll = (cbOk: any, cbErr: any) => {
            return proto_logout('all', cbOk, cbErr)
        }

        //消息管理接口
        //发消息接口（私聊和群聊）
        this.sendMsg = (msg: any, cbOk: any, cbErr: any) => {
            return MsgManager.sendMsg(msg, cbOk, cbErr)
        }
        //拉取未读c2c消息
        this.syncMsgs = (cbOk: any, cbErr: any) => {
            return MsgManager.syncMsgs(cbOk, cbErr)
        }
        //拉取C2C漫游消息
        this.getC2CHistoryMsgs = (options: any, cbOk: any, cbErr: any) => {
            return MsgManager.getC2CHistoryMsgs(options, cbOk, cbErr)
        }
        //拉取群漫游消息
        this.syncGroupMsgs = (options: any, cbOk: any, cbErr: any) => {
            return MsgManager.syncGroupMsgs(options, cbOk, cbErr)
        }

        //上报c2c消息已读
        this.c2CMsgReaded = (options: any, cbOk: any, cbErr: any) => {
            return MsgStore.c2CMsgReaded(options, cbOk, cbErr)
        }

        //上报群消息已读
        this.groupMsgReaded = (options: any, cbOk: any, cbErr: any) => {
            return proto_groupMsgReaded(options, cbOk, cbErr)
        }

        //设置聊天会话自动标记已读
        this.setAutoRead = (selSess: any, isOn: any, isResetAll: any) => {
            return MsgStore.setAutoRead(selSess, isOn, isResetAll)
        }

        //群组管理接口
        //
        //创建群
        this.createGroup = (options: any, cbOk: any, cbErr: any) => {
            return proto_createGroup(options, cbOk, cbErr)
        }
        //创建群-高级接口
        this.createGroupHigh = (options: any, cbOk: any, cbErr: any) => {
            return proto_createGroupHigh(options, cbOk, cbErr)
        }
        //申请加群
        this.applyJoinGroup = (options: any, cbOk: any, cbErr: any) => {
            return proto_applyJoinGroup(options, cbOk, cbErr)
        }
        //处理加群申请(同意或拒绝)
        this.handleApplyJoinGroupPendency = (
            options: any,
            cbOk: any,
            cbErr: any
        ) => {
            return proto_handleApplyJoinGroupPendency(options, cbOk, cbErr)
        }

        //获取群组未决列表
        this.getPendencyGroup = (options: any, cbOk: any, cbErr: any) => {
            return proto_getPendencyGroup(options, cbOk, cbErr)
        }

        //群未决已读上报
        this.getPendencyGroupRead = (options: any, cbOk: any, cbErr: any) => {
            return proto_getPendencyGroupRead(options, cbOk, cbErr)
        }

        //处理邀请进群申请(同意或拒绝)
        this.handleInviteJoinGroupRequest = (
            options: any,
            cbOk: any,
            cbErr: any
        ) => {
            return proto_handleInviteJoinGroupRequest(options, cbOk, cbErr)
        }

        //删除加群申请
        this.deleteApplyJoinGroupPendency = (
            options: any,
            cbOk: any,
            cbErr: any
        ) => {
            return proto_deleteC2CMsg(options, cbOk, cbErr)
        }

        //删除群系统消息
        this.deleteGroupSystemMsgs = (options: any, cbOk: any, cbErr: any) => {
            options.DelMsgList.forEach(function(item: any) {
                item.From_Account = '@TIM#SYSTEM'
            })
            return proto_deleteC2CMsg(options, cbOk, cbErr)
        }

        //主动退群
        this.quitGroup = (options: any, cbOk: any, cbErr: any) => {
            return proto_quitGroup(options, cbOk, cbErr)
        }
        //搜索群组(根据名称)
        this.searchGroupByName = (options: any, cbOk: any, cbErr: any) => {
            return proto_searchGroupByName(options, cbOk, cbErr)
        }
        //获取群组公开资料(根据群id搜索)
        this.getGroupPublicInfo = (options: any, cbOk: any, cbErr: any) => {
            return proto_getGroupPublicInfo(options, cbOk, cbErr)
        }
        //获取群组详细资料-高级接口
        this.getGroupInfo = (options: any, cbOk: any, cbErr: any) => {
            return proto_getGroupInfo(options, cbOk, cbErr)
        }
        //修改群基本资料
        this.modifyGroupBaseInfo = (options: any, cbOk: any, cbErr: any) => {
            return proto_modifyGroupBaseInfo(options, cbOk, cbErr)
        }
        //获取群成员列表
        this.getGroupMemberInfo = (options: any, cbOk: any, cbErr: any) => {
            return proto_getGroupMemberInfo(options, cbOk, cbErr)
        }
        //邀请好友加群
        this.addGroupMember = (options: any, cbOk: any, cbErr: any) => {
            return proto_addGroupMember(options, cbOk, cbErr)
        }
        //修改群成员资料
        this.modifyGroupMember = (options: any, cbOk: any, cbErr: any) => {
            return proto_modifyGroupMember(options, cbOk, cbErr)
        }
        //删除群成员
        this.deleteGroupMember = (options: any, cbOk: any, cbErr: any) => {
            return proto_deleteGroupMember(options, cbOk, cbErr)
        }
        //解散群
        this.destroyGroup = (options: any, cbOk: any, cbErr: any) => {
            return proto_destroyGroup(options, cbOk, cbErr)
        }
        //转让群组
        this.changeGroupOwner = (options: any, cbOk: any, cbErr: any) => {
            return proto_changeGroupOwner(options, cbOk, cbErr)
        }

        //获取我的群组列表-高级接口
        this.getJoinedGroupListHigh = (options: any, cbOk: any, cbErr: any) => {
            return proto_getJoinedGroupListHigh(options, cbOk, cbErr)
        }
        //获取群成员角色
        this.getRoleInGroup = (options: any, cbOk: any, cbErr: any) => {
            return proto_getRoleInGroup(options, cbOk, cbErr)
        }
        //设置群成员禁言时间
        this.forbidSendMsg = (options: any, cbOk: any, cbErr: any) => {
            return proto_forbidSendMsg(options, cbOk, cbErr)
        }
        //发送自定义群系统通知
        this.sendCustomGroupNotify = (options: any, cbOk: any, cbErr: any) => {
            return proto_sendCustomGroupNotify(options, cbOk, cbErr)
        }

        //进入大群
        this.applyJoinBigGroup = (options: any, cbOk: any, cbErr: any) => {
            return proto_applyJoinBigGroup(options, cbOk, cbErr)
        }
        //退出大群
        this.quitBigGroup = (options: any, cbOk: any, cbErr: any) => {
            return proto_quitBigGroup(options, cbOk, cbErr)
        }

        //资料关系链管理接口
        //
        //获取个人资料接口，可用于搜索用户
        this.getProfilePortrait = (options: any, cbOk: any, cbErr: any) => {
            return proto_getProfilePortrait(options, cbOk, cbErr)
        }
        //设置个人资料
        this.setProfilePortrait = (options: any, cbOk: any, cbErr: any) => {
            return proto_setProfilePortrait(options, cbOk, cbErr)
        }
        //申请加好友
        this.applyAddFriend = (options: any, cbOk: any, cbErr: any) => {
            return proto_applyAddFriend(options, cbOk, cbErr)
        }
        //获取好友申请列表
        this.getPendency = (options: any, cbOk: any, cbErr: any) => {
            return proto_getPendency(options, cbOk, cbErr)
        }
        //好友申请列表已读上报
        this.getPendencyReport = (options: any, cbOk: any, cbErr: any) => {
            return proto_getPendencyReport(options, cbOk, cbErr)
        }
        //删除好友申请
        this.deletePendency = (options: any, cbOk: any, cbErr: any) => {
            return proto_deletePendency(options, cbOk, cbErr)
        }
        //处理好友申请
        this.responseFriend = (options: any, cbOk: any, cbErr: any) => {
            return proto_responseFriend(options, cbOk, cbErr)
        }
        //获取我的好友
        this.getAllFriend = (options: any, cbOk: any, cbErr: any) => {
            return proto_getAllFriend(options, cbOk, cbErr)
        }
        //删除会话
        this.deleteChat = (options: any, cbOk: any, cbErr: any) => {
            return proto_deleteChat(options, cbOk, cbErr)
        }
        //删除好友
        this.deleteFriend = (options: any, cbOk: any, cbErr: any) => {
            return proto_deleteFriend(options, cbOk, cbErr)
        }
        //拉黑
        this.addBlackList = (options: any, cbOk: any, cbErr: any) => {
            return proto_addBlackList(options, cbOk, cbErr)
        }
        //删除黑名单
        this.deleteBlackList = (options: any, cbOk: any, cbErr: any) => {
            return proto_deleteBlackList(options, cbOk, cbErr)
        }
        //获取我的黑名单
        this.getBlackList = (options: any, cbOk: any, cbErr: any) => {
            return proto_getBlackList(options, cbOk, cbErr)
        }

        //获取最近会话
        this.getRecentContactList = (options: any, cbOk: any, cbErr: any) => {
            return proto_getRecentContactList(options, cbOk, cbErr)
        }

        //图片或文件服务接口
        //
        //上传文件接口（高版本浏览器）
        this.uploadPic = this.uploadFile
        this.uploadFile = (options: any, cbOk: any, cbErr: any) => {
            return FileUploader.uploadFile(options, cbOk, cbErr)
        }
        //提交上传图片表单接口（用于低版本ie）
        this.submitUploadFileForm = (options: any, cbOk: any, cbErr: any) => {
            return FileUploader.submitUploadFileForm(options, cbOk, cbErr)
        }
        //上传图片或文件(Base64)接口
        this.uploadPicByBase64 = this.uploadFileByBase64
        this.uploadFileByBase64 = (options: any, cbOk: any, cbErr: any) => {
            //请求参数
            let opt = {
                To_Account: options.toAccount,
                Busi_Id: options.businessType,
                File_Type: options.File_Type,
                File_Str_Md5: options.fileMd5,
                PkgFlag: UPLOAD_RES_PKG_FLAG.BASE64_DATA,
                File_Size: options.totalSize,
                Slice_Offset: 0,
                Slice_Size: options.totalSize,
                Slice_Data: options.base64Str,
                Seq: nextSeq(),
                Timestamp: unixtime(),
                Random: createRandom()
            }
            return proto_uploadPic(opt, cbOk, cbErr)
        }

        //设置jsonp返回的值
        this.setJsonpLastRspData = (rspData: any) => {
            store.jsonpLastRspData =
                typeof rspData === 'string' ? JSON.parse(rspData) : rspData
        }

        //获取长轮询ID
        this.getLongPollingId = (options: any, cbOk: any, cbErr: any) => {
            return proto_getLongPollingId(options, cbOk, cbErr)
        }

        //获取下载地址
        this.applyDownload = (options: any, cbOk: any, cbErr: any) => {
            return proto_applyDownload(options, cbOk, cbErr)
        }

        //获取下载地址
        this.onDownFile = (uuid: any) => {
            window.open(Resources.downloadMap['uuid_' + uuid])
        }

        //检查是否登录
        this.checkLogin = (cbErr: any, isNeedCallBack: any) => {
            return checkLogin(cbErr, isNeedCallBack)
        }
    }
}
