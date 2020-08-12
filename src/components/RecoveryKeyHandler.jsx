import React, { useState, useEffect } from 'react'
import {
  bindCallback,
  saveRecoveryKey
} from '@p2ppsr/cwi-auth'
import { Dialog, Button, Typography } from '@material-ui/core'

const RecoveryKeyHandler = () => {
  const [open, setOpen] = useState(false)
  const [recoveryKey, setRecoveryKey] = useState('')

  useEffect(() => {
    bindCallback('onRecoveryKeyNeedsSaving', keyToSave => {
      setRecoveryKey(keyToSave)
      setOpen(true)
    })
  }, [])

  const onKeySaved = async () => {
    await saveRecoveryKey()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
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
