import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import Greeter from '../pages/Greeter/index.jsx'
import Recovery from '../pages/Recovery/index.jsx'
import RecoveryLostPassword from '../pages/Recovery/LostPassword.jsx'
import RecoveryLostPhone from '../pages/Recovery/LostPhone.jsx'
import Settings from '../pages/Settings/index.jsx'
import PhoneSettings from '../pages/Settings/Phone.jsx'
import PasswordSettings from '../pages/Settings/Password.jsx'
import RecoveryKeySettings from '../pages/Settings/RecoveryKey.jsx'
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
  const reduxRoutes = store.getState().routes
  const combinedRoutes = {
    ...reduxRoutes,
    ...routes
  }

  useEffect(() => {
    store.dispatch({
      type: UPDATE,
      payload: {
        routes: {
          ...store.getState().routes,
          routes
        }
      }
    })
  }, [routes])

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
        path={combinedRoutes.Settings}
        component={withWrappers(Settings)}
      />
      <Route
        exact
        path={combinedRoutes.PhoneSettings}
        component={withWrappers(PhoneSettings)}
      />
      <Route
        exact
        path={combinedRoutes.PasswordSettings}
        component={withWrappers(PasswordSettings)}
      />
      <Route
        exact
        path={combinedRoutes.RecoveryKeySettings}
        component={withWrappers(RecoveryKeySettings)}
      />
    </>
  )
}

export default CWIRoutes
