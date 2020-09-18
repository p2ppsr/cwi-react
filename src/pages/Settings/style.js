export default theme => ({
  content_wrap: {
    ...theme.templates.page_wrap,
    marginTop: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gridColumnGap: theme.spacing(3),
    alignItems: 'center',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr 2fr'
    }
  },
  tool_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto'
  },
  title: {
    color: theme.palette.common.white
  },
  settings_icon: {
    width: 96,
    height: 96,
    color: theme.palette.grey[700]
  }
})
