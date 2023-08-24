export default theme => ({
  content_wrap: {
    display: 'grid'
  },
  trust_threshold: {
    maxWidth: '25em',
    minWidth: '20em',
    marginBottom: theme.spacing(5),
    placeSelf: 'center'
  },
  master_grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 2fr',
    alignItems: 'center',
    gridColumnGap: theme.spacing(3)
  },
  entity_icon_name_grid: {
    display: 'grid',
    gridTemplateColumns: '4em 1fr',
    alignItems: 'center',
    gridGap: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.3s',
    padding: theme.spacing(1),
    borderRadius: '6px',
    '&:hover': {
      boxShadow: theme.shadows[3]
    }
  },
  entity_icon: {
    width: '4em',
    height: '4em',
    borderRadius: '6px'
  },
  slider_label_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gridGap: theme.spacing(1)
  }
})
