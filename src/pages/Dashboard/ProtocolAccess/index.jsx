import React, { useEffect, useState } from 'react'
import { Typography, IconButton, Grid, Link, Paper } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { useHistory, useLocation } from 'react-router-dom'
import PageHeader from '../../../components/PageHeader'
import ProtocolPermissionList from '../../../components/ProtocolPermissionList'

/**
 * Display the access information for a particular basket
 */
const ProtocolAccess = () => {
  const location = useLocation()
  const history = useHistory()
  // const useStyles = makeStyles(style, { name: 'protocolAccess' })
  // const classes = useStyles()

  const { protocolName, iconURL, securityLevel, protocolID, counterparty, lastAccessed, description, documentationURL, originator } = location.state
  const [copied, setCopied] = useState({ id: false, registryOperator: false })

  // Copies the data and timeouts the checkmark icon
  const handleCopy = (data, type) => {
    navigator.clipboard.writeText(data)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => {
      setCopied({ ...copied, [type]: false })
    }, 2000)
  }

  return (
    <div>
      <Grid container spacing={3} direction='column' sx={{ padding: '16px' }}>
        <Grid item>
          <PageHeader
            history={history}
            title={protocolName}
            subheading={
              <div>
                <Typography variant='caption' color='textSecondary' display='block'>
                  Security Level: <Typography variant='caption' fontWeight='bold'>{securityLevel}</Typography>
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  Protocol ID: <Typography variant='caption' fontWeight='bold'>{protocolID}</Typography>
                  <IconButton size='small' onClick={() => handleCopy(protocolID, 'id')} disabled={copied.id}>
                    {copied.id ? <CheckIcon /> : <ContentCopyIcon fontSize='small' />}
                  </IconButton>
                </Typography>
              </div>
            }
            icon={iconURL}
            showButton={false}
          />
        </Grid>

        <Grid item>
          <Typography variant='h5' fontWeight='bold' gutterBottom>
            Protocol Description
          </Typography>
          <Typography variant='body' gutterBottom>
            {description}
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant='h5' fontWeight='bold' gutterBottom>
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
            <ProtocolPermissionList protocol={protocolID} counterparty={counterparty} itemsDisplayed='apps' canRevoke displayCount={false} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default ProtocolAccess
