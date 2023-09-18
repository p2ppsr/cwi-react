import React, { useState, useEffect } from 'react'
import { Chip, Badge, Tooltip, Avatar } from '@mui/material'
import { withRouter } from 'react-router-dom'
import boomerang from 'boomerang-http'
import isImageUrl from '../../utils/isImageUrl'
import { useTheme } from '@mui/styles'
import confederacyHost from '../../utils/confederacyHost'
import { Img } from 'uhrp-react'
import Memory from '@mui/icons-material/Memory'

const AppChip = ({
  label, showDomain = false, history, clickable = true, size = 1, onClick
}) => {
  const theme = useTheme()
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
        paddingBottom: `${16 * size}px`
      }}
      label={
        (showDomain && label !== parsedLabel)
          ? <div style={{
            textAlign: 'left'
          }}>
            <span style={{ fontSize: `${size * 0.6}em`, fontWeight: 'bold' }}>
              {parsedLabel}
            </span>
            <br />
            <span
              style={{
                fontSize: `${size * 0.5}em`,
                color: theme.palette.text.secondary
              }}
            >
              {label}
            </span>
          </div>
          : <span style={{ fontSize: `${size}em` }}>{parsedLabel}</span>}
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
                backgroundColor: 'darkred',
                width: 8 * size,
                height: 8 * size,
                borderRadius: size,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: `${(1.2 * 0.4) * size}em`,
                marginRight: `${(0.25 * 0.4) * size}em`,
                marginBottom: `${(0.3 * 0.4) * size}em`
              }}
            >
                <Memory style={{
                  width: (16 * 0.4) * size,
                  height: (16 * 0.4) * size
                }} />
              </Avatar>
            </Tooltip>
          }
        >
          <Avatar
            sx={{
              width: `${(3.2 * 0.4) * size}em`,
              height: `${(3.2 * 0.4) * size}em`
            }}
          >
            <Img
              src={appIconImageUrl}
              style={{
                width: '100%',
                height: '100%', 
                maxWidth: '5em',
                borderRadius: '3em'
              }}
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
