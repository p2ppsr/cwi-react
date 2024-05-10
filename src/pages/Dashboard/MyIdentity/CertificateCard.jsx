import React, { useState, useEffect, useContext } from 'react'
import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CertMap } from 'certmap'
import { SettingsContext } from '../../../context/SettingsContext'
import confederacyHost from '../../../utils/confederacyHost'
import { Img } from 'uhrp-react'
import CounterpartyChip from '../../../components/CounterpartyChip'
import { DEFAULT_APP_ICON } from '../../../constants/popularApps'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const CertificateCard = ({ certificate, onClick, clickable = true }) => {
  const [certName, setCertName] = useState('Unknown Cert')
  const [iconURL, setIconURL] = useState(
    DEFAULT_APP_ICON
  )
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState({})
  const certmap = new CertMap()
  certmap.config.confederacyHost = confederacyHost()
  const { settings } = useContext(SettingsContext)
  const history = useHistory()

  useEffect(() => {
    (async () => {
      try {
        const registryOperators = settings.trustedEntities.map(x => x.publicKey)
        const results = await certmap.resolveCertificateByType(certificate.type, registryOperators)
        if (results && results.length > 0) {
          let mostTrustedIndex = 0
          let maxTrustPoints = 0
          for (let i = 0; i < results.length; i++) {
            const resultTrustLevel = settings.trustedEntities.find(x => x.publicKey === results[i].registryOperator)?.trust || 0
            if (resultTrustLevel > maxTrustPoints) {
              mostTrustedIndex = i
              maxTrustPoints = resultTrustLevel
            }
          }
          const mostTrustedCert = results[mostTrustedIndex]
          setCertName(mostTrustedCert.name)
          setIconURL(mostTrustedCert.iconURL)
          setDescription(mostTrustedCert.description)
          // setDocumentationURL(mostTrustedCert.documentationURL)
          setFields(JSON.parse(mostTrustedCert.fields))
        } else {
          console.log('No certificates found.')
        }
      } catch (error) {
        console.error('Failed to fetch certificate details:', error)
      }
    })()
  }, [certificate, settings])


  const handleClick = (e) => {
    if (clickable) {
      if (typeof onClick === 'function') {
        onClick(e)
      } else {
        e.stopPropagation()
        history.push(`/dashboard/certificate/${encodeURIComponent(certificate.type)}`)
      }
    }
  }

  const [modalOpen, setModalOpen] = useState(false)

  const handleModalOpen = () => {
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }


  return (
    <Card>
      <CardContent>
        <Box onClick={handleClick} style={{ cursor: clickable ? 'pointer' : 'default', display: 'flex', flexDirection: 'row', alignItems: 'start', flex: 1 }}>
          <Img
            src={iconURL}
            style={{ width: 50, height: 50 }}
            confederacyHost={confederacyHost()}
          />
          <Box padding='0 0 0.5em 0.5em'>
            <Typography variant="h5">{certName}</Typography>
            <Typography variant="body" fontSize={'0.85em'}>{description}</Typography>
          </Box>
        </Box>
        <span>
          {certificate && certificate.certifier
            ? <div>
              <Grid container alignContent='center' style={{ alignItems: 'center' }}>
                <Grid item>
                  <p style={{ fontSize: '0.9em', fontWeight: 'normal', marginRight: '1em' }}>Issuer:</p>
                </Grid>
                <Grid item paddingBottom={'1em'}>
                  <CounterpartyChip
                    counterparty={certificate.certifier}
                    clickable
                  // onClick={onIssuerClick}
                  />
                </Grid>
              </Grid>
            </div>
            : ''}
        </span>
        {/* <CertificateFields fields={fields} /> */}
        {/* Certificate Details Modal */}
        <Button onClick={handleModalOpen} color="primary">
          View Details
        </Button>
        <CertificateDetailsModal open={modalOpen} onClose={handleModalClose} fields={fields} />
      </CardContent>
    </Card>
  )
}

function CertificateDetailsModal({ open, onClose, fields }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Certificate Fields</DialogTitle>
      <DialogContent dividers>
        {Object.entries(fields).map(([key, value], index) => {
          // Handle string fields or object fields
          const isValueObject = value !== null && typeof value === 'object';
          return (
            <div key={index} style={{ marginBottom: 16 }}>
              <Typography variant="subtitle2" color="textSecondary">
                {isValueObject ? value.friendlyName : key}:
              </Typography>
              <Typography variant="body1">
                {isValueObject ? value.description : value}
              </Typography>
            </div>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// const CertificateFields = ({ fields }) => {
//   return (
//     <Accordion>
//       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Typography>Fields</Typography>
//       </AccordionSummary>
//       <AccordionDetails>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//           {Object.entries(fields).map(([key, value], index) => {
//             // Check if the value is an object and render accordingly
//             const isValueObject = value !== null && typeof value === 'object'
//             return (
//               <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
//                 <Typography variant="subtitle2" color="textSecondary">
//                   {isValueObject ? value.friendlyName : key}:
//                 </Typography>
//                 <Typography variant="body1">
//                   {isValueObject ? value.description : value}
//                 </Typography>
//                 {isValueObject && value.fieldIcon && (
//                   <Img src={value.fieldIcon} confederacyHost={confederacyHost()} alt={`${value.friendlyName} icon`} style={{ width: 24, height: 24 }} />
//                 )}
//               </div>
//             )
//           })}
//         </div>
//       </AccordionDetails>
//     </Accordion>
//   )
// }

export default CertificateCard
