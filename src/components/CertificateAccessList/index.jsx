import React, { useState, useEffect, useCallback } from 'react'
import {
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Grid,
  ListSubheader
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
// import { Folder, Delete, ExpandMore } from '@mui/icons-material'
import formatDistance from 'date-fns/formatDistance'
import { toast } from 'react-toastify'
import AppChip from '../AppChip'
import CounterpartyChip from '../CounterpartyChip'
import CertificateChip from '../CertificateChip'

const useStyles = makeStyles(style, {
  name: 'CertificateAccessList'
})

const CertificateAccessList = ({
  app,
  type,
  limit,
  displayCount = true,
  listHeaderTitle,
  showEmptyList = false,
  canRevoke = true
}) => {
  const [grants, setGrants] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentAccessGrant, setCurrentAccessGrant] = useState(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  // const [expandedPanel, setExpandedPanel] = useState(false)
  const classes = useStyles()

  const refreshGrants = useCallback(async () => {
    const result = await window.CWI.listCertificateAccess({
      targetDomain: app,
      targetCertificateType: type,
      limit
    })
    setGrants(result)
  }, [app, type])

  const revokeAccess = async grant => {
    setCurrentAccessGrant(grant)
    setDialogOpen(true)
  }

  const revokeAllAccess = async (app) => {
    setCurrentAccessGrant(app)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setDialogLoading(true)
      await window.CWI.revokeCertificateAccess({ grant: currentAccessGrant })
      setGrants(oldAccessGrant =>
        oldAccessGrant.filter(x =>
          x.accessGrantID !== currentAccessGrant.accessGrantID
        )
      )
      setCurrentAccessGrant(null)
      setDialogOpen(false)
      setDialogLoading(false)
      refreshGrants()
    } catch (e) {
      toast.error('Access may not have been revoked: ' + e.message)
      refreshGrants()
      setCurrentAccessGrant(null)
      setDialogOpen(false)
      setDialogLoading(false)
    }
  }

  const handleDialogClose = () => {
    setCurrentAccessGrant(null)
    setDialogOpen(false)
  }

  useEffect(() => {
    refreshGrants()
  }, [refreshGrants])

  // Only render the list if there is items to display
  if (grants.length === 0 && !showEmptyList) {
    return (<></>)
  }

  return (
    <>
      <Dialog
        open={dialogOpen}
      >
        <DialogTitle>
          Revoke Access?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can re-authorize this certificate access grant next time you use this app.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            disabled={dialogLoading}
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            disabled={dialogLoading}
            onClick={handleConfirm}
          >
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
      <List>
        {listHeaderTitle &&
          <ListSubheader>
            {listHeaderTitle}
          </ListSubheader>}
          {grants.map((grant, i) => (
          <React.Fragment key={i}>

            {/* Counterparties listed just below the header */}

              <div className={classes.appList}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '1em', alignItems: 'center' }}>
                  <AppChip
                    label={grant.domain} showDomain onClick={(e) => {
                      e.stopPropagation()
                      history.push({
                        pathname: `/dashboard/app/${encodeURIComponent(grant.domain)}`,
                        state: {
                          domain: grant.domain
                        }
                      })
                    }}
                  />
                  {canRevoke &&
                    <>
                      {grant.permissions && grant.permissions.length > 0 && grant.permissions[0].counterparty
                        ? <Button onClick={() => { revokeAllAccess(grant) }} variant='contained' color='secondary' className={classes.revokeButton}>
                          Revoke All
                          </Button>
                        : <IconButton edge='end' onClick={() => revokeAccess(grant.permissions[0].permissionGrant)} size='large'>
                          <CloseIcon />
                        </IconButton>}
                    </>}
                </div>
                <ListItem elevation={4}>
                  <Grid container spacing={1} style={{ paddingBottom: '1em' }}>
                    {grant.permissions && grant.permissions.map((permission, idx) => (
                      <React.Fragment key={idx}>
                        {permission.counterparty &&
                          <Grid item xs={12} sm={6} md={6} lg={4}>
                            <div className={classes.gridItem}>
                              <CounterpartyChip
                                counterparty={permission.counterparty}
                                size={1.1}
                                expires={formatDistance(new Date(permission.permissionGrant.expiry * 1000), new Date(), { addSuffix: true })}
                                onCloseClick={() => revokeAccess(permission.permissionGrant)}
                              />
                            </div>
                          </Grid>}
                      </React.Fragment>
                    ))}
                  </Grid>
                </ListItem>
              </div>
              <ListItem className={classes.action_card} elevation={4}>
              <CertificateChip
                certType={grant.type}
                lastAccessed={grant.lastAccessed}
                issuer={grant.issuer}
                onIssuerClick={grant.onIssuerClick}
                verifier={grant.verifier}
                onVerifierClick={grant.onVerifierClick}
                onClick={grant.onClick}
                fieldsToDisplay={grant.fields}
                history
                clickable={grant.clickable}
                size={1.3}
                expires={formatDistance(new Date(grant.expiry * 1000), new Date(), { addSuffix: true })}
                onCloseClick={() => revokeAccess(grant)}
                />
              </ListItem>
          </React.Fragment>
          ))}
      </List>

      {displayCount &&
        <center>
          <Typography
            color='textSecondary'
          >
            <i>Total Certificate Access Grants: {grants.length}</i>
          </Typography>
        </center>}

    </>
  )
}

export default CertificateAccessList
