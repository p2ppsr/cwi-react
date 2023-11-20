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
import style from './style.js'
import VisibilitySensor from 'react-visibility-sensor'
import AmountDisplay from '../AmountDisplay/index.jsx'
import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import Refresh from '@mui/icons-material/Refresh'

const useStyles = makeStyles(style, {
  name: 'BasketList'
})

const BasketList = ({ app }) => {
  const [Baskets, setBaskets] = useState([])
  const [totalBaskets, setTotalBaskets] = useState(0)
  const [BasketsLoading, setBasketsLoading] = useState(false)
  const classes = useStyles()
  const label = app ? `babbage_app_${app}` : undefined

  const refreshBaskets = async l => {
    try {
      setBasketsLoading(true)
      const result = await window.CWI.ninja.getTransBaskets({
        limit: 10,
        label,
        status: 'completed'
      })
      setBaskets(result.transBaskets)
      setTotalBaskets(result.totalTransBaskets)
      setBasketsLoading(false)
    } catch (e) {
      console.error(e)
      setBasketsLoading(false)
    }
    try {
      await window.CWI.ninja.processPendingTransBaskets()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    refreshBaskets(label)
  }, [label])

  const loadMoreBaskets = async () => {
    try {
      setBasketsLoading(true)
      const result = await window.CWI.ninja.getTransBaskets({
        limit: 25,
        offset: Baskets.length,
        label,
        status: 'completed'
      })
      setBaskets(Baskets => ([...Baskets, ...result.transBaskets]))
      setBasketsLoading(false)
    } catch (e) {
      setBasketsLoading(false)
    }
  }

  return (
    <div className={classes.content_wrap}>
      <Button
        color='primary'
        endIcon={<Refresh color='primary' />}
        onClick={() => refreshBaskets(label)}
        className={classes.refresh_btn}
        disabled={BasketsLoading}
      >
        Refresh
      </Button>
      {Baskets
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
            return (
              <Card
                key={i}
                className={classes.Basket_card}
                elevation={4}
              >
                <CardContent>
                  <Typography
                    variant='h3'
                    className={classes.title_text}
                  >
                    Protocol Permission {granted ? 'Granted' : 'Revoked'}
                  </Typography>
                  <Typography component='span' paragraph key={i}>
                    You {granted ? 'allowed' : 'revoked'} <AppChip label={`babbage_app_${app}`} /> permission for protocol: <b>{protocol}</b>
                  </Typography>
                  <Typography>
                    <AmountDisplay showPlus>
                      {a.amount}
                    </AmountDisplay>{' '}{formatDistance(new Date(a.created_at), new Date(), { addSuffix: true })}
                  </Typography>
                </CardContent>
              </Card>
            )
          } if (a.labels.includes('babbage_basket_access')) {
            const fields = a.note.split(' ')
            const granted = fields[0] === 'Grant'
            const app = fields[1]
            fields.shift()
            fields.shift()
            let basket = fields.join(' ').split(':')[0]
            if (basket.indexOf(',') !== -1) {
              basket = basket.split(',')[1]
            }
            <div>
              Basket Access Grants:

              The name and icon of the basket

              The number of items currently in the basket

              A “View More Basket Info” icon leading to the Manage Basket Access Page

              An option to revoke the grant of access to the basket
            </div>
            return (
              <Card
                key={i}
                className={classes.Basket_card}
                elevation={4}
              >
                <CardContent>
                  <Typography
                    variant='h3'
                    className={classes.title_text}
                  >
                    Basket Access {granted ? 'Granted' : 'Revoked'}
                  </Typography>
                  <Typography component='span' paragraph key={i}>
                    You {granted ? 'allowed' : 'revoked'} <AppChip label={`babbage_app_${app}`} /> access to basket: <b>{basket}</b>
                  </Typography>
                  <Typography>
                    <AmountDisplay showPlus>
                      {a.amount}
                    </AmountDisplay>{' '}{formatDistance(new Date(a.created_at), new Date(), { addSuffix: true })}
                  </Typography>
                </CardContent>
              </Card>
            )
          } if (a.labels.includes('babbage_certificate_access')) {
            const fields = a.note.split(' ')
            const granted = fields[0] === 'Grant'
            const app = fields[1]
            const verifier = fields[2]
            const certificateType = fields[3]
            return (
              <Card
                key={i}
                className={classes.Basket_card}
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
                    You {granted ? 'allowed' : 'revoked'} <AppChip label={`babbage_app_${app}`} /> access to fields for the following certificate:<b>{'\n'}</b>
                  </Typography>
                  <Typography paragraph key={i}>
                    <b>Type: </b>{certificateType}
                  </Typography>
                  <Typography paragraph key={i} style={{ wordWrap: 'break-word' }}>
                    <b>Verifier: </b>{verifier}
                  </Typography>
                  <Typography>
                    <AmountDisplay showPlus>
                      {a.amount}
                    </AmountDisplay>{' '}{formatDistance(new Date(a.created_at), new Date(), { addSuffix: true })}
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
                You {authorized ? 'allowed' : 'revoked a previous authorization for'} <AppChip label={`babbage_app_${app}`} /> to spend up to <b><AmountDisplay>{amount}</AmountDisplay></b>{authorized && ` on or before ${format(new Date(parseInt(expiry) * 1000), 'MMMM do yyyy')}`}
              </Typography>
            )
          } else if (
            a.labels.includes('babbage_protocol_perm_preBasket') ||
            a.labels.includes('babbage_spend_auth_preBasket')
          ) {
            return null
          } else {
            return (
              <Card
                key={i}
                className={classes.Basket_card}
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
                    <AmountDisplay showPlus>
                      {a.amount}
                    </AmountDisplay>{' '}{formatDistance(new Date(a.created_at), new Date(), { addSuffix: true })}
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
        {BasketsLoading && <LinearProgress />}
        {Baskets.length > 0 && (
          <VisibilitySensor
            onChange={v => {
              if (Baskets.length < totalBaskets && v === true) loadMoreBaskets()
            }}
            partialVisibility
            offset={{ bottom: -50 }}
          >
            <Typography color='textSecondary'>
              <i>Total Baskets: {BasketsLoading ? '...' : totalBaskets}</i>
            </Typography>
          </VisibilitySensor>
        )}
        {(Baskets.length < totalBaskets && !BasketsLoading) && (
          <>
            <br />
            <Button
              onClick={() => loadMoreBaskets()}
            >
              Load More...
            </Button>
          </>
        )}
      </center>
    </div>
  )
}

export default BasketList
