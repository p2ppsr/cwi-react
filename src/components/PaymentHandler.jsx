import React, { useState, useEffect } from 'react'
import {
  bindCallback,
  unbindCallback,
  submitPayment,
  abortPayment,
  isAuthenticated
} from '@cwi/core'
import { PaymentModal, requestPayment, resetModal } from '@cwi/payment-modal'
import store from '../redux/store'
import { UPDATE } from '../redux/types'
import CustomDialog from './CustomDialog/index.jsx'
import { DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

const PaymentHandler = ({ routes, appName }) => {
  const history = useHistory()
  const [paymentReason, setPaymentReason] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const callbackID = bindCallback(
      'onPaymentRequired',
      ({ address, amount, reason, paymentID }) => {
        // Address is only used when not authenticated for initial funding
        if (isAuthenticated()) {
          store.dispatch({
            type: UPDATE,
            payload: {
              pendingActions: [
                ...store.getState().pendingActions,
                {
                  amount,
                  reason,
                  paymentID
                }
              ]
            }
          })
          setPaymentReason(reason)
          setOpen(true)
        } else {
          requestPayment({
            amount,
            address,
            reason,
            token: process.env.REACT_APP_PLANARIA_TOKEN,
            onPaymentComplete: transactions => {
              submitPayment(transactions)
            },
            onAbort: () => {
              resetModal()
              abortPayment()
            }
          })
        }
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
    history.push(`${routes.CWISettings}/actions`)
  }

  return (
    <>
      <CustomDialog
        open={open}
        title='Account Balance Too Low'
      >
        <DialogContent>
          <DialogContentText>
            The following action requires Bitcoin SV (BSV) tokens, which you can use in {appName} and throughout the entire CWI ecosystem:
          </DialogContentText>
          <DialogContentText>
            <b style={{ wordWrap: 'break-word' }}>{paymentReason}</b>
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
            Fund Account
          </Button>
        </DialogActions>
      </CustomDialog>
      <PaymentModal />
    </>
  )
}

const stateToProps = state => ({
  routes: state.routes,
  appName: state.appName
})

export default connect(stateToProps)(PaymentHandler)
