import React, { useState } from 'react'
// import { Tabs, Tab } from '@material-ui/core'
import { Typography, Divider } from '@mui/material'
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
  console.log('history:', history)
  const classes = useStyles()
  // const [tabValue, setTabValue] = useState(1)

  return (
    <div>
      <div className={classes.fixed_nav}>
        <Typography variant='h1'>Settings</Typography>
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
    </div>
  )
}

export default Settings
