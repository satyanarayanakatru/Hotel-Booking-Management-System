import React from 'react'
import { X, BedDouble, Users, Layers, DollarSign, Check, ShieldCheck } from 'lucide-react'

const RoomDetailsModal = ({ isOpen, onClose, room }) => {
  if (!isOpen || !room) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Occupied':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Maintenance':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Room Image Header */}
        <div className="relative h-56 w-full bg-stone-900">
          <img
            src={room.image}
            alt={`Room ${room.roomNumber}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-900/40" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Room Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <div className="text-xs font-semibold text-orange-300 uppercase tracking-wider">
                {room.roomType}
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Room {room.roomNumber}</h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${getStatusBadge(
                room.availability
              )}`}
            >
              {room.availability}
            </span>
          </div>
        </div>

        {/* Room Details Content */}
        <div className="p-6 space-y-5">
          
          {/* Key Specs Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
              <div className="flex items-center space-x-1 text-stone-500 text-[10px] font-bold uppercase">
                <DollarSign className="h-3.5 w-3.5 text-orange-600" />
                <span>Price / Night</span>
              </div>
              <div className="text-base font-extrabold text-stone-900">${room.pricePerNight}</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
              <div className="flex items-center space-x-1 text-stone-500 text-[10px] font-bold uppercase">
                <Users className="h-3.5 w-3.5 text-orange-600" />
                <span>Capacity</span>
              </div>
              <div className="text-base font-extrabold text-stone-900">{room.capacity} Guests</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
              <div className="flex items-center space-x-1 text-stone-500 text-[10px] font-bold uppercase">
                <Layers className="h-3.5 w-3.5 text-orange-600" />
                <span>Floor Level</span>
              </div>
              <div className="text-base font-extrabold text-stone-900">Floor {room.floorNumber}</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Description
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100">
              {room.description}
            </p>
          </div>

          {/* Amenities List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Room Amenities & Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities && room.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-orange-50 text-orange-900 rounded-xl text-xs font-semibold border border-orange-200"
                >
                  <Check className="h-3.5 w-3.5 text-orange-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Close Action */}
          <div className="pt-2 flex justify-end border-t border-stone-100">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close Details
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default RoomDetailsModal
