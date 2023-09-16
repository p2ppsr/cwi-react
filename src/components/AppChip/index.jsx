import React, { useState, useEffect } from 'react'
import { Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
import boomerang from 'boomerang-http'
import isImageUrl from '../../utils/isImageUrl'
import { useTheme } from '@mui/styles'

const AppChip = ({
  label, showDomain = false, history, clickable = true, size = 1
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
        <img
          src={appIconImageUrl}
          id='appIcon'
          alt=''
          style={{
            width: 20 * size,
            marginLeft: 2,
            borderRadius: 4
          }}
        />
      )}
      disableRipple={!clickable}
      onClick={() => {
        if (clickable) {
          history.push(
            `/dashboard/app/${encodeURIComponent(label)}`
          )
        }
      }}
    />
  )
}

export default withRouter(AppChip)
