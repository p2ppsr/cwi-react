/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Typography, Button, LinearProgress, List, ListSubheader, Divider } from '@mui/material'
import BasketChip from './BasketChip'
import ProtocolPermissionList from './ProtocolPermissionList'
import CertificateAccessList from './CertificateAccessList'
import BasketAccessList from './BasketAccessList'
// import formatDistance from 'date-fns/formatDistance'

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
  const [recentBasketAccess, setRecentBasketAccess] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const result = await window.CWI.ninja.getTransactionOutputs({
          limit: 1,
          includeBasket: true,
          includeTags: true,
          tags: [`babbage_action_originator ${originator}`],
          order: 'descending'
        })

        const filteredResults = result.filter(x => x.basket)
        setRecentBasketAccess(filteredResults)
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
      <List sx={{ bgcolor: 'background.paper', borderRadius: '0.25em', padding: '1em' }}>

        {recentBasketAccess.length !== 0 && (
          <>
            <ListSubheader>
              Baskets Recently Accessed
            </ListSubheader>
            {recentBasketAccess.map((item, itemIndex) => {
              return (
                <div key={itemIndex}>
                  <BasketChip history={history} basketId={item.basket} clickable />
                  <Divider />
                </div>
              )
            })}
          </>
        )}
        <ProtocolPermissionList app={originator} limit={3} canRevoke={false} clickable displayCount={false} listHeaderTitle='Protocol Grants' />
        <Divider />
        <CertificateAccessList app={originator} limit={1} canRevoke={false} displayCount={false} listHeaderTitle='Certificate Grants' />
      </List>

      {loading && <LinearProgress paddingTop='1em' />}
      <center style={{ padding: '1em' }}>
        <Button onClick={() => {
          // console.log('AccessAtAGlance():{originator}=', originator)
          history.push({
            pathname: `/dashboard/manage-app/${encodeURIComponent(originator)}`,
            state: {
            }
          })
        }}
        selected={
          history.location.pathname === `/dashboard/manage-app/${encodeURIComponent(originator)}`
        }
        >
          Manage App Access
        </Button>
      </center>
    </div>
  )
}

export default AccessAtAGlance
