import React, { useState, useEffect } from 'react'
import {
  submitPhoneNumber,
  submitCode,
  submitPassword,
  createSnapshot,
  bindCallback,
  setAuthenticationMode
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
import PhoneIcon from '@material-ui/icons/SettingsPhone'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import SMSIcon from '@material-ui/icons/PermPhoneMsg'
import LockIcon from '@material-ui/icons/Lock'
import QuestionAnswer from '@material-ui/icons/QuestionAnswer'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(style, { name: 'Home' })

const Login = ({ history }) => {
  const classes = useStyles()
  const [accordianView, setAccordianView] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accountStatus, setAccountStatus] = useState(undefined)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Ensure the correct authentication mode
    setAuthenticationMode('phone-number-and-password')

    // Navigate to a dashboard when the user logs in
    bindCallback('onAuthenticationSuccess', async () => {
      setError('')
      // Optionally, you can also save a state snapshot before redirecting
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      history.push(sessionStorage.redirect || '/convos')
    })

    // Populate the account status when it is discovered
    bindCallback('onAccountStatusDiscovered', status => {
      setAccountStatus(status)
    })
  }, [history])

  const handleSubmitPhone = async e => {
    e.preventDefault()
    setLoading(true)
    const success = await submitPhoneNumber(phone)
    setLoading(false)
    if (success === true) {
      setError('')
      setAccordianView('code')
    }
  }

  const handleSubmitCode = async e => {
    e.preventDefault()
    setLoading(true)
    const success = await submitCode(code)
    setLoading(false)
    if (success === true) {
      setError('')
      setAccordianView('password')
    }
  }

  const handleSubmitPassword = async e => {
    e.preventDefault()
    setLoading(true)
    if (accountStatus === 'new-user') {
      await submitPassword(password, confirmPassword)
    } else if (accountStatus === 'existing-user') {
      await submitPassword(password)
    }
    setLoading(false)
  }

  return (
    <div className={classes.content_wrap}>
      <QuestionAnswer className={classes.logo} />
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
              error={!!error}
              helperText={error}
            />
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={loading}
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
              error={!!error}
              helperText={error}
            />
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={loading}
            >
              Next
            </Button>
          </AccordionActions>
        </form>
      </Accordion>
      <Accordion
        expanded={accordianView === 'password'}
      >
        <AccordionSummary
          className={classes.panel_header}
        >
          <LockIcon className={classes.expansion_icon} />
          <Typography
            className={classes.panel_heading}
          >
            Password
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
              error={!!error}
              helperText={error}
            />
            {accountStatus === 'new-user' && (
              <>
                <br />
                <br />
                <TextField
                  onChange={e => setConfirmPassword(e.target.value)}
                  label='Confirm'
                  fullWidth
                  type='password'
                />
              </>
            )}
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={loading}
            >
              Continue
            </Button>
          </AccordionActions>
        </form>
      </Accordion>
      <Link to='/recovery'>
        <Button
          color='secondary'
          className={classes.recovery_link}
        >
          Need Help?
        </Button>
      </Link>
      <Typography
        align='center'
        color='textSecondary'
        className={classes.copyright_text}
      >
        Copyright &copy; 2020 Peer-to-peer Privacy Systems Research, LLC. All rights reserved.
      </Typography>
    </div>
  )
}

export default Login
