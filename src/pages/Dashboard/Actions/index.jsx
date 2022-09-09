import React, { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import ActionList from '../../../components/ActionList/index.jsx'
import Satoshis from '../../../components/Satoshis.jsx'
import Delete from '@mui/icons-material/Delete'
import Send from '@mui/icons-material/Send'

const useStyles = makeStyles(style, {
  name: 'Actions'
})

/*
TODO: Sockets and real-time updates
*/
const Actions = () => {
  const [pendingActions, setPendingActions] = useState({})
  const [accountBalance, setAccountBalance] = useState(null)
  const classes = useStyles()

  useEffect(() => {
    let interval
    (async () => {
      await window.CWI.waitForAuthentication()
      await window.CWI.ninja.processPendingTransactions()
      refreshBalance()
      const payments = await window.CWI.listPendingPayments()
      setPendingActions(payments)

      // The balance updates every 5 seconds if payments are pending
      if (Object.keys(payments).length > 0) {
        interval = setInterval(() => {
          refreshBalance()
        }, 5000)
      }
    })()
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  const cancelAllPendingActions = () => {
    Object.keys(pendingActions).forEach(paymentID => {
      window.CWI.abortPayment(paymentID)
    })
    setPendingActions({})
  }

  const submitAllPendingActions = async () => {
    Object.keys(pendingActions).forEach(paymentID => {
      window.CWI.submitPayment(paymentID)
    })
    setPendingActions({})
  }

  const cancelPendingAction = paymentID => {
    window.CWI.abortPayment(paymentID)
    const newPendingActions = { ...pendingActions }
    delete newPendingActions[paymentID]
    setPendingActions(newPendingActions)
  }

  const submitPendingAction = async paymentID => {
    const result = await window.CWI.submitPayment(paymentID)
    if (result === true) {
      const newPendingActions = { ...pendingActions }
      delete newPendingActions[paymentID]
      setPendingActions(newPendingActions)
    }
  }

  const refreshBalance = async () => {
    try {
      const result = await window.CWI.ninja.getTotalValue()
      setAccountBalance(result.total)
    } catch (e) { /* ignore */ } // If the balance cannot be refreshed, it is probably because the user's internet has dropped. We don't want this error to be thrown, because it will just clutter up Bugsnag.
  }

  const cannotSendAllPendingActions = accountBalance < Object
    .values(pendingActions)
    .reduce(
      (acc, el) => acc + el.amount,
      0
    )

  return (
    <div>
      <div className={classes.fixed_nav}>
        <Typography variant='h1'>
          Your Actions
        </Typography>
      </div>
      {Object.entries(pendingActions).length > 0 && (
        <>
          <div className={classes.pending_title_grid}>
            <Typography
              variant='h2'
            >
              You Have Pending Actions
            </Typography>
            <Button
              color='secondary'
              onClick={cancelAllPendingActions}
              startIcon={<Delete />}
            >
              Cancel All
            </Button>
            <Button
              color='primary'
              disabled={cannotSendAllPendingActions}
              onClick={submitAllPendingActions}
              startIcon={<Send />}
            >
              Send All
            </Button>
          </div>
          <br />
          {Object.entries(pendingActions).map(([id, action], i) => (
            <Card key={i} elevation={4} className={classes.action_card}>
              <CardContent>
                <Typography variant='h3'>
                  {action.reason}
                </Typography>
                <Typography paragraph>
                  <Satoshis>{action.amount}</Satoshis>
                </Typography>
                <div className={classes.pending_action_buttons}>
                  <div>
                    {accountBalance < action.amount && (
                      <Typography color='secondary'>
                        <b><i>Pending:</i></b>
                        {' '}<Satoshis>{action.amount - accountBalance}</Satoshis> needed
                      </Typography>
                    )}
                  </div>
                  <Button
                    color='secondary'
                    onClick={() => cancelPendingAction(id)}
                    startIcon={<Delete />}
                  >
                    Cancel
                  </Button>
                  <Button
                    color='primary'
                    disabled={action.amount > accountBalance}
                    onClick={() => submitPendingAction(id)}
                    startIcon={<Send />}
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className={classes.buy_grid}>
            <Typography paragraph>
              To continue enjoying the Babbage ecosystem, you will need to buy more satoshis and send them to your Paymail.
            </Typography>
            <div>
              <Button
                color='primary'
                variant='outlined'
                onClick={() => alert('Send your Paymail address to sats@tyweb.us and I will send you some satoshis.')}
              >
                Buy Satoshis
              </Button>
            </div>
          </div>
          <br />
          <Divider />
          <br />
          <br />
          <Typography variant='h2'>Completed Actions</Typography>
        </>
      )}
      <ActionList />
    </div>
  )
}

export default Actions
