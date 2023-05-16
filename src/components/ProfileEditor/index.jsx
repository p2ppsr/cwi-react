import React, { useState, useRef, useEffect, useContext } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Fab,
  Typography,
  CircularProgress
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import UploadIcon from '@mui/icons-material/Backup'
import DeleteIcon from '@mui/icons-material/Delete'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { toast } from 'react-toastify'
import { invoice, pay, upload } from 'nanostore-publisher'
import { Img } from 'uhrp-react'
import getConfederacyHost from '../../utils/confederacyHost'
import UIContext from '../../UIContext'

const useStyles = makeStyles(style, {
  name: 'ProfileEditor'
})

const ProfileEditor = ({
  open,
  welcome,
  name,
  photoURL,
  onSave = () => { },
  onClose = () => { }
} = {}) => {
  const { env, isPackaged } = useContext(UIContext)
  const classes = useStyles()
  const [editableName, setEditableName] = useState(name)
  const [editablePhotoURL, setEditablePhotoURL] = useState(photoURL)
  const fileInputRef = useRef()
  const [imageCropSrc, setImageCropSrc] = useState(null)
  const [imageCrop, setImageCrop] = useState({ aspect: 1 })
  const [cropImageRef, setCropImageRef] = useState(null)
  const [imageBlob, setImageBlob] = useState(null)
  const [loading, setLoading] = useState(false)

  // Update editable state when non-editable props change
  useEffect(() => {
    if (open === true) {
      setEditablePhotoURL(photoURL)
      setEditableName(name)
    }
  }, [open, name, photoURL])

  const handleSubmit = async e => {
    e.preventDefault()
    // Close the modal if no changes were made
    if (name === editableName && photoURL === editablePhotoURL) {
      onClose()
      return
    }
    if (!editableName) {
      toast.error('Enter a name!')
      return
    }

    try {
      setLoading(true)

      // This is the URL to send to Dojo for the profile photo update
      let effectivePhotoURL

      // If the photo URL has changed, the new photo is uploaded with NanoStore
      if (photoURL !== editablePhotoURL) {
        const file = new File(
          [imageBlob],
          'profile.png'
        )
        const serverURL = env === 'dev'
          ? isPackaged
            ? 'https://staging-nanostore.babbage.systems'
            : 'http://localhost:3104'
          : env === 'staging'
            ? 'https://staging-nanostore.babbage.systems'
            : 'https://nanostore.babbage.systems'

        const invoiceResult = await invoice({
          fileSize: file.size,
          retentionPeriod: 525600 * 5, // Five years
          config: {
            nanostoreURL: serverURL
          }
        })

        const payResult = await pay({
          config: {
            nanostoreURL: serverURL
          },
          description: 'Set a new profile photo',
          orderID: invoiceResult.ORDER_ID,
          recipientPublicKey: invoiceResult.identityKey,
          amount: invoiceResult.amount
        })

        const response = await upload({
          uploadURL: payResult.uploadURL,
          publicURL: invoiceResult.publicURL,
          serverURL,
          file,
          config: {
            nanostoreURL: serverURL
          }
        })

        effectivePhotoURL = `uhrp:${response.hash}`

        // Otherwise, the URL remains the same
      } else {
        effectivePhotoURL = photoURL
      }

      // The new Avatar is updated with Ninja
      await window.CWI.ninja.setAvatar({
        name: editableName,
        photoURL: effectivePhotoURL
      })

      // Save, close and stop loading
      onSave()
      onClose()

      if (welcome) {
        toast.dark('Welcome! Your new profile is active!')
      } else {
        toast.dark('Profile updated!')
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const processFile = async e => {
    if (fileInputRef.current.files[0]) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageCropSrc(reader.result)
      }
      reader.readAsDataURL(fileInputRef.current.files[0])
    }
  }

  const handleImageLoad = img => {
    setCropImageRef(img)
  }

  const processCroppedImage = async () => {
    setEditablePhotoURL(await getCroppedImg(
      cropImageRef,
      imageCrop,
      'profile.jpg'
    ))
    setImageCropSrc(null)
  }

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width || image.width
    canvas.height = crop.height || image.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      (crop.width || image.width) * scaleX,
      (crop.height || image.height) * scaleY,
      0,
      0,
      (crop.width || image.width),
      (crop.height || image.height)
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          toast.error('Click and drag on your image to crop!')
          return
        }
        resolve(window.URL.createObjectURL(blob))
        setImageBlob(blob)
      }, 'image/jpeg')
    })
  }

  const handleClose = () => {
    if (!welcome && !loading) {
      onClose()
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      if (!window.confirm('Delete your profile photo?')) {
        setLoading(false)
        return
      }
      // The new Avatar is updated with Ninja
      await window.CWI.ninja.setAvatar({
        name: editableName,
        photoURL: ''
      })
      // Save, close and stop loading
      onSave()
      onClose()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const confederacyHostURL = getConfederacyHost()

  return (
    <Dialog open={!!open} onClose={handleClose}>
      <DialogTitle>
        {welcome ? 'Create Your Profile' : 'Your Profile'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={classes.dialog_content}>
          {imageCropSrc
            ? (
              <div className={classes.cropper_wrap}>
                <ReactCrop
                  src={imageCropSrc}
                  crop={imageCrop}
                  onChange={e => setImageCrop(e)}
                  onImageLoaded={handleImageLoad}
                />
                <br />
                <Typography
                  align='center'
                  color='textSecondary'
                  paragraph
                >
                  Drag to crop image
                </Typography>
                <div className={classes.crop_buttons_wrap}>
                  <Button
                    variant='contained'
                    onClick={() => setImageCropSrc(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    onClick={processCroppedImage}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            )
            : (
              <>
                <div className={classes.image_frame}>
                  <input
                    type='file'
                    className={classes.hidden}
                    ref={fileInputRef}
                    onChange={processFile}
                  />
                  <Fab
                    className={classes.upload_button}
                    onClick={() => fileInputRef.current.click()}
                    color='primary'
                  >
                    <UploadIcon />
                  </Fab>
                  <Fab
                    className={classes.delete_button}
                    onClick={handleDelete}
                    size='small'
                  >
                    <DeleteIcon color='secondary' />
                  </Fab>
                  {editablePhotoURL && (
                    <Img
                      src={editablePhotoURL}
                      className={classes.photo}
                      alt=''
                      confederacyHost={confederacyHostURL}
                    />
                  )}
                </div>
                <Typography
                  align='center'
                  color='textSecondary'
                  paragraph
                >
                  Click to upload image
                </Typography>
                <TextField
                  label='Name'
                  onChange={e => {
                    setEditableName(e.target.value)
                  }}
                  defaultValue={editableName}
                  value={editableName}
                  fullWidth
                />
              </>
            )}
        </DialogContent>
        <DialogActions>
          {(welcome && !loading) && (
            <Button
              onClick={onClose}
            >
              Skip
            </Button>
          )}
          {loading
            ? (
              <CircularProgress />
            )
            : (
              <Button
                type='submit'
                disabled={(!!imageCropSrc) || !editableName}
              >
                Save
              </Button>
            )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ProfileEditor
