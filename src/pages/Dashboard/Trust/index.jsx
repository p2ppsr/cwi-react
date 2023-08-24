import React, { useState, useContext, useEffect } from 'react'
import { Typography, Button, Slider, Divider, TextField, InputAdornment } from '@mui/material'
import { makeStyles } from '@mui/styles'
import style from './style.js'
import { SettingsContext } from '../../../context/SettingsContext'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'

const useStyles = makeStyles(style, {
  name: 'Trust'
})

const Trust = ({ history }) => {
  const [trustThreshold, setTrustThreshold] = useState(1)
  const [trustedEntities, setTrustedEntities] = useState([
    { name: 'SigniCert', note: 'Certifies user identities', trust: 1 }
  ])
  const classes = useStyles()
  const { settings, updateSettings } = useContext(SettingsContext)

  const totalTrustPoints = trustedEntities.reduce((a, e) => a + e.trust, 0)

  useEffect(() => {
    if (trustThreshold > totalTrustPoints) {
      setTrustThreshold(totalTrustPoints)
    }
  }, [totalTrustPoints])

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1'>Trust Relationships</Typography>
      <Typography paragraph>People, businesses, and websites you interact with will need to be certified by these organizations to be trusted automatically by your computer. Otherwise, you'll be warned when you interact with them.</Typography>
      <Divider />
      <div className={classes.master_grid}>
        <div>
          <Typography variant='h2'>Trust Threshold</Typography>
          <Typography paragraph>
            You’ve given out a total of <b>{totalTrustPoints}</b> trust {totalTrustPoints === 1 ? 'point' : 'points'}. How many trust points does someone need to be considered trustworthy?
          </Typography>
        </div>
        <div className={classes.slider_label_grid}>
          <Slider min={1} max={totalTrustPoints} step={1} onChange={(e, v) => setTrustThreshold(v)} value={trustThreshold} />
          <Typography><b>{trustThreshold}</b> / {totalTrustPoints}</Typography>
        </div>
        <div>
          <Button variant='outlined' startIcon={<AddIcon />} >Add Trusted Entity</Button>
        </div>
        <div>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            label='Search'
            placeholder='Trusted certifiers...'
            fullWidth
          />
        </div>
        {trustedEntities.map((entity, i) => {
          const [trust, setTrust] = useState(entity.trust)

          const handleTrustChange = (e, v) => {
            setTrust(v)
            setTrustedEntities(old => {
              let newEntities = [...old]
              newEntities[i].trust = v
              return newEntities
            })
          }

          return <>
            <div className={classes.entity_icon_name_grid} key={i}>
              <img src='#' />
              <div>
                <Typography><b>{entity.name}</b></Typography>
                <Typography>{entity.note}</Typography>
              </div>
            </div>
            <div className={classes.slider_label_grid}>
              <Slider onChange={handleTrustChange} min={0} max={10} step={1} value={trust} />
              <Typography><b>{trust}</b> / 10</Typography>
            </div>
            </>
        })}
      </div>
    </div>
  )
}

export default Trust
