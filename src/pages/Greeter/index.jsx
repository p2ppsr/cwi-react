import React, { useContext, useState, useEffect } from 'react'
import style from './style'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Divider
} from '@mui/material'
import {
  SettingsPhone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  PermPhoneMsg as SMSIcon,
  Lock as LockIcon
} from '@mui/icons-material'
import PhoneEntry from '../../components/PhoneEntry.jsx'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'
import CWILogo from '../../components/Logo.jsx'
import { toast } from 'react-toastify'
import UIContext from '../../UIContext'

const useStyles = makeStyles(style, { name: 'Greeter' })

const Greeter = ({ history }) => {
  const { appVersion, appName, saveLocalSnapshot } = useContext(UIContext)
  const classes = useStyles()
  const [accordionView, setAccordionView] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accountStatus, setAccountStatus] = useState(undefined)
  const [loading, setLoading] = useState(false)
  // const [electronVersion, setElectronVersion] = useState('0.0.0')

  // Navigate to the dashboard if the user is already authenticated
  useEffect(() => {
    (async () => {
      if (await window.CWI.isAuthenticated()) {
        if (typeof window.CWI.getNinja === 'function') {
          window.CWI.ninja = window.CWI.getNinja()
        }
        history.push('/dashboard')
      }
    })()
  }, [history])

  // Ensure the correct authentication mode
  useEffect(() => {
    window.CWI.setAuthenticationMode('phone-number-and-password')
  }, [])

  // Populate the account status when it is discovered
  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback(
        'onAccountStatusDiscovered',
        setAccountStatus
      )
    })()
    return () => {
      if (id) {
        window.CWI.unbindCallback('onAccountStatusDiscovered', id)
      }
    }
  }, [])

  const handleSubmitPhone = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      const success = await window.CWI.submitPhoneNumber(phone)
      if (success === true) {
        setAccordionView('code')
        toast.success('A code has been sent to your phone.')
      }
    } catch (e) {
      console.error(e)
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitCode = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      const success = await window.CWI.submitCode(code)
      if (success === true) {
        setAccordionView('password')
      }
    } catch (e) {
      console.error(e)
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }
  const handleResendCode = async () => {
    try {
      setLoading(true)
      await window.CWI.submitPhoneNumber(phone)
      toast.success('A new code has been sent to your phone.')
    } catch (e) {
      console.error(e)
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPassword = async e => {
    e.preventDefault()
    setLoading(true)
    if (accountStatus === 'new-user') {
      try {
        const result = await window.CWI.submitPassword(
          password,
          confirmPassword
        )
        if (result === true) {
          await saveLocalSnapshot()
          if (typeof window.CWI.getNinja === 'function') {
            window.CWI.ninja = window.CWI.getNinja()
          }
          history.push('/welcome')
        }
      } catch (e) {
        console.error(e)
        toast.error(e.message)
      }
    } else if (accountStatus === 'existing-user') {
      try {
        const result = await window.CWI.submitPassword(password)
        if (result === true) {
          await saveLocalSnapshot()
          if (typeof window.CWI.getNinja === 'function') {
            window.CWI.ninja = window.CWI.getNinja()
          }
          history.push('/dashboard')
        }
      } catch (e) {
        console.error(e)
        toast.error(e.message)
      }
    } else {
      throw new Error(
        `Unknown account status when submitting a password: ${accountStatus}`
      )
    }
    setLoading(false)
  }

  return (
    <div className={classes.max_width}>
      <div className={classes.content_wrap}>
        <center>
          <CWILogo
            className={classes.logo}
            rotate
          />
          <Typography variant='h2' paragraph>
            {appName}
          </Typography>
          <Divider />
        </center>
        <Accordion
          expanded={accordionView === 'phone'}
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
            {(accordionView === 'code' || accordionView === 'password') && (
              <CheckCircleIcon className={classes.complete_icon} />
            )}
          </AccordionSummary>
          <form onSubmit={handleSubmitPhone}>
            <AccordionDetails
              className={classes.expansion_body}
            >
              <PhoneEntry
                value={phone}
                onChange={setPhone}
                placeholder='Enter phone number'
              />
            </AccordionDetails>
            <AccordionActions>
              <Button
                color='primary'
                type='submit'
                disabled={loading}
              >
                {!loading ? 'Send Code' : <CircularProgress />}
              </Button>
            </AccordionActions>
          </form>
        </Accordion>
        <Accordion
          expanded={accordionView === 'code'}
        >
          <AccordionSummary
            className={classes.panel_header}
          >
            <SMSIcon className={classes.expansion_icon} />
            <Typography
              className={classes.panel_heading}
            >
              Enter code
            </Typography>
            {accordionView === 'password' && (
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
                color="secondary"
                onClick={handleResendCode}
                disabled={loading}
                align='left'
              >
                Resend Code
              </Button>
            </AccordionActions>
            <AccordionActions>
              <Button
                color='primary'
                onClick={() => setAccordionView('phone')}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                color='primary'
                type='submit'
                disabled={loading}
              >
                {!loading ? 'Next' : <CircularProgress />}
              </Button>
            </AccordionActions>
          </form>
        </Accordion>
        <Accordion
          expanded={accordionView === 'password'}
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
                    ? classes.new_password_grid
                    : classes.password_grid
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
                color='primary'
                onClick={() => setAccordionView('phone')}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                disabled={loading}
              >
                {!loading
                  ? (accountStatus === 'new-user'
                    ? 'Create Account'
                    : 'Log In'
                  )
                  : <CircularProgress />}
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
          <b>{appName} version {appVersion}</b>
        </Typography>
        <Typography
          align='center'
          color='textSecondary'
          className={classes.copyright_text}
        >
          Copyright &copy; 2020-2022 Peer-to-peer Privacy Systems Research, LLC. All rights reserved. Redistribution of this software is strictly prohibited. Use of this software is subject to the{' '}
          <a href='https://projectbabbage.com/desktop/license' target='_blank' rel='noopener noreferrer'>Babbage Software License Agreement</a>.
        </Typography>
      </div>
    </div>
  )
}

export default Greeter
