import React, { useState, useEffect } from 'react'
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
import Satoshis from '../../components/Satoshis.jsx'
import { Send, Cancel } from '@mui/icons-material'
import boomerang from 'boomerang-http'
import formatDistance from 'date-fns/formatDistance'

const useStyles = makeStyles(style, {
  name: 'SpendingAuthorization'
})
const { ipcRenderer } = window.require('electron')

const SpendingAuthorization = ({ location }) => {
  const classes = useStyles()
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const description = params.get('description')
  const originator = params.get('originator')
  const transactionAmount = Number(params.get('transactionAmount'))
  const authorizationAmount = Number(params.get('authorizationAmount'))
  const expirationTime = Number(params.get('expirationTime'))
  const renewal = params.get('renewal')
  const [now] = useState(parseInt(Date.now() / 1000))
  const [appName, setAppName] = useState(null)
  const [showAuthorizeApp, setShowAuthorizeApp] = useState(false)
  const [amount, setAmount] = useState(authorizationAmount)
  const [expiry, setExpiry] = useState(expirationTime)
  const [sliderValue, setSliderValue] = useState(authorizationAmount)

  const handleCancel = () => {
    ipcRenderer.invoke(id, { type: 'abort' })
  }

  const handleGrant = ({ singular = true }) => {
    const payload = {
      type: 'grant',
      singular,
      expiry,
      amount
    }
    ipcRenderer.invoke(id, payload)
  }

  useEffect(() => {
    (async () => {
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
      } catch (e) { /* ignore */ }
    })()
  }, [originator])

  return (
    <>
      <DialogContent>
        <center>
          <img
            src={`https://${originator}/favicon.ico`}
            alt=''
            className={classes.app_icon}
          />
          <Typography
            variant='h2'
            paragraph
            className={classes.title}
          >
            <b>
              {!showAuthorizeApp
                ? (appName || originator)
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
                    Deny Permission
                  </Fab>
                </Tooltip>
                <Tooltip title='Allow Once'>
                  <Fab
                    color='primary'
                    onClick={() => handleGrant({ singular: true })}
                    variant='extended'
                  >
                    <Send className={classes.button_icon} />
                    Allow Once
                  </Fab>
                </Tooltip>
              </div>
              <center>
                <Button
                  color='primary'
                  onClick={() => setShowAuthorizeApp(true)}
                >
                  Always Allow This App...
                </Button>
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
              <Slider
                max={authorizationAmount * 5}
                min={transactionAmount}
                onChangeCommitted={(e, v) => setAmount(parseInt(v))}
                value={sliderValue}
                onChange={(e, v) => setSliderValue(v)}
                color='primary'
                valueLabelDisplay='auto'
                className={classes.slider}
              />
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
                  <MenuItem key={i} value={x}>
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
            Always Allow This App
          </Button>
        </DialogActions>
      )}
    </>
  )
}

export default SpendingAuthorization
