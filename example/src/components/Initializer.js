import { useEffect } from 'react'
import { isAuthenticated } from '@p2ppsr/react-cwi/auth'
import { withRouter } from 'react-router-dom'

export default withRouter(({ history }) => {
  useEffect(() => {
    (async () => {
      while (!isAuthenticated()) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      if (window.location.pathname === '/') {
        history.push('/dashboard')
      }
    })()
  }, [history])

  return null
})
