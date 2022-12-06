import React, { useState, useEffect, useContext } from 'react'
import {
  DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material'
import boomerang from 'boomerang-http'
import CustomDialog from '../CustomDialog/index.jsx'
import UIContext from '../../UIContext'
import AppChip from '../AppChip'

const CertificateAccessHandler = () => {
  const {
    onFocusRequested,
    onFocusRelinquished,
    isFocused
  } = useContext(UIContext)
  const [wasOriginallyFocused, setWasOriginallyFocused] = useState(false)
  const [description, setDescription] = useState('')
  const [originator, setOriginator] = useState('')
  const [certificateType, setType] = useState('')
  const [fields, setFields] = useState([])
  const [verifierPublicKey, setVerifier] = useState('')
  const [appName, setAppName] = useState(null)
  const [renewal, setRenewal] = useState(false)
  const [requestID, setRequestID] = useState(null)
  const [open, setOpen] = useState(false)

  const handleCancel = async () => {
    window.CWI.denyBasketAccess({ requestID })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  const handleGrant = async () => {
    window.CWI.grantBasketAccess({ requestID })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback(
        'onCertificateAccessRequested',
        async ({
          originator,
          verifierPublicKey: verifier,
          type: certificateType,
          fields,
          renewal,
          requestID,
          description
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
          setType(certificateType)
          setFields(fields)
          setVerifier(verifierPublicKey)
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
        window.CWI.unbindCallback('onCertificateAccessRequested', id)
      }
    }
  }, [])

  return (
    <CustomDialog
      open={open}
      onClose={handleCancel}
      title='Certificate Access Request'
    >
      <DialogContent>
        <center>
          <AppChip size={1.5} label={originator} clickable={false} />
        </center>
        <DialogContentText>
          The app "{appName || originator}" would like to access certificate type "{certificateType}" and the following fields...TODO<b>{fields[0]}</b>.
        </DialogContentText>
        <DialogContentText>
          {description}
        </DialogContentText>
      </DialogContent>
      {renewal && (
        <DialogContentText>
          The app has requested access before.
        </DialogContentText>
      )}
      <DialogActions>
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

export default CertificateAccessHandler
