import React, { useState, useEffect } from 'react'
import {
  bindCallback,
  submitCode
} from '@p2ppsr/cwi-auth'
import { Dialog, Button, Typography, TextField } from '@material-ui/core'

const RecoveryKeyHandler = () => {
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    bindCallback('onCodeRequired', ({ phone, reason }) => {
      setPhone(phone)
      setReason(reason)
      setOpen(true)
    })
  }, [])

  const handleSubmit = async () => {
    const success = await submitCode(code)
    if (success) {
      setOpen(false)
    }
  }

  return (
    <Dialog
      open={open}
    >
      <Typography variant='h3' paragraph>
        Code Sent to {phone}
      </Typography>
      <Typography paragraph>
        {reason}
      </Typography>
      <TextField
        label='Enter Code'
        onChange={e => setCode(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
      >
        submit
      </Button>
    </Dialog>
  )
}

export default RecoveryKeyHandler
