import React, { useEffect } from 'react'
import {
  bindCallback,
  unbindCallback,
  submitPassword,
  abortPassword
} from 'pages/Settings/About/node_modules/@cwi/core'
import {
  PasswordModal,
  requestPassword,
  closeModal,
  clearPassword
} from '@cwi/password-modal'

const PasswordHandler = () => {
  useEffect(() => {
    const callbackID = bindCallback('onPasswordRequired', reason => {
      requestPassword({
        reason,
        onAttempt: async passwordAttempt => {
          const success = await submitPassword(passwordAttempt)
          if (success === true) {
            closeModal()
          } else {
            clearPassword()
          }
        },
        onAbort: () => {
          abortPassword()
          clearPassword()
          closeModal()
        }
      })
    })
    return () => unbindCallback('onPasswordRequired', callbackID)
  }, [])

  return (
    <PasswordModal />
  )
}

export default PasswordHandler
