/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Grid, IconButton, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import isImageUrl from '../../../utils/isImageUrl'
import parseAppManifest from '../../../utils/parseAppManifest'
import RecentActions from '../../../components/RecentActions'
import AccessAtAGlance from '../../../components/AccessAtAGlance'
import PageHeader from '../../../components/PageHeader'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

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
  const [copied, setCopied] = useState({ id: false, registryOperator: false })

  // Copies the data and timeouts the checkmark icon
  const handleCopy = (data, type) => {
    navigator.clipboard.writeText(data)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => {
      setCopied({ ...copied, [type]: false })
    }, 2000)
  }

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
          basket: 'todo tokens',
          limit: displayLimit,
          includeBasket: true,
          includeTags: true,
          order: 'descending',
          label: `babbage_app_${appDomain}`,
          addInputsAndOutputs: true,
          status: ['completed', 'unproven', 'sending']
        })
        console.log(appActions)

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
    <Grid container spacing={3} direction='column'>
      <Grid item xs={12}>
        <PageHeader
          history={history}
          title={appName}
          subheading={
            <div>
              <Typography variant='caption' color='textSecondary'>
                {`https://${appDomain}`}
                <IconButton size='small' onClick={() => handleCopy(appDomain, 'id')} disabled={copied.id}>
                  {copied.id ? <CheckIcon /> : <ContentCopyIcon fontSize='small' />}
                </IconButton>
              </Typography>
            </div>
          } icon={appIcon} buttonTitle='Launch' onClick={() => {
            window.open(`https://${appDomain}`, '_blank')
          }}
        />
      </Grid>
      {/* <Grid item sx={12} style={{ width: '100%', height: '10em', background: 'gray' }}>
          <Typography paddingBottom='2em' align='center'>Total App Cashflow</Typography>
        </Grid> */}
      <Grid container item spacing={3} direction='row'>
        <Grid item lg={6} md={6} xs={12}>
          <RecentActions {...recentActionParams} />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <AccessAtAGlance {...{ originator: appDomain, loading, setRefresh, history }} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Apps
