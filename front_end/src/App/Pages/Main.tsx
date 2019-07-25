import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import TopBar from '../Components/TopBar/index'
import BottomNavigation from '../Components/BottomNavigation/index'

export interface mainProps {
    routes: {
        path: string
        component: any
        title?: string
        name?: string
        back?: boolean
        navigation?: boolean
    }[]
    location: any,
    history: {},
    match: any
}

export default class Main extends Component<mainProps, {}> {
    private mainStyle(): {} {
        return this.props.location.pathname !== '/login' ? {
            display: 'flex',
            flexDirection: 'column',
            height:  '100%'
        } : {
            display: 'none'
        }
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

    private renderNavigation() {
        const currentRoute = this.currentRoute()
        if (currentRoute && currentRoute.navigation) {
            return <BottomNavigation currentRoute={currentRoute} navs={this.state.navs} />
        }
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
            <div style={this.mainStyle()}>
                <TopBar currentRoute={this.currentRoute()} search={this.props.location.search} history={this.props.history} />
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
                {this.renderNavigation()}
            </div>
        )
    }
}
