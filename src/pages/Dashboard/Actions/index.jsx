import React, { useState, useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Tooltip, Stack, Tabs, Tab, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import ActionList from '../../../components/ActionList/index.jsx'
import UIContext from '../../../UIContext'

const useStyles = makeStyles(style, {
  name: 'Actions'
})

const Actions = ({ history }) => {
  console.log('history:', history)
  const classes = useStyles()
  const [tabValue, setTabValue] = useState(0)

  const handleOnClose = async () => {
    const { onFocusRelinquished } = useContext(UIContext)
    await onFocusRelinquished()
  }

  return (
    <>
      <div className={classes.fixed_nav}>
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
