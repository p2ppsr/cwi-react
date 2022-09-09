import React, { useState, useEffect } from 'react'
import {
  DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material'
import CustomDialog from './CustomDialog/index.jsx'

const RecoveryKeyHandler = () => {
  const [open, setOpen] = useState(false)
  const [recoveryKey, setRecoveryKey] = useState('')

  useEffect(() => {
    let id
    (async () => {
      id = await window.CWI.bindCallback(
        'onRecoveryKeyNeedsSaving',
        keyToSave => {
          setRecoveryKey(keyToSave)
          setOpen(true)
        }
      )
    })()
    return () => {
      if (id) {
        window.CWI.unbindCallback('onRecoveryKeyNeedsSaving', id)
      }
    }
  }, [])

  const onKeySaved = async () => {
    await window.CWI.saveRecoveryKey()
    setOpen(false)
  }

  return (
    <CustomDialog
      open={open}
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
          onClick={() => {
            window.CWI.abortRecoveryKey()
            setRecoveryKey('')
            setOpen(false)
          }}
          color='secondary'
        >
          Abort & Cancel
        </Button>
        <Button
          onClick={onKeySaved}
          color='primary'
        >
          Continue
        </Button>
      </DialogActions>
    </CustomDialog>
  )
}

export default RecoveryKeyHandler
