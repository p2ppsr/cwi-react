import React, { useState, useEffect } from 'react'
import {
  changePassword,
  createSnapshot
} from '@cwi/core'
import style from './style'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Typography,
  Button,
  TextField
} from '@material-ui/core'
import {
  Lock as LockIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import redirectIfLoggedOut from '../../../utils/redirectIfLoggedOut'

const useStyles = makeStyles(style, { name: 'PasswordSettings' })

const PasswordSettings = ({ history, mainPage, routes }) => {
  const classes = useStyles()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    redirectIfLoggedOut(history, routes)
  }, [history])

  const handleSubmitPassword = async e => {
    e.preventDefault()
    const result = await changePassword(password, confirmPassword)
    if (result === true) {
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      toast.success('Password changed successfully!')
      history.push(mainPage)
    }
  }

  return (
    <Accordion expanded>
      <AccordionSummary>
        <LockIcon />
        <Typography>
          New Password
        </Typography>
      </AccordionSummary>
      <form onSubmit={handleSubmitPassword}>
        <AccordionDetails>
          <div className={classes.password_grid}>
            <TextField
              onChange={e => setPassword(e.target.value)}
              label='Password'
              fullWidth
              type='password'
            />
            <TextField
              onChange={e => setConfirmPassword(e.target.value)}
              label='Retype Password'
              fullWidth
              type='password'
            />
          </div>
        </AccordionDetails>
        <AccordionActions>
          <Button
            color='primary'
            type='submit'
          >
            Next
          </Button>
        </AccordionActions>
      </form>
    </Accordion>
  )
}

const stateToProps = state => ({
  mainPage: state.mainPage,
  routes: state.routes
})

export default connect(stateToProps)(PasswordSettings)
