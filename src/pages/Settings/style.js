export default theme => ({
  content_wrap: {
    ...theme.templates.page_wrap,
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gridColumnGap: theme.spacing(3)
  },
  tool_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto'
  },
  back_button: {
    display: 'block',
    margin: `${theme.spacing(1)}px auto`
  },
  title: {
    color: theme.palette.common.white
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
  }
})
