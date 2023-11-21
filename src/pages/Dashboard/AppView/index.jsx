/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { Typography, Button, IconButton, Grid } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import isImageUrl from '../../../utils/isImageUrl'
import { Img } from 'uhrp-react'
import parseAppManifest from '../../../utils/parseAppManifest'
import AppViewTabs from '../../../components/AppViewTabs'
import ProtocolList from '../../../components/ProtocolList'
import SpendingList from '../../../components/SpendingList'
import BasketList from '../../../components/BasketList'
import CertificateList from '../../../components/CertificateList'

const useStyles = makeStyles(style, { name: 'appview' })

const AppView = ({ match, history }) => {
  console.log('AppView:match=', match)
  const appDomain = decodeURIComponent(match.params.originator)
  console.log('AppView:appDomain=', appDomain)
  const [appName, setAppName] = useState(appDomain)
  const [appIcon, setAppIcon] = useState('MetaNet AppMetaNet App')
  // const [displayLimit, setDisplayLimit] = useState(5)
  // const [appActions, setAppActions] = useState({})
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
  // alert('AppView')
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
          // limit: displayLimit,
          includeBasket: true,
          includeTags: true,
          order: 'descending',
          label: `babbage_app_${appDomain}`,
          addInputsAndOutputs: true,
          status: 'completed'
        })
        console.log(appActions)
        // setAppActions(appActions)
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

  // * className={classes.page_container}
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
            <Typography variant='h3'>
              {`https://${appDomain}`}
            </Typography>
            <br />
            <Typography variant='h2'>
            Mange App Access
            </Typography>
            <Typography variant='h4'>
            You have the power to decide what each app can do, whether it&apos;s using certain tools (protocols), accessing specific bits of your data (baskets), verifying your identity (certificates), or spending amounts.
            </Typography>
            <br />
            <AppViewTabs />
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
      <div>
      <Switch>
        <Route
          path='/dashboard/manage-app/protocols'
          component={ProtocolList}
        />
        <Route
          path='/dashboard/manage-app/spending'
          component={SpendingList}
        />
        <Route
          path='/dashboard/manage-app/baskets'
          component={BasketList}
        />
        <Route
          path='/dashboard/manage-app/certificates'
          component={CertificateList}
        />
        <Route
          className={classes.full_width}
          default
          component={() => {
            return (
              <div style={{ padding: '1em' }}>
                <Typography align='center' color='textPrimary'>Are you lost?</Typography>
              </div>
            )
          }}
        />
      </Switch>
    </div>
  </div>
  )
}

export default AppView
