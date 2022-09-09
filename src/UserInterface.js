import React, { useEffect } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Greeter from './pages/Greeter/index.jsx'
import Recovery from './pages/Recovery/index.jsx'
import LostPhone from './pages/Recovery/LostPhone.jsx'
import LostPassword from './pages/Recovery/LostPassword.jsx'
import Dashboard from './pages/Dashboard/index.jsx'
import Password from './pages/Password/index.jsx'
import ProtocolPermission from './pages/ProtocolPermission/index.jsx'
import SpendingAuthorization from './pages/SpendingAuthorization/index.jsx'
import Payment from './pages/Payment/index.jsx'
import Welcome from './pages/Welcome/index.jsx'
import Theme from 'components/Theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CodeHandler from 'components/CodeHandler.jsx'
import RecoveryKeyHandler from 'components/RecoveryKeyHandler.jsx'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

let ErrorBoundary = ({ children }) => children

export default () => {
  useEffect(() => {
    (async () => {
      const env = window.ENV
      if (env !== 'dev') {
        Bugsnag.start({
          apiKey: 'ffe7920be5e154faf6124e012c533b39',
          plugins: [new BugsnagPluginReact()],
          appVersion: await window.CWI.getElectronAppVersion()
        })
        ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)
        window.Bugsnag = Bugsnag
      }
    })()
  }, [])

  return (
    <ErrorBoundary>
      <Theme>
        <Router
          hashType='noslash'
        >
          <CodeHandler />
          <RecoveryKeyHandler />
          <ToastContainer
            position='top-center'
          />
          <Switch>
            <Route
              exact
              path='/'
              component={Greeter}
            />
            <Route
              exact
              path='/recovery/lost-phone'
              component={LostPhone}
            />
            <Route
              exact
              path='/recovery/lost-password'
              component={LostPassword}
            />
            <Route
              exact
              path='/recovery'
              component={Recovery}
            />
            <Route
              path='/dashboard'
              component={Dashboard}
            />
            <Route
              path='/password'
              component={Password}
            />
            <Route
              path='/protocolpermission'
              component={ProtocolPermission}
            />
            <Route
              path='/spendingauthorization'
              component={SpendingAuthorization}
            />
            <Route
              path='/payment'
              component={Payment}
            />
            <Route
              path='/welcome'
              component={Welcome}
            />
          </Switch>
        </Router>
      </Theme>
    </ErrorBoundary>
  )
}
