import React, { useState, useEffect } from 'react'
import { Typography, Button, IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import Actions from './Actions'
import Trends from './Trends'
import Permissions from './Permissions'
import boomerang from 'boomerang-http'
import style from './style'
import isImageUrl from '../../../utils/isImageUrl'

const useStyles = makeStyles(style, {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'row'
  },
  top_grid: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px', // Add this line to create a gap between the back button and the app icon
    padding: '16px'
  },
  back_button: {
    marginRight: '16px'
  },
  list_container: {
    display: 'grid',
    gridTemplateRows: 'repeat(auto-fill, minmax(25%, 1fr))'
  },
  app_icon: {
    width: '48px',
    name: 'Apps'
  }
})

const Apps = ({ match, history }) => {
  const appDomain = decodeURIComponent(match.params.app)
  const [appName, setAppName] = useState(appDomain)
  const [appIcon, setAppIcon] = useState('')

  useEffect(() => {
    (async () => {
      // Validate that the default favicon path is actually an image
      if (await isImageUrl(`https://${appDomain}/favicon.ico`)) {
        setAppIcon(`https://${appDomain}/favicon.ico`)
      } else {
        setAppIcon('https://projectbabbage.com/favicon.ico')
      }
      try {
        const manifest = await boomerang(
          'GET', `${appDomain.startsWith('localhost:') ? 'http' : 'https'}://${appDomain}/manifest.json`
        )
        if (typeof manifest === 'object') {
          if (manifest.name && manifest.name.length < 64) {
            setAppName(manifest.name)
          } else if (manifest.short_name && manifest.short_name.length < 64) {
            setAppName(manifest.short_name)
          }
        }
      } catch (e) {
        /* do nothing */
      }
    })()
  }, [appDomain])

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div
          className={classes.top_grid}
          backgroundColor='white'
        >
          <IconButton
            className={classes.back_button}
            onClick={() => history.go(-1)}
            size='large'
          >
            <ArrowBack />
          </IconButton>
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
      </div>
      <div className={classes.list_container}>
        <div><Actions app={appDomain} /></div>
        <div><Trends /></div>
        <div><Permissions domain={appDomain} /></div>
      </div>
    </div>
  )
}

export default Apps
