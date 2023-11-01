import React, { useEffect, useState } from 'react'
import { Button, Typography, IconButton, ListItem, ListItemText, ListItemAvatar, Avatar, List, ListItemSecondaryAction, Grid, Link, Paper, Switch } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ArrowBack from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import DownloadIcon from '@mui/icons-material/Download'
import { useHistory, useLocation } from 'react-router-dom'
import exportBasketContents from './exportBasketContents'
import PageHeader from '../../../components/PageHeader'

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

  const { id, name, registryOperator, description, documentationURL, iconURL } = location.state
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

  // Mock data - TODO REMOVE
  const appsData = [
    {
      title: 'ToDo',
      subtitle: 'Todo list app',
      lastAccessed: 'Last accessed 2 hours ago',
      isEnabled: true
    },
    {
      title: 'Tempo',
      subtitle: 'Feel the beat',
      lastAccessed: 'Last accessed 3 days ago',
      isEnabled: false
    }
  ]

  return (
    <div>
      <Grid container spacing={3} direction='column' sx={{ padding: '16px' }}>
        <Grid item>
          <PageHeader
            history={history} title={name} subheading={
              <div>
                <Typography>
                  Items in Basket: 23
                </Typography>
                <Typography variant='caption'>
                  Basket ID: {id}
                  <IconButton size='small' onClick={() => handleCopy(id, 'id')} disabled={copied.id}>
                    {copied.id ? <CheckIcon /> : <ContentCopyIcon fontSize='small' />}
                  </IconButton>
                </Typography>
              </div>
            } icon={iconURL} buttonTitle='Export' buttonIcon={<DownloadIcon />} onClick={() => exportBasketContents({
              basketContents: mockBasketContents,
              format: 'csv'
            })}
          />
        </Grid>

        <Grid item>
          <Typography variant='h5' gutterBottom>
            Basket Description
          </Typography>
          <Typography variant='body' gutterBottom>
            Contains todo list items that you have created
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant='h5' gutterBottom>
            Learn More
          </Typography>
          <Typography variant='body'>You can learn more about how to manipulate and use the items in this basket from the following URL:</Typography>
          <br />
          <Link href={documentationURL} target='_blank' rel='noopener noreferrer'>{documentationURL}</Link>
        </Grid>

        <Grid item>
          <Paper elevation={3} sx={{ padding: '16px', borderRadius: '8px' }}>
            <Typography variant='h4' gutterBottom paddingLeft='0.25em'>
              Apps with Access
            </Typography>
            <List>
              {appsData.map((app, index) => (
                <ListItem key={index} divider={index !== appsData.length - 1} button onClick={() => alert('Navigate to app page?')}>
                  <ListItemText
                    primary={app.title}
                    secondary={app.subtitle}
                  />
                  <Typography variant='h7' color='textSecondary' sx={{ marginRight: 2 }}>
                    {app.lastAccessed}
                  </Typography>
                  <ListItemSecondaryAction>
                    <IconButton edge='end' onClick={() => { revokeAppAccess(app) }}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item alignSelf='center'>
          <Button color='error' onClick={() => { window.alert("Are you sure you want to revoke this app's access?") }}>
            Revoke All Access
          </Button>
        </Grid>

      </Grid>
    </div>
  )
}

export default BasketAccess
