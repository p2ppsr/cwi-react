/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Typography, IconButton, Grid, Tab, Tabs, List, Link } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import isImageUrl from '../../../utils/isImageUrl'
import parseAppManifest from '../../../utils/parseAppManifest'
import ProtocolPermissionList from '../../../components/ProtocolPermissionList'
import SpendingAuthorizationList from '../../../components/SpendingAuthorizationList'
import BasketAccessList from '../../../components/BasketAccessList'
import CertificateAccessList from '../../../components/CertificateAccessList'
import PageHeader from '../../../components/PageHeader'
import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const useStyles = makeStyles(style, { name: 'appaccess' })

const AppAccess = ({ match, history }) => {
  const originator = decodeURIComponent(match.params.originator)
  const [tabValue, setTabValue] = useState('0')
  const [appDomain, setAppDomain] = useState('')
  const [appName, setAppName] = useState('')
  const [appIcon, setAppIcon] = useState('MetaNet AppMetaNet App')
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [copied, setCopied] = useState({ id: false, registryOperator: false })

  // Copies the data and timeouts the checkmark icon
  const handleCopy = (data, type) => {
    navigator.clipboard.writeText(data)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => {
      setCopied({ ...copied, [type]: false })
    }, 2000)
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
          console.error(e)
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
      <Grid container spacing={3} direction='column' sx={{ padding: '16px' }}>
        <Grid item>
          <PageHeader
            history={history} title={appName}
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
        <Grid item>
          <Typography variant='body' gutterBottom>
            You have the power to decide what each app can do, whether it&apos;s using certain tools (protocols), accessing specific bits of your data (baskets), verifying your identity (certificates), or spending amounts.
          </Typography>
        </Grid>
      </Grid>
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
          canRevoke
          showEmptyList
        />}
      {tabValue === '1' &&
        <SpendingAuthorizationList
          app={appDomain}
        />}
      {tabValue === '2' &&
        <BasketAccessList
          app={appDomain}
          showEmptyList
          canRevoke
        />}
      {tabValue === '3' &&
        <CertificateAccessList
          app={appDomain}
          canRevoke
          showEmptyList
        />}
      {/* </div> */}
      <div />
    </div>
  )
}

export default AppAccess
