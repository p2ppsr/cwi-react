export default theme => ({
  fixed_nav: {
    backgroundColor: theme.palette.common.white,
    position: 'sticky',
    top: theme.spacing(-3),
    margin: theme.spacing(-3),
    marginBottom: theme.spacing(4),
    zIndex: 1000,
    boxSizing: 'border-box',
    padding: theme.spacing(3)
  },
  pending_title_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gridGap: theme.spacing(3)
  },
  action_card: {
    marginBottom: theme.spacing(3)
  },
  pending_action_buttons: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gridGap: theme.spacing(3)
  },
  buy_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridGap: theme.spacing(7),
    placeItems: 'center'
  }
})
