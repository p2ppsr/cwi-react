import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import AppChip from '../AppChip/index.jsx'
import style from './style'
import VisibilitySensor from 'react-visibility-sensor'
import Satoshis from '../Satoshis.jsx'
import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import Refresh from '@mui/icons-material/Refresh'

const useStyles = makeStyles(style, {
  name: 'ActionList'
})

const ActionList = ({ app }) => {
  const [actions, setActions] = useState([])
  const [totalActions, setTotalActions] = useState(0)
  const [actionsLoading, setActionsLoading] = useState(false)
  const classes = useStyles()
  const label = app ? `babbage_app_${app}` : undefined

  const refreshActions = async l => {
    try {
      setActionsLoading(true)
      const result = await window.CWI.ninja.getTransactions({
        limit: 10,
        label,
        status: 'completed'
      })
      setActions(result.transactions)
      setTotalActions(result.totalTransactions)
      setActionsLoading(false)
    } catch (e) {
      console.error(e)
      setActionsLoading(false)
    }
    try {
      await window.CWI.ninja.processPendingTransactions()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    refreshActions(label)
  }, [label])

  const loadMoreActions = async () => {
    try {
      setActionsLoading(true)
      const result = await window.CWI.ninja.getTransactions({
        limit: 25,
        offset: actions.length,
        label,
        status: 'completed'
      })
      setActions(actions => ([...actions, ...result.transactions]))
      setActionsLoading(false)
    } catch (e) {
      setActionsLoading(false)
    }
  }

  return (
    <div className={classes.content_wrap}>
      <Button
        color='primary'
        endIcon={<Refresh color='primary' />}
        onClick={() => refreshActions(label)}
        className={classes.refresh_btn}
        disabled={actionsLoading}
      >
        Refresh
      </Button>
      {actions
        .filter(x => x.status === 'completed')
        .map((a, i) => {
          if (a.labels.includes('babbage_protocol_perm')) {
            const fields = a.note.split(' ')
            const granted = fields[0] === 'Grant'
            const app = fields[1]
            fields.shift()
            fields.shift()
            let protocol = fields.join(' ').split(':')[0]
            if (protocol.indexOf(',') !== -1) {
              protocol = protocol.split(',')[1]
            }
            if (!granted) {
              return ( // TODO
                <Typography component='span' paragraph key={i}>
                  You revoked a protocol permission
                </Typography>
              )
            }
            return (
              <Typography component='span' paragraph key={i}>
                You {granted ? 'allowed' : 'revoked'} <AppChip label={`babbage_app_${app}`} /> to access <b>{protocol}</b>
              </Typography>
            )
          } if (a.labels.includes('babbage_basket_access')) {
            const fields = a.note.split(' ')
            const granted = fields[0] === 'Grant'
            const app = fields[1]
            fields.shift()
            fields.shift()
            let protocol = fields.join(' ').split(':')[0]
            if (protocol.indexOf(',') !== -1) {
              protocol = protocol.split(',')[1]
            }
            if (!granted) {
              return ( // TODO
                <Typography component='span' paragraph key={i}>
                  You revoked a basket access grant
                </Typography>
              )
            }
            return (
              <Typography component='span' paragraph key={i}>
                You {granted ? 'allowed' : 'revoked'} <AppChip label={`babbage_app_${app}`} /> to access ?<b>{protocol}</b>
              </Typography>
            )
          } if (a.labels.includes('babbage_certificate_access')) {
            debugger
            const fields = a.note.split(' ')
            const granted = fields[0] === 'Grant'
            const app = fields[1]
            fields.shift()
            fields.shift()
            let certificateType = fields.join(' ').split(':')[0]
            if (certificateType.indexOf(',') !== -1) {
              certificateType = certificateType.split(',')[1]
            }
            if (certificateType.indexOf(' ') !== -1) {
              certificateType = certificateType.split(' ')[1]
            }
            if (!granted) {
              return (
                <Typography component='span' paragraph key={i}>
                  You revoked a certificate access grant
                </Typography>
              )
            }
            return (
              <Card
                key={i}
                className={classes.action_card}
                elevation={4}
              >
                <CardContent>
                  <Typography
                    variant='h3'
                    className={classes.title_text}
                  >
                    Certificate Access {granted ? 'Granted' : 'Revoked'}
                  </Typography>
                  <Typography component='span' paragraph key={i}>
                    You {granted ? 'allowed' : 'revoked'} <AppChip label={`babbage_app_${app}`} /> to access fields for certificate type: <b>{certificateType}</b>
                  </Typography>
                  <Typography>
                    <Satoshis showPlus>
                      {a.amount}
                    </Satoshis>{' '}{formatDistance(new Date(a.created_at), new Date(), { addSuffix: true })}
                  </Typography>
                </CardContent>
              </Card>
            )
          } else if (a.labels.includes('babbage_spend_auth')) {
            const fields = a.note.split(' ')
            const authorized = fields[0] === 'Authorize'
            const app = fields[1]
            const amount = fields[2]
            const expiry = fields[3]
            if (!authorized) {
              return ( // TODO
                <Typography component='span' paragraph key={i}>
                  You revoked a previous spending authorization
                </Typography>
              )
            }
            return (
              <Typography component='span' paragraph key={i}>
                You {authorized ? 'allowed' : 'revoked a previous authorization for'} <AppChip label={`babbage_app_${app}`} /> to spend up to <b><Satoshis>{amount}</Satoshis></b>{authorized && ` on or before ${format(new Date(parseInt(expiry) * 1000), 'MMMM do yyyy')}`}
              </Typography>
            )
          } else if (
            a.labels.includes('babbage_protocol_perm_preaction') ||
            a.labels.includes('babbage_spend_auth_preaction')
          ) {
            return null
          } else {
            return (
              <Card
                key={i}
                className={classes.action_card}
                elevation={4}
              >
                <CardContent>
                  <Typography
                    variant='h3'
                    className={classes.title_text}
                  >
                    {a.note}
                  </Typography>
                  <Typography
                    className={classes.txid_text}
                    variant='caption'
                    color='textSecondary'
                  >
                    {a.txid}
                  </Typography>
                  <Typography>
                    <Satoshis showPlus>
                      {a.amount}
                    </Satoshis>{' '}{formatDistance(new Date(a.created_at), new Date(), { addSuffix: true })}
                  </Typography>
                  {a.labels && a.labels
                    .filter(l => l.startsWith('babbage_app_'))
                    .map((l, j) => (
                      <AppChip
                        key={`${a.txid}-${j}`}
                        label={l}
                      />
                    ))}
                </CardContent>
              </Card>
            )
          }
        })}
      <center>
        {actionsLoading && <LinearProgress />}
        {actions.length > 0 && (
          <VisibilitySensor
            onChange={v => {
              if (actions.length < totalActions && v === true) loadMoreActions()
            }}
            partialVisibility
            offset={{ bottom: -50 }}
          >
            <Typography color='textSecondary'>
              <i>Total Actions: {actionsLoading ? '...' : totalActions}</i>
            </Typography>
          </VisibilitySensor>
        )}
        {(actions.length < totalActions && !actionsLoading) && (
          <>
            <br />
            <Button
              onClick={() => loadMoreActions()}
            >
              Load More...
            </Button>
          </>
        )}
      </center>
    </div>
  )
}

export default ActionList
