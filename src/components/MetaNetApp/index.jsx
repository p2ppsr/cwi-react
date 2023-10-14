import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import { withRouter } from 'react-router-dom'
import isImageUrl from '../../utils/isImageUrl'
import { useTheme } from '@mui/styles'
import confederacyHost from '../../utils/confederacyHost'
import parseAppManifest from '../../utils/parseAppManifest'
import { Img } from 'uhrp-react'

const DEFAULT_APP_ICON = 'https://www.projectbabbage.com/favicon.ico'

const MetaNetApp = ({
  domain, history, onClick, clickable = true
}) => {
  const theme = useTheme()

  // Make sure valid props are provided
  if (typeof domain !== 'string') {
    throw new Error('Error in MetaNetApp Component: domain prop must be a string!')
  }

  // State variables for the app name and icon url
  const [parsedAppName, setParsedAppName] = useState('MetaNet App')
  const [appIconImageUrl, setAppIconImageUrl] = useState(DEFAULT_APP_ICON)

  useEffect(() => {
    (async () => {
      try {
        // Validate favicon url is a valid Image
        if (await isImageUrl(`https://${domain}/favicon.ico`)) {
          setAppIconImageUrl(`https://${domain}/favicon.ico`)
        }
        const manifest = await parseAppManifest({ domain })
        setParsedAppName(manifest.name)
      } catch (e) {
        console.error(e)
        /* ignore, nothing we can do and not our problem */
      }
    })()
  }, [domain])

  // Handle onClick events if supported
  const handleClick = (e) => {
    if (clickable) {
      if (typeof onClick === 'function') {
        onClick(e)
      } else {
        e.stopPropagation()
        history.push(`/dashboard/app/${encodeURIComponent(parsedAppName)}`)
      }
    }
  }

  return (
    <Card
      sx={{
        cursor: clickable ? 'pointer' : '',
        boxShadow: 'none',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        height: '100%', // Fill the container height
        justifyContent: 'center',
        maxHeight: '10em',
        width: '8.5em',
        transition: 'background 0.3s ease',
        '&:hover': clickable
          ? {
              background: theme.palette.action.hover
            }
          : ''
      }}
      onClick={handleClick}
    >
      <CardContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px'
          }}
        >
          <Img
            src={isImageUrl(appIconImageUrl) ? appIconImageUrl : DEFAULT_APP_ICON}
            alt={parsedAppName}
            style={{ maxWidth: '5em', maxHeight: '5em' }}
            confederacyHost={confederacyHost()}
          />
        </div>
        <Typography style={{
          color: theme.palette.text.primary,
          paddingTop: '0.4em'
        }}
        >
          {parsedAppName}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default withRouter(MetaNetApp)
