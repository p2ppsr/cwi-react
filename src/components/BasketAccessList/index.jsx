/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react'
import {
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  ListSubheader,
  Grid
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
// import { useTheme } from '@emotion/react'
import style from './style'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import BasketChip from '../BasketChip'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import AppChip from '../AppChip'
import CounterpartyChip from '../CounterpartyChip'
// import sortGrants from './sortGrants'
import formatDistance from 'date-fns/formatDistance'

const useStyles = makeStyles(style, {
  name: 'BasketAccessList'
})

/**
 * A component for displaying a list of basket permissions as apps with access to a basket, or baskets an app can access.
 *
 * @param {Object} obj - An object containing the following parameters:
 * @param {string} obj.app - The application context or configuration.
 * @param {number} obj.limit - The maximum number of permissions to display.
 * @param {string} obj.basket - The basket name for which permissions are being displayed.
 * @param {number} [obj.securityLevel] - The basket securityLevel for which permissions are being displayed (optional).
 * @param {string} [obj.itemsDisplayed='baskets'] - The type of items to display ('baskets' or 'apps', 'baskets' by default).
 * @param {boolean} [obj.canRevoke=true] - Indicates whether permissions can be revoked (true by default).
 * @param {boolean} [obj.displayCount=true] - Indicates whether to display the count of permissions (true by default).
 * @param {string} [obj.listHeaderTitle] - The title for the list header.
 * @param {boolean} [obj.showEmptyList=false] - Indicates whether to show an empty list message or remove it (false by default).
 */
const BasketAccessList = ({ app, basket, limit, itemsDisplayed = 'baskets', canRevoke = true, displayCount = true, listHeaderTitle, showEmptyList = false }) => {
  // Validate params
  if (itemsDisplayed === 'apps' && app) {
    const e = new Error('Error in BasketAccessList: apps cannot be displayed when providing an app param! Please provide a valid basket instead.')
    throw e
  }
  if (itemsDisplayed === 'baskets' && basket) {
    const e = new Error('Error in BasketAccessList: baskets cannot be displayed when providing a basket param! Please provide a valid app domain instead.')
    throw e
  }
  const [currentApp, setCurrentApp] = useState(null)
  const [grants, setGrants] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentAccessGrant, setCurrentAccessGrant] = useState(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const classes = useStyles()
  const history = useHistory()
  // const theme = useTheme()

  const refreshGrants = useCallback(async () => {
    const result = await window.CWI.listBasketAccess({
      targetDomain: app,
      targetBasket: basket,
      limit
    })
    setGrants(result)
  }, [app, basket])

  const revokeAccess = async grant => {
    setCurrentAccessGrant(grant)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setDialogLoading(true)
      if (currentAccessGrant) {
        await window.CWI.revokeBasketAccess({ grant: currentAccessGrant })
      } else {
        if (!currentApp || !currentApp.grant) {
          const e = new Error('Unable to revoke permissions!')
          throw e
        }
        for (const permission of currentApp.grants) {
          try {
            await window.CWI.revokeBasketAccess({ permission: permission.permissionGrant })
          } catch (error) {
            console.error(error)
          }
        }
        setCurrentApp(null)
      }

      setCurrentAccessGrant(null)
      setDialogOpen(false)
      setDialogLoading(false)
      refreshGrants()
    } catch (e) {
      toast.error('Access may not have been revoked: ' + e.message)
      refreshGrants()
      setCurrentAccessGrant(null)
      setDialogOpen(false)
      setDialogLoading(false)
    }
  }

  const handleDialogClose = () => {
    setCurrentAccessGrant(null)
    setDialogOpen(false)
  }

  useEffect(() => {
    refreshGrants()
  }, [refreshGrants])

  if (grants.length === 0 && !showEmptyList) {
    return (<></>)
  }

  console.log('grants=', grants)

  return (
    <>
      <Dialog
        open={dialogOpen}
      >
        <DialogTitle color='textPrimary'>
          Revoke Access?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can re-authorize this access grant next time you use this app.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            disabled={dialogLoading}
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            disabled={dialogLoading}
            onClick={handleConfirm}
          >
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
      <List>
        {listHeaderTitle && (
          <ListSubheader>
            {listHeaderTitle}
          </ListSubheader>
        )}
        {grants.map((grant, i) => (
          <React.Fragment key={i}>

            {/* Counterparties listed just below the header */}
            {itemsDisplayed === 'apps' && (
              <div className={classes.appList}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '1em', alignItems: 'center' }}>
                  <AppChip
                    label={grant.domain} showDomain onClick={(e) => {
                      e.stopPropagation()
                      history.push({
                        pathname: `/dashboard/app/${encodeURIComponent(grant.domain)}`,
                        state: {
                          domain: grant.domain
                        }
                      })
                    }}
                  />
                  {canRevoke &&
                    <>
                      {grant.permissions && grant.permissions.length > 0 && grant.permissions[0].counterparty
                        ? <Button onClick={() => { revokeAccess(grant) }} variant='contained' color='secondary' className={classes.revokeButton}>
                          Revoke All
                          </Button>
                        : <IconButton edge='end' onClick={() => revokeAccess(grant.permissions[0].permissionGrant)} size='large'>
                          <CloseIcon />
                        </IconButton>}
                    </>}

                </div>

                <ListItem elevation={4}>
                  <Grid container spacing={1} style={{ paddingBottom: '1em' }}>
                    {grant.permissions && grant.permissions.map((permission, idx) => (
                      <React.Fragment key={idx}>
                        {permission.counterparty &&
                          <Grid item xs={12} sm={6} md={6} lg={4}>
                            <div className={classes.gridItem}>
                              <CounterpartyChip
                                counterparty={permission.counterparty}
                                size={1.1}
                                expires={formatDistance(new Date(permission.permissionGrant.expiry * 1000), new Date(), { addSuffix: true })}
                                onCloseClick={() => revokeAccess(permission.permissionGrant)}
                              />
                            </div>
                          </Grid>}
                      </React.Fragment>
                    ))}
                  </Grid>
                </ListItem>

              </div>
            )}

            {itemsDisplayed !== 'apps' && (
              <ListItem className={classes.action_card} elevation={4}>
                <BasketChip

                  basketID={grant.basket}
                  counterparty={grant.counterparty}
                  // securityLevel={grant.securityLevel}
                  domain={grant.domain}
                  clickable
                  expires={formatDistance(new Date(grant.expiry * 1000), new Date(), { addSuffix: true })}
                  onCloseClick={() => revokeAccess(grant.accessGrantID)}
                />
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
{(itemsDisplayed === 'baskets' && displayCount) &&
        <center>
          <Typography
            color='textSecondary'
          >
            <i>Total Basket Access Grants: {grants.length}</i>
          </Typography>
        </center>}

    </>
  )
}

export default BasketAccessList
