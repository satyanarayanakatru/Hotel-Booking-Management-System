import React from 'react'
import { X, Printer, Hotel, ShieldCheck, CheckCircle2, DollarSign, CreditCard, User, BedDouble } from 'lucide-react'

const InvoiceModal = ({ isOpen, onClose, payment }) => {
  if (!isOpen || !payment) return null

  const handlePrint = () => {
    window.print()
  }

  const getStatusStamp = (status) => {
    switch (status) {
      case 'Paid':
        return 'text-emerald-700 bg-emerald-50 border-emerald-300'
      case 'Pending':
        return 'text-amber-700 bg-amber-50 border-amber-300'
      case 'Refunded':
        return 'text-red-700 bg-red-50 border-red-300'
      default:
        return 'text-stone-700 bg-stone-50 border-stone-300'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Printable Invoice Container */}
        <div id="printable-invoice">
          
          {/* Invoice Header */}
          <div className="bg-stone-900 text-white p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-orange-600 rounded-2xl text-white shadow-md shadow-orange-600/30">
                <Hotel className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                  GrandVista Hotel & Resort
                </div>
                <h2 className="text-lg font-extrabold">Tax Invoice & Billing Receipt</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors print:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            
            {/* Invoice Meta Grid */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
              <div>
                <div className="text-stone-400 text-[10px] font-bold uppercase">Invoice Number</div>
                <div className="font-extrabold text-stone-900 text-sm">{payment.invoiceNumber}</div>
                <div className="text-stone-500 text-[10px] mt-0.5">Txn ID: {payment.id}</div>
              </div>

              <div className="text-right">
                <div className="text-stone-400 text-[10px] font-bold uppercase">Transaction Date</div>
                <div className="font-bold text-stone-800">{payment.transactionDate}</div>
                <div className="mt-1">
                  <span
                    className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusStamp(
                      payment.paymentStatus
                    )}`}
                  >
                    STATUS: {payment.paymentStatus?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Guest & Room Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <div className="text-stone-400 text-[10px] font-bold uppercase flex items-center space-x-1">
                  <User className="h-3 w-3 text-orange-600" />
                  <span>Billed To</span>
                </div>
                <div className="font-bold text-stone-900 text-sm">{payment.guestName}</div>
                <div className="text-stone-500 text-[11px]">{payment.email}</div>
                <div className="text-stone-500 text-[11px]">{payment.mobileNumber}</div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <div className="text-stone-400 text-[10px] font-bold uppercase flex items-center space-x-1">
                  <BedDouble className="h-3 w-3 text-orange-600" />
                  <span>Accommodation</span>
                </div>
                <div className="font-bold text-stone-900 text-sm">Room {payment.roomNumber}</div>
                <div className="text-stone-500 text-[11px]">{payment.roomType}</div>
                <div className="text-stone-500 text-[11px]">Booking ID: {payment.bookingId}</div>
              </div>

            </div>

            {/* Line Item Table */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-right">Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-800">Room Stay Charges ({payment.roomType})</div>
                      <div className="text-[10px] text-stone-400">Room #{payment.roomNumber} Accommodation</div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-stone-800">${payment.subtotal}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-stone-600">State Luxury Hotel Tax & GST (10%)</td>
                    <td className="py-2.5 px-4 text-right font-semibold text-stone-700">${payment.taxAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Financial Summary */}
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-700">
                <span>Subtotal Amount:</span>
                <span className="font-semibold">${payment.subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>GST & Service Tax (10%):</span>
                <span className="font-semibold">${payment.taxAmount}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-orange-600 pt-2 border-t border-orange-200">
                <span>Total Amount Paid:</span>
                <span>${payment.totalAmount}</span>
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-orange-600" />
                <span className="font-semibold text-stone-700">Payment Gateway:</span>
                <span className="font-bold text-stone-900">{payment.paymentMethod}</span>
              </div>
              <div className="text-[11px] font-mono text-stone-500">
                Auth Code: {payment.transactionRef}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print Tax Invoice</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close Receipt
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default InvoiceModal
