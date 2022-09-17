import React, { useState } from 'react'
import { Tabs, Tab, TextField, Button, Typography, LinearProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, {
  name: 'Feedback'
})

const Feedback = ({ history }) => {
  console.log('history:', history)
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
      await window.CWI.sendDataTransaction({
        reason: 'Submit feedback to Project Babbage',
        keyName: 'primarySigning',
        keyPath: 'm/1033/1',
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

  return (
    <div>
      <div className={classes.fixed_nav}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='Actions' />
          <Tab label='Apps' />
          <Tab label='Feedback' />
          <Tab label='You' />
        </Tabs>
      </div>
      <form className={classes.content_wrap} onSubmit={submitFeedback}>
        <Typography variant='h1' paragraph>
          Leave Feedback
        </Typography>
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
      {tabValue === 0 && (
        history.push('/dashboard/actions')
      )}
      {tabValue === 1 && (
        history.push('/dashboard/browse-apps')
      )}
      {tabValue === 3 && (
        history.push('/dashboard/you')
      )}
    </div>
  )
}

export default Feedback
