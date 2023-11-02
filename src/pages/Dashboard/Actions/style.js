export default theme => ({
  apps_view: {
    padding: '1em 1em 2em 1em'
  },
  gridItem: {
    flexBasis: 'calc(25% - 16px)', // For 4 items per row minus some margin.
    maxWidth: 'calc(25% - 16px)',
    height: '10em',

    // [theme.breakpoints.down('md')]: {
    //   flexBasis: '50%', // 2 items per row
    //   maxWidth: '50%',
    //   height: '12em'
    // },

    // [theme.breakpoints.down('sm')]: {
    //   flexBasis: '50%', // 2 items per row
    //   maxWidth: '50%',
    //   height: 'auto' // adjust based on content or set a specific value
    // },
    '@media (max-width: 1000px) and (min-width: 661px)': {
      flexBasis: '50%', // 2 items per row
      maxWidth: '50%',
      height: '12em'
    }
  }
})
