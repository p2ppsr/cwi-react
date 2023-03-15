import React, { useState, useEffect, useContext } from 'react'
import {
  DialogContent, DialogContentText, Typography, DialogActions, Button
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import boomerang from 'boomerang-http'
import CustomDialog from '../CustomDialog/index.jsx'
import UIContext from '../../UIContext'
import AppChip from '../AppChip'

const useStyles = makeStyles(style, {
  name: 'ProtocolPermissionHandler'
})

const ProtocolPermissionHandler = () => {
  const {
    onFocusRequested,
    onFocusRelinquished,
    isFocused
  } = useContext(UIContext)
  const [wasOriginallyFocused, setWasOriginallyFocused] = useState(false)
  const classes = useStyles()
  const [description, setDescription] = useState('')
  const [originator, setOriginator] = useState('')
  const [protocolID, setProtocolID] = useState('')
  const [counterparty, setCounterparty] = useState('')
  const [protocolSecurityLevel, setProtocolSecurityLevel] = useState('')
  const [appName, setAppName] = useState(null)
  const [renewal, setRenewal] = useState(false)
  const [requestID, setRequestID] = useState(null)
  const [open, setOpen] = useState(false)

  const handleCancel = async () => {
    window.CWI.denyProtocolPermission({ requestID })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  const handleGrant = async () => {
    window.CWI.grantProtocolPermission({ requestID })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback(
        'onProtocolPermissionRequested',
        async ({
          requestID,
          protocolSecurityLevel,
          protocolID,
          counterparty,
          originator,
          description,
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
          setRequestID(requestID)
          setProtocolSecurityLevel(protocolSecurityLevel)
          setCounterparty(counterparty)
          setProtocolID(protocolID)
          setOriginator(originator)
          setDescription(description)
          setRenewal(renewal)
          setOpen(true)
          setWasOriginallyFocused(wasOriginallyFocused)
          if (!wasOriginallyFocused) {
            await onFocusRequested()
          }
        }
      )
    })()
    return () => {
      if (id) {
        window.CWI.unbindCallback('onProtocolPermissionRequested', id)
      }
    }
  }, [])

  return (
    <CustomDialog
      open={open}
      onClose={handleCancel}
      title='App Permission Request'
    >
      <div
        padding='1em'
        textAlign='center'>
        <center>
          <AppChip size={1.5} label={originator} clickable={false} />
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
      </div>
      {renewal && (
        <DialogContentText>
          The app has requested this permission before.
        </DialogContentText>
      )}
      <div>
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
      </div>
    </CustomDialog>
  )
}

export default ProtocolPermissionHandler
