import React, { useEffect, useState } from 'react'
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Box } from '@mui/material'
import PageHeader from '../../../components/PageHeader'
import { useLocation } from 'react-router-dom/cjs/react-router-dom'
import AmountDisplay from '../../../components/AmountDisplay'
import PaymentHandler from '../../../components/PaymentHandler'

// TODO: Fetch actual transaction data...
const mockTransactions = [
  { date: '12/07/2023', description: '1 BSV', category: 'Sell', referenceNumber: '032839025189', amount: -90 },
  { date: '12/07/2023', description: '50,000,000 satoshis', category: 'Buy', referenceNumber: '032839025189', amount: 50 },
  { date: '12/07/2023', description: '10,000,000 satoshis', category: 'Buy', referenceNumber: '032839025189', amount: 10 }
]

const BalanceManager = () => {
  const location = useLocation()
  const { balance } = location.state
  const [openSatoshiFrame, setOpenSatoshiFrame] = useState(false)

  const handleBuy = () => {
    console.log('TODO: Fix this!')
    setOpenSatoshiFrame(true)
  }

  return (
    <Container maxWidth='md'>
      <PageHeader title='Balance Manager' showBackButton={false} showButton={false} />
      <Box my={4} display='flex' flexDirection='column' alignItems='center'>
        <Typography variant='h4' component='h1' gutterBottom color='textPrimary'>
          Your Balance
        </Typography>
        <Typography variant='h1' gutterBottom color='textPrimary'>
          <AmountDisplay abbreviate>{balance}</AmountDisplay>
        </Typography>
      </Box>

      <div style={{ paddingBottom: '1em' }}>
        <Typography variant='h4' component='h1' gutterBottom color='textPrimary'>
          Transactions
        </Typography>
        <Typography variant='body' gutterBottom>
          Here are your previous buy and sell transactions.
        </Typography>
      </div>
      <TableContainer component={Paper} elevation={3}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Reference Number</TableCell>
              <TableCell align='right'>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockTransactions.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.referenceNumber}</TableCell>
                <TableCell align='right' style={{ color: row.amount < 0 ? 'red' : 'textPrimary' }}>
                  {row.amount < 0 ? `- $${Math.abs(row.amount)}` : `+ $${row.amount}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button variant='outlined' disabled>
          Sell (Coming soon)
        </Button>
        <Button variant='contained' color='primary' onClick={handleBuy}>
          Fund Your Account
        </Button>
        {openSatoshiFrame &&
          <PaymentHandler isOpen={openSatoshiFrame} />}
        <Button variant='contained' color='secondary'>
          Need Help?
        </Button>
      </div>
    </Container>
  )
}

export default BalanceManager
