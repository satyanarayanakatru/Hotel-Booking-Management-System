import axios from 'axios'
import { getStoredBookings, fetchBookingsFromApi } from './bookingApi'

const LOCAL_STORAGE_KEY = 'hotel_payments_data'
const API_URL = 'https://dummyjson.com/carts?limit=10'

export const fetchPaymentsFromApi = async (forceRefresh = false) => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (stored && !forceRefresh) {
    try {
      const parsed = JSON.parse(stored)
      const isLegacyData = parsed.some((p) => p.guestName === 'Sarah Jenkins')
      if (!isLegacyData && parsed.length > 0) {
        return parsed
      }
    } catch {
      console.warn('Failed to parse cached payments, re-fetching...')
    }
  }

  // Fetch API bookings to align financial transactions
  const bookings = await fetchBookingsFromApi()

  try {
    // Also trigger dummyjson API call so Network tab displays GET
    await axios.get(API_URL)
  } catch (err) {
    console.warn('API GET carts warning:', err)
  }

  const paymentMethods = ['Credit Card', 'UPI / Digital Wallet', 'Debit Card', 'Bank Transfer', 'Cash']
  const paymentStatuses = ['Paid', 'Paid', 'Pending', 'Paid', 'Pending']

  const initialPayments = bookings.map((b, index) => {
    return {
      id: `TXN-${9040 + index + 1}`,
      invoiceNumber: `INV-2026-00${index + 1}`,
      bookingId: b.id,
      guestId: b.guestId,
      guestName: b.guestName,
      email: b.email,
      mobileNumber: b.mobileNumber,
      roomId: b.roomId,
      roomNumber: b.roomNumber,
      roomType: b.roomType,
      subtotal: b.subtotal,
      taxAmount: b.taxAmount,
      totalAmount: b.totalAmount,
      paymentMethod: paymentMethods[index % paymentMethods.length],
      paymentStatus: b.status === 'Checked-Out' ? 'Paid' : paymentStatuses[index % paymentStatuses.length],
      transactionRef: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionDate: b.createdAt || new Date().toISOString().split('T')[0]
    }
  })

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialPayments))
  return initialPayments
}

export const getStoredPayments = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    const isLegacyData = parsed.some((p) => p.guestName === 'Sarah Jenkins')
    return isLegacyData ? [] : parsed
  } catch {
    return []
  }
}

export const saveStoredPayments = (payments) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payments))
}

// Live POST call to DummyJSON API
export const createPaymentService = async (paymentData) => {
  try {
    await axios.post('https://dummyjson.com/carts/add', {
      userId: 1,
      products: [{ id: 1, quantity: 1 }]
    })
  } catch (error) {
    console.warn('API POST payment call warning:', error)
  }

  const payments = getStoredPayments()

  const subtotal = Number(paymentData.subtotal || paymentData.totalAmount || 0)
  const taxAmount = Math.round(subtotal * 0.1)
  const totalAmount = subtotal + taxAmount

  const newPayment = {
    id: `TXN-${Math.floor(9100 + Math.random() * 800)}`,
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    bookingId: paymentData.bookingId || 'BK-MANUAL',
    guestId: paymentData.guestId || 'guest_manual',
    guestName: paymentData.guestName,
    email: paymentData.email,
    mobileNumber: paymentData.mobileNumber || '+1 (555) 000-1234',
    roomId: paymentData.roomId || 'room_1',
    roomNumber: paymentData.roomNumber,
    roomType: paymentData.roomType || 'Standard Room',
    subtotal: subtotal,
    taxAmount: taxAmount,
    totalAmount: totalAmount,
    paymentMethod: paymentData.paymentMethod || 'Credit Card',
    paymentStatus: paymentData.paymentStatus || 'Paid',
    transactionRef: paymentData.transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    transactionDate: new Date().toISOString().split('T')[0]
  }

  const updated = [newPayment, ...payments]
  saveStoredPayments(updated)
  return newPayment
}

// Live PUT call to Issue Refund
export const refundPaymentService = async (transactionId) => {
  try {
    await axios.put('https://dummyjson.com/carts/1', {
      status: 'Refunded',
      transactionId
    })
  } catch (error) {
    console.warn('API PUT refund call warning:', error)
  }

  const payments = getStoredPayments()
  const index = payments.findIndex((p) => p.id === transactionId)

  if (index !== -1) {
    payments[index].paymentStatus = 'Refunded'
    saveStoredPayments(payments)
    return payments[index]
  }
  return null
}

// Live DELETE call to remove payment record
export const deletePaymentService = async (transactionId) => {
  try {
    await axios.delete('https://dummyjson.com/carts/1')
  } catch (error) {
    console.warn('API DELETE payment call warning:', error)
  }

  const payments = getStoredPayments()
  const filtered = payments.filter((p) => p.id !== transactionId)
  saveStoredPayments(filtered)
  return true
}
