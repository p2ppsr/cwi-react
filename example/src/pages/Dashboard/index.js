import React, { useState, useEffect } from 'react'
import {
  ninja,
  waitForInitialization,
  isAuthenticated,
  logout,
  encrypt,
  decrypt,
  createAction,
  isInitialized
} from '@cwi/core'
import * as CWI from '@cwi/core'
import { Button, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

// For debugging while on this page
window.CWI = CWI
window.ninja = ninja
window.encrypt = encrypt
window.decrypt = decrypt
window.createAction = createAction

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
          await createAction({
            description: 'Create an example Bitcoin SV data transaction',
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
          protocolID: 'example',
          keyID: 'test',
          data: 'hello',
          originator: 'domain.com'
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
