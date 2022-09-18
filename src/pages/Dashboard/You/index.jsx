import React, { useState, useEffect, useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ProfileEditor from '../../../components/ProfileEditor/index.jsx'
import Satoshis from '../../../components/Satoshis.jsx'
import { Img } from 'uhrp-react'
import bridgeportResolvers from '../../../utils/bridgeportResolvers'
import { makeStyles } from '@mui/styles'
import { Stack, Tabs, Tab, Button, Tooltip, Typography, Fab, Divider, CircularProgress } from '@mui/material'
import { Edit } from '@mui/icons-material'
import About from '../Settings/About/index.jsx'
import Logout from '../Settings/Logout/index.jsx'
import UIContext from '../../../UIContext'

const useStyles = makeStyles(theme => ({
  tabs: {
    marginBottom: '2em'
  },
  content_wrap: {
    position: 'sticky',
    top: '0px',
    backgroundColor: theme.palette.grey[200],
    zIndex: 3,
    display: 'grid',
    placeItems: 'center',
    paddingBottom: theme.spacing(2)
  },
  profile_icon: {
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[8],
    minWidth: '10em',
    minHeight: '10em',
    maxWidth: '10em',
    maxHeight: '10em'
    // [theme.breakpoints.up('xl')]: {
    //   minWidth: '16em',
    //   minHeight: '16em',
    //   maxWidth: '16em',
    //   maxHeight: '16em'
    // }
  },
  profile_loading: {
    minWidth: '10em',
    minHeight: '10em',
    maxWidth: '10em',
    maxHeight: '10em'
    // [theme.breakpoints.up('xl')]: {
    //   minWidth: '16em',
    //   minHeight: '16em',
    //   maxWidth: '16em',
    //   maxHeight: '16em'
    // }
  },
  image_edit: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(1),
    position: 'relative'
  },
  edit: {
    position: 'absolute',
    right: '-1em',
    top: '-1em'
  }
}), { name: 'You' })

const You = ({ history }) => {
  const [avatar, setAvatar] = useState({})
  const [editorOpen, setEditorOpen] = useState(false)
  const [accountBalance, setAccountBalance] = useState(null)

  const refreshProfile = async () => {
    setAvatar(await window.CWI.ninja.getAvatar())
  }

  const refreshBalance = async () => {
    try {
      const result = await window.CWI.ninja.getTotalValue()
      setAccountBalance(result.total)
    } catch (e) { /* ignore */ } // If the balance cannot be refreshed, it is probably because the user's internet has dropped. We don't want this error to be thrown, because it will just clutter up Bugsnag.
  }

  const [tabValue, setTabValue] = useState(3)

  useEffect(() => {
    (async () => {
      try {
        await window.CWI.waitForAuthentication()
        refreshBalance()
        setAvatar(await window.CWI.ninja.getAvatar())
      } catch (e) { }
    })()
  }, [])

  useEffect(() => {
    const interval = setInterval(refreshBalance, 30000)
    return () => clearInterval(interval)
  }, [])

  const classes = useStyles()

  const handleOnClose = async () => {
    const { onFocusRelinquished } = useContext(UIContext)
    await onFocusRelinquished()
  }
  const { useBreakpoint } = useContext(UIContext)
  const breakpoints = useBreakpoint()
  const displayClassName = breakpoints.sm || breakpoints.xs ? 'show_div' : 'hide_div'
  // console.log('actions:displayClassName:', displayClassName)

  return (
    <div className={classes.fixed_nav}>
      <div className={classes[displayClassName]}>
        <Stack direction='row' justifyContent='end'>
          <Tooltip placement='left' title='Close'>
            <IconButton onClick={handleOnClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Tabs
          className={classes.tabs}
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='Actions' />
          <Tab label='Apps' />
          <Tab label='Feedback' />
          <Tab label='You' />
        </Tabs>
      </div>
      <div className={classes.content_wrap}>
        <div className={classes.image_edit}>
          <Img
            className={classes.profile_icon}
            src={avatar.photoURL || 'uhrp:XUUDw85K5U6ccmjGjtirk1wZnsruBXayzuLeqz4woTQK1LfhvuY6'}
            alt=''
            loading={<CircularProgress className={classes.profile_loading} />}
            bridgeportResolvers={bridgeportResolvers()}
          />
          <Fab
            size='small'
            onClick={() => setEditorOpen(true)}
            className={classes.edit}
          >
            <Edit color='primary' />
          </Fab>
          <Tooltip title='Show your settings'>
            <Fab
              align='center'
              color='textSecondary'
              onClick={() => history.push('/dashboard/settings')}
              variant='extended'
            >
              <Button className={classes.button_text}>
                <center>
                  Settings
                </center>
              </Button>
            </Fab>
          </Tooltip>
        </div>
        <Typography variant='h3'>
          {avatar.name || 'Welcome Bob!'}
        </Typography>
        <Typography onClick={() => refreshBalance()} color='textSecondary'>
          <Satoshis>{accountBalance}</Satoshis>
        </Typography>
        <Divider />
      </div>
      <ProfileEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={refreshProfile}
        name={avatar.name}
        photoURL={avatar.photoURL}
      />
      <About />
      <Divider />
      <br />
      <Logout history={history} />
      {tabValue === 0 && (
        history.push('/dashboard/actions')
      )}
      {tabValue === 1 && (
        history.push('/dashboard/browse-apps')
      )}
      {tabValue === 2 && (
        history.push('/dashboard/feedback')
      )}
    </div>
  )
}

export default You
