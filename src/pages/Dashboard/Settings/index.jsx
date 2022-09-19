import React from 'react'
import { useBreakpoint } from '../../../utils/useBreakpoints.js'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton, Tooltip, Stack, Typography, Divider } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import PasswordSettings from './Password/index.jsx'
import PhoneSettings from './Phone/index.jsx'
import RecoveryKeySettings from './RecoveryKey/index.jsx'
import About from './About/index.jsx'
import Logout from './Logout/index.jsx'

const useStyles = makeStyles(style, {
  name: 'Settings'
})

const Settings = ({ history }) => {
  const classes = useStyles()
  const breakpoints = useBreakpoint()

  return (
    <>
      <div className={classes.fixed_nav}>
        {(!breakpoints.sm && !breakpoints.xs) &&
        <Typography variant='h1'>Settings</Typography>
        }
      </div>
        <PasswordSettings history={history} />
        <Divider />
        <br />
        <PhoneSettings />
        <Divider />
        <br />
        <RecoveryKeySettings />
        <Divider />
        <br />
        <About />
        <Divider />
        <br />
        <Logout history={history} />
    </>
  )
}

export default Settings
