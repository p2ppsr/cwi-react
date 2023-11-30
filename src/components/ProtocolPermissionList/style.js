export default theme => ({
  appList: {
    backgroundColor: theme.palette.background.leftMenu,
    padding: '1em 0 0 1em'
  },
  counterparty: {
    size: 0.2
  },
  revokeButton: {
    marginRight: '2em',
    '@media (max-width: 400px)': {
      marginRight: '4em'
    }
  },
  icon: {
    backgroundColor: theme.palette.primary.main
  },
  gridItem: {
    display: 'flex', alignItems: 'center', marginRight: '3em'
  }
})
