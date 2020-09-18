import React, { useState } from 'react'
import { requestPayment, resetModal } from '@cwi/payment-modal'
import { getUserID, submitPayment, abortPayment } from '@cwi/core'
import { Typography, TextField, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import store from '../../../redux/store'
import { UPDATE } from '../../../redux/types'

const useStyles = makeStyles(style, {
  name: 'Fund'
})

const DEFAULT_AMOUNT = 10000000

const Fund = ({ pendingPayment = {} } = {}) => {
  const classes = useStyles()
  const [amount, setAmount] = useState(
    pendingPayment.amount < DEFAULT_AMOUNT
      ? DEFAULT_AMOUNT
      : pendingPayment.amount + DEFAULT_AMOUNT
  )
  // TODO: const [modalWaiting, setModalWaiting] = useState(false)

  const handleFund = () => {
    requestPayment({
      amount: parseInt(amount),
      address: pendingPayment.address || getUserID(),
      reason: pendingPayment.reason
        ? `Fund your CWI Account, then ${pendingPayment.reason}`
        : 'Fund your CWI Account',
      token: process.env.REACT_APP_PLANARIA_TOKEN,
      onPaymentComplete: transactions => {
        if (pendingPayment.address) {
          submitPayment(transactions)
          clearPendingPayment()
        }
      },
      onAbort: () => {
        resetModal()
        if (pendingPayment.address) {
          abortPayment()
        }
      }
    })
  }

  const clearPendingPayment = () => {
    store.dispatch({
      type: UPDATE,
      payload: {
        pendingPayment: undefined
      }
    })
    setAmount(DEFAULT_AMOUNT)
  }

  return (
    <div>
      {pendingPayment.reason && (
        <div className={classes.pending_payment}>
          <Typography>{pendingPayment.reason}</Typography>
          <Button onClick={clearPendingPayment} color='secondary'>
            Cancel This Action
          </Button>
        </div>
      )}
      <TextField
        defaultValue={amount}
        onChange={e => setAmount(e.target.value)}
        type='number'
        label='Amount (satoshi)'
      />
      <Button
        onClick={handleFund}
        variant='contained'
        color='primary'
        size='large'
      >
        Complete Payment
      </Button>
    </div>
  )
}

const stateToProps = state => ({
  pendingPayment: state.pendingPayment
})

export default connect(stateToProps)(Fund)
