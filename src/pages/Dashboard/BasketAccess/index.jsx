import React, { useEffect, useState } from 'react'
import { Button, Typography, IconButton, ListItemText, ListItemAvatar, Avatar, List, ListItemSecondaryAction, Grid, Link, Paper, Switch, ListItemButton } from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import makeStyles from '@mui/styles/makeStyles'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import DownloadIcon from '@mui/icons-material/Download'
import { useHistory, useLocation } from 'react-router-dom'
import exportBasketContents from './exportBasketContents'
import PageHeader from '../../../components/PageHeader'
import style from './style'
import { Img } from 'uhrp-react'

/**
 * Display the access information for a particular basket
 */
const BasketAccess = () => {
  const location = useLocation()
  const history = useHistory()
  // const useStyles = makeStyles(style, { name: 'basketAccess' })
  // const classes = useStyles()

  if (!location.state) {
    return <div>No data provided!</div>
  }

  const { id, name, registryOperator, description, documentationURL, iconURL } = location.state
  const [copied, setCopied] = useState({ id: false, registryOperator: false })

  // Mock Data
  const mockBasketContents = [{ id, name, registryOperator, description, iconURL }]

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
            history={history}
            title={name}
            subheading={
              <div>
                <Typography color='textSecondary'>
                  Items in Basket: 23
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  Basket ID: {id}
                  <IconButton size='small' onClick={() => handleCopy(id, 'id')} disabled={copied.id}>
                    {copied.id ? <CheckIcon /> : <ContentCopyIcon fontSize='small' />}
                  </IconButton>
                </Typography>
              </div>
            }
            icon={iconURL} buttonTitle='Export'
            buttonIcon={<DownloadIcon />}
            onClick={() => exportBasketContents({
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
          <Link color='textPrimary' href={documentationURL} target='_blank' rel='noopener noreferrer'>{documentationURL}</Link>
        </Grid>

        <Grid item>
          <Paper elevation={3} sx={{ padding: '16px', borderRadius: '8px' }}>
            <Typography variant='h4' gutterBottom paddingLeft='0.25em'>
              Apps with Access
            </Typography>
            <List>
              {appsData.map((app, index) => (
                <ListItemButton
                // Inline styles applied here
                  key={index} divider={index !== appsData.length - 1} onClick={() => alert('Navigate to app page?')}
                >
                  <Img src={iconURL} style={{ width: '3em', paddingRight: '1em' }} />
                  <ListItemText
                    primary={<Typography variant='h6' style={{ fontSize: '20px' }}>{app.title}</Typography>}
                    secondary={<Typography variant='body' style={{ fontSize: '14px' }}>{app.subtitle}</Typography>}
                  />

                  <Typography variant='h7' color='textSecondary' sx={{ marginRight: '2em' }}>
                    {app.lastAccessed}
                  </Typography>
                  <ListItemSecondaryAction>
                    <IconButton edge='end' onClick={() => { revokeAppAccess(app) }}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemButton>
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
