import React, { useState, useEffect } from 'react'
import {
  getUserID,
  waitForInitialization,
  isAuthenticated
} from '@cwi/core'
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

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
      <Link to='/cwi-settings'>
        <Button color='primary' variant='contained'>
          CWI Settings
        </Button>
      </Link>
    </div>
  )
}
