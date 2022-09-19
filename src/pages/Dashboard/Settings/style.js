export default theme => ({
  show_div: {
    display: 'grid'
  },
  hide_div: {
    display: 'none'
  },
  fixed_nav: {
    backgroundColor: theme.palette.common.white,
    position: 'sticky',
    top: theme.spacing(-3),
    margin: theme.spacing(-3),
    marginBottom: theme.spacing(4),
    zIndex: 1000,
    boxSizing: 'border-box',
    padding: theme.spacing(3)
  }
})
