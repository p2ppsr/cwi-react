import React, { useState, useEffect } from 'react'
import { Grid, Chip, Badge, Avatar } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { BasketMap } from 'basketmap'
import { Img } from 'uhrp-react'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import confederacyHost from '../../utils/confederacyHost'
import YellowCautionIcon from '../../images/cautionIcon'

const useStyles = makeStyles(style, {
  name: 'BasketChip'
})

const BasketChip = ({ basketId = 'todo', registryOperator = '0249e28e064db6dc0762c2e4a71ead8cf7b05c3fd9cd0f4d222af5b6847c5c900d', history, clickable = false, size = 1.3 }) => {
  const classes = useStyles()

  // Initialize BasketMap
  const basketmap = new BasketMap()
  basketmap.config.confederacyHost = confederacyHost()

  const [basketName, setBasketName] = useState('unknown')
  const [iconURL, setIconURL] = useState('unknown')
  const [description, setDescription] = useState('unknown')
  // const [documentationURL, setDocumentationURL] = useState('unknown')
  // const [fields, setFields] = useState({})

  // Add chip-like css
  const [isHovered, setIsHovered] = useState(false)
  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Basket info from id and operator
        const results = await basketmap.resolveBasketById(basketId, registryOperator)
        setBasketName(results.name)
        setIconURL(results.iconURL)
        setDescription(results.description)
        setDocumentationURL(results.documentationURL)
      } catch (error) {
      }
    })()
  }, [basketName])

  return (
    <div
      className={`${classes.parentContainer} ${isHovered ? classes.hovered : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (clickable) {
          history.push(
            `/dashboard/app/${encodeURIComponent(basketId)}`
          )
        }
      }}
    >
      <Badge
        overlap='circular'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Avatar
            className={classes.badge}
          >
            B
          </Avatar>
      }
      >
        <Avatar className={classes.basketAvatar} alt={basketName}>
          <Img
            style={{ width: '100%', height: '100%' }}
            confederacyHost={confederacyHost()} src={iconURL}
          />
        </Avatar>
      </Badge>
      <div className='user-info'>
        <h3 className={classes.basketName}>{basketName}</h3>
        <div className='description'>{description}</div>
      </div>
    </div>
  )
}

export default withRouter(BasketChip)
