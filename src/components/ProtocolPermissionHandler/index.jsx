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
import CounterpartyChip from '../CounterpartyChip'
import ProtoChip from '../ProtoChip'

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
      // onClose={handleCancel}
      title={protocolID === 'identity resolution' ? 'Trusted Entities Access Request' : (!renewal ? 'Protocol Access Request' : 'Protocol Access Renewal')}
    >
      <DialogContent style={{
        textAlign: 'center',
        padding: '1em',
        flex: 'none'
      }}
      >
        <DialogContentText>
          <br />
          An app is requesting to talk in a specific language (protocol) using your information.
        </DialogContentText>
        <br />
        <center>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gridGap: '0.2em', alignItems: 'center', width: 'min-content', gridGap: '2em' }}>
            <span>app:</span>
            {originator && <div>
              <AppChip
                size={2.5}
                showDomain
                label={originator}
                clickable={false}
              />
                           </div>}
          </div>
          <br />
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gridGap: '0.2em', alignItems: 'center', width: 'min-content', gridGap: '2em' }}>
            <span>protocol:</span>
            <div>
              <ProtoChip
                securityLevel={protocolSecurityLevel}
                protocolID={protocolID}
                counterparty={counterparty}
              />
            </div>
          </div>
          <br />
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gridGap: '0.2em', alignItems: 'center', gridGap: '2em', margin: '0px 1.5em' }}>
            <span>reason:</span>
            <DialogContentText>
              {description}
            </DialogContentText>
          </div>
        </center>
      </DialogContent>
      <DialogActions style={{
        justifyContent: 'space-around',
        padding: '1em',
        flex: 'none'
      }}
      >
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
    </CustomDialog>
  )
}

export default ProtocolPermissionHandler
