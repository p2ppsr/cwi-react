import React from 'react'
import { Typography, Button, LinearProgress } from '@mui/material'
import Transaction from '../../../components/Transaction'

/**
 * Displays recent actions for a particular app
 * @param {object} obj - all params given in an object
 * @param {boolean} obj.loading - the state of fetching app transactions
 * @param {object} obj.appActions - app transactions
 * @param {number} obj.displayLimit - the number of transactions to display
 * @param {function} obj.setDisplayLimit - setter for displayLimit param
 * @param {function} obj.setRefresh - setter for refresh state variable which determines if the UI should be rerendered
 * @returns
 */
const RecentActions = ({ loading, appActions }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '1em' }}>
      <div style={{ width: '30em', paddingBottom: '2em', marginRight: '1em' }}>
        <Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
          Recent Actions
        </Typography>
        {appActions.transactions && appActions.transactions.map((action, index) => {
          const inputTotals = action.inputs.reduce((acc, input) => acc + input.amount, 0)
          const outputTotals = action.outputs.reduce((acc, output) => acc + output.amount, 0)
          const outputs = [
            ...action.outputs,
            {
              amount: inputTotals - outputTotals,
              description: 'Bitcoin Mining Fee',
              type: 'fee'
            }
          ]
          const actionToDisplay = {
            txid: action.txid,
            description: action.note,
            amount: action.amount,
            inputs: action.inputs,
            outputs,
            timestamp: action.created_at
          }
          return (
            <Transaction
              key={index}
              {
                  ...actionToDisplay
                  }
            />
          )
        })}
        {loading && <LinearProgress paddingTop='1em' />}
        <center style={{ paddingTop: '1em' }}>
          <Button onClick={() => {}}>View More Actions</Button>
        </center>
      </div>
      <div style={{ width: '30em', paddingBottom: '2em' }}>
        <Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
          Access At a Glance
        </Typography>
        <div style={{ background: 'lightGray', height: '23em', padding: '1em' }}>
          Coming soon!
        </div>
      </div>
    </div>
  )
}
export default RecentActions
