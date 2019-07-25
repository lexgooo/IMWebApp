import React, {Component} from 'react'
import MsgHistoryList from './MsgHistoryList'
import InputComponents from './InputComponents'

export default class ChatWindow extends Component<{}, {}> {
    private windowStyle:object = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    }
    public render() {
        return (
            <section style={this.windowStyle}>
                <MsgHistoryList />
                <InputComponents />
            </section>
        )
    }
}