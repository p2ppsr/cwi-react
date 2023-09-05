import React, { useState, useEffect } from 'react'
import { Grid, Typography, Chip, Badge, Avatar } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { BasketMap } from 'basketmap'
import { Img } from 'uhrp-react'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import YellowCautionIcon from '../../images/cautionIcon'
import CounterpartyChip from '../CounterpartyChip'

const useStyles = makeStyles(style, {
  name: 'BasketChip'
})

const BasketChip = ({ basketId = 'todo', registryOperator = '0249e28e064db6dc0762c2e4a71ead8cf7b05c3fd9cd0f4d222af5b6847c5c900d', lastAccessed, history, clickable = false, size = 1.3 }) => {
  const classes = useStyles()

  // Initialize BasketMap
  const basketmap = new BasketMap()
  basketmap.config.confederacyHost = confederacyHost()

  const [basketName, setBasketName] = useState('unknown')
  const [iconURL, setIconURL] = useState('unknown')
  const [description, setDescription] = useState('unknown')

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Basket info from id and operator
        const results = await basketmap.resolveBasketById(basketId, registryOperator)
        setBasketName(results.name)
        setIconURL(results.iconURL)
        setDescription(results.description)
      } catch (error) {
      }
    })()
  }, [basketName])
  return (
    <Chip
      style={{
        margin: `${10 * size}px`,
        height: '100%',
        paddingTop: `${8 * size}px`,
        paddingBottom: `${8 * size}px`,
        paddingLeft: `${10 * size}px`,
        paddingRight: `${10 * size}px`
      }}
      label={
        <div style={{ marginLeft: '1em' }}>
          <span style={{ fontSize: `${size}em` }}>
            {basketName}
          </span>
          {lastAccessed ?
              <span style={{ fontSize: '0.9em', color: 'secondaryText' }}>
              <br />
              {lastAccessed}
            </span>
            : <></>
          }
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
                backgroundColor: 'Black',
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
              B
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
            `/dashboard/app/${encodeURIComponent(basketId)}`
          )
        }
      }}
    />
  )
}

export default withRouter(BasketChip)
