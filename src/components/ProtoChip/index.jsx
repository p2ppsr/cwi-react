import React, { useState, useEffect } from 'react'
import { Grid, Chip, Badge, Avatar, Tooltip, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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
  securityLevel = 2,
  protocolID,
  counterparty,
  lastAccessed,
  originator,
  history,
  clickable = false,
  size = 1.3,
  onClick,
  onCounterpartyClick,
  expires,
  backgroundColor = 'transparent',
  canRevoke = true,
  onCloseClick = () => {}
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
  const [documentationURL, setDocumentationURL] = useState('https://projectbabbage.com')

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Protocol info from id and operator
        const results = await protomap.resolveProtocol(registry, securityLevel, protocolID)
        setProtocolName(results.name)
        setIconURL(results.iconURL)
        setDescription(results.description)
        setDocumentationURL(results.documentationURL)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [protocolID])

  return (
    <div className={classes.chipContainer}>
      <Chip
        style={theme.templates.chip({ size, backgroundColor })}
        sx={{
          '& .MuiChip-label': {
            width: '100% !important'
          }
        }}
        label={
          <div style={theme.templates.chipLabel}>
            <span style={theme.templates.chipLabelTitle({ size })}>
              <b>{protocolName}</b>
            </span>
            <br />
            <span style={theme.templates.chipLabelSubtitle}>
              {lastAccessed || description}
            </span>
            <span>
              {counterparty && counterparty !== 'self'
                ? <div>
                  <Grid container alignContent='center' style={{ alignItems: 'center' }}>
                    <Grid item>
                      <p style={{ fontSize: '0.9em', fontWeight: 'normal', marginRight: '1em' }}>with:</p>
                    </Grid>
                    <Grid item>
                      <CounterpartyChip
                        counterparty={counterparty}
                        onClick={onCounterpartyClick}
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
                    borderRadius: '10px',
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
              variant='square'
              sx={{
                width: '2.2em',
                height: '2.2em',
                borderRadius: '4px',
                backgroundColor: '#000000AF',
                marginRight: '0.5em'
              }}
            >
              <Img
                src={iconURL}
                style={{ width: '75%', height: '75%' }}
                className={classes.table_picture}
                confederacyHost={confederacyHost()}
              />
            </Avatar>
          </Badge>
        }
        onDelete={() => {
          if (canRevoke) {
            onCloseClick()
          }
        }}
        deleteIcon={
          canRevoke ? <CloseIcon /> : <></>
        }
        disableRipple={!clickable}
        onClick={e => {
          if (clickable) {
            if (typeof onClick === 'function') {
              onClick(e)
            } else {
              e.stopPropagation()
              history.push({
                pathname: `/dashboard/protocol/${encodeURIComponent(`${securityLevel}-${protocolID}`)}`,
                state: {
                  protocolName,
                  iconURL,
                  securityLevel,
                  protocolID,
                  counterparty,
                  lastAccessed,
                  description,
                  documentationURL,
                  originator
                }
              })
            }
          }
        }}
      />
      <span className={classes.expires}>{expires}</span>
    </div>
  )
}

export default withRouter(ProtoChip)
