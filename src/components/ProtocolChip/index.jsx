import React from 'react'
import { Chip, Avatar, Badge } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { protoMap } from 'babbage-protomap'
import useStyles from './protocolChip-style'

const ProtocolChip = ({ recency, securityLevel, registryOperator, protocolID, size = 1.3 }) => {

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  const init = async () => {
    const protocolInfo = await protoMap.resolveProtocol(
      '032e5bd6b837cfb30208bbb1d571db9ddf2fb1a7b59fb4ed2a31af632699f770a1',
      1,
      'social apps'
    )
    console.log(protocolInfo)
    return protocolInfo
  }
  init()
  const classes = useStyles()

  return (
    <Chip
      variant='outlined'
      style={{
        margin: `${3 * size}em`,
        paddingTop: `${5 * size}em`,
        paddingBottom: `${5 * size}em`,
        paddingLeft: `${3 * size}em`,
        paddingRight: `${3 * size}em`
      }}
      label={
        <div>
          <span style={{ fontSize: `${size}em` }}>
            hi
          </span>
          <span style={{ fontSize: '0.9em' }}>
            <br />
            hi2
          </span>
        </div>
      }
      avatar={
        <Badge
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <SmallAvatar>P</SmallAvatar>
          }
        >
          <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
        </Badge>}
      onClick={console.log('hi')}
    />
  )
}

export default withRouter(ProtocolChip)
