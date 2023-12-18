import React, { useState, useEffect } from 'react'
import { Avatar, Badge, Grid, Chip, Typography, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { withRouter } from 'react-router-dom'
import { CertMap } from 'certmap'
import { Img } from 'uhrp-react'
import { useTheme, makeStyles } from '@mui/styles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import registryOperator from '../../utils/registryOperator'
import YellowCautionIcon from '../../images/cautionIcon'
import CounterpartyChip from '../CounterpartyChip'
import ArtTrack from '@mui/icons-material/ArtTrack'

const useStyles = makeStyles(style, {
  name: 'CertificateChip'
})

const CertificateChip = ({
  certType,
  lastAccessed,
  issuer,
  onIssuerClick,
  verifier,
  onVerifierClick,
  onClick,
  fieldsToDisplay,
  history,
  clickable = false,
  size = 1.3,
  expires,
  onCloseClick = () => {}
}) => {
  if (typeof certType !== 'string') {
    throw new Error('The certType prop in CertificateChip is not a string')
  }
  const certificateRegistryOperator = registryOperator()
  const certmap = new CertMap()
  certmap.config.confederacyHost = confederacyHost()

  const classes = useStyles()
  const theme = useTheme()

  const [certName, setCertName] = useState('Unknown Cert')
  const [iconURL, setIconURL] = useState(
    'https://projectbabbage.com/favicon.ico'
  )
  const [description, setDescription] = useState(`${certType.substr(0, 12)}...`)
  const [documentationURL, setDocumentationURL] = useState('unknown')

  useEffect(() => {
    (async () => {
      try {
        // Resolve a certificate by type
        const results = await certmap.resolveCertificateByType(
          certType,
          certificateRegistryOperator
        )
        setCertName(results.name)
        setIconURL(results.iconURL)
        setDescription(results.description)
        setDocumentationURL(results.documentationURL)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [certType])

  return (
    <div className={classes.chipContainer}>
      <Chip
        style={{
          height: '100%',
          width: '100%',
          // maxWidth: '30em',
          paddingTop: `${4 * size}px`,
          paddingBottom: `${4 * size}px`,
          paddingLeft: `${5 * size}px`,
          paddingRight: `${5 * size}px`
        }}
        onDelete={ () => {
          onCloseClick()
        }}
        deleteIcon={<CloseIcon />}
        disableRipple={!clickable}
        label={
          <div style={{ marginLeft: '0.125em', textAlign: 'left' }}>
            <span style={{ fontSize: `${size}em` }}>
              <b>{certName}</b>
            </span>
            <br />
            <span style={{
              fontSize: `${size * 0.8}em`,
              color: 'textSecondary',
              maxWidth: '20em',
              display: 'block'
            }}
            >
              {lastAccessed || description}
            </span>
            <span>
              {Array.isArray(fieldsToDisplay) && fieldsToDisplay.length > 0
                ? <div>
                  <Grid container alignContent='center' style={{ alignItems: 'center' }}>
                    <Grid item>
                      <p style={{ fontSize: '0.9em', fontWeight: 'normal', marginRight: '1em' }}>fields:</p>
                    </Grid>
                    <Grid item>
                      {fieldsToDisplay.map((y, j) => (
                        <Chip
                          style={{ margin: '0px 0.25em' }}
                          key={j}
                          label={y}
                        />
                      ))}
                    </Grid>
                  </Grid>
                  </div>
                : ''}
            </span>
            <span>
              {issuer
                ? <div>
                  <Grid container alignContent='center' style={{ alignItems: 'center' }}>
                    <Grid item>
                      <p style={{ fontSize: '0.9em', fontWeight: 'normal', marginRight: '1em' }}>issuer:</p>
                    </Grid>
                    <Grid item>
                      <CounterpartyChip
                        counterparty={issuer}
                        onClick={onIssuerClick}
                      />
                    </Grid>
                  </Grid>
                  </div>
                : ''}
            </span>
            <span>
              {verifier
                ? <div>
                  <Grid container alignContent='center' style={{ alignItems: 'center' }}>
                    <Grid item>
                      <p style={{ fontSize: '0.9em', fontWeight: 'normal', marginRight: '1em' }}>verifier:</p>
                    </Grid>
                    <Grid item>
                      <CounterpartyChip
                        counterparty={verifier}
                        onClick={onVerifierClick}
                      />
                    </Grid>
                  </Grid>
                  </div>
                : ''}
            </span>
          </div>
        }
        icon={
          <Badge
            overlap='circular'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            badgeContent={
              <Tooltip
                arrow
                title='Digital Certificate (click to learn more about certificates)'
                onClick={e => {
                  e.stopPropagation()
                  window.open(
                    'https://projectbabbage.com/docs/babbage-sdk/concepts/certificates',
                    '_blank'
                  )
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: 'darkgoldenrod',
                    width: 20,
                    height: 20,
                    borderRadius: '3px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '1.2em',
                    marginRight: '0.25em',
                    marginBottom: '0.3em'
                  }}
                >
                  <ArtTrack style={{ width: 16, height: 16 }} />
                </Avatar>
              </Tooltip>
            }
          >
            <Avatar
              sx={{
                width: '3.2em',
                height: '3.2em'
              }}
            >
              <Img
                src={iconURL}
                style={{ width: '100%', height: '100%' }}
                className={classes.table_picture}
                confederacyHost={confederacyHost()}
              />
            </Avatar>
          </Badge>
        }
        onClick={e => {
          if (clickable) {
            if (typeof onClick === 'function') {
              onClick(e)
            } else {
              e.stopPropagation()
              history.push(
                `/dashboard/certificate/${encodeURIComponent(certType)}`
              )
            }
          }
        }}
      />
      <span className={classes.expires}>{expires}</span>
    </div>
  )
}

export default withRouter(CertificateChip)
