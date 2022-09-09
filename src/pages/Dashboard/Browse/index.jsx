import React from 'react'
import { Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'About'
})

const About = () => {
  const classes = useStyles()

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1' paragraph>
        Babbage App Explorer
      </Typography>
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
    </div>
  )
}

export default About
