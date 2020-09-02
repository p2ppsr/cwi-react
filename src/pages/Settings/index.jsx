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
import { isAuthenticated } from '@p2ppsr/cwi-auth'
import { connect } from 'react-redux'

const useStyles = makeStyles(style, {
  name: 'Settings'
})

const Settings = ({ history, routes, mainPage }) => {
  const classes = useStyles()

  useEffect(() => {
    setTimeout(() => {
      if (!isAuthenticated()) {
        history.push(routes.Greeter)
      }
    }, 1000)
  }, [history])

  return (
    <div className={classes.content_wrap}>
      <List>
        <Link to={routes.SettingsPhone}>
          <ListItem button>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText>
              Settings Phone Number
            </ListItemText>
          </ListItem>
        </Link>
        <Link to={routes.SettingsPassword}>
          <ListItem button>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText>
              Settings Password
            </ListItemText>
          </ListItem>
        </Link>
        <Link to={routes.SettingsRecoveryKey}>
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
      {mainPage && (
        <Link to={mainPage}>
          <Button className={classes.back_button}>Go Back</Button>
        </Link>
      )}
    </div>
  )
}

const stateToProps = state => ({
  routes: state.routes,
  mainPage: state.mainPage
})

export default connect(stateToProps)(Settings)
