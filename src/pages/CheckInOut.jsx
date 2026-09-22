import React from 'react'
import { ClipboardList } from 'lucide-react'

const CheckInOut = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Check-In / Check-Out</h1>
        <p className="text-stone-500 text-sm mt-1">Manage daily check-ins, check-outs, and stay durations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
        <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600">
          <ClipboardList className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">Check-In / Check-Out Desk</h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          Guest check-in/check-out logs and room availability updates will be implemented in Module 6.
        </p>
      </div>
    </div>
  )
}

export default CheckInOut
