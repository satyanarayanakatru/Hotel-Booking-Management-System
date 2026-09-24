import React, { useState, useEffect } from 'react'
import { X, LogOut, CheckSquare, DollarSign, KeyRound, Sparkles, AlertCircle } from 'lucide-react'

const CheckOutModal = ({ isOpen, onClose, onConfirm, booking }) => {
  const [keycardReturned, setKeycardReturned] = useState(true)
  const [extraCharges, setExtraCharges] = useState(0)
  const [roomNextStatus, setRoomNextStatus] = useState('Available')
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    if (booking) {
      setKeycardReturned(true)
      setExtraCharges(0)
      setRoomNextStatus('Available')
      setRemarks('')
    }
  }, [booking])

  if (!isOpen || !booking) return null

  const baseTotal = booking.totalAmount || 0
  const finalTotal = baseTotal + Number(extraCharges || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm(booking.id, {
      keycardReturned,
      extraCharges: Number(extraCharges || 0),
      finalAmount: finalTotal,
      roomNextStatus,
      remarks
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-600 rounded-xl text-white">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Process Guest Check-Out & Settlement</h2>
              <p className="text-xs text-stone-400">Reservation {booking.id} • Room {booking.roomNumber}</p>
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
          
          {/* Guest Brief */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Guest</span>
              <span className="font-bold text-stone-900 text-sm">{booking.guestName}</span>
              <span className="text-stone-500 block text-[10px]">{booking.mobileNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Assigned Keycard</span>
              <span className="px-2.5 py-1 bg-stone-200 text-stone-800 font-extrabold rounded-lg inline-block">
                {booking.keycardNo || `KC-${booking.roomNumber}`}
              </span>
            </div>
          </div>

          {/* Keycard Return Checkbox */}
          <div className="p-3.5 bg-orange-50/60 border border-orange-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5 text-xs text-orange-950 font-bold">
              <KeyRound className="h-4 w-4 text-orange-600" />
              <span>Keycard Returned to Reception Desk</span>
            </div>
            <input
              type="checkbox"
              checked={keycardReturned}
              onChange={(e) => setKeycardReturned(e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 rounded border-stone-300"
            />
          </div>

          {/* Room Next Status Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Room Status Post Departure
            </label>
            <select
              value={roomNextStatus}
              onChange={(e) => setRoomNextStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
            >
              <option value="Available">Available (Ready for next guest)</option>
              <option value="Maintenance">Needs Cleaning / Maintenance Inspection</option>
            </select>
          </div>

          {/* Incidentals & Mini-Bar Extra Charges */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Additional Incidentals / Mini-Bar / Service Charges ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="number"
                min="0"
                step="1"
                value={extraCharges}
                onChange={(e) => setExtraCharges(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Final Billing Summary Box */}
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 space-y-1.5 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>Room Stay Subtotal ({booking.numberOfNights} Nights + Tax):</span>
              <span className="font-semibold">${baseTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Additional Incidentals:</span>
              <span className="font-semibold">${extraCharges || 0}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-orange-600 pt-2 border-t border-orange-200">
              <span>Final Settlement Total:</span>
              <span>${finalTotal}</span>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Check-Out Settlement Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Paid via Credit Card, keycard returned OK"
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
              disabled={!keycardReturned}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/30 flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="h-4 w-4" />
              <span>Complete Settlement & Check-Out</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CheckOutModal
