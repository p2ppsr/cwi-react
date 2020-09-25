import React, { useState, useEffect } from 'react'
import { requestPayment, resetModal } from '@cwi/payment-modal'
import { getUserID, submitPayment, abortPayment, waitForInitialization } from '@cwi/core'
import {
  Typography,
  Divider,
  Slider,
  TextField,
  Button,
  IconButton,
  CircularProgress
} from '@material-ui/core'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import store from '../../../redux/store'
import { UPDATE } from '../../../redux/types'
import { Refresh as RefreshIcon } from '@material-ui/icons'
import boomerang from '@cwi/boomerang'

const useStyles = makeStyles(style, {
  name: 'Fund'
})

const DEFAULT_AMOUNT = 10000000

const Fund = ({ pendingPayment = {} } = {}) => {
  const classes = useStyles()
  const [amount, setAmount] = useState(
    (pendingPayment.amount || 0) < DEFAULT_AMOUNT
      ? DEFAULT_AMOUNT
      : pendingPayment.amount + DEFAULT_AMOUNT
  )
  const [accountBalance, setAccountBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
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
        } else {
          setBalanceLoading(true)
          setTimeout(() => {
            refreshBalance()
          }, 1000)
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

  const refreshBalance = async () => {
    setBalanceLoading(true)
    await waitForInitialization()
    try {
      const result = await boomerang(
        'GET',
        `https://api.whatsonchain.com/v1/bsv/main/address/${getUserID()}/balance`
      )
      setAccountBalance(result.confirmed + result.unconfirmed)
      setBalanceLoading(false)
    } catch (e) {
      setBalanceLoading(false)
    }
  }

  useEffect(() => {
    refreshBalance()
  }, [])

  return (
    <div>
      <div className={classes.pending_payment}>
        <Typography variant='h5' paragraph>
          <b>Your Balance</b>
        </Typography>
        <Divider />
        <br />
        <div className={classes.pending_grid}>
          <Typography>
            Your current account balance is <b>{accountBalance}</b> Bitcoin SV tokens
          </Typography>
          <IconButton onClick={refreshBalance}>
            {
              balanceLoading
                ? <CircularProgress />
                : <RefreshIcon color='primary' />
            }
          </IconButton>
        </div>
      </div>
      {pendingPayment.reason && (
        <div className={classes.pending_payment}>
          <Typography variant='h5' paragraph><b>Pending Actions</b></Typography>
          <Divider />
          <br />
          <Typography paragraph>
            Buy at least <b>{pendingPayment.amount}</b> Bitcoin SV tokens to complete this action:
          </Typography>
          <div className={classes.pending_grid}>
            <Typography><b>{pendingPayment.reason}</b></Typography>
            <Button onClick={clearPendingPayment} color='secondary'>
              Cancel Action
            </Button>
          </div>
        </div>
      )}
      <center>
        <Typography variant='h1'>
          {amount / 1000000} Million
        </Typography>
        <Typography color='textSecondary' paragraph>
          <b>BITCOIN SV TOKENS</b>
        </Typography>
        <Slider
          value={amount}
          onChange={(e, v) => setAmount(v)}
          min={1000000}
          step={1000000}
          max={50000000}
        />
        <TextField
          value={amount / 1000000}
          onChange={e => {
            if (e.target.value) {
              setAmount(parseInt(e.target.value) * 1000000)
            }
          }}
          type='number'
          inputProps={{
            min: 1,
            step: 1
          }}
        />
        <br />
        <br />
        <Button
          onClick={handleFund}
          variant='contained'
          color='primary'
          size='large'
        >
          Complete Payment
        </Button>
      </center>
    </div>
  )
}

const stateToProps = state => ({
  pendingPayment: state.pendingPayment
})

export default connect(stateToProps)(Fund)
