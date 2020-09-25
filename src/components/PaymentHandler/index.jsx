import React, { useState, useEffect } from 'react'
import {
  bindCallback,
  unbindCallback,
  submitPayment,
  abortPayment
} from '@cwi/core'
import { PaymentModal } from '@cwi/payment-modal'
import store from '../../redux/store'
import { UPDATE } from '../../redux/types'
import { Dialog, DialogTitle, Typography, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'
import Logo from '@cwi/logo-react'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

const useStyles = makeStyles(style, {
  name: 'PaymentHandler'
})

const PaymentHandler = ({ routes, appName }) => {
  const classes = useStyles()
  const history = useHistory()
  const [paymentReason, setPaymentReason] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const callbackID = bindCallback(
      'onPaymentRequired',
      ({ amount, address, reason }) => {
        store.dispatch({
          type: UPDATE,
          payload: {
            pendingPayment: {
              amount,
              address,
              reason
            }
          }
        })
        setPaymentReason(reason)
        setOpen(true)
      }
    )
    return () => unbindCallback('onPaymentRequired', callbackID)
  }, [])

  const cancelPayment = () => {
    setOpen(false)
    setPaymentReason('')
    abortPayment()
  }

  const fundAccount = () => {
    setOpen(false)
    history.push(`${routes.CWISettings}/fund`)
  }

  return (
    <>
      <Dialog
        open={open}
        maxWidth='sm'
        fullWidth
        scroll='body'
      >
        <DialogTitle className={classes.title_bg} disableTypography>
          <Typography className={classes.title} variant='h4'>
            Account Balance Too Low
          </Typography>
          <Logo rotate color='white' size='2em' />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            The following action requires Bitcoin SV (BSV) tokens, which you can use in {appName} and throughout the entire CWI ecosystem:
          </DialogContentText>
          <DialogContentText>
            <b>{paymentReason}</b>
          </DialogContentText>
          <DialogContentText>
            When you first created your account, we gave you a few of these tokens for free to help you get started. To continue enjoying {appName}, buy more tokens to fund your account.
          </DialogContentText>
          <DialogContentText>
            You will see this dialog whenever you are running low on BSV tokens in your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={cancelPayment}>
            Canel This Action
          </Button>
          <Button color='primary' onClick={fundAccount}>
            Func Account
          </Button>
        </DialogActions>
      </Dialog>
      <PaymentModal />
    </>
  )
}

const stateToProps = state => ({
  routes: state.routes,
  appName: state.appName
})

export default connect(stateToProps)(PaymentHandler)
