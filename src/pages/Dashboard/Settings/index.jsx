import React, { useState } from 'react'
import { Tabs, Tab } from '@material-ui/core'
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
  const [tabValue, setTabValue] = useState(1)

  return (
    <div>
      <div className={classes.fixed_nav}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='Actions' />
          <Tab label='Settings' />
          <Tab label='App explorer' />
          <Tab label='Help feedback' />
        </Tabs>
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
      {tabValue === 1 && (
        history.location.pathname = '/dashboard/settings'
      )}
      {tabValue === 0 && (
        history.push('/dashboard/actions')
      )}
      {tabValue === 2 && (
        history.push('/dashboard/browse-apps')
      )}
      {tabValue === 3 && (
        history.push('/dashboard/feedback')
      )}
    </div>
  )
}

export default Settings
