import * as React from 'react'
import NavItem from './NavItem'

interface navPorps {
    navs: {
        value:string,
        label:string,
        icon:string
    }[]
}
const navStyle:{} = {
    display: 'flex',
    justifyContent: 'space-between',
    height: '60px'
}
export default class BottomNavigation extends React.Component<navPorps, {}> {

    private navItems(navs:any[]):any[] {
        return navs.map((item) => {
            return <NavItem value={item.value} label={item.label} icon={item.icon} />
        })
    }

    public render () {
        return (<ul style={navStyle}>
            {this.navItems(this.props.navs)}
        </ul>)
    }
}