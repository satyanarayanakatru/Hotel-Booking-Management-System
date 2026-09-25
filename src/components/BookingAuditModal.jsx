import React, { useState } from 'react'
import { X, History, Clock, User, BedDouble, Plus, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle, FileText } from 'lucide-react'

const BookingAuditModal = ({ isOpen, onClose, record, onAddNote }) => {
  const [newNote, setNewNote] = useState('')

  if (!isOpen || !record) return null

  const handleNoteSubmit = (e) => {
    e.preventDefault()
    if (!newNote.trim()) return
    onAddNote(record.bookingId || record.id, newNote)
    setNewNote('')
  }

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Creation':
        return 'bg-blue-100 text-blue-800'
      case 'Billing':
        return 'bg-emerald-100 text-emerald-800'
      case 'Check-In':
        return 'bg-amber-100 text-amber-800'
      case 'Check-Out':
        return 'bg-purple-100 text-purple-800'
      case 'Cancellation':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-stone-100 text-stone-700'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-600 rounded-xl text-white">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Lifecycle Audit Event Timeline</h2>
              <p className="text-xs text-stone-400">Reservation {record.bookingId} • {record.guestName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Reservation Summary Card */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Guest & Room</span>
              <span className="font-bold text-stone-900 block text-sm">{record.guestName}</span>
              <span className="text-stone-500 text-[11px] block">Room {record.roomNumber} ({record.roomType})</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Stay Total & Status</span>
              <span className="font-extrabold text-orange-600 block text-sm">${record.totalAmount}</span>
              <span className="text-stone-500 text-[11px] block font-semibold">{record.status} ({record.numberOfNights} Nights)</span>
            </div>
          </div>

          {/* Audit Timeline Feed */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-orange-600" />
              <span>Event Audit Log History</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {record.auditTimeline && record.auditTimeline.map((ev, index) => (
                <div key={ev.id || index} className="relative group">
                  
                  {/* Timeline Dot */}
                  <div className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full bg-orange-600 border-2 border-white shadow-xs" />

                  <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100 space-y-1 hover:border-orange-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-xs">{ev.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getCategoryBadge(ev.category)}`}>
                        {ev.category}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">{ev.description}</p>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                      <span>Log Actor: <span className="font-medium text-stone-700">{ev.actor || 'System'}</span></span>
                      <span>{ev.timestamp}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Add Receptionist Audit Note */}
          <form onSubmit={handleNoteSubmit} className="pt-3 border-t border-stone-100 space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Add Receptionist Audit Note
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type audit note or staff observation..."
                className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Note</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  )
}

export default BookingAuditModal
