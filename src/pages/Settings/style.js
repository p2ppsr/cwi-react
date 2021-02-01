export default theme => ({
  content_wrap: ({ settingsMainPage }) => ({
    ...theme.templates.page_wrap,
    display: 'grid',
    gridTemplateColumns: '3fr 7fr',
    gridColumnGap: theme.spacing(5),
    padding: '0px !important',
    maxHeight: 'calc(100vh - 64px)',
    '& > :last-child': {
      maxHeight: 'inherit',
      overflowY: 'scroll'
    },
    '& > :first-child': {
      maxHeight: 'inherit',
      overflowY: 'scroll'
    },
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr 2fr'
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      maxHeight: 'unset',
      '& > :first-child': {
        display: settingsMainPage ? undefined : 'none',
        maxHeight: 'unset',
        overflowY: 'unset'
      },
      '& > :last-child': {
        display: settingsMainPage ? 'none' : undefined,
        maxHeight: 'unset',
        overflowY: 'unset'
      }
    }
  }),
  tool_grid: ({ settingsMainPage }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridColumnGap: theme.spacing(2),
    '& > :first-child': {
      display: 'none'
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: settingsMainPage
        ? '1fr'
        : 'auto 1fr',
      '& > :last-child': {
        display: 'none'
      },
      '& > :first-child': {
        display: settingsMainPage ? 'none' : 'unset !important'
      }
    }
  }),
  title: {
    color: theme.palette.common.white
  },
  back_tool_icon: {
    color: theme.palette.common.white
  }
})
