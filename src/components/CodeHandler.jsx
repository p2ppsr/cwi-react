import React, { useState, useEffect } from 'react'
import { DialogActions, DialogContent, Button, DialogContentText, TextField } from '@mui/material'
import CustomDialog from './CustomDialog/index.jsx'

const RecoveryKeyHandler = () => {
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback('onCodeRequired', ({ phone, reason }) => {
        setPhone(phone)
        setReason(reason)
        setOpen(true)
      })
    })()
    return () => {
      if (id) {
        window.CWI.unbindCallback('onCodeRequired', id)
      }
    }
  }, [])

  const handleSubmit = async () => {
    const success = await window.CWI.submitCode(code)
    if (success) {
      setOpen(false)
    }
  }

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        window.CWI.abortCode()
        setOpen(false)
      }}
      title='Code Sent'
    >
      <DialogContent>
        <DialogContentText>
          We just sent a 6-digit code to {phone} as a text message.
        </DialogContentText>
        <DialogContentText>
          {reason}.
        </DialogContentText>
        <TextField
          label='Enter Code'
          onChange={e => setCode(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={handleSubmit}
        >
          submit
        </Button>
      </DialogActions>
    </CustomDialog>
  )
}

export default RecoveryKeyHandler
