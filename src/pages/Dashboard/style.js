export default theme => ({
  content_wrap: {
    ...theme.templates.page_wrap,
    maxWidth: '100%',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    padding: '0px !important',
    maxHeight: '800px',
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
    height: '100%',
    backgroundColor: theme.palette.grey[200]
  },
  sig_wrap: {
    marginTop: 'max(0px, calc(100vh - 39.5em))',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('xl')]: {
      marginTop: 'max(0px, calc(100vh - 44.5em))'
    }
  },
  signature: {
    userSelect: 'none'
  }
})
