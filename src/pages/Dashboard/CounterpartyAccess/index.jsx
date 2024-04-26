import React, { useContext, useEffect, useState } from 'react'
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Button
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { makeStyles, useTheme } from '@mui/styles'
import { useLocation, useHistory } from 'react-router-dom'
import PageHeader from '../../../components/PageHeader'
import CounterpartyChip from '../../../components/CounterpartyChip'
import style from './style'
import ProtocolPermissionList from '../../../components/ProtocolPermissionList'
import CertificateAccessList from '../../../components/CertificateAccessList'
import { SettingsContext } from '../../../context/SettingsContext'
import { Signia } from 'babbage-signia'
import confederacyHost from '../../../utils/confederacyHost'
import { defaultIdentity, parseIdentity } from 'identinator'

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

// const trustEndorsementsData = [
//   {
//     name: 'Bob Babbage',
//     statement: 'This endorsement certifies that the following public key belongs to John Smith.',
//     publicKey: 'o3d98a6037da0b1075acedc1316fecc90444e0d990836055fd7a400c1d070bb4',
//     date: '12/06/23',
//     issuer: 'Bob Babbage with PeerCert',
//     expires: 'Never'
//   },
//   {
//     name: 'John Doe',
//     statement: 'This endorsement certifies that the following public key belongs to John Smith.',
//     publicKey: 'o3d98a6037da0b1075acedc1316fecc90444e0d990836055fd7a400c1d070bb4',
//     date: '12/06/23',
//     issuer: 'Bob Babbage with PeerCert',
//     expires: 'Never'
//   },
//   {
//     name: 'Brayden Langley',
//     statement: 'This endorsement certifies that the following public key belongs to John Smith.',
//     publicKey: 'o3d98a6037da0b1075acedc1316fecc90444e0d990836055fd7a400c1d070bb4',
//     date: '12/06/23',
//     issuer: 'Bob Babbage with PeerCert',
//     expires: 'Never'
//   }
// ]

const SimpleTabs = ({ counterparty }) => {
  const [value, setValue] = useState(0)
  const { settings } = useContext(SettingsContext)
  const [trustEndorsements, setTrustEndorsements] = useState([])
  const theme = useTheme()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // Construct a new Signia instance for querying identity
  const signia = new Signia()
  signia.config.confederacyHost = confederacyHost()

  useEffect(() => {
    (async () => {
      try {
        const certifiers = settings.trustedEntities.map(x => x.publicKey)
        const results = await signia.discoverByIdentityKey(counterparty, certifiers)

        if (!results || results.length === 0) {
          // No results! TODO: Handle case
        }
        setTrustEndorsements(results)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

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
        <div style={{ ...theme.templates.boxOfChips, paddingTop: '1em' }}>
          {trustEndorsements.map((endorsement, index) => (
            <CounterpartyChip
              counterparty={endorsement.certifier}
              key={index}
              clickable
            />
          ))}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Apps that can be used within specific protocols to interact with this counterparty.
        <ProtocolPermissionList counterparty={counterparty} itemsDisplayed='protocols' showEmptyList canRevoke />
      </TabPanel>
      <TabPanel value={value} index={2}>
        The certificate fields that you have revealed to this counterparty within specific apps.
        <CertificateAccessList counterparty={counterparty} itemsDisplayed='apps' canRevoke />
      </TabPanel>
    </Box>
  )
}

const useStyles = makeStyles(style, { name: 'counterpartyAccess' })

const CounterpartyAccess = ({ match }) => {
  const { settings } = useContext(SettingsContext)
  const signia = new Signia()
  signia.config.confederacyHost = confederacyHost()
  const history = useHistory()
  const classes = useStyles()
  const [name, setName] = useState(defaultIdentity.name)
  const [profilePhoto, setProfilePhoto] = useState(defaultIdentity.avatarURL)

  const { counterparty } = match.params
  const [copied, setCopied] = useState({ id: false })

  // TODO Handle the case where the profilePhoto is undefined

  const handleCopy = (data, type) => {
    navigator.clipboard.writeText(data)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => {
      setCopied({ ...copied, [type]: false })
    }, 2000)
  }

  useEffect(() => {
    (async () => {
      try {
        // Resolve a Signia verified identity from a counterparty
        const certifiers = settings.trustedEntities.map(x => x.publicKey)
        const results = await signia.discoverByIdentityKey(counterparty, certifiers)
        if (results && results.length > 0) {
          // Compute the most trusted of the results
          let mostTrustedIndex = 0
          let maxTrustPoints = 0
          for (let i = 0; i < results.length; i++) {
            const resultTrustLevel = settings.trustedEntities.find(x => x.publicKey === results[i].certifier).trust
            if (resultTrustLevel > maxTrustPoints) {
              mostTrustedIndex = i
              maxTrustPoints = resultTrustLevel
            }
          }

          // Parse the identity information for the counterparty
          const parsedIdentity = parseIdentity(results[mostTrustedIndex])
          setName(parsedIdentity.name)
          setProfilePhoto(parsedIdentity.avatarURL)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [counterparty])

  return (
    <Grid container spacing={3} direction='column' className={classes.grid}>
      <Grid item>
        <PageHeader
          history={history}
          title={name}
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
          icon={profilePhoto}
          showButton={false}
        />
      </Grid>
      <Grid item>
        <SimpleTabs counterparty={counterparty} />
      </Grid>
    </Grid>
  )
}

export default CounterpartyAccess
