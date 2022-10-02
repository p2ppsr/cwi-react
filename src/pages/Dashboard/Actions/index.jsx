import React from 'react'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import ActionList from '../../../components/ActionList/index.jsx'
import { useBreakpoint } from '../../../utils/useBreakpoints'
import Profile from '../../../components/Profile'

const useStyles = makeStyles(style, {
  name: 'Actions'
})
const Actions = ({ history }) => {
  const classes = useStyles()
  const breakpoints = useBreakpoint()

  return (
    <>
    <div className={classes.fixed_nav}>
      {(!breakpoints.sm && !breakpoints.xs) ? (
        <Typography variant='h1' paragraph>Your Actions</Typography>
      ) : (
        <Profile />
      )}
    </div>
    <ActionList />
    </>
  )
}

export default Actions
