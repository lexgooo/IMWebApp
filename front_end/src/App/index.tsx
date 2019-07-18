import * as React from 'react'

import BottomNavigation from './Components/BottomNavigation/index'
import MsgList from './Pages/MsgList'

export default class App extends React.Component {
    private mainStyle:{} = {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
    }
    private pageStyle:{} = {
        flex: '1'
    }
    public state = {
        navs: [
            {
                value: 'msgList',
                label: '消息列表',
                icon: 'icon-message'
            },
            {
                value: 'contacts',
                label: '联系人',
                icon: 'icon-lianxirenqunzu'
            },
            {
                value: 'profile',
                label: '个人中心',
                icon: 'icon-gerenzhongxin'
            }
        ]
    }
    public render() {
        return (
            <div style={this.mainStyle}>
                <div style={this.pageStyle}>
                    <MsgList />
                </div>
                <BottomNavigation navs={this.state.navs} />
            </div>
        )
    }
}
