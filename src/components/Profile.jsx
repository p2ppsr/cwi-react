import React, { useState, useEffect } from 'react'
import ProfileEditor from './ProfileEditor/index.jsx'
import Satoshis from './Satoshis.jsx'
import { Img } from 'uhrp-react'
import bridgeportResolvers from '../utils/bridgeportResolvers'
import { makeStyles } from '@mui/styles'
import { Typography, Fab, Divider, CircularProgress } from '@mui/material'
import { Edit } from '@mui/icons-material'

const useStyles = makeStyles(theme => ({
  content_wrap: {
    position: 'sticky',
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
    maxHeight: '10em',
    [theme.breakpoints.up('xl')]: {
      minWidth: '16em',
      minHeight: '16em',
      maxWidth: '16em',
      maxHeight: '16em'
    }
  },
  profile_loading: {
    minWidth: '10em',
    minHeight: '10em',
    maxWidth: '10em',
    maxHeight: '10em',
    [theme.breakpoints.up('xl')]: {
      minWidth: '16em',
      minHeight: '16em',
      maxWidth: '16em',
      maxHeight: '16em'
    }
  },
  image_edit: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(1),
    position: 'relative'
  },
  edit: {
    position: 'absolute',
    right: '-1em',
    top: '-1em'
  }
}), { name: 'Profile' })

const Profile = () => {
  const [avatar, setAvatar] = useState({})
  const [editorOpen, setEditorOpen] = useState(false)
  const [accountBalance, setAccountBalance] = useState(null)
  const classes = useStyles()

  const refreshProfile = async () => {
    setAvatar(await window.CWI.ninja.getAvatar())
  }

  const refreshBalance = async () => {
    try {
      const result = await window.CWI.ninja.getTotalValue()
      setAccountBalance(result.total)
    } catch (e) { /* ignore */ } // If the balance cannot be refreshed, it is probably because the user's internet has dropped. We don't want this error to be thrown, because it will just clutter up Bugsnag.
  }

  useEffect(() => {
    (async () => {
      try {
        await window.CWI.waitForAuthentication()
        refreshBalance()
        setAvatar(await window.CWI.ninja.getAvatar())
      } catch (e) {}
    })()
  }, [])

  useEffect(() => {
    const interval = setInterval(refreshBalance, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className={classes.content_wrap}>
        <div className={classes.image_edit}>
          <Img
            className={classes.profile_icon}
            src={avatar.photoURL || 'uhrp:XUUDw85K5U6ccmjGjtirk1wZnsruBXayzuLeqz4woTQK1LfhvuY6'}
            alt=''
            loading={<CircularProgress className={classes.profile_loading} />}
            bridgeportResolvers={bridgeportResolvers()}
          />
          <Fab
            size='small'
            onClick={() => setEditorOpen(true)}
            className={classes.edit}
          >
            <Edit color='primary' />
          </Fab>
        </div>
        <Typography variant='h3'>
          {avatar.name || 'Welcome!'}
        </Typography>
        <Typography onClick={() => refreshBalance()} color='textSecondary'>
          <Satoshis>{accountBalance}</Satoshis>
        </Typography>
        <Divider />
      </div>
      <ProfileEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={refreshProfile}
        name={avatar.name}
        photoURL={avatar.photoURL}
      />
    </>
  )
}

export default Profile
