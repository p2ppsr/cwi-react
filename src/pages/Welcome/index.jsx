import React, { useState, useContext } from 'react'
import {
  Typography,
  TextField,
  InputAdornment,
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  Grid
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import { toast } from 'react-toastify'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { SettingsProvider, SettingsContext } from '../../context/SettingsContext.js'
import UserTheme from '../../components/UserTheme.jsx'

const useStyles = makeStyles(style, {
  name: 'Welcome'
})

// Custom dropdown menu - maybe move to separate file
const DropdownButton = ({ style = '', title, options }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [expanded, setExpanded] = useState(false)
  const { settings, updateSettings } = useContext(SettingsContext)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setExpanded(!expanded)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setExpanded(false)
  }

  // TODO: support saving the correct setting, not just theme
  const handleOptionChange = (option) => {
    setSelectedOption(option)
    console.log(settings)
    // Update the saved theme settings
    updateSettings({
      theme: option
    })

    handleClose()
  }

  return (
    <Grid container direction='column' alignItems='center' spacing={2}>
      <Grid item>
        <Typography variant='h6' align='center'>
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          aria-controls={`${title}-menu`}
          aria-haspopup='true'
          variant='contained'
          onClick={handleClick}
          className={style}
          sx={{ paddingLeft: '2.5em' }}
        >
          {selectedOption}
          <IconButton
            aria-controls={`${title}-menu`}
            aria-haspopup='true'
            onClick={handleClick}
          >
            <ExpandMoreIcon
              sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </IconButton>
        </Button>
        <Menu
          id={`${title}-menu`}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: anchorEl ? anchorEl.clientWidth : 'auto'
            }
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} onClick={() => handleOptionChange(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </Grid>
  )
}

const Welcome = ({ history }) => {
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

  return (
    <SettingsProvider>
      <UserTheme>
        <div className={classes.content_wrap}>
          <center className={classes.content}>
            <Grid container direction='column' alignItems='center' spacing={2}>
              <Grid item>
                <Typography
                  variant='h1'
                  paragraph
                  sx={{ paddingBottom: '2em' }}
                >
                  Your portal to the MetaNet — And beyond!
                </Typography>
                <Typography paragraph>
                  Let's start by setting your preferences.
                </Typography>
              </Grid>
              <Grid container spacing={1} alignItems='center' xs={5}>
                <Grid item xs={6}>
                  <DropdownButton title='Theme' options={['Light', 'Dark']} style={classes.preferenceButton} />
                </Grid>
                <Grid item xs={6}>
                  <DropdownButton title='Currency' options={['USD', 'BSV', 'EURO', 'GBP']} style={classes.preferenceButton} />
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'
                  size='large'
                  className={classes.button}
                  sx={{ marginTop: '3em' }}
                >
                  View Dashboard
                </Button>
              </Grid>
            </Grid>
          </center>
        </div>
      </UserTheme>
    </SettingsProvider>
  )
}

export default Welcome
