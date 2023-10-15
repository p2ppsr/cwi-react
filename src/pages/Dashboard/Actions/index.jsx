import React, { useEffect, useState, useRef } from 'react'
import { Typography, Grid, Container, TextField } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import style from './style'
import { useBreakpoint } from '../../../utils/useBreakpoints'
import Profile from '../../../components/Profile'
import MetaNetApp from '../../../components/MetaNetApp'
import SearchIcon from '@mui/icons-material/Search'
import parseAppManifest from '../../../utils/parseAppManifest'
import isImageUrl from '../../../utils/isImageUrl'
import Fuse from 'fuse.js'

const getApps = async () => {
  const results = await window.CWI.ninja.getTransactionLabels({
    prefix: 'babbage_app_',
    sortBy: 'label'
  })
  if (results && Array.isArray(results.labels)) {
    return results.labels.map(x => {
      return x.label.replace(/^babbage_app_/, '')
    })
  }
  return []
}

const useStyles = makeStyles(style, {
  name: 'Actions'
})
const Actions = ({ history }) => {
  const classes = useStyles()
  const theme = useTheme()
  const breakpoints = useBreakpoint()
  const inputRef = useRef(null)
  const storageKey = 'cached_apps'

  const [apps, setApps] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [fuseInstance, setFuseInstance] = useState(null)
  const [search, setSearch] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  // Configure fuse to search by app name
  const options = {
    // shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    includeMatches: true,
    useExtendedSearch: true,
    keys: ['appName']
  }

  const handleSearchChange = async (e) => {
    const value = e.target.value
    setSearch(value)

    // Clear the filtered apps once the text box is empty (instead of searching for empty)
    if (value === '') {
      setFilteredApps(apps)
      return
    }

    // Search for a matching app by name
    if (fuseInstance) {
      const results = fuseInstance.search(value).map(match => match.item)
      setFilteredApps(results)
    }
  }

  // Support the search field expand animation
  const handleSearchFocus = () => {
    setIsExpanded(true)
  }
  const handleSearchBlur = () => {
    setIsExpanded(false)
  }
  const handleIconClick = () => {
    setIsExpanded(true)
    inputRef.current.focus()
  }

  useEffect(async () => {
    // Obtain a list of all apps ordered alphabetically
    try {
      // Check if there is storage app data for this session
      let parsedAppData = JSON.parse(sessionStorage.getItem(storageKey))

      if (parsedAppData) {
        setApps(parsedAppData)
      } else {
        const results = await getApps()
        const dataPromises = results.map(async (domain, index) => {
          let appIconImageUrl
          let appName = domain
          try {
            if (await isImageUrl(`https://${domain}/favicon.ico`)) {
              appIconImageUrl = `https://${domain}/favicon.ico`
            }
            // Try to parse the app manifest to find the app info
            const manifest = await parseAppManifest({ domain })
            if (typeof manifest.name === 'string') {
              appName = manifest.name
            }
          } catch (e) {
            console.error(e)
          }

          return { appName, appIconImageUrl, domain }
        })
        parsedAppData = await Promise.all(dataPromises)

        // Store the current fetched apps in sessionStorage for a better UX
        sessionStorage.setItem(storageKey, JSON.stringify(parsedAppData))
      }
      setApps(parsedAppData)
      setFilteredApps(parsedAppData)

      // Initialize fuse for filtering apps
      const fuse = new Fuse(parsedAppData, options)
      setFuseInstance(fuse)
    } catch (error) {
      console.error(error)
    }
  }, [])
  return (
    <>
      {(!breakpoints.sm && !breakpoints.xs)
        ? (
          <div className={classes.fixed_nav}>
            <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <TextField
                variant='outlined'
                fullWidth
                value={search}
                onChange={handleSearchChange}
                placeholder='Search'
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                inputRef={inputRef}
                InputProps={{
                  startAdornment: (
                    <SearchIcon onClick={handleIconClick} style={{ marginRight: '8px' }} />
                  ),
                  sx: {
                    borderRadius: '25px',
                    height: '3em'
                  }
                }}
                sx={{
                  marginTop: theme.spacing(3),
                  marginBottom: theme.spacing(2),
                  width: isExpanded ? 'calc(50%)' : '8em',
                  transition: 'width 0.3s ease'
                }}
              />
            </Container>
            <Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
              All Apps
            </Typography>
            <Grid container spacing={2}>
              {filteredApps.map((app, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <MetaNetApp
                    appName={app.appName}
                    iconImageUrl={app.appIconImageUrl}
                    domain={app.domain}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
          )
        : (
          <Profile />
          )}
    </>
  )
}

export default Actions
