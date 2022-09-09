import React from 'react'
import { Link } from 'react-router-dom'
import style from './style'
import { makeStyles } from '@mui/styles'
import {
  Lock as LockIcon,
  SettingsPhone as PhoneIcon
} from '@mui/icons-material'
import {
  List, ListItem, ListItemIcon, ListItemText, Button
} from '@mui/material'

const useStyles = makeStyles(style, {
  name: 'Recovery'
})

const Recovery = ({ history }) => {
  const classes = useStyles()
  return (
    <div className={classes.content_wrap}>
      <List>
        <ListItem
          button
          onClick={() => history.push('/recovery/lost-phone')}
        >
          <ListItemIcon>
            <PhoneIcon />
          </ListItemIcon>
          <ListItemText>
            Lost Phone
          </ListItemText>
        </ListItem>
        <ListItem
          button
          onClick={() => history.push('/recovery/lost-password')}
        >
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText>
            Lost Password
          </ListItemText>
        </ListItem>
      </List>
      <Button
        className={classes.back_button}
        onClick={() => history.go(-1)}
      >
        Go Back
      </Button>
    </div>
  )
}

export default Recovery
