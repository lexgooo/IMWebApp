export default class MsgElemClass {
    // class Msg.Elem
    public content:any;
    public type:any;
    public Text:any;
    public Face:any;
    public Location:any;
    public Images:any;
    public Sound:any;
    public File:any;
    public GroupTip:any;
    public Custom:any;

    constructor (type:any, value:any) {
        this.type = type;
        this.content = value;
        this.Text = TextClass;
        this.Face = FaceClass;
        this.Location = LocationClass;
        this.Images = ImagesClass;
        this.Sound = SoundClass;
        this.File = FileClass;
        this.GroupTip = GroupTipClass;
        this.Custom = CustomClass;
    };
    getType () {
        return this.type;
    };
    getContent () {
        return this.content;
    };
    toHtml () {
        let html;
        html = this.content.toHtml();
        return html;
    };
}

class TextClass {
      // class Msg.Elem.Text
      public text:any;
      constructor (text:any) {
        this.text = tool.xssFilter(text);
    };
    getText () {
        return this.text;
    };
    toHtml () {
        return this.text;
    };
}

class FaceClass {
    // class Msg.Elem.Face
    public index:any;
    public data:any;

    constructor (index:any, data:any) {
        this.index = index;
        this.data = data;
    };
    getIndex () {
        return this.index;
    };
    getData () {
        return this.data;
    };
    toHtml () {
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
}

class LocationClass {
    // 地理位置消息 class Msg.Elem.Location
    public latitude:any;
    public longitude:any;
    public desc:any;

    constructor (longitude:any, latitude:any, desc:any) {
        this.latitude = latitude; //纬度
        this.longitude = longitude; //经度
        this.desc = desc; //描述
    };
    getLatitude () {
        return this.latitude;
    };
    getLongitude () {
        return this.longitude;
    };
    getDesc () {
        return this.desc;
    };
    toHtml () {
        return '经度=' + this.longitude + ',纬度=' + this.latitude + ',描述=' + this.desc;
    };
}

class ImagesClass {
    //图片消息
    // class Msg.Elem.Images
    public UUID:any;
    public ImageFormat:any;
    public ImageInfoArray:any;
    public Image:any;


    constructor (imageId:any, format:any) {
        this.UUID = imageId;
        if (typeof format !== 'number') {
            format = parseInt(IMAGE_FORMAT[format] || IMAGE_FORMAT['UNKNOWN'], 10);
        }
        this.ImageFormat = format;
        this.ImageInfoArray = [];
        this.Image = ImageClass;
    };
    addImage (image:any) {
        this.ImageInfoArray.push(image);
    };
    toHtml () {
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
    getImageId () {
        return this.UUID;
    };
    getImageFormat () {
        return this.ImageFormat;
    };
    getImage (type:any) {
        for (let i in this.ImageInfoArray) {
            if (this.ImageInfoArray[i].getType() === type) {
                return this.ImageInfoArray[i];
            }
        }
        let img = null;
        this.ImageInfoArray.forEach(function (image:any) {
            if (image.getType() === type) {
                img = image;
            }
        })
        return img;
    };
}

class ImageClass {
    // class Msg.Elem.Images.Image
    public type:any;
    public size:any;
    public width:any;
    public height:any;
    public url:any;

    constructor (type:any, size:any, width:any, height:any, url:any) {
        this.type = type;
        this.size = size;
        this.width = width;
        this.height = height;
        this.url = url;
    };
    getType () {
        return this.type;
    };
    getSize () {
        return this.size;
    };
    getWidth () {
        return this.width;
    };
    getHeight () {
        return this.height;
    };
    getUrl () {
        return this.url;
    };
}

class SoundClass {
    // class Msg.Elem.Sound
   public uuid:any
   public second:any
   public size:any
   public senderId:any
   public receiverId:any
   public downFlag:any
   public busiId:any
   public downUrl:any


    constructor (uuid:any, second:any, size:any, senderId:any, receiverId:any, downFlag:any, chatType:any, url:any) {
        this.uuid = uuid; //文件id
        this.second = second; //时长，单位：秒
        this.size = size; //大小，单位：字节
        this.senderId = senderId; //发送者
        this.receiverId = receiverId; //接收方id
        this.downFlag = downFlag; //下载标志位
        this.busiId = chatType === SESSION_TYPE.C2C ? 2 : 1; //busi_id ( 1：群    2:C2C)

        //根据不同情况拉取数据
        //是否需要申请下载地址  0:到架平申请  1:到cos申请  2:不需要申请, 直接拿url下载
        if (downFlag === 2 && url !== null) {
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
    getUUID () {
        return this.uuid;
    };
    getSecond () {
        return this.second;
    };
    getSize () {
        return this.size;
    };
    getSenderId () {
        return this.senderId;
    };
    getDownUrl () {
        return this.downUrl;
    };
    toHtml () {
        if (BROWSER_INFO.type === 'ie' && parseInt(BROWSER_INFO.ver) <= 8) {
            return '[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:' + this.downUrl;
        }
        return '<audio id="uuid_' + this.uuid + '" src="' + this.downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
    };
}

class FileClass {
    // class Msg.Elem.File
    public uuid:any;
    public name:any;
    public size:any;
    public senderId:any;
    public receiverId:any;
    public downFlag:any;
    public busiId:any;
    public downUrl:any;


    constructor (uuid:any, name:any, size:any, senderId:any, receiverId:any, downFlag:any, chatType:any, url:any) {
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
    getUUID () {
        return this.uuid;
    };
    getName () {
        return this.name;
    };
    getSize () {
        return this.size;
    };
    getSenderId () {
        return this.senderId;
    };
    getDownUrl () {
        return this.downUrl;
    };
    getDownFlag () {
        return this.downFlag;
    };
    toHtml () {
        let fileSize, unitStr;
        fileSize = this.size;
        unitStr = "Byte";
        if (this.size >= 1024) {
            fileSize = Math.round(this.size / 1024);
            unitStr = "KB";
        }
        return '<a href="javascript" onclick="webim.onDownFile("' + this.uuid + '")" title="点击下载文件" ><i class="glyphicon glyphicon-file">&nbsp;' + this.name + '(' + fileSize + unitStr + ')</i></a>';
    };
}

class GroupTipClass {
    // class Msg.Elem.GroupTip 群提示消息对象
    public opType:any;
    public opUserId:any;
    public groupId:any;
    public groupName:any;
    public userIdList:any;
    public groupInfoList:any;
    public memberInfoList:any;
    public groupMemberNum:any;
    public userinfo:any;
    public GroupInfo:any;
    public MemberInfo:any;

    constructor (opType:any, opUserId:any, groupId:any, groupName:any, userIdList:any, userinfo:any) {
        this.opType = opType; //操作类型
        this.opUserId = opUserId; //操作者id
        this.groupId = groupId; //群id
        this.groupName = groupName; //群名称
        this.userIdList = userIdList ? userIdList : []; //被操作的用户id列表
        this.groupInfoList = []; //新的群资料信息，群资料变更时才有值
        this.memberInfoList = []; //新的群成员资料信息，群成员资料变更时才有值
        this.groupMemberNum = null; //群成员数，操作类型为加群或者退群时才有值
        this.userinfo = userinfo ? userinfo : []; //被操作的用户信息列表列表
        this.GroupInfo = GroupInfoClass;
        this.MemberInfo = MemberInfoClass;
    };
    addGroupInfo (groupInfo:any) {
        this.groupInfoList.push(groupInfo);
    };
    addMemberInfo (memberInfo:any) {
        this.memberInfoList.push(memberInfo);
    };
    getOpType () {
        return this.opType;
    };
    getOpUserId () {
        return this.opUserId;
    };
    getGroupId () {
        return this.groupId;
    };
    getGroupName () {
        return this.groupName;
    };
    getUserIdList () {
        return this.userIdList;
    };
    getUserInfo () {
        return this.userinfo;
    };
    getGroupInfoList () {
        return this.groupInfoList;
    };
    getMemberInfoList () {
        return this.memberInfoList;
    };
    getGroupMemberNum () {
        return this.groupMemberNum;
    };
    setGroupMemberNum (groupMemberNum:any) {
        return this.groupMemberNum = groupMemberNum;
    };
    toHtml () {
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
}

class GroupInfoClass {
    // class Msg.Elem.GroupTip.GroupInfo，变更的群资料信息对象
    public type:any;
    public value:any;

    constructor (type:any, value:any) {
        this.type = type; //群资料信息类型
        this.value = value; //对应的值
    };
    getType () {
        return this.type;
    };
    getValue () {
        return this.value;
    };
}

class MemberInfoClass {
    // class Msg.Elem.GroupTip.MemberInfo，变更的群成员资料信息对象
    public userId:any;
    public shutupTime:any;

    constructor (userId:any, shutupTime:any) {
        this.userId = userId; //群成员id
        this.shutupTime = shutupTime; //群成员被禁言时间，0表示取消禁言，大于0表示被禁言时长，单位：秒
    };
    getUserId () {
        return this.userId;
    };
    getShutupTime () {
        return this.shutupTime;
    };
}

class CustomClass {
    // 自定义消息类型 class Msg.Elem.Custom
    public data:any;
    public desc:any;
    public ext:any;

    constructor (data:any, desc:any, ext:any) {
        this.data = data; //数据
        this.desc = desc; //描述
        this.ext = ext; //扩展字段
    };
    getData () {
        return this.data;
    };
    getDesc () {
        return this.desc;
    };
    getExt () {
        return this.ext;
    };
    toHtml () {
        return this.data;
    };
}