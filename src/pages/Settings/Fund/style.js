export default theme => ({
  pending_payment: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[100],
    boxShadow: theme.shadows[4],
    marginBottom: theme.spacing(4),
    padding: theme.spacing(1)
  },
  pending_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gridColumnGap: theme.spacing(2),
    alignItems: 'center',
    marginTop: theme.spacing(1) 
  },
  balance_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridColumnGap: theme.spacing(2),
    alignItems: 'center' 
  },
  input_field: {
    minWidth: '6em'
  }
})
