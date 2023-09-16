import React, { useState, useEffect, useContext } from 'react'
import {
  DialogContent, DialogContentText, DialogActions, Button, Typography, Divider, Checkbox, Chip, FormControlLabel
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import boomerang from 'boomerang-http'
import CustomDialog from '../CustomDialog/index.jsx'
import UIContext from '../../UIContext.js'
import AppChip from '../AppChip/index.jsx'
import ProtoChip from '../ProtoChip/index.jsx'
import CounterpartyChip from '../CounterpartyChip/index.jsx'
import CertificateChip from '../CertificateChip/index.jsx'
import BasketChip from '../BasketChip/index.jsx'
import { Satoshis } from '../Satoshis.jsx'

const useStyles = makeStyles({
  protocol_grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    gridColumnGap: '0.5em',
    padding: '1em 0px'
  },
  protocol_inset: {
    marginLeft: '2.5em',
    paddingLeft: '0.5em',
    borderLeft: '3px solid #bbb',
    paddingTop: '0.5em',
    marginBottom: '1em',
  },
  basket_grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    gridColumnGap: '0.5em',
    padding: '0.5em 0px'
  },
  basket_inset: {
    marginLeft: '2.5em',
    paddingLeft: '0.5em',
    borderLeft: '3px solid #bbb',
    paddingTop: '0.5em',
    marginBottom: '1em',
  },
  certificate_grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    gridColumnGap: '0.5em',
    padding: '0.5em 0px'
  },
  certificate_inset: {
    marginLeft: '2.5em',
    paddingLeft: '0.5em',
    borderLeft: '3px solid #bbb',
    marginBottom: '1em',
  },
  certificate_attribute_wrap: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    gridGap: '0.5em'
  },
  certificate_field: {
    margin: '0px 0.25em'
  },
  certificate_display: {
    display: 'grid',
    gridTemplateRows: 'auto'
  }
}, { name: 'GroupPermissionHandler' }) 

const GroupPermissionHandler = () => {
  const {
    onFocusRequested,
    onFocusRelinquished,
    isFocused
  } = useContext(UIContext)
  const [wasOriginallyFocused, setWasOriginallyFocused] = useState(false)
  const [originator, setOriginator] = useState('')
  const [appName, setAppName] = useState(null)
  const [requestID, setRequestID] = useState(null)
  const [open, setOpen] = useState(false)
  const [spendingAuthorization, setSpendingAuthorization] = useState(undefined)
  const [protocolPermissions, setProtocolPermissions] = useState([])
  const [basketAccess, setBasketAccess] = useState([])
  const [certificateAccess, setCertificateAccess] = useState([])
  const classes = useStyles()

  const handleCancel = async () => {
    window.CWI.denyGroupPermission({ requestID })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  const handleGrant = async () => {
    window.CWI.grantGroupPermission({
      requestID,
      granted: {
        spendingAuthorization,
        protocolPermissions,
        basketAccess,
        certificateAccess
      }
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
        'onGroupPermissionRequested',
        async ({
          requestID,
          groupPermissions,
          originator,
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
          setSpendingAuthorization(groupPermissions.spendingAuthorization)
          setProtocolPermissions(groupPermissions.protocolPermissions)
          setBasketAccess(groupPermissions.basketAccess)
          setCertificateAccess(groupPermissions.certificateAccess)
          setOriginator(originator)
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
        window.CWI.unbindCallback('onGroupPermissionRequested', id)
      }
    }
  }, [])

  return (
    <CustomDialog
      open={open}
      // onClose={handleCancel}
      title='Select App Permissions'
    >
      <DialogContent>
        <DialogContentText>
          <br />
          An app is requesting access to some of your information, and it wants to do some things on your behalf. Have a look through the below list of items, and select the ones you'd be okay with.
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
        </center>
        <br />
        {spendingAuthorization && (
          <>
            <Typography variant='h3'>Spending Authorization</Typography>
            <FormControlLabel
              control={<Checkbox />}
              label={<span>Let the app spend <Satoshis abbreviate>{spendingAuthorization.amount}</Satoshis> over the next 2 months without asking.</span>}
            />
            <br />
            <br />
          </>
        )}
        <Typography variant='h3'>Protocol Permissions</Typography>
        <Typography color='textSecondary' variant='caption'>
          Protocols let apps talk in specific languages using your information.
        </Typography>
        {protocolPermissions.map((x, i) => (
          <div key={i} className={classes.protocol_grid}>
            <div>
            <Checkbox />
            </div>
            <div>
            <ProtoChip
              protocolID={x.protocolID[1]}
              securityLevel={x.protocolID[0]}
              counterparty={x.counterparty}
            />
            <div className={classes.protocol_inset}>
              <p style={{ marginBottom: '0px' }}><b>Reason:{' '}</b>{x.description}</p>
            </div>
            </div>
          </div>
        ))}
        <Typography variant='h3'>Certificate Access</Typography>
        {certificateAccess.map((x, i) => (
          <div key={i} className={classes.certificate_grid}>
            <div>
              <Checkbox />
            </div>
            <div className={classes.certificate_display}>
              <div>
                <CertificateChip
                  certType={x.type}
                />
              </div>
              <div className={classes.certificate_inset}>
              <div className={classes.certificate_attribute_wrap}>
                <div style={{ minHeight: '1em' }} />
                <div />
                <b>Fields:</b>
                <div>
                  {x.fields.map((y, j) => (
                    <Chip
                      className={classes.certificate_field}
                      key={j}
                      label={y}
                    />
                  ))}
                </div>
                <b>Verifier:</b>
                <div>
                  <CounterpartyChip
                    counterparty={x.verifierPublicKey}
                  />
                </div>
                </div>
                <p style={{ marginBottom: '0px' }}><b>Reason:{' '}</b>{x.description}</p>
              </div>
            </div>
          </div>
        ))}
        <Typography variant='h3'>Basket Access</Typography>
        {basketAccess.map((x, i) => (
          <div key={i} className={classes.basket_grid}>
            <div>
              <Checkbox />
            </div>
            <div>
              <BasketChip
                basketId={x.name}
              />
              <div className={classes.basket_inset}>
                <p style={{ marginBottom: '0px' }}><b>Reason:{' '}</b>{x.description}</p>
              </div>
            </div>
          </div>
        ))}
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
          Deny All
        </Button>
        <Button
          color='primary'
          onClick={handleGrant}
        >
          Grant Selected
        </Button>
      </DialogActions>
    </CustomDialog>
  )
}

export default GroupPermissionHandler
