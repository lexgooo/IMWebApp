import * as React from 'react'
import ListItem from './ListItem'

export default class MsgList extends React.Component {

    public state = {
        msgList: [
            {
                id: '1',
                userName: '用户1',
                time: '2019-07-22 11:06:36',
                lastMsg: '最后一条消息内容',
                unread: 1
            },
            {
                id: '2',
                userName: '用户2',
                time: '2019-07-22 11:06:36',
                lastMsg: '最后一条消息内容',
                unread: 38
            },
            {
                id: '3',
                userName: '用户3',
                time: '2019-07-22 11:06:36',
                lastMsg: '最后一条消息内容',
                unread: 200
            },
            {
                id: '4',
                userName: '用户4',
                time: '2019-07-22 11:06:36',
                lastMsg: '最后一条消息内容',
                unread: 0
            }
        ]
    }

    private rendItem():any[] {
        const list = [...this.state.msgList]
        return list.map((item, index) => {
            return <ListItem item={item} index={index}  key={item.id} />
        })
    }

    public render() {
        return (
            <main>
                <ul>
                    {this.rendItem()}
                </ul>
            </main>
        )
    }
}