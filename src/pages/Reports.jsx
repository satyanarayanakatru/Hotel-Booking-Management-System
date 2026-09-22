import React from 'react'
import { BarChart3 } from 'lucide-react'

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Reports & Analytics</h1>
        <p className="text-stone-500 text-sm mt-1">Revenue charts, room occupancy metrics, and trend insights.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
        <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600">
          <BarChart3 className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">Analytics Dashboard</h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          Comprehensive occupancy charts and revenue reports will be implemented in Module 9.
        </p>
      </div>
    </div>
  )
}

export default Reports
