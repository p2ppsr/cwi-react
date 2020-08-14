import React, { useEffect } from 'react'
import { initialize, bindCallback } from '@p2ppsr/cwi-auth'
import { toast, ToastContainer } from 'react-toastify'
import Theme from './Theme.jsx'
import CodeHandler from './CodeHandler.jsx'
import PasswordHandler from './PasswordHandler.jsx'
import PaymentHandler from './PaymentHandler.jsx'
import RecoveryKeyHandler from './RecoveryKeyHandler.jsx'

const CWIComponents = ({
  planariaToken = process.env.REACT_APP_PLANARIA_TOKEN,
  secretServerURL = process.env.REACT_APP_SECRET_SERVER_URL
}) => {
  useEffect(() => {
    (async () => {
      await initialize({
        planariaToken,
        secretServerURL,
        stateSnapshot: localStorage.CWIAuthStateSnapshot
      })
      bindCallback('onAuthenticationError', toast.error)
    })()
  }, [])

  return (
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
  )
}

export default CWIComponents
