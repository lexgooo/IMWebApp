import React, { Component } from 'react'
import { Link } from 'react-router-dom'
interface itemProps {
    value: string
    label: string
    icon: string
    currentRoute?: {
        path: string
        component: any
        title?: string
        name?: string
        back?: boolean
        navigation?: boolean
    }
}
export default class NavItem extends Component<itemProps, {}> {
    private itemStyle: {} = {
        textAlign: 'center'
    }
    private aTagStyle(): {} {
        const currentName = this.props.currentRoute && this.props.currentRoute.name
        const color: string = currentName === this.props.value ? '#03C160' : '#000'
        return {
            color,
            textDecoration: 'none'
        }
    }
    public render() {
        return (
            <li style={this.itemStyle}>
                <Link to={this.props.value} style={this.aTagStyle()}>
                    <i className={`iconfont ${this.props.icon}`} />
                    <div style={{ fontSize: '12px', paddingTop: '5px' }}>
                        {this.props.label}
                    </div>
                </Link>
            </li>
        )
    }
}
