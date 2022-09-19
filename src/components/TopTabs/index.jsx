import React, { useState, useContext } from 'react'
import { useBreakpoint } from '../../utils/useBreakpoints.js'
import CloseIcon from '@mui/icons-material/Close'
import { withRouter } from 'react-router-dom'
import { Typography, IconButton, Tabs, Tab } from '@mui/material'
import UIContext from '../../UIContext'
import { makeStyles } from '@mui/styles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'TopTabs'
})

export default withRouter(({ history }) => {
  const classes = useStyles()
  const breakpoints = useBreakpoint()
  const [tabValue, setTabValue] = useState(0)
  const [title, setTitle] = useState('You')
  const { onFocusRelinquished } = useContext(UIContext)

  const handleClose = async () => {
    await onFocusRelinquished()
  }

  const handleTabChange = (e, v) => {
    setTabValue(v)
    switch (v) {
      case 0:
        setTitle('You')
        history.push('/dashboard/actions')
        break
      case 1:
        setTitle('Apps')
        history.push('/dashboard/browse-apps')
        break
      case 2:
        setTitle('Feedback')
        history.push('/dashboard/feedback')
        break
      case 3:
        setTitle('Settings')
        history.push('/dashboard/settings')
        break
    }
  }

  if (!breakpoints.sm && !breakpoints.xs) {
    return null
  }

  return (
    <>
      <div className={classes.fixed_nav}>
        <div className={classes.title_close_grid}>
          <Typography variant='h1' className={classes.title_text}>
            {title}
          </Typography>
          <IconButton className={classes.close_btn} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Tabs
          className={classes.tabs}
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='You' />
          <Tab label='Apps' />
          <Tab label='Feedback' />
          <Tab label='Settings' />
        </Tabs>
      </div>
      <div className={classes.placeholder} />
    </>
  )
})
