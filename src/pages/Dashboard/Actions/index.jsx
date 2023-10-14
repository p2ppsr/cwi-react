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
  const [apps, setApps] = useState([])

  useEffect(() => {
    // Obtain a list of all apps ordered alphabetically
    try {
      const results = window.CWI.ninja.getTransactionLabels({
        prefix: 'babbage_app_',
        sortBy: 'label'
      })
      if (Array.isArray(results)) {
        setApps(results)
      }
    } catch (error) {
      console.error(error)
    }
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
              {apps.map((app, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <MetaNetApp domain={app.label} />
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
