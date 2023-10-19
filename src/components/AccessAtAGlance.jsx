/*
   /**
      * Returns transaction outputs matching options and total matching count available.
      *
      * @param options limit defaults to 25, offset defaults to 0, includeEnvelpe defaults to true
      *
      * getTransactionOutputs(options?: DojoGetTransactionOutputsOptions): Promise<{ outputs: DojoOutputApi[], total: number }>
*/
/*
export interface DojoGetTransactionOutputsOptions {
  /**
     *  If provided, indicates which basket the outputs should be selected from.
     *
  basket?: string
  /**
     *  If provided, only outputs with the corresponding tracked value will be returned (true/false).
     *
  tracked?: boolean
  /**
     * If provided, returns a structure with the SPV envelopes for the UTXOS that have not been spent.
     *
  includeEnvelope?: boolean
  /**
     * If given as true or false, only outputs that have or have not (respectively) been spent will be returned. If not given, both spent and unspent outputs will be returned.
     *
  spendable?: boolean
  /**
     * If provided, only outputs of the specified type will be returned. If not provided, outputs of all types will be returned.
     *
  type?: string
  /**
     * Optional. How many transactions to return.
     *
  limit?: number
  /**
     * Optional. How many transactions to skip.
     *
  offset?: number
}
export type DojoTransactionLabelsSortBy = 'label' | 'whenLastUsed';

export interface DojoGetTransactionLabelsOptions extends DojoGetTransactionsBaseOptions {
   /**
      * Optional. Filters labels to include only those starting with the specified prefix.
      *
   prefix?: string
   /**
      * Optional. Filters labels to include only those associated with the specified transaction ID.
      *
   transactionId?: number
   /**
      * Optional. Specify whether to sort by 'label' or 'whenLastUsed'.
      *
   sortBy?: DojoTransactionLabelsSortBy
}

*/
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
* @param {string} obj.type - Type of request, only the outputs for either the identified 'basket' label or for all 'counterparty' are returned. (optional, default 'basket')
* @param {string} obj.order - The outputs are ordered according to this label. (optional, default 'date', sort in chronological order)
* @param {number} obj.limit - Provide a limit on the number of outputs that will be returned. (optional, default `1`)
* @param {string} obj.originator - Only outputs from this identified App are returned.
* @returns - The result object contains the requested output data
*/
const getAccessData = ({
  basket = '',
  type = 'basket',
  order = 'date',
  limit = 1,
  originator
}) => {
  return getTransactionOutputs({ // Mocked
  // return await window.CWI.ninja.getTransactionOutputs({
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
 * @returns component chips to be displayed
 */
const AccessAtAGlance = ({ originator, loading, setRefresh }) => {
  const dpacpAccessData = getAccessData({ basket: 'DPACP', originator: `app_${originator}` })
  const counterpartyAccessData = getAccessData({ type: 'counterparty', originator: `app_${originator}` })
  const dbapAccessData = getAccessData({ basket: 'DBAP', originator: `app_${originator}` })
  const dcapAccessData = getAccessData({ basket: 'DCAP', originator: `app_${originator}` })
  const protoChipParams = {
    securityLevel: dpacpAccessData.securityLevel,
    protocolID: dpacpAccessData.protocolID,
    counterparty: dpacpAccessData.counterparty,
    lastAccessed: dpacpAccessData.lastAccessed,
    history: dpacpAccessData.history
    // clickable = false,
    // size = 1.3,
    // onClick,
    // onCounterpartyClick
  }
  const counterpartyChipParams = {
    basketId: counterpartyAccessData.basketId,
    lastAccessed: counterpartyAccessData.lastAccess,
    history: counterpartyAccessData.history
    // clickable = false,
    // size = 1.3,
    // onClick
  }
  const basketChipParams = {
    counterparty: dbapAccessData.counterparty,
    history: dbapAccessData.history
    // clickable,
    // size,
    // onClick
  }
  const certChipParams = {
    certType: dcapAccessData.certType,
    lastAccessed: dcapAccessData.lastAccessed,
    issuer: dcapAccessData.issuer,
    // onIssuerClick,
    verifier: dcapAccessData.verifier
    // onVerifierClick,
    // onClick,
    // fieldsToDisplay,
    // history,
    // clickable,
    // size
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '1em' }}>
      <div style={{ width: '30em', paddingBottom: '2em', marginRight: '1em' }}>
        <Typography variant='h3' gutterBottom style={{ paddingBottom: '0.2em' }}>
          Access At A Glance
        </Typography>
        <div>
          <ProtoChip { ...protoChipParams }
          />
          ({counterpartyAccessData.basketId !== 'self'})
          ?
            <CounterpartyChip { ...counterpartyChipParams }
            />
          <BasketChip { ...basketChipParams }
          />
          <CertChip { ...certChipParams }
          />
        </div>
        {loading && <LinearProgress paddingTop='1em' />}
        <center style={{ paddingTop: '1em' }}>
          <Button onClick={() => {
            setRefresh(true)
          }}
          >
            View More Access Data
          </Button>
        </center>
      </div>
    </div>
  )
}

export default AccessAtAGlance
