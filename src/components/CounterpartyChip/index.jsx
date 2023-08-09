import React, { useState, useEffect } from 'react'
import { Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
// import boomerang from 'boomerang-http'
import isImageUrl from '../../utils/isImageUrl'
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
  const signia = new Signia(undefined, signicertHost()) // TODO: Get confederacy the same way.
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
        const results = await signia.discoverByIdentityKey(counterparty)
        setSigniaIdentity(results[0].decryptedFields)
      } catch (error) {
      }
    })()
  }, [signiaIdentity])

  return (
    <Chip
      style={{
        margin: `${8 * size}px`,
        paddingTop: `${16 * size}px`,
        paddingBottom: `${16 * size}px`
      }}
      label={<span style={{ fontSize: `${size}em` }}>{signiaIdentity.firstName} {signiaIdentity.lastName}</span>}
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
