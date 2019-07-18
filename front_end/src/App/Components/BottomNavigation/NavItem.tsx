import React, {Component} from 'react'
interface itemProps {
    value:string
    label:string
    icon: string
}
export default class NavItem extends Component<itemProps, {}> {
    render() {
        return <li key={this.props.value}><i className={`iconfont ${this.props.icon}`}></i><div>{this.props.label}</div></li>
    }
}