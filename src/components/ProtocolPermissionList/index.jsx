import React, { useState, useEffect, useCallback } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  ListSubheader
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import { Folder, Delete } from '@mui/icons-material'
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

const ProtocolPermissionList = ({ app, protocol, limit, counterparty, itemsDisplayed = 'protocols', canRevoke = true, displayCount = true, listHeaderTitle, showEmptyList = false }) => {
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
  const [dialogLoading, setDialogLoading] = useState(false)
  const classes = useStyles()
  const history = useHistory()

  const refreshPerms = useCallback(async () => {

    // Get the current permmission grants
    const result = await window.CWI.listProtocolPermissions({
      targetDomain: app,
      targetProtocolName: protocol,
      limit
    })

    // Filter permissions by counterparty and domain if items are displayed as apps
    if (itemsDisplayed === 'apps') {
      const results = sortPermissions(result)
      console.log('sorting... ', results)
      setPerms(results)
    } else {
      setPerms(result)
    }
  }, [app, protocol])

  const revokePermission = async perm => {
    setCurrentPerm(perm)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setDialogLoading(true)
      await window.CWI.revokeProtocolPermission({ permission: currentPerm })
      setPerms(oldPerm =>
        oldPerm.filter(x =>
          x.permissionGrantID !== currentPerm.permissionGrantID
        )
      )
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
        {listHeaderTitle &&
          <ListSubheader>
            {listHeaderTitle}
          </ListSubheader>}
        {perms.map((perm, i) => (
          <ListItem
            key={i}
            className={classes.action_card}
            elevation={4}
          >
            {itemsDisplayed === 'apps'
              ? (
                <div className='app-permission'>
                  <ListSubheader>
                    <AppChip label={perm.originator}/>
                  </ListSubheader>
                  {perm.counterparties.map((permission, idx) => {
                    return (
                      
                  <div key={idx} className='additional-permission'>
                     <ListItem
            key={idx}
            className={classes.action_card}
            elevation={4}
          >
            <CounterpartyChip counterparty={permission.counterparty} />
            <ListItemSecondaryAction>
            <IconButton edge='end' onClick={() => revokePermission(permission.permissionGrant)} size='large'>
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
              </ListItem>
            </div>
                )
              })}
            </div>
            )
          : (
            <ProtoChip
              protocolID={perm.protocol}
              counterparty={perm.counterparty}
              originator={app}
              clickable
            />
            )}
          </ListItem>
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
