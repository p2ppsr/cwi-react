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
  CircularProgress,
  InputAdornment,
  Input
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
  const [otherAmount, setOtherAmount] = useState(false)
  // TODO: const [modalWaiting, setModalWaiting] = useState(false)

  const handleFund = fundingAmount => {
    requestPayment({
      amount: parseInt(fundingAmount),
      address: pendingPayment.address || getUserID(),
      reason: fundingAmount === pendingPayment.amount
        ? pendingPayment.reason
        : pendingPayment.reason
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
      {pendingPayment.reason && (
        <div className={classes.pending_payment}>
          <div className={classes.pending_grid}>
            <Typography variant='h5' paragraph>
              <b>Pending Action</b>
            </Typography>
            <Typography paragraph>
              {pendingPayment.amount} tokens
            </Typography>
          </div>
          <Divider />
          <div className={classes.pending_grid}>
            <Typography>{pendingPayment.reason}</Typography>
            <Button onClick={clearPendingPayment} color='secondary'>
              Cancel this Action
            </Button>
            <Button
              onClick={() => handleFund(pendingPayment.amount)}
              color='primary'
            >
              Pay this Amount
            </Button>
          </div>
        </div>
      )}
      <div className={classes.pending_payment}>
        <Typography variant='h5' paragraph>
          <b>Your Balance</b>
        </Typography>
        <Divider />
        <div className={classes.balance_grid}>
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
      <center>
        <Typography variant='h1'>
          {otherAmount
            ? amount / 100000000
            : `${amount / 1000000} Million`}
        </Typography>
        <Typography color='textSecondary' paragraph>
          <b>{otherAmount ? 'BITCOIN SV' : 'BITCOIN SV TOKENS'}</b>
        </Typography>
        <Slider
          value={amount}
          onChange={(e, v) => setAmount(v)}
          min={1000000}
          step={1000000}
          max={50000000}
        />
        <br />
        <br />
        <Button
          onClick={() => handleFund(amount)}
          variant='contained'
          color='primary'
          size='large'
        >
          Complete Payment
        </Button>
        <br />
        <br />
        {otherAmount ? (
          <Input
            type='number'
            autoFocus
            value={amount}
            onChange={e => setAmount(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                sats
              </InputAdornment>
            }
          />
        ) : (
          <Button
            onClick={() => setOtherAmount(true)}
            color='secondary'
          >
            Advanced
          </Button>
        )}
      </center>
    </div>
  )
}

const stateToProps = state => ({
  pendingPayment: state.pendingPayment
})

export default connect(stateToProps)(Fund)
