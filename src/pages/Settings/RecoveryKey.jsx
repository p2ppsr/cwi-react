import React, { useState, useEffect } from 'react'
import {
  Button, Typography, List, ListItem, ListItemText
} from '@material-ui/core'
import {
  changeRecoveryKey,
  getRecoveryKey,
  createSnapshot
} from 'pages/Settings/About/node_modules/@cwi/core'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import redirectIfLoggedOut from '../../utils/redirectIfLoggedOut'

const useStyles = makeStyles(style, {
  name: 'RecoveryKeySettings'
})

const RecoveryKeySettings = ({ history, routes, mainPage }) => {
  const classes = useStyles()
  const [recoveryKey, setRecoveryKey] = useState('')

  useEffect(() => {
    redirectIfLoggedOut(history, routes)
  }, [history])

  const handleViewKey = async () => {
    try {
      setRecoveryKey(
        await getRecoveryKey()
      )
    } catch (e) {}
  }

  const handleChangeKey = async () => {
    setRecoveryKey('')
    const success = await changeRecoveryKey()
    if (success === true) {
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      toast.success('Recovery key changed successfully!')
      history.push(mainPage)
    }
  }

  return (
    <List>
      {recoveryKey && (
        <Typography>
          Your Recovery Key:{'\n'}<b>{recoveryKey}</b>
        </Typography>
      )}
      {!recoveryKey && (
        <ListItem
          button
          onClick={handleViewKey}
        >
          <ListItemText>
            Show Recovery Key
          </ListItemText>
        </ListItem>
      )}
      <ListItem
        button
        onClick={handleChangeKey}
      >
        <ListItemText>
          Change Recovery Key
        </ListItemText>
      </ListItem>
    </List>
  )
}

const stateToProps = state => ({
  mainPage: state.mainPage,
  routes: state.routes
})

export default connect(stateToProps)(RecoveryKeySettings)
