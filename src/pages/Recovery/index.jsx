import React from 'react'
import { Link } from 'react-router-dom'
import style from './style'
import { makeStyles } from '@material-ui/styles'
import {
  Lock as LockIcon,
  SettingsPhone as PhoneIcon
} from '@material-ui/icons'
import {
  List, ListItem, ListItemIcon, ListItemText, Button
} from '@material-ui/core'
import { connect } from 'react-redux'

const useStyles = makeStyles(style, {
  name: 'Recovery'
})

const Recovery = ({ routes }) => {
  const classes = useStyles()
  return (
    <div className={classes.content_wrap}>
      <List>
        <Link to={routes.RecoveryLostPhone}>
          <ListItem button>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText>
              Lost Phone
            </ListItemText>
          </ListItem>
        </Link>
        <Link to={routes.RecoveryLostPassword}>
          <ListItem button>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText>
              Lost Password
            </ListItemText>
          </ListItem>
        </Link>
      </List>
      <Link to={routes.Greeter}>
        <Button className={classes.back_button}>Go Back</Button>
      </Link>
    </div>
  )
}

const stateToProps = state => ({
  mainPage: state.mainPage,
  routes: state.routes
})

export default connect(stateToProps)(Recovery)
