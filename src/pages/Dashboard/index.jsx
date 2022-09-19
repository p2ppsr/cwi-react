import React, { useEffect } from 'react'
import { useBreakpoint } from '../../utils/useBreakpoints.js'
import { Switch, Route, useHistory } from 'react-router-dom'
import style from './style'
import { makeStyles } from '@mui/styles'
import {
  Feedback as FeedbackIcon,
  AllInclusive as ActionsIcon,
  Apps as BrowseIcon,
  Settings as SettingsIcon
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
import You from './You/index.jsx'

const useStyles = makeStyles(style, {
  name: 'Dashboard'
})

const Dashboard = () => {
  const classes = useStyles()
  const history = useHistory()

  useEffect(() => {
    redirectIfLoggedOut(history)
  }, [history])

  const breakpoints = useBreakpoint()
  const contentWrapDisplay = breakpoints.sm || breakpoints.xs ? 'content_wrap_hide' : 'content_wrap_show'
  const listWrapDisplay = breakpoints.sm || breakpoints.xs ? 'list_wrap_hide' : 'list_wrap_show'

  return (
    <div className={classes[contentWrapDisplay]}>
      <div className={classes[listWrapDisplay]}>
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
                    ? 'primary'
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
                    ? 'primary'
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
                    ? 'primary'
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
                    ? 'primary'
                    : undefined
                }
              />
            </ListItemIcon>
            <ListItemText>
              Help & feedback
            </ListItemText>
          </ListItem>
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
      <div>
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
            path='/dashboard/you'
            component={You}
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
