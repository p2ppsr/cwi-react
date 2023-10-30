/* eslint-disable react/prop-types */
import React from 'react'
import { Typography, Button, LinearProgress, Grid } from '@mui/material'
import BasketChip from './BasketChip'
import ProtoChip from './ProtoChip'
import CounterpartyChip from './CounterpartyChip'
import CertChip from './CertificateChip'
import getTransactionOutputs from './mocking/AccessAtAGlance'

/**
* Calls ninja to obtain the output data to be displayed by the appropriate chip components for the passed in App
* @param {object} obj - all params given in an object.
* @param {string} obj.basket - Only outputs with the corresponding basket label are returned, if the label is '' (empty string), then all basket outputs are returned. (optional, default '').
* @param {string} obj.type - Type of request, only the outputs for either the identified 'basket' or for all 'counterparty' are returned. (optional, default 'basket')
* @param {string} obj.order - The outputs are ordered according to this label. (optional, default 'whenLastUsed', sort in chronological order)
* @param {number} obj.limit - Provide a limit on the number of outputs that will be returned. (optional, default 1)
* @param {string} obj.originator - Only outputs from this identified App are returned.
* @returns - The result object contains the requested output data
*/
const getAccessData = ({
  basket = '',
  type = 'basket',
  order = 'whenLastUsed',
  limit = 1,
  originator
}) => {
  return getTransactionOutputs({ // Mocked
  // TODO: return await window.CWI.ninja.getTransactionOutputs({
    basket,
    type,
    order,
    limit,
    originator
  })
}

/**
 * Displays recent access for a particular app using chip associated components
 * @param {object} obj - all params given in an object
 * @param {string} obj.originator - app name
 * @param {boolean} obj.loading - the state of fetching app transactions
 * @param {function} obj.setRefresh - setter for refresh state variable which determines if the UI should be rerendered
 * @param {Router} obj.history - Allows React to navigate to different pages
 * @returns component chips to be displayed
 */
const AccessAtAGlance = ({ originator, loading, setRefresh, history }) => {
  const dpacpAccessData = getAccessData({ basket: 'DPACP', originator: `app_${originator}` })
  const counterpartyAccessData = getAccessData({ type: 'counterparty', originator: `app_${originator}` })
  const dbapAccessData = getAccessData({ basket: 'DBAP', originator: `app_${originator}` })
  const dcapAccessData = getAccessData({ basket: 'DCAP', originator: `app_${originator}` })
  const protoChipParams = {
    securityLevel: dpacpAccessData.securityLevel,
    protocolID: dpacpAccessData.protocolID,
    counterparty: dpacpAccessData.counterparty,
    lastAccessed: dpacpAccessData.lastAccessed,
    history
  }
  const counterpartyChipParams = {
    counterparty: counterpartyAccessData.counterparty,
    history
  }
  const basketChipParams = {
    counterparty: dbapAccessData.counterparty,
    basketId: dpacpAccessData.basketId,
    clickable: true
  }
  const certChipParams = {
    certType: dcapAccessData.certType,
    lastAccessed: dcapAccessData.lastAccessed,
    issuer: dcapAccessData.issuer,
    verifier: dcapAccessData.verifier,
    history
  }
  return (
    <div style={{ paddingTop: '1em' }}>
      <Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
        Access At A Glance
      </Typography>
      <Grid container spacing={2} textAlign='center' alignItems='center' justifyContent='center'>
        <Grid item xs={12}>
          <ProtoChip {...protoChipParams} />
        </Grid>
        <Grid item xs={12}>
          {counterpartyAccessData.counterparty !== 'self' &&
            <CounterpartyChip {...counterpartyChipParams} />}
        </Grid>
        <Grid item xs={12}>
          <BasketChip history={history} {...basketChipParams} />
        </Grid>
        <Grid item xs={12}>
          <CertChip {...certChipParams} />
        </Grid>
      </Grid>

      {loading && <LinearProgress paddingTop='1em' />}
      <center style={{ paddingTop: '1em' }}>
        <Button onClick={() => {
          setRefresh(true)
        }}
        >
          Manage App Access
        </Button>
      </center>
    </div>
  )
}

export default AccessAtAGlance
