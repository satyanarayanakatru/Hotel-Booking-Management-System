import React from 'react'
import { BedDouble, Plus } from 'lucide-react'

const Rooms = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Room Management</h1>
          <p className="text-stone-500 text-sm mt-1">Manage hotel room inventory, types, and pricing.</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-orange-600/20 flex items-center space-x-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Add New Room</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
        <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600">
          <BedDouble className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">Room List Empty</h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          Room Management features and API integration will be implemented in Module 3.
        </p>
      </div>
    </div>
  )
}

export default Rooms
