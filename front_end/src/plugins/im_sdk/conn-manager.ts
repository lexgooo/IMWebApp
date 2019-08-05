import { store } from "./store";

export class HConnManager {
    public init: any
    public callBack: any
    public clear: any
    public apiCall: any
    constructor(
        onConnCallback: any = null,
        getApiUrl: any,
        ajaxRequestJson: any,
        ACTION_STATUS: any,
        longPollingTimeOutErrorCode: any,
        reportApiQuality: any,
        log:any
    ) {
        this.init = (
            onConnNotify: any,
            cbOk: any = null,
            cbErr: any = null
        ) => {
            if (onConnNotify) onConnCallback = onConnNotify
        }
        this.callBack = (info: any) => {
            if (onConnCallback) onConnCallback(info)
        }
        this.clear = () => {
            onConnCallback = null
        }
        //请求后台服务接口
        this.apiCall = (
            type: any,
            cmd: any,
            data: any,
            cbOk: any,
            cbErr: any,
            timeout: any,
            isLongPolling: any
        ) => {
            //封装后台服务接口地址
            let url = getApiUrl(type, cmd, cbOk, cbErr)
            if (url === false) return
            //发起ajax请求
            let content_type = data.content_type
                ? data.content_type
                : 'application/x-www-form-urlencoded'
            ajaxRequestJson(
                'POST',
                url,
                data,
                timeout,
                content_type,
                isLongPolling,
                function(resp: any) {
                    let errorCode = null,
                        tempErrorInfo = ''
                    if (cmd === 'pic_up') {
                        data.Slice_Data = ''
                    }
                    let info =
                        '\n request url: \n' +
                        url +
                        '\n request body: \n' +
                        JSON.stringify(data) +
                        '\n response: \n' +
                        JSON.stringify(resp)
                    //成功
                    if (resp.ActionStatus === ACTION_STATUS.OK) {
                        log.info('[' + type + '][' + cmd + ']success: ' + info)
                        if (cbOk) cbOk(resp) //回调
                        errorCode = 0
                        tempErrorInfo = ''
                    } else {
                        errorCode = resp.ErrorCode
                        tempErrorInfo = resp.ErrorInfo
                        //报错
                        if (cbErr) {
                            resp.SrcErrorInfo = resp.ErrorInfo
                            resp.ErrorInfo =
                                '[' + type + '][' + cmd + ']failed: ' + info
                            if (
                                cmd !== 'longpolling' ||
                                resp.ErrorCode !== longPollingTimeOutErrorCode
                            ) {
                                log.error(resp.ErrorInfo)
                            }
                            cbErr(resp)
                        }
                    }
                    reportApiQuality(cmd, errorCode, tempErrorInfo) //接口质量上报
                },
                function(err: any) {
                    cbErr && cbErr(err)
                    reportApiQuality(cmd, err.ErrorCode, err.ErrorInfo) //接口质量上报
                }
            )
        }
    }
}

export class LConnManager {
    public init: any
    public callBack: any
    public clear: any
    public apiCall: any
    constructor(onConnCallback:any = null, getApiUrl:any, jsonpCallback:any, ACTION_STATUS:any, longPollingTimeOutErrorCode:any, log:any) {
        this.init = (onConnNotify:any, cbOk:any, cbErr:any) => {
            if (onConnNotify) onConnCallback = onConnNotify
        }
        this.callBack = (info:any) => {
            if (onConnCallback) onConnCallback(info)
        }
        this.clear = () => {
            onConnCallback = null
        }
        //请求后台服务接口
        this.apiCall = (
            type:any,
            cmd:any,
            data:any,
            cbOk:any,
            cbErr:any,
            timeout:any,
            isLongPolling:any
        ) => {
            //封装后台服务接口地址
            let url = getApiUrl(type, cmd, cbOk, cbErr)
            if (url === false) return
            //发起jsonp请求
            let reqId = store.jsonpRequestId++,
                cbkey = 'jsonpcallback', // the 'callback' key
                cbval:any = 'jsonpRequest' + reqId, // the 'callback' value
                script: any = document.createElement('script'),
                loaded = 0

            window[cbval] = jsonpCallback
            script.type = 'text/javascript'
            url =
                url +
                '&' +
                cbkey +
                '=' +
                cbval +
                '&jsonpbody=' +
                encodeURIComponent(JSON.stringify(data))
            script.src = url
            script.async = true

            if (typeof script.onreadystatechange !== 'undefined') {
                // need this for IE due to out-of-order onreadystatechange(), binding script
                // execution to an event listener gives us control over when the script
                // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
                script.event = 'onclick'
                script.htmlFor = script.id = '_jsonpRequest_' + reqId
            }

            script.onload = script.onreadystatechange = function() {
                if (
                    (this.readyState &&
                        this.readyState !== 'complete' &&
                        this.readyState !== 'loaded') ||
                    loaded
                ) {
                    return false
                }
                script.onload = script.onreadystatechange = null
                script.onclick && script.onclick()
                // Call the user callback with the last value stored and clean up values and scripts.
                let resp = store.jsonpLastRspData
                let info =
                    '\n request url: \n' +
                    url +
                    '\n request body: \n' +
                    JSON.stringify(data) +
                    '\n response: \n' +
                    JSON.stringify(resp)
                if (resp.ActionStatus === ACTION_STATUS.OK) {
                    log.info('[' + type + '][' + cmd + ']success: ' + info)
                    cbOk && cbOk(resp)
                } else {
                    resp.ErrorInfo = '[' + type + '][' + cmd + ']failed ' + info
                    if (
                        cmd !== 'longpolling' ||
                        resp.ErrorCode !== longPollingTimeOutErrorCode
                    ) {
                        log.error(resp.ErrorInfo)
                    } else {
                        log.warn('[' + type + '][' + cmd + ']success: ' + info)
                    }
                    cbErr && cbErr(resp)
                }
                store.jsonpLastRspData = undefined
                document.body.removeChild(script)
                loaded = 1
            }

            // Add the script to the DOM head
            document.body.appendChild(script)
        }
    }
}