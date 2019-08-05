import { store } from "./store";

export default class Tool {
    //格式化时间戳
    //format格式如下：
    //yyyy-MM-dd hh:mm:ss 年月日时分秒(默认格式)
    //yyyy-MM-dd 年月日
    //hh:mm:ss 时分秒
    public groupTypeEn2Ch: any
    public formatTimeStamp: any
    public groupTypeCh2En: any
    public groupRoleEn2Ch: any
    public groupRoleCh2En: any
    public groupMsgFlagEn2Ch: any
    public groupMsgFlagCh2En: any
    public formatText2Html: any
    public formatHtml2Text: any
    public getStrBytes: any
    public xssFilter: any
    public trimStr: any
    public validNumber: any
    public getReturnError: any
    public setCookie: any
    public getCookie: any
    public delCookie: any
    public getQueryString: any
    public isIE: any
    public getBrowserInfo: any
    public replaceObject: any

    public xssFilterEnable: any
    public ACTION_STATUS: any
    public log: any

    constructor(ACTION_STATUS: any, log: any) {
        this.xssFilterEnable = store.xssFilterEnable
        this.ACTION_STATUS = ACTION_STATUS
        this.log = log
        this.formatTimeStamp = (timestamp: any, format: any) => {
            if (!timestamp) {
                return 0
            }
            let formatTime
            format = format || 'yyyy-MM-dd hh:mm:ss'
            let date = new Date(timestamp * 1000)
            let o: any = {
                'M+': date.getMonth() + 1, //月份
                'd+': date.getDate(), //日
                'h+': date.getHours(), //小时
                'm+': date.getMinutes(), //分
                's+': date.getSeconds() //秒
            }
            if (/(y+)/.test(format)) {
                formatTime = format.replace(
                    RegExp.$1,
                    (date.getFullYear() + '').substr(4 - RegExp.$1.length)
                )
            } else {
                formatTime = format
            }
            for (let k in o) {
                if (new RegExp('(' + k + ')').test(formatTime))
                    formatTime = formatTime.replace(
                        RegExp.$1,
                        RegExp.$1.length === 1
                            ? o[k]
                            : ('00' + o[k]).substr(('' + o[k]).length)
                    )
            }
            return formatTime
        }

        //根据群类型英文名转换成中文名
        this.groupTypeEn2Ch = (type_en: any) => {
            let type_ch = null
            switch (type_en) {
                case 'Public':
                    type_ch = '公开群'
                    break
                case 'ChatRoom':
                    type_ch = '聊天室'
                    break
                case 'Private':
                    type_ch = '私有群' //即讨论组
                    break
                case 'AVChatRoom':
                    type_ch = '直播聊天室'
                    break
                default:
                    type_ch = type_en
                    break
            }
            return type_ch
        }
        //根据群类型中文名转换成英文名
        this.groupTypeCh2En = (type_ch: any) => {
            let type_en = null
            switch (type_ch) {
                case '公开群':
                    type_en = 'Public'
                    break
                case '聊天室':
                    type_en = 'ChatRoom'
                    break
                case '私有群': //即讨论组
                    type_en = 'Private'
                    break
                case '直播聊天室':
                    type_en = 'AVChatRoom'
                    break
                default:
                    type_en = type_ch
                    break
            }
            return type_en
        }
        //根据群身份英文名转换成群身份中文名
        this.groupRoleEn2Ch = (role_en: any) => {
            let role_ch = null
            switch (role_en) {
                case 'Member':
                    role_ch = '成员'
                    break
                case 'Admin':
                    role_ch = '管理员'
                    break
                case 'Owner':
                    role_ch = '群主'
                    break
                default:
                    role_ch = role_en
                    break
            }
            return role_ch
        }
        //根据群身份中文名转换成群身份英文名
        this.groupRoleCh2En = (role_ch: any) => {
            let role_en = null
            switch (role_ch) {
                case '成员':
                    role_en = 'Member'
                    break
                case '管理员':
                    role_en = 'Admin'
                    break
                case '群主':
                    role_en = 'Owner'
                    break
                default:
                    role_en = role_ch
                    break
            }
            return role_en
        }
        //根据群消息提示类型英文转换中文
        this.groupMsgFlagEn2Ch = (msg_flag_en: any) => {
            let msg_flag_ch = null
            switch (msg_flag_en) {
                case 'AcceptAndNotify':
                    msg_flag_ch = '接收并提示'
                    break
                case 'AcceptNotNotify':
                    msg_flag_ch = '接收不提示'
                    break
                case 'Discard':
                    msg_flag_ch = '屏蔽'
                    break
                default:
                    msg_flag_ch = msg_flag_en
                    break
            }
            return msg_flag_ch
        }
        //根据群消息提示类型中文名转换英文名
        this.groupMsgFlagCh2En = (msg_flag_ch: any) => {
            let msg_flag_en = null
            switch (msg_flag_ch) {
                case '接收并提示':
                    msg_flag_en = 'AcceptAndNotify'
                    break
                case '接收不提示':
                    msg_flag_en = 'AcceptNotNotify'
                    break
                case '屏蔽':
                    msg_flag_en = 'Discard'
                    break
                default:
                    msg_flag_en = msg_flag_ch
                    break
            }
            return msg_flag_en
        }
        //将空格和换行符转换成HTML标签
        this.formatText2Html = (text: any) => {
            let html = text
            if (html) {
                html = this.xssFilter(html) //用户昵称或群名称等字段会出现脚本字符串
                html = html.replace(/ /g, '&nbsp;')
                html = html.replace(/\n/g, '<br/>')
            }
            return html
        }
        //将HTML标签转换成空格和换行符
        this.formatHtml2Text = (html: any) => {
            let text = html
            if (text) {
                text = text.replace(/&nbsp;/g, ' ')
                text = text.replace(/<br\/>/g, '\n')
            }
            return text
        }
        //获取字符串(UTF-8编码)所占字节数
        //参考：http://zh.wikipedia.org/zh-cn/UTF-8
        this.getStrBytes = (str: any) => {
            if (str == null || str === undefined) return 0
            if (typeof str != 'string') {
                return 0
            }
            let total = 0,
                charCode,
                i,
                len
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i)
                if (charCode <= 0x007f) {
                    total += 1 //字符代码在000000 – 00007F之间的，用一个字节编码
                } else if (charCode <= 0x07ff) {
                    total += 2 //000080 – 0007FF之间的字符用两个字节
                } else if (charCode <= 0xffff) {
                    total += 3 //000800 – 00D7FF 和 00E000 – 00FFFF之间的用三个字节，注: Unicode在范围 D800-DFFF 中不存在任何字符
                } else {
                    total += 4 //010000 – 10FFFF之间的用4个字节
                }
            }
            return total
        }

        //防止XSS攻击
        this.xssFilter = (val: any) => {
            if (this.xssFilterEnable) {
                val = val.toString()
                val = val.replace(/[<]/g, '&lt;')
                val = val.replace(/[>]/g, '&gt;')
                val = val.replace(/"/g, '&quot;')
            }
            return val
        }

        //去掉头尾空白符
        this.trimStr = (str: any) => {
            if (!str) return ''
            str = str.toString()
            return str.replace(/(^\s*)|(\s*$)/g, '')
        }
        //判断是否为8位整数
        this.validNumber = (str: any) => {
            str = str.toString()
            return str.match(/(^\d{1,8}$)/g)
        }
        this.getReturnError = (errorInfo: any, errorCode: any) => {
            if (!errorCode) {
                errorCode = -100
            }
            let error = {
                ActionStatus: ACTION_STATUS.FAIL,
                ErrorCode: errorCode,
                ErrorInfo: errorInfo + '[' + errorCode + ']'
            }
            return error
        }
        //设置cookie
        //name 名字
        //value 值
        //expires 有效期(单位：秒)
        //path
        //domain 作用域
        this.setCookie = (
            name: any,
            value: any,
            expires: any,
            path: any,
            domain: any
        ) => {
            let exp = new Date()
            exp.setTime(exp.getTime() + expires * 1000)
            document.cookie =
                name + '=' + escape(value) + ';expires=' + exp.toUTCString()
        }
        //获取cookie
        this.getCookie = (name: any) => {
            let result = document.cookie.match(
                new RegExp('(^| )' + name + '=([^;]*)(;|$)')
            )
            if (result != null) {
                return unescape(result[2])
            }
            return null
        }
        //删除cookie
        this.delCookie = (name: any) => {
            let exp = new Date()
            exp.setTime(exp.getTime() - 1)
            let value = this.getCookie(name)
            if (value != null)
                document.cookie =
                    name + '=' + escape(value) + ';expires=' + exp.toUTCString()
        }
        //根据名字获取url参数值
        this.getQueryString = (name: any) => {
            let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
            let r = window.location.search.substr(1).match(reg)
            if (r != null) return unescape(r[2])
            return null
        }
        //判断IE版本号，ver表示版本号
        this.isIE = (ver: any) => {
            let b = document.createElement('b')
            b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
            return b.getElementsByTagName('i').length === 1
        }
        //判断浏览器版本
        this.getBrowserInfo = () => {
            let Sys: any = {}
            let ua: any = navigator.userAgent.toLowerCase()
            log.info('navigator.userAgent=' + ua)
            let s
            const mise = ua.match(/msie ([\d.]+)/)
            const firefox = ua.match(/firefox\/([\d.]+)/)
            const chrome = ua.match(/chrome\/([\d.]+)/)
            const opera = ua.match(/opera.([\d.]+)/)
            const safari = ua.match(/version\/([\d.]+).*safari/)
            if (mise) {
                s = mise
                Sys.ie = s[1]
            } else if (firefox) {
                s = firefox
                Sys.firefox = s[1]
            } else if (chrome) {
                s = chrome
                Sys.chrome = s[1]
            } else if (opera) {
                s = opera
                Sys.opera = s[1]
            } else if (safari) {
                s = safari
                Sys.safari = s[1]
            } else {
                s = 0
            }
            // (s = ua.match(/msie ([\d.]+)/))
            //     ? (Sys.ie = s[1])
            //     : (s = ua.match(/firefox\/([\d.]+)/))
            //     ? (Sys.firefox = s[1])
            //     : (s = ua.match(/chrome\/([\d.]+)/))
            //     ? (Sys.chrome = s[1])
            //     : (s = ua.match(/opera.([\d.]+)/))
            //     ? (Sys.opera = s[1])
            //     : (s = ua.match(/version\/([\d.]+).*safari/))
            //     ? (Sys.safari = s[1])
            //     : 0
            if (Sys.ie) {
                //Js判断为IE浏览器
                //ie10的判断这里有个问题
                // Mozilla/5.0 (compatible; MSIE 9.0; qdesk 2.5.1277.202; Windows NT 6.1; WOW64; Trident/6.0)
                // 是IE10 而不是IE9
                if (
                    ua.match(/trident\/(\d)\./) &&
                    ua.match(/trident\/(\d)\./)[1] === '6'
                ) {
                    Sys.ie = 10
                }
                return {
                    type: 'ie',
                    ver: Sys.ie
                }
            }
            if (Sys.firefox) {
                //Js判断为火狐(firefox)浏览器
                return {
                    type: 'firefox',
                    ver: Sys.firefox
                }
            }
            if (Sys.chrome) {
                //Js判断为谷歌chrome浏览器
                return {
                    type: 'chrome',
                    ver: Sys.chrome
                }
            }
            if (Sys.opera) {
                //Js判断为opera浏览器
                return {
                    type: 'opera',
                    ver: Sys.opera
                }
            }
            if (Sys.safari) {
                //Js判断为苹果safari浏览器
                return {
                    type: 'safari',
                    ver: Sys.safari
                }
            }
            return {
                type: 'unknow',
                ver: -1
            }
        }

        this.replaceObject = (keyMap: any, json: any) => {
            for (let a in json) {
                if (keyMap[a]) {
                    json[keyMap[a]] = json[a]
                    delete json[a]
                    if (json[keyMap[a]] instanceof Array) {
                        let len = json[keyMap[a]].length
                        for (let i = 0; i < len; i++) {
                            json[keyMap[a]][i] = this.replaceObject(
                                keyMap,
                                json[keyMap[a]][i]
                            )
                        }
                    } else if (typeof json[keyMap[a]] === 'object') {
                        json[keyMap[a]] = this.replaceObject(
                            keyMap,
                            json[keyMap[a]]
                        )
                    }
                }
            }
            return json
        }
    }
}

