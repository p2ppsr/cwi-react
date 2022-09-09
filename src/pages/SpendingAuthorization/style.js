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
  fabs_wrap: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    margin: `${theme.spacing(7)} auto`,
    placeItems: 'center'
  },
  button_bar: {
    marginTop: 'max(0px, calc(100vh - 44rem))',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      marginTop: 'max(0px, calc(100vh - 42rem))'
    }
  },
  slider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5)
  },
  select: {
    width: '100%'
  },
  button_icon: {
    marginRight: theme.spacing(1)
  }
})
