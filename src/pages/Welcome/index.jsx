import React, { useState, useContext } from 'react'
import {
  Typography,
  Button,
  Grid
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import { SettingsProvider, SettingsContext } from '../../context/SettingsContext.js'
import UserTheme from '../../components/UserTheme.jsx'
import DarkModeImage from '../../images/darkMode'
import LightModeImage from '../../images/lightMode'

const useStyles = makeStyles(style, {
  name: 'Welcome'
})

const Welcome = ({ history }) => {
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

  // Supported Defaults
  const currencies = {
    USD: '$10',
    BSV: '0.033',
    SATS: '3,333,333',
    EUR: '€9.15',
    GDP: '£7.86'
  }
  const themes = ['Light', 'Dark']

  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  // Handle changing the defualts
  // TODO: use kvstore on show dashboard click
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme)
  }
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency)
  }

  return (
    <SettingsProvider>
      <UserTheme>
        <div
          className={classes.content_wrap} style={{
            backgroundColor: selectedTheme === 'Light' ? 'White' : 'rgba(0,0,0,0)',
            backgroundImage: selectedTheme === 'Light'
              ? 'linear-gradient(to bottom, rgba(255,255,255,1.0), rgba(255,255,255,0.85)), url(https://cdn.projectbabbage.com/media/pictures/mainBackground.jpg)'
              : 'linear-gradient(to bottom, rgba(20,20,20,1.0), rgba(20,20,20,0.85)), url(https://cdn.projectbabbage.com/media/pictures/mainBackground.jpg)'
          }}
        >
          <center className={classes.content}>
            <Grid container direction='column' alignItems='center' spacing={2} padding='0.5em' style={{ color: selectedTheme === 'Light' ? 'Black' : 'White' }}>
              <Grid item xs={12}>
                <Typography variant='h1' paragraph style={{ color: selectedTheme === 'Light' ? 'Black' : 'White' }}>
                  Your portal to the MetaNet — And beyond!
                </Typography>
                <Typography variant='h4'>
                  Let's start by setting your preferences.
                </Typography>
                <Typography paragraph paddingTop='2em'>
                  Default Theme
                </Typography>
              </Grid>
              <Grid item container spacing={1} justifyContent='center'>
                {
                  themes.map(theme => (
                    <Grid item key={theme}>
                      <Button
                        onClick={() => handleThemeChange(theme)}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 10,
                          boxShadow: selectedTheme === theme ? '0px 0px 8px 2px #E04040' : 'none',
                          color: theme === 'Light' ? 'Black' : 'White',
                          backgroundColor: theme === 'Light' ? '#111111' : '#444444',
                          marginRight: '10px'
                        }}
                      >
                        {theme === 'Light' ? <LightModeImage /> : <DarkModeImage />}
                      </Button>
                    </Grid>
                  ))
                }
              </Grid>
              <Grid container spacing={1} justifyContent='center' padding='2em'>
                <Typography paragraph paddingTop='2em'>
                  Default Currency
                </Typography>
                <Grid item xs={12} container direction='row' justifyContent='center' alignItems='center' spacing={1}>
                  {
                      Object.keys(currencies).map(currency => {
                        return (
                          <Grid item key={currency}>
                            <Button
                              variant={selectedCurrency === currency ? 'contained' : 'outlined'}
                              style={{
                                boxShadow: selectedCurrency === currency ? '0px 0px 8px 2px #E04040' : 'none',
                                backgroundColor: selectedCurrency === currency ? '#444444' : (selectedTheme === 'Light' ? '#EEEEEE' : 'Black'),
                                color: selectedCurrency === currency ? 'white' : '#888888'
                              }}
                              onClick={() => handleCurrencyChange(currency)}
                              color='primary'
                            >
                              <div>
                                <div>{currency}</div>
                                <div>{currencies[currency]}</div>
                              </div>
                            </Button>
                          </Grid>
                        )
                      })
                  }
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'
                  size='large'
                  className={classes.button}
                  sx={{ marginTop: '3em' }}
                >
                  View Dashboard
                </Button>
              </Grid>
            </Grid>
          </center>
        </div>
      </UserTheme>
    </SettingsProvider>
  )
}

export default Welcome
