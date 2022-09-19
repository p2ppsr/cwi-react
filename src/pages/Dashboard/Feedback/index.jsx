import React, { useState, useContext } from 'react'
import { useBreakpoint } from '../../../utils/useBreakpoints.js'
import { TextField, Button, Typography, LinearProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, {
  name: 'Feedback'
})
const Feedback = ({ history }) => {
  const classes = useStyles()
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [tabValue, setTabValue] = useState(2)
  const submitFeedback = async e => {
    e.preventDefault()
    try {
      if (!feedback || feedback.length < 10) {
        toast.error('Feedback is too short!')
        return
      }
      setLoading(true)
      await window.CWI.createAction({
        description: 'Submit feedback to Project Babbage',
        originator: 'projectbabbage.com',
        data: [
          window.btoa('1UUFPLWjtyoyTPYAjt8SqeGZZ1GGFBfNH'),
          window.btoa('1KcqKANgwbqFLYvgwGieKtuRmkpUvEYLSf'),
          window.btoa(feedback)
        ]
      })
      toast.dark('Feedback submitted!')
      setLoading(false)
      setFeedback('')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const breakpoints = useBreakpoint()

  return (
    <div className={classes.fixed_nav}>
      <form className={classes.content_wrap} onSubmit={submitFeedback}>
        {(!breakpoints.sm && !breakpoints.xs) &&
          <Typography variant='h1' paragraph>Leave Feedback</Typography>
        }
        <Typography paragraph>
          We want to hear what you think! Post your ideas here to help improve Project Babbage and our ecosystem of apps. Note that your submission will be public.
        </Typography>
        <TextField
          multiline
          rows={8}
          fullWidth
          autoFocus
          value={feedback}
          disabled={loading}
          onChange={e => setFeedback(e.target.value)}
          placeholder='Tell us your thoughts...'
        />
        <br />
        <br />
        {loading
          ? <LinearProgress />
          : (
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={feedback.length < 10}
            >
              Submit Feedback
            </Button>
          )}
        <br />
        <br />
        <Typography>
          You can also <a href='mailto:hello@projectbabbage.com'>email us</a> with any questions or concerns. We're always happy to discuss new projects and ways we can improve.
        </Typography>
      </form>
    </div>
  )
}

export default Feedback
