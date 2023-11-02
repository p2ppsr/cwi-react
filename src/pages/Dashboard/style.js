export default theme => ({
  content_wrap: {
    ...theme.templates.page_wrap,
    // backgroundColor: theme.palette.background.default,
    ...theme.palette.background.withImage,
    maxWidth: '100%',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: ({ breakpoints }) => (
      (breakpoints.sm || breakpoints.xs) ? '1fr' : 'auto 1fr'
    ),
    padding: '0px !important',
    '& > :last-child': {
      maxHeight: 'inherit',
      'overflow-y': 'scroll',
      boxSizing: 'border-box',
      padding: theme.spacing(3),
      maxWidth: `calc(1280px + ${theme.spacing(6)})`,
      width: '100%',
      margin: '0px auto'
    }
  },
  list_wrap: {
    minWidth: '16em',
    height: '100vh',
    backgroundColor: theme.palette.background.leftMenu,
    display: ({ breakpoints }) => (
      (breakpoints.sm || breakpoints.xs) ? 'none' : 'block'
    ),
    '& .MuiListItem-button': {
      '&:hover': {
        backgroundColor: theme.palette.background.leftMenuHover
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.background.leftMenuSelected,
        color: theme.palette.secondary.main
      }
    }
  },
  page_container: {
    height: '100vh',
    '&::-webkit-scrollbar': {
      width: '0.45em'
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.leftMenu,
      borderRadius: '2em'
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.background.scrollbarThumb,
      borderRadius: '2em'
    }
  },
  sig_wrap: {
    bottom: '1em',
    marginBottom: theme.spacing(2)
  },
  signature: {
    userSelect: 'none'
  }
})
