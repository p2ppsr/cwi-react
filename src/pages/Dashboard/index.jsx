import React, { useEffect } from 'react'
import { useBreakpoint } from '../../utils/useBreakpoints.js'
import { Switch, Route, useHistory } from 'react-router-dom'
import style from './style'
import { makeStyles } from '@mui/styles'
import {
  Feedback as FeedbackIcon,
  AllInclusive as ActionsIcon,
  Apps as BrowseIcon,
  Settings as SettingsIcon,
  School as SchoolIcon
} from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import Feedback from './Feedback/index.jsx'
import Browse from './Browse/index.jsx'
import Actions from './Actions/index.jsx'
import App from './App/Index.jsx'
import Settings from './Settings/index.jsx'
import redirectIfLoggedOut from '../../utils/redirectIfLoggedOut'
import Profile from '../../components/Profile.jsx'
import TopTabs from '../../components/TopTabs/index.jsx'

const useStyles = makeStyles(style, {
  name: 'Dashboard'
})

const Dashboard = () => {
  const breakpoints = useBreakpoint()
  const classes = useStyles({ breakpoints })
  const history = useHistory()

  useEffect(() => {
    redirectIfLoggedOut(history)
  }, [history])

  return (
    <div className={classes.content_wrap}>
      <div className={classes.list_wrap}>
        <Profile />
        <List>
          <ListItem
            button
            onClick={() => history.push('/dashboard')}
            selected={
              history.location.pathname === '/dashboard'
            }
          >
            <ListItemIcon>
              <ActionsIcon
                color={
                  history.location.pathname === '/dashboard'
                    ? 'secondary'
                    : undefined
                }
              />
            </ListItemIcon>
            <ListItemText>
              Actions
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
          <ListItem
            button
            onClick={() => history.push('/dashboard/browse-apps')}
            selected={
              history.location.pathname === '/dashboard/browse-apps'
            }
          >
            <ListItemIcon>
              <BrowseIcon
                color={
                  history.location.pathname === '/dashboard/browse-apps'
                    ? 'secondary'
                    : undefined
                }
              />
            </ListItemIcon>
            <ListItemText>
              App explorer
            </ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => history.push('/dashboard/feedback')}
            selected={
              history.location.pathname === '/dashboard/feedback'
            }
          >
            <ListItemIcon>
              <FeedbackIcon
                color={
                  history.location.pathname === '/dashboard/feedback'
                    ? 'secondary'
                    : undefined
                }
              />
            </ListItemIcon>
            <ListItemText>
              Help & feedback
            </ListItemText>
          </ListItem>
          <a href='https://projectbabbage.com/docs' target='_blank'>
          <ListItem button>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText>
              Learn MetaNet Tech
            </ListItemText>
            </ListItem>
          </a>
        </List>
        <center className={classes.sig_wrap}>
          <Typography
            variant='caption'
            color='textSecondary'
            className={classes.signature}
            align='center'
          >
            Made with ❤️ for 🌍 by <i>Ty J Everett</i>
          </Typography>
        </center>
      </div>
      <div className={classes.page_container}>
        <TopTabs />
        <Switch>
          <Route
            path='/dashboard/feedback'
            component={Feedback}
            exact
          />
          <Route
            path='/dashboard/browse-apps'
            component={Browse}
            exact
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
            className={classes.full_width}
            default
            component={Actions}
          />
        </Switch>
      </div>
    </div>
  )
}

export default Dashboard
