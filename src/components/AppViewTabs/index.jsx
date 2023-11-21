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
  const [title, setTitle] = useState('Protocols')
  const { onFocusRelinquished } = useContext(UIContext)

  const handleClose = async () => {
    await onFocusRelinquished()
  }

  const handleTabChange = (e, v) => {
    setTabValue(v)
    switch (v) {
      case 0:
        setTitle('Protocols')
        history.push('/dashboard/manage-app/protocols')
        break
      case 1:
        setTitle('Spending')
        history.push('/dashboard/manage-app/spending')
        break
      case 2:
        setTitle('Baskets')
        history.push('/dashboard/manage-app/baskets')
        break
      case 3:
        setTitle('Certificates')
        history.push('/dashboard/manage-app/certificates')
        break
    }
  }

  // Removed - not needed
  // if (!breakpoints.sm && !breakpoints.xs) {
  //  console.log('AppViewTabs:return null')
  //  return null
  // }
  // className={classes.fixed_nav}
  // <Typography variant='h1' className={classes.title_text}>
  //  {title}
  // </Typography>
  // <div className={classes.title_close_grid}>
  // <IconButton className={classes.close_btn} onClick={handleClose}>
  // <CloseIcon />
  // </IconButton>
  // </div>

  return (
    <>
      <div>
        <Tabs
          className={classes.tabs}
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='Protocols' />
          <Tab label='Spending' />
          <Tab label='Baskets' />
          <Tab label='Certificates' />
        </Tabs>
      </div>
      <div className={classes.placeholder} />
    </>
  )
})
