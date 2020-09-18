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

const PaymentHandler = ({ routes }) => {
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
        setOpen(true)
      }
    )
    return () => unbindCallback('onPaymentRequired', callbackID)
  }, [])

  const cancelPayment = () => {
    setOpen(false)
    abortPayment()
  }

  const fundAccount = () => {
    setOpen(false)
    history.push(`${routes.CWISettings}/fund`)
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle className={classes.title_bg} disableTypography>
          <Typography className={classes.title}>
            Fund Your Account
          </Typography>
          <Logo rotate color='white' />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {paymentReason}
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
  routes: state.routes
})

export default connect(stateToProps)(PaymentHandler)
