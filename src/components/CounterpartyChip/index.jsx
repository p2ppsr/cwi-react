import React, { useState, useEffect } from 'react'
import { Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { Signia } from 'babbage-signia'
import { Img } from 'uhrp-react'
import makeStyles from '@mui/styles/makeStyles'
import { useTheme } from '@mui/styles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import signicertHost from '../../utils/signicertHost'
import YellowCautionIcon from '../../images/cautionIcon'

const useStyles = makeStyles(style, {
  name: 'CounterpartyChip'
})

const CounterpartyChip = ({
  counterparty, history, clickable = false, size = 1.3, onClick
}) => {
  const signia = new Signia(undefined, signicertHost())
  signia.config.confederacyHost = confederacyHost()
  const theme = useTheme()

  const classes = useStyles()

  const [signiaIdentity, setSigniaIdentity] = useState({
    profilePhoto: undefined,
    firstName: 'Untrusted',
    lastName: 'Counterparty'
  })

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Signia verified identity from a counterparty
        const results = await signia.discoverByIdentityKey(counterparty)
        setSigniaIdentity(results[0].decryptedFields)
      } catch (error) {
      }
    })()
  }, [signiaIdentity])

  return (
    <Chip
      style={{
        paddingTop: `${23 * size}px`,
        paddingBottom: `${23 * size}px`,
        paddingLeft: `${10 * size}px`,
        paddingRight: `${10 * size}px`
      }}
      disableRipple={!clickable}
      label={
        <div>
          <span style={{ fontSize: `${size}em` }}>
            {counterparty === 'self'
              ? 'Self'
              : counterparty === 'anyone'
                ? 'Anyone'
                : `${signiaIdentity.firstName} ${signiaIdentity.lastName}`}
          </span>
          {counterparty !== 'self' && counterparty !== 'anyone' && (
            <span
              style={{
                fontSize: '0.9em',
                color: signiaIdentity.profilePhoto
                  ? theme.palette.text.secondary.main
                  : 'red'
              }}
            >
              <br />
              {counterparty.substring(0, 10)}...
            </span>
          )}
        </div>
      }
      icon={
        signiaIdentity.profilePhoto ||
          counterparty === 'self' ||
          counterparty === 'anyone'
          ? (
            <Img
              src={counterparty === 'self'
                ? 'https://projectbabbage.com/favicon.ico'
                : counterparty === 'anyone'
                  ? 'https://projectbabbage.com/favicon.ico'
                  : signiaIdentity.profilePhoto
              }
              className={classes.table_picture}
              confederacyHost={confederacyHost()}
            />
            )
          : <YellowCautionIcon className={classes.table_picture} />
      }
      onClick={e => {
        if (clickable) {
          if (typeof onClick === 'function') {
            onClick(e)
          } else {
            e.stopPropagation()
            history.push(
              `/dashboard/counterparty/${encodeURIComponent(counterparty)}`
            )
          }
        }
      }}
    />
  )
}

export default withRouter(CounterpartyChip)
