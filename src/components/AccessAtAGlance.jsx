import React from 'react'
import { Typography, Button, LinearProgress } from '@mui/material'
import BasketChip from '../../../components/BasketChip'
import ProtoChip from '../../../components/ProtoChip'
import CounterpartyChip from '../../../components/CounterpartyChip'
import CertChip from '../../../components/CertChip'
import getTransactionOutputs from '../../../components/mocking/AccessAtAGlance'
/*
* Calls ninja to obtain the output data to be displayed by the approriate chip components for the passed in App
* @param {object} obj - all params given in an object.
* @param {string} obj.basket - Only outputs with the corresponding basket label are returned, if the label is '' (empty string), then all basket outputs are returned. (optional, default '').
* @param {string} obj.type - Type of request, only this App outputs for either the identified 'basket' label or for all 'counterparty' are returned. (optional, default 'basket')
* @param {string} obj.order - The outputs are ordered according to this label. (optional, default 'whenLastUsed', sort in chronological order)
* @param {number} obj.limit - Provide a limit on the number of outputs that will be returned. (optional, default `1`)
* @param {string} obj.originator - Only outputs from this identified App are returned.
* @returns - The result object contained the requested output data
*/
const getAccessData = async ({ basket = '', type = 'basket', order = 'whenLastUsed', limit = 1, originator }) => {
  const results = await getTransactionOutputs({
  //const results = await window.CWI.ninja.getTransactionOutputs({
    basket,
    type,
    order,
    limit,
    originator
  })
  if (limit === undefined) {
    limit = results.length
  }
  if (results && Array.isArray(results.outputs)) {
    //return results.outputs.map(x => {
    //  return x.label.replace(/^babbage_app_/, '')
    //}).slice(0, limit)
  }
  return []
}

/**
 * Displays recent access for a particular app using chip associated components
 * @param {object} obj - all params given in an object
 * @param {string} obj.originator - app name 
 * @param {boolean} obj.loading - the state of fetching app transactions
 * @param {function} obj.setRefresh - setter for refresh state variable which determines if the UI should be rerendered
 * @returns component chips to be displayed
 */
const AccessAtAGlance = ({ originator, loading, setRefresh }) => {

  const dpacpAccessData = getAccessData( {basket: 'DPACP', originator: `app_${originator}` })
  const counterpartyAccessData = getAccessData( {type: 'counterparty', originator: `app_${originator}` })
  const dbapAccessData = getAccessData( {basket: 'DBAP', originator: `app_${originator}` })
  const dcapAccessData = getAccessData( {basket: 'DCAP', originator: `app_${originator}` })
  const protoChipParams = {
    basketId: dpacpAccessData.basketId,
    lastAccessed: dpacpAccessData.lastAccess,
    history: dpacpAccessData.history,
    //clickable = false,
    //size = 1.3,
    //onClick
  }
  const counterpartyChipParams = {
    securityLevel: counterpartyAccessData.securityLevel,
    protocolID: counterpartyAccessData.protocolID,
    counterparty: counterpartyAccessData.counterparty,
    lastAccessed: counterpartyAccessData.lastAccessed,
    history: counterpartyAccessData.history,
    //clickable = false,
    //size = 1.3,
    //onClick,
    //onCounterpartyClick
  }
  const basketChipParams = {
    counterparty: dbapAccessData.counterparty,
    history: dbapAccessData.history,
    //clickable,
    //size,
    //onClick
  }
  const certChipParams = {
    certType: dcapAccessData.certType,
    lastAccessed: dcapAccessData.lastAccessed,
    issuer: dcapAccessData.issuer,
    //onIssuerClick,
    verifier: dcapAccessData.verifier,
    //onVerifierClick,
    //onClick,
    //fieldsToDisplay,
    //history,
    //clickable,
    //size
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '1em' }}>
      <div style={{ width: '30em', paddingBottom: '2em', marginRight: '1em' }}>
        <Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
        Access At A Glance
        </Typography>
        {<div>
          <Grid>
            <Grid>
              <ProtoChip { ...protoChipParams }
              />
            </Grid>
            <Grid>
              <CounterpartyChip { ...counterpartyChipParams }
              />
            </Grid>
            <Grid>
              <BasketChip { ...basketChipParams }
              />
            </Grid>
            <Grid>
              <CertChip { ...certChipParams }
              />
            </Grid>
          </Grid>
        </div>}
        {loading && <LinearProgress paddingTop='1em' />}
        <center style={{ paddingTop: '1em' }}>
          <Button onClick={() => {
            // Note: Consider taking into account max number of txs available
            setDisplayLimit(displayLimit + 10)
            setRefresh(true)
          }}
          >View More Actions
          </Button>
        </center>
      </div>
    </div>
  )
}
export default AccessAtAGlance