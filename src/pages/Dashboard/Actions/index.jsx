import React, { useState } from 'react'
import { Tabs, Tab } from '@material-ui/core'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import ActionList from '../../../components/ActionList/index.jsx'

const useStyles = makeStyles(style, {
  name: 'Actions'
})

const Actions = ({ history }) => {
  console.log('history:', history)
  const classes = useStyles()
  const [tabValue, setTabValue] = useState(0)

  return (
    <>
      <div className={classes.fixed_nav}>
        <Tabs
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
        <Typography variant='h1'>Your Actions</Typography>
        <ActionList />
      </div>
      {tabValue === 1 && (
        history.push('/dashboard/browse-apps')
      )}
      {tabValue === 2 && (
        history.push('/dashboard/feedback')
      )}
      {tabValue === 3 && (
        history.push('/dashboard/you')
      )}
    </>
  )
}

export default Actions
