import React from 'react'
import { Link } from 'react-router-dom'
import style from './style'
import { makeStyles } from '@material-ui/styles'
import LockIcon from '@material-ui/icons/Lock'
import PhoneIcon from '@material-ui/icons/SettingsPhone'
import {
  List, ListItem, ListItemIcon, ListItemText, Button
} from '@material-ui/core'

const useStyles = makeStyles(style, {
  name: 'Recovery'
})

export default () => {
  const classes = useStyles()
  return (
    <div className={classes.content_wrap}>
      <List>
        <Link to='/recovery/lost-phone'>
          <ListItem button>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText>
              Lost Phone
            </ListItemText>
          </ListItem>
        </Link>
        <Link to='/recovery/lost-password'>
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
      <Link to='/'>
        <Button className={classes.back_button}>Go Back</Button>
      </Link>
    </div>
  )
}
