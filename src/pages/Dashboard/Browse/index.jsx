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

const Browse = ({ history }) => {
  const classes = useStyles()

  const breakpoints = useBreakpoint()
  return (
    <div className={classes.fixed_nav}>
      {(!breakpoints.sm && !breakpoints.xs) &&
        <Typography variant='h1' paragraph>
          Babbage App Explorer
        </Typography>
      }
      <Typography paragraph>
        Soon, the newest releases from around the MetaNet will be browsable and searchable from this Babbage portal. For now, head over to our website to check it out.
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

export default Browse
