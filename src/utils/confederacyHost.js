import { useContext } from 'react'
import UIContext from '../UIContext'

// exports a function returning confederacy host for current ENV.
// Resolvers are undefined in prod.
export default () => {
  const { env } = useContext(UIContext)
  return env === 'dev'
    ? 'http://localhost:3002'
    : env === 'staging'
      ? 'https://staging-confederacy.babbage.systems'
      : undefined
}
