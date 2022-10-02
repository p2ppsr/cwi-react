import React, { useState, useEffect } from 'react'
import { Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
import boomerang from 'boomerang-http'

const AppChip = ({ label, history, clickable = true, size = 1 }) => {
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

  useEffect(() => {
    (async () => {
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
        <object
          data={`https://${label}/favicon.ico`}
          alt=''
          style={{
            width: 20 * size,
            marginLeft: 8,
            borderRadius: 4
          }}
          type='image/x-icon'
        >
          <img
            src='https://projectbabbage.com/favicon.ico'
            alt=''
            style={{
              width: 20 * size,
              marginLeft: 2,
              borderRadius: 4
            }}
          />
        </object>
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
