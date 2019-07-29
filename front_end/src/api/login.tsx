const Cookies = require('js-cookie')

let imLoginfo:{sdkAppID: string; identifier?: string; userSig?: string} = {
    sdkAppID: '1400231031'
}
export interface loginParams {
    userId: string
    password: string
}
export function login(params: loginParams): any {
    return new Promise((resolve, reject) => {
        const datas:{} = require('./datas.json')
        const userList:{UserID: string; UserSig: string}[] = datas.userList
        let accountInfo: {
            UserID?: string;
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

function loginIM (params:{UserID?:string; UserSig?: string}) {
    const loginInfo = Object.assign(imLoginfo, {identifier: params.UserID, userSig: params.UserSig})
    
    // TODO 从这里开始
}
