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
import AppChip from '../AppChip'

const useStyles = makeStyles(style, {
  name: 'BasketAccessList'
})

const BasketAccessList = ({ app, basket, limit, itemsDisplayed = 'baskets', canRevoke = true, displayCount = true, listHeaderTitle, showEmptyList = false }) => {
  // Validate params
  if (itemsDisplayed === 'apps' && app) {
    const e = new Error('Error in BasketAccessList: apps cannot be displayed when providing an app param! Please provide a valid basket instead.')
    throw e
  }
  if (itemsDisplayed === 'baskets' && basket) {
    const e = new Error('Error in BasketAccessList: baskets cannot be displayed when providing a basket param! Please provide a valid app domain instead.')
    throw e
  }
  const [grants, setGrants] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentAccessGrant, setCurrentAccessGrant] = useState(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const classes = useStyles()

  const refreshGrants = useCallback(async () => {
    const result = await window.CWI.listBasketAccess({
      targetDomain: app,
      targetBasket: basket,
      limit
    })
    setGrants(result)
  }, [app, basket])

  const revokeAccess = async grant => {
    setCurrentAccessGrant(grant)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setDialogLoading(true)
      await window.CWI.revokeBasketAccess({ grant: currentAccessGrant })
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

  if (grants.length === 0 && !showEmptyList) {
    return (<></>)
  }

  return (
    <>
      <Dialog
        open={dialogOpen}
      >
        <DialogTitle color='textPrimary'>
          Revoke Access?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can re-authorize this access grant next time you use this app.
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
          <ListItem
            key={i}
            className={classes.action_card}
            elevation={4}
            // style={{ backgroundColor: 'black', height: '5em' }}
          >

            {itemsDisplayed === 'apps'
              ? <AppChip label={grant.domain} showDomain clickable={false} />
              : <>
                <ListItemAvatar>
                  <Avatar className={classes.icon}>
                    <Folder />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={grant.basket}
                  secondary={`Expires ${formatDistance(new Date(grant.expiry * 1000), new Date(), { addSuffix: true })}`}
                />
                </>}

            {canRevoke &&
              <ListItemSecondaryAction>
                <IconButton edge='end' onClick={() => revokeAccess(grant)} size='large'>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>}

          </ListItem>
        ))}
      </List>
      {(itemsDisplayed === 'baskets' && displayCount) &&
        <center>
          <Typography
            color='textSecondary'
          >
            <i>Total Basket Access Grants: {grants.length}</i>
          </Typography>
        </center>}
    </>
  )
}

export default BasketAccessList
