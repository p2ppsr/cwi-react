import React, { useState, useEffect } from 'react'
import {
  getUserID,
  waitForInitialization,
  isAuthenticated
} from 'pages/Settings/About/node_modules/@cwi/core'

export default ({ history }) => {
  const [userID, setUserID] = useState('')

  useEffect(() => {
    (async () => {
      await waitForInitialization()
      if (isAuthenticated()) {
        setUserID(getUserID())
      } else {
        history.push('/')
      }
    })()
  }, [history])

  return (
    <div>
      <h3>Hello, {userID}!</h3>
      <p>Welcome to your dashboard</p>
    </div>
  )
}
