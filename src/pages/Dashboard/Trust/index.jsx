/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ListItem, List, Link, Typography, Button, Slider, TextField, InputAdornment, DialogContent, DialogContentText, DialogActions, LinearProgress, Hidden, Snackbar, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style.js'
import { SettingsContext } from '../../../context/SettingsContext'
import AddIdCertIcon from '../../../images/addIdCertIcon'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import DomainIcon from '@mui/icons-material/Public'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ExpandLess from '@mui/icons-material/ExpandLess'
import GetTrust from '@mui/icons-material/DocumentScanner'
import Shield from '@mui/icons-material/Security'
import Delete from '@mui/icons-material/Close'
import NameIcon from '@mui/icons-material/Person'
import PictureIcon from '@mui/icons-material/InsertPhoto'
import PublicKeyIcon from '@mui/icons-material/Key'
import CustomDialog from '../../../components/CustomDialog'
import isImageUrl from '../../../utils/isImageUrl'
import { toast } from 'react-toastify'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

const useStyles = makeStyles(style, {
  name: 'Trust'
})

const TrustedEntity = ({ entity, setTrustedEntities, classes, history }) => {
  const [trust, setTrust] = useState(entity.trust)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleTrustChange = (e, v) => {
    setTrust(v)
    setTrustedEntities(old => {
      const newEntities = [...old]
      newEntities[newEntities.indexOf(entity)].trust = v
      return newEntities
    })
  }

  const handleDelete = () => {
    setTrustedEntities(old => {
      const newEntities = [...old]
      newEntities.splice(newEntities.indexOf(entity), 1)
      return newEntities
    })
    setDeleteOpen(false)
  }

  return (
    <>
      <div
        className={classes.clickable_entity_icon_name_grid}
        role='button'
        onClick={() => history.push(`/dashboard/access/counterparty/${entity.publicKey}`)}
      >
        <img src={entity.icon} className={classes.entity_icon} />
        <div>
          <Typography><b>{entity.name}</b></Typography>
          <Typography variant='caption' color='textSecondary'>{entity.note}</Typography>
        </div>
      </div>
      <div className={classes.slider_label_delete_grid}>
        <Typography><b>{trust}</b> / 10</Typography>
        <Slider onChange={handleTrustChange} min={0} max={10} step={1} value={trust} />
        <IconButton onClick={() => setDeleteOpen(true)}><Delete fontSize='small' color='textSecondary' /></IconButton>
      </div>
      <Hidden mdUp>
        <div style={{ minHeight: '0.1em' }} />
        <div />
      </Hidden>
      <CustomDialog title='Delete Trust Relationship' open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogContent>
          <DialogContentText>Do you want to delete this trust relationship?</DialogContentText>
          <div className={classes.entity_icon_name_grid}>
            <img src={entity.icon} className={classes.entity_icon} />
            <div>
              <Typography><b>{entity.name}</b></Typography>
              <Typography variant='caption' color='textSecondary'>{entity.note}</Typography>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete}>Yes, Delete</Button>
        </DialogActions>
      </CustomDialog>
    </>
  )
}

const validateTrust = async (trust, { skipNote = false } = {}) => {
  if (trust.name.length < 5 || trust.name.length > 30) {
    const e = new Error('Trust validation failed, name must be 5-30 characters')
    e.field = 'name'
    throw e
  }
  if (!skipNote) {
    if (trust.note.length < 5 || trust.note.length > 50) {
      const e = new Error('Trust validation failed, note must be 5-50 characters')
      e.field = 'note'
      throw e
    }
  }
  const iconValid = await isImageUrl(trust.icon)
  if (!iconValid) {
    const e = new Error('Trust validation failed, icon image URL is invalid')
    e.field = 'icon'
    throw e
  }
  if (/^(02|03)[a-f0-9]{64}$/.test(trust.publicKey) !== true) {
    const e = new Error('Trust validation failed, public key is invalid')
    e.field = 'publicKey'
    throw e
  }
  return true
}

const AddPopularSigniaCertifiersModal = ({
  open, setOpen, setRegisterIdReminder, hasCerts, checkboxChecked, setCheckboxChecked, classes, history
}) => {
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
            <List className={classes.oracle_link_container}>
              <ListItem>
                <div className={classes.oracle_link}>
                  <Link
                    href='https//:government.com'
                    target='_blank' rel='noreferrer'
                  >
                    <center>
                      <img src='https://www.projectbabbage.com/favicon.ico' className={classes.oracle_icon} />
                      <Typography className={classes.oracle_title}>IdentiCert (Government ID)</Typography>
                    </center>
                  </Link>
                </div>
              </ListItem>
              <br />
              <ListItem className={classes.oracles_url_container}>
                <div className={classes.oracle_link}>
                  <Link
                    className={classes.url_link}
                    href='https//google.com'
                    target='_blank' rel='noreferrer'
                  >
                    <center>
                      <img src='https://www.projectbabbage.com/favicon.ico' className={classes.oracle_icon} />
                      <Typography className={classes.oracle_title}>GoogleCert (Google)</Typography>
                    </center>
                  </Link>
                </div>
              </ListItem>
              <br />
              <ListItem className={classes.oracles_url_container}>
                <div className={classes.oracle_link}>
                  <Link
                    className={classes.url_link}
                    href='https//discord.com'
                    target='_blank' rel='noreferrer'
                  >
                    <center>
                      <img src='https://www.projectbabbage.com/favicon.ico' className={classes.oracle_icon} />
                      <Typography className={classes.oracle_title}>DiscordCert (Discord)</Typography>
                    </center>
                  </Link>
                </div>
              </ListItem>
            </List>
          </center>
        </form>
        <br />
        <br />
      </DialogContent>
      <DialogActions style={{ paddingLeft: '1.5em', justifyContent: 'space-between', paddingRight: '1em' }}>
        <FormControlLabel
          label="Don't remind me again"
          control={
            <Checkbox
                checked={ checkboxChecked }
                onChange={(e) => {
                  setCheckboxChecked(e.target.checked)
                }
              }
            >
            </Checkbox>
          }
          >
          </FormControlLabel>
          <Button
            onClick={() => {
              setOpen(false)
              localStorage.setItem('showDialog', !checkboxChecked)
              if (!hasCerts) {
                setRegisterIdReminder(!hasCerts)
              }
              localStorage.setItem('hasVisitedTrust', 'true')
            }}
          >Later
          </Button>
        </DialogActions>
    </CustomDialog>
  )
}

const AddEntityModal = ({
  open, setOpen, trustedEntities, setTrustedEntities, classes
}) => {
  const [domain, setDomain] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [icon, setIcon] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [fieldsValid, setFieldsValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [domainError, setDomainError] = useState(null)
  const [nameError, setNameError] = useState(null)
  const [iconError, setIconError] = useState(null)
  const [publicKeyError, setPublicKeyError] = useState(null)

  const handleDomainSubmit = async e => {
    e.preventDefault()
    try {
      if (!domain) {
        return
      }
      setLoading(true)
      const controller = new window.AbortController()
      const id = setTimeout(() => controller.abort(), 15000)
      const result = await window.fetch(
        `https://${domain}/manifest.json`,
        { signal: controller.signal }
      )
      clearTimeout(id)
      const json = await result.json()
      if (!json.babbage || !json.babbage.trust || typeof json.babbage.trust !== 'object') {
        throw new Error('This domain does not support importing a trust relationship (it needs to follow the BRC-68 protocol)')
      }
      await validateTrust(json.babbage.trust)
      setName(json.babbage.trust.name)
      setNote(json.babbage.trust.note)
      setIcon(json.babbage.trust.icon)
      setPublicKey(json.babbage.trust.publicKey)
      setFieldsValid(true)
    } catch (e) {
      setFieldsValid(false)
      let msg = e.message
      if (msg === 'The user aborted a request.') {
        msg = 'The domain did not respond within 15 seconds'
      }
      if (msg === 'Failed to fetch') {
        msg = 'Could not fetch the trust data from that domain (it needs to follow the BRC-68 protocol)'
      }
      setDomainError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleDirectSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      await validateTrust({
        name,
        icon,
        publicKey
      }, { skipNote: true })
      setNote(name)
      setFieldsValid(true)
    } catch (e) {
      setFieldsValid(false)
      if (e.field) {
        if (e.field === 'name') {
          setNameError(e.message)
        } else if (e.field === 'icon') {
          setIconError(e.message)
        } else { // public key for anything else
          setPublicKeyError(e.message)
        }
      } else {
        setPublicKeyError(e.message) // Public key for other errors
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTrust = async () => {
    setTrustedEntities(t => {
      if (t.some(x => x.publicKey === publicKey)) {
        toast.error('An entity with this public key is already in the list!')
        return t
      }
      setDomain('')
      setName('')
      setNote('')
      setPublicKey('')
      setFieldsValid(false)
      setOpen(false)
      return [
        { name, icon, note, publicKey, trust: 5 },
        ...t
      ]
    })
  }

  return (
    <CustomDialog
      title='Add Trusted Entity'
      open={open}
      onClose={() => setOpen(false)}
      minWidth='lg'
    >
      <DialogContent>
        <br />
        {!advanced &&
          <form onSubmit={handleDomainSubmit}>
            <DialogContentText>Enter the domain name for the entity you&apos;d like to trust.</DialogContentText>
            <br />
            <center className={classes.add_trusted_main}>
              <TextField
                label='Domain Name'
                placeholder='trustedentity.com'
                value={domain}
                onChange={e => {
                  setDomain(e.target.value)
                  setDomainError(null)
                  setFieldsValid(false)
                }}
                fullWidth
                error={!!domainError}
                helperText={domainError}
                variant='filled'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <DomainIcon />
                    </InputAdornment>
                  )
                }}
              />
              <br />
              <br />
              {loading
                ? <LinearProgress />
                : <Button
                    variant='contained'
                    size='large'
                    endIcon={<GetTrust />}
                    type='submit'
                    disabled={loading}
                  >
                  Get Trust Details
                </Button>}
            </center>
          </form>}
        {advanced && (
          <form onSubmit={handleDirectSubmit}>
            <DialogContentText>Directly enter the details for the entity you&apos;d like to trust.</DialogContentText>
            <br />
            <TextField
              label='Entity Name'
              placeholder='Trusted Entity'
              value={name}
              onChange={e => {
                setName(e.target.value)
                setNameError(null)
                setFieldsValid(false)
              }}
              fullWidth
              error={!!nameError}
              helperText={nameError}
              variant='filled'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <NameIcon />
                  </InputAdornment>
                )
              }}
            />
            <br />
            <br />
            <TextField
              label='Icon URL'
              placeholder='https://trustedentity.com/icon.png'
              value={icon}
              onChange={e => {
                setIcon(e.target.value)
                setIconError(null)
                setFieldsValid(false)
              }}
              fullWidth
              error={!!iconError}
              helperText={iconError}
              variant='filled'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <PictureIcon />
                  </InputAdornment>
                )
              }}
            />
            <br />
            <br />
            <TextField
              label='Entity Public Key'
              placeholder='0295bf1c7842d14babf60daf2c733956c331f9dcb2c79e41f85fd1dda6a3fa4549'
              value={publicKey}
              onChange={e => {
                setPublicKey(e.target.value)
                setPublicKeyError(null)
                setFieldsValid(false)
              }}
              fullWidth
              error={!!publicKeyError}
              helperText={publicKeyError}
              variant='filled'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <PublicKeyIcon />
                  </InputAdornment>
                )
              }}
            />
            <br />
            <br />
            {loading
              ? <LinearProgress />
              : <center><Button
                  variant='contained'
                  size='large'
                  endIcon={<GetTrust />}
                  type='submit'
                  disabled={loading}
                        >
                Validate Details
                        </Button>
                </center>}
          </form>
        )}
        <br />
        <br />
        <Button
          onClick={() => setAdvanced(x => !x)}
          startIcon={!advanced ? <ExpandMore /> : <ExpandLess />}
        >
          {advanced ? 'Hide' : 'Show'} Advanced
        </Button>
        {fieldsValid && (
          <div className={classes.fields_display}>
            <div className={classes.entity_icon_name_grid}>
              <img src={icon} className={classes.entity_icon} />
              <div>
                <Typography><b>{name}</b></Typography>
                <Typography variant='caption' color='textSecondary'>{publicKey}</Typography>
              </div>
            </div>
            <br />
            <TextField
              value={note}
              onChange={e => setNote(e.target.value)}
              label='Note'
              fullWidth
              error={note.length < 5 || note.length > 50}
              helperText={note.length < 5 || note.length > 50 ? 'Note must be between 5 and 50 characters' : null}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          disabled={!fieldsValid}
          variant='contained'
          endIcon={<Shield />}
          onClick={handleTrust}
        >
          Trust This Entity
        </Button>
      </DialogActions>
    </CustomDialog>
  )
}

function arraysOfObjectsAreEqual (arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i]
    const obj2 = arr2[i]

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) {
      return false
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false
      }
    }
  }

  return true
}

const Trust = ({ history }) => {
  const location = useLocation()

  const { settings, updateSettings } = useContext(SettingsContext)

  // These are some hard-coded defaults, if the user doesn't have any in Settings.
  const [trustThreshold, setTrustThreshold] = useState(settings.trustThreshold || 2)
  const [trustedEntities, setTrustedEntities] = useState(settings.trustedEntities
    ? JSON.parse(JSON.stringify(settings.trustedEntities))
    : [
        {
          name: 'SigniCert',
          note: 'Certifies legal first and last name, and photos',
          trust: 3,
          icon: 'https://signia.babbage.systems/images/signiaIcon.png',
          publicKey: '0295bf1c7842d14babf60daf2c733956c331f9dcb2c79e41f85fd1dda6a3fa4549'
        }
      ])

  const [search, setSearch] = useState('')
  const [addPopularSigniaCertifiersModalOpen, setAddPopularSigniaCertifiersModalOpen] = useState(false)
  const [addEntityModalOpen, setAddEntityModalOpen] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(localStorage.getItem('showDialog') === 'false')
  const [hasCerts, setHasCerts] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const classes = useStyles()

  const totalTrustPoints = trustedEntities.reduce((a, e) => a + e.trust, 0)
  const { registerIdReminder, setRegisterIdReminder } = location.state

  useEffect(async () => {
    if (localStorage.getItem('hasVisitedTrust') === 'false') {
      localStorage.setItem('showDialog', 'true')
    } else {
      const certs = await window.CWI.ninja.findCertificates()
      /* testing */
      // 1. undefined
      // 2. {}; certs.certificates = []
      // 3. {}; certs.certificates = [0]
      if (typeof certs === 'undefined') {
        console.error('ERROR:window.CWI.ninja.findCertificates() is undefined')
      } else {
        setHasCerts(certs.certificates.length > 0)
      }
    }
    if (localStorage.getItem('showDialog') === 'true') {
      setAddPopularSigniaCertifiersModalOpen(true)
    }
    if (trustThreshold > totalTrustPoints) {
      setTrustThreshold(totalTrustPoints)
    }
  }, [totalTrustPoints])

  const shownTrustedEntities = trustedEntities.filter(x => {
    if (!search) {
      return true
    }
    return x.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 || x.note.toLowerCase().indexOf(search.toLowerCase()) !== -1
  })

  const handleSave = async () => {
    try {
      setSettingsLoading(true)
      await updateSettings(JSON.parse(JSON.stringify({
        trustThreshold,
        trustedEntities
      })))
      toast.success('Trust relationships updated')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSettingsLoading(false)
    }
  }

  const settingsNeedsUpdate = (
    (settings.trustThreshold !== trustThreshold) || (!arraysOfObjectsAreEqual(settings.trustedEntities, trustedEntities))
  )

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1'>Trust Relationships</Typography>
      <Typography paragraph>
        People, businesses, and websites you interact with will need to be certified by these organizations to be trusted automatically by your computer. Otherwise, you&apos;ll be warned when you interact with them.
      </Typography>
      <Typography variant='h2'>Trust Threshold</Typography>
      <Typography paragraph>
        You&apos;ve given out a total of <b>{totalTrustPoints} trust {totalTrustPoints === 1 ? 'point' : 'points'}</b>. How many trust points does someone need to be considered trustworthy?
      </Typography>
      <center className={classes.trust_threshold}>
        <div className={classes.slider_label_grid}>
          <Typography><b>{trustThreshold}</b> / {totalTrustPoints}</Typography>
          <Slider min={1} max={totalTrustPoints} step={1} onChange={(e, v) => setTrustThreshold(v)} value={trustThreshold} />
        </div>
      </center>
      <div className={classes.master_grid}>
        <Hidden mdDown>
          <div>
            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={() => setAddEntityModalOpen(true)}
            >
              Add Trusted Entity
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={() => setAddEntityModalOpen(true)}
          >
            Add Trusted Entity
          </Button>
        </Hidden>
        <TextField
          value={search}
          onChange={(e => setSearch(e.target.value))}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' />
              </InputAdornment>
            )
          }}
          label='Search'
          placeholder='Trusted certifiers...'
          fullWidth
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '0.8rem'
            },
            '& .MuiOutlinedInput-root': {
              height: '36px',
              padding: '0 10px'
            }
          }}
        />
        <Hidden mdDown>
          <div style={{ minHeight: '1em' }} />
          <div />
        </Hidden>
        {shownTrustedEntities.map((entity, i) => <TrustedEntity
          entity={entity}
          setTrustedEntities={setTrustedEntities}
          key={`${entity.name}.${entity.note}.${entity.publicKey}`}
          classes={classes}
          history={history}
                                                 />)}
      </div>
      {shownTrustedEntities.length === 0 && (
        <Typography align='center' color='textSecondary' style={{ marginTop: '2em' }}>No Trusted Entities</Typography>
      )}

      <AddPopularSigniaCertifiersModal
        open={addPopularSigniaCertifiersModalOpen}
        setOpen={setAddPopularSigniaCertifiersModalOpen}
        setRegisterIdReminder={ setRegisterIdReminder }
        hasCerts={hasCerts}
        checkboxChecked={checkboxChecked}
        setCheckboxChecked={setCheckboxChecked}
        classes={classes}
        history={history}
      />
      <AddEntityModal
        open={addEntityModalOpen}
        setOpen={setAddEntityModalOpen}
        trustedEntities={trustedEntities}
        setTrustedEntities={setTrustedEntities}
        classes={classes}
      />
      <br />
      <Hidden mdDown>
        <center>
          <div>
            <Typography variant='h3' align='center' color='textPrimary' className={classes.oracle_open_title}>
              Please register your identity to start using the MetaNet Client.
            </Typography>
            <br />
            <Button
              className={classes.oracle_button}
              startIcon={<AddIdCertIcon />}
              variant='outlined'
              onClick={() => {
                setAddPopularSigniaCertifiersModalOpen(true)
              }}
            >Register your identity
            </Button>
          </div>
        </center>
      </Hidden>
      <Hidden mdUp>
        <center>
          <div>
            <Typography variant='h3' align='center' color='textPrimary' className={classes.oracle_open_title}>
              Please register your identity to start using the MetaNet Client.
            </Typography>
            <br />
            <Button
              className={classes.oracle_button}
              startIcon={<AddIdCertIcon />}
              variant='outlined'
              onClick={() => {
                setAddPopularSigniaCertifiersModalOpen(true)
              }}
            >Register your identity
            </Button>
          </div>
        </center>
      </Hidden>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={settingsNeedsUpdate}
        message='You have unsaved changes!'
        action={
          <>
            <Button
              disabled={settingsLoading}
              color='secondary' size='small'
              onClick={handleSave}
            >
              {settingsLoading ? 'Saving...' : 'Save'}
            </Button>
          </>
      }
      />
    </div>
  )
}

export default Trust
