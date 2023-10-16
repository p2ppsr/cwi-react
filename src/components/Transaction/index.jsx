import React, { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Grid, Snackbar, Alert } from '@mui/material'
import { useTheme } from '@mui/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import CheckIcon from '@mui/icons-material/Check'

/**
 * Transaction Component for displaying information about an Action that happened
 * @param {object} props
 * @param {string}  props.txid - the id of transaction associated with the action being displayed
 * @param {string} props.description - action description to display
 * @param {string} props.amount - amount of this transaction formatted with + or - depending on debit / credit
 * @param {object} props.inputs - the inputs to this transaction
 * @param {object} props.outputs - the outputs to this transaction
 * @param {string} props.formattedTime - transaction date formatted in standard ISO 8601 datetime format
 * @param {function} [props.onClick] - callback function to call when this component is clicked
 * @param {boolean} [props.isExpanded] - allows a parent page to override the expanded property of the accordion display the transaction details
 * @returns
 */
const Transaction = (props) => {
  const [expanded, setExpanded] = useState(props.isExpanded || false)
  const [copied, setCopied] = useState(false)
  const theme = useTheme()

  // Dynamically figure out if the amount is a credit or debit
  // Note: assumes standard amount string starting with + or -
  const determineAmountColor = (amount) => {
    if (amount[0] === '+') {
      return 'green'
    } else if (amount[0] === '-') {
      return 'red'
    } else {
      return 'black'
    }
  }

  // Allow parent accordion override
  const handleExpand = () => {
    if (props.isExpanded !== undefined) {
      setExpanded(props.isExpanded)
    } else {
      setExpanded(!expanded)
    }
    if (props.onClick) {
      props.onClick()
    }
  }

  // Copies the TXID and timeouts the checkmark icon
  const handleCopy = () => {
    navigator.clipboard.writeText(props.txid)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  // Splits the txid into two evenly sized strings for displaying
  const splitString = (str, length) => {
    const firstLine = str.slice(0, length)
    const secondLine = str.slice(length)
    return [firstLine, secondLine]
  }
  const [firstLine, secondLine] = splitString(props.txid, 32)

  // Gets time ago assuming standard ISO 8601 time format
  const getTimeAgo = (timestamp) => {
    try {
      const currentTime = new Date()
      const diff = currentTime - new Date(timestamp)

      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const years = Math.floor(days / 365)

      // Format the message to display
      if (years > 0) {
        return years === 1 ? `${years} year ago` : `${years} years ago`
      } else if (days > 0) {
        return days === 1 ? `${days} day ago` : `${days} days ago`
      } else if (hours > 0) {
        return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`
      } else if (minutes > 0) {
        return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`
      } else {
        if (isNaN(minutes)) {
          return 'Unknown'
        }
        return 'Just now'
      }
    } catch (error) {
      return 'Unknown'
    }
  }

  return (
    <Accordion expanded={expanded} onChange={handleExpand}>
      <AccordionSummary
        style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        expandIcon={<ExpandMoreIcon />}
        aria-controls='transaction-details-content'
        id='transaction-details-header'
      >
        <Grid container direction='column'>
          <Grid item>
            <Typography variant='h5' style={{ color: theme.palette.text.primary }}>{props.description}</Typography>
          </Grid>
          <Grid item>
            <Grid container justifyContent='space-between'>
              <Grid item>
                <Typography variant='h6' style={{ color: determineAmountColor(props.amount) }}>{props.amount}</Typography>
              </Grid>
              <Grid item>
                <Typography variant='body2' style={{ color: theme.palette.text.secondary }}>{getTimeAgo(props.formattedTime)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails style={{ padding: '1.5em' }}>
        <Typography>TXID</Typography>
        <div style={{ width: '100%' }}>
          <Grid container alignItems='center'>
            <div style={{
              display: 'inline-block',
              wordBreak: 'break-all',
              maxWidth: '32ch',
              marginLeft: '0.5em',
              marginRight: '0.5em'
            }}
            >
              <Typography variant='body' style={{ color: theme.palette.text.secondary, userSelect: 'all' }}>{firstLine}</Typography>
              <Typography variant='body' style={{ color: theme.palette.text.secondary, userSelect: 'all' }}>{secondLine}</Typography>
            </div>
            <IconButton onClick={handleCopy} disabled={copied}>
              {copied ? <CheckIcon /> : <FileCopyIcon />}
            </IconButton>
          </Grid>
          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={() => setCopied(false)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            style={{ paddingRight: '1em' }}
          >
            <Alert severity='success'>
              Copied!
            </Alert>
          </Snackbar>
          <div>
            <Typography variant='h6'>Inputs:</Typography>
            <div style={{ marginLeft: '0.5em' }}>
              <Grid container direction='column' style={{ padding: '0.5em' }}>
                {props.inputs.map((input, index) => (
                  <div key={index}>
                    <Grid item sx={12}>
                      <Typography variant='body'>{`${index + 1}. ${input.description}`}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant='body2' style={{ color: determineAmountColor(input.amount), marginLeft: '1em' }}>{input.amount}</Typography>
                    </Grid>
                  </div>
                ))}
              </Grid>
            </div>
            <Typography variant='h6'>Outputs:</Typography>
            <div style={{ marginLeft: '0.5em' }}>
              <Grid container direction='column' style={{ padding: '0.5em' }}>
                {props.outputs.map((output, index) => (
                  <div key={index}>
                    <Grid item sx={12}>
                      <Typography variant='body'>{`${index + 1}. ${output.description}`}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant='body2' style={{ color: determineAmountColor(output.amount), marginLeft: '1em' }}>{output.amount}</Typography>
                    </Grid>
                  </div>
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

export default Transaction
