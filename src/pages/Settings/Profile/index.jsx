import React, { useState, useEffect } from 'react'
import { Typography, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import { waitForAuthentication, ninja } from '@cwi/core'

const useStyles = makeStyles(style, {
  name: 'Profile'
})

const Profile = () => {
  const [profile, setProfile] = useState({})
  const [paymail, setPaymail] = useState('')
  const classes = useStyles()
  const [newName, setNewName] = useState('')
  const [newPhotoURL, setNewPhotoURL] = useState('')
  const [newPaymail, setNewPaymail] = useState('')

  useEffect(() => {
    (async () => {
      await waitForAuthentication()
      setProfile(await ninja.getAvatar())
      setPaymail(await ninja.getPaymail())
    })()
  }, [])

  const updatePaymail = async newPaymail => {
    await ninja.setPaymail({ paymail: newPaymail })
    setPaymail(await ninja.getPaymail())
  }

  const updateProfile = async ({ name, photoURL }) => {
    await ninja.setAvatar({ name, photoURL })
    setProfile(await ninja.getAvatar())
  }

  const handleUpdateProfileSubmit = async e => {
    e.preventDefault()
    await updateProfile({
      name: newName,
      photoURL: newPhotoURL
    })
  }

  const handleUpdatePaymailSubmit = async e => {
    e.preventDefault()
    await updatePaymail(newPaymail)
  }

  return (
    <div className={classes.content_wrap}>
      <center>
        <img
          src={profile.photoURL}
          alt={profile.name}
          poster={profile.name}
          className={classes.profile_avatar}
        />
        <Typography variant='h1'>
          {profile.name}
        </Typography>
        <Typography variant='h3' paragraph>
          {paymail}
        </Typography>
      </center>
      <div className={classes.profile_paymail_grid}>
        <div>
          <Typography variant='h2'>
          Update Profile
          </Typography>
          <form onSubmit={handleUpdateProfileSubmit}>
            <TextField
              label='Name'
              onChange={e => setNewName(e.target.value)}
              fullWidth
            />
            <br />
            <br />
            <TextField
              label='Photo URL (UHRP or HTTPS)'
              onChange={e => setNewPhotoURL(e.target.value)}
              fullWidth
            />
            <br />
            <br />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
            >
            Update Profile
            </Button>
            <br />
            <br />
          </form>
        </div>
        <div>
          <Typography variant='h2'>
          Update Paymail
          </Typography>
          <form onSubmit={handleUpdatePaymailSubmit}>
            <TextField
              label='Name'
              onChange={e => setNewPaymail(e.target.value)}
              fullWidth
            />
            <br />
            <br />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
            >
            Update Paymail
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
