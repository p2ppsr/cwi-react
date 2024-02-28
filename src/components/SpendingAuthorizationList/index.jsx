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
  Grid
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import { format } from 'date-fns'
import AmountDisplay from '../AmountDisplay'
import { toast } from 'react-toastify'
import { CwiExternalServices } from 'cwi-external-services'

const useStyles = makeStyles(style, {
  name: 'SpendingAuthorizationList'
})

const SpendingAuthorizationList = ({ app, limit, onEmptyList = () => { } }) => {
  const [authorization, setAuthorization] = useState(null)
  const [currentSpending, setCurrentSpending] = useState(0)
  const [authorizedAmount, setAuthorizedAmount] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [usdPerBsv, setUsdPerBSV] = useState(70)
  const classes = useStyles()
  const services = new CwiExternalServices(CwiExternalServices.createDefaultOptions())

  // Helper function (note consider moving to shared util)
  const determineUpgradeAmount = (previousAmountInSats, returnType = 'sats') => {
    let nextTierUsdAmount
    const previousAmountInUsd = Math.round(previousAmountInSats * (usdPerBsv / 100000000))

    // Upgrade to the next tier based on the current amount
    if (previousAmountInUsd < 5) {
      nextTierUsdAmount = 5
    } else if (previousAmountInUsd < 10) {
      nextTierUsdAmount = 10
    } else if (previousAmountInUsd < 15) {
      nextTierUsdAmount = 15
    } else if (previousAmountInUsd < 20) {
      nextTierUsdAmount = 20
    } else {
      nextTierUsdAmount = 30
    }

    // Return the next tier amount in the desired format (USD or sats)
    if (returnType === 'sats') {
      return Math.round(nextTierUsdAmount / (usdPerBsv / 100000000))
    }
    return nextTierUsdAmount
  }

  const refreshAuthorizations = useCallback(async () => {
    const result = await window.CWI.getSpendingAuthorization({
      targetDomain: app
    })
    if (!result || result.authorization === undefined) {
      onEmptyList()
    } else {
      console.log(result)
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
    setAuthorization(authorization)
    setUpgradeDialogOpen(true)
  }

  const handleConfirmRevoke = async () => {
    try {
      setDialogLoading(true)
      await window.CWI.revokeSpendingAuthorization({ authorizationGrant: authorization })
      setAuthorization(null)
      setDialogOpen(false)
      setDialogLoading(false)
      refreshAuthorizations()
    } catch (e) {
      refreshAuthorizations()
      toast.error('Spending Authorization may not have been revoked: ' + e.message)
      setDialogOpen(false)
      setDialogLoading(false)
    }
  }

  const handleConfirmUpgradeLimit = async () => {
    try {
      setDialogLoading(true)
      await window.CWI.updateSpendingAuthorization({ authorizationGrant: authorization, amount: determineUpgradeAmount(authorizedAmount) })
      setUpgradeDialogOpen(false)
      refreshAuthorizations()
    } catch (e) {
      refreshAuthorizations()
      toast.error('Spending authorization limit may not have been increased: ' + e.message)
      setUpgradeDialogOpen(false)
      setDialogLoading(false)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setUpgradeDialogOpen(false)
  }

  useEffect(() => {
    (async () => {
      const rate = await services.getBsvExchangeRate()
      setUsdPerBSV(rate)
    })()
    refreshAuthorizations()
  }, [refreshAuthorizations])

  return (
    <>
      <Dialog
        open={dialogOpen}
      >
        <DialogTitle color={'textPrimary'}>
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
            onClick={handleConfirmRevoke}
          >
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={upgradeDialogOpen}
      >
        <DialogTitle color={'textPrimary'}>
          Increase Spending Authorization
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Increase the monthly spending limit to <AmountDisplay>{determineUpgradeAmount(authorizedAmount)}</AmountDisplay>/MO.
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
            onClick={handleConfirmUpgradeLimit}
          >
            Allow
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
                value={currentSpending > 0 ? Math.max(1, Math.min(100, parseInt((currentSpending / authorizedAmount) * 100))) : 0}
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
