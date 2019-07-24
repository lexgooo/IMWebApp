import * as React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import routes from './routers'

export default class App extends React.Component<{}, {}> {
    public render() {
        return (
            <Router>
                {routes.map((route, i) => {
                    return (
                        <Route
                            path={route.path}
                            render={props => {
                                return route.routes ? <route.component {...props} routes={route.routes} /> : <route.component {...props} />
                            }}
                            key={i}
                        />
                    )
                })}
                <Redirect from='/' to='/msglist' />
            </Router>
        )
    }
}
