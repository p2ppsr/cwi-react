import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import style from './style'
import { makeStyles } from '@material-ui/styles'
import {
  SettingsPhone as PhoneIcon,
  Lock as LockIcon,
  VpnKey as KeyIcon,
  ArrowBack as ArrowBackIcon,
  Feedback as FeedbackIcon,
  Info as AboutIcon,
  Help as SupportIcon,
  AccountBalance as FundIcon,
  Apps as BrowseIcon,
  GetApp as InstalledIcon,
  Timeline as UsageIcon
} from '@material-ui/icons'
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core'
import { connect } from 'react-redux'
import PasswordSettings from './Password.jsx'
import PhoneSettings from './Phone.jsx'
import RecoveryKeySettings from './RecoveryKey.jsx'
import redirectIfLoggedOut from '../../utils/redirectIfLoggedOut'
import Logo from '@cwi/logo-react'

const useStyles = makeStyles(style, {
  name: 'Settings'
})

const Settings = ({ history, routes, mainPage, appName }) => {
  const classes = useStyles()

  useEffect(() => {
    redirectIfLoggedOut(history, routes)
  }, [history])

  return (
    <>
      <AppBar color='primary'>
        <Toolbar className={classes.tool_grid}>
          <Typography variant='h3' className={classes.title}>
            CWI Settings
          </Typography>
          <Logo size={48} color='white' />
        </Toolbar>
      </AppBar>
      <div className={classes.content_wrap}>
        <div>
          <List>
            <ListItem button onClick={() => history.push(mainPage)}>
              <ListItemIcon>
                <ArrowBackIcon />
              </ListItemIcon>
              <ListItemText>
              Back to {appName}
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List subheader={<ListSubheader>Your Account</ListSubheader>}>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/browse-apps`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/browse-apps`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <BrowseIcon />
              </ListItemIcon>
              <ListItemText>
                Browse CWI Apps
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/installed-apps`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/installed-apps`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <InstalledIcon />
              </ListItemIcon>
              <ListItemText>
                Installed CWI Apps
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/app-usage`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/app-usage`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <UsageIcon />
              </ListItemIcon>
              <ListItemText>
                CWI App Usage
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/fund`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/fund`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <FundIcon />
              </ListItemIcon>
              <ListItemText>
              Fund Account
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List subheader={<ListSubheader>Manage Keys</ListSubheader>}>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/phone`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/phone`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText>
              Phone Number
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/password`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/password`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText>
              Password
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/recovery-key`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/recovery-key`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <KeyIcon />
              </ListItemIcon>
              <ListItemText>
              Recovery Key
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List subheader={<ListSubheader>Help & Support</ListSubheader>}>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/support`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/support`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <SupportIcon />
              </ListItemIcon>
              <ListItemText>
              Ask a Question
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/about`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/about`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText>
              About CWI
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/feedback`)}
              selected={
                window.location.pathname === `${routes.CWISettings}/feedback`
                  ? 'primary'
                  : undefined
              }
            >
              <ListItemIcon>
                <FeedbackIcon />
              </ListItemIcon>
              <ListItemText>
              Leave Feedback
              </ListItemText>
            </ListItem>
          </List>
        </div>
        <Switch>
          <Route
            path={`${routes.CWISettings}/password`}
            component={PasswordSettings}
            exact
          />
          <Route
            path={`${routes.CWISettings}/phone`}
            component={PhoneSettings}
            exact
          />
          <Route
            path={`${routes.CWISettings}/recovery-key`}
            component={RecoveryKeySettings}
            exact
          />
        </Switch>
      </div>
    </>
  )
}

const stateToProps = state => ({
  routes: state.routes,
  mainPage: state.mainPage,
  appName: state.appName
})

export default connect(stateToProps)(Settings)
