import React, { useContext } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { SettingsContext } from '../context/SettingsContext'

const UserTheme = ({ children }) => {
  const { settings } = useContext(SettingsContext)

  return (
    <ThemeProvider
      theme={(theme) => {
        const palette = {
          primary: {
            main: '#424242'
          },
          secondary: {
            main: '#FC433F'
          },
          mode: settings.theme === 'dark' ? 'dark' : 'light'
        }
        return createTheme({
          ...theme,
          palette
        })
      }}
    >
      {children}
    </ThemeProvider>
  )
}

export default UserTheme
