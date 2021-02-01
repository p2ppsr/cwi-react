import React, { useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
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
  AllInclusive as ActionsIcon,
  AccountBox as ProfileIcon,
  Apps as BrowseIcon,
  GetApp as InstalledIcon,
  Timeline as UsageIcon
} from '@material-ui/icons'
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  IconButton,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core'
import { connect } from 'react-redux'
import PasswordSettings from './Password/index.jsx'
import PhoneSettings from './Phone/index.jsx'
import RecoveryKeySettings from './RecoveryKey/index.jsx'
import Feedback from './Feedback/index.jsx'
import About from './About/index.jsx'
import Browse from './Browse/index.jsx'
import Installed from './Installed/index.jsx'
import Usage from './Usage/index.jsx'
import Profile from './Profile/index.jsx'
import Support from './Support/index.jsx'
import Transactions from './Actions/index.jsx'
import redirectIfLoggedOut from '../../utils/redirectIfLoggedOut'
import Logo from '@cwi/logo-react'

const useStyles = makeStyles(style, {
  name: 'Settings'
})

const Settings = ({ routes, mainPage, appName }) => {
  const classes = useStyles({
    settingsMainPage: window.location.pathname === routes.CWISettings
  })
  const history = useHistory()

  useEffect(() => {
    redirectIfLoggedOut(history, routes)
  }, [history])

  return (
    <>
      <AppBar color='primary' position='sticky'>
        <Toolbar className={classes.tool_grid}>
          <IconButton
            onClick={() => history.push(routes.CWISettings)}
          >
            <ArrowBackIcon className={classes.back_tool_icon} />
          </IconButton>
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
                history.location.pathname === `${routes.CWISettings}/browse-apps`
              }
            >
              <ListItemIcon>
                <BrowseIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/browse-apps`
                      ? 'primary'
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText>
                Browse CWI Apps
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/installed-apps`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/installed-apps`
              }
            >
              <ListItemIcon>
                <InstalledIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/installed-apps`
                      ? 'primary'
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText>
                Installed CWI Apps
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/app-usage`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/app-usage`
              }
            >
              <ListItemIcon>
                <UsageIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/app-usage`
                      ? 'primary'
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText>
                CWI App Usage
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/profile`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/profile`
              }
            >
              <ListItemIcon>
                <ProfileIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/profile`
                      ? 'primary'
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText>
                Profile
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/actions`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/actions`
              }
            >
              <ListItemIcon>
                <ActionsIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/actions`
                      ? 'primary'
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText>
                Actions
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List subheader={<ListSubheader>Manage Keys</ListSubheader>}>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/phone`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/phone`
              }
            >
              <ListItemIcon>
                <PhoneIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/phone`
                      ? 'primary'
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText>
              Phone Number
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/password`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/password`
              }
            >
              <ListItemIcon>
                <LockIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/password`
                      ? 'primary'
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText>
              Password
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/recovery-key`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/recovery-key`
              }
            >
              <ListItemIcon>
                <KeyIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/recovery-key`
                      ? 'primary'
                      : undefined
                  }
                />
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
              onClick={() => history.push(`${routes.CWISettings}/about`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/about`
              }
            >
              <ListItemIcon>
                <AboutIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/about`
                      ? 'primary'
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText>
                About CWI
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/support`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/support`
              }
            >
              <ListItemIcon>
                <SupportIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/support`
                      ? 'primary'
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText>
                Ask a Question
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => history.push(`${routes.CWISettings}/feedback`)}
              selected={
                history.location.pathname === `${routes.CWISettings}/feedback`
              }
            >
              <ListItemIcon>
                <FeedbackIcon
                  color={
                    history.location.pathname === `${routes.CWISettings}/feedback`
                      ? 'primary'
                      : undefined
                  }
                />
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
          <Route
            path={`${routes.CWISettings}/feedback`}
            component={Feedback}
            exact
          />
          <Route
            path={`${routes.CWISettings}/about`}
            component={About}
            exact
          />
          <Route
            path={`${routes.CWISettings}/support`}
            component={Support}
            exact
          />
          <Route
            path={`${routes.CWISettings}/browse-apps`}
            component={Browse}
            exact
          />
          <Route
            path={`${routes.CWISettings}/installed-apps`}
            component={Installed}
            exact
          />
          <Route
            path={`${routes.CWISettings}/app-usage`}
            component={Usage}
            exact
          />
          <Route
            path={`${routes.CWISettings}/actions`}
            component={Transactions}
            exact
          />
          <Route
            path={`${routes.CWISettings}/profile`}
            component={Profile}
            exact
          />
          <Route
            default
            component={() => (
              <center>
                <Logo rotate size={96} />
                <Typography variant='h5'>
                  Select a Category
                </Typography>
                <Typography
                  color='textSecondary'
                >
                  Use the menu on the left to select a category.
                </Typography>
              </center>
            )}
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
