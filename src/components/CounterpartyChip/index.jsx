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

const useStyles = makeStyles(style, {
  name: 'CounterpartyChip'
})

const CounterpartyChip = ({ counterparty, history, clickable = true, size = 1.5 }) => {
  const signia = new Signia(undefined, signicertHost()) // TODO: Get confederacy the same way.
  signia.config.confederacyHost = confederacyHost()

  const classes = useStyles()

  const [signiaIdentity, setSigniaIdentity] = useState({
    profilePhoto: '',
    firstName: '',
    lastName: ''
  })

  useEffect(() => {
    (async () => {
      const results = await signia.discoverByIdentityKey('02bc91718b3572462a471de6193f357b6e85ee0f8636cb87db456cb1590f913bea')
      setSigniaIdentity(results[0].decryptedFields)
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
      icon={(
        <Img
          src={signiaIdentity.profilePhoto}
          className={classes.table_picture}
          confederacyHost={confederacyHost()}
        />
      )}
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
