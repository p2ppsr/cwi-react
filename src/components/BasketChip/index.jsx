import React, { useState, useEffect } from 'react'
import { Grid, Typography, Chip, Badge, Avatar, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { withRouter } from 'react-router-dom'
import { BasketMap } from 'basketmap'
import { Img } from 'uhrp-react'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import YellowCautionIcon from '../../images/cautionIcon'
import CounterpartyChip from '../CounterpartyChip'
import registryOperator from '../../utils/registryOperator'
import { useTheme } from '@mui/styles'
import ShoppingBasket from '@mui/icons-material/ShoppingBasket'

const useStyles = makeStyles(style, {
  name: 'BasketChip'
})

const BasketChip = ({
  basketId,
  lastAccessed,
  domain,
  history,
  clickable = false,
  size = 1.3,
  onClick,
  expires,
  onCloseClick = () => {},
  canRevoke = false
}) => {
  if (typeof basketId !== 'string') {
    throw new Error('BasketChip was initialized without a valid basketId')
  }
  const basketRegistryOperator = registryOperator()
  const classes = useStyles()
  const theme = useTheme()

  // Initialize BasketMap
  const basketmap = new BasketMap()
  basketmap.config.confederacyHost = confederacyHost()

  const [basketName, setBasketName] = useState(basketId)
  const [iconURL, setIconURL] = useState(
    'https://projectbabbage.com/favicon.ico'
  )
  const [description, setDescription] = useState(
    'Basket description not found.'
  )
  const [documentationURL, setDocumentationURL] = useState('https://projectbabbage.com')

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Basket info from id and operator
        const results = await basketmap.resolveBasketById(
          basketId,
          basketRegistryOperator
        )
        setBasketName(results.name)
        setIconURL(results.iconURL)
        setDescription(results.description)
        setDocumentationURL(results.documentationURL)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [basketId])
  return (
    <div style={theme.templates.chipContainer}>
      <Chip
        style={theme.templates.chip({ size })}
        sx={{
          '& .MuiChip-label': {
            width: '100% !important'
          }
        }}
        label={
          <div style={theme.templates.chipLabel}>
            <span style={{ fontSize: `${size}em` }}>
              <b>{basketName}</b>
            </span>
            <br />
            <span style={theme.templates.chipLabelSubtitle}>
              {lastAccessed || description}
            </span>
          </div>
        }
        onDelete={() => {
          onCloseClick()
        }}
        deleteIcon={canRevoke ? <CloseIcon /> : <></>}
        disableRipple={!clickable}
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
                title='Token Basket (click to learn more about baskets)'
                onClick={e => {
                  e.stopPropagation()
                  window.open(
                    'https://projectbabbage.com/docs/babbage-sdk/concepts/baskets',
                    '_blank'
                  )
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: 'green',
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
                  <ShoppingBasket style={{ width: 16, height: 16 }} />
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
                backgroundColor: '#000000AF'
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
        onClick={e => {
          if (clickable) {
            if (typeof onClick === 'function') {
              onClick(e)
            } else {
              e.stopPropagation()
              history.push({
                pathname: `/dashboard/basket/${encodeURIComponent(basketId)}`,
                state: {
                  id: basketId,
                  name: basketName,
                  registryOperator: basketRegistryOperator,
                  description,
                  iconURL,
                  documentationURL,
                  domain
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

export default withRouter(BasketChip)
