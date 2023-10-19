import React, { useState, useEffect } from 'react'
import { Typography, Button, IconButton, Grid } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import isImageUrl from '../../../utils/isImageUrl'
import { Img } from 'uhrp-react'
import parseAppManifest from '../../../utils/parseAppManifest'
import RecentActions from '../../../components/RecentActions'
import AccessAtAGlance from '../../../components/AccessAtAGlance'

const useStyles = makeStyles(style, { name: 'apps' })

const Apps = ({ match, history }) => {
  const appDomain = decodeURIComponent(match.params.app)
  const [appName, setAppName] = useState(appDomain)
  const [appIcon, setAppIcon] = useState('MetaNet App')
  const [displayLimit, setDisplayLimit] = useState(5)
  const [appActions, setAppActions] = useState({})
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const recentActionParams = {
    loading,
    appActions,
    displayLimit,
    setDisplayLimit,
    setRefresh
  }
  const classes = useStyles()

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        // Validate that the default favicon path is actually an image
        if (await isImageUrl(`https://${appDomain}/favicon.ico`)) {
          setAppIcon(`https://${appDomain}/favicon.ico`)
        } else {
          setAppIcon('https://projectbabbage.com/favicon.ico')
        }
        // Try to parse the app manifest to find the app info
        const manifest = await parseAppManifest({ domain: appDomain })
        if (typeof manifest.name === 'string') {
          setAppName(manifest.name)
        }

        // Get a list of the 5 most recent actions from the app
        // Also request input and output amounts and descriptions from Ninja
        const appActions = await window.CWI.ninja.getTransactions({
          limit: displayLimit,
          order: 'descending',
          label: `babbage_app_${appDomain}`,
          addInputsAndOutputs: true
        })
        setAppActions(appActions)
        setLoading(false)
        setRefresh(false)
        console.log('reloaded')
      } catch (e) {
        /* do nothing */
        setLoading(false)
        setRefresh(false)
      }
    })()
  }, [refresh])

  return (
    <div className={classes.root}>
      <div>
        <div className={classes.top_grid}>
          <div>
            <IconButton
              className={classes.back_button}
              onClick={() => history.go(-1)}
              size='large'
            >
              <ArrowBack />
            </IconButton>
          </div>
          <div>
            <Img
              className={classes.app_icon}
              src={appIcon}
              alt=''
            />
          </div>
          <div>
            <Typography variant='h1'>
              {appName}
            </Typography>
            <Typography color='textSecondary'>
              {appDomain}
            </Typography>
          </div>
          <div>
            <Button
              className={classes.launch_button}
              variant='contained'
              color='primary'
              size='large'
              onClick={() => {
                window.open(`https://${appDomain}`, '_blank')
              }}
            >
              Launch
            </Button>
          </div>
        </div>
      </div>
      <Grid container>
        <Grid item sx={12} style={{ width: '100%', height: '10em', background: 'gray' }}>
          <Typography paddingBottom='2em' align='center'>Total App Cashflow</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12}>
          <RecentActions {...recentActionParams} />
        </Grid>
        <Grid item lg={6} xs={12}>
          <AccessAtAGlance {...{ originator: appDomain, loading, setRefresh, history }} />
        </Grid>
      </Grid>
    </div>
  )
}

export default Apps
