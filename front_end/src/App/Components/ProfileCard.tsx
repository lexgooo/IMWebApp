import * as React from 'react'
import avatarAlt from '../../images/alt.png'

export interface profileProps {
    name: string
    gender: string
    id: string
    avatar?: string
}

export default class ProfileCard extends React.Component<profileProps, {}> {
    private cardGap: number = 15
    private avatarSize: number = 112
    private cardStyle: object = {
        background: '#fff',
        padding: `${this.cardGap}px`,
        display: 'flex'
    }
    private avatar: string = this.props.avatar ? this.props.avatar : avatarAlt
    private avatarStyle: object = {
        height: `${this.avatarSize}px`,
        width: `${this.avatarSize}px`,
        borderRadius: `${this.avatarSize / 2}px`,
        overflow: 'hidden',
        background: `url(${this.avatar})`,
        backgroundSize: '100%',
        marginRight: `${this.cardGap}px`
    }
    private contentStyle:object = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontWeight: '100'
    }
    render() {
        return (
            <div style={this.cardStyle}>
                <section style={this.avatarStyle} />
                <div style={this.contentStyle}>
                    <h3
                        style={{
                            fontSize: `18px`,
                            fontWeight: 'normal'
                        }}
                    >
                        {this.props.name}
                    </h3>
                    <p>
                        <label>性别：</label>
                        <span>{this.props.gender}</span>
                    </p>
                    <p>
                        <label>ID：</label>
                        <span>{this.props.id}</span>
                    </p>
                </div>
            </div>
        )
    }
}
