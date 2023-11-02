import React, { useContext, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { SettingsContext } from '../context/SettingsContext'
import { CssBaseline } from '@mui/material'

const UserTheme = ({ children }) => {
  const { settings } = useContext(SettingsContext)
  const [backgroundImage, setBackgroundImage] = useState('https://images.pexels.com/photos/18857526/pexels-photo-18857526/free-photo-of-larch-heaven.jpeg')

  // Define custom colors for light and dark modes
  const lightPalette = {
    primary: {
      main: '#424242'
    },
    secondary: {
      main: '#FC433F'
    },
    background: {
      default: '#FFFFFF',
      paper: '#F6F6F6',
      leftMenu: '#EEEEEE',
      leftMenuHover: '#E0E0E0',
      leftMenuSelected: '#E0E0E0',
      scrollbarThumb: '#DCDCDC',
      app: '#FFFFFF1E',
      withImage: {
        backgroundImage: `linear-gradient(to bottom, #FFFFFF, #FFFFFF9c), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    },
    mode: 'light'
  }

  const darkPalette = {
    primary: {
      main: '#FFFFFF',
      secondary: '#5E5E5E' // Consider naming convention here...
    },
    secondary: {
      main: '#FC433F'
    },
    background: {
      default: '#1D2125',
      paper: '#1D2125',
      leftMenu: '#161616',
      leftMenuHover: '#2E2E2E',
      leftMenuSelected: '#2E2E2E',
      scrollbarThumb: '#4E4E4E',
      app: '#161616AF',
      withImage: {
        background: `linear-gradient(to bottom, #1D2125, #1D212564), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    },
    mode: 'dark'
  }

  const customDarkPalette = {
    ...darkPalette,
    background: {
      ...darkPalette.background,
      withImage: {
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: `linear-gradient(to bottom, #1D2125, #1D212564), url(${backgroundImage})`,
          backgroundBlendMode: 'luminosity',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          zIndex: -1
        }
      }
    }
  }

  // Choose the palette based on the theme mode from settings
  // const selectedPalette = settings.themeMode === 'dark' ? darkPalette : lightPalette

  return (
    <ThemeProvider
      theme={(theme) => {
        return createTheme({
          ...theme,
          palette: customDarkPalette
        })
      }}
    >
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default UserTheme
