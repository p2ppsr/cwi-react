import React, { forwardRef } from 'react';
import { makeStyles } from '@mui/styles'
import PhoneInput from 'react-phone-number-input';
import { TextField } from '@mui/material'
import 'react-phone-number-input/style.css';

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
  return (
    <div className={classes.phone_wrap}>
      <PhoneInput
        defaultCountry="US"
        inputComponent={PhoneField}
        {...props}
      />
    </div>
  );
};

export default PhoneEntry;
