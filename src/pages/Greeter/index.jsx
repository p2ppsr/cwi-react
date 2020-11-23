import React, { useState, useEffect } from 'react'
import {
  submitPhoneNumber,
  submitCode,
  submitPassword,
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
  TextField,
  Divider
} from '@material-ui/core'
import {
  SettingsPhone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  PermPhoneMsg as SMSIcon,
  Lock as LockIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import CWILogo from '@cwi/logo-react'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, { name: 'Greeter' })

const Greeter = ({ history, mainPage, appLogo, appName, routes }) => {
  const classes = useStyles()
  const [accordianView, setAccordianView] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accountStatus, setAccountStatus] = useState(undefined)
  const [loading, setLoading] = useState(false)

  // Ensure the correct authentication mode
  useEffect(() => {
    setAuthenticationMode('phone-number-and-password')
  }, [])

  // Populate the account status when it is discovered
  useEffect(() => {
    const callbackID = bindCallback(
      'onAccountStatusDiscovered',
      setAccountStatus
    )
    return () => unbindCallback('onAccountStatusDiscovered', callbackID)
  }, [])

  // Navigate to the dashboard when the user logs in
  useEffect(() => {
    const callbackID = bindCallback('onAuthenticationSuccess', async () => {
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      history.push(sessionStorage.CWIRedirectPath || mainPage)
    })
    return () => unbindCallback('onAuthenticationSuccess', callbackID)
  }, [history, mainPage])

  const handleSubmitPhone = async e => {
    e.preventDefault()
    setLoading(true)
    const success = await submitPhoneNumber(phone)
    setLoading(false)
    if (success === true) {
      setAccordianView('code')
    }
  }

  const handleSubmitCode = async e => {
    e.preventDefault()
    setLoading(true)
    const success = await submitCode(code)
    setLoading(false)
    if (success === true) {
      setAccordianView('password')
    }
  }

  const handleSubmitPassword = async e => {
    e.preventDefault()
    setLoading(true)
    if (accountStatus === 'new-user') {
      try {
        await submitPassword(password, confirmPassword)
      } catch (e) {
        console.error(e)
        toast.error(e.message)
      }
    } else if (accountStatus === 'existing-user') {
      await submitPassword(password)
    }
    setLoading(false)
  }

  return (
    <div className={classes.content_wrap}>
      <center>
        {typeof appLogo === 'string' && (
          <img
            className={classes.logo}
            src={appLogo}
            alt='Logo'
          />
        )}
        {typeof appLogo === 'object' && appLogo}
        {typeof appLogo === 'undefined' && (
          <CWILogo
            className={classes.logo}
          />
        )}
        <Typography variant='h2' paragraph>
          {appName}
        </Typography>
        <Divider />
      </center>
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
            />
          </AccordionDetails>
          <AccordionActions>
            <Button
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
            <div
              className={
                accountStatus === 'new-user'
                  ? classes.password_grid
                  : undefined
              }
            >
              <TextField
                onChange={e => setPassword(e.target.value)}
                label='Password'
                fullWidth
                type='password'
              />
              {accountStatus === 'new-user' && (
                <TextField
                  onChange={e => setConfirmPassword(e.target.value)}
                  label='Retype Password'
                  fullWidth
                  type='password'
                />
              )}
            </div>
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={loading}
            >
              {accountStatus === 'new-user' ? 'Create Account' : 'Log In'}
            </Button>
          </AccordionActions>
        </form>
      </Accordion>
      {routes.Recovery && (
        <Link to={routes.Recovery}>
          <Button
            color='secondary'
            className={classes.recovery_link}
          >
            Need Help?
          </Button>
        </Link>
      )}
      <Typography
        align='center'
        color='textSecondary'
        className={classes.copyright_text}
      >
        Computing with Integrity is Copyright &copy; 2020 Peer-to-peer Privacy Systems Research, LLC. All rights reserved.
      </Typography>
    </div>
  )
}

const stateToProps = state => ({
  mainPage: state.mainPage,
  appLogo: state.appLogo,
  appName: state.appName,
  routes: state.routes
})

export default connect(stateToProps)(Greeter)
