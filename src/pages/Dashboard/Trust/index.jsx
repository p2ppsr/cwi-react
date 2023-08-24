import React, { useState, useContext, useEffect } from 'react'
import { Typography, Button, Slider, TextField, InputAdornment, DialogContent, DialogContentText, DialogActions, LinearProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style.js'
import { SettingsContext } from '../../../context/SettingsContext'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import DomainIcon from '@mui/icons-material/Public'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ExpandLess from '@mui/icons-material/ExpandLess'
import GetTrust from '@mui/icons-material/DocumentScanner'
import Shield from '@mui/icons-material/Security'
import NameIcon from '@mui/icons-material/Person'
import PictureIcon from '@mui/icons-material/InsertPhoto'
import PublicKeyIcon from '@mui/icons-material/Key'
import CustomDialog from '../../../components/CustomDialog'
import isImageUrl from '../../../utils/isImageUrl'

const useStyles = makeStyles(style, {
  name: 'Trust'
})

const TrustedEntity = ({ entity, setTrustedEntities, classes }) => {
          const [trust, setTrust] = useState(entity.trust)

          const handleTrustChange = (e, v) => {
            setTrust(v)
            setTrustedEntities(old => {
              let newEntities = [...old]
              newEntities[newEntities.indexOf(entity)].trust = v
              return newEntities
            })
          }

          return <>
            <div className={classes.entity_icon_name_grid} role='button' onClick={() => history.push(`/dashboard/access/counterparty/${entity.publicKey}`)}>
              <img src={entity.icon} className={classes.entity_icon} />
              <div>
                <Typography><b>{entity.name}</b></Typography>
                <Typography variant='caption' color='textSecondary'>{entity.note}</Typography>
              </div>
            </div>
            <div className={classes.slider_label_grid}>
              <Slider onChange={handleTrustChange} min={0} max={10} step={1} value={trust} />
              <Typography><b>{trust}</b> / 10</Typography>
            </div>
            </>
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

const AddEntityModal = ({ open, setOpen, setTrustedEntities, classes }) => {
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
            <DialogContentText>Enter the domain name for the entity you'd like to trust.</DialogContentText>
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
                  <InputAdornment position="start">
                    <DomainIcon />
                  </InputAdornment>
                ),
              }}
            />
            <br />
            <br />
            {loading ? <LinearProgress /> :
              <Button
                variant='contained'
                size='large'
                endIcon={<GetTrust />}
                type='submit'
                disabled={loading}
              >
                Get Trust Details
              </Button>
            }
          </center>
        </form>}
        {advanced && (
          <form onSubmit={handleDirectSubmit}>
            <DialogContentText>Directly enter the details for the entity you'd like to trust.</DialogContentText>
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
                  <InputAdornment position="start">
                    <NameIcon />
                  </InputAdornment>
                ),
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
                  <InputAdornment position="start">
                    <PictureIcon />
                  </InputAdornment>
                ),
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
                  <InputAdornment position="start">
                    <PublicKeyIcon />
                  </InputAdornment>
                ),
              }}
            />
            <br />
            <br />
            {loading ? <LinearProgress /> :
              <center><Button
                variant='contained'
                size='large'
                endIcon={<GetTrust />}
                type='submit'
                disabled={loading}
              >
                Validate Details
              </Button></center>
            }
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
        >
          Trust This Entity
        </Button>
      </DialogActions>
    </CustomDialog>
  )
}

const Trust = ({ history }) => {
  const [trustThreshold, setTrustThreshold] = useState(1)
  const [trustedEntities, setTrustedEntities] = useState([
    {
      name: 'SigniCert', note: 'Certifies user identities', trust: 1,
      icon: 'https://signia.babbage.systems/images/signiaIcon.png', publicKey: '033215465466846541651654565466684916541981565487955166545654985'
    },
    {
      name: 'GoogCert', note: 'Certifies Google account ownership', trust: 1,
      icon: 'https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png', publicKey: '033215465466846541651654565466684916541981565487955166545654985'
    },
    {
      name: 'DiscordCert', note: 'Certifies Discord handles', trust: 1,
      icon: 'https://static.vecteezy.com/system/resources/previews/018/930/718/original/discord-logo-discord-icon-transparent-free-png.png', publicKey: '033215465466846541651654565466684916541981565487955166545654985'
    }
  ])
  const [search, setSearch] = useState('')
  const [addEntityModalOpen, setAddEntityModalOpen] = useState(false)
  const classes = useStyles()
  const { settings, updateSettings } = useContext(SettingsContext)

  const totalTrustPoints = trustedEntities.reduce((a, e) => a + e.trust, 0)

  useEffect(() => {
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

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1'>Trust Relationships</Typography>
      <Typography paragraph>
        People, businesses, and websites you interact with will need to be certified by these organizations to be trusted automatically by your computer. Otherwise, you'll be warned when you interact with them.
      </Typography>
      <Typography variant='h2'>Trust Threshold</Typography>
      <Typography paragraph>
        You’ve given out a total of <b>{totalTrustPoints} trust {totalTrustPoints === 1 ? 'point' : 'points'}</b>. How many trust points does someone need to be considered trustworthy?
      </Typography>
      <center className={classes.trust_threshold}>
        <div className={classes.slider_label_grid}>
          <Slider min={1} max={totalTrustPoints} step={1} onChange={(e, v) => setTrustThreshold(v)} value={trustThreshold} />
          <Typography><b>{trustThreshold}</b> / {totalTrustPoints}</Typography>
        </div>
      </center>
      <div className={classes.master_grid}>
        <div>
          <Button
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={() => setAddEntityModalOpen(true)}
          >
            Add Trusted Entity
          </Button>
          </div>
        <TextField
          value={search}
          onChange={(e => setSearch(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              ),
            }}
            label='Search'
            placeholder='Trusted certifiers...'
            fullWidth
           sx={{
            '& .MuiInputLabel-root': {
              fontSize: '0.8rem',
            },
            '& .MuiOutlinedInput-root': {
              height: '36px',
              padding: '0 10px',
            }
          }}
        />
        <div style={{ minHeight: '1em' }} />
        <div />
        {shownTrustedEntities.map((entity, i) => <TrustedEntity
          entity={entity}
          setTrustedEntities={setTrustedEntities}
          key={i}
          classes={classes}
        />)}
      </div>
      <AddEntityModal
        open={addEntityModalOpen}
        setOpen={setAddEntityModalOpen}
        setTrustedEntities={setTrustedEntities}
        classes={classes}
      />
    </div>
  )
}

export default Trust
