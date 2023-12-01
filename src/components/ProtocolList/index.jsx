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
import { useTheme } from '@emotion/react'
import style from './style'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import ProtoChip from '../ProtoChip'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import AppChip from '../AppChip'
import CounterpartyChip from '../CounterpartyChip'
import sortPermissions from './sortPermissions'

const useStyles = makeStyles(style, {
  name: 'ProtocolList'
})

/**
 * A component for displaying a list of protocol permissions as apps with access to a protocol, or protocols an app can access.
 *
 * @param {Object} obj - An object containing the following parameters:
 * @param {string} obj.app - The application context or configuration.
 * @param {number} obj.limit - The maximum number of permissions to display.
 * @param {string} obj.protocol - The protocol name for which permissions are being displayed.
 * @param {number} [obj.securityLevel] - The protocol securityLevel for which permissions are being displayed (optional).
 * @param {string} [obj.itemsDisplayed='protocols'] - The type of items to display ('protocols' or 'apps', 'protocols' by default).
 * @param {boolean} [obj.canRevoke=true] - Indicates whether permissions can be revoked (true by default).
 * @param {boolean} [obj.displayCount=true] - Indicates whether to display the count of permissions (true by default).
 * @param {string} [obj.listHeaderTitle] - The title for the list header.
 * @param {boolean} [obj.showEmptyList=false] - Indicates whether to show an empty list message or remove it (false by default).
 */
const ProtocolList = ({ app, limit, protocol, securityLevel, itemsDisplayed = 'protocols', canRevoke = true, displayCount = true, listHeaderTitle, showEmptyList = false }) => {
  // Validate params
  if (itemsDisplayed === 'apps' && app) {
    const e = new Error('Error in ProtocolList: apps cannot be displayed when providing an app param! Please provide a valid protocol instead.')
    throw e
  }
  if (itemsDisplayed === 'protocols' && protocol) {
    const e = new Error('Error in ProtocolList: protocols cannot be displayed when providing a protocol param! Please provide a valid app domain instead.')
    throw e
  }

  const [perms, setPerms] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPerm, setCurrentPerm] = useState(null)
  const [currentApp, setCurrentApp] = useState(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  const classes = useStyles()
  const history = useHistory()
  // const theme = useTheme()

  const refreshPerms = useCallback(async () => {
    // Get the current permission grants
    const result = await window.CWI.listProtocolPermissions({
      targetDomain: app,
      targetProtocolName: protocol,
      targetProtocolSecurityLevel: securityLevel,
      limit
    })

    // Filter permissions by counterparty and domain if items are displayed as apps
    if (itemsDisplayed === 'apps') {
      const results = sortPermissions(result)
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

  // Handle revoke dialog confirmation
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

  // Determines if an empty list showed be shown or just removed
  if (perms.length === 0 && !showEmptyList) {
    return (<></>)
  }

  return (
    <>
      <Dialog
        open={dialogOpen}
      >
        <DialogTitle color='textPrimary'>
          Revoke Permission?
        </DialogTitle>
        <DialogContent>
          <DialogContentText color='textSecondary'>
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
              <div className={classes.appList}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '1em', alignItems: 'center' }}>
                  <AppChip
                    label={permObject.originator} showDomain onClick={(e) => {
                      e.stopPropagation()
                      history.push({
                        pathname: `/dashboard/app/${encodeURIComponent(permObject.originator)}`,
                        state: {
                          domain: permObject.originator
                        }
                      })
                    }}
                  />
                  {canRevoke &&
                    <>
                      {permObject.permissions.length > 0 && permObject.permissions[0].counterparty
                        ? <Button onClick={() => { revokeAllPermissions(permObject) }} variant='contained' color='secondary' className={classes.revokeButton}>
                          Revoke All
                          </Button>
                        : <IconButton edge='end' onClick={() => revokePermission(permObject.permissions[0].permissionGrant)} size='large'>
                          <CloseIcon />
                        </IconButton>}
                    </>}

                </div>

                <ListItem elevation={4}>
                  <Grid container spacing={1} style={{ paddingBottom: '1em' }}>
                    {permObject.permissions.map((permission, idx) => (
                      <React.Fragment key={idx}>
                        {permission.counterparty &&
                          <Grid item xs={12} sm={6} md={6} lg={4}>
                            <div className={classes.gridItem}>
                              <CounterpartyChip counterparty={permission.counterparty} size={1.1} />
                              {canRevoke &&
                                <IconButton edge='end' onClick={() => revokePermission(permission.permissionGrant)} size='large'>
                                  <CloseIcon />
                                </IconButton>}
                            </div>
                          </Grid>}
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

export default ProtocolList
