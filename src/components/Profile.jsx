import React, { useState, useEffect } from 'react'
import ProfileEditor from './ProfileEditor/index.jsx'
import Satoshis from './Satoshis.jsx'
import { Img } from 'uhrp-react'
import bridgeportResolvers from '../utils/bridgeportResolvers'
import { makeStyles } from '@mui/styles'
import { Typography, Fab, Divider, CircularProgress } from '@mui/material'
import { Edit } from '@mui/icons-material'
import AddAPhoto from '@mui/icons-material/AddAPhoto'

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
  add_photo_button: {
    margin: '6em auto'
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
  const [balanceLoading, setBalanceLoading] = useState(true)
  const classes = useStyles()

  const refreshProfile = async () => {
    setAvatar(await window.CWI.ninja.getAvatar())
  }

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
        setAvatar(await window.CWI.ninja.getAvatar())
      } catch (e) { }
    })()
  }, [])

  const resolvers = bridgeportResolvers()

  return (
    <>
      <div className={classes.content_wrap}>
        {avatar.photoURL
          ? (
            <div className={classes.image_edit}>
              <Img
                className={classes.profile_icon}
                src={avatar.photoURL || 'uhrp:XUSw3EKLvt4uWHrMvKSDychPSvnAqVeKCrReidew2C2rUN6Sps3S'}
                alt=''
                loading={
                  <div className={classes.profile_loading}>
                    <center>
                      <CircularProgress />
                    </center>
                  </div>
                }
                bridgeportResolvers={resolvers}
              />
              <Fab
                size='small'
                onClick={() => setEditorOpen(true)}
                className={classes.edit}
              >
                <Edit color='primary' />
              </Fab>
            </div>
          )
          : (
            <Fab
              size='large'
              onClick={() => setEditorOpen(true)}
              color='primary'
              className={classes.add_photo_button}
            >
              <AddAPhoto />
            </Fab>
          )}
        <Typography variant='h3'>
          {avatar.name || 'Welcome!'}
        </Typography>
        <Typography
          onClick={() => refreshBalance()}
          color='textSecondary'
        >
          {balanceLoading
            ? '---'
            : <Satoshis>{accountBalance}</Satoshis>}
        </Typography>
      </div>
      <ProfileEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={refreshProfile}
        name={avatar.name}
        photoURL={avatar.photoURL}
      />
      <Divider
        maxWidth='30px'
      />
    </>
  )
}

export default Profile
