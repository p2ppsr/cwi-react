import React, { useState, useContext } from 'react'
import { useBreakpoint } from '../../utils/useBreakpoints.js'
import CloseIcon from '@mui/icons-material/Close'
import { withRouter } from 'react-router-dom'
import { Typography, IconButton, Tabs, Tab } from '@mui/material'
import UIContext from '../../UIContext'
import { makeStyles } from '@mui/styles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'AppViewTabs'
})

export default withRouter(({ history }) => {
  const classes = useStyles()
  const breakpoints = useBreakpoint()
  const [tabValue, setTabValue] = useState(0)
  const [title, setTitle] = useState('Protocol')
  const { onFocusRelinquished } = useContext(UIContext)

  const handleClose = async () => {
    await onFocusRelinquished()
  }

  const handleTabChange = (e, v) => {
    setTabValue(v)
    switch (v) {
      case 0:
        setTitle('Protocol')
        history.push('/dashboard/manage-apps/protocol')
        break
      case 1:
        setTitle('Spending')
        history.push('/dashboard/manage-apps/spending')
        break
      case 2:
        setTitle('Basket')
        history.push('/dashboard/manage-apps/basket')
        break
      case 3:
        setTitle('Id')
        history.push('/dashboard/manage-apps/id')
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
          <Tab label='Protocol' />
          <Tab label='Spending' />
          <Tab label='Basket' />
          <Tab label='Id' />
        </Tabs>
      </div>
      <div className={classes.placeholder} />
    </>
  )
})
