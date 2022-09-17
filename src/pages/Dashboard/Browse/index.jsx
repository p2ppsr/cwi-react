import React, { useState } from 'react'
import { Tabs, Tab, Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'About'
})

const About = ({ history }) => {
  console.log('history:', history)
  const classes = useStyles()
  const [tabValue, setTabValue] = useState(1)

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
        <Typography variant='h1' paragraph>
          Babbage App Explorer
        </Typography>
      </div>
      <Typography paragraph>
        Soon, you'll be able to view the latest and greatest titles from within Babbage Desktop itself! For now, head over to the App Catalogue to see what's new.
      </Typography>
      <center>
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={() => {
            window.open('https://projectbabbage.com/app-catalogue', '_blank')
          }}
        >
          App Catalogue
        </Button>
      </center>
      {tabValue === 0 && (
        history.push('/dashboard/actions')
      )}
      {tabValue === 2 && (
        history.push('/dashboard/feedback')
      )}
      {tabValue === 3 && (
        history.push('/dashboard/you')
      )}
    </div>
  )
}

export default About
