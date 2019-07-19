import React, { Component } from 'react'
import { Link } from 'react-router-dom'
interface itemProps {
    value: string
    label: string
    icon: string
}
export default class NavItem extends Component<itemProps, {}> {

    private itemStyle:{} = {
        textAlign: 'center'
    }
    public render() {
        return (
            <li key={this.props.value} style={this.itemStyle}>
                <Link to={this.props.value}>
                    <i className={`iconfont ${this.props.icon}`} />
                    <div style={{fontSize: '12px', paddingTop: '5px'}}>{this.props.label}</div>
                </Link>
            </li>
        )
    }
}
