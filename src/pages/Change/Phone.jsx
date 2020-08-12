import React, { useState, useEffect } from 'react'
import {
  changePhoneNumber,
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
import PhoneIcon from '@material-ui/icons/SettingsPhone'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, { name: 'PhoneNumber' })

const Phone = ({ history }) => {
  const classes = useStyles()
  const [newPhone, setNewPhone] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push('/')
    }
  }, [history])

  const handleSubmitNewPhone = async e => {
    e.preventDefault()
    const result = await changePhoneNumber(newPhone)
    if (result === true) {
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      toast.success('Phone number changed successfully!')
      history.push('/convos')
    }
  }

  return (
    <div className={classes.content_wrap}>
      <Accordion
        expanded
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

export default Phone
