export default theme => ({
  title_bg: {
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridColumnGap: theme.spacing(2),
    alignItems: 'center'
  },
  title: {
    color: theme.palette.common.white
  },
  iconButton: {
    color: theme.palette.text.secondary
  }
})
