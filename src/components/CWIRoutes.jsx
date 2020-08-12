import React from 'react'
import { Route } from 'react-router-dom'
import Greeter from 'pages/Greeter'
import Recovery from 'pages/Recovery'
import RecoveryLostPassword from 'pages/Recovery/LostPassword'
import RecoveryLostPhone from 'pages/Recovery/LostPhone'
import Change from 'pages/Change'
import ChangePhone from 'pages/Change/Phone'
import ChangePassword from 'pages/Change/Password'
import ChangeRecoveryKey from 'pages/Chamge/RecoveryKey'

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
        component={Greeter}
      />
      <Route
        exact
        path={routes.Recovery}
        component={Recovery}
      />
      <Route
        exact
        path={routes.RecoveryLostPassword}
        component={RecoveryLostPassword}
      />
      <Route
        exact
        path={routes.RecoveryLostPhone}
        component={RecoveryLostPhone}
      />
      <Route
        exact
        path={routes.Change}
        component={Change}
      />
      <Route
        exact
        path={routes.ChangePhone}
        component={ChangePhone}
      />
      <Route
        exact
        path={routes.ChangePassword}
        component={ChangePassword}
      />
      <Route
        exact
        path={routes.ChangeRecoveryKey}
        component={ChangeRecoveryKey}
      />
    </>
  )
}

export default CWIRoutes
