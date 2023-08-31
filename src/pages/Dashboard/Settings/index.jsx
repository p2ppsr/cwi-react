import React, { useContext, useState } from 'react'
import { useBreakpoint } from '../../../utils/useBreakpoints.js'
import { Typography, Divider, LinearProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { toast } from 'react-toastify'
import style from './style'
import PasswordSettings from './Password/index.jsx'
import PhoneSettings from './Phone/index.jsx'
import RecoveryKeySettings from './RecoveryKey/index.jsx'
import About from './About/index.jsx'
import Logout from './Logout/index.jsx'
import { SettingsContext } from '../../../context/SettingsContext.js'

const useStyles = makeStyles(style, {
  name: 'Settings'
})

const Settings = ({ history }) => {
  const classes = useStyles()
  const breakpoints = useBreakpoint()
  const { settings, updateSettings } = useContext(SettingsContext)
  const [settingsLoading, setSettingsLoading] = useState(false)

  const handleThemeChange = async (event) => {
    const newTheme = event.target.value

    try {
      setSettingsLoading(true)
      await updateSettings({
        theme: newTheme
      })
      toast.success('Settings saved!', 'center')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSettingsLoading(false)
    }
  }

  return (
    <>
      <div className={classes.fixed_nav}>
        {(!breakpoints.sm && !breakpoints.xs) &&
          <Typography variant='h1'>Settings</Typography>}
        <select id='theme' value={settings.theme} onChange={handleThemeChange}>
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
        </select>
        {settingsLoading ? <LinearProgress style={{ marginTop: '1em' }} /> : <></>}
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
