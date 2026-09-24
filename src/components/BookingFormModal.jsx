import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { getStoredGuests, fetchGuestsFromApi } from '../services/guestApi'
import { getStoredRooms, fetchRoomsFromApi } from '../services/roomApi'
import { calculateNightsAndPrice, checkDoubleBooking } from '../services/bookingApi'
import { X, CalendarCheck, AlertTriangle, CheckCircle2, DollarSign, BedDouble, User } from 'lucide-react'

const BookingFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])

  const [selectedGuest, setSelectedGuest] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [conflictError, setConflictError] = useState('')

  const todayStr = new Date().toISOString().split('T')[0]
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      guestId: '',
      roomId: '',
      checkIn: todayStr,
      checkOut: tomorrowStr,
      status: 'Confirmed'
    }
  })

  const watchGuestId = watch('guestId')
  const watchRoomId = watch('roomId')
  const watchCheckIn = watch('checkIn')
  const watchCheckOut = watch('checkOut')

  useEffect(() => {
    if (isOpen) {
      const loadModalData = async () => {
        const gList = await fetchGuestsFromApi()
        const rList = await fetchRoomsFromApi()
        setGuests(gList)
        setRooms(rList)

        if (gList.length > 0) setValue('guestId', gList[0].id)
        if (rList.length > 0) setValue('roomId', rList[0].id)
      }
      loadModalData()
    }
  }, [isOpen, setValue])

  // Update selected guest object
  useEffect(() => {
    if (watchGuestId && guests.length > 0) {
      const g = guests.find((item) => item.id === watchGuestId)
      setSelectedGuest(g || null)
    }
  }, [watchGuestId, guests])

  // Update selected room object
  useEffect(() => {
    if (watchRoomId && rooms.length > 0) {
      const r = rooms.find((item) => item.id === watchRoomId)
      setSelectedRoom(r || null)
    }
  }, [watchRoomId, rooms])

  // Real-time calculation & Double Booking check
  const priceCalculation = selectedRoom
    ? calculateNightsAndPrice(selectedRoom.pricePerNight, watchCheckIn, watchCheckOut)
    : { numberOfNights: 0, subtotal: 0, taxAmount: 0, totalAmount: 0 }

  useEffect(() => {
    if (selectedRoom && watchCheckIn && watchCheckOut) {
      const check = checkDoubleBooking(selectedRoom.roomNumber, watchCheckIn, watchCheckOut)
      if (check.isDoubleBooked) {
        setConflictError(check.message)
      } else {
        setConflictError('')
      }
    } else {
      setConflictError('')
    }
  }, [selectedRoom, watchCheckIn, watchCheckOut])

  if (!isOpen) return null

  const handleFormSubmit = (data) => {
    if (conflictError) return
    if (!selectedGuest || !selectedRoom) return

    onSubmit({
      guestId: selectedGuest.id,
      guestName: selectedGuest.fullName,
      email: selectedGuest.email,
      mobileNumber: selectedGuest.mobileNumber,
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.roomNumber,
      roomType: selectedRoom.roomType,
      pricePerNight: selectedRoom.pricePerNight,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status
    })

    reset()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-600 rounded-xl text-white">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">New Room Reservation</h2>
              <p className="text-xs text-stone-400">Select guest, room, and stay duration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Double Booking Warning Banner */}
        {conflictError && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-900 uppercase">Double Booking Conflict</h4>
              <p className="text-xs text-red-700 mt-0.5">{conflictError}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Guest Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Select Guest (Module 4 Integration)
            </label>
            <div className="relative">
              <select
                {...register('guestId', { required: 'Please select a guest' })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.fullName} ({g.email} - {g.nationality})
                  </option>
                ))}
              </select>
            </div>
            {selectedGuest && (
              <div className="mt-1.5 text-[11px] text-stone-500 flex items-center space-x-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
                <User className="h-3.5 w-3.5 text-orange-600" />
                <span>Contact: <span className="font-semibold text-stone-800">{selectedGuest.mobileNumber}</span></span>
              </div>
            )}
          </div>

          {/* Room Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Select Room (Module 3 Integration)
            </label>
            <div className="relative">
              <select
                {...register('roomId', { required: 'Please select a room' })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Room {r.roomNumber} - {r.roomType} (${r.pricePerNight}/night - {r.availability})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Check-In Date */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Check-In Date
              </label>
              <input
                type="date"
                {...register('checkIn', { required: 'Check-in date is required' })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>

            {/* Check-Out Date */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Check-Out Date
              </label>
              <input
                type="date"
                {...register('checkOut', { required: 'Check-out date is required' })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
          </div>

          {/* Real-Time Price Calculation Box */}
          <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-950 flex items-center justify-between">
              <span>Automatic Price Calculation</span>
              <span className="px-2 py-0.5 bg-orange-200 text-orange-900 rounded text-[10px]">
                {priceCalculation.numberOfNights} Nights
              </span>
            </h3>

            <div className="space-y-1 text-xs text-stone-700">
              <div className="flex justify-between">
                <span>Room Rate per Night:</span>
                <span className="font-semibold">${selectedRoom?.pricePerNight || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal ({priceCalculation.numberOfNights} nights):</span>
                <span className="font-semibold">${priceCalculation.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Service Fees (10%):</span>
                <span className="font-semibold">${priceCalculation.taxAmount}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-orange-600 pt-1 border-t border-orange-200">
                <span>Total Amount Payable:</span>
                <span>${priceCalculation.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Booking Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Checked-In">Checked-In</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={Boolean(conflictError) || priceCalculation.numberOfNights <= 0}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-orange-600/30 flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm Reservation</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default BookingFormModal
