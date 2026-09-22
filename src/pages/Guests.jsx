import React from 'react'
import { Users, UserPlus } from 'lucide-react'

const Guests = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Guest Management</h1>
          <p className="text-stone-500 text-sm mt-1">View and manage registered hotel guests and profiles.</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-orange-600/20 flex items-center space-x-2 self-start sm:self-auto">
          <UserPlus className="h-4 w-4" />
          <span>Add Guest</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
        <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600">
          <Users className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">No Guests Registered</h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          Guest CRUD operations and profile views will be implemented in Module 4.
        </p>
      </div>
    </div>
  )
}

export default Guests
