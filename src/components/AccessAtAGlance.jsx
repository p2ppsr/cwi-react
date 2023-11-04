/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { Typography, Button, LinearProgress, Grid, Box, List, ListItemButton, ListItem, ListItemIcon, ListItemText, ListSubheader, Divider } from '@mui/material'
import BasketChip from './BasketChip'
import ProtoChip from './ProtoChip'
import CounterpartyChip from './CounterpartyChip'
import CertChip from './CertificateChip'
import getTransactionOutputs from './mocking/AccessAtAGlance'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PostAddIcon from '@mui/icons-material/PostAdd'
import EventNoteIcon from '@mui/icons-material/EventNote'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

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
const getAccessData = async ({
  basket = '',
  type = 'basket',
  order = 'whenLastUsed',
  limit = 1,
  originator
}) => {
  // return getTransactionOutputs({ // Mocked
  return await window.CWI.ninja.getTransactionOutputs({
    basket,
    type,
    order,
    limit,
    originator
  })
}

const sections = [
  {
    title: 'Baskets',
    items: [
      {
        icon: ShoppingCartIcon,
        primary: 'Postboard Posts',
        secondary: '23 items',
        lastAccessed: '2 hours ago',
        url: '/postboard'
      },
      {
        icon: EventNoteIcon,
        primary: 'ToDo Items',
        secondary: '23 items',
        lastAccessed: '2 hours ago',
        url: '/todo'
      }
    ]
  },
  {
    title: 'Protocols',
    items: [
      {
        icon: VpnKeyIcon,
        primary: 'Authrite',
        secondary: 'Mutual Authentication Protocol',
        lastAccessed: '2 hours ago',
        url: '/protocols/authrite'
      }
    ]
  },
  {
    title: 'Certificates',
    items: [
      {
        icon: VerifiedUserIcon,
        primary: 'PostMaster Cert',
        lastAccessed: '2 hours ago',
        url: '/certificates/postmaster'
      }
    ]
  },
  {
    title: 'Counterparties',
    items: [
      {
        icon: AccountCircleIcon,
        primary: 'Bob Babbage',
        lastAccessed: '2 hours ago',
        url: '/counterparties/bob-babbage'
      },
      {
        icon: AccountCircleIcon,
        primary: 'John Smith',
        lastAccessed: '2 hours ago',
        url: '/counterparties/john-smith'
      }
    ]
  }
]

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
  // const dpacpAccessData = getAccessData({ basket: 'DPACP', originator: `app_${originator}` })
  // const counterpartyAccessData = getAccessData({ type: 'counterparty', originator: `app_${originator}` })
  // const dbapAccessData = getAccessData({ basket: 'DBAP', originator: `app_${originator}` })
  // const dcapAccessData = getAccessData({ basket: 'DCAP', originator: `app_${originator}` })
  // const protoChipParams = {
  //   securityLevel: dpacpAccessData.securityLevel,
  //   protocolID: dpacpAccessData.protocolID,
  //   counterparty: dpacpAccessData.counterparty,
  //   lastAccessed: dpacpAccessData.lastAccessed,
  //   history
  // }
  // const counterpartyChipParams = {
  //   counterparty: counterpartyAccessData.counterparty,
  //   history
  // }
  // const basketChipParams = {
  //   counterparty: dbapAccessData.counterparty,
  //   basketId: dpacpAccessData.basketId,
  //   clickable: true
  // }
  // const certChipParams = {
  //   certType: dcapAccessData.certType,
  //   lastAccessed: dcapAccessData.lastAccessed,
  //   issuer: dcapAccessData.issuer,
  //   verifier: dcapAccessData.verifier,
  //   history
  // }
  const handleClick = () => { window.alert('hi') }

  useEffect(() => {
    (async () => {
      try {
        const result = await window.CWI.ninja.getTransactions({
          basket: 'todo tokens',
          limit: 2,
          includeBasket: true,
          includeTags: true,
          order: 'descending',
          addInputsAndOutputs: true,
          status: 'completed'
        })
        console.log(result)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return (
    <div style={{ paddingTop: '1em' }}>
      <Typography variant='h3' color='textPrimary' gutterBottom style={{ paddingBottom: '0.2em' }}>
        Access At A Glance
      </Typography>
      {/* <Grid container spacing={2} textAlign='center' alignItems='center' justifyContent='center'>
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
      </Grid> */}

      <List sx={{ bgcolor: 'background.paper', borderRadius: '0.25em', padding: '0 1em 0 1em' }}>
        {sections.map((section, index) => (
          <div key={index}>
            <ListSubheader>
              {section.title}
            </ListSubheader>
            <Divider />
            {section.items.map((item, itemIndex) => (
              <ListItemButton key={itemIndex} onClick={() => handleClick(item.url)}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.primary} secondary={item.secondary} />
                {item.lastAccessed && (
                  <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                    <ListItemText
                      secondary={item.lastAccessed}
                    />
                  </Box>
                )}
              </ListItemButton>
            ))}
          </div>
        ))}
      </List>

      {loading && <LinearProgress paddingTop='1em' />}
      <center style={{ padding: '1em' }}>
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
