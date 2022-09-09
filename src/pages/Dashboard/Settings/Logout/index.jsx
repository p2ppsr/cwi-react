import React, { useState } from 'react'
import { Button } from '@mui/material'

const Logout = ({ history }) => {
  const [loading, setLoading] = useState(false)

  const signout = async () => {
    setLoading(true)
    try {
      // This is for UX reasons, and also to make the button turn grey before the prompt to window.confirm
      await new Promise(resolve => setTimeout(resolve, 750))
      if (
        !window.confirm(
          'Are you absolutely sure you want to log out of Babbage Desktop on this device?\n\nYou will also be logged out of all apps and websites that use Babbage Desktop.'
        )
      ) {
        return
      }
      await window.CWI.logout()
      await window.CWI.removeLocalSnapshot()
      history.push('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant='contained'
      color='secondary'
      onClick={signout}
      disabled={loading}
    >
      Sign Out of Babbage Desktop and All Apps
    </Button>
  )
}

export default Logout
