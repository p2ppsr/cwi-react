import React, { useState, useEffect } from 'react'
import { Typography, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import { waitForAuthentication, ninjaWrapper } from '@cwi/core'

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
      try {
        setProfile(await ninjaWrapper({
          func: 'getAvatar',
          params: {}
        }))
      } catch (e) { }
      try {
        setPaymail(await ninjaWrapper({
          func: 'getPaymail',
          params: {}
        }))
      } catch (e) {}
    })()
  }, [])

  const updatePaymail = async newPaymail => {
    await ninjaWrapper({
      func: 'setPaymail',
      params: { paymail: newPaymail }
    })
    setPaymail(await ninjaWrapper({
      func: 'getPaymail',
      params: {}
    }))
  }

  const updateProfile = async ({ name, photoURL }) => {
    await ninjaWrapper({
      func: 'setAvatar',
      params: { name, photoURL }
    })
    setProfile(await ninjaWrapper({
      func: 'getAvatar',
      params: {}
    }))
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
      <div>
        <Typography variant='h2'>
          Update Profile
        </Typography>
        <form onSubmit={handleUpdateProfileSubmit}>
          <TextField
            label='Name'
            onChange={e => setNewName(e.target.value)}
          />
          <TextField
            label='PhotoURL'
            onChange={e => setNewPhotoURL(e.target.value)}
          />
          <Button type='submit'>Submit</Button>
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
          />
          <Button type='submit'>Submit</Button>
        </form>
      </div>
    </div>
  )
}

export default Profile
