import React from 'react'
import ProtocolPermissionList from '../../../components/ProtocolPermissionList/index.jsx'
import SpendingAuthorizationList from '../../../components/SpendingAuthorizationList/index.jsx'
import { Typography } from '@mui/material'

export default ({ domain }) => {
  return (
    <>
      <Typography variant='h2'>Spending Authorizations</Typography>
      <Typography paragraph>
        These are the allowances you have made giving this app the ability to spend money.
      </Typography>
      <SpendingAuthorizationList app={domain} />
      <br />
      <br />
      <Typography variant='h2'>Data Permissions</Typography>
      <Typography paragraph>
        These are the kinds of information you have allowed this app to be concerned with.
      </Typography>
      <ProtocolPermissionList app={domain} />
    </>
  )
}
