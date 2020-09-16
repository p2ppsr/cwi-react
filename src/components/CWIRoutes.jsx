import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import Greeter from '../pages/Greeter/index.jsx'
import Recovery from '../pages/Recovery/index.jsx'
import Settings from '../pages/Settings/index.jsx'
import { Theme } from '@cwi/mui-theme'
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
        path={combinedRoutes.Recovery}
        component={withWrappers(Recovery)}
      />
      <Route
        path={combinedRoutes.CWISettings}
        component={withWrappers(Settings)}
      />
    </>
  )
}

export default CWIRoutes
