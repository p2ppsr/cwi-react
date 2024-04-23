/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react'
import { Avatar, Badge, Chip, Icon, Tooltip } from '@mui/material'
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
import { discoverByIdentityKey } from '@babbage/sdk-ts'

const useStyles = makeStyles(style, {
  name: 'CounterpartyChip'
})

const knownCertificateTypes = {
  identiCert: 'z40BOInXkI8m7f/wBrv4MJ09bZfzZbTj2fJqCtONqCY=',
  socialCert: '2TgqRC35B1zehGmB21xveZNc7i5iqHc0uxMb+1NMPW4='
}

const CounterpartyChip = ({
  counterparty,
  history,
  clickable = false,
  size = 1.3,
  onClick,
  expires,
  onCloseClick = () => { },
  canRevoke = false
}) => {
  const { settings } = useContext(SettingsContext)
  const signia = new Signia()
  signia.config.confederacyHost = confederacyHost()

  const theme = useTheme()
  const classes = useStyles()

  const [signiaIdentity, setSigniaIdentity] = useState({
    profilePhoto: 'https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png',
    name: 'Stranger'
  })

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Signia verified identity from a counterparty
        const results = await discoverByIdentityKey({ identityKey: counterparty })

        if (results && results.length > 0) {
          const resolvedIdentity = results[0]

          const { userName, name, email, phoneNumber, firstName, lastName } = resolvedIdentity.decryptedFields
          const nameToDisplay = firstName && lastName
            ? `${firstName} ${lastName}`
            : name || userName || email || phoneNumber || 'Unsupported Name'

          setSigniaIdentity({
            name: nameToDisplay,
            profilePhoto: resolvedIdentity.decryptedFields.profilePhoto,
            identityKey: resolvedIdentity.subject,
            certifier: resolvedIdentity.certifier
          })
        }
      } catch (e) {
        window.Bugsnag.notify(e)
        console.error(e)
      }
    })()
  }, [])

  return (
    <div className={classes.chipContainer}>
      <Chip
        style={theme.templates.chip({ size })}
        onDelete={onCloseClick}
        deleteIcon={canRevoke ? <CloseIcon /> : <></>}
        disableRipple={!clickable}
        label={
          <div style={theme.templates.chipLabel}>
            <span style={theme.templates.chipLabelTitle({ size })}>
              {counterparty === 'self'
                ? 'Only You'
                : counterparty === 'anyone' || counterparty === '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'
                  ? 'Anyone'
                  : signiaIdentity.name}
            </span>
            {counterparty !== 'self' && counterparty !== 'anyone' && counterparty !== '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798' && (
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
            counterparty === 'anyone' ||
            counterparty === '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'
            ? (
              <Tooltip title={signiaIdentity.certifier ? `Certified by ${signiaIdentity.certifier.name}` : 'Unknown Certifier!'} placement="right">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Icon style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Img
                        style={{ width: '95%', height: '95%', objectFit: 'cover', borderRadius: '20%' }}
                        src={signiaIdentity.certifier ? signiaIdentity.certifier.icon : 'https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png'}
                        confederacyHost={confederacyHost}
                        loading={undefined}
                      />
                    </Icon>
                  }
                >
                  <Avatar alt={signiaIdentity.name} sx={{ width: '2.5em', height: '2.5em' }}>
                    <Img
                      src={counterparty === 'self'
                        ? 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvectorified.com%2Fimages%2Fself-icon-29.png&f=1&nofb=1&ipt=8b514768118498339147259078b173359ccaaa09a3249cce1cf176e53af306aa&ipo=images'
                        : counterparty === 'anyone' || counterparty === '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'
                          ? 'https://cdn-icons-png.flaticon.com/512/3369/3369157.png'
                          : signiaIdentity.profilePhoto}
                      className={classes.table_picture}
                      confederacyHost={confederacyHost()}
                    />
                  </Avatar>
                </Badge>
              </Tooltip>
            )
            : <img
              className={classes.table_picture}
              src='https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png'
              alt='Unknown person'
            />
        }
        onClick={e => {
          if (clickable) {
            if (typeof onClick === 'function') {
              onClick(e)
            } else {
              e.stopPropagation()
              history.push({
                pathname: `/dashboard/counterparty/${encodeURIComponent(counterparty)}`,
                state: {
                  ...signiaIdentity,
                  counterparty
                }
              })
            }
          }
        }}
      />
      <span className={classes.expiryHoverText}>{expires}</span>
    </div>
  )
}

export default withRouter(CounterpartyChip)
