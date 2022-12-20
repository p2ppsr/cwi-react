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
  Typography
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import { Folder, Delete } from '@mui/icons-material'
import formatDistance from 'date-fns/formatDistance'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, {
  name: 'ProtocolPermissionList'
})

const ProtocolPermissionList = ({ app, protocol }) => {
  const [perms, setPerms] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPerm, setCurrentPerm] = useState(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const classes = useStyles()

  const refreshPerms = useCallback(async () => {
    const result = await window.CWI.listProtocolPermissions({
      targetDomain: app,
      targetProtocol: protocol
    })
    setPerms(result)
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
        {perms.map((perm, i) => (
          <ListItem
            key={i}
            className={classes.action_card}
            elevation={4}
          >
            <ListItemAvatar>
              <Avatar className={classes.icon}>
                <Folder />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={perm.protocol}
              secondary={`Expires ${formatDistance(new Date(perm.expiry * 1000), new Date(), { addSuffix: true })}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge='end' onClick={() => revokePermission(perm)} size='large'>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <center>
        <Typography
          color='textSecondary'
        >
          <i>Total Permissions: {perms.length}</i>
        </Typography>
      </center>
    </>
  )
}

export default ProtocolPermissionList
