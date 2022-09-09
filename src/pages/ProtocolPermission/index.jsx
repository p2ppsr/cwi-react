import React, { useState, useEffect } from 'react'
import {
  DialogContent, DialogContentText, Typography, DialogActions, Button
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import style from './style'
import boomerang from 'boomerang-http'

const useStyles = makeStyles(style, {
  name: 'ProtocolPermission'
})
const { ipcRenderer } = window.require('electron')

const ProtocolPermission = ({ location }) => {
  const classes = useStyles()
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const description = params.get('description')
  const originator = params.get('originator')
  const protocolID = params.get('protocolID')
  const counterparty = params.get('counterparty')
  const protocolSecurityLevel = parseInt(params.get('protocolSecurityLevel'))
  const [appName, setAppName] = useState(null)

  const handleCancel = () => {
    ipcRenderer.invoke(id, { type: 'abort' })
  }

  const handleGrant = () => {
    ipcRenderer.invoke(id, { type: 'grant' })
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
            <b>{appName || originator}</b>
          </Typography>
        </center>
        <DialogContentText>
          The app "{appName || originator}" would like to access <b>{protocolID}</b>.
        </DialogContentText>
        {protocolSecurityLevel === 2 && counterparty && (
          <DialogContentText>
            <b>Counterparty</b>: {counterparty}
          </DialogContentText>
        )}
        <DialogContentText>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.button_bar}>
        <Button
          onClick={handleCancel}
          color='primary'
        >
          Deny
        </Button>
        <Button
          color='primary'
          onClick={handleGrant}
        >
          Grant
        </Button>
      </DialogActions>
    </>
  )
}

export default ProtocolPermission
