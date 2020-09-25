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
        Who We Are
      </Typography>
      <Typography paragraph>
        We enable you to use decentralized apps and keep control of your data.
      </Typography>
    </div>
  )
}

export default About
