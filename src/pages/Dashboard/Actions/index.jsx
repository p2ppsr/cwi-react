import React, { useEffect, useState } from 'react'
import { Typography, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style'
import { useBreakpoint } from '../../../utils/useBreakpoints'
import Profile from '../../../components/Profile'
import MetaNetApp from '../../../components/MetaNetApp'
import POPULAR_APPS from '../../../constants/popularApps'

const useStyles = makeStyles(style, {
  name: 'Actions'
})
const Actions = ({ history }) => {
  const classes = useStyles()
  const breakpoints = useBreakpoint()
  const [apps, setApps] = useState([])
  const [recentApps, setRecentApps] = useState([])

  useEffect(async () => {

    // Obtain a list of all apps ordered chronologically
    try {
      const results = await window.CWI.ninja.getTransactionLabels({
        prefix: 'babbage_app_',
        sortBy: 'whenLastUsed'
      })
      if (results && Array.isArray(results.labels)) {
        setRecentApps(results.labels)
      }
    } catch (error) {
      console.error('ERROR: Obtaining recent apps in date order:', error)
    }
  
    // Obtain a list of all apps ordered alphabetically
    try {
      const results = await window.CWI.ninja.getTransactionLabels({
        prefix: 'babbage_app_',
        sortBy: 'label'
      })
      if (results && Array.isArray(results.labels)) {
        setApps(results.labels)
      }
    } catch (error) {
      console.error('ERROR: Obtaining list of popular apps:', error)
    }
  }, [])
  return (
    <>
      {(!breakpoints.sm && !breakpoints.xs)
        ? (
          <div className={classes.fixed_nav}>
            {(recentApps.length <= 5) 
              ? (
                <><Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
                    Popular Apps
                  </Typography><Grid container spacing={2}>
                    {POPULAR_APPS.map((name, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <MetaNetApp domain={name} />
                      </Grid>
                    ))}
                  </Grid></>
                )
              : (
                <><Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
                    Recent Apps
                  </Typography><Grid container spacing={2}>
                    {recentApps.map((app, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <MetaNetApp domain={app.label.replace(/^babbage_app_/, '')} />
                      </Grid>
                    ))}
                  </Grid></>
                )
            }
            <Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
              All Apps
            </Typography>
            <Grid container spacing={2}>
              {apps.map((app, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <MetaNetApp domain={app.label.replace(/^babbage_app_/, '')} />
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


