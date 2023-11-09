export default theme => ({
  oracles_url_container: {
    display: 'inline-flex',
    alsignItems: 'flex-start',
    gap: '16px'
  },
  oracles_url: {
    display: 'flex',
    padding: '16px 0px',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '4px',
    '&:hover': {
      borderRadius: '8px',
      border: '1px solid #EEE',
      background: '#EEE'
    }
  },
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
    gridColumnGap: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
      gridRowGap: theme.spacing(3)
    }
  },
  entity_icon_name_grid: {
    display: 'grid',
    gridTemplateColumns: '4em 1fr',
    alignItems: 'center',
    gridGap: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: '6px'
  },
  clickable_entity_icon_name_grid: {
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
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    gridGap: theme.spacing(2)
  },
  slider_label_delete_grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gridGap: theme.spacing(2)
  }
})
