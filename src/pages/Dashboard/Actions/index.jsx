import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Tabs, Tab } from '@material-ui/core'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import ActionList from '../../../components/ActionList/index.jsx'

const useStyles = makeStyles(style, {
  name: 'Actions'
})

const Actions = () => {
  const history = useHistory()
  const classes = useStyles()
  const [tabValue, setTabValue] = useState(0)

  return (
    <div>
      <div className={classes.fixed_nav}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='Actions' />
          <Tab label='Settings' />
          <Tab label='App explorer' />
          <Tab label='Help feedback' />
        </Tabs>
        <Typography variant='h1'>Your Actions</Typography>
      </div>
      {tabValue === 0 && (
        <ActionList />
      )}
      {tabValue === 1 && (
        history.push('/dashboard/settings')
      )}
    </div>
  )
}

export default Actions
