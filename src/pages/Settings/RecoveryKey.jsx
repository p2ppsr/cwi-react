import React, { useState, useEffect } from 'react'
import {
  Button, Typography
} from '@material-ui/core'
import {
  changeRecoveryKey,
  getRecoveryKey,
  createSnapshot
} from '@cwi/core'
import { Link } from 'react-router-dom'
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
    <div>
      {recoveryKey ? (
        <Typography align='center'>{recoveryKey}</Typography>
      )
        : (
          <Button
            onClick={handleViewKey}
            className={classes.back_button}
          >
            Show Current Recovery Key
          </Button>
        )}
      <Button
        onClick={handleChangeKey}
        className={classes.back_button}
      >
        Change Recovery Key
      </Button>
    </div>
  )
}

const stateToProps = state => ({
  mainPage: state.mainPage,
  routes: state.routes
})

export default connect(stateToProps)(RecoveryKeySettings)
