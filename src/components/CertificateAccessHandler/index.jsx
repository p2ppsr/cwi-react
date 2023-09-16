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
      title='Certificate Access Request'
    >
      <DialogContent style={{
        textAlign: 'center',
        padding: '1em',
        flex: 'none'
      }}
      >
        <center>
          <AppChip size={1.5} label={originator} clickable={false} />
        </center>
        <DialogContentText>
          The app "{appName || originator}" would like to access certificate type "{certificateType}", for the following verifier:
        </DialogContentText>
        <br />
        <DialogContentText style={{ alignSelf: 'baseline' }}>
          <b>{verifierPublicKey}</b>
        </DialogContentText>
        <br />
        <DialogContentText>
          {description}
        </DialogContentText>
        <br />
      </DialogContent>
      <Typography align='center'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 250 }} aria-label='simple table' size='small'>
            <TableHead>
              <TableRow
                sx={{
                  borderBottom: '2px solid black',
                  '& th': {
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }
                }}
              >
                <TableCell>Fields Requested</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field) => (
                <TableRow
                  key={field}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {field}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        {renewal && (
          <DialogContentText>
            The app has requested access before.
          </DialogContentText>
        )}
      </Typography>
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
