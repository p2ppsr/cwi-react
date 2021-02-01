import React, { useState, useEffect } from 'react'
import { Typography, Button, Card, CardContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import {
  waitForAuthentication,
  ninja,
  submitPayment,
  abortPayment
} from '@cwi/core'
import { connect } from 'react-redux'
import store from '../../../redux/store'
import { UPDATE } from '../../../redux/types'

const useStyles = makeStyles(style, {
  name: 'Actions'
})

const Actions = ({ pendingActions = [] } = {}) => {
  const [actions, setActions] = useState([])
  const [accountBalance, setAccountBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [paymail, setPaymail] = useState(null)
  const classes = useStyles()

  useEffect(() => {
    (async () => {
      await waitForAuthentication()
      refreshBalance()
      setActions(await ninja.getTransactions({ limit: 10 }))
      setPaymail(await ninja.getPaymail())

      // The balance updates every 10 seconds
      while (true) {
        refreshBalance()
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
    })()
  }, [])

  const cancelAllPendingActions = () => {
    const paymentsToAbort = store.getState().pendingActions
    paymentsToAbort.forEach(({ paymentID }) => {
      abortPayment(paymentID)
    })
    store.dispatch({
      type: UPDATE,
      payload: {
        pendingActions: []
      }
    })
  }

  const submitAllPendingActions = async () => {
    const paymentsToSubmit = store.getState().pendingActions
    paymentsToSubmit.forEach(({ paymentID }) => {
      submitPayment(paymentID)
    })
    store.dispatch({
      type: UPDATE,
      payload: {
        pendingActions: []
      }
    })
    // Wait a second for it to process server-side
    await new Promise(resolve => setTimeout(resolve, 3500))
    setActions(await ninja.getTransactions({ limit: 10 }))
  }

  const cancelPendingAction = paymentID => {
    abortPayment(paymentID)
    store.dispatch({
      type: UPDATE,
      payload: {
        pendingActions: store.getState()
          .pendingActions
          .filter(x => x.paymentID !== paymentID)
      }
    })
  }

  const submitPendingAction = async paymentID => {
    const result = await submitPayment(paymentID)
    if (result === true) {
      store.dispatch({
        type: UPDATE,
        payload: {
          pendingActions: store.getState()
            .pendingActions
            .filter(x => x.paymentID !== paymentID)
        }
      })
      // Wait a second for it to process server-side
      await new Promise(resolve => setTimeout(resolve, 3500))
      setActions(await ninja.getTransactions({ limit: 10 }))
    }
  }

  const refreshBalance = async () => {
    setBalanceLoading(true)
    try {
      const result = await ninja.getTotalValue()
      setAccountBalance(result.total)
      setBalanceLoading(false)
    } catch (e) {
      setBalanceLoading(false)
    }
  }

  const cannotSendAllPendingActions = accountBalance < pendingActions.reduce(
    (acc, el) => acc + el.amount,
    0
  )

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1' paragraph>
        Your Actions
      </Typography>
      <Typography paragraph>
        Explore actions you've taken across this and all your CWI Apps
      </Typography>
      <Typography variant='h2' paragraph>
        Your Paymail
      </Typography>
      <Typography paragraph>
        To fund your account, you can send Bitcoin SV to {paymail}
      </Typography>
      <Typography paragraph>
        Balance: {balanceLoading ? '...' : accountBalance} satoshis
      </Typography>
      {pendingActions.length > 0 && (
        <>
          <Typography variant='h2' paragraph>
            Pending Actions
          </Typography>
          <Typography paragraph>
            Send enough Bitcoin SV tokens to your Paymail ({paymail}) while you're on this page and the pending actions will be completed automatically once there's enough in your account to cover them:
          </Typography>
          <Button
            color='secondary'
            onClick={cancelAllPendingActions}
          >
            Cancel All
          </Button>
          <Button
            color='primary'
            disabled={cannotSendAllPendingActions}
            onClick={submitAllPendingActions}
          >
            Send All
          </Button>
          {pendingActions.map((x, i) => (
            <Card key={i} className={classes.action_card}>
              <CardContent>
                <Typography variant='h3'>
                  {x.reason}
                </Typography>
                <Typography paragraph>
                  {x.amount} satoshis
                </Typography>
                {accountBalance < x.amount && (
                  <Typography color='secondary' paragraph>
                    {x.amount - accountBalance} satoshis needed
                  </Typography>
                )}
                <Button
                  color='secondary'
                  onClick={() => cancelPendingAction(x.paymentID)}
                >
                  Cancel
                </Button>
                <Button
                  color='primary'
                  disabled={x.amount > accountBalance}
                  onClick={() => submitPendingAction(x.paymentID)}
                >
                  Send
                </Button>
              </CardContent>
            </Card>
          ))}
        </>
      )}
      <Typography variant='h2' paragraph>
        Completed Actions
      </Typography>
      {actions.map((tx, i) => (
        <Card key={i} className={classes.action_card}>
          <CardContent>
            <Typography variant='h3'>
              {tx.note}
            </Typography>
            <Typography variant='h6' color='textSecondary'>
              {tx.txid}
            </Typography>
            <Typography>
              Amount: {tx.amount} satoshis
            </Typography>
            <Typography>
              Direction: {tx.isOutgoing === 1 ? 'Outgoing' : 'Incoming'}
            </Typography>
            <Typography>
              status: {tx.status}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const stateToProps = state => ({
  pendingActions: state.pendingActions
})

export default connect(stateToProps)(Actions)
