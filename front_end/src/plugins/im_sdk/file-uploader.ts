import SparkMD5 from './spark-md5'

export default class FileUploaderClass {
    public fileMd5: any
    public submitUploadFileForm: any
    public uploadFile: any
    //获取文件MD5
    public getFileMD5(file: any, cbOk: any, cbErr: any) {
        //FileReader pc浏览器兼容性
        //Feature   Firefox (Gecko) Chrome  Internet Explorer   Opera   Safari
        //Basic support 3.6 7   10                      12.02   6.0.2
        let fileReader = null
        try {
            fileReader = new FileReader() //分块读取文件对象
        } catch (e) {
            if (cbErr) {
                cbErr(tool.getReturnError('当前浏览器不支持FileReader', -18))
                return
            }
        }
        //file的slice方法，注意它的兼容性，在不同浏览器的写法不同
        let blobSlice =
            File.prototype.mozSlice ||
            File.prototype.webkitSlice ||
            File.prototype.slice
        if (!blobSlice) {
            if (cbErr) {
                cbErr(tool.getReturnError('当前浏览器不支持FileAPI', -19))
                return
            }
        }

        let chunkSize = 2 * 1024 * 1024 //分块大小，2M
        let chunks = Math.ceil(file.size / chunkSize) //总块数
        let currentChunk = 0 //当前块数
        let spark = new SparkMD5() //获取MD5对象

        fileReader.onload = function(e) {
            //数据加载完毕事件

            let binaryStr = ''
            let bytes = new Uint8Array(e.target.result)
            let length = bytes.byteLength
            for (let i = 0; i < length; i++) {
                binaryStr += String.fromCharCode(bytes[i]) //二进制转换字符串
            }
            spark.appendBinary(binaryStr)
            currentChunk++
            if (currentChunk < chunks) {
                loadNext() //读取下一块数据
            } else {
                this.fileMd5 = spark.end() //得到文件MD5值
                if (cbOk) {
                    cbOk(this.fileMd5)
                }
            }
        }
        //分片读取文件

        function loadNext() {
            let start = currentChunk * chunkSize,
                end =
                    start + chunkSize >= file.size
                        ? file.size
                        : start + chunkSize
            //根据开始和结束位置，切割文件
            let b = blobSlice.call(file, start, end)
            //readAsBinaryString ie浏览器不兼容此方法
            //fileReader.readAsBinaryString(blobSlice.call(file, start, end));
            fileReader.readAsArrayBuffer(b) //ie，chrome，firefox等主流浏览器兼容此方法
        }

        loadNext() //开始读取
    }

    constructor() {
        this.fileMd5 = null
        //提交上传图片表单(用于低版本IE9以下)
        this.submitUploadFileForm = (options: any, cbOk: any, cbErr: any) => {
            let errInfo
            let error
            let formId = options.formId
            let fileId = options.fileId
            let iframeNum = uploadResultIframeId++
            let iframeName = 'uploadResultIframe_' + iframeNum
            let toAccount = options.To_Account
            let businessType = options.businessType

            let form: any = document.getElementById(formId)
            if (!form) {
                errInfo = '获取表单对象为空: formId=' + formId + '(formId非法)'
                error = tool.getReturnError(errInfo, -20)
                if (cbErr) cbErr(error)
                return
            }

            let fileObj: any = document.getElementById(fileId)
            if (!fileObj) {
                errInfo =
                    '获取文件对象为空: fileId=' +
                    fileId +
                    '(没有选择文件或者fileId非法)'
                error = tool.getReturnError(errInfo, -21)
                if (cbErr) cbErr(error)
                return
            }
            //fileObj.type="file";//ie8下不起作用，必须由业务自己设置
            fileObj.name = 'file'

            let iframe = document.createElement('iframe')
            iframe.name = iframeName
            iframe.id = iframeName
            iframe.style.display = 'none'
            document.body.appendChild(iframe)

            let cmdName
            if (isAccessFormalEnv()) {
                cmdName = 'pic_up'
            } else {
                cmdName = 'pic_up_test'
            }
            let uploadApiUrl =
                'https://pic.tim.qq.com/v4/openpic/' +
                cmdName +
                '?tinyid=' +
                ctx.tinyid +
                '&a2=' +
                ctx.a2 +
                '&sdkappid=' +
                ctx.sdkAppID +
                '&accounttype=' +
                ctx.accountType +
                '&contenttype=http'
            form.action = uploadApiUrl
            form.method = 'post'
            //form.enctype='multipart/form-data';//ie8下不起作用，必须由业务自己设置
            form.target = iframeName

            function createFormInput(name:any, value:any) {
                let tempInput = document.createElement('input')
                tempInput.type = 'hidden'
                tempInput.name = name
                tempInput.value = value
                form.appendChild(tempInput)
            }

            createFormInput('App_Version', VERSION_INFO.APP_VERSION)
            createFormInput('From_Account', ctx.identifier)
            createFormInput('To_Account', toAccount)
            createFormInput('Seq', nextSeq().toString())
            createFormInput('Timestamp', unixtime().toString())
            createFormInput('Random', createRandom().toString())
            createFormInput('Busi_Id', businessType)
            createFormInput('PkgFlag', UPLOAD_RES_PKG_FLAG.RAW_DATA.toString())
            createFormInput('Auth_Key', authkey)
            createFormInput(
                'Server_Ver',
                VERSION_INFO.SERVER_VERSION.toString()
            )
            createFormInput('File_Type', options.fileType)

            //检测iframe.contentWindow.name是否有值

            function checkFrameName() {
                let resp
                try {
                    resp = JSON.parse(iframe.contentWindow.name) || {}
                } catch (e) {
                    resp = {}
                }
                if (resp.ActionStatus) {
                    //上传接口返回
                    // We've got what we need. Stop the iframe from loading further content.
                    iframe.src = 'about:blank'
                    iframe.parentNode.removeChild(iframe)
                    iframe = null

                    if (resp.ActionStatus == ACTION_STATUS.OK) {
                        cbOk && cbOk(resp)
                    } else {
                        cbErr && cbErr(resp)
                    }
                } else {
                    setTimeout(checkFrameName, 100)
                }
            }

            setTimeout(checkFrameName, 500)

            form.submit() //提交上传图片表单
        }
        //上传图片或文件(用于高版本浏览器，支持FileAPI)
        this.uploadFile = (options: any, cbOk: any, cbErr: any) => {
            let file_upload = {
                //初始化
                init: function(options: any, cbOk: any, cbErr: any) {
                    let me = this
                    me.file = options.file
                    //分片上传进度回调事件
                    me.onProgressCallBack = options.onProgressCallBack
                    //停止上传图片按钮
                    if (options.abortButton) {
                        options.abortButton.onclick = me.abortHandler
                    }
                    me.total = me.file.size //文件总大小
                    me.loaded = 0 //已读取字节数
                    me.step = 1080 * 1024 //分块大小，1080K
                    me.sliceSize = 0 //分片大小
                    me.sliceOffset = 0 //当前分片位置
                    me.timestamp = unixtime() //当前时间戳
                    me.seq = nextSeq() //请求seq
                    me.random = createRandom() //请求随机数
                    me.fromAccount = ctx.identifier //发送者
                    me.toAccount = options.To_Account //接收者
                    me.fileMd5 = options.fileMd5 //文件MD5
                    me.businessType = options.businessType //图片或文件的业务类型，群消息:1; c2c消息:2; 个人头像：3; 群头像：4;
                    me.fileType = options.fileType //文件类型，不填为默认认为上传的是图片；1：图片；2：文件；3：短视频；4：PTT

                    me.cbOk = cbOk //上传成功回调事件
                    me.cbErr = cbErr //上传失败回调事件

                    me.reader = new FileReader() //读取文件对象
                    me.blobSlice =
                        File.prototype.mozSlice ||
                        File.prototype.webkitSlice ||
                        File.prototype.slice //file的slice方法,不同浏览器不一样

                    me.reader.onloadstart = me.onLoadStart //开始读取回调事件
                    me.reader.onprogress = me.onProgress //读取文件进度回调事件
                    me.reader.onabort = me.onAbort //停止读取回调事件
                    me.reader.onerror = me.onerror //读取发生错误回调事件
                    me.reader.onload = me.onLoad //分片加载完毕回调事件
                    me.reader.onloadend = me.onLoadEnd //读取文件完毕回调事件
                },
                //上传方法
                upload: function() {
                    let me = file_upload
                    //读取第一块
                    me.readBlob(0)
                },
                onLoadStart: function() {
                    let me = file_upload
                },
                onProgress: function(e) {
                    let me: any = file_upload
                    me.loaded += e.loaded
                    if (me.onProgressCallBack) {
                        me.onProgressCallBack(me.loaded, me.total)
                    }
                },
                onAbort: function() {
                    let me = file_upload
                },
                onError: function() {
                    let me = file_upload
                },
                onLoad: function(e) {
                    let me: any = file_upload
                    if (e.target.readyState == FileReader.DONE) {
                        let slice_data_base64 = e.target.result
                        //注意，一定要去除base64编码头部
                        let pos = slice_data_base64.indexOf(',')
                        if (pos != -1) {
                            slice_data_base64 = slice_data_base64.substr(
                                pos + 1
                            )
                        }
                        //封装上传图片接口的请求参数
                        let opt = {
                            From_Account: me.fromAccount,
                            To_Account: me.toAccount,
                            Busi_Id: me.businessType,
                            File_Type: me.fileType,
                            File_Str_Md5: me.fileMd5,
                            PkgFlag: UPLOAD_RES_PKG_FLAG.BASE64_DATA,
                            File_Size: me.total,
                            Slice_Offset: me.sliceOffset,
                            Slice_Size: me.sliceSize,
                            Slice_Data: slice_data_base64,
                            Seq: me.seq,
                            Timestamp: me.timestamp,
                            Random: me.random
                        }

                        //上传成功的成功回调
                        let succCallback = function(resp: any) {
                            if (resp.IsFinish == 0) {
                                me.loaded = resp.Next_Offset
                                if (me.loaded < me.total) {
                                    me.readBlob(me.loaded)
                                } else {
                                    me.loaded = me.total
                                }
                            } else {
                                if (me.cbOk) {
                                    let tempResp = {
                                        ActionStatus: resp.ActionStatus,
                                        ErrorCode: resp.ErrorCode,
                                        ErrorInfo: resp.ErrorInfo,
                                        File_UUID: resp.File_UUID,
                                        File_Size: resp.Next_Offset,
                                        URL_INFO: resp.URL_INFO,
                                        Download_Flag: resp.Download_Flag
                                    }
                                    if (me.fileType == UPLOAD_RES_TYPE.FILE) {
                                        //如果上传的是文件，下载地址需要sdk内部拼接
                                        tempResp.URL_INFO = getFileDownUrl(
                                            resp.File_UUID,
                                            ctx.identifier,
                                            me.file.name
                                        )
                                    }
                                    me.cbOk(tempResp)
                                }
                            }
                            Upload_Retry_Times = 0
                        }
                        //上传失败的回调
                        let errorCallback = function(resp: any) {
                            if (Upload_Retry_Times < Upload_Retry_Max_Times) {
                                Upload_Retry_Times++
                                setTimeout(function() {
                                    proto_uploadPic(
                                        opt,
                                        succCallback,
                                        errorCallback
                                    )
                                }, 1000)
                            } else {
                                me.cbErr(resp)
                            }
                            //me.cbErr
                        }
                        //分片上传图片接口
                        proto_uploadPic(opt, succCallback, errorCallback)
                    }
                },
                onLoadEnd: function() {
                    let me = file_upload
                },
                //分片读取文件方法
                readBlob: function(start) {
                    let me: any = file_upload
                    let blob,
                        file = me.file
                    let end = start + me.step
                    if (end > me.total) {
                        end = me.total
                        me.sliceSize = end - start
                    } else {
                        me.sliceSize = me.step
                    }
                    me.sliceOffset = start
                    //根据起始和结束位置，分片读取文件
                    blob = me.blobSlice.call(file, start, end)
                    //将分片的二进制数据转换为base64编码
                    me.reader.readAsDataURL(blob)
                },
                abortHandler: function() {
                    let me: any = file_upload
                    if (me.reader) {
                        me.reader.abort()
                    }
                }
            }

            //读取文件MD5
            this.getFileMD5(
                options.file,
                function(fileMd5) {
                    log.info('fileMd5: ' + fileMd5)
                    options.fileMd5 = fileMd5
                    //初始化上传参数
                    file_upload.init(options, cbOk, cbErr)
                    //开始上传文件
                    file_upload.upload()
                },
                cbErr
            )
        }
    }
}
