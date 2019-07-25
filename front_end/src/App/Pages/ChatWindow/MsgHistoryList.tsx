import React, {Component} from 'react'

export default class MsgHistoryList extends Component<{}, {}> {
    private displayStyle:object = {
        flex: '1',
        background: '#e00',
        overflow: 'hidden'
    }
    public render() {
        return <main style={this.displayStyle}>历史消息展示区域</main>
    }
}