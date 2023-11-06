export default theme => ({
  apps_view: {
    padding: '1em 1em 2em 1em'
  },
  gridItem: {
    minWidth: '16em',
    height: '14em',

    '@media (max-width: 1200px) and (min-width: 999px)': {
      height: '10em',
      maxWidth: '16em',
      minWidth: '10em'
    },
    '@media (max-width: 998px) and (min-width: 500px)': {
      height: '10em',
      minWidth: '4em'
    },
    '@media (max-width: 499px) and (min-width: 0)': {
      height: '8em',
      minWidth: '4em'
    }
  }
})
