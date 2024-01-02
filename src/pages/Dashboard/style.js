export default theme => ({
  content_wrap: {
    ...theme.templates.page_wrap,
    backgroundColor: theme.palette.background.mainSection,
    ...theme.palette.background.withImage,
    maxWidth: '100vw',
    maxHeight: '100vh',
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
      // maxWidth: `calc(1280px + ${theme.spacing(6)})`,
      '@media (min-width: 1500px)': {
        margin: ({ breakpoints }) => ((breakpoints.sm || breakpoints.xs) ? '0' : 'auto')
      },
      '@media (max-width: 1501px) and (min-width: 100px)': {
        margin: '0px'
      }
    }
  },
  list_wrap: {
    minWidth: '16em',
    height: '100vh',
    backgroundColor: theme.palette.background.leftMenu,
    '& .MuiListItem-button': {
      '&:hover': {
        backgroundColor: theme.palette.background.leftMenuHover
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.background.leftMenuSelected,
      }
    }
  },
  page_container: {
    height: '100vh',
    maxWidth: theme.maxContentWidth,
    '&::-webkit-scrollbar': {
      width: '0.45em'
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.scrollbarTrack,
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
