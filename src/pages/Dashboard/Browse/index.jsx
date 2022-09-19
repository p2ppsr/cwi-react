import React, { useState, useContext } from 'react'
import { useBreakpoint } from '../../../utils/useBreakpoints.js'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Tooltip, Stack, Tabs, Tab, Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import UIContext from '../../../UIContext'

const useStyles = makeStyles(style, {
  name: 'About'
})

const About = ({ history }) => {
  console.log('history:', history)
  const classes = useStyles()
  const [tabValue, setTabValue] = useState(1)
  const handleOnClose = async () => {
    const { onFocusRelinquished } = useContext(UIContext)
    await onFocusRelinquished()
  }

  const breakpoints = useBreakpoint()
  const displayClassName = breakpoints.sm || breakpoints.xs ? 'show_div' : 'hide_div'

  return (
    <div className={classes.fixed_nav}>
      <div className={classes[displayClassName]}>
        <Stack direction='row' justifyContent='end'>
          <Tooltip placement='left' title='Close'>
            <IconButton onClick={handleOnClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Tabs
          className={classes.tabs}
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
