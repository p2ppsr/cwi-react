import React, { useState, useEffect } from 'react'
import { DialogActions, DialogContent, Button, DialogContentText } from '@mui/material'
import CustomDialog from './CustomDialog/index.jsx'

const AuthenticationErrorHandler = () => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback('onAuthenticationError', error => {
        setMessage(error)
        setOpen(true)
      })
    })()
    return () => {
      if (id) {
        window.CWI.unbindCallback('onAuthenticationError', id)
      }
    }
  }, [])

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      title='Authentication Error'
    >
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={() => setOpen(false)}
        >
          OK
        </Button>
      </DialogActions>
    </CustomDialog>
  )
}

export default AuthenticationErrorHandler
