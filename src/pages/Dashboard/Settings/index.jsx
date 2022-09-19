import React, { useContext } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton, Tooltip, Stack, Typography, Divider } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import PasswordSettings from './Password/index.jsx'
import PhoneSettings from './Phone/index.jsx'
import RecoveryKeySettings from './RecoveryKey/index.jsx'
import About from './About/index.jsx'
import Logout from './Logout/index.jsx'
import UIContext from '../../../UIContext'

const useStyles = makeStyles(style, {
  name: 'Settings'
})

const Settings = ({ history }) => {
  console.log('history:', history)
  const classes = useStyles()
  // const [tabValue, setTabValue] = useState(1)

  const handleOnClose = async () => {
    history.push('/dashboard/you')
  }
  const { useBreakpoint } = useContext(UIContext)
  const breakpoints = useBreakpoint()
  const displayClassName = breakpoints.sm || breakpoints.xs ? 'show_div' : 'hide_div'

  return (
    <>
      <div className={classes.fixed_nav}>
        <div className={classes[displayClassName]}>
          <Stack direction='row' justifyContent='end'>
            <Tooltip placement='left' title='Return to YOU tab'>
              <IconButton onClick={handleOnClose}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
        <Typography variant='h1'>Settings</Typography>
        <br />
        <Divider />
        <br />
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
    </>
  )
}

export default Settings
