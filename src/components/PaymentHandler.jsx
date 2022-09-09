import React, { useState, useEffect, useContext } from 'react'
import { DialogActions, DialogContent, Button, DialogContentText } from '@mui/material'
import CustomDialog from './CustomDialog/index.jsx'
import Satoshis from './Satoshis.jsx'
import UIContext from '../UIContext'

const PaymentHandler = () => {
  const {
    onFocusRequested,
    onFocusRelinquished,
    isFocused
  } = useContext(UIContext)
  const [wasOriginallyFocused, setWasOriginallyFocused] = useState(false) 
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [paymentID, setPaymentID] = useState('')
  const [amount, setAmount] = useState('')
  
  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback(
        'onPaymentRequired',
        async ({ paymentID, amount, reason }) => {
          setReason(reason)
          setPaymentID(paymentID)
          setAmount(amount)
          setOpen(true)
          const wasOriginallyFocused = await isFocused()
          setWasOriginallyFocused(wasOriginallyFocused)
          if (!wasOriginallyFocused) {
            await onFocusRequested()
          }
        }
      )
    })()
    return () => {
      if (id) {
        window.CWI.unbindCallback('onPaymentRequired', id)
      }
    }
  }, [])

  const handleCancel = async () => {
    await window.CWI.abortPayment(paymentID)
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    await window.CWI.submitPayment(paymentID)
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  return (
    <CustomDialog
      open={open}
      onClose={handleCancel}
      title='Fund Your Account'
    >
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
          <DialogContentText>
            You need <b><Satoshis>{amount}</Satoshis></b> more than you currently have.
          </DialogContentText>
          <DialogContentText>
            TODO functionality — buy more — for now, cancel, and then email us at satoshis@projectabbage.com or use Ninja to top-up. Click "Payment Sent" once money is there.
          </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={handleCancel}>
          Cancel This Action
        </Button>
        <Button color='primary' type='submit'>
          Payment Sent
        </Button>
      </DialogActions>
    </form>
    </CustomDialog>
  )
}

export default PaymentHandler
