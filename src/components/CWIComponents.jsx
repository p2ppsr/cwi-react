import { useEffect } from 'react'
import { withRouter } from 'react-router'
import { initialize, bindCallback } from '@p2ppsr/cwi-auth'
import listenForMessages from 'utils/listenForMessages'
import listenForProfileUpdates from 'utils/listenForProfileUpdates'
import { toast } from 'react-toastify'

const Initializer = ({ history }) => {
  // Initialize the authentication library
  useEffect(() => {
    (async () => {
      const result = await initialize({
        // Use the Planaria token
        planariaToken: process.env.REACT_APP_PLANARIA_TOKEN,

        // Use the secret server from environment
        secretServerURL: process.env.REACT_APP_SECRET_SERVER_URL,

        // Restore the logged in user if a snapshot was saved
        stateSnapshot: localStorage.CWIAuthStateSnapshot
      })
      if (
        result === true &&
        localStorage.CWIAuthStateSnapshot !== undefined &&
        window.location.pathname === '/'
      ) {
        history.push('/convos')
      }

      // Show error messages when they exist
      bindCallback('onAuthenticationError', toast.error)

      // Connect to the sockets to listen for new messages and profiles
      listenForMessages()
      listenForProfileUpdates()
    })()
  }, [history])

  return null
}

export default withRouter(Initializer)
