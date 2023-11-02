import React, { useEffect, useState, useRef } from 'react'
import { Typography, Grid, Container, TextField, LinearProgress } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import style from './style'
import { useBreakpoint } from '../../../utils/useBreakpoints'
import Profile from '../../../components/Profile'
import MetaNetApp from '../../../components/MetaNetApp'
import SearchIcon from '@mui/icons-material/Search'
import parseAppManifest from '../../../utils/parseAppManifest'
import isImageUrl from '../../../utils/isImageUrl'
import Fuse from 'fuse.js'
import POPULAR_APPS from '../../../constants/popularApps'
import Monkey from '../../../images/cautionIcon'

const getApps = async ({ sortBy = 'label', limit }) => {
  const results = await window.CWI.ninja.getTransactionLabels({
    prefix: 'babbage_app_',
    sortBy
  })
  if (limit === undefined) {
    limit = results.length
  }
  if (results && Array.isArray(results.labels)) {
    return results.labels.map(x => {
      return x.label.replace(/^babbage_app_/, '')
    }).slice(0, limit)
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
  const [apps, setApps] = useState([])
  const [recentApps, setRecentApps] = useState([])

  const [filteredApps, setFilteredApps] = useState([])
  const [fuseInstance, setFuseInstance] = useState(null)
  const [search, setSearch] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingRecentApps, setLoadingRecentApps] = useState(false)

  const inputRef = useRef(null)
  const storageKeyApps = 'cached_apps'

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

  const resolveAppDataFromDomain = async ({ appDomains }) => {
    const dataPromises = appDomains.map(async (domain, index) => {
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
    return await Promise.all(dataPromises)
  }

  useEffect(async () => {
    // Obtain a list of all apps ordered alphabetically
    try {
      // Check if there is storage app data for this session
      let parsedAppData = JSON.parse(window.sessionStorage.getItem(storageKeyApps))

      // Parse out the app data from the domains
      if (!parsedAppData) {
        setLoading(true)
        const appDomains = await getApps({ sortBy: 'label' })
        parsedAppData = await resolveAppDataFromDomain({ appDomains })
        // Store the current fetched apps in sessionStorage for a better UX
        window.sessionStorage.setItem(storageKeyApps, JSON.stringify(parsedAppData))
      }
      setApps(parsedAppData)
      setFilteredApps(parsedAppData)
      setLoadingRecentApps(true)

      // Always fetch recent apps to keep it updated
      const recentAppsFetched = await getApps({ sortBy: 'whenLastUsed', limit: 4 })
      const parsedRecentAppData = await resolveAppDataFromDomain({ appDomains: recentAppsFetched })
      setRecentApps(parsedRecentAppData)

      // Initialize fuse for filtering apps
      const fuse = new Fuse(parsedAppData, options)
      setFuseInstance(fuse)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
    setLoadingRecentApps(false)
  }, [])

  return (
    <>
      {(!breakpoints.sm && !breakpoints.xs)
        ? (
          <div className={classes.apps_view}>
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

            {(search === '') && <>
              {(!loadingRecentApps && recentApps.length < 4)
                ? (
                  <><Typography variant='h3' color='textPrimary' gutterBottom style={{ paddingBottom: '0.2em' }}>
                    Popular Apps
                    </Typography>
                    <Grid container spacing={2} alignItems='center' justifyContent='space-around' className={classes.apps_view}>
                      {POPULAR_APPS.map((app, index) => (
                        <Grid item key={index} className={classes.gridItem}>
                          <MetaNetApp
                            appName={app.appName}
                            iconImageUrl={app.appIconImageUrl}
                            domain={app.domain}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                  )
                : (
                  <><Typography variant='h3' color='textPrimary' gutterBottom style={{ paddingBottom: '0.2em' }}>
                    Your Recent Apps
                    </Typography>
                    <Grid container spacing={2} alignItems='center' justifyContent='space-around' className={classes.apps_view}>
                      {recentApps.map((app, index) => (
                        <Grid item key={index} className={classes.gridItem}>
                        <MetaNetApp
                            appName={app.appName}
                            iconImageUrl={app.appIconImageUrl}
                            domain={app.domain}
                          />
                      </Grid>
                      ))}
                    </Grid>
                  </>
                  )}
              <Typography variant='h3' color='textPrimary' gutterBottom style={{ paddingBottom: '0.2em' }}>
                All Your Apps
              </Typography>
            </>}

            {loading ? <LinearProgress style={{ marginTop: '1em' }} /> : <></>}
            {(filteredApps.length === 0 && !loading) && <>
              <center>
                <Typography variant='h2' align='center' color='textSecondary' paddingTop='2em'>No apps found!</Typography>
                {/* <img
                  src=''
                  paddingTop='1em'
                /> */}
                <Monkey />
              </center>

                                                        </>}

            <Grid container spacing={2}>
              {filteredApps.map((app, index) => (
                <Grid item xs={12} sm={6} md={3} lg={3} key={index} height='10em'>
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
