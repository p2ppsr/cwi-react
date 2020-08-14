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

const useStyles = makeStyles(style, {
  name: 'Change'
})

export default ({ history }) => {
  const classes = useStyles()

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push('/')
    }
  }, [history])

  return (
    <div className={classes.content_wrap}>
      <List>
        <Link to='/change/phone'>
          <ListItem button>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText>
              Change Phone Number
            </ListItemText>
          </ListItem>
        </Link>
        <Link to='/change/password'>
          <ListItem button>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText>
              Change Password
            </ListItemText>
          </ListItem>
        </Link>
        <Link to='/change/recovery-key'>
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
      <Link to='/convos'>
        <Button className={classes.back_button}>Go Back</Button>
      </Link>
    </div>
  )
}
