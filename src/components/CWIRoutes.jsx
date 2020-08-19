import React, { useEffect } from 'react'
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
import { Provider } from 'react-redux'
import store from '../redux/store'
import { UPDATE } from '../redux/types'

const withWrappers = Component => props => (
  <Provider store={store}>
    <Theme>
      <Component {...props} />
    </Theme>
  </Provider>
)

const CWIRoutes = ({
  routes = {}
} = {}) => {
  const combinedRoutes = {
    Greeter: '/',
    Recovery: '/recovery',
    RecoveryLostPassword: '/recovery/lost-password',
    RecoveryLostPhone: '/recovery/lost-phone',
    Change: '/change',
    ChangePhone: '/change/phone',
    ChangePassword: '/change/password',
    ChangeRecoveryKey: '/change/recovery-key',
    ...routes
  }

  useEffect(() => {
    store.dispatch({
      type: UPDATE,
      payload: {
        routes: combinedRoutes
      }
    })
  }, [combinedRoutes])

  return (
    <>
      <Route
        exact
        path={combinedRoutes.Greeter}
        component={withWrappers(Greeter)}
      />
      <Route
        exact
        path={combinedRoutes.Recovery}
        component={withWrappers(Recovery)}
      />
      <Route
        exact
        path={combinedRoutes.RecoveryLostPassword}
        component={withWrappers(RecoveryLostPassword)}
      />
      <Route
        exact
        path={combinedRoutes.RecoveryLostPhone}
        component={withWrappers(RecoveryLostPhone)}
      />
      <Route
        exact
        path={combinedRoutes.Change}
        component={withWrappers(Change)}
      />
      <Route
        exact
        path={combinedRoutes.ChangePhone}
        component={withWrappers(ChangePhone)}
      />
      <Route
        exact
        path={combinedRoutes.ChangePassword}
        component={withWrappers(ChangePassword)}
      />
      <Route
        exact
        path={combinedRoutes.ChangeRecoveryKey}
        component={withWrappers(ChangeRecoveryKey)}
      />
    </>
  )
}

export default CWIRoutes
