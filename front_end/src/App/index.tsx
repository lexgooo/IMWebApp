import * as React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import routes from './routers'

export default class App extends React.Component<{}, {}> {
    public render() {
        return (
            <Router>
                <div style={{height: '100vh'}}>
                    {routes.map((route, i) => {
                        return (
                            <Route
                                path={route.path}
                                render={props => {
                                    return (
                                        <route.component
                                            {...props}
                                            routes={route.routes}
                                        />
                                    )
                                }}
                                key={i}
                            />
                        )
                    })}
                </div>
                <Redirect from='/' to='/msglist' />
            </Router>
        )
    }
}
