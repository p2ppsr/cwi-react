import React from 'react'
import { Route } from 'react-router-dom'
import Greeter from '../pages/Greeter/index.jsx'
import Recovery from '../pages/Recovery/index.jsx'
import RecoveryLostPassword from '../pages/Recovery/LostPassword.jsx'
import RecoveryLostPhone from '../pages/Recovery/LostPhone.jsx'
import Change from '../pages/Change/index.jsx'
import ChangePhone from '../pages/Change/Phone.jsx'
import ChangePassword from '../pages/Change/Password.jsx'
import ChangeRecoveryKey from '../pages/Change/RecoveryKey.jsx'
import Theme from './Theme.jsx'

const withTheme = Component => props => (
  <Theme>
    <Component {...props} />
  </Theme>
)

const CWIRoutes = ({
  routes = {
    Greeter: '/',
    Recovery: '/recovery',
    RecoveryLostPassword: '/recovery/lost-password',
    RecoveryLostPhone: '/recovery/lost-phone',
    Change: '/change',
    ChangePhone: '/change/phone',
    ChangePassword: '/change/password',
    ChangeRecoveryKey: '/change/recovery-key'
  }
} = {}) => {
  return (
    <>
      <Route
        exact
        path={routes.Greeter}
        component={withTheme(Greeter)}
      />
      <Route
        exact
        path={routes.Recovery}
        component={withTheme(Recovery)}
      />
      <Route
        exact
        path={routes.RecoveryLostPassword}
        component={withTheme(RecoveryLostPassword)}
      />
      <Route
        exact
        path={routes.RecoveryLostPhone}
        component={withTheme(RecoveryLostPhone)}
      />
      <Route
        exact
        path={routes.Change}
        component={withTheme(Change)}
      />
      <Route
        exact
        path={routes.ChangePhone}
        component={withTheme(ChangePhone)}
      />
      <Route
        exact
        path={routes.ChangePassword}
        component={withTheme(ChangePassword)}
      />
      <Route
        exact
        path={routes.ChangeRecoveryKey}
        component={withTheme(ChangeRecoveryKey)}
      />
    </>
  )
}

export default CWIRoutes
