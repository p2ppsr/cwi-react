import { useContext } from 'react'
import UIContext from '../UIContext'

// exports a function returning the SigniCert host for current ENV.
// The host is undefined in prod.
export default () => {
  const { env } = useContext(UIContext)
  return env === 'dev'
    ? 'http://localhost:3002'
    : env === 'staging'
      ? 'https://staging-signicert.babbage.systems'
      : 'https://signicert.babbage.systems'
}
