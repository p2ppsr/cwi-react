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
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, {
  name: 'Welcome'
})

const Welcome = ({ history }) => {
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

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
          className={classes.button}
        >
          Configure
        </Button>
      </center>
    </div>
  )
}

export default Welcome
