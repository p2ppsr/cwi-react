/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react'
import { Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { Signia } from 'babbage-signia'
import { Img } from 'uhrp-react'
import makeStyles from '@mui/styles/makeStyles'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/styles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import YellowCautionIcon from '../../images/cautionIcon'
import { SettingsContext } from '../../context/SettingsContext'

const useStyles = makeStyles(style, {
  name: 'CounterpartyChip'
})

const CounterpartyChip = ({
  counterparty,
  history,
  clickable = false,
  size = 1.3,
  onClick = () => {},
  expires,
  onCloseClick = () => {},
  canRevoke = false
}) => {
  const { settings } = useContext(SettingsContext)

  // Construct a new Signia instance for querying identity
  const signia = new Signia()
  // TODO: Refactor to get certifier / certificate data from constants
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
        const certifiers = settings.trustedEntities.map(x => x.publicKey)
        const results = await signia.discoverByIdentityKey(counterparty, certifiers)
        if (results && results.length > 0) {
          setSigniaIdentity(results[0].decryptedFields)
        }
      } catch (e) {}
    })()
  }, [])

  return (
    <div className={classes.chipContainer}>
      <Chip
        style={theme.templates.chip({ size })}
        onDelete={() => {
          onCloseClick()
        }}
        deleteIcon={canRevoke ? <CloseIcon /> : <></>}
        disableRipple={!clickable}
        label={
          <div style={theme.templates.chipLabel}>
            <span style={theme.templates.chipLabelTitle({ size })}>
              {counterparty === 'self'
                ? 'Self'
                : counterparty === 'anyone'
                  ? 'Anyone'
                  : `${signiaIdentity.firstName} ${signiaIdentity.lastName}`}
            </span>
            {counterparty !== 'self' && counterparty !== 'anyone' && (
              <span style={theme.templates.chipLabelSubtitle}>
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
                    : signiaIdentity.profilePhoto}
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
      <span className={classes.expiryHoverText}>{expires}</span>
    </div>
  )
}

export default withRouter(CounterpartyChip)
