export default theme => ({
  content_wrap: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    display: 'grid',
    placeItems: 'center'
  },
  content: {
    margin: 'auto'
  },
  field: {
    width: '80%',
    marginBottom: theme.spacing(5)
  },
  button: {
    marginBottom: theme.spacing(3)
  }
})
