import React, { useState, useEffect } from 'react'
import {
  Typography
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import ActionList from '../../../components/ActionList/index.jsx'

const useStyles = makeStyles(style, {
  name: 'Actions'
})

const Actions = () => {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.fixed_nav}>
        <Typography variant='h1'>
          Your Actions
        </Typography>
      </div>
      <ActionList />
    </div>
  )
}

export default Actions
