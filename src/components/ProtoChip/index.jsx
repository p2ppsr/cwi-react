import React, { useState, useEffect } from 'react'
import { Grid, Chip, Badge, Avatar, Tooltip } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { ProtoMap } from 'babbage-protomap'
import { Img } from 'uhrp-react'
import makeStyles from '@mui/styles/makeStyles'
import { useTheme } from '@mui/styles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import YellowCautionIcon from '../../images/cautionIcon'
import CounterpartyChip from '../CounterpartyChip'
import registryOperator from '../../utils/registryOperator'
import DataObject from '@mui/icons-material/DataObject'

const useStyles = makeStyles(style, {
  name: 'ProtoChip'
})

const ProtoChip = ({
  securityLevel, protocolID, counterparty, lastAccessed, history, clickable = false, size = 1.3, onClick
}) => {
  if (typeof protocolID !== 'string') {
    throw new Error('ProtoChip requires protocolID to be a string')
  }
  const classes = useStyles()
  const theme = useTheme()
  const registry = registryOperator()

  // Initialize ProtoMap
  const protomap = new ProtoMap()
  protomap.config.confederacyHost = confederacyHost()

  const [protocolName, setProtocolName] = useState(protocolID)
  const [iconURL, setIconURL] = useState(
    'https://projectbabbage.com/favicon.ico'
  )
  const [description, setDescription] = useState(
    'Protocol description not found.'
  )

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Protocol info from id and operator
        const results = await protomap.resolveProtocol(registry, securityLevel, protocolID)
        setProtocolName(results.name)
        setIconURL(results.iconURL)
        setDescription(results.description)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [protocolID])

  return (
    <Chip
      style={{
        height: '100%',
        paddingTop: `${10 * size}px`,
        paddingBottom: `${10 * size}px`,
        paddingLeft: `${10 * size}px`,
        paddingRight: `${5 * size}px`
      }}
      label={
        <div style={{ marginLeft: '0.125em', textAlign: 'left' }}>
          <span style={{ fontSize: `${size}em` }}>
            <b>{protocolName}</b>
          </span>
          <br />
          <span style={{
            fontSize: `${size * 0.8}em`,
            color: theme.palette.text.secondary,
            maxWidth: '20em',
            display: 'block'
          }}>
            {lastAccessed || description}
          </span>
          <span>
            {counterparty && counterparty !== 'self'
              ? <div>
                <Grid container alignContent='center'>
                  <Grid item>
                  <p style={{ fontSize: '0.9em', fontWeight: 'normal', marginRight: '1em' }}>with:</p>
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
            <Tooltip
              arrow
              title='Data Protocol (click to learn more about protocols)'
              onClick={e => {
                e.stopPropagation()
                window.open(
                  'https://projectbabbage.com/docs/babbage-sdk/concepts/ppm',
                  '_blank'
                )
              }}
            >
            <Avatar
              sx={{
                backgroundColor: 'darkblue',
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
              <DataObject style={{ width: 16, height: 16 }} />
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
      disableRipple={!clickable}
      onClick={e => {
        if (clickable) {
          if (typeof onClick === 'function') {
            onClick(e)
          } else {
            history.push(
              `/dashboard/protocol/${encodeURIComponent(`${securityLevel}-${protocolID}`)}`
            )
          }
        }
      }}
    />
  )
}

export default withRouter(ProtoChip)
