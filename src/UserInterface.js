import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BreakpointProvider } from './utils/useBreakpoints.js'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import Greeter from './pages/Greeter/index.jsx'
import Recovery from './pages/Recovery/index.jsx'
import LostPhone from './pages/Recovery/LostPhone.jsx'
import LostPassword from './pages/Recovery/LostPassword.jsx'
import Dashboard from './pages/Dashboard/index.jsx'
import Welcome from './pages/Welcome/index.jsx'
import Theme from 'components/Theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CodeHandler from 'components/CodeHandler.jsx'
import AuthenticationErrorHandler from 'components/AuthenticationErrorHandler.jsx'
import PaymentHandler from 'components/PaymentHandler.jsx'
import PasswordHandler from 'components/PasswordHandler.jsx'
import RecoveryKeyHandler from 'components/RecoveryKeyHandler.jsx'
import ProtocolPermissionHandler from 'components/ProtocolPermissionHandler/index.jsx'
import SpendingAuthorizationHandler from 'components/SpendingAuthorizationHandler/index.jsx'
import BasketAccessHandler from 'components/BasketAccessHandler/index.jsx'
import CertificateAccessHandler from 'components/CertificateAccessHandler/index.jsx'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import UIContext from './UIContext'
import mainBackground from './images/mainBackground.jpg'

const queries = {
  xs: '(max-width: 500px)',
  sm: '(max-width: 720px)',
  md: '(max-width: 1024px)',
  or: '(orientation: portrait)'
}

let ErrorBoundary = ({ children }) => children

export default ({
  onFocusRequested = () => { },
  onFocusRelinquished = () => { },
  isFocused = () => false,
  saveLocalSnapshot = () => { },
  removeLocalSnapshot = () => { },
  appVersion = '1.0.0',
  appName = 'Generic Babbage Wrapper',
  env = 'prod',
  isPackaged = true,
  usePortal = false,
  portalDestination = document.body
} = {}) => {
  useEffect(() => {
    (async () => {
      if (env !== 'dev') {
        Bugsnag.start({
          apiKey: 'ffe7920be5e154faf6124e012c533b39',
          plugins: [new BugsnagPluginReact()],
          appVersion
        })
        ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)
        window.Bugsnag = Bugsnag
      }
    })()
  }, [])

  const returnValue = (
    <BreakpointProvider queries={queries}>
      <UIContext.Provider value={{
        onFocusRequested,
        onFocusRelinquished,
        isFocused,
        saveLocalSnapshot,
        removeLocalSnapshot,
        appVersion,
        appName,
        env,
        isPackaged
      }}
      >
        <div style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,1.0), rgba(255,255,255,0.85)), url(${mainBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.4)'
        }}
        >
          <ErrorBoundary>
            <Theme>
              <Router>
                <CodeHandler />
                <AuthenticationErrorHandler />
                <PasswordHandler />
                <RecoveryKeyHandler />
                <ProtocolPermissionHandler />
                <SpendingAuthorizationHandler />
                <BasketAccessHandler />
                <CertificateAccessHandler />
                <PaymentHandler />
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
                    path='/welcome'
                    component={Welcome}
                  />
                </Switch>
              </Router>
            </Theme>
          </ErrorBoundary>
        </div>
      </UIContext.Provider>
    </BreakpointProvider>
  )
  if (usePortal) {
    return ReactDOM.createPortal(returnValue, portalDestination)
  } else {
    return returnValue
  }
}
