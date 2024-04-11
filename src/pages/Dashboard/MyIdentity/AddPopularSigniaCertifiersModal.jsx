/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ListItem, List, Link, Typography, Button, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import CustomDialog from '../../../components/CustomDialog'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import UIContext from '../../../UIContext.js'

const CERTIFICATE_CHECK_INTERVAL = 5000

const AddPopularSigniaCertifiersModal = ({
  open, setOpen, setRegisterIdReminder, checkboxChecked, setCheckboxChecked, classes, history
}) => {
  const { env } = useContext(UIContext)
  const popularCertifiers = [
    {
      URL: env === 'prod' ? 'https://identicert.me' : 'https://staging.identicert.me',
      name: 'IdentiCert (Government ID)'
    },
    {
      URL: env === 'prod' ? 'https://socialcert.net' : 'https://staging.socialcert.net',
      name: 'SocialCert (Social platforms, Phone, Email)'
    },
    {
      URL: env === 'prod' ? 'https://googcert.babbage.systems' : 'https://staging-googcert.babbage.systems',
      name: 'GoogCert (Google account)',
      hide: true
    }
  ]
  const previousCertsCount = useRef(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const checkForCertificates = async () => {
    const certs = await window.CWI.ninja.findCertificates()
    const currentCertsCount = certs && certs.certificates ? certs.certificates.length : 0

    // Show success message only when new certificates are received after the first check
    if (previousCertsCount.current !== null && currentCertsCount > previousCertsCount.current) {
      setRegisterIdReminder(false)
      setShowSuccessMessage(true)
    }

    if (currentCertsCount === 0) {
      setRegisterIdReminder(true)
    }

    // Update previousCertsCount for the next comparison
    previousCertsCount.current = currentCertsCount
  }

  useEffect(() => {
    // Perform an initial check
    checkForCertificates()

    // Then set up the interval for subsequent checks
    const interval = setInterval(() => {
      checkForCertificates()
    }, CERTIFICATE_CHECK_INTERVAL)

    // Cleanup function to clear interval
    return () => clearInterval(interval)
  }, [])

  return (
    <CustomDialog
      open={open}
      title='Register Your Identity'
      onClose={() => setOpen(false)}
      minWidth='lg'
    >
      <DialogContent>
        <br />
        <form>
          <DialogContentText>Register your details to connect with the community and be easily discoverable to others!
          </DialogContentText>
          <center>
            {!showSuccessMessage
              ? <List className={classes.oracle_link_container}>
                {popularCertifiers.map((c, i) => {
                  if (c.hide) {
                    return null
                  }
                  return (
                    <ListItem key={i}>
                      <div className={classes.oracle_link}>
                        <Link
                          href={c.URL}
                          target='_blank' rel='noopener noreferrer'
                        >
                          <center>
                            <img src={`${c.URL}/favicon.ico`} className={classes.oracle_icon} />
                            <Typography className={classes.oracle_title}>{c.name}</Typography>
                          </center>
                        </Link>
                      </div>
                    </ListItem>
                  )
                })}
              </List>
              : <Typography>Registration complete!</Typography>
            }
          </center>
        </form>
        <br />
        <br />
      </DialogContent>
      <DialogActions style={{ paddingLeft: '1.5em', justifyContent: 'space-between', paddingRight: '1em' }}>
        <Button
          onClick={async () => {
            setOpen(false)
            await checkForCertificates()
          }}
        >
          {showSuccessMessage ? 'Done' : 'Later'}
        </Button>
      </DialogActions>
    </CustomDialog>
  )
}
export default AddPopularSigniaCertifiersModal
