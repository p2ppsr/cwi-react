export default theme => ({
  content_wrap: theme.templates.page_wrap,
  logo: {
    margin: 'auto',
    display: 'block',
    width: '8em',
    height: '8em',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      width: '5em',
      height: '5em'
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
    transition: 'all 0.25s'
  },
  panel_heading: {
    fontWeight: 'blod'
  },
  recovery_link: {
    display: 'block',
    margin: `${theme.spacing(1)}px auto`
  },
  copyright_text: {
    fontSize: '0.66em'
  }
})
