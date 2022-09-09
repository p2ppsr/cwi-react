import React from 'react'
import { DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import style from './style'

const useStyles = makeStyles(style, {
  name: 'Payment'
})

const { ipcRenderer } = window.require('electron')

const Payment = ({ location }) => {
  const classes = useStyles()
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const reason = params.get('reason')

  const handleCancel = () => {
    ipcRenderer.invoke(id, { type: 'abort' })
  }

  const handleSubmit = e => {
    e.preventDefault()
    ipcRenderer.invoke(id, { type: 'submit' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <DialogContentText>
          The following action requires Bitcoin SV (BSV) tokens, which you can use throughout the entire CWI ecosystem:
        </DialogContentText>
        <DialogContentText>
          <b style={{ wordWrap: 'break-word' }}>{reason}</b>
        </DialogContentText>
        <DialogContentText>
          When you first created your account, we gave you a few of these tokens for free to help you get started. To continue enjoying our offering, buy more tokens to fund your account.
        </DialogContentText>
        <DialogContentText>
          You will see this dialog whenever you are running low on BSV tokens in your account.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.button_bar}>
        <Button color='secondary' onClick={handleCancel}>
          Cancel This Action
        </Button>
        <Button color='primary' onClick={handleSubmit}>
          Fund Account
        </Button>
      </DialogActions>
    </form>
  )
}

export default Payment
