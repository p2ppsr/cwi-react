/* eslint-disable react/prop-types */
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
  ListSubheader,
  Grid
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import { Folder, Delete } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import formatDistance from 'date-fns/formatDistance'
import { toast } from 'react-toastify'
import ProtoChip from '../ProtoChip'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import AppChip from '../AppChip'
import CounterpartyChip from '../CounterpartyChip'
import sortPermissions from './sortPermissions'

const useStyles = makeStyles(style, {
  name: 'ProtocolPermissionList'
})

const ProtocolPermissionList = ({ app, protocol, limit, itemsDisplayed = 'protocols', canRevoke = true, displayCount = true, listHeaderTitle, showEmptyList = false }) => {
  // Validate params
  if (itemsDisplayed === 'apps' && app) {
    const e = new Error('Error in ProtocolPermissionList: apps cannot be displayed when providing an app param! Please provide a valid protocol instead.')
    throw e
  }
  if (itemsDisplayed === 'protocols' && protocol) {
    const e = new Error('Error in ProtocolPermissionList: protocols cannot be displayed when providing a protocol param! Please provide a valid app domain instead.')
    throw e
  }

  const [perms, setPerms] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPerm, setCurrentPerm] = useState(null)
  const [currentApp, setCurrentApp] = useState(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const classes = useStyles()
  const history = useHistory()

  const refreshPerms = useCallback(async () => {
    // Get the current permission grants
    const result = await window.CWI.listProtocolPermissions({
      targetDomain: app,
      targetProtocolName: protocol,
      // targetProtocolSecurityLevel: '2',
      limit
    })
    console.log('grants ', result)

    // Filter permissions by counterparty and domain if items are displayed as apps
    if (itemsDisplayed === 'apps') {
      const results = sortPermissions(result)
      console.log('sorting... ', results)
      setPerms(results)
    } else {
      setPerms(result)
    }
  }, [app, protocol])

  // Handle revoking permissions (for an app, or a particular counterparty permission grant)
  const revokePermission = async perm => {
    setCurrentPerm(perm)
    setDialogOpen(true)
  }
  const revokeAllPermissions = async (app) => {
    setCurrentApp(app)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setDialogLoading(true)
      if (currentPerm) {
        await window.CWI.revokeProtocolPermission({ permission: currentPerm })
      } else {
        if (!currentApp || !currentApp.permissions) {
          const e = new Error('Unable to revoke permissions!')
          throw e
        }
        for (const permission of currentApp.permissions) {
          try {
            await window.CWI.revokeProtocolPermission({ permission: permission.permissionGrant })
          } catch (error) {
            console.error(error)
          }
        }
        setCurrentApp(null)
      }

      setCurrentPerm(null)
      setDialogOpen(false)
      setDialogLoading(false)
      refreshPerms()
    } catch (e) {
      toast.error('Permission may not have been revoked: ' + e.message)
      refreshPerms()
      setCurrentPerm(null)
      setDialogOpen(false)
      setDialogLoading(false)
    }
  }

  const handleDialogClose = () => {
    setCurrentPerm(null)
    setDialogOpen(false)
  }

  useEffect(() => {
    refreshPerms()
  }, [refreshPerms])

  if (perms.length === 0 && !showEmptyList) {
    return (<></>)
  }

  return (
    <>
      <Dialog
        open={dialogOpen}
      >
        <DialogTitle>
          Revoke Permission?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can re-authorize this permission next time you use this app.
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
        {listHeaderTitle && (
          <ListSubheader>
            {listHeaderTitle}
          </ListSubheader>
        )}
        {perms.map((permObject, i) => (
          <React.Fragment key={i}>

            {/* Counterparties listed just below the header */}
            {itemsDisplayed === 'apps' && (
              <div style={{ backgroundColor: '#222222', padding: '1em 0 0 1em' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '1em', alignItems: 'center' }}>
                  <AppChip label={permObject.originator} showDomain />
                  {permObject.permissions.length > 0 && permObject.permissions[0].counterparty
                    ? <Button onClick={() => { revokeAllPermissions(permObject) }} variant='contained' color='secondary'>
                      Revoke All
                      </Button>
                    : <IconButton edge='end' onClick={() => revokePermission(permObject.permissions[0].permissionGrant)} size='large'>
                      <CloseIcon />
                      </IconButton>}

                </div>

                <ListItem className={classes.action_card} elevation={4} style={{ margin: '2em' }}>
                  <Grid container spacing={1} className={classes.gridContainer} style={{ paddingBottom: '1em' }}>
                    {permObject.permissions.map((permission, idx) => (
                      <React.Fragment key={idx}>
                        {permission.counterparty &&
                          <><Grid item xs={12} sm={6} md={4} lg={3}>
                            <CounterpartyChip counterparty={permission.counterparty} />
                            </Grid><Grid item alignSelf='center'>
                            <IconButton edge='end' onClick={() => revokePermission(permission.permissionGrant)} size='large'>
                                <CloseIcon />
                              </IconButton>
                                 </Grid>
                          </>}

                      </React.Fragment>
                    ))}
                  </Grid>
                </ListItem>
              </div>
            )}

            {itemsDisplayed !== 'apps' && (
              <ListItem className={classes.action_card} elevation={4}>
                <ProtoChip
                  protocolID={permObject.protocol}
                  counterparty={permObject.counterparty}
                  securityLevel={permObject.securityLevel}
                  originator={permObject.originator}
                  clickable
                />
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>

      {displayCount &&
        <center>
          <Typography
            color='textSecondary'
          >
            <i>Total Permissions: {perms.length}</i>
          </Typography>
        </center>}

    </>
  )
}

export default ProtocolPermissionList
