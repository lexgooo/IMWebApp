import React, { Component } from 'react'
import {Route, Link } from 'react-router-dom'
interface itemProps {
    value: string
    label: string
    icon: string
}
export default class NavItem extends Component<itemProps, {}> {

    private itemStyle:{} = {
        textAlign: 'center',
    }
    private aTagStyle(location:any):{} {
        const color:string = location.pathname === `/${this.props.value}` ? '#03C160' : '#000'
        return {
            color,
            textDecoration: 'none'
        }
    }
    private children (location:any):{} {
        return (
            <li style={this.itemStyle}>
                <Link to={this.props.value} style={this.aTagStyle(location)}>
                    <i className={`iconfont ${this.props.icon}`} />
                    <div style={{fontSize: '12px', paddingTop: '5px'}}>{this.props.label}</div>
                </Link>
            </li>
        )
    }
    public render() {
        return (
            <Route path={this.props.value} children = {({location}) => {
                return this.children(location)
            }}/>
        )
    }
}
