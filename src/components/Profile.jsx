import React, { useState, useEffect } from 'react'
import Satoshis from './Satoshis.jsx'
import confederacyHost from '../utils/confederacyHost'
import { makeStyles } from '@mui/styles'
import { Typography } from '@mui/material'

const useStyles = makeStyles(theme => ({
  content_wrap: {
    top: '0px',
    backgroundColor: theme.palette.grey[200],
    zIndex: 3,
    display: 'grid',
    placeItems: 'center',
    paddingBottom: theme.spacing(2)
  },
  profile_icon: {
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[8],
    minWidth: '10em',
    minHeight: '10em',
    maxWidth: '10em',
    maxHeight: '10em'
  },
  profile_loading: {
    minWidth: '10em',
    minHeight: '10em',
    maxWidth: '10em',
    maxHeight: '10em',
    alignItems: 'center',
    display: 'grid'
  },
  edit: {
    position: 'absolute',
    right: '-1em',
    top: '-1em'
  }
}), { name: 'Profile' })

const Profile = () => {
  const [accountBalance, setAccountBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const classes = useStyles()

  const refreshBalance = async () => {
    try {
      setBalanceLoading(true)
      const result = await window.CWI.ninja.getTotalValue()
      setAccountBalance(result.total)
      setBalanceLoading(false)
    } catch (e) {
      setBalanceLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        refreshBalance()
      } catch (e) { }
    })()
  }, [])

  const confederacyHostURL = confederacyHost()

  return (
    <>
      <div className={classes.content_wrap}>
        <Typography variant='h3'>
          {'Welcome!'}
        </Typography>
        <Typography
          onClick={() => refreshBalance()}
          color='textSecondary'
        >
          {balanceLoading
            ? '---'
            : <Satoshis>{accountBalance}</Satoshis>
          }
        </Typography>
      </div>
    </>
  )
}

export default Profile
