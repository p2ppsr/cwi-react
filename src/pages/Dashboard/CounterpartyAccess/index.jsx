import React, { useState } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Button
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { makeStyles } from '@mui/styles'
import { useLocation, useHistory } from 'react-router-dom'
import PageHeader from '../../../components/PageHeader'
import CounterpartyChip from '../../../components/CounterpartyChip'
import style from './style'
import ProtocolPermissionList from '../../../components/ProtocolPermissionList'

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const trustEndorsementsData = [
  {
    name: 'Bob Babbage',
    statement: 'This endorsement certifies that the following public key belongs to John Smith.',
    publicKey: 'o3d98a6037da0b1075acedc1316fecc90444e0d990836055fd7a400c1d070bb4',
    date: '12/06/23',
    issuer: 'Bob Babbage with PeerCert',
    expires: 'Never'
  },
  {
    name: 'John Doe',
    statement: 'This endorsement certifies that the following public key belongs to John Smith.',
    publicKey: 'o3d98a6037da0b1075acedc1316fecc90444e0d990836055fd7a400c1d070bb4',
    date: '12/06/23',
    issuer: 'Bob Babbage with PeerCert',
    expires: 'Never'
  },
  {
    name: 'Brayden Langley',
    statement: 'This endorsement certifies that the following public key belongs to John Smith.',
    publicKey: 'o3d98a6037da0b1075acedc1316fecc90444e0d990836055fd7a400c1d070bb4',
    date: '12/06/23',
    issuer: 'Bob Babbage with PeerCert',
    expires: 'Never'
  }
]

const SimpleTabs = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
        <Tab label='Trust Endorsements' />
        <Tab label='Protocol Access' />
        <Tab label='Certificates Revealed' />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Typography variant='body'>
          Trust endorsements given to this counterparty by other people.
        </Typography>
        {trustEndorsementsData.map((endorsement, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
            >
              <CounterpartyChip
                counterparty='o3d98a6037da0b1075acedc1316fecc90444e0d990836055fd7a400c1d070bb4'
                onClick={() => {}}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {endorsement.statement}
                {endorsement.date}
                {endorsement.issuer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        <Button>Revoke All Access</Button>
      </TabPanel>
      <TabPanel value={value} index={1}>
        test
        <ProtocolPermissionList counterparty='03d98a6037da0b1075acedc1316fecc904440ed9990836055df7da400c1d070bb4' itemsDisplayed='protocols' showEmptyList />
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* TODO: Certificates Revealed Section */}
      </TabPanel>
    </Box>
  )
}

const CounterpartyAccess = () => {
  const location = useLocation()
  const history = useHistory()
  const useStyles = makeStyles(style, { name: 'protocolAccess' })
  const classes = useStyles()

  const counterparty = '03d98a6037da0b1075acedc1316fecc904440ed9990836055df7da400c1d070bb4'
  const iconURL = '' // Replace with actual image URL

  const [copied, setCopied] = useState({ id: false })

  const handleCopy = (data, type) => {
    navigator.clipboard.writeText(data)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => {
      setCopied({ ...copied, [type]: false })
    }, 2000)
  }

  return (
    <div>
      <Grid container spacing={3} direction='column' className={classes.grid}>
        <Grid item>
          <PageHeader
            history={history}
            title='Bob?'
            subheading={
              <div>
                <Typography variant='caption' color='textSecondary'>
                  Public Key: <Typography variant='caption' fontWeight='bold'>{counterparty}</Typography>
                  <IconButton size='small' onClick={() => handleCopy(counterparty, 'id')} disabled={copied.id}>
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
          <SimpleTabs />
        </Grid>
      </Grid>
    </div>
  )
}

export default CounterpartyAccess
