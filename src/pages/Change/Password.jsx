import React, { useState, useEffect } from 'react'
import {
  changePassword,
  isAuthenticated,
  createSnapshot
} from '@p2ppsr/cwi-auth'
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
import LockIcon from '@material-ui/icons/Lock'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, { name: 'Home' })

const Login = ({ history }) => {
  const classes = useStyles()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    // If we are not authenticated we cannot use this page
    if (!isAuthenticated()) {
      history.push('/')
    }
  }, [history])

  const handleSubmitPassword = async e => {
    e.preventDefault()
    const result = await changePassword(password, confirmPassword)
    if (result === true) {
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      toast.success('Password changed successfully!')
      history.push('/convos')
    }
  }

  return (
    <div className={classes.content_wrap}>
      <Accordion expanded>
        <AccordionSummary
          className={classes.panel_header}
        >
          <LockIcon className={classes.expansion_icon} />
          <Typography
            className={classes.panel_heading}
          >
            New Password
          </Typography>
        </AccordionSummary>
        <form onSubmit={handleSubmitPassword}>
          <AccordionDetails
            className={classes.expansion_body}
          >
            <TextField
              onChange={e => setPassword(e.target.value)}
              label='Password'
              fullWidth
              type='password'
            />
            <TextField
              onChange={e => setConfirmPassword(e.target.value)}
              label='Confirm Password'
              fullWidth
              type='password'
            />
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant='contained'
              color='primary'
              type='submit'
            >
                Finish
            </Button>
          </AccordionActions>
        </form>
      </Accordion>
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

export default Login
