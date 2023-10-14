import React, { useEffect, useState } from 'react'
import { Typography, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import { useBreakpoint } from '../../../utils/useBreakpoints'
import Profile from '../../../components/Profile'
import MetaNetApp from '../../../components/MetaNetApp'

const useStyles = makeStyles(style, {
  name: 'Actions'
})
const Actions = ({ history }) => {
  const classes = useStyles()
  const breakpoints = useBreakpoint()
  const mockedApps = [
    'projectbabbage.com',
    'x',
    'projectbabbage.com',
    'x',
    'projectbabbage.com',
    'projectbabbage.com',
    'projectbabbage.com',
    'projectbabbage.com',
    'projectbabbage.com'
  ]
  const [apps, setApps] = useState([])

  useEffect(() => {
    // Mocking window.CWI.ninja.listTransactionLabels
    // TODO: When the component loads,
    // it will call window.CWI.ninja.listTransactionLabels with the babbage_app_ prefix, to obtain a list of all apps ordered alphabetically.
    setApps(mockedApps)
  }, [])
  return (
    <>
      {(!breakpoints.sm && !breakpoints.xs)
        ? (
          <div className={classes.fixed_nav}>
            <Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
              All Apps
            </Typography>
            <Grid container spacing={2}>
              {apps.map((originator, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <MetaNetApp domain={originator} />
                </Grid>
              ))}
            </Grid>
          </div>
          )
        : (
          <Profile />
          )}
    </>
  )
}

export default Actions
