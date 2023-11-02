import React, { useState, useEffect, useContext } from 'react'
import { useBreakpoint } from '../../utils/useBreakpoints.js'
import { Switch, Route, useHistory } from 'react-router-dom'
import style from './style'
import { makeStyles } from '@mui/styles'
import {
  VolunteerActivism as TrustIcon,
  Timeline as TrendsIcon,
  Apps as BrowseIcon,
  Settings as SettingsIcon,
  School as SchoolIcon,
  LockPerson as AccessIcon
} from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import Feedback from './Feedback/index.jsx'
import Trust from './Trust/index.jsx'
import Actions from './Actions/index.jsx'
import App from './App/Index.jsx'
import Settings from './Settings/index.jsx'
import redirectIfLoggedOut from '../../utils/redirectIfLoggedOut'
import Profile from '../../components/Profile.jsx'
import BasketAccess from './BasketAccess'
import TopTabs from '../../components/TopTabs/index.jsx'
import UIContext from '../../UIContext'
import PageLoading from '../../components/PageLoading'
import { useTheme } from '@emotion/react'

const useStyles = makeStyles(style, {
  name: 'Dashboard'
})

const Dashboard = () => {
  const breakpoints = useBreakpoint()
  const classes = useStyles({ breakpoints })
  const theme = useTheme()
  const history = useHistory()
  const { appName, appVersion } = useContext(UIContext)
  const [pageLoading, setPageLoading] = useState(true)
  console.log(theme.palette)

  useEffect(() => {
    const isLoggedIn = redirectIfLoggedOut(history)
    if (isLoggedIn) {
      setPageLoading(false)
    }
  }, [history])

  if (pageLoading) {
    return <PageLoading />
  }

  return (
    <div className={classes.content_wrap}>
      <div className={classes.list_wrap}>
        <Profile />
        <List>
          <ListItem
            button
            onClick={() => history.push('/dashboard/apps')}
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
            onClick={() => history.push('/dashboard/trends')}
            selected={
              history.location.pathname === '/dashboard/trends'
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
            <ListItemText>
              Trends
            </ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => history.push('/dashboard/access')}
            selected={
              history.location.pathname === '/dashboard/access'
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
            <ListItemText>
              Access
            </ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => history.push('/dashboard/trust')}
            selected={
              history.location.pathname === '/dashboard/trust'
            }
          >
            <ListItemIcon>
              <TrustIcon
                color={
                  history.location.pathname === '/dashboard/trust'
                    ? 'secondary'
                    : undefined
                }
              />
            </ListItemIcon>
            <ListItemText>
              Trust
            </ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => history.push('/dashboard/settings')}
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
      <div className={classes.page_container}>
        <TopTabs />
        <Switch>
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
            component={Actions}
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
            className={classes.full_width}
            default
            component={() => {
              return (
                <div style={{ padding: '1em' }}>
                  <Typography align='center' color='textPrimary'>Select a page</Typography>
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
