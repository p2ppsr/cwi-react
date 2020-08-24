import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { CWIComponents, CWIRoutes } from '@p2ppsr/react-cwi'

export default () => (
  <Router>
    {/* Keep this Planaria token private in this private repository. */}
    <CWIComponents
      planariaToken='eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxQUhCaUpwOTFveE5UY2dwTGQ5aVVhVlU4NDRtMnM1eFVjIiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHdtNndWakkvcW8rRTY4Tm9SK0ZmMU1tWUhDcXY0eFZDUFdQd1lsSnp6c21GMU1yM2dvY0kyeVhVejg0Qms0NmtidjVUdWF1bzFIZzVVUTRhbzNFYytNPQ'
      secretServerURL='http://localhost:3999'
    />
    <Switch>
      <Route exact path='/dashboard' component={Dashboard} />
      <CWIRoutes />
    </Switch>
  </Router>
)
