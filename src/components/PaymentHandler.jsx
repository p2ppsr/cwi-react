import React, { useState, useEffect, useContext } from 'react'
import { Dialog, IconButton, Button, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import UIContext from '../UIContext'
import { toast } from 'react-toastify'
import Refresh from '@mui/icons-material/Refresh'
import Cancel from '@mui/icons-material/Cancel'

const useStyles = makeStyles({
  refresh_btn: {
    position: 'absolute',
    top: '0.75em',
    right: '1em'
  },
  close_btn: {
    position: 'absolute',
    top: '0.25em',
    left: '0.25em'
  },
  frame: {
    width: '100%',
    minHeight: 'calc(100vh - 3.75em)',
    marginTop: '3.5em',
    outline: 'none',
    border: 'none',
    boxSizing: 'border-box',
    boxShadow: '0px 12px 10px 3px #555'
  },
  no_support_div: {
    width: '100%',
    height: 'calc(100vh - 3.75em)',
    marginTop: '3.5em',
    boxSizing: 'border-box',
    boxShadow: '0px 12px 10px 3px #555',
    overflowY: 'scroll',
    padding: '1em'
  }
}, { name: 'PaymentHandler' })

/* <DialogContentText>
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
          </DialogContentText> */

/* <div className={classes.no_support_div}>
            <Typography paragraph>
              Your account balance is running low, and you need to get more satohsis before you can take this Action.
            </Typography>
            <Typography paragraph>
              In the future, you will be able to buy more satoshis on this screen. This is not yet possible until certain legal requirements are met. For now:
            </Typography>
            <Typography paragraph>
              <ul>
                <li>Ask friends to send you a few</li>
                <li>Other services that can import them to Babbage?</li>
                <li>If all else fails, try contacting Ty Everett via DM</li>
              </ul>
            </Typography>
            <Typography paragraph>
              <b>Action:</b> {reason}
            </Typography>
            <Typography paragraph>
              <b>Satoshis Needed:</b> {amount}
            </Typography>
        </div> */

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
  const classes = useStyles()

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
        let submitted = false
        try {
          await window.CWI.ninja.submitDirectTransaction({
            protocol: '3241645161d8',
            transaction: result.transaction,
            senderIdentityKey: result.transaction.senderIdentityKey,
            note: 'Buy from Satoshi Shop'
          })
          submitted = true
          // if (window.confirm('submit payment transaction?')) {
          // } else {
          //   throw new Error('submit payment transaction failure requested')
          // }
        } catch (e) {
          console.error(`Error submitting purchase transaction: ${JSON.stringify(e)}`)
          toast.error('Error submitting purchase transaction.')
          handleCancel()
          /*
            handleCancel should turn into handleSubmitError which should invoke window.CWI.submitPaymentError
            The shop should then set the payment status to "stuck" and tech support needs to assist.
          */
        }
        if (submitted) {
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
    <Dialog fullScreen open={open} onClose={handleCancel}>
      <form onSubmit={handleSubmit}>
        <Tooltip title='Cancel This Action' placement='right'>
          <IconButton
            className={classes.close_btn}
            onClick={handleCancel}
          >
            <Cancel />
          </IconButton>
        </Tooltip>
        <Tooltip title='Send This Action'>
          <Button
            className={classes.refresh_btn}
            startIcon={<Refresh />}
            color='primary'
            type='submit'
            variant='outlined'
          >
            Check for payment...
          </Button>
        </Tooltip>
        <center>
          <iframe
            seamless
            src={`https://${env === 'dev' || env === 'staging' ? 'staging-satoshiframe' : 'satoshiframe'}.babbage.systems/?minimumSatoshis=${amount}&reason=${reason}`}
            className={classes.frame}
          />
        </center>
      </form>
    </Dialog>
  )
}

export default PaymentHandler
