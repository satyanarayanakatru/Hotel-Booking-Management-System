import React from 'react'
import { History as HistoryIcon } from 'lucide-react'

const History = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Booking History</h1>
        <p className="text-stone-500 text-sm mt-1">Archived booking records, filters, and cancellations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
        <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600">
          <HistoryIcon className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">Booking Logs</h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          Historical booking search and status filters will be implemented in Module 8.
        </p>
      </div>
    </div>
  )
}

export default History
