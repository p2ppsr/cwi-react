import React, { useState, useEffect, useContext } from 'react'
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import boomerang from 'boomerang-http'
import CustomDialog from '../CustomDialog/index.jsx'
import UIContext from '../../UIContext'
import AppChip from '../AppChip'
import CertificateChip from '../CertificateChip'

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
    window.CWI.denyCertificateAccess({ requestID })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  const handleGrant = async () => {
    window.CWI.grantCertificateAccess({ requestID })
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
          verifierPublicKey,
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
      // onClose={handleCancel}
      title={!renewal
        ? 'Certificate Access Request'
        : 'Certificate Access Renewal'
      }
    >
      <DialogContent style={{
        textAlign: 'center',
        padding: '1em',
        flex: 'none'
      }}
      >
        <DialogContentText>
          <br />
          Someone wants to use an app to look at some of your digital certificates.
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
          <span>certificate:</span>
            <div>
              <CertificateChip
                certType={certificateType}
                fieldsToDisplay={fields}
                verifier={verifierPublicKey}
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

export default CertificateAccessHandler
