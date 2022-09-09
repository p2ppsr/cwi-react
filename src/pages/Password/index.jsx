import React, { useState } from 'react'
import { DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import style from './style'

const useStyles = makeStyles(style, {
  name: 'Payment'
})
const { ipcRenderer } = window.require('electron')

const Password = ({ location }) => {
  const classes = useStyles()
  const [pass, setPass] = useState('')
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const reason = params.get('reason')

  const handleCancel = () => {
    ipcRenderer.invoke(id, { type: 'abort' })
  }

  const handleSubmit = e => {
    e.preventDefault()
    ipcRenderer.invoke(id, { type: 'submit', password: pass })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <DialogContentText>
          {reason}
        </DialogContentText>
        <TextField
          type='password'
          label='Password'
          autoFocus
          fullWidth
          onChange={e => setPass(e.target.value)}
        />
      </DialogContent>
      <DialogActions className={classes.button_bar}>
        <Button
          onClick={handleCancel}
          color='primary'
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
  )
}

export default Password
