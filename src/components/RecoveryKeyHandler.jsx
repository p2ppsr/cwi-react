import React, { useState, useEffect } from 'react'
import {
  bindCallback,
  unbindCallback,
  saveRecoveryKey,
  abortRecoveryKey
} from 'pages/Settings/About/node_modules/@cwi/core'
import { Dialog, Button, Typography } from '@material-ui/core'

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
    <Dialog
      open={open}
      onClose={() => {
        abortRecoveryKey()
        setRecoveryKey('')
        setOpen(false)
      }}
    >
      <Typography variant='h3' paragraph>
        Save this key
      </Typography>
      <Typography paragraph>
        {recoveryKey}
      </Typography>
      <Button
        onClick={onKeySaved}
      >
        I saved the key
      </Button>
    </Dialog>
  )
}

export default RecoveryKeyHandler
