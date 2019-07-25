import * as React from 'react'
import { Link } from 'react-router-dom'
import ItemStyleComp from './ItemStyleComp'
import altAvatar from '../../../images/alt.png'
import Qs from 'qs'

export interface contactProps {
    id: string
    name: string
    normalGap: number
    index: number
    avatar?: string
}

export default class ContactItem extends React.Component<contactProps, {}> {
    protected avatarSize: number = 38
    private avatar: string = this.props.avatar ? this.props.avatar : altAvatar
    private avatarStyle: object = {
        height: `${this.avatarSize}px`,
        width: `${this.avatarSize}px`,
        borderRadius: `${this.avatarSize / 2}px`,
        overflow: 'hidden',
        background: `url(${this.avatar})`,
        backgroundSize: '100%',
        marginRight: `${this.props.normalGap}px`
    }
    private linkStyle = {
        textDecoration: 'none',
        color: '#000'
    }
    public render() {
        return (
            <Link style={this.linkStyle} to={{pathname: 'contactprofile', search: `?${Qs.stringify({id: this.props.id, name: this.props.name})}`}}>
                <ItemStyleComp
                    leftGap={this.props.normalGap * 2 + this.avatarSize}
                    normalGap={this.props.normalGap}
                    index={this.props.index}
                >
                    <div style={this.avatarStyle} /><p>{this.props.name}</p>
                </ItemStyleComp>
            </Link>
        )
    }
}
