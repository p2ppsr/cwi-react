import React, { useState, useEffect } from 'react'
import {
  Tooltip, Typography, Button, Tabs, Tab, IconButton
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import { ArrowBack } from '@mui/icons-material'
import Actions from './Actions'
import Trends from './Trends'
import Permissions from './Permissions'
import boomerang from 'boomerang-http'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'Apps'
})

const Apps = ({ match, history }) => {
  const appDomain = decodeURIComponent(match.params.app)
  const [appName, setAppName] = useState(appDomain)
  const [appIcon, setAppIcon] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const classes = useStyles()

  useEffect(() => {
    (async () => {
      console.log('icon url:', `https://${appDomain}/favicon.ico`)
      setAppIcon(`https://${appDomain}/favicon.ico`)
      try {
        const manifest = await boomerang(
          'GET', `${appDomain.startsWith('localhost:') ? 'http' : 'https'}://${appDomain}/manifest.json`
        )
        console.log('manifest:', manifest)
        if (typeof manifest === 'object') {
          if (manifest.name && manifest.name.length < 64) {
            setAppName(manifest.name)
          } else if (manifest.short_name && manifest.short_name.length < 64) {
            setAppName(manifest.short_name)
          }
        }
      } catch (e) {/* do nothing */ }
    })()
  }, [appDomain])

  return (
    <div>
      <div className={classes.fixed_nav}>
        <IconButton
          className={classes.back_button}
          onClick={() => history.go(-1)}
          size="large">
          <ArrowBack />
        </IconButton>
        <div className={classes.top_grid}>
          <img
            src={appIcon}
            alt=''
            className={classes.app_icon}
          />
          <div>
            <Typography variant='h1'>
              {appName}
            </Typography>
            <Typography color='textSecondary'>
              {appDomain}
            </Typography>
          </div>
          <Button
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
        <Tabs
          centered
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
        >
          <Tab label='Actions' />
          <Tab label='Trends' />
          <Tab label='Permissions' />
        </Tabs>
      </div>
      {tabValue === 0 && (
        <Actions app={appDomain} />
      )}
      {tabValue === 1 && (
        <Trends />
      )}
      {tabValue === 2 && (
        <Permissions domain={appDomain} />
      )}
    </div>
  );
}

export default Apps
