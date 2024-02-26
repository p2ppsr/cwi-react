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
  LinearProgress
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import { AttachMoney, Delete } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import formatDistance from 'date-fns/formatDistance'
import AmountDisplay from '../AmountDisplay'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, {
  name: 'SpendingAuthorizationList'
})

const SpendingAuthorizationList = ({ app, limit, onEmptyList = () => { } }) => {
  const [authorization, setAuthorization] = useState([])
  const [currentSpending, setCurrentSpending] = useState(0)
  const [authorizedAmount, setAuthorizedAmount] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentAuthorization, setCurrentAuthorization] = useState(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  // const [earliestAuthorization, setEarliestAuthorization] = useState(null)
  const classes = useStyles()

  const refreshAuthorizations = useCallback(async () => {
    const result = await window.CWI.getSpendingAuthorization({
      targetDomain: app
    })
    console.log('spending list', result)
    if (!result || result.authorization === undefined) {
      onEmptyList()
    } else {
      setAuthorization(result.authorization)
      setCurrentSpending(result.currentSpending)
      setAuthorizedAmount(result.authorizedAmount)
    }
  }, [app])

  const revokeAuthorization = async authorization => {
    // setCurrentAuthorization(authorization)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setDialogLoading(true)
      await window.CWI.revokeSpendingAuthorization({ authorizationGrant: authorization })
      setAuthorization({})
      // setCurrentAuthorization(null)
      setDialogOpen(false)
      setDialogLoading(false)
      refreshAuthorizations()
    } catch (e) {
      refreshAuthorizations()
      toast.error('Permission may not have been revoked: ' + e.message)
      // setCurrentAuthorization(null)
      setDialogOpen(false)
      setDialogLoading(false)
    }
  }

  const handleDialogClose = () => {
    // setCurrentAuthorization(null)
    setDialogOpen(false)
  }

  useEffect(() => {
    refreshAuthorizations()
  }, [refreshAuthorizations])

  return (
    <>
      <Dialog
        open={dialogOpen}
      >
        <DialogTitle>
          Revoke Authorization?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can re-authorize spending next time you use this app.
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
        <ListItem
          className={classes.action_card}
          elevation={4}
        >
          <ListItemAvatar>
            <Avatar className={classes.icon}>
              <AttachMoney />
            </Avatar>
          </ListItemAvatar>
          {/* <h1>TODO: Fix the bug that cause an invalid timestamp with temp fix below:</h1> */}
          {/* {authorization &&
            <ListItemText
              primary={<AmountDisplay>{authorization.amount}</AmountDisplay>}
              secondary={`Must be used within ${formatDistance(new Date(authorization.expiry <= 16817763900000 ? authorization.expiry * 1000 : Date.now() + 10000000), new Date(), { addSuffix: true })}`}
            />
          } */}
          <ListItemSecondaryAction>
            <Button onClick={() => { revokeAuthorization(authorization) }} className={classes.revokeButton}>
              Revoke
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      {Number.isInteger(Number(authorizedAmount)) && authorizedAmount > 0 && (
        <div>
          <Typography variant='h5' paragraph>
            <b>
              Current Spending (since {formatDistance((new Date()).setDate(1), new Date(), { addSuffix: true })}):
            </b> <AmountDisplay>{currentSpending}</AmountDisplay>
          </Typography>
          <Typography variant='h5' paragraph>
            <b>Authorized Amount:</b> <AmountDisplay>{authorizedAmount}</AmountDisplay>
          </Typography>
          <LinearProgress
            variant='determinate'
            value={parseInt((currentSpending / authorizedAmount) * 100)}
          />
        </div>
      )}
    </>
  )
}

export default SpendingAuthorizationList
