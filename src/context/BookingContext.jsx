import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchBookingsFromApi,
  getStoredBookings,
  createBookingService,
  cancelBookingService,
  deleteBookingService,
  processCheckInService,
  processCheckOutService
} from '../services/bookingApi'

const BookingContext = createContext(null)

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  const refreshBookings = useCallback(async (force = false) => {
    setLoadingBookings(true)
    try {
      const data = await fetchBookingsFromApi(force)
      setBookings(data)
    } catch (err) {
      console.error('Failed to load bookings in BookingContext:', err)
    } finally {
      setLoadingBookings(false)
    }
  }, [])

  useEffect(() => {
    refreshBookings()
  }, [refreshBookings])

  const createBooking = async (bookingData) => {
    const created = await createBookingService(bookingData)
    setBookings((prev) => [created, ...prev])
    return created
  }

  const cancelBooking = async (id) => {
    const updated = await cancelBookingService(id)
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
    }
    return updated
  }

  const deleteBooking = async (id) => {
    const success = await deleteBookingService(id)
    if (success) {
      setBookings((prev) => prev.filter((b) => b.id !== id))
    }
    return success
  }

  const processCheckIn = async (bookingId, checkInData) => {
    const updated = await processCheckInService(bookingId, checkInData)
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)))
    }
    return updated
  }

  const processCheckOut = async (bookingId, checkOutData) => {
    const updated = await processCheckOutService(bookingId, checkOutData)
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)))
    }
    return updated
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loadingBookings,
        refreshBookings,
        createBooking,
        cancelBooking,
        deleteBooking,
        processCheckIn,
        processCheckOut
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export const useBookings = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider')
  }
  return context
}
