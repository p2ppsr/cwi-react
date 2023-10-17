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
import { Img } from 'uhrp-react'
const useStyles = makeStyles(style, { name: 'apps' })

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
      <div className={classes.list_container}>
        <div><Actions app={appDomain} /></div>
        <div><Trends /></div>
        <div><Permissions domain={appDomain} /></div>
      </div>
    </div>
  )
}

export default Apps
