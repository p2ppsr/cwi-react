import React, { useState, useEffect } from 'react'
import {
  submitRecoveryKey,
  submitPassword,
  createSnapshot,
  bindCallback,
  setAuthenticationMode,
  changePhoneNumber
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
  Lock as LockIcon,
  VpnKey as KeyIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(style, { name: 'LostPhoneNumber' })

const LostPhone = ({ history }) => {
  const classes = useStyles()
  const [accordianView, setAccordianView] = useState('recovery-key')
  const [recoveryKey, setRecoveryKey] = useState('')
  const [password, setPassword] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Ensure the correct authentication mode
    setAuthenticationMode('recovery-key-and-password')

    // Navigate to a dashboard when the user logs in
    bindCallback('onAuthenticationSuccess', async () => {
      setError('')
      // Optionally, you can also save a state snapshot before redirecting
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      setAccordianView('new-phone')
    })
  }, [history])

  const handleSubmitRecoveryKey = async e => {
    e.preventDefault()
    const success = await submitRecoveryKey(recoveryKey)
    if (success === true) {
      setError('')
      setAccordianView('password')
    }
  }

  const handleSubmitPassword = e => {
    e.preventDefault()
    submitPassword(password)
  }

  const handleSubmitNewPhone = async e => {
    e.preventDefault()
    const result = await changePhoneNumber(newPhone)
    if (result === true) {
      history.push(sessionStorage.redirect || '/convos')
    }
  }

  return (
    <div className={classes.content_wrap}>
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
              error={!!error}
              helperText={error}
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
        expanded={accordianView === 'new-phone'}
      >
        <AccordionSummary
          className={classes.panel_header}
        >
          <PhoneIcon className={classes.expansion_icon} />
          <Typography
            className={classes.panel_heading}
          >
            New Phone
          </Typography>
        </AccordionSummary>
        <form onSubmit={handleSubmitNewPhone}>
          <AccordionDetails
            className={classes.expansion_body}
          >
            <TextField
              onChange={e => setNewPhone(e.target.value)}
              label='New Phone'
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
            >
                Finish
            </Button>
          </AccordionActions>
        </form>
      </Accordion>
      <Link to='/recovery'>
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

export default LostPhone
