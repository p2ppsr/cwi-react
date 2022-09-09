export default theme => ({
  content_wrap: {
    ...theme.templates.page_wrap,
    maxWidth: '100vw',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    padding: '0px !important',
    maxHeight: '100vh',
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
    [theme.breakpoints.up('lg')]: {
      minWidth: '22em'
    },
    [theme.breakpoints.up('xl')]: {
      minWidth: '28em'
    }
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
