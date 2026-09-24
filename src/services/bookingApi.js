import axios from 'axios'
import { getStoredRooms, fetchRoomsFromApi } from './roomApi'
import { getStoredGuests, fetchGuestsFromApi } from './guestApi'

const LOCAL_STORAGE_KEY = 'hotel_bookings_data'

export const fetchBookingsFromApi = async (forceRefresh = false) => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (stored && !forceRefresh) {
    try {
      const parsed = JSON.parse(stored)
      const isLegacyMockData = parsed.some(
        (b) => b.guestName === 'Sarah Jenkins' || b.guestName === 'Michael Chang' || b.id === 'BK-1089'
      )
      if (!isLegacyMockData && parsed.length > 0) {
        return parsed
      }
    } catch {
      console.warn('Failed to parse stored bookings, re-fetching...')
    }
  }

  // Fetch API guests and API rooms
  const guests = await fetchGuestsFromApi(true)
  const rooms = await fetchRoomsFromApi()

  const sampleBookings = [
    {
      id: 'BK-2001',
      guest: guests[0] || { id: 'g1', fullName: 'Emily Johnson', email: 'emily@example.com', mobileNumber: '+1 555-0192' },
      room: rooms[0] || { id: 'r1', roomNumber: '304', roomType: 'Deluxe Suite', pricePerNight: 350 },
      checkIn: '2026-09-22',
      checkOut: '2026-09-25',
      status: 'Checked-In',
      createdAt: '2026-09-20'
    },
    {
      id: 'BK-2002',
      guest: guests[1] || { id: 'g2', fullName: 'Michael Williams', email: 'michael@example.com', mobileNumber: '+1 555-0193' },
      room: rooms[1] || { id: 'r2', roomNumber: '210', roomType: 'Executive Room', pricePerNight: 280 },
      checkIn: '2026-09-22',
      checkOut: '2026-09-24',
      status: 'Checked-In',
      createdAt: '2026-09-21'
    },
    {
      id: 'BK-2003',
      guest: guests[2] || { id: 'g3', fullName: 'Sophia Brown', email: 'sophia@example.com', mobileNumber: '+1 555-0194' },
      room: rooms[2] || { id: 'r3', roomNumber: '105', roomType: 'Standard Room', pricePerNight: 180 },
      checkIn: '2026-09-25',
      checkOut: '2026-09-28',
      status: 'Confirmed',
      createdAt: '2026-09-22'
    },
    {
      id: 'BK-2004',
      guest: guests[3] || { id: 'g4', fullName: 'James Davis', email: 'james@example.com', mobileNumber: '+1 555-0195' },
      room: rooms[3] || { id: 'r4', roomNumber: '401', roomType: 'Presidential Suite', pricePerNight: 650 },
      checkIn: '2026-09-18',
      checkOut: '2026-09-21',
      status: 'Checked-Out',
      createdAt: '2026-09-15'
    },
    {
      id: 'BK-2005',
      guest: guests[4] || { id: 'g5', fullName: 'Emma Miller', email: 'emma.m@example.com', mobileNumber: '+1 555-0196' },
      room: rooms[4] || { id: 'r5', roomNumber: '304', roomType: 'Deluxe Suite', pricePerNight: 350 },
      checkIn: '2026-10-01',
      checkOut: '2026-10-05',
      status: 'Pending',
      createdAt: '2026-09-22'
    }
  ]

  const initialBookings = sampleBookings.map((b) => {
    const { numberOfNights, subtotal, taxAmount, totalAmount } = calculateNightsAndPrice(
      b.room.pricePerNight,
      b.checkIn,
      b.checkOut
    )

    return {
      id: b.id,
      guestId: b.guest.id,
      guestName: b.guest.fullName,
      email: b.guest.email,
      mobileNumber: b.guest.mobileNumber,
      roomId: b.room.id,
      roomNumber: b.room.roomNumber,
      roomType: b.room.roomType,
      pricePerNight: b.room.pricePerNight,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      numberOfNights,
      subtotal,
      taxAmount,
      totalAmount,
      status: b.status,
      createdAt: b.createdAt
    }
  })

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialBookings))
  return initialBookings
}

export const getStoredBookings = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    const isLegacyMockData = parsed.some(
      (b) => b.guestName === 'Sarah Jenkins' || b.guestName === 'Michael Chang' || b.id === 'BK-1089'
    )
    return isLegacyMockData ? [] : parsed
  } catch {
    return []
  }
}

export const saveStoredBookings = (bookings) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings))
}

// Auto Calculate Nights & Prices
export const calculateNightsAndPrice = (pricePerNight, checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate || !pricePerNight) {
    return { numberOfNights: 0, subtotal: 0, taxAmount: 0, totalAmount: 0 }
  }

  const start = new Date(checkInDate)
  const end = new Date(checkOutDate)
  const diffTime = end - start
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const numberOfNights = diffDays > 0 ? diffDays : 0
  const subtotal = numberOfNights * Number(pricePerNight)
  const taxAmount = Math.round(subtotal * 0.1) // 10% tax
  const totalAmount = subtotal + taxAmount

  return {
    numberOfNights,
    subtotal,
    taxAmount,
    totalAmount
  }
}

// Prevent Double Booking Validation
export const checkDoubleBooking = (roomNumber, checkInDate, checkOutDate, excludeBookingId = null) => {
  const bookings = getStoredBookings()
  const newIn = new Date(checkInDate).getTime()
  const newOut = new Date(checkOutDate).getTime()

  if (newOut <= newIn) {
    return {
      isDoubleBooked: true,
      message: 'Check-Out date must be after Check-In date.'
    }
  }

  const conflictingBooking = bookings.find((b) => {
    if (b.id === excludeBookingId) return false
    if (b.status === 'Cancelled') return false
    if (String(b.roomNumber) !== String(roomNumber)) return false

    const existIn = new Date(b.checkIn).getTime()
    const existOut = new Date(b.checkOut).getTime()

    return newIn < existOut && newOut > existIn
  })

  if (conflictingBooking) {
    return {
      isDoubleBooked: true,
      message: `Room ${roomNumber} is already reserved by ${conflictingBooking.guestName} (${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}).`
    }
  }

  return { isDoubleBooked: false, message: '' }
}

// Live POST call to DummyJSON API
export const createBookingService = async (bookingData) => {
  try {
    await axios.post('https://dummyjson.com/posts/add', {
      title: `Hotel Reservation for ${bookingData.guestName}`,
      body: JSON.stringify(bookingData),
      userId: 1
    })
  } catch (error) {
    console.warn('API POST call warning:', error)
  }

  const bookings = getStoredBookings()
  const { numberOfNights, subtotal, taxAmount, totalAmount } = calculateNightsAndPrice(
    bookingData.pricePerNight,
    bookingData.checkIn,
    bookingData.checkOut
  )

  const newBooking = {
    id: `BK-${Math.floor(2000 + Math.random() * 8000)}`,
    guestId: bookingData.guestId,
    guestName: bookingData.guestName,
    email: bookingData.email,
    mobileNumber: bookingData.mobileNumber,
    roomId: bookingData.roomId,
    roomNumber: bookingData.roomNumber,
    roomType: bookingData.roomType,
    pricePerNight: Number(bookingData.pricePerNight),
    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    numberOfNights,
    subtotal,
    taxAmount,
    totalAmount,
    status: bookingData.status || 'Confirmed',
    createdAt: new Date().toISOString().split('T')[0]
  }

  const updated = [newBooking, ...bookings]
  saveStoredBookings(updated)
  return newBooking
}

// Live PUT call to DummyJSON API
export const cancelBookingService = async (id) => {
  try {
    await axios.put('https://dummyjson.com/posts/1', {
      title: `Cancelled Reservation ${id}`,
      status: 'Cancelled'
    })
  } catch (error) {
    console.warn('API PUT call warning:', error)
  }

  const bookings = getStoredBookings()
  const index = bookings.findIndex((b) => b.id === id)

  if (index !== -1) {
    bookings[index].status = 'Cancelled'
    saveStoredBookings(bookings)
    return bookings[index]
  }
  return null
}

// Live DELETE call to DummyJSON API
export const deleteBookingService = async (id) => {
  try {
    await axios.delete('https://dummyjson.com/posts/1')
  } catch (error) {
    console.warn('API DELETE call warning:', error)
  }

  const bookings = getStoredBookings()
  const filtered = bookings.filter((b) => b.id !== id)
  saveStoredBookings(filtered)
  return true
}
