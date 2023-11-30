/* eslint-disable react/prop-types */
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

const useStyles = makeStyles(style, {
  name: 'ProtocolList'
})

// eslint-disable-next-line react/display-name
const ProtocolList = React.memo(
  ({
    app,
    protocol,
    limit,
    canRevoke = true,
    displayCount = true,
    listHeaderTitle,
    showEmptyList = false
  }) => {
    console.log(
      'ProtocolList():app=',
      app,
      ',protocol=',
      protocol,
      ',limit=',
      limit,
      ',canRevoke=',
      canRevoke,
      ',displayCount=',
      displayCount,
      ',listHeaderTitle=',
      listHeaderTitle,
      ',showEmptyList=',
      showEmptyList
    )
    const [perms, setPerms] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [currentPerm, setCurrentPerm] = useState(null)
    const [dialogLoading, setDialogLoading] = useState(false)
    const classes = useStyles()

    const refreshPerms = useCallback(async () => {
      try {
        const result = await window.CWI.listProtocolPermissions({
          targetDomain: app,
          targetProtocol: protocol,
          limit
        })
        setPerms(result)
      } catch (error) {
        console.error('Error refreshing permissions:', error)
      }
    }, [app, protocol])

    const revokePermission = (perm) => {
      setCurrentPerm(perm)
      setDialogOpen(true)
    }

    const handleConfirm = async () => {
      try {
        setDialogLoading(true)
        await window.CWI.revokeProtocolPermission({
          permission: currentPerm
        })
        setPerms((oldPerm) =>
          oldPerm.filter((x) => x.permissionGrantID !== currentPerm.permissionGrantID)
        )
        setCurrentPerm(null)
        setDialogOpen(false)
        setDialogLoading(false)
        refreshPerms()
      } catch (error) {
        console.error('Error revoking permission:', error)
        toast.error('Permission may not have been revoked: ' + error.message)
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

    return (
      <>
        <Dialog open={dialogOpen}>
          <DialogTitle>Revoke Permission?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You can re-authorize this permission next time you use this app.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" disabled={dialogLoading} onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button color="primary" disabled={dialogLoading} onClick={handleConfirm}>
              Revoke
            </Button>
          </DialogActions>
        </Dialog>
        <List>
          {listHeaderTitle && <ListSubheader>{listHeaderTitle}</ListSubheader>}
          {perms.map((perm, i) => (
            <ListItem key={i} className={classes.action_card} elevation={4}>
              <ListItemAvatar>
                <Avatar className={classes.icon}>
                  <Folder />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={perm.protocol}
                secondary={`Expires ${formatDistance(
                  new Date(perm.expiry * 1000),
                  new Date(),
                  { addSuffix: true }
                )}`}
              />
              {canRevoke && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => revokePermission(perm)} size="large">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
        {displayCount && (
          <center>
            <Typography color="textSecondary">
              <i>Total Permissions: {perms.length}</i>
            </Typography>
          </center>
        )}
      </>
    )
  }
)

export default ProtocolList
