import React, { useContext, useState, useEffect } from 'react'
import { useBreakpoint } from '../../../utils/useBreakpoints.js'
import {
  Typography, Divider, LinearProgress, FormControlLabel, Checkbox
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { toast } from 'react-toastify'
import style from './style'
import PasswordSettings from './Password/index.jsx'
import PhoneSettings from './Phone/index.jsx'
import RecoveryKeySettings from './RecoveryKey/index.jsx'
import About from './About/index.jsx'
import Logout from './Logout/index.jsx'
import { SettingsContext } from '../../../context/SettingsContext.js'
import KernelConfigurator from '../../../components/KernelConfigurator.jsx'

const useStyles = makeStyles(style, {
  name: 'Settings'
})

const Settings = ({ history }) => {
  const classes = useStyles()
  const breakpoints = useBreakpoint()
  const { settings, updateSettings } = useContext(SettingsContext)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [autoLaunchEnabled, setAutoLaunchEnabled] = useState(false)

  const showAutoLaunch = typeof window.CWI.isAutoLaunchEnabled === 'function'

  useEffect(() => {
    (async () => {
      if (showAutoLaunch) {
        const enabled = await window.CWI.isAutoLaunchEnabled()
        setAutoLaunchEnabled(enabled)
      }
    })()
  }, [])

  const handleAutoLaunchChange = () => {
    setAutoLaunchEnabled(x => {
      window.CWI.setAutoLaunchEnabled(!x)
      return !x
    })
  }

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
          <Typography variant='h1' color='textPrimary' paragraph>Settings</Typography>}
      </div>
      <div>
        {/* TODO: Move the theming settings into it's own component */}
        <Typography variant='body' color='textSecondary'>Select the default color theme</Typography>
        <br />
        <select style={{ margin: '1em 0 2em 0' }} id='theme' value={settings.theme} onChange={handleThemeChange}>
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
      <KernelConfigurator />
      <br />
      <br />
      {showAutoLaunch && <>
        <FormControlLabel
          control={<Checkbox
            checked={autoLaunchEnabled}
            onChange={handleAutoLaunchChange}
                   />}
          label={<span>Auto-launch MetaNet Client when you log in</span>}
        />
        <br />
        <br />
                         </>}
      <Logout history={history} />
    </>
  )
}

export default Settings
