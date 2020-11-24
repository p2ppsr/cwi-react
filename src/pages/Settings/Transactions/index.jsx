import React, { useState, useEffect } from 'react'
import { Typography, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import style from './style'
import { waitForAuthentication, ninjaWrapper } from '@cwi/core'

const useStyles = makeStyles(style, {
  name: 'Transactions'
})

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const classes = useStyles()

  useEffect(() => {
    (async () => {
      await waitForAuthentication()
      setTransactions(await ninjaWrapper({
        func: 'getTransactions',
        params: {}
      }))
    })()
  }, [])

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1' paragraph>
        Transactions
      </Typography>
      <div>
        {transactions.map((tx, i) => (
          <Paper key={i}>
            <Typography variant='h3'>
              {tx.note}
            </Typography>
            <Typography variant='h6' color='textSecondary'>
              {tx.txid}
            </Typography>
            <Typography>
              Amount: {tx.amount} satoshis
            </Typography>
            <Typography>
              Direction: {tx.isOutgoing === 1 ? 'Outgoing' : 'Incoming'}
            </Typography>
          </Paper>
        ))}
      </div>
    </div>
  )
}

export default Transactions
