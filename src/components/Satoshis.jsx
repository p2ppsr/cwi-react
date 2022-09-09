import React, { useState, useEffect } from 'react'
import { Tooltip, Typography } from '@mui/material'
import Whatsonchain from 'whatsonchain'

const woc = new Whatsonchain()

export default ({
  children = '',
  abbreviate = false,
  showPlus = false
} = {}) => {
  const [title, setTitle] = useState('...')

  useEffect(() => {
    (async () => {
      try {
        if (Number.isInteger(Number(children))) {
          let rate = await woc.exchangeRate()
          rate = ((Number(children) / 100000000) * rate.rate)
          if (rate > 1) {
            setTitle(`$${rate.toFixed(2)}`)
          } else {
            rate = rate * 100
            setTitle(`${rate.toFixed(3)} ¢`)
          }
        } else {
          setTitle('...')
        }
      } catch (e) {
        setTitle('...')
      }
    })()
  }, [children])

  return (
    <Tooltip
      title={
        <Typography color='inherit'>{title}</Typography>
      }
      arrow
    >
      <span>
        {
          (showPlus && children > 0)
            ? `+${children}`
            : children
        }&nbsp;{
          abbreviate ? 'sats' : 'satoshis'
        }
      </span>
    </Tooltip>
  )
}
