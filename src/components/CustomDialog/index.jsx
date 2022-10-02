import React from 'react'
import {
  Dialog, DialogTitle, Typography, useMediaQuery
} from '@mui/material'
import Logo from '../Logo.jsx'
import { useTheme, makeStyles } from '@mui/styles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'CustomDialog'
})

const CustomDialog = ({ title, children, ...props }) => {
  const classes = useStyles()
  const theme = useTheme()
  const isFullscreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      maxWidth={isFullscreen ? undefined : 'sm'}
      fullWidth={!isFullscreen}
      fullScreen={isFullscreen}
      {...props}
    >
      <DialogTitle className={classes.title_bg}>
        <Typography className={classes.title} variant='h4'>
          {title}
        </Typography>
        <Logo rotate color='white' size='2em' />
      </DialogTitle>
      {children}
    </Dialog>
  );
}

export default CustomDialog
