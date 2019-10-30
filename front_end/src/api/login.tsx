const Cookies = require('js-cookie')

// let imLoginfo: { sdkAppID: string; identifier?: string; userSig?: string } = {
//     sdkAppID: '1400231031'
// }
export interface loginParams {
    userId: string
    password: string
}
export function login(params: loginParams): any {
    // return new Promise((resolve, reject) => {
    //     let datas: {
    //         userList: any[]
    //     } = require('./datas.json')
    //     const userList: { UserID: string; UserSig: string }[] = datas.userList
    //     let accountInfo: {
    //         UserID?: string
    //         UserSig?: string
    //     } = {}
    //     userList.forEach(item => {
    //         if (item.UserID === params.userId) {
    //             accountInfo = item
    //         }
    //     })
    //     if (accountInfo.UserID) {
    //         debugger
    //         loginIM(accountInfo).then((res:any) => {
    //             debugger
    //             resolve(res)
    //         }).catch((err:any) => {
    //             debugger
    //             reject(err)
    //         })
    //     } else {
    //         reject('找不到用户')
    //     }
    // })
}

function loginIM(params: { UserID?: string; UserSig?: string }) {
    // return new Promise((resolve, reject) => {
    //     const loginInfo = Object.assign(imLoginfo, {
    //         identifier: params.UserID,
    //         userSig: params.UserSig
    //     })
    //     const listeners = { onMsgNotify }
    //     const options = {
    //         isAccessFormalEnv: true,
    //         isLogOn: true
    //     }
    //     window.webim.login(loginInfo, listeners, options, (res:any) => {
    //         Cookies.set('UserID', params.UserID)
    //         Cookies.set('UserSig', params.UserSig)
    //         resolve(res)
    //     }, (err:any) => {
    //         reject(err)
    //     })
    // })
}

function onMsgNotify(resp: any): any {
    console.log('监听到消息有变化', resp)
}
