import webim from '../plugins/im_sdk'
const Cookies = require('js-cookie')

let imLoginfo: { sdkAppID: string; identifier?: string; userSig?: string } = {
    sdkAppID: '1400231031'
}
export interface loginParams {
    userId: string
    password: string
}
export function login(params: loginParams): any {
    return new Promise((resolve, reject) => {
        let datas: {
            userList: any[]
        } = require('./datas.json')
        const userList: { UserID: string; UserSig: string }[] = datas.userList
        let accountInfo: {
            UserID?: string
            UserSig?: string
        } = {}
        userList.forEach(item => {
            if (item.UserID === params.userId) {
                Cookies.set('UserID', item.UserID)
                Cookies.set('UserSig', item.UserSig)
                accountInfo = item
            }
        })
        if (accountInfo.UserID) {
            loginIM(accountInfo)
        } else {
            reject('找不到用户')
        }
    })
}

function loginIM(params: { UserID?: string; UserSig?: string }) {
    return new Promise((resolve, reject) => {
        const loginInfo = Object.assign(imLoginfo, {
            identifier: params.UserID,
            userSig: params.UserSig
        })
        const listeners = { onMsgNotify }
        const options = {
            isAccessFormalEnv: false,
            isLogOn: true
        }
        webim.login(loginInfo, listeners, options, (res:any) => {
            debugger
            resolve()
        }, (err:any) => [
            reject(err)
        ])
    })
}

function onMsgNotify(resp: any): any {
    console.log('监听到消息有变化', resp)
}
