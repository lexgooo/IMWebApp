import * as React from 'react'
import NavItem from './NavItem'

interface navPorps {
    navs: {
        value:string,
        label:string,
        icon:string
    }[]
}
export default class BottomNavigation extends React.Component<navPorps, {}> {

    private navItems(navs:any[]):any[] {
        return navs.map((item) => {
            return <NavItem value={item.value} label={item.label} icon={item.icon} />
        })
    }

    private navStyle:{} = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '60px',
        background: 'rgba(215, 215, 215, 0.6)'
    }

    public render () {
        return (<ul style={this.navStyle}>
            {this.navItems(this.props.navs)}
        </ul>)
    }
}