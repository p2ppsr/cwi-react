import React, { useState, useEffect } from 'react'
import {
  Button, Typography
} from '@material-ui/core'
import {
  isAuthenticated,
  changeRecoveryKey,
  getRecoveryKey,
  createSnapshot
} from '@p2ppsr/cwi-auth'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import { toast } from 'react-toastify'
import { connect } from 'react-redux'

const useStyles = makeStyles(style, {
  name: 'RecoveryKeySettings'
})

const RecoveryKeySettings = ({ history, routes, mainPage }) => {
  const classes = useStyles()
  const [recoveryKey, setRecoveryKey] = useState('')

  useEffect(() => {
    setTimeout(() => {
      if (!isAuthenticated()) {
        history.push(routes.Greeter)
      }
    }, 1000)
  }, [history])

  const handleViewKey = async () => {
    setRecoveryKey(
      await getRecoveryKey()
    )
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
    <div className={classes.content_wrap}>
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
      {mainPage && (
        <Link to={mainPage}>
          <Button
            color='secondary'
            className={classes.back_button}
          >
            Go Back
          </Button>
        </Link>
      )}
    </div>
  )
}

const stateToProps = state => ({
  mainPage: state.mainPage,
  routes: state.routes
})

export default connect(stateToProps)(RecoveryKeySettings)
