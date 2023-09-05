import React, { useState, useEffect } from 'react'
import { Grid, Chip, Badge, Avatar } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { ProtoMap } from 'babbage-protomap'
import { Img } from 'uhrp-react'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import YellowCautionIcon from '../../images/cautionIcon'
import CounterpartyChip from '../CounterpartyChip'

const useStyles = makeStyles(style, {
  name: 'ProtoChip'
})

const ProtoChip = ({ securityLevel = '1', protocolID = 'social apps', registryOperator = '0249e28e064db6dc0762c2e4a71ead8cf7b05c3fd9cd0f4d222af5b6847c5c900d', counterparty, lastAccessed, history, clickable = false, size = 1.3 }) => {
  const classes = useStyles()

  // Initialize ProtoMap
  const protomap = new ProtoMap()
  protomap.config.confederacyHost = confederacyHost()

  const [protocolName, setProtocolName] = useState('Unknown')
  const [iconURL, setIconURL] = useState('unknown')
  const [description, setDescription] = useState('Protocol description not provided.')

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Protocol info from id and operator
        const results = await protomap.resolveProtocol(registryOperator, securityLevel, protocolID)
        setProtocolName(results.name)
        setIconURL(results.iconURL)
        setDescription(results.description)
      } catch (error) {
      }
    })()
  }, [protocolName])
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
            {protocolName}
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
              P
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
            `/dashboard/app/${encodeURIComponent(protocolID)}`
          )
        }
      }}
    />
  )
}

export default withRouter(ProtoChip)
