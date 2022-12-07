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
  name: 'CertificateAccessList'
})

const CertificateAccessList = ({ app, type, verifier, fields }) => {
  const [grants, setGrants] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentAccessGrant, setCurrentAccessGrant] = useState(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const classes = useStyles()

  const refreshGrants = useCallback(async () => {
    const result = await window.CWI.listCertificateAccess({
      targetDomain: app,
      targetCertificateType: type,
      targetVerifier: verifier,
      targetFields: fields
    })
    setGrants(result)
  }, [app, type, verifier, fields])

  const revokeAccess = async grant => {
    setCurrentAccessGrant(grant)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setDialogLoading(true)
      await window.CWI.revokeCertificateAccess(currentAccessGrant)
      setGrants(oldAccessGrant =>
        oldAccessGrant.filter(x =>
          x.accessGrantID !== currentAccessGrant.accessGrantID
        )
      )
      setCurrentAccessGrant(null)
      setDialogOpen(false)
      setDialogLoading(false)
      await new Promise(resolve => setTimeout(resolve, 15000))
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
        {grants.map((grant, i) => (
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
              primary={grant.type}
              secondary={`Expires ${formatDistance(new Date(grant.expiry * 1000), new Date(), { addSuffix: true })}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge='end' onClick={() => revokeAccess(grant)} size='large'>
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
          <i>Total Certificate Access Grants: {grants.length}</i>
        </Typography>
      </center>
    </>
  )
}

export default CertificateAccessList
