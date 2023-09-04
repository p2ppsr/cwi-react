export default theme => ({
  // table_picture: {
  //   maxWidth: '3em',
  //   borderRadius: '3em'
  // },
  chipContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  parentContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    margin: '10px',
    transition: 'box-shadow 0.2s ease',
    cursor: 'pointer'
  },
  basketAvatar: {
    width: '80px',
    height: '80px',
    marginRight: '20px'
  },
  badge: {
    backgroundColor: 'green',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '3px',
    width: '1.2em',
    height: '1.2em',
    marginRight: '1.5em',
    marginBottom: '0.5em'
  },
  basketName: {
    margin: '0'
  },
  description: {
    marginTop: '10px',
    fontSize: '14px'
  },
  hovered: {
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)'
  }
})
