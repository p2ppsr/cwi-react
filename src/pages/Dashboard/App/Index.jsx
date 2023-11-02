/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import isImageUrl from '../../../utils/isImageUrl'
import parseAppManifest from '../../../utils/parseAppManifest'
import RecentActions from '../../../components/RecentActions'
import AccessAtAGlance from '../../../components/AccessAtAGlance'
import PageHeader from '../../../components/PageHeader'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

const useStyles = makeStyles(style, { name: 'apps' })

const Apps = ({ history }) => {
  const location = useLocation()
  const appDomain = location.state?.domain
  const [appName, setAppName] = useState(appDomain)
  const [appIcon, setAppIcon] = useState('MetaNet AppMetaNet App')
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
        try {
          const manifest = await parseAppManifest({ domain: appDomain })
          if (typeof manifest.name === 'string') {
            setAppName(manifest.name)
          }
        } catch (error) {
          console.error(error)
        }

        // Get a list of the 5 most recent actions from the app
        // Also request input and output amounts and descriptions from Ninja
        const appActions = await window.CWI.ninja.getTransactions({
          limit: displayLimit,
          includeBasket: true,
          includeTags: true,
          order: 'descending',
          label: `babbage_app_${appDomain}`,
          addInputsAndOutputs: true,
          status: 'completed'
        })

        setAppActions(appActions)
        setLoading(false)
        setRefresh(false)
        console.log('reloaded')
      } catch (e) {
        /* do nothing */
        console.error(e)
        setLoading(false)
        setRefresh(false)
      }
    })()
  }, [refresh])

  return (
    <div className={classes.root}>
      <PageHeader
        history={history} title={appName} subheading={appDomain} icon={appIcon} buttonTitle='Launch' onClick={() => {
          window.open(`https://${appDomain}`, '_blank')
        }}
      />
      {/* <Grid container>
        <Grid item sx={12} style={{ width: '100%', height: '10em', background: 'gray' }}>
          <Typography paddingBottom='2em' align='center'>Total App Cashflow</Typography>
        </Grid>
      </Grid> */}
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
