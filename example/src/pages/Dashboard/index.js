import React, { useState, useEffect } from 'react'
import {
  getUserID,
  waitForInitialization,
  isAuthenticated,
  logout,
  sendDataTransaction
} from '@cwi/core'
import { Button, Typography } from '@material-ui/core'
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

  const handleLogout = async () => {
    await logout()
    history.push('/')
  }

  return (
    <center>
      <br />
      <br />
      <Typography variant='h4' paragraph>Hello, {userID}!</Typography>
      <Typography paragraph>Welcome to your dashboard</Typography>
      <Link to='/cwi-settings'>
        <Button color='primary' variant='contained'>
          CWI Settings
        </Button>
      </Link>
      <br />
      <br />
      <Button
        color='primary'
        onClick={() => {
          sendDataTransaction({
            reason: 'Create an enormous 5MB Bitcoin SV transaction',
            data: [new Uint8Array(5000000)]
          })
        }}
      >
        Seng Enormous Transaction
      </Button>
      <br />
      <br />
      <Button
        color='secondary'
        onClick={handleLogout}
      >
        Log out
      </Button>
    </center>
  )
}
