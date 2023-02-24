import React, { useState, useEffect, useContext } from 'react'
import { DialogActions, DialogContent, Button, DialogContentText, TextField, InputAdornment, IconButton } from '@mui/material'
import CustomDialog from './CustomDialog/index.jsx'
import UIContext from '../UIContext'
import { Visibility, VisibilityOff } from '@material-ui/icons'

const PasswordHandler = () => {
  const {
    onFocusRequested,
    onFocusRelinquished,
    isFocused
  } = useContext(UIContext)
  const [wasOriginallyFocused, setWasOriginallyFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback('onPasswordRequired', async reason => {
        setReason(reason)
        setOpen(true)
        const wasOriginallyFocused = await isFocused()
        setWasOriginallyFocused(wasOriginallyFocused)
        if (!wasOriginallyFocused) {
          await onFocusRequested()
        }
      })
    })()
    return () => {
      if (id) {
        window.CWI.unbindCallback('onPasswordRequired', id)
      }
    }
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    const success = await window.CWI.submitPassword(password)
    if (success) {
      setOpen(false)
    }
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  const handleAbort = async () => {
    await window.CWI.abortPassword()
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        window.CWI.abortPassword()
        setOpen(false)
      }}
      title='Enter Password'
    >
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            {reason}
          </DialogContentText>
          <br />
          <TextField
            label='Password'
            autoFocus
            fullWidth
            type={showPassword ? 'text' : 'password'}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setShowPassword(!showPassword)}
                    edge='end'
                    style={{ color: 'inherit' }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            onClick={handleAbort}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            type='submit'
          >
            OK
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  )
}

export default PasswordHandler
