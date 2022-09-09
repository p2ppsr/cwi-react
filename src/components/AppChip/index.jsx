import React, { useState, useEffect } from 'react'
import { Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
import boomerang from 'boomerang-http'

const AppChip = ({ label, history }) => {
  const [parsedLabel, setParsedLabel] = useState(
    label.substring(12)
  )

  useEffect(() => {
    (async () => {
      try {
        const manifest = await boomerang(
          'GET',
          `https://${label.substring(12)}/manifest.json`
        )
        setParsedLabel(manifest.name)
      } catch (e) { /* ignore, nothing we can do and not our problem */ }
    })()
  }, [label])

  return (
    <Chip
      style={{
        margin: '8px'
      }}
      label={parsedLabel}
      icon={(
        <img
          src={`https://${label.substring(12)}/favicon.ico`}
          alt=''
          style={{
            width: 20,
            marginLeft: 8,
            borderRadius: 4
          }}
        />
      )}
      onClick={() => {
        history.push(
          `/dashboard/app/${encodeURIComponent(label.substring(12))}`
        )
      }}
    />
  )
}

export default withRouter(AppChip)
