import * as React from 'react'
import ListItem from './ListItem'

export default class MsgList extends React.Component {

    public state = {
        msgList: [
            {
                id: '1',
                userName: '用户1',
                time: '1563588656893',
                lastMsg: '最后一条消息内容',
                unread: 1,
                avator: './avator/640.jpeg'
            },
            {
                id: '2',
                userName: '用户2',
                time: '1563588656893',
                lastMsg: '最后一条消息内容',
                unread: 38,
                avator: './avator/6401.jpeg'
            },
            {
                id: '3',
                userName: '用户3',
                time: '1563588656893',
                lastMsg: '最后一条消息内容',
                unread: 200,
                avator: './avator/6402.jpeg'
            },
            {
                id: '4',
                userName: '用户4',
                time: '1563588656893',
                lastMsg: '最后一条消息内容',
                unread: 0,
                avator: './avator/640.jpeg'
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