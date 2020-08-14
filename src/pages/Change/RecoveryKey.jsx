import React, { useState, useEffect } from 'react'
// import KeyIcon from '@material-ui/icons/VpnKey'
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

const useStyles = makeStyles(style, {
  name: 'Change'
})

export default ({ history }) => {
  const classes = useStyles()
  const [recoveryKey, setRecoveryKey] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push('/')
    }
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
      history.push('/convos')
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
      <Link to='/convos'>
        <Button
          color='secondary'
          className={classes.back_button}
        >
          Go Back
        </Button>
      </Link>
    </div>
  )
}
