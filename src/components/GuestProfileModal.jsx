import React from 'react'
import { X, Mail, Phone, MapPin, ShieldCheck, Globe, Calendar, User } from 'lucide-react'

const GuestProfileModal = ({ isOpen, onClose, guest }) => {
  if (!isOpen || !guest) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Checked-Out':
        return 'bg-stone-100 text-stone-700 border-stone-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Profile Card Header */}
        <div className="bg-stone-900 p-6 text-white relative flex flex-col items-center text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <img
            src={guest.avatar}
            alt={guest.fullName}
            className="h-20 w-20 rounded-full object-cover border-4 border-orange-500 shadow-lg mb-3"
          />

          <h2 className="text-xl font-extrabold">{guest.fullName}</h2>
          <p className="text-xs text-stone-400 mt-0.5">{guest.email}</p>

          <div className="flex items-center space-x-2 mt-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                guest.status
              )}`}
            >
              {guest.status}
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-bold border border-orange-400/20 flex items-center space-x-1">
              <Globe className="h-3 w-3" />
              <span>{guest.nationality}</span>
            </span>
          </div>
        </div>

        {/* Profile Details Body */}
        <div className="p-6 space-y-4">
          
          <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <div className="flex items-center space-x-3 text-xs">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Mobile Number</span>
                <span className="font-semibold text-stone-800">{guest.mobileNumber}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">ID Proof Number</span>
                <span className="font-bold text-stone-900">{guest.idProofNumber}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Residential Address</span>
                <span className="font-semibold text-stone-800 leading-snug">{guest.address}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Member Since</span>
                <span className="font-semibold text-stone-800">{guest.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close Profile
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default GuestProfileModal
