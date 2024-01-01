import React, { useState, useEffect } from 'react'
import { Chip, Badge, Tooltip, Avatar } from '@mui/material'
import { withRouter } from 'react-router-dom'
import boomerang from 'boomerang-http'
import isImageUrl from '../../utils/isImageUrl'
import { useTheme } from '@mui/styles'
import confederacyHost from '../../utils/confederacyHost'
import { Img } from 'uhrp-react'
import Memory from '@mui/icons-material/Memory'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'AppChip'
})

const AppChip = ({
  label, showDomain = false, history, clickable = true, size = 1, onClick, backgroundColor = 'transparent'
}) => {
  const theme = useTheme()
  const classes = useStyles()
  console.log(label)
  if (typeof label !== 'string') {
    throw new Error('Error in AppChip: label prop must be a string!')
  }
  if (label.startsWith('babbage_app_')) {
    label = label.substring(12)
  }
  if (label.startsWith('https://')) {
    label = label.substring(8)
  }
  if (label.startsWith('http://')) {
    label = label.substring(7)
  }
  const [parsedLabel, setParsedLabel] = useState(label)
  const [appIconImageUrl, setAppIconImageUrl] = useState('https://projectbabbage.com/favicon.ico')

  useEffect(() => {
    (async () => {
      // Validate favicon url is a valid Image
      if (await isImageUrl(`https://${label}/favicon.ico`)) {
        setAppIconImageUrl(`https://${label}/favicon.ico`)
      }
      try {
        const manifest = await boomerang(
          'GET',
          `${label.startsWith('localhost:') ? 'http' : 'https'}://${label}/manifest.json`
        )
        setParsedLabel(manifest.name)
      } catch (e) {
        console.error(e)
        /* ignore, nothing we can do and not our problem */
      }
    })()
  }, [label])

  return (
    <Chip
      style={{
        paddingTop: `${16 * size}px`,
        paddingBottom: `${16 * size}px`,
        height: '100%',
        paddingLeft: '0.5em',
        backgroundColor
      }}
      label={
        (showDomain && label !== parsedLabel)
          ? <div style={{
            textAlign: 'left'
          }}>
            <span
              style={{
               fontSize: `${size * 1.5}em`,
               color: 'textPrimary',
               fontWeight: 'bold'
             }}
            >
              {parsedLabel}
            </span>
            <br />
            <span
              style={{
                fontSize: '1em',
                color: 'textSecondary'
              }}
            >
              {label}
            </span>
            </div>
          : <span style={{ fontSize: `${size}em` }}>{parsedLabel}</span>
}
      icon={(
        <Badge
          overlap='circular'
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          badgeContent={
            <Tooltip
              arrow
              title='App (click to learn more about apps)'
              onClick={e => {
                e.stopPropagation()
                window.open(
                  'https://projectbabbage.com/docs/babbage-sdk/concepts/apps',
                  '_blank'
                )
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: '#FFFFFF',
                  color: 'darkRed',
                  width: 20,
                  height: 20,
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1.2em',
                  marginRight: '0.25em',
                  marginBottom: '0.3em'
                }}
              >
                <Memory style={{ width: 16, height: 16 }} />
              </Avatar>
            </Tooltip>
          }
        >
          <Avatar
            variant='square'
            sx={{
              width: '2.2em',
              height: '2.2em',
              borderRadius: '4px',
              backgroundColor: '#000000AF',
              marginRight: '0.5em'
            }}
          >
            <Img
              src={appIconImageUrl}
              style={{ width: '75%', height: '75%' }}
              className={classes.table_picture}
              confederacyHost={confederacyHost()}
            />
          </Avatar>
        </Badge>
      )}
      disableRipple={!clickable}
      onClick={e => {
        if (clickable) {
          if (typeof onClick === 'function') {
            onClick(e)
          } else {
            e.stopPropagation()
            history.push(
              `/dashboard/app/${encodeURIComponent(label)}`
            )
          }
        }
      }}
    />
  )
}

export default withRouter(AppChip)
