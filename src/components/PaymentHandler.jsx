import React, { useState, useEffect, useContext } from 'react'
import {
  DialogActions, DialogContent, Button, DialogContentText
} from '@mui/material'
import CustomDialog from './CustomDialog/index.jsx'
import Satoshis from './Satoshis.jsx'
import UIContext from '../UIContext'
import { toast } from 'react-toastify'

 {/* <DialogContentText>
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
          </DialogContentText> */}


const PaymentHandler = () => {
  const {
    onFocusRequested,
    onFocusRelinquished,
    isFocused,
    env
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
    const iframeMessageHandler = async e => {
      if (
        e.data.type !== 'satoshiframe' ||
        !e.isTrusted ||
        e.data.acknowledge
      ) return
      if (e.data.status === 'error') {
        toast.error(e.data.description)
        console.error(e.data)
      } else {
        const result = e.data.result
        try {
          await window.CWI.ninja.submitDirectTransaction({
            protocol: '3241645161d8',
            transaction: result.transaction,
            senderIdentityKey: result.transaction.senderIdentityKey,
            note: 'Buy from Satoshi Shop'
          })
        } catch (e) {
          // Double-spends were already processed
          // if (e.code !== 'ERR_DOUBLE_SPEND') throw e

          // ...... well this is awkward.
          /* 
          If the transaction didn't work, do we acknowledge it anyways? Or do we try again every time, knowing it won't work?
          We need a way of saying "Hey! This didn't work! Someone needs to do something about it." and flagging it for review, or something.
          */
        }
        toast.success(`${result.transaction.amount} satoshis deposited!`)
        // Acknowledge receipt
        e.source.postMessage({
          type: 'satoshiframe',
          id: result.id,
          acknowledge: true
        }, e.origin)
        handleSubmit()
      }
    }
    window.addEventListener('message', iframeMessageHandler)

    return () => {
      if (id) {
        window.CWI.unbindCallback('onPaymentRequired', id)
      }
      window.removeEventListener('message', iframeMessageHandler)
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
    if (e) e.preventDefault()
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
        {env === 'dev' || env === 'staging' ? (
        <iframe
            seamless
              src={`https://staging-satoshiframe.babbage.systems/?minimumSatoshis=${amount}`}
              style={{
                width: '100%',
                minHeight: '20em'
              }}
        />
        ) : <p>Only Devline and Stageline can buy Testnet satoshis for now. Mainnet satoshis are not for sale. Mainnet is not launched.</p>}
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
