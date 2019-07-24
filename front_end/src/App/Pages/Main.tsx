import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import TopBar from '../Components/TopBar/index'
import BottomNavigation from '../Components/BottomNavigation/index'

export interface mainProps {
    routes: {
        path: string
        component: any
        title: string
        name?: string
        back?: boolean
    }[]
    location: any
}

export default class Main extends Component<mainProps, {}> {
    private mainStyle: {} = {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
    }
    private pageStyle: {} = {
        flex: '1',
        background: '#EDEDED',
        overflow: 'hidden'
    }

    protected currentRoute() {
        const currentPath = this.props.location.pathname
        const routes = [...this.props.routes]
        return routes.find(route => currentPath === route.path)
    }

    public state = {
        navs: [
            {
                value: 'msglist',
                label: '消息',
                icon: 'icon-message'
            },
            {
                value: 'contacts',
                label: '联系人',
                icon: 'icon-lianxirenqunzu'
            },
            {
                value: 'profile',
                label: '我',
                icon: 'icon-gerenzhongxin'
            }
        ]
    }
    public render() {
        const routes = this.props.routes
        return (
            <div style={this.mainStyle}>
                <TopBar currentRoute={this.currentRoute()} />
                <div style={this.pageStyle}>
                    {routes && routes.map((item, i) => {
                        return (
                            <Route
                                path={item.path}
                                component={item.component}
                                key={i}
                            />
                        )
                    })}
                </div>
                <BottomNavigation currentRoute={this.currentRoute()} navs={this.state.navs} />
            </div>
        )
    }
}
