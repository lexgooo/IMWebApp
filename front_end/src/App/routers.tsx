import Main from './Pages/Main'
import MsgList from './Pages/MsgList/index'
import Contacts from './Pages/Contacts/index'
import Profile from './Pages/Profile/index'
import Login from './Pages/Login/index'
import ContactProfile from './Pages/ContactProfile'
import ChatWindow from './Pages/ChatWindow/index'

export default [
    {
        path: '/',
        component: Main,
        routes: [
            {
                path: '/msglist',
                component: MsgList,
                name: 'msglist',
                title: '消息列表',
                navigation: true
            },
            {
                path: '/contacts',
                component: Contacts,
                name: 'contacts',
                title: '联系人列表',
                navigation: true
            },
            {
                path: '/profile',
                component: Profile,
                name: 'profile',
                title: '个人中心',
                navigation: true
            },
            {
                path: '/contactprofile',
                component: ContactProfile,
                name: 'contactprofile',
                back: true
            },
            {
                path: '/chatwindow',
                component: ChatWindow,
                name: 'chatwindow',
                back: true
            }
        ]
    },
    {
        path: '/login',
        component: Login
    }
]
