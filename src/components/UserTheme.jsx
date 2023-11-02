import React, { useContext } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { SettingsContext } from '../context/SettingsContext'
import { CssBaseline } from '@mui/material'

const UserTheme = ({ children }) => {
  const { settings } = useContext(SettingsContext)

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
      leftMenu: '#EEEEEE'
    },
    mode: 'light'
  }

  const darkPalette = {
    primary: {
      main: '#FFFFFF'
    },
    secondary: {
      main: '#FC433F'
    },
    background: {
      default: '#1D2125',
      paper: '#1D2125',
      leftMenu: '#161616',
      leftMenuHover: '#2E2E2E',
      leftMenuSelected: '#2E2E2E'
    },
    mode: 'dark'
  }

  // Choose the palette based on the theme mode from settings
  // const selectedPalette = settings.themeMode === 'dark' ? darkPalette : lightPalette

  return (
    <ThemeProvider
      theme={(theme) => {
        return createTheme({
          ...theme,
          palette: darkPalette
        })
      }}
    >
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default UserTheme
