import * as React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import BottomNavigation from './Components/BottomNavigation/index'
import MsgList from './Pages/MsgList'
import Contacts from './Pages/Contacts'
import Profile from './Pages/Profile'

export default class App extends React.Component {
    private mainStyle: {} = {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
    }
    private pageStyle: {} = {
        flex: '1'
    }
    public state = {
        navs: [
            {
                value: 'msgList',
                label: '消息',
                icon: 'icon-message'
            },
            {
                value: 'contacts',
                label: '联系人',
                icon: 'icon-lianxirenqunzu'
            },
            {
                value: 'profile',
                label: '我',
                icon: 'icon-gerenzhongxin'
            }
        ]
    }
    public render() {
        return (
            <Router>
                <div style={this.mainStyle}>
                    <div style={this.pageStyle}>
                        <Route exact path="/msgList" component={MsgList} />
                        <Route path='/contacts' component={Contacts}></Route>
                        <Route path='/profile' component={Profile}></Route>
                        <Redirect from='/' to='/msgList' />
                    </div>
                    <BottomNavigation navs={this.state.navs} />
                </div>
            </Router>
        )
    }
}
