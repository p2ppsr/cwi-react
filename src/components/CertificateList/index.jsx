import React, { useState, useEffect, useCallback } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListSubheader
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import style from './style'
import { Folder, Delete, ExpandMore } from '@mui/icons-material'
import formatDistance from 'date-fns/formatDistance'
import { toast } from 'react-toastify'
import CounterpartyChip from '../CounterpartyChip'
import ProtoChip from '../ProtoChip'

const useStyles = makeStyles(style, {
  name: 'CertificateList'
})

const CertificateList = ({ app, type, limit, displayCount = true, listHeaderTitle, showEmptyList = false }) => {
  console.log('CertificateList()app=', app, ',type=', type, ',limit=', limit, ',displayCount=', displayCount, ',listHeaderTitle=', listHeaderTitle, ',showEmptyList=', showEmptyList)
  const [grants, setGrants] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentAccessGrant, setCurrentAccessGrant] = useState(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [expandedPanel, setExpandedPanel] = useState(false)
  const classes = useStyles()

  const refreshGrants = useCallback(async () => {
    const result = await window.CWI.listCertificateAccess({
      targetDomain: app,
      targetCertificateType: type,
      limit
    })
    setGrants(result)
  }, [app, type])

  const revokeAccess = async grant => {
    setCurrentAccessGrant(grant)
    setDialogOpen(true)
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    console.log({ event, isExpanded })
    setExpandedPanel(isExpanded ? panel : false)
  }

  const handleConfirm = async () => {
    try {
      setDialogLoading(true)
      await window.CWI.revokeCertificateAccess({ grant: currentAccessGrant })
      setGrants(oldAccessGrant =>
        oldAccessGrant.filter(x =>
          x.accessGrantID !== currentAccessGrant.accessGrantID
        )
      )
      setCurrentAccessGrant(null)
      setDialogOpen(false)
      setDialogLoading(false)
      refreshGrants()
    } catch (e) {
      toast.error('Access may not have been revoked: ' + e.message)
      refreshGrants()
      setCurrentAccessGrant(null)
      setDialogOpen(false)
      setDialogLoading(false)
    }
  }

  const handleDialogClose = () => {
    setCurrentAccessGrant(null)
    setDialogOpen(false)
  }

  useEffect(() => {
    refreshGrants()
  }, [refreshGrants])

  // Only render the list if there is items to display
  if (grants.length === 0 && !showEmptyList) {
    return (<></>)
  }

  return (
    <>
      <Dialog
        open={dialogOpen}
      >
        <DialogTitle>
          Revoke Access?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can re-authorize this certificate access grant next time you use this app.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            disabled={dialogLoading}
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            disabled={dialogLoading}
            onClick={handleConfirm}
          >
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
      <List>
        {listHeaderTitle &&
          <ListSubheader>
            {listHeaderTitle}
          </ListSubheader>}
        {grants.map((grant, i) => (
          <ListItem
            key={i}
            className={classes.action_card}
            elevation={4}
          >
            <ListItemAvatar>
              <Avatar className={classes.icon}>
                <Folder />
              </Avatar>
            </ListItemAvatar>

            <Accordion
              expanded={expandedPanel === 'panel' + i} onChange={handleAccordionChange('panel' + i)}
              style={{ maxWidth: window.outerWidth * 0.60 }} // ?
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                {grant.type}
              </AccordionSummary>
              <AccordionDetails
                className={classes.expansion_body}
              >
                <b>Verifier</b>
                <ListItemText
                  style={{ padding: '20px', wordWrap: 'break-word' }}
                >{grant.verifier}
                </ListItemText>
                <ListItemText
                  secondary={`Expires ${formatDistance(new Date(grant.expiry * 1000), new Date(), { addSuffix: true })}`}
                />

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 100 }} aria-label='simple table'>
                    <TableHead>
                      <TableRow
                        sx={{
                          borderBottom: '2px solid black',
                          '& th': {
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }
                        }}
                      >
                        <TableCell>Fields</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        key={i}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      />
                      {grant.fields.map((field, i) => (
                        <TableRow
                          key={i}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component='th' scope='row'>
                            {field}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <ListItemSecondaryAction>
              <IconButton edge='end' onClick={() => revokeAccess(grant)} size='large'>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {displayCount &&
        <center>
          <Typography
            color='textSecondary'
          >
            <i>Total Certificate Access Grants: {grants.length}</i>
          </Typography>
        </center>}

    </>
  )
}

export default CertificateList
