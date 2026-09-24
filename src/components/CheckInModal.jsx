import React, { useState, useEffect } from 'react'
import { X, LogIn, KeyRound, ShieldCheck, User, BedDouble, Calendar } from 'lucide-react'

const CheckInModal = ({ isOpen, onClose, onConfirm, booking }) => {
  const [keycardNo, setKeycardNo] = useState('')
  const [idVerified, setIdVerified] = useState(true)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (booking) {
      setKeycardNo(booking.keycardNo || `KC-${booking.roomNumber}`)
      setIdVerified(true)
      setNotes('')
    }
  }, [booking])

  if (!isOpen || !booking) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm(booking.id, {
      keycardNo,
      idVerified,
      notes
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white">
              <LogIn className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Process Guest Check-In</h2>
              <p className="text-xs text-stone-400">Reservation {booking.id}</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Reservation Brief */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-400 font-medium">Guest Name:</span>
              <span className="font-bold text-stone-900 flex items-center space-x-1">
                <User className="h-3.5 w-3.5 text-orange-600" />
                <span>{booking.guestName}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400 font-medium">Room Assigned:</span>
              <span className="font-bold text-stone-900 flex items-center space-x-1">
                <BedDouble className="h-3.5 w-3.5 text-orange-600" />
                <span>Room {booking.roomNumber} ({booking.roomType})</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400 font-medium">Stay Duration:</span>
              <span className="font-bold text-stone-800 flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-stone-500" />
                <span>{booking.checkIn} to {booking.checkOut} ({booking.numberOfNights} Nights)</span>
              </span>
            </div>
          </div>

          {/* Keycard ID Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Assign Electronic Keycard Number
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-orange-600" />
              <input
                type="text"
                required
                value={keycardNo}
                onChange={(e) => setKeycardNo(e.target.value)}
                placeholder="e.g. KC-304"
                className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
          </div>

          {/* ID Proof Verification Toggle */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-emerald-900 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Guest Passport / Photo ID Verified</span>
            </div>
            <input
              type="checkbox"
              checked={idVerified}
              onChange={(e) => setIdVerified(e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded border-stone-300"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Reception / Arrival Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra pillows provided, luggage stored..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
            />
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center space-x-1.5"
            >
              <LogIn className="h-4 w-4" />
              <span>Confirm Check-In</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CheckInModal
