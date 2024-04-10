/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from 'react'
import { Prompt } from 'react-router-dom'
import { Typography, Button, Slider, TextField, InputAdornment, Hidden, LinearProgress, Snackbar } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style.js'
import { DEFAULT_APP_ICON } from '../../../constants/popularApps'
import { SettingsContext } from '../../../context/SettingsContext'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { toast } from 'react-toastify'
import UIContext from '../../../UIContext.js'

import TrustedEntity from './TrustedEntity.jsx'
import arraysOfObjectsAreEqual from '../../../utils/arraysOfObjectsAreEqual.js'
import AddEntityModal from './AddEntityModal.jsx'
import NavigationConfirmModal from './NavigationConfirmModal.jsx'

const useStyles = makeStyles(style, {
  name: 'Trust'
})

const Trust = ({ history }) => {
  const { env } = useContext(UIContext)
  const { settings, updateSettings } = useContext(SettingsContext)

  // These are some hard-coded defaults, if the user doesn't have any in Settings.
  const [trustThreshold, setTrustThreshold] = useState(settings.trustThreshold || 2)
  const [trustedEntities, setTrustedEntities] = useState(settings.trustedEntities
    ? JSON.parse(JSON.stringify(settings.trustedEntities))
    : [
      {
        name: 'IdentiCert',
        note: 'Certifies legal first and last name, and photos',
        trust: 3,
        icon: env === 'prod' ? 'https://identicert.babbage.systems/favicon.ico' : 'https://staging-identicert.babbage.systems/favicon.ico',
        publicKey: env === 'prod' ? '0295bf1c7842d14babf60daf2c733956c331f9dcb2c79e41f85fd1dda6a3fa4549' : '036dc48522aba1705afbb43df3c04dbd1da373b6154341a875bceaa2a3e7f21528'
      },
      {
        name: 'Babbage Trust Services',
        note: 'Resolves identity information for Babbage-run APIs and Bitcoin infrastructure.',
        trust: 3,
        icon: DEFAULT_APP_ICON,
        publicKey: env === 'prod' ? '028703956178067ea7ca405111f1ca698290a0112a3d7cf3d843e195bf58a7cfa6' : '03d0b36b5c98b000ec9ffed9a2cf005e279244edf6a19cf90545cdebe873162761'
      }
    ])

  const [search, setSearch] = useState('')
  const [addEntityModalOpen, setAddEntityModalOpen] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(window.localStorage.getItem('showDialog') === 'false')
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsNeedsUpdate, setSettingsNeedsUpdate] = useState(true)
  const [nextLocation, setNextLocation] = useState(null)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const classes = useStyles()
  const totalTrustPoints = trustedEntities.reduce((a, e) => a + e.trust, 0)

  useEffect(() => {
    if (trustThreshold > totalTrustPoints) {
      setTrustThreshold(totalTrustPoints)
    }
  }, [totalTrustPoints])

  useEffect(() => {
    setSettingsNeedsUpdate((settings.trustThreshold !== trustThreshold) || (!arraysOfObjectsAreEqual(settings.trustedEntities, trustedEntities)))
  }, [trustedEntities, totalTrustPoints, trustThreshold])

  useEffect(() => {
    const unblock = history.block((location) => {
      // Block navigation when saving settings
      if (settingsNeedsUpdate) {
        setNextLocation(location)
        setSaveModalOpen(true)
        return false
      }
      return true
    })
    return () => {
      unblock()
    }
  }, [settingsNeedsUpdate, history])

  const shownTrustedEntities = trustedEntities.filter(x => {
    if (!search) {
      return true
    }
    return x.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 || x.note.toLowerCase().indexOf(search.toLowerCase()) !== -1
  })

  const handleSave = async () => {
    try {
      setSettingsLoading(true)
      // Show a toast progress bar if not using save modal
      if (!saveModalOpen) {
        toast.promise(
          (async () => {
            await updateSettings(JSON.parse(JSON.stringify({
              trustThreshold,
              trustedEntities
            })))
          })(),
          {
            pending: 'Saving settings...',
            success: {
              render: 'Trust relationships updated!',
              autoClose: 2000
            },
            error: 'Failed to save settings! 🤯'
          }
        )
      } else {
        await updateSettings(JSON.parse(JSON.stringify({
          trustThreshold,
          trustedEntities
        })))
        toast.success('Trust relationships updated!')
      }
      setSettingsNeedsUpdate(false)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSettingsLoading(false)
    }
  }

  return (
    <div className={classes.content_wrap}>
      <NavigationConfirmModal
        open={saveModalOpen}
        onConfirm={async () => {
          setSettingsNeedsUpdate(false)
          await handleSave()
          setSaveModalOpen(false)
          history.push(nextLocation.pathname)
        }}
        onCancel={() => {
          setSettingsNeedsUpdate(false)
          // Make sure state updates complete first
          setTimeout(() => {
            history.push(nextLocation.pathname)
          }, 100)
        }}
        loading={settingsLoading}
      >
        {settingsLoading
          ? <div>
            <Typography>Saving settings...</Typography>
            <LinearProgress paddingTop='1em' />
          </div>
          : 'You have unsaved changes. Do you want to save them before leaving?'}
      </NavigationConfirmModal>
      <Typography variant='h1' color='textPrimary' paddingBottom='0.5em'>Identity Search</Typography>
      <Typography variant='body' color='textSecondary'>
        People, businesses, and websites will need endorsement by these search providers to show up in your apps. Otherwise, you'll see them as "Stranger".
      </Typography>
      <Typography variant='h2' color='textPrimary' padding='0.5em 0em 0.5em 0em'>Threshold</Typography>
      <Typography paragraph variant='body' color='textSecondary'>
        You’ve given out a total of <b>{totalTrustPoints} {totalTrustPoints === 1 ? 'point' : 'points'}</b>. How many points does someone need to show up in your apps?
      </Typography>
      <center className={classes.trust_threshold}>
        <div className={classes.slider_label_grid}>
          <Typography><b>{trustThreshold}</b> / {totalTrustPoints}</Typography>
          <Slider min={1} max={totalTrustPoints} step={1} onChange={(e, v) => setTrustThreshold(v)} value={trustThreshold} />
        </div>
      </center>
      <Prompt
        when={settingsNeedsUpdate}
        message="You have unsaved changes, are you sure you want to leave?"
      />
      <div className={classes.master_grid}>
        <Hidden mdDown>
          <div>
            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={() => setAddEntityModalOpen(true)}
            >
              Add Search Provider
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={() => setAddEntityModalOpen(true)}
          >
            Add Search Provider
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
          placeholder='Find providers...'
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
        <Typography align='center' color='textSecondary' style={{ marginTop: '2em' }}>No Search Providers</Typography>
      )}
      <AddEntityModal
        open={addEntityModalOpen}
        setOpen={setAddEntityModalOpen}
        trustedEntities={trustedEntities}
        setTrustedEntities={setTrustedEntities}
        classes={classes}
      />
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
