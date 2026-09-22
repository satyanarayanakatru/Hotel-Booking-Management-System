import React from 'react'
import { CreditCard } from 'lucide-react'

const Payments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Payments & Invoices</h1>
        <p className="text-stone-500 text-sm mt-1">Review payment summaries, history, and generate invoices.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
        <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600">
          <CreditCard className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">Payment Gateway</h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          Payment processing and invoice UI generation will be implemented in Module 7.
        </p>
      </div>
    </div>
  )
}

export default Payments
