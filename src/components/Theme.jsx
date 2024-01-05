import React from 'react'
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles'
import { withStyles } from '@mui/styles'
import { ExchangeRateContextProvider } from './AmountDisplay/ExchangeRateContextProvider'

const baseTheme = createTheme(adaptV4Theme({
  spacing: 8,
  maxContentWidth: '1440px',
  typography: {
    h1: {
      fontWeight: 'bold',
      fontSize: '2.5em',
      color: '#424242'
    },
    h2: {
      fontWeight: 'bold',
      fontSize: '1.7em',
      color: '#1b1b1b'
    },
    h3: {
      fontSize: '1.4em',
      color: '#1b1b1b'
    },
    h4: {
      fontSize: '1.25em'
    },
    h5: {
      fontSize: '1.1em'
    },
    h6: {
      fontSize: '1em'
    }
  },
  palette: {
    primary: {
      main: '#424242'
    },
    secondary: {
      main: '#FC433F'
    }
  },
  overrides: {}
}))

const extendedTheme = theme => ({
  ...theme,
  typography: {
    ...theme.typography,
    h1: {
      ...theme.typography.h1,
      [theme.breakpoints.down('md')]: {
        fontSize: '1.8em'
      }
    },
    h2: {
      ...theme.typography.h2,
      [theme.breakpoints.down('md')]: {
        fontSize: '1.6em'
      }
    }
  },
  templates: {
    page_wrap: {
      maxWidth: `min(${theme.maxContentWidth}, 100vw)`,
      margin: 'auto',
      boxSizing: 'border-box',
      padding: theme.spacing(7),
      [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(5)
      }
    },
    subheading: {
      textTransform: 'uppercase',
      letterSpacing: '6px',
      fontWeight: '700'
    },
    boxOfChips: {
      display: 'flex',
      justifyContent: 'left',
      flexWrap: 'wrap'
    },
    chipContainer: {
      fontSize: '0.95em',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      alignItems: 'center',
      '&:hover $expiryHoverText': {
        visibility: 'visible',
        opacity: 1
      },
      marginLeft: '0.4em'
    },
    expiryHoverText: {
      fontSize: '0.95em',
      color: theme.palette.text.secondary,
      textAlign: 'center',
      visibility: 'hidden',
      opacity: 0,
      transition: 'all 0.3301s'
    },
    chip: ({ size = 1, backgroundColor } = {}) => {
      const base = {
        height: '100%',
        width: '100%',
        paddingTop: `${8 * size}px`,
        paddingBottom: `${8 * size}px`,
        paddingLeft: `${10 * size}px`,
        paddingRight: `${10 * size}px`
      }
      if (typeof backgroundColor === 'string') {
        base.backgroundColor = backgroundColor
      }
      return base
    },
    chipLabel: {
      // marginLeft: '0.125em',
      // textAlign: 'left'
    },
    chipLabelTitle: ({ size = 1 } = {}) => {
      return {
        fontSize: `${size}em`,
        maxWidth: '10em',
        wordWrap: 'break-word',
        whiteSpace: 'pre-line'
      }
    },
    chipLabelSubtitle: {
      fontSize: '0.9em',
      maxWidth: '10em',
      wordWrap: 'break-word',
      whiteSpace: 'pre-line',
      color: theme.palette.text.secondary
    }
  }
})

const Theme = withStyles({
  '@global html': {
    padding: '0px',
    margin: '0px'
  },
  '@global body': {
    padding: '0px',
    margin: '0px',
    fontFamily: 'helvetica'
  },
  '@global a': {
    textDecoration: 'none',
    color: '#424242'
  },
  '@global h1': {
    fontWeight: 'bold',
    fontSize: '2.5em',
    color: '#424242'
  },
  '@global h2': {
    fontWeight: 'bold',
    fontSize: '1.7em',
    color: '#1b1b1b'
  },
  '@global h3': {
    fontSize: '1.4em',
    color: '#1b1b1b'
  },
  '@global h4': {
    fontSize: '1.25em'
  },
  '@global h5': {
    fontSize: '1.1em'
  },
  '@global h6': {
    fontSize: '1em'
  }
})(({ children }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={baseTheme}>
      <ThemeProvider theme={extendedTheme}>
        <ExchangeRateContextProvider>
          {children}
        </ExchangeRateContextProvider>
      </ThemeProvider>
    </ThemeProvider>
  </StyledEngineProvider>
))

export default Theme
