export default theme => ({
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
  }
})
