export default theme => ({
  table_picture: {
    maxWidth: '3em'
    // borderRadius: '5em' /* was 3em */
  },
  expiryHoverText: {
    ...theme.templates.expiryHoverText
  },
  // Show expires on hover
  chipContainer: {
    ...theme.templates.chipContainer
  }
})
