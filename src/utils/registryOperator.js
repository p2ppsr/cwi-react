import { useContext } from 'react'
import UIContext from '../UIContext'

// exports a function returning the Registry Operator for current ENV.
// Currently, the registry is operated by Ty Everett.
export default () => {
  const { env } = useContext(UIContext)
  return env === 'dev' || env === 'staging'
    ? '02bc91718b3572462a471de6193f357b6e85ee0f8636cb87db456cb1590f913bea'
    : '022a70d2862aeb01ecf3014395cec93a2390e3e9d80aecc9bbbbde5ddbd2a3d283'
}
