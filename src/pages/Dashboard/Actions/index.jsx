import React, { useState, useContext } from 'react'
import { useBreakpoint } from '../../../utils/useBreakpoints.js'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton, Tooltip, Stack, Tabs, Tab, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import ActionList from '../../../components/ActionList/index.jsx'
import UIContext from '../../../UIContext'

const useStyles = makeStyles(style, {
  name: 'Actions'
})
const Actions = ({ history }) => {
  const classes = useStyles()
  const [tabValue, setTabValue] = useState(0)

  const handleOnClose = async () => {
    const { onFocusRelinquished } = useContext(UIContext)
    await onFocusRelinquished()
  }

  const breakpoints = useBreakpoint()
  const displayClassName = breakpoints.sm || breakpoints.xs ? 'show_div' : 'hide_div'

  return (
    <>
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
        </div>
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
