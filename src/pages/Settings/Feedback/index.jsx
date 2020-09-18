import React, { useState } from 'react'
import { TextField, Button, Typography } from '@material-ui/core'
import { sendDataTransaction } from '@cwi/core'
import { makeStyles } from '@material-ui/styles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'Feedback'
})

const Feedback = () => {
  const classes = useStyles()
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const resetForm = () => {
    setFeedback('')
    setSubmitted(false)
  }

  const submitFeedback = async e => {
    e.preventDefault()
    await sendDataTransaction({
      reason: 'Submit feedback to CWI',
      data: [
        '1UUFPLWjtyoyTPYAjt8SqeGZZ1GGFBfNH',
        '1KcqKANgwbqFLYvgwGieKtuRmkpUvEYLSf',
        feedback
      ]
    })
    setSubmitted(true)
  }

  if (!submitted) {
    return (
      <form className={classes.content_wrap} onSubmit={submitFeedback}>
        <Typography variant='h1'>Leave Feedback</Typography>
        <Typography paragraph>
          We want to hear what you think! Post your thoughts here to improve the CWI ecosystem of apps! Your submission will be public.
        </Typography>
        <TextField
          multiline
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder='Give feedback about CWI...'
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
        >
          Submit Feedback
        </Button>
      </form>
    )
  }

  return (
    <div>
      <Typography>Submitted!</Typography>
      <Button onClick={resetForm}>Send More Feedback</Button>
    </div>
  )
}

export default Feedback
