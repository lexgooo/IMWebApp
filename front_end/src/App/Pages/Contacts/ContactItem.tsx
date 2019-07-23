import * as React from 'react'
import ItemStyleComp from './ItemStyleComp'
import altAvatar from '../avatar/alt.png'

export interface contactProps {
    id:string
    name:string
    normalGap: number
    index: number
    avatar?: string
}

export default class ContactItem extends React.Component<contactProps, {}> {
    protected avatarSize:number = 38
    private avatar:string = this.props.avatar ? this.props.avatar : altAvatar
    private avatarStyle:object = {
        height: `${this.avatarSize}px`,
        width: `${this.avatarSize}px`,
        borderRadius: `${this.avatarSize/2}px`,
        overflow: 'hidden',
        background: `url(${this.avatar})`,
        backgroundSize: '100%',
        marginRight: `${this.props.normalGap}px`
    }
    render() {
        return (
            <ItemStyleComp leftGap={this.props.normalGap*2 + this.avatarSize} normalGap={this.props.normalGap} index={this.props.index}>
                <div style={this.avatarStyle}></div>
                <p>{this.props.name}</p>
            </ItemStyleComp>
        )
    }
}