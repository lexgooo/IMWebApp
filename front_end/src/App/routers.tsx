import Main from './Pages/Main'
import MsgList from './Pages/MsgList/index'
import Contacts from './Pages/Contacts/index'
import Profile from './Pages/Profile/index'
import Login from './Pages/Login/index'

export default [
    {
        path: '/',
        component: Main,
        routes: [
            {
                path: '/msglist',
                component: MsgList,
                name: 'msglist',
                title: '消息列表'
            },
            {
                path: '/contacts',
                component: Contacts,
                name: 'contacts',
                title: '联系人列表'
            },
            {
                path: '/profile',
                component: Profile,
                name: 'profile',
                title: '个人中心'
            }
        ]
    },
    {
        path: '/login',
        component: Login
    }
]
