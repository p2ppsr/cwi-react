import React, { useState, useEffect } from 'react'
import {
  submitPhoneNumber,
  submitCode,
  submitRecoveryKey,
  changePassword,
  createSnapshot,
  bindCallback,
  unbindCallback,
  setAuthenticationMode
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
  SettingsPhone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  PermPhoneMsg as SMSIcon,
  Lock as LockIcon,
  VpnKey as KeyIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const useStyles = makeStyles(style, { name: 'Home' })

const RecoveryLostPassword = ({ history, mainPage, routes }) => {
  const classes = useStyles()
  const [accordianView, setAccordianView] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [recoveryKey, setRecoveryKey] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Ensure the correct authentication mode
  useEffect(() => {
    setAuthenticationMode('phone-number-and-recovery-key')
  }, [])

  useEffect(() => {
    const callbackID = bindCallback('onAuthenticationSuccess', async () => {
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      setAccordianView('new-password')
    })
    return () => unbindCallback('onAuthenticationSuccess', callbackID)
  }, [])

  const handleSubmitPhone = async e => {
    e.preventDefault()
    const success = await submitPhoneNumber(phone)
    if (success === true) {
      setAccordianView('code')
    }
  }

  const handleSubmitCode = async e => {
    e.preventDefault()
    const success = await submitCode(code)
    if (success === true) {
      setAccordianView('recovery-key')
    }
  }

  const handleSubmitRecoveryKey = e => {
    e.preventDefault()
    submitRecoveryKey(recoveryKey)
  }

  const handleSubmitPassword = async e => {
    e.preventDefault()
    const result = await changePassword(password, confirmPassword)
    if (result === true) {
      history.push(sessionStorage.CWIRedirectPath || mainPage)
    }
  }

  return (
    <div className={classes.content_wrap}>
      <Accordion
        expanded={accordianView === 'phone'}
      >
        <AccordionSummary
          className={classes.panel_header}
        >
          <PhoneIcon className={classes.expansion_icon} />
          <Typography
            className={classes.panel_heading}
          >
              Phone Number
          </Typography>
          {(accordianView === 'code' || accordianView === 'password') && (
            <CheckCircleIcon className={classes.complete_icon} />
          )}
        </AccordionSummary>
        <form onSubmit={handleSubmitPhone}>
          <AccordionDetails
            className={classes.expansion_body}
          >
            <TextField
              onChange={e => setPhone(e.target.value)}
              label='Phone'
              fullWidth
            />
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant='contained'
              color='primary'
              type='submit'
            >
                Send Code
            </Button>
          </AccordionActions>
        </form>
      </Accordion>
      <Accordion
        expanded={accordianView === 'code'}
      >
        <AccordionSummary
          className={classes.panel_header}
        >
          <SMSIcon className={classes.expansion_icon} />
          <Typography
            className={classes.panel_heading}
          >
              Get a Code
          </Typography>
          {accordianView === 'password' && (
            <CheckCircleIcon className={classes.complete_icon} />
          )}
        </AccordionSummary>
        <form onSubmit={handleSubmitCode}>
          <AccordionDetails
            className={classes.expansion_body}
          >
            <TextField
              onChange={e => setCode(e.target.value)}
              label='Code'
              fullWidth
            />
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant='contained'
              color='primary'
              type='submit'
            >
                Next
            </Button>
          </AccordionActions>
        </form>
      </Accordion>
      <Accordion
        expanded={accordianView === 'recovery-key'}
      >
        <AccordionSummary
          className={classes.panel_header}
        >
          <KeyIcon className={classes.expansion_icon} />
          <Typography
            className={classes.panel_heading}
          >
              Recovery Key
          </Typography>
          {(accordianView === 'password') && (
            <CheckCircleIcon className={classes.complete_icon} />
          )}
        </AccordionSummary>
        <form onSubmit={handleSubmitRecoveryKey}>
          <AccordionDetails
            className={classes.expansion_body}
          >
            <TextField
              onChange={e => setRecoveryKey(e.target.value)}
              label='Recovery Key'
              fullWidth
            />
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant='contained'
              color='primary'
              type='submit'
            >
              Continue
            </Button>
          </AccordionActions>
        </form>
      </Accordion>
      <Accordion
        expanded={accordianView === 'new-password'}
      >
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
      <Link to={routes.Recovery}>
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

const stateToProps = state => ({
  mainPage: state.mainPage,
  routes: state.routes
})

export default connect(stateToProps)(RecoveryLostPassword)
