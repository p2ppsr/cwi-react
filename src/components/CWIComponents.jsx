import React, { useEffect } from 'react'
import { initialize, bindCallback, isAuthenticated } from '@p2ppsr/cwi-auth'
import { toast, ToastContainer } from 'react-toastify'
import Theme from './Theme.jsx'
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
  commissions = [],
  mainPage = '/dashboard',
  logoURL,
  routes
} = {}) => {
  useEffect(() => {
    (async () => {
      bindCallback('onAuthenticationError', toast.error)
      await initialize({
        planariaToken,
        secretServerURL,
        commissions,
        stateSnapshot: localStorage.CWIAuthStateSnapshot
      })
      if (
        isAuthenticated() &&
        window.location.pathname === store.getState().routes.Greeter
      ) {
        history.push(mainPage)
      }
    })()
  }, [])

  useEffect(() => {
    store.dispatch({
      type: UPDATE,
      payload: {
        mainPage,
        logoURL
      }
    })
  }, [mainPage, logoURL])

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
