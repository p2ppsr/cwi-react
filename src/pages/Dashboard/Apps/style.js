export default theme => ({
  top_grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gridGap: theme.spacing(3),
    padding: `${theme.spacing(7)} ${theme.spacing(5)}`,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.grey[200]
  },
  app_icon: {
    width: '5em',
    height: '5em'
  },
  fixed_nav: {
    backgroundColor: theme.palette.common.white,
    position: 'sticky',
    top: theme.spacing(-3),
    margin: theme.spacing(-3),
    marginBottom: theme.spacing(4),
    zIndex: 1000
  },
  back_button: {
    position: 'absolute'
  }
})
