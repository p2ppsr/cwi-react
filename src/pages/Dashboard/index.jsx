import React, { useState, useRef, useEffect, useContext } from 'react'
import { useTheme } from '@emotion/react'
import { useBreakpoint } from '../../utils/useBreakpoints.js'
// Change suggested by ChatGPT 3.5
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Switch, Route, useHistory } from 'react-router-dom'
import style from './style'
import { makeStyles } from '@mui/styles'
import {
  VolunteerActivism as TrustIcon,
  Timeline as TrendsIcon,
  Apps as BrowseIcon,
  Settings as SettingsIcon,
  School as SchoolIcon,
  LockPerson as AccessIcon,
  Menu as MenuIcon
} from '@mui/icons-material'
import CircleIcon from '@mui/icons-material/Circle'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
  , IconButton, Drawer, Toolbar
} from '@mui/material'
import AppAccess from './AppAccess/index.jsx'
import Trust from './Trust/index.jsx'
import Apps from './Apps'
import App from './App/Index.jsx'
import Settings from './Settings/index.jsx'
import redirectIfLoggedOut from '../../utils/redirectIfLoggedOut'
import Profile from '../../components/Profile.jsx'
import BasketAccess from './BasketAccess'
import UIContext from '../../UIContext'
import PageLoading from '../../components/PageLoading'
import ProtocolAccess from './ProtocolAccess/index.jsx'

const useStyles = makeStyles(style, {
  name: 'Dashboard'
})

/**
 * Renders the Apps page and menu by default
 */
const Dashboard = (trendsDisabled = true, accessDisabled = true) => {
  const breakpoints = useBreakpoint()
  const classes = useStyles({ breakpoints })
  const theme = useTheme()
  const history = useHistory()
  const { appName, appVersion } = useContext(UIContext)
  const [hasCerts, setHasCerts] = useState(false)
  const [registerIdReminder, setRegisterIdReminder] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [menuOpen, setMenuOpen] = useState(true)
  const menuRef = useRef(null)

  // Helper functions
  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen)
  }
  const getMargin = () => {
    if (menuOpen && !breakpoints.sm) {
      return '16em'
    }
    return '0em'
  }

  // History.push wrapper
  const navigation = {
    push: (path) => {
      if (breakpoints.sm) {
        setMenuOpen(false)
      }
      history.push(path)
    }
  }

  // First useEffect to handle breakpoint changes
  useEffect(() => {
    if (!breakpoints.sm) {
      setMenuOpen(true)
    } else {
      setMenuOpen(false)
    }
    console.log('breakpoint')
  }, [breakpoints])

  // Second useEffect to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  useEffect(async () => {
    if (localStorage.getItem('hasVisitedTrust') === 'true') {
      const certs = await window.CWI.ninja.findCertificates()
      if (typeof certs === 'undefined') {
        console.error('ERROR:window.CWI.ninja.findCertificates() are undefined')
      } else {
        setHasCerts(certs.certificates.length > 0)
      }
    } else {
      localStorage.setItem('showDialog', 'true')
    }
    setRegisterIdReminder(localStorage.getItem('hasVisitedTrust') === 'true' && !hasCerts)
    const isLoggedIn = redirectIfLoggedOut(history)
    if (isLoggedIn) {
      setPageLoading(false)
    }
  }, [history])

  if (pageLoading) {
    return <PageLoading />
  }

  const trendsColor = trendsDisabled ? 'gray' : 'primary'
  const accessColor = accessDisabled ? 'gray' : 'primary'
  console.log('coming soon, trendsColor=', trendsColor)
  console.log('coming soon, accessColor=', accessColor)
  return (
    <div className={classes.content_wrap} style={{ marginLeft: getMargin() }}>
      <div style={{ marginLeft: 0, width: menuOpen ? 'calc(100vw - 16em)' : '100vw', transition: 'margin .3s' }}>
        {breakpoints.sm &&
          <div style={{ padding: '0.5em 0 0 0.5em' }} ref={menuRef}>
            <Toolbar>
              <IconButton edge='start' onClick={handleDrawerToggle} aria-label='menu'>
                <MenuIcon style={{ color: 'textPrimary', height: '1.25em', width: '1.25em' }} />
              </IconButton>
            </Toolbar>
          </div>}
      </div>
      <Drawer anchor='left' open={menuOpen} variant='persistent' onClose={handleDrawerToggle}>
        <div className={classes.list_wrap}>
          <Profile />
          <List>
            <ListItem
              button
              onClick={() => navigation.push('/dashboard/apps')}
              selected={
              history.location.pathname === '/dashboard/apps'
            }
            >
              <ListItemIcon>
                <BrowseIcon
                  color={
                  history.location.pathname === '/dashboard/apps'
                    ? 'secondary'
                    : undefined
                }
                />
              </ListItemIcon>
              <ListItemText>
                Apps
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => !trendsDisabled && navigation.push('/dashboard/trends')}
              selected={
                !trendsDisabled && history.location.pathname === '/dashboard/trends'
              }
            >
                <ListItemIcon>
                <TrendsIcon
                  color={
                  history.location.pathname === '/dashboard/trends'
                    ? 'secondary'
                    : undefined
                }
                />
              </ListItemIcon>
              <ListItemText
                backgroundColor={trendsColor}
                color={trendsColor}>
                Trends
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() =>
                !accessDisabled && navigation.push('/dashboard/access')}
              selected={
                accessDisabled && history.location.pathname === '/dashboard/access'
              }
            >
              <ListItemIcon>
                <AccessIcon
                  color={
                  history.location.pathname === '/dashboard/access'
                    ? 'secondary'
                    : undefined
                }
                />
              </ListItemIcon>
              <ListItemText
                backgroundColor={trendsColor}
                color={trendsColor}>
                Access
              </ListItemText>
            </ListItem>
            <ListItemButton
              onClick={() => {
                navigation.push({
                  pathname: '/dashboard/trust',
                  state: {
                    registerIdReminder,
                    setRegisterIdReminder
                  }
                })
              }}
              selected={history.location.pathname === '/dashboard/trust'}
            >
              <ListItemIcon>
                <TrustIcon
                  color={
                  history.location.pathname === '/dashboard/trust'
                    ? 'secondary'
                    : undefined
                }
                />
                {registerIdReminder === true &&
                  <CircleIcon
                      style={{ marginLeft: '0.7em', width: '12px', color: 'red' }}
                    />}
              </ListItemIcon>
              <ListItemText>
                Trust
              </ListItemText>
            </ListItemButton>
            <ListItem
              button
              onClick={() => navigation.push('/dashboard/settings')}
              selected={
              history.location.pathname === '/dashboard/settings'
            }
            >
              <ListItemIcon>
                <SettingsIcon
                  color={
                  history.location.pathname === '/dashboard/settings'
                    ? 'secondary'
                    : undefined
                }
                />
              </ListItemIcon>
              <ListItemText>
                Settings
              </ListItemText>
            </ListItem>

            <ListItemButton
              onClick={() => {
                window.open('https://projectbabbage.com/docs', '_blank')
              }}
            >
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText style={{ color: theme.palette.primary.secondary }}>
                Learn MetaNet Tech
              </ListItemText>
            </ListItemButton>

          </List>

          <center className={classes.sig_wrap}>
            <Typography
              variant='caption'
              color='textSecondary'
              className={classes.signature}
              align='center'
            >
              {appName} v{appVersion}<br /><br />
              Made with love by<br /><i>the Babbage Team</i>
            </Typography>
          </center>
        </div>
      </Drawer>
      <div className={classes.page_container}>
        <Switch>
          <Route
            path='/dashboard/manage-app/:originator'
            component={AppAccess}
          />
          <Route
            path='/dashboard/app/:app'
            component={App}
          />
          <Route
            path='/dashboard/settings'
            component={Settings}
          />
          <Route
            path='/dashboard/apps'
            component={Apps}
          />
          <Route
            path='/dashboard/trust'
            component={Trust}
          />
          <Route
            path='/dashboard/basket/:basketId'
            component={BasketAccess}
          />
          <Route
            path='/dashboard/protocol/:protocolId'
            component={ProtocolAccess}
          />
          <Route
            className={classes.full_width}
            default
            component={() => {
              return (
                <div style={{ padding: '1em' }}>
                  <Typography align='center' color='textPrimary'>Are you lost?</Typography>
                </div>
              )
            }}
          />
        </Switch>
      </div>
    </div>
  )
}

export default Dashboard
