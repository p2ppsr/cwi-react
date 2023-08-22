import React, { useState, useEffect } from 'react'
import { Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { Signia } from 'babbage-signia'
import { Img } from 'uhrp-react'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import signicertHost from '../../utils/signicertHost'
import YellowCautionIcon from '../../images/cautionIcon'

const useStyles = makeStyles(style, {
  name: 'CounterpartyChip'
})

const CounterpartyChip = ({ counterparty, history, clickable = false, size = 1.3 }) => {
  const signia = new Signia(undefined, signicertHost())
  signia.config.confederacyHost = confederacyHost()

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
        margin: `${10 * size}px`,
        paddingTop: `${23 * size}px`,
        paddingBottom: `${23 * size}px`,
        paddingLeft: `${10 * size}px`,
        paddingRight: `${10 * size}px`
      }}
      label={
        <div>
          <span style={{ fontSize: `${size}em` }}>
            {signiaIdentity.firstName} {signiaIdentity.lastName}
          </span>
          <span style={{ fontSize: '0.9em' }}>
            <br />
            {counterparty.substring(0, 8)}...
          </span>
        </div>
      }
      icon={
        signiaIdentity.profilePhoto
          ? (
            <Img
              src={signiaIdentity.profilePhoto}
              className={classes.table_picture}
              confederacyHost={confederacyHost()}
            />
            )
          : <YellowCautionIcon className={classes.table_picture} />
}
      onClick={() => {
        if (clickable) {
          history.push(
            `/dashboard/app/${encodeURIComponent(counterparty)}`
          )
        }
      }}
    />
  )
}

export default withRouter(CounterpartyChip)
