export default theme => ({
  app_icon: {
    minWidth: '8em',
    minHeight: '8em',
    maxHeight: '8em',
    maxWidth: '8em',
    borderRadius: '4px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  title: {
    marginTop: theme.spacing(3)
  },
  button_bar: {
    marginTop: 'max(0px, calc(100vh - 27rem))',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      marginTop: 'max(0px, calc(100vh - 26rem))'
    }
  }
})
