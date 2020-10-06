export default theme => ({
  content_wrap: ({ settingsMainPage }) => ({
    ...theme.templates.page_wrap,
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gridColumnGap: theme.spacing(3),
    alignItems: 'center',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr 2fr'
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      '&:first-child': {
        display: settingsMainPage ? undefined : 'none'
      },
      '&:last-child': {
        // display: settingsMainPage ? 'none' : undefined
      }
    }
  }),
  tool_grid: ({ settingsMainPage }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridColumnGap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: settingsMainPage
        ? '1fr auto'
        : 'auto 1fr auto'
    }
  }),
  title: {
    color: theme.palette.common.white
  },
  back_tool_icon: {
    color: theme.palette.common.white
  }
})
