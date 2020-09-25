import React, { useState, useEffect } from 'react'
import {
  changePhoneNumber,
  createSnapshot
} from '@cwi/core'
import style from '../style'
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
  SettingsPhone as PhoneIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import redirectIfLoggedOut from '../../../utils/redirectIfLoggedOut'

const useStyles = makeStyles(style, { name: 'PhoneSettings' })

const PhoneSettings = ({ history, mainPage, routes }) => {
  const classes = useStyles()
  const [newPhone, setNewPhone] = useState('')

  useEffect(() => {
    redirectIfLoggedOut(history, routes)
  }, [history])

  const handleSubmitNewPhone = async e => {
    e.preventDefault()
    const result = await changePhoneNumber(newPhone)
    if (result === true) {
      localStorage.CWIAuthStateSnapshot = await createSnapshot()
      toast.success('Phone number changed successfully!')
      history.push(mainPage)
    }
  }

  return (
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

export default connect(stateToProps)(PhoneSettings)
