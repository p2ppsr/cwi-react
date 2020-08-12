import React, { useEffect } from 'react'
import {
  bindCallback,
  submitPayment
} from '@p2ppsr/cwi-auth'
import {
  PaymentModal,
  requestPayment
} from '@p2ppsr/payment-modal'

window.submitPayment = submitPayment

const PaymentHandler = () => {
  useEffect(() => {
    bindCallback('onPaymentRequired', ({ amount, address, reason }) => {
      requestPayment({
        amount,
        address,
        reason,
        token: process.env.REACT_APP_PLANARIA_TOKEN,
        onPaymentComplete: transactions => {
          submitPayment(transactions)
        }
      })
    })
  }, [])

  return (
    <PaymentModal />
  )
}

export default PaymentHandler
