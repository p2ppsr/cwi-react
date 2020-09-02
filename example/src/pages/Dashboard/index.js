import React, { useState, useEffect } from 'react'
import { getUserID, isAuthenticated } from '@p2ppsr/react-cwi/auth'

export default ({ history }) => {
  const [userID, setUserID] = useState('')

  useEffect(() => {
    setTimeout(() => {
      if (isAuthenticated()) {
        setUserID(getUserID())
      } else {
        history.push('/')
      }
    }, 1000)
  }, [history])

  return (
    <div>
      <h3>Hello, {userID}!</h3>
      <p>Welcome to your dashboard</p>
    </div>
  )
}
