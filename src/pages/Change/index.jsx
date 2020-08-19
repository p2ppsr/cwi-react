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
  name: 'Change'
})

const Change = ({ history, routes, mainPage }) => {
  const classes = useStyles()

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push(routes.Greeter)
    }
  }, [history])

  return (
    <div className={classes.content_wrap}>
      <List>
        <Link to={routes.ChangePhone}>
          <ListItem button>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText>
              Change Phone Number
            </ListItemText>
          </ListItem>
        </Link>
        <Link to={routes.ChangePassword}>
          <ListItem button>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText>
              Change Password
            </ListItemText>
          </ListItem>
        </Link>
        <Link to={routes.ChangeRecoveryKey}>
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

export default connect(stateToProps)(Change)
