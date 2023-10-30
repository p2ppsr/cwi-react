import React, { useEffect, useState } from 'react'
import { Button, Typography, IconButton, ListItem, ListItemText, ListItemAvatar, Avatar, List, ListItemSecondaryAction, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ArrowBack from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import CopyIcon from '@mui/icons-material/FileCopy'
import CheckIcon from '@mui/icons-material/Check'
import DownloadIcon from '@mui/icons-material/Download'
import { useHistory, useLocation } from 'react-router-dom'
import exportBasketContents from './exportBasketContents'

/**
 * Display the access information for a particular basket
 */
const BasketAccess = () => {
  const theme = useTheme()
  const location = useLocation()
  const history = useHistory()

  if (!location.state) {
    return <div>No data provided!</div>
  }

  const { id, name, registryOperator, description, iconURL } = location.state
  const [copied, setCopied] = useState({ id: false, registryOperator: false })

  // Mock Data
  const mockBasketContents = [{ id, name, registryOperator, description, iconURL }]
  const apps = [{ name: 'ToDo', icon: '' }, { name: 'Tempo', icon: '' }, { name: 'PeerMail', icon: '' }]

  // Revoke an app's basket access grant
  const revokeAppAccess = async (app) => {
    // TODO: Figure out the correct params
    await window.CWI.revokeBasketAccess({
      ...{}
    })
  }

  // Copies the data and timeouts the checkmark icon
  const handleCopy = (data, type) => {
    navigator.clipboard.writeText(data)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => {
      setCopied({ ...copied, [type]: false })
    }, 2000)
  }

  useEffect(() => {
    (async () => {
      const results = await window.CWI.listBasketAccess({
        targetBasket: id
      })
      console.log(results)
    })()
  }, [])

  return (
    <div>
      <Grid container direction='column' spacing={2}>
        <Grid item container direction='row' alignItems='center' spacing={1}>
          <Grid item>
            <IconButton
              onClick={() => history.go(-1)}
              size='large'
            >
              <ArrowBack />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant='h1'>Basket Access Manager</Typography>
          </Grid>
        </Grid>
        <Grid item container direction='row' alignItems='center' spacing={2}>
          <Grid item>
            <Avatar src={iconURL} style={{ width: theme.spacing(10), height: theme.spacing(10) }} />
          </Grid>
          <Grid item>
            <Typography variant='h4'>{name}</Typography>
            <Typography variant='body2'>{description}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant='caption'>
            ID: {id}
            <IconButton size='small' onClick={() => handleCopy(id, 'id')} disabled={copied.id}>
              {copied.id ? <CheckIcon /> : <CopyIcon fontSize='small' />}
            </IconButton>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='caption'>
            Registry Operator: {registryOperator}
            <IconButton size='small' onClick={() => handleCopy(registryOperator, 'registryOperator')} disabled={copied.registryOperator}>
              {copied.registryOperator ? <CheckIcon /> : <CopyIcon fontSize='small' />}
            </IconButton>
          </Typography>
          <Typography variant='subtitle2'>23 items</Typography>
        </Grid>
        <Grid item>
          <Button
            variant='contained' color='primary' onClick={() => exportBasketContents({
              basketContents: mockBasketContents,
              format: 'csv'
            })}
          >Export Basket Contents
            <DownloadIcon style={{ paddingLeft: '0.25em' }} />
          </Button>
        </Grid>
        <Grid item>
          <Typography variant='h6'>Apps With Access</Typography>
          <List>
            {apps.map((app, index) => (
              <ListItem key={index} button onClick={() => alert('Navigate to app page?')}>
                <ListItemAvatar>
                  <Avatar src={app.icon} />
                </ListItemAvatar>
                <ListItemText primary={app.name} />
                <ListItemSecondaryAction>
                  <IconButton edge='end' onClick={() => { revokeAppAccess(app) }}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </div>
  )
}

export default BasketAccess
