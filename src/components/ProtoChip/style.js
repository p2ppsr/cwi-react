export default theme => ({
  table_picture: {
    maxWidth: '5em',
    borderRadius: '3em'
  },
  expires: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing(1),
    // visibility: 'hidden'
    display: 'none'
  },
  // Show expires on hover
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    '&:hover $expires': {
      // visibility: 'visible'
      display: 'block'
    }
  }
})
