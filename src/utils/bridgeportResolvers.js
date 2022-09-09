import { useContext } from 'react'
import UIContext from '../UIContext'

// exports a function returning bridgeport resolvers for current ENV.
// Resolvers are undefined in prod.
export default () => {
  const { env } = useContext(UIContext)
  return env === 'dev'
    ? ['http://localhost:3103']
    : env === 'staging'
      ? ['https://staging-bridgeport.babbage.systems']
      : undefined
}
