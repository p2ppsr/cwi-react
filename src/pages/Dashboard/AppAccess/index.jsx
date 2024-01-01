/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { Typography, Button, IconButton, Grid, Tab, Tabs } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import isImageUrl from '../../../utils/isImageUrl'
import { Img } from 'uhrp-react'
import parseAppManifest from '../../../utils/parseAppManifest'
import ProtocolPermissionList from '../../../components/ProtocolPermissionList'
import SpendingList from '../../../components/SpendingList'
import BasketList from '../../../components/BasketList'
import CertificateList from '../../../components/CertificateList'
import PageHeader from '../../../components/PageHeader'
// debugger // eslint-disable-line no-debugger

const useStyles = makeStyles(style, { name: 'appaccess' })

const AppAccess = ({ match, history }) => {
  const originator = decodeURIComponent(match.params.originator)
  const [tabValue, setTabValue] = useState('0')
  const [appDomain, setAppDomain] = useState('')
  const [appName, setAppName] = useState('')
  const [appIcon, setAppIcon] = useState('MetaNet AppMetaNet App')
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const recentActionParams = {
    loading,
    // appActions,
    // displayLimit,
    // setDisplayLimit,
    setRefresh
  }
  const classes = useStyles()
  useEffect(() => {
    (async () => {
      try {
        if (appDomain === '') {
          setAppDomain(originator)
        }
        setLoading(true)
        // Validate that the default favicon path is actually an image
        try {
          const manifest = await parseAppManifest({ domain: appDomain })
          if (manifest) {
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
            setLoading(false)
            setRefresh(false)
          }
        } catch (e) {
        }
      } catch (e) {
        /* do nothing */
        setLoading(false)
        setRefresh(false)
      }
    })()
  }, [refresh, appDomain])

  return (
    <div className={classes.root}>
      <Grid container spacing={3} direction='column'>
        <Grid item>
          <PageHeader
            history={history}
            title={appName}
            subheading={
              <div>
                <Typography variant='h3' color='textSecondary'>
                  {`https://${appDomain}`}
                </Typography>
              </div>
            }
            icon={appIcon} buttonTitle='Launch'
            // buttonIcon={}
            onClick={() => {
              window.open(`https://${appDomain}`, '_blank')
            }}
          />
        </Grid>

        <Grid item className={classes.body}>
          <Typography variant='h2' color='textPrimary'>
            Manage App Access
          </Typography>

          <Typography variant='body'>
            You have the power to decide what each app can do, whether it&apos;s using certain tools (protocols), accessing specific bits of your data (baskets), verifying your identity (certificates), or spending amounts.
          </Typography>
          <br />
          <Tabs
            className={classes.tabs}
            value={tabValue}
            onChange={(e, v) => { setTabValue(v) }}
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
          >
            <Tab
              label='Protocols'
              value='0'
            />
            <Tab
              label='Spending'
              value='1'
            />
            <Tab
              label='Baskets'
              value='2'
            />
            <Tab
              label='Certificates'
              value='3'
            />
          </Tabs>
          {tabValue === '0' &&
            <ProtocolPermissionList
              app={appDomain}
              displayCount={false}
            />}
          {tabValue === '1' &&
            <SpendingList
              app={appDomain}
              limit={10}
              appIcon={appIcon}
            />}
          {tabValue === '2' &&
            <BasketList
              app={appDomain}
            />}
          {tabValue === '3' &&
            <CertificateList
              app={appDomain}
            />}
        </Grid>

      </Grid>
    </div>
  )
}

export default AppAccess
