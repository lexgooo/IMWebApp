import * as React from 'react'
import moment from 'moment'
import avatarAlt from '../../../images/alt.png'
import Item from './Item'

moment.locale('zh-cn') // 没有起效

interface itemProps {
    item: {
        id: string
        userName: string
        time: string
        unread: number
        lastMsg: string
        avatar?: string
    }
    index: number
}

export default class ListItem extends React.Component<itemProps, {}> {
    private normalGap:number = 12
    private avatarSize:number = 45
    private avatarStyle(): {} {
        let avatar: string = this.props.item.avatar
            ? this.props.item.avatar
			: avatarAlt
        return {
			background: `url(${avatar})`,
			backgroundSize: '100%',
			width: `${this.avatarSize}px`,
			height: `${this.avatarSize}px`,
			overflow: 'hidden',
			borderRadius: `${this.avatarSize / 2}px`,
			marginRight: `${this.normalGap}px`
		}
    }
    private mainStyle:{} = {
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
    private betweenStyle:{} = {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        fontWeight: '100',
        color: '#999999'
    }
    private badageStyle:{} = {
        background: '#F95250',
        color: '#fff',
        height: '20px',
        minWidth: '20px',
        padding: '0 5px',
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px'
    }
    private badage(unread:number):any {
        if (unread > 0) {
            return <span style={this.badageStyle}>{unread <= 99 ? unread : '99+'}</span>
        }
    }
    public render() {
        return (
            <Item leftGap={this.avatarSize + this.normalGap*2} index={this.props.index} normalGap={this.normalGap}>
                <div style={this.avatarStyle()} />
                <div style={this.mainStyle}>
                    <div style={this.betweenStyle}>
                        <span style={{fontSize: '18px', fontWeight: 'normal', color: '#000'}}>{this.props.item.userName}</span>
                        <span>{moment(this.props.item.time).fromNow()}</span>
                    </div>
                    <div style={this.betweenStyle}>
                        <span>{this.props.item.lastMsg}</span>
                        {this.badage(this.props.item.unread)}
                    </div>
                </div>
            </Item>
        )
    }
}
