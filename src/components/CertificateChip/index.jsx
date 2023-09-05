import React, { useState, useEffect } from 'react'
import { Avatar, Badge, Grid, Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { CertMap } from 'certmap'
import { Img } from 'uhrp-react'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import YellowCautionIcon from '../../images/cautionIcon'
import CounterpartyChip from '../CounterpartyChip'

const useStyles = makeStyles(style, {
  name: 'CertificateChip'
})

const CertificateChip = ({ certType, registryOperator, lastAccessed, counterparty, history, clickable = false, size = 1.3 }) => {
  const certmap = new CertMap()
  certmap.config.confederacyHost = confederacyHost()

  const classes = useStyles()

  const [certName, setCertName] = useState('Unknown Cert')
  const [iconURL, setIconURL] = useState('unknown')
  const [description, setDescription] = useState('No certificate description was provided.')
  const [documentationURL, setDocumentationURL] = useState('unknown')
  const [fields, setFields] = useState({})

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Signia verified identity from a counterparty
        const results = await certmap.resolveCertificateByType(certType, registryOperator)
        setCertName(results.name)
        setIconURL(results.iconURL)
        setDescription(results.description)
        setDocumentationURL(results.documentationURL)
      } catch (error) {
      }
    })()
  }, [certName])

  return (
    <Chip
      style={{
        margin: `${10 * size}px`,
        height: '100%',
        paddingTop: `${10 * size}px`,
        paddingBottom: `${10 * size}px`,
        paddingLeft: `${10 * size}px`,
        paddingRight: `${5 * size}px`
      }}
      label={
        <div style={{ marginLeft: '1em' }}>
          <span style={{ fontSize: `${size}em` }}>
            {certName}
          </span>
          <span style={{ fontSize: '0.9em' }}>
            <br />
            {description}
          </span>
          <span style={{ fontSize: '0.9em' }}>
            <br />
            {lastAccessed}
          </span>
          <span>
            {counterparty
              ? <div>

                <Grid container alignContent='center'>
                  <Grid item>
                    <p>With</p>
                  </Grid>
                  <Grid item>
                    <CounterpartyChip counterparty={counterparty} />
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
            <Avatar
              sx={{
                backgroundColor: 'black', // TODO: Use theme
                width: 20,
                height: 20,
                borderRadius: '0%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.2em',
                marginRight: '0.3em',
                marginBottom: '0.3em'
              }}
            >
              C
            </Avatar>
      }
        >
          {iconURL
            ? (
              <Avatar
                sx={{
                  width: '3.2em',
                  height: '3.2em'
                }}
              >
                <Img src={iconURL} style={{ width: '100%', height: '100%' }} className={classes.table_picture} confederacyHost={confederacyHost()} />
              </Avatar>
              )
            : (
              <YellowCautionIcon className={classes.table_picture} />
              )}
        </Badge>
  }
      onClick={() => {
        if (clickable) {
          history.push(
            `/dashboard/app/${encodeURIComponent(certName)}`
          )
        }
      }}
    />
  )
}

export default withRouter(CertificateChip)
