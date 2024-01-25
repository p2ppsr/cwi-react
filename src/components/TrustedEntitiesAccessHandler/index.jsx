import React, { useState, useEffect, useContext } from 'react'
import {
  DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material'
import boomerang from 'boomerang-http'
import CustomDialog from '../CustomDialog/index.jsx'
import UIContext from '../../UIContext.js'
import AppChip from '../AppChip/index.jsx'

const TrustedEntitiesAccessHandler = () => {
  const {
    onFocusRequested,
    onFocusRelinquished,
    isFocused
  } = useContext(UIContext)
  const [wasOriginallyFocused, setWasOriginallyFocused] = useState(false)
  const [description, setDescription] = useState('')
  const [originator, setOriginator] = useState('')
  const [appName, setAppName] = useState(null)
  const [renewal, setRenewal] = useState(false)
  const [requestID, setRequestID] = useState(null)
  const [open, setOpen] = useState(false)

  const handleCancel = async () => {
    window.CWI.denyTrustedEntitiesAccess({ requestID })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  const handleGrant = async () => {
    window.CWI.grantTrustedEntitiesAccess({ requestID })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback(
        'onTrustedEntitiesAccessRequested',
        async ({
          requestID,
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
        window.CWI.unbindCallback('onTrustedEntitiesAccessRequested', id)
      }
    }
  }, [])

  return (
    <CustomDialog
      open={open}
      // onClose={handleCancel}
      title={!renewal ? 'Trusted Entities Access Request' : 'Trusted Entities Access Renewal'}
    >
      <DialogContent style={{
        textAlign: 'center',
        padding: '1em',
        flex: 'none'
      }}
      >
        <DialogContentText>
          <br />
          An app is requesting to access to the your trusted entities.
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
          <br />
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gridGap: '0.2em', alignItems: 'center', gridGap: '2em', margin: '0px 1.5em' }}>
            <span>reason:</span>
            <DialogContentText>
              {description}
            </DialogContentText>
          </div>
        </center>
      </DialogContent>
      <br />
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

export default TrustedEntitiesAccessHandler
