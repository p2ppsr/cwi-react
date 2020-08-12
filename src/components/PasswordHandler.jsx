import React, { useEffect } from 'react'
import {
  bindCallback,
  submitPassword
} from '@p2ppsr/cwi-auth'
import {
  PasswordModal,
  requestPassword,
  closeModal,
  clearPassword
} from '@p2ppsr/password-modal'

const PasswordHandler = () => {
  useEffect(() => {
    bindCallback('onPasswordRequired', reason => {
      requestPassword({
        reason,
        onAttempt: async passwordAttempt => {
          const success = await submitPassword(passwordAttempt)
          if (success === true) {
            closeModal()
          } else {
            clearPassword()
          }
        }
      })
    })
  }, [])

  return (
    <PasswordModal />
  )
}

export default PasswordHandler
