export default theme => ({
  apps_view: {
    padding: '1em 1em 2em 1em'
  },
  gridItem: {
    flexBasis: 'calc(25% - 16px)', // For 4 items per row minus some margin
    maxWidth: 'calc(25% - 16px)',
    height: '10em',
    // [theme.breakpoints.down('md')]: {
    //   flexBasis: '50%', // 2 items per row
    //   maxWidth: '50%',
    //   height: '12em'
    // },

    // [theme.breakpoints.down('xs')]: {
    //   flexBasis: '100%', // 2 items per row
    //   maxWidth: '100%',
    //   height: 'auto'
    // },
    '@media (max-width: 1000px) and (min-width: 500px)': {
      flexBasis: '50%', // 2 items per row
      maxWidth: '50%',
      height: '12em'
    },
    '@media (max-width: 499px) and (min-width: 320px)': {
      flexBasis: '50%', // 2 items per row
      maxWidth: '50%',
      height: '8em' // smaller height
    },
    '@media (max-width: 319px) and (min-width: 0px)': {
      flexBasis: '100%', // 1 item per row
      maxWidth: '100%',
      height: '8em'
    }
  }
})
