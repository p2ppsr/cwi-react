import React, { useState, useEffect } from 'react'
import {
  getUserID,
  waitForInitialization,
  isAuthenticated,
  logout,
  encrypt,
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
    delete localStorage.CWIAuthStateSnapshot
    history.push('/')
  }

  return (
    <center style={{ wordWrap: 'break-word' }}>
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
            reason: 'Create an example Bitcoin SV data transaction',
            data: [new Uint8Array(50)]
          })
        }}
      >
        Send Data Transaction
      </Button>
      <br />
      <br />
      <Button
        color='primary'
        onClick={() => encrypt({
          key: 'privilegedKey',
          data: 'hello'
        })}
      >
        Encrypt with privileged key
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
