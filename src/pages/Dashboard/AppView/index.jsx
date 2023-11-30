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
// import AppViewTabs from '../../../components/AppViewTabs'
import ProtocolList from '../../../components/ProtocolList'
import SpendingList from '../../../components/SpendingList'
import BasketList from '../../../components/BasketList'
import CertificateList from '../../../components/CertificateList'
// debugger // eslint-disable-line no-debugger

const useStyles = makeStyles(style, { name: 'appview' })

const AppView = ({ match, history }) => {
  // console.log('AppView:match=', match)
  const originator = decodeURIComponent(match.params.originator)
  // console.log('AppView:originator=', originator)
  // const [isInit, setIsInit] = useState(true)
  // const [selectTab, setSelectTab] = useState('protocols')
  // const classes = useStyles()
  const [tabValue, setTabValue] = useState('0')
  const [title, setTitle] = useState('Protocols')
  // const { onFocusRelinquished } = useContext(UIContext)

  const handleClose = async () => {
    await onFocusRelinquished()
  }

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
        // console.log('AppView:useEffect:before appDomain=', appDomain)
        // console.log('AppView:useEffect:before originator=', originator)
        if (appDomain === '') {
          setAppDomain(originator)
          // console.log('AppView:useEffect:after appDomain=', appDomain)
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
              // console.log('AppView:manifest=', manifest)
              // console.log('AppView:typeof manifest.name=', typeof manifest.name)
              if (typeof manifest.name === 'string') {
                setAppName(manifest.name)
              }
            } catch (error) {
              console.error(error)
            }
            setLoading(false)
            setRefresh(false)
            // console.log('reloaded')
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

  const handleTabChange = (e, v) => {
    console.log('handleTabChange():e=', e, ',v=', v)
    setTabValue(v)
    switch (v) {
      case 0:
        setTitle('Protocols')
        break
      case 1:
        setTitle('Spending')
        break
      case 2:
        setTitle('Baskets')
        break
      case 3:
        setTitle('Certificates')
        break
    }
  }
  // }, [refresh, appDomain, appName, isInit, loading, appIcon])
  // console.log('AppView:selectTab=', selectTab)
  console.log('AppView:appDomain=', appDomain)
  // console.log('AppView:originator=', originator)
  console.log('AppView:loading=', loading)

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
            <Tabs
              className={classes.tabs}
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor='primary'
              textColor='primary'
              variant='fullWidth'
            >
              <Tab
                label='Protocols'
                value='0'
              >
              </Tab>
              <Tab
                label='Spending'
                value='1'
              >
              </Tab>
              <Tab
                label='Baskets'
                value='2'
              >
              </Tab>
              <Tab
                label='Certificates'
                value='3'
              >
              </Tab>
            </Tabs>
            {tabValue === '0' &&
            <ProtocolList
              app={appDomain}
              /*
              protocol={protocol}
              limit={limit}
              canRevoke={canRevoke}
              displayCount={displayCount}
              listHeaderTitle={listHeaderTitle}
              showEmptyList={showEmptyList}
              */
            />}
            {tabValue === '1' &&
            <SpendingList
              app={appDomain}
              limit={10}
            />}
            {tabValue === '2' &&
            <BasketList
              app={appDomain}
              /*
              basket={basket}
              limit={limit}
              itemsDisplayed={itemsDisplayed}
              canRevoke={canRevoke}
              displayCount={displayCount}
              listHeaderTitle={listHeaderTitle}
              showEmptyList={showEmptyList}
              */
            />}
            {tabValue === '3' &&
            <CertificateList
              app={appDomain}
              /*
              type={type}
              limit={limit}
              displayCount={displayCount}
              listHeaderTitle={listHeaderTitle}
              showEmptyList={showEmptyList}
              */
            />}
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
    </div>
  </div>
  )
}

export default AppView
