import React, { useState, useEffect } from 'react'
import { getUserID } from '@p2ppsr/react-cwi/auth'

export default () => {
  const [userID, setUserID] = useState('')

  useEffect(() => {
    setUserID(getUserID())
  }, [])

  return (
    <div>
      <h3>Hello, {userID}!</h3>
      <p>Welcome to your dashboard</p>
    </div>
  )
}
