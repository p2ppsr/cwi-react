import React from 'react'
import {
  Dialog, DialogTitle, Typography, useMediaQuery
} from '@material-ui/core'
import Logo from '@cwi/logo-react'
import { useTheme, makeStyles } from '@material-ui/styles'
import style from './style'

const useStyles = makeStyles(style, {
  name: 'CustomDialog'
})

const CustomDialog = ({ title, children, ...props }) => {
  const classes = useStyles()
  const theme = useTheme()
  const isFullscreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Dialog
      maxWidth={isFullscreen ? undefined : 'sm'}
      fullWidth={!isFullscreen}
      fullScreen={isFullscreen}
      {...props}
    >
      <DialogTitle className={classes.title_bg} disableTypography>
        <Typography className={classes.title} variant='h4'>
          {title}
        </Typography>
        <Logo rotate color='white' size='2em' />
      </DialogTitle>
      {children}
    </Dialog>
  )
}

export default CustomDialog
