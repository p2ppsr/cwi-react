export default theme => ({
  master_grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 2fr'
  },
  entity_icon_name_grid: {
    display: 'grid',
    gridTemplateColumns: '4em 1fr'
  },
  slider_label_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gridGap: theme.spacing(1)
  }
})
