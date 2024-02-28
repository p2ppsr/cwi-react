import React, { useState, useEffect, useContext } from 'react'
import {
  DialogContent,
  Typography,
  Fab,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import AmountDisplay from '../AmountDisplay'
import { Send, Cancel } from '@mui/icons-material'
import boomerang from 'boomerang-http'
import CustomDialog from '../CustomDialog/index.jsx'
import UIContext from '../../UIContext'
import AppChip from '../AppChip'
import { CwiExternalServices } from 'cwi-external-services'

const useStyles = makeStyles(style, {
  name: 'SpendingAuthorizationHandler'
})

const SpendingAuthorizationHandler = () => {
  const {
    onFocusRequested,
    onFocusRelinquished,
    isFocused
  } = useContext(UIContext)
  const [wasOriginallyFocused, setWasOriginallyFocused] = useState(false)
  const classes = useStyles()
  const [description, setDescription] = useState('')
  const [originator, setOriginator] = useState('')
  const [lineItems, setLineItems] = useState([])
  const [appName, setAppName] = useState(null)
  const [renewal, setRenewal] = useState(false)
  const [requestID, setRequestID] = useState(null)
  const [open, setOpen] = useState(false)
  const [transactionAmount, setTransactionAmount] = useState(0)
  const [authorizationAmount, setAuthorizationAmount] = useState(10000)
  const [alwaysAllowAmount, setAlwaysAllowAmount] = useState(100000)
  const [showAuthorizeApp, setShowAuthorizeApp] = useState(false)
  const [totalPastSpending, setTotalPastSpending] = useState(0)
  const [amountPreviouslyAuthorized, setAmountPreviouslyAuthorized] = useState(0)

  const [usdPerBsv, setUsdPerBSV] = useState(70)
  const services = new CwiExternalServices(CwiExternalServices.createDefaultOptions())

  // Helper function to figure out the upgrade amount (note: consider moving to utils)
  const determineUpgradeAmount = (previousAmountInSats, returnType = 'sats') => {
    let usdAmount
    const previousAmountInUsd = previousAmountInSats * (usdPerBsv / 100000000)

    if (previousAmountInUsd <= 5) {
      usdAmount = 5
    } else if (previousAmountInUsd <= 10) {
      usdAmount = 10
    } else if (previousAmountInUsd <= 20) {
      usdAmount = 20
    } else {
      usdAmount = 50
    }

    if (returnType === 'sats') {
      return Math.round(usdAmount / (usdPerBsv / 100000000))
    }
    return usdAmount
  }

  const handleCancel = async () => {
    window.CWI.denySpendingAuthorization({ requestID })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  const handleGrant = async ({ singular = true, amount }) => {
    window.CWI.grantSpendingAuthorization({
      requestID,
      singular,
      amount
    })
    setOpen(false)
    if (!wasOriginallyFocused) {
      await onFocusRelinquished()
    }
  }

  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback(
        'onSpendingAuthorizationRequested',
        async ({
          requestID,
          originator,
          description,
          transactionAmount,
          totalPastSpending,
          amountPreviouslyAuthorized,
          authorizationAmount,
          renewal,
          lineItems
        }) => {
          try {
            const result = await boomerang(
              'GET',
              `${originator.startsWith('localhost:') ? 'http' : 'https'}://${originator}/manifest.json`
            )
            if (typeof result === 'object') {
              if (result.name && result.name.length < 64) {
                setAppName(result.name)
              } else if (result.short_name && result.short_name.length < 64) {
                setAppName(result.short_name)
              }
            }
          } catch (e) {
            setAppName(originator)
          }
          const rate = await services.getBsvExchangeRate()
          setUsdPerBSV(rate)
          console.log(amountPreviouslyAuthorized)
          const wasOriginallyFocused = await isFocused()
          setWasOriginallyFocused(wasOriginallyFocused)
          setRequestID(requestID)
          setOriginator(originator)
          setLineItems(lineItems)
          setDescription(description)
          setRenewal(renewal)
          setTransactionAmount(transactionAmount)
          setTotalPastSpending(totalPastSpending)
          if (amountPreviouslyAuthorized) {
            setAmountPreviouslyAuthorized(amountPreviouslyAuthorized)
          }
          // setAlwaysAllowAmount()
          setAuthorizationAmount(authorizationAmount)
          setOpen(true)
          if (!wasOriginallyFocused) {
            await onFocusRequested()
          }
        }
      )
    })()
    return () => {
      if (id) {
        window.CWI.unbindCallback('onSpendingAuthorizationRequested', id)
      }
    }
  }, [])

  return (
    <CustomDialog
      open={open}
      // onClose={handleCancel}
      title={!renewal ? 'Spending Request' : 'Spending Check In'}
    >
      <DialogContent>
        <br />
        <center>
          <AppChip
            size={2.5}
            label={originator}
            clickable={false}
            showDomain
          />
          <br />
          <br />
        </center>
        <Typography align='center'>
          would like to spend
        </Typography>
        <Typography variant='h3' align='center' paragraph color='textPrimary'>
          <AmountDisplay >{transactionAmount}</AmountDisplay>
        </Typography>

        <Typography align='center'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 250 }} aria-label='simple table' size='small'>
              <TableHead>
                <TableRow
                  sx={{
                    borderBottom: '2px solid black',
                    '& th': {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                >
                  <TableCell>Description</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lineItems.map((row) => (
                  <TableRow
                    key={row.description}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {row.description}
                    </TableCell>
                    <TableCell align='right'> <AmountDisplay showPlus abbreviate>{row.satoshis}</AmountDisplay></TableCell>
                  </TableRow>
                ))}
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0, fontWeight: 'bold' } }}
                >
                  <TableCell component='th' scope='row'>
                    <b>Total</b>
                  </TableCell>
                  <TableCell align='right'><AmountDisplay showPlus abbreviate>{transactionAmount * -1}</AmountDisplay></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Typography>

        <div className={classes.fabs_wrap}>
          <Tooltip title='Deny Permission'>
            <Fab
              color='secondary'
              onClick={handleCancel}
              variant='extended'
            >
              <Cancel className={classes.button_icon} />
              Deny
            </Fab>
          </Tooltip>
          <Fab
            variant='extended'
            onClick={() => handleGrant({ singular: false, amount: determineUpgradeAmount(amountPreviouslyAuthorized) })}
          >
            Allow up to &nbsp;<AmountDisplay showFiatAsInteger>{determineUpgradeAmount(amountPreviouslyAuthorized)}</AmountDisplay>
          </Fab>
          <Tooltip title='Allow Once'>
            <Fab
              color='primary'
              onClick={() => handleGrant({ singular: true })}
              variant='extended'
            >
              <Send className={classes.button_icon} />
              Allow
            </Fab>
          </Tooltip>
        </div>
      </DialogContent>
    </CustomDialog>
  )
}

export default SpendingAuthorizationHandler
