import React, { useState, useEffect } from 'react'
import { Chip } from '@mui/material'
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
  const basketmap = new BasketMap()
  basketmap.config.confederacyHost = confederacyHost()

  const classes = useStyles()

  const [basketName, setBasketName] = useState('unknown')
  const [iconURL, setIconURL] = useState('unknown')
  const [description, setDescription] = useState('unknown')
  const [documentationURL, setDocumentationURL] = useState('unknown')
  const [fields, setFields] = useState({})

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Signia verified identity from a counterparty
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
    <Chip
      style={{
        margin: `${10 * size}px`,
        paddingTop: `${30 * size}px`,
        paddingBottom: `${30 * size}px`,
        paddingLeft: `${10 * size}px`,
        paddingRight: `${10 * size}px`
      }}
      label={
        <div>
          <span style={{ fontSize: `${size}em` }}>
            {basketName}
          </span>
          <span style={{ fontSize: '1em' }}>
            <br />
            {description}
          </span>
          <span style={{ fontSize: '0.9em' }}>
            <br />
            {registryOperator.substring(0, 8)}...
          </span>
        </div>
      }
      icon={
        iconURL
          ? (
            <Img
              src={iconURL}
              className={classes.table_picture}
              confederacyHost={confederacyHost()}
            />
            )
          : <YellowCautionIcon className={classes.table_picture} />
}
      onClick={() => {
        if (clickable) {
          history.push(
            `/dashboard/app/${encodeURIComponent(basketName)}`
          )
        }
      }}
    />
  )
}

export default withRouter(BasketChip)
