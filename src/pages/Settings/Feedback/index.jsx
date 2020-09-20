import React, { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  CircularProgress
} from '@material-ui/core'
import { sendDataTransaction } from 'pages/Settings/About/node_modules/@cwi/core'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import { toast } from 'react-toastify'

const useStyles = makeStyles(style, {
  name: 'Feedback'
})

const Feedback = () => {
  const classes = useStyles()
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setFeedback('')
    setSubmitted(false)
  }

  const submitFeedback = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendDataTransaction({
        reason: 'Submit feedback to CWI',
        data: [
          '1UUFPLWjtyoyTPYAjt8SqeGZZ1GGFBfNH',
          '1KcqKANgwbqFLYvgwGieKtuRmkpUvEYLSf',
          feedback
        ]
      })
      toast.success('Your feedback has been sent!')
      setSubmitted(true)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  if (!submitted) {
    return (
      <form className={classes.content_wrap} onSubmit={submitFeedback}>
        <Typography variant='h1' paragraph>
          Leave Feedback
        </Typography>
        <Typography paragraph>
          We want to hear what you think! Post your ideas here to improve the CWI ecosystem of apps. Your honest feedback is valued and your submission will be public.
        </Typography>
        <TextField
          multiline
          rows={8}
          fullWidth
          autoFocus
          defaultValue={feedback}
          disabled={loading}
          onChange={e => setFeedback(e.target.value)}
          placeholder='Tell us your thoughts...'
        />
        <br />
        <br />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={loading}
        >
          {!loading ? 'Submit Feedback' : (
            <CircularProgress />
          )}
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
