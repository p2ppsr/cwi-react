import React, { useEffect } from 'react'
import {
  initialize,
  bindCallback,
  unbindCallback,
  isAuthenticated
} from '@cwi/core'
import { toast, ToastContainer } from 'react-toastify'
import { Theme } from '@cwi/mui-theme'
import CodeHandler from './CodeHandler.jsx'
import PasswordHandler from './PasswordHandler.jsx'
import PaymentHandler from './PaymentHandler.jsx'
import RecoveryKeyHandler from './RecoveryKeyHandler.jsx'
import store from '../redux/store'
import { UPDATE } from '../redux/types'
import { Provider } from 'react-redux'
import { withRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

const CWIComponents = ({
  history,
  planariaToken = process.env.REACT_APP_PLANARIA_TOKEN,
  secretServerURL = process.env.REACT_APP_SECRET_SERVER_URL,
  dojoURL = process.env.REACT_APP_DOJO_URL,
  approxTransactionOverhead = process.env.REACT_APP_APPROX_TRANSACTION_OVERHEAD,
  commissions = [],
  mainPage,
  appLogo,
  routes,
  appName
} = {}) => {
  useEffect(() => {
    (async () => {
      await initialize({
        planariaToken,
        secretServerURL,
        dojoURL,
        approxTransactionOverhead,
        commissions,
        stateSnapshot: localStorage.CWIAuthStateSnapshot
      })
      if (
        isAuthenticated() &&
        window.location.pathname === store.getState().routes.Greeter
      ) {
        history.push(mainPage || store.getState().mainPage)
      }
    })()
  }, [])

  useEffect(() => {
    const callbackID = bindCallback('onAuthenticationError', toast.error)
    return () => unbindCallback('onAuthenticationError', callbackID)
  })

  useEffect(() => {
    if (mainPage) {
      store.dispatch({
        type: UPDATE,
        payload: {
          mainPage
        }
      })
    }
  }, [mainPage])

  useEffect(() => {
    if (appLogo) {
      store.dispatch({
        type: UPDATE,
        payload: {
          appLogo
        }
      })
    }
  }, [appLogo])

  useEffect(() => {
    if (appName) {
      store.dispatch({
        type: UPDATE,
        payload: {
          appName
        }
      })
    }
  }, [appName])

  return (
    <Provider store={store}>
      <Theme>
        <CodeHandler />
        <PasswordHandler />
        <PaymentHandler />
        <RecoveryKeyHandler />
        <ToastContainer
          position='top-center'
          hideProgressBar
        />
      </Theme>
    </Provider>
  )
}

export default withRouter(CWIComponents)
