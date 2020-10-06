export default theme => ({
  password_grid: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr'
    }
  }
})
