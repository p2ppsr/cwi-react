export default theme => ({
  content_wrap: {
    ...theme.templates.page_wrap,
    maxWidth: '100%',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns:  ({ breakpoints }) => (
      (breakpoints.sm || breakpoints.xs) ? '1fr' : 'auto 1fr'
    ),
    padding: '0px !important',
    '& > :last-child': {
      maxHeight: 'inherit',
      overflow: 'scroll',
      boxSizing: 'border-box',
      padding: theme.spacing(3),
      maxWidth: `calc(1280px + ${theme.spacing(6)})`,
      width: '100%',
      margin: '0px auto'
    }
  },
  list_wrap: {
    overflowY: 'scroll',
    minWidth: '16em',
    height: '100vh',
    backgroundColor: theme.palette.grey[200],
    display: ({ breakpoints }) => (
      (breakpoints.sm || breakpoints.xs) ? 'none' : 'block'
    )
  },
  page_container: {
    height: '100vh',
    overflowY: 'scroll'
  },
  sig_wrap: {
    bottom: '1em',
    marginBottom: theme.spacing(2)
  },
  signature: {
    userSelect: 'none'
  }
})
