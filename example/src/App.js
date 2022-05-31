import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { CWIComponents, CWIRoutes } from '@cwi/react'

export default () => (
  <Router>
    <CWIComponents
      secretServerURL='http://localhost:3101'
      dojoURL='http://localhost:3102'
      bridgeportResolvers={['http://localhost:3103']}
      appName='Example App'
    />
    <Switch>
      <Route exact path='/dashboard' component={Dashboard} />
      <CWIRoutes />
    </Switch>
  </Router>
)
