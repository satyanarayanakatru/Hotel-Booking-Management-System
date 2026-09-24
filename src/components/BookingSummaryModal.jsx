import React from 'react'
import { X, CalendarCheck, User, BedDouble, Calendar, DollarSign, Printer, CheckCircle2 } from 'lucide-react'

const BookingSummaryModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Checked-Out':
        return 'bg-stone-100 text-stone-700 border-stone-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-orange-600 rounded-2xl text-white shadow-md shadow-orange-600/30">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                Booking Invoice Summary
              </div>
              <h2 className="text-xl font-extrabold">{booking.id}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-6 space-y-5">
          
          {/* Status & Confirmation Banner */}
          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex items-center space-x-2 text-stone-700 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4 text-orange-600" />
              <span>Reservation Status:</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                booking.status
              )}`}
            >
              {booking.status}
            </span>
          </div>

          {/* Guest & Room Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Guest Info */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
              <div className="flex items-center space-x-1.5 text-stone-500 text-[10px] font-bold uppercase">
                <User className="h-3.5 w-3.5 text-orange-600" />
                <span>Guest Details</span>
              </div>
              <div className="text-sm font-bold text-stone-900">{booking.guestName}</div>
              <div className="text-xs text-stone-500">{booking.email}</div>
              <div className="text-xs text-stone-500">{booking.mobileNumber}</div>
            </div>

            {/* Room Info */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
              <div className="flex items-center space-x-1.5 text-stone-500 text-[10px] font-bold uppercase">
                <BedDouble className="h-3.5 w-3.5 text-orange-600" />
                <span>Room Specification</span>
              </div>
              <div className="text-sm font-bold text-stone-900">Room {booking.roomNumber}</div>
              <div className="text-xs text-stone-500">{booking.roomType}</div>
              <div className="text-xs text-stone-500">${booking.pricePerNight} / night</div>
            </div>
          </div>

          {/* Stay Duration */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase">
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-orange-600" />
                <span>Stay Duration</span>
              </span>
              <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 rounded font-bold">
                {booking.numberOfNights} Nights
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
              <div>
                <span className="text-stone-400 block text-[10px]">Check-In</span>
                <span>{booking.checkIn}</span>
              </div>
              <div className="text-stone-300">→</div>
              <div className="text-right">
                <span className="text-stone-400 block text-[10px]">Check-Out</span>
                <span>{booking.checkOut}</span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-2 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>Subtotal ({booking.numberOfNights} nights):</span>
              <span className="font-semibold">${booking.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Service Fees (10%):</span>
              <span className="font-semibold">${booking.taxAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-orange-600 pt-2 border-t border-orange-200">
              <span>Total Amount Paid / Due:</span>
              <span>${booking.totalAmount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close Summary
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default BookingSummaryModal
