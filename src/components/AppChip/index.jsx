import React, { useState, useEffect } from 'react'
import { Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
import boomerang from 'boomerang-http'
import isImageUrl from '../../utils/isImageUrl'

const AppChip = ({ label, history, clickable = true, size = 1 }) => {
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
          `https://${label}/manifest.json`
        )
        setParsedLabel(manifest.name)
      } catch (e) { /* ignore, nothing we can do and not our problem */ }
    })()
  }, [label])

  return (
    <Chip
      style={{
        margin: `${8 * size}px`,
        paddingTop: `${16 * size}px`,
        paddingBottom: `${16 * size}px`
      }}
      label={<span style={{ fontSize: `${size}em` }}>{parsedLabel}</span>}
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
