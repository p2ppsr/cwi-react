import React, { forwardRef, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { TextField } from '@mui/material'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const useStyles = makeStyles(theme => ({
  phone_wrap: {
    width: '100%',
    '& > div': {
      width: '100%'
    }
  }
}), { name: 'PhoneEntry' })
const PhoneField = forwardRef((props, ref) => (
  <TextField
    {...props}
    inputRef={ref}
    fullWidth
  />
))
const PhoneEntry = props => {
  const classes = useStyles()
  const [countryCode, setCountryCode] = useState('UK')
  return (
    <div className={classes.phone_wrap}>
      {/* <CountrySelect
        className={classes.countrySelect}
        defaultCountry={countryCode}
        onChange={countryCode => setCountryCode(countryCode)}
      /> */}
      <PhoneInput
        country={countryCode}
        inputComponent={PhoneField}
        {...props}
      />
    </div>
  )
}

export default PhoneEntry
