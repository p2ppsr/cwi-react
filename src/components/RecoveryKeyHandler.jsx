import React, { useState, useEffect } from 'react'
import {
  bindCallback,
  unbindCallback,
  saveRecoveryKey,
  abortRecoveryKey
} from '@cwi/core'
import {
  DialogContent, DialogContentText, DialogActions, Button
} from '@material-ui/core'
import CustomDialog from './CustomDialog/index.jsx'

const RecoveryKeyHandler = () => {
  const [open, setOpen] = useState(false)
  const [recoveryKey, setRecoveryKey] = useState('')

  useEffect(() => {
    const callbackID = bindCallback('onRecoveryKeyNeedsSaving', keyToSave => {
      setRecoveryKey(keyToSave)
      setOpen(true)
    })
    return () => unbindCallback('onRecoveryKeyNeedsSaving', callbackID)
  }, [])

  const onKeySaved = async () => {
    await saveRecoveryKey()
    setOpen(false)
  }

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        abortRecoveryKey()
        setRecoveryKey('')
        setOpen(false)
      }}
      title='Save This Key'
    >
      <DialogContent>
        <DialogContentText>
          You'll need this key if you ever forget your password or lose your phone.
        </DialogContentText>
        <DialogContentText>
          <b style={{ wordWrap: 'break-word' }}>{recoveryKey}</b>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onKeySaved}
          color='primary'
        >
          Saved
        </Button>
      </DialogActions>
    </CustomDialog>
  )
}

export default RecoveryKeyHandler
