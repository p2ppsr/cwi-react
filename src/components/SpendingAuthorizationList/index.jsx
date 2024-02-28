import React, { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
  Grid,
  Box
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import { format } from 'date-fns'
import AmountDisplay from '../AmountDisplay'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, {
  name: 'SpendingAuthorizationList'
})

const SpendingAuthorizationList = ({ app, limit, onEmptyList = () => { } }) => {
  const [authorization, setAuthorization] = useState(null)
  const [currentSpending, setCurrentSpending] = useState(0)
  const [authorizedAmount, setAuthorizedAmount] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)
  const classes = useStyles()

  const refreshAuthorizations = useCallback(async () => {
    const result = await window.CWI.getSpendingAuthorization({
      targetDomain: app
    })
    if (!result || result.authorization === undefined) {
      onEmptyList()
    } else {
      setAuthorization(result.authorization)
      setCurrentSpending(result.currentSpending)
      setAuthorizedAmount(result.authorizedAmount)
    }
  }, [app])

  const revokeAuthorization = async authorization => {
    setAuthorization(authorization)
    setDialogOpen(true)
  }

  const updateSpendingAuthorization = async authorization => {
    // setAuthorization(authorization)
    // setUpdateDialogOpen(true)
    await window.CWI.updateSpendingAuthorization({ authorizationGrant: authorization, amount: 15000000 })
  }

  const handleConfirm = async () => {
    try {
      setDialogLoading(true)
      await window.CWI.revokeSpendingAuthorization({ authorizationGrant: authorization })
      setAuthorization(null)
      setDialogOpen(false)
      setDialogLoading(false)
      refreshAuthorizations()
    } catch (e) {
      refreshAuthorizations()
      toast.error('Permission may not have been revoked: ' + e.message)
      setDialogOpen(false)
      setDialogLoading(false)
    }
  }

  const handleDialogClose = () => {
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
      {authorization &&
        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" className={classes.root}>

          {/* Monthly Spending Limits and Revoke Button */}
          <Grid item container direction="row" justifyContent="space-between" alignItems="center" className={classes.titleSection}>
            <Grid item xs>
              <Typography variant='h2' className={classes.title} color='textPrimary'>Monthly Spending Limits</Typography>
              <Typography variant='body1' color='textSecondary'>
                This app is allowed to spend up to <AmountDisplay>{authorizedAmount}</AmountDisplay> a month.
              </Typography>
            </Grid>
            <Grid item>
              <Button onClick={() => revokeAuthorization(authorization)} className={classes.revokeButton}>
                Revoke
              </Button>
            </Grid>
          </Grid>

          {/* Current Spending Display */}
          <Grid item xs={12} className={classes.spendingSection}>
            <Typography variant='h5' paragraph>
              <b>
                Current Spending (since {format((new Date().setDate(1)), 'MMMM do')}):
              </b> <AmountDisplay>{currentSpending}</AmountDisplay>
            </Typography>
            {Number.isInteger(Number(authorizedAmount)) && authorizedAmount > 0 && (
              <LinearProgress
                variant='determinate'
                value={parseInt((currentSpending / authorizedAmount) * 100)}
              />
            )}
          </Grid>

          {/* Increase Limits Button */}
          <Grid item container justifyContent="center" className={classes.buttonSection}>
            <Grid item xs={12} sm={6} md={4}>
              <Button className={classes.increaseButton} onClick={() => updateSpendingAuthorization(authorization)}>
                Increase Limits
              </Button>
            </Grid>
          </Grid>

        </Grid>
      }
      {!authorization &&
        <div style={{ textAlign: 'center', paddingTop: '2em' }}>
          <Typography>This app has no spending authorizations.</Typography>
        </div>

      }
    </>
  )
}

export default SpendingAuthorizationList
