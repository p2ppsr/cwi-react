export default theme => ({
  app_icon: {
    minWidth: '8em',
    minHeight: '8em',
    maxHeight: '8em',
    maxWidth: '8em',
    borderRadius: '4px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  title: {
    marginTop: theme.spacing(3)
  },
  fabs_wrap: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    margin: `${theme.spacing(7)} auto`,
    placeItems: 'center'
  },
  slider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5),
    width: '80%'
  },
  select: {
    width: '100%'
  },
  button_icon: {
    marginRight: theme.spacing(1)
  },
  // Style the spending details Collapsible Trigger button
  CustomTriggerCSS: {
    border: '5px',
    borderColor: 'black',
    borderRadius: '10px',
    borderStyle: 'solid',
    borderWidth: '2px',
    boxShadow: '0 3px 5px 2px rgba(40, 40, 40, .15)',
    color: 'black',
    height: 48,
    padding: '9px',
    margin: '9px',
    placeItems: 'center',
    cursor: 'pointer',
    fontSize: '14px'
  }
})
