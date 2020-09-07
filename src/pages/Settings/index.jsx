import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import style from './style'
import { makeStyles } from '@material-ui/styles'
import {
  SettingsPhone as PhoneIcon,
  Lock as LockIcon,
  VpnKey as KeyIcon
} from '@material-ui/icons'
import {
  List, ListItem, ListItemIcon, ListItemText, Button
} from '@material-ui/core'
import { connect } from 'react-redux'
import redirectIfLoggedOut from '../../utils/redirectIfLoggedOut'

const useStyles = makeStyles(style, {
  name: 'Settings'
})

const Settings = ({ history, routes, mainPage }) => {
  const classes = useStyles()

  useEffect(() => {
    redirectIfLoggedOut(history, routes)
  }, [history])

  return (
    <div className={classes.content_wrap}>
      <List>
        <Link to={routes.PhoneSettings}>
          <ListItem button>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText>
              Settings Phone Number
            </ListItemText>
          </ListItem>
        </Link>
        <Link to={routes.PasswordSettings}>
          <ListItem button>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText>
              Settings Password
            </ListItemText>
          </ListItem>
        </Link>
        <Link to={routes.RecoveryKeySettings}>
          <ListItem button>
            <ListItemIcon>
              <KeyIcon />
            </ListItemIcon>
            <ListItemText>
              View or Manage Recovery Key
            </ListItemText>
          </ListItem>
        </Link>
      </List>
      <Link to={mainPage}>
        <Button className={classes.back_button}>Go Back</Button>
      </Link>
    </div>
  )
}

const stateToProps = state => ({
  routes: state.routes,
  mainPage: state.mainPage
})

export default connect(stateToProps)(Settings)
