import React, { useState, useEffect, useContext } from 'react'
import {
  DialogContent,
  Typography,
  Fab,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  Button,
  Tooltip,
  Slider
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import style from './style'
import Satoshis from '../Satoshis.jsx'
import { Send, Cancel } from '@mui/icons-material'
import boomerang from 'boomerang-http'
import formatDistance from 'date-fns/formatDistance'
import CustomDialog from '../CustomDialog/index.jsx'
import UIContext from '../../UIContext'
import AppChip from '../AppChip'

const useStyles = makeStyles(style, {
  name: 'SpendingAuthorizationHandler'
})

const SpendingAuthorizationHandler = () => {
  const {
    onFocusRequested,
    onFocusRelinquished,
    isFocused
  } = useContext(UIContext)
  const [wasOriginallyFocused, setWasOriginallyFocused] = useState(false) 
  const classes = useStyles()
  const [now] = useState(parseInt(Date.now() / 1000))
  const [description, setDescription] = useState('')
  const [originator, setOriginator] = useState('')
  const [appName, setAppName] = useState(null)
  const [renewal, setRenewal] = useState(false)
  const [requestID, setRequestID] = useState(null)
  const [open, setOpen] = useState(false)
  const [transactionAmount, setTransactionAmount] = useState(0)
  const [authorizationAmount, setAuthorizationAmount] = useState(0)
  const [expirationTime, setExpirationTime] = useState(0)
  const [showAuthorizeApp, setShowAuthorizeApp] = useState(false)
  const [amount, setAmount] = useState(authorizationAmount)
  const [expiry, setExpiry] = useState(expirationTime)
  const [sliderValue, setSliderValue] = useState(authorizationAmount)

  const handleCancel = async () => {
    window.CWI.denySpendingAuthorization({ requestID })
     setOpen(false)
     if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  const handleGrant = async ({ singular = true }) => {
    window.CWI.grantSpendingAuthorization({
      requestID,
      singular,
      expiry,
      amount
    })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback(
        'onSpendingAuthorizationRequested',
        async ({
          requestID,
          originator,
          description,
          transactionAmount,
          authorizationAmount,
          expirationTime,
          renewal
        }) => {
          try {
            const result = await boomerang(
              'GET',
              `${originator.startsWith('localhost:') ? 'http' : 'https'}://${originator}/manifest.json`
            )
            if (typeof result === 'object') {
              if (result.name && result.name.length < 64) {
                setAppName(result.name)
              } else if (result.short_name && result.short_name.length < 64) {
                setAppName(result.short_name)
              }
            }
          } catch (e) {
            setAppName(originator)
          }
          const wasOriginallyFocused = await isFocused()
          setWasOriginallyFocused(wasOriginallyFocused)
          setRequestID(requestID)
          setOriginator(originator)
          setDescription(description)
          setRenewal(renewal)
          setTransactionAmount(transactionAmount)
          setAuthorizationAmount(authorizationAmount)
          setSliderValue(authorizationAmount)
          setAmount(authorizationAmount)
          setExpirationTime(expirationTime)
          setExpiry(expirationTime)
          setOpen(true)
          if (!wasOriginallyFocused) {
            await onFocusRequested()
          }
        }
      )
    })()
    return () => {
      if (id) {
        window.CWI.unbindCallback('onSpendingAuthorizationRequested', id)
      }
    }
  }, [])

  return (
    <CustomDialog
      open={open}
      onClose={handleCancel}
      title='App Spending Request'
    >
      <DialogContent>
        <center>
          <Typography
            variant='h2'
            paragraph
            className={classes.title}
          >
            <b>
              {!showAuthorizeApp
                ? <AppChip size={1.5} label={originator} clickable={false} />
                : (`Always Allow "${(appName || originator)}"?`)}
            </b>
          </Typography>
        </center>
        {!showAuthorizeApp
          ? (
            <>
              <Typography align='center'>
                would like to spend
              </Typography>
              <Typography variant='h3' align='center' paragraph>
                <Satoshis>{transactionAmount}</Satoshis>
              </Typography>
              <div className={classes.fabs_wrap}>
                <Tooltip title='Deny Permission'>
                  <Fab
                    color='secondary'
                    onClick={handleCancel}
                    variant='extended'
                  >
                    <Cancel className={classes.button_icon} />
                    Abort
                  </Fab>
                </Tooltip>
                <Tooltip title='Allow Once'>
                  <Fab
                    color='primary'
                    onClick={() => handleGrant({ singular: true })}
                    variant='extended'
                  >
                    <Send className={classes.button_icon} />
                    Allow
                  </Fab>
                </Tooltip>
              </div>
              <center>
                <Tooltip title='Always Allow This App'>
                  <Fab
                    variant='extended'
                    onClick={() => setShowAuthorizeApp(true)}
                  >
                    Always...
                  </Fab>
                </Tooltip>
              </center>
            </>
            )
          : (
            <>
              {!renewal
                ? (
                  <DialogContentText>
                    Do you want to allow this app to spend up to <b><Satoshis>{amount}</Satoshis></b>?
                  </DialogContentText>
                  )
                : (
                  <DialogContentText>
                    Do you want to allow this app to spend up to another <b><Satoshis>{amount}</Satoshis></b>? You have allowed this app in the past.
                  </DialogContentText>
                  )}
              <DialogContentText>
                {description}
              </DialogContentText>
              <Typography variant='h5'>
                <b>Authorization Amount</b>
              </Typography>
              <Typography color='textSecondary' paragraph>
                This app will ask again if it goes over this amount
              </Typography>
              <center>
                <Slider
                  max={authorizationAmount * 20}
                  min={transactionAmount}
                  onChangeCommitted={(e, v) => setAmount(parseInt(v))}
                  value={sliderValue}
                  onChange={(e, v) => setSliderValue(v)}
                  color='primary'
                  valueLabelDisplay='auto'
                  className={classes.slider}
                />
              </center>
              <Typography variant='h5'>
                <b>Authorization Expires</b>
              </Typography>
              <Typography color='textSecondary' paragraph>
                This app will ask again after expiration
              </Typography>
              <Select
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                variant='outlined'
                className={classes.select}
              >
                <MenuItem value={expirationTime}>
                  {formatDistance(new Date(expirationTime * 1000), new Date(), { addSuffix: true })} (suggested by the app)
                </MenuItem>
                {[
                  now + 60 * 60 * 24 * 7, // one week
                  now + 60 * 60 * 24 * 180, // six months
                  now + 60 * 60 * 24 * 365, // one year
                  now + 60 * 60 * 24 * 365 * 3 // three years
                ].map((x, i) => (
                  <MenuItem key={i} value={'' + x}>
                    {formatDistance(new Date(x * 1000), new Date(), { addSuffix: true })}
                  </MenuItem>
                ))}
              </Select>
            </>
            )}
      </DialogContent>
      {showAuthorizeApp && (
        <DialogActions className={classes.button_bar}>
          <Button
            onClick={() => setShowAuthorizeApp(false)}
          >
            Back
          </Button>
          <Button
            color='primary'
            variant='contained'
            onClick={() => handleGrant({ singular: false })}
          >
            <Send className={classes.button_icon} />
              Send & Allow
            </Button>
        </DialogActions>
      )}
    </CustomDialog>
  )
}

export default SpendingAuthorizationHandler
