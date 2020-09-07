import React, { useEffect } from 'react'
import {
  bindCallback,
  unbindCallback,
  submitPayment,
  abortPayment
} from '@cwi/core'
import {
  PaymentModal,
  requestPayment,
  resetModal
} from '@cwi/payment-modal'

const PaymentHandler = () => {
  useEffect(() => {
    const callbackID = bindCallback(
      'onPaymentRequired',
      ({ amount, address, reason }) => {
        requestPayment({
          amount,
          address,
          reason,
          token: process.env.REACT_APP_PLANARIA_TOKEN,
          onPaymentComplete: transactions => {
            submitPayment(transactions)
          },
          onAbort: () => {
            resetModal()
            abortPayment()
          }
        })
      }
    )
    return () => unbindCallback('onPaymentRequired', callbackID)
  }, [])

  return (
    <PaymentModal />
  )
}

export default PaymentHandler
