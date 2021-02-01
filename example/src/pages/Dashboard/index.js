import React, { useState, useEffect } from 'react'
import {
  ninja,
  waitForInitialization,
  isAuthenticated,
  logout,
  encrypt,
  decrypt,
  sendDataTransaction
} from '@cwi/core'
import { Button, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

// For debugging while on this page
window.ninja = ninja
window.encrypt = encrypt
window.decrypt = decrypt
window.sendDataTransaction = sendDataTransaction

export default ({ history }) => {
  const [userID, setUserID] = useState('')
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    (async () => {
      await waitForInitialization()
      if (isAuthenticated()) {
        setUserID(await ninja.getPaymail())
        refreshBalance()
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

  const refreshBalance = async () => {
    const result = await ninja.getTotalValue()
    setBalance(result.total)
  }

  return (
    <center style={{ wordWrap: 'break-word' }}>
      <br />
      <br />
      <Typography variant='h4'>Hello, {userID}!</Typography>
      <Typography variant='h5' paragraph>
        Balance: {balance} satoshis
      </Typography>
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
        onClick={async () => {
          await sendDataTransaction({
            reason: 'Create an example Bitcoin SV data transaction',
            data: [new Uint8Array(50)]
          })
          await refreshBalance()
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
          path: 'm/3301/1',
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
