import React, { useState, useContext } from 'react'
import { Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style.js'
import { SettingsContext } from '../../../context/SettingsContext'

const useStyles = makeStyles(style, {
  name: 'Trust'
})

const Trust = ({ history }) => {
  const classes = useStyles()
  const { settings, updateSettings } = useContext(SettingsContext)

  console.log(settings)

  return (
    <div className={classes.content_wrap}>
    </div>
  )
}

export default Trust
