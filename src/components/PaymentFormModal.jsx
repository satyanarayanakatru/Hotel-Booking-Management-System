import React, { useState, useEffect } from 'react'
import { getStoredBookings, fetchBookingsFromApi } from '../services/bookingApi'
import { X, CreditCard, DollarSign, User, BedDouble, ShieldCheck, CheckCircle2 } from 'lucide-react'

const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'UPI / Digital Wallet',
  'Bank Transfer'
]

const PaymentFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [bookings, setBookings] = useState([])
  const [selectedBookingId, setSelectedBookingId] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)

  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [transactionRef, setTransactionRef] = useState('')
  const [amountOverride, setAmountOverride] = useState('')

  useEffect(() => {
    if (isOpen) {
      const loadBookings = async () => {
        const list = await fetchBookingsFromApi()
        setBookings(list)
        if (list.length > 0) {
          setSelectedBookingId(list[0].id)
        }
      }
      loadBookings()
      setPaymentMethod('Credit Card')
      setTransactionRef(`REF-${Math.floor(100000 + Math.random() * 900000)}`)
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedBookingId && bookings.length > 0) {
      const b = bookings.find((item) => item.id === selectedBookingId)
      setSelectedBooking(b || null)
      if (b) {
        setAmountOverride(b.subtotal || b.totalAmount)
      }
    }
  }, [selectedBookingId, bookings])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedBooking) return

    const subtotalVal = Number(amountOverride || selectedBooking.subtotal || 100)

    onSubmit({
      bookingId: selectedBooking.id,
      guestId: selectedBooking.guestId,
      guestName: selectedBooking.guestName,
      email: selectedBooking.email,
      mobileNumber: selectedBooking.mobileNumber,
      roomId: selectedBooking.roomId,
      roomNumber: selectedBooking.roomNumber,
      roomType: selectedBooking.roomType,
      subtotal: subtotalVal,
      totalAmount: selectedBooking.totalAmount,
      paymentMethod,
      transactionRef,
      paymentStatus: 'Paid'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-600 rounded-xl text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Record New Payment</h2>
              <p className="text-xs text-stone-400">Process hotel bill transaction & generate receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Booking Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Select Booking Reservation
            </label>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-orange-500"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} - {b.guestName} (Room {b.roomNumber} - ${b.totalAmount})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Booking Info */}
          {selectedBooking && (
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-medium">Guest:</span>
                <span className="font-bold text-stone-900 flex items-center space-x-1">
                  <User className="h-3.5 w-3.5 text-orange-600" />
                  <span>{selectedBooking.guestName} ({selectedBooking.mobileNumber})</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-medium">Room Assigned:</span>
                <span className="font-bold text-stone-900 flex items-center space-x-1">
                  <BedDouble className="h-3.5 w-3.5 text-orange-600" />
                  <span>Room {selectedBooking.roomNumber} - {selectedBooking.roomType}</span>
                </span>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Payment Gateway / Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  type="button"
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center space-x-2 ${
                    paymentMethod === pm
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{pm}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reference / Transaction ID */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Transaction Reference / Authorization ID
            </label>
            <input
              type="text"
              required
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="e.g. REF-892143 or Card Auth code"
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Amount Summary */}
          {selectedBooking && (
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 space-y-1 text-xs text-stone-700">
              <div className="flex justify-between">
                <span>Room Stay Subtotal ({selectedBooking.numberOfNights} Nights):</span>
                <span className="font-semibold">${selectedBooking.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Service Fees (10%):</span>
                <span className="font-semibold">${selectedBooking.taxAmount}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-orange-600 pt-1.5 border-t border-orange-200">
                <span>Total Amount Charged:</span>
                <span>${selectedBooking.totalAmount}</span>
              </div>
            </div>
          )}

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
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/30 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm & Record Payment</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default PaymentFormModal
