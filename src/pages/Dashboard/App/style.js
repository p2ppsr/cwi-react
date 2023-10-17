export default theme => ({
  top_grid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr auto',
    alignItems: 'center',
    gridGap: theme.spacing(2),
    boxSizing: 'border-box'
  },
  app_icon: {
    width: '5em',
    height: '5em'
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'row'
  },
  fixed_nav: {
    backgroundColor: theme.palette.common.white, // Support theming
    position: 'sticky',
    top: theme.spacing(-3),
    margin: theme.spacing(-3),
    marginBottom: theme.spacing(4),
    zIndex: 1000
  },
  launch_button: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
})
