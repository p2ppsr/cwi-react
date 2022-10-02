import React, { useState } from 'react'
import {
  Typography,
  TextField,
  InputAdornment,
  Button,
  LinearProgress
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import ProfileEditor from '../../components/ProfileEditor/index.jsx'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, {
  name: 'Welcome'
})

const Welcome = ({ history }) => {
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

  const handleEditorDone = () => {
    setEditorOpen(false)
    history.push('/dashboard')
  }

  return (
    <div className={classes.content_wrap}>
      <center className={classes.content}>
        <Typography
          variant='h1'
          paragraph
        >
          Your portal to the MetaNet — And beyond!
        </Typography>
        <Typography paragraph>
          Let's start by setting up your universal identity.
        </Typography>
        <Button
          color='primary'
          variant='contained'
          size='large'
          onClick={() => setEditorOpen(true)}
          className={classes.button}
        >
          Configure
        </Button>
      </center>
      <ProfileEditor
        welcome
        onClose={handleEditorDone}
        open={editorOpen}
        // A default profile photo is provided
        photoURL='uhrp:XUSw3EKLvt4uWHrMvKSDychPSvnAqVeKCrReidew2C2rUN6Sps3S'
      />
    </div>
  )
}

export default Welcome
