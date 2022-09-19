export default theme => ({
  max_width: {
    maxWidth: '100vh'
  },
  content_wrap: theme.templates.page_wrap,
  logo: {
    margin: 'auto',
    display: 'block',
    width: '12em !important',
    height: '12em !important',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('lg')]: {
      width: '8em !important',
      height: '8em !important'
    }
  },
  panel_header: {
    position: 'relative'
  },
  panel_body: {
    position: 'relative'
  },
  expansion_icon: {
    marginRight: '0.5em'
  },
  complete_icon: {
    position: 'absolute',
    right: '24px',
    color: 'green',
    transition: 'all 0.25s',
    [theme.breakpoints.down('lg')]: {
      right: '8px'
    }
  },
  panel_heading: {
    fontWeight: 'blod'
  },
  recovery_link: {
    display: 'block',
    margin: `${theme.spacing(1)} auto`
  },
  copyright_text: {
    fontSize: '0.66em'
  },
  password_grid: {
    display: 'grid',
    gridGap: theme.spacing(1),
    width: '100%',
    gridTemplateColumns: '1fr'
  },
  new_password_grid: {
    display: 'grid',
    gridGap: theme.spacing(1),
    width: '100%',
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 1fr'
    }
  }
})
