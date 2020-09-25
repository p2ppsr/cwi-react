import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'Support'
})

const About = () => {
  const classes = useStyles()

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1' paragraph>
        Help & Support
      </Typography>
      <Typography paragraph>
        Get answers to your questions on the official
        {' '}<a
          href='https://discord.gg/NawemWW'
          target='_blank'
          rel='noopener noreferrer'
             >
          CWI Discord
             </a>!
      </Typography>
    </div>
  )
}

export default About
