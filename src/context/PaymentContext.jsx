import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchPaymentsFromApi,
  getStoredPayments,
  createPaymentService,
  refundPaymentService,
  deletePaymentService
} from '../services/paymentApi'

const PaymentContext = createContext(null)

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([])
  const [loadingPayments, setLoadingPayments] = useState(true)

  const refreshPayments = useCallback(async (force = false) => {
    setLoadingPayments(true)
    try {
      const data = await fetchPaymentsFromApi(force)
      setPayments(data)
    } catch (err) {
      console.error('Failed to load payments in PaymentContext:', err)
    } finally {
      setLoadingPayments(false)
    }
  }, [])

  useEffect(() => {
    refreshPayments()
  }, [refreshPayments])

  const createPayment = async (paymentData) => {
    const created = await createPaymentService(paymentData)
    setPayments((prev) => [created, ...prev])
    return created
  }

  const refundPayment = async (transactionId) => {
    const updated = await refundPaymentService(transactionId)
    if (updated) {
      setPayments((prev) => prev.map((p) => (p.id === transactionId ? updated : p)))
    }
    return updated
  }

  const deletePayment = async (transactionId) => {
    const success = await deletePaymentService(transactionId)
    if (success) {
      setPayments((prev) => prev.filter((p) => p.id !== transactionId))
    }
    return success
  }

  return (
    <PaymentContext.Provider
      value={{
        payments,
        loadingPayments,
        refreshPayments,
        createPayment,
        refundPayment,
        deletePayment
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

export const usePayments = () => {
  const context = useContext(PaymentContext)
  if (!context) {
    throw new Error('usePayments must be used within a PaymentProvider')
  }
  return context
}
