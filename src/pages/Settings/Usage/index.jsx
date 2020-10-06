import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'About'
})

const About = () => {
  const classes = useStyles()

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1' paragraph>
        App Usage
      </Typography>
      <Typography paragraph>
        Here you'll be able to track how you spend money and time across all your apps. This page isn't yet complete.
      </Typography>
    </div>
  )
}

export default About
