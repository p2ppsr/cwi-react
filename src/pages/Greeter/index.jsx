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
import {
  SettingsPhone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  PermPhoneMsg as SMSIcon,
  Lock as LockIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import CWILogo from '../../images/CWI'

const useStyles = makeStyles(style, { name: 'Home' })

const Greeter = ({ history, mainPage, logoURL, routes }) => {
  const classes = useStyles()
  const [accordianView, setAccordianView] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accountStatus, setAccountStatus] = useState(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Ensure the correct authentication mode
    setAuthenticationMode('phone-number-and-password')

    // Navigate to a dashboard when the user logs in
    bindCallback('onAuthenticationSuccess', async () => {
      // Optionally, you can also save a state snapshot before redirecting
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      history.push(sessionStorage.CWIRedirectPath || mainPage)
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
      await submitPassword(password, confirmPassword)
    } else if (accountStatus === 'existing-user') {
      await submitPassword(password)
    }
    setLoading(false)
  }

  return (
    <div className={classes.content_wrap}>
      <center>
        {logoURL ? (
          <img
            className={classes.logo}
            src={logoURL}
            alt='Logo'
          />
        ) : (
          <CWILogo
            className={classes.logo}
          />
        )}
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
  logoURL: state.logoURL,
  routes: state.routes
})

export default connect(stateToProps)(Greeter)
