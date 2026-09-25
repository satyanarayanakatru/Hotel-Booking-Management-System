import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  fetchPaymentsFromApi,
  createPaymentService,
  refundPaymentService,
  deletePaymentService
} from '../services/paymentApi'
import PaymentFormModal from '../components/PaymentFormModal'
import InvoiceModal from '../components/InvoiceModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Trash2,
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
  User,
  BedDouble,
  Sparkles,
  RefreshCw,
  Printer
} from 'lucide-react'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('all') // 'all', 'paid', 'pending', 'refunded'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('All')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPaymentForInvoice, setSelectedPaymentForInvoice] = useState(null)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const loadPayments = async () => {
    setLoading(true)
    try {
      const data = await fetchPaymentsFromApi()
      setPayments(data)
    } catch (err) {
      toast.error('Failed to load financial transaction records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  // Filter Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.roomNumber.toString().includes(searchQuery)

      let matchesTab = true
      if (activeTab === 'paid') matchesTab = p.paymentStatus === 'Paid'
      else if (activeTab === 'pending') matchesTab = p.paymentStatus === 'Pending'
      else if (activeTab === 'refunded') matchesTab = p.paymentStatus === 'Refunded'

      let matchesMethod = selectedMethod === 'All' || p.paymentMethod === selectedMethod

      return matchesSearch && matchesTab && matchesMethod
    })
  }, [payments, activeTab, searchQuery, selectedMethod])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery, selectedMethod])

  // Pagination slice
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1
  const currentPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredPayments.slice(start, start + itemsPerPage)
  }, [filteredPayments, currentPage])

  // Handlers
  const handleRecordPayment = async (paymentData) => {
    try {
      const created = await createPaymentService(paymentData)
      setPayments((prev) => [created, ...prev])
      setIsPaymentModalOpen(false)
      toast.success(`Payment recorded for ${created.guestName}! Invoice ${created.invoiceNumber} generated.`)
      // Open tax invoice modal for the newly created transaction
      setSelectedPaymentForInvoice(created)
      setIsInvoiceModalOpen(true)
    } catch (err) {
      toast.error('Failed to process payment.')
    }
  }

  const handleIssueRefund = async (payment) => {
    if (payment.paymentStatus === 'Refunded') {
      toast.info('Transaction is already refunded.')
      return
    }
    const updated = await refundPaymentService(payment.id)
    if (updated) {
      setPayments((prev) => prev.map((p) => (p.id === payment.id ? updated : p)))
      toast.warn(`Refund issued for Invoice ${payment.invoiceNumber}.`)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!paymentToDelete) return
    const success = await deletePaymentService(paymentToDelete.id)
    if (success) {
      setPayments((prev) => prev.filter((p) => p.id !== paymentToDelete.id))
      toast.error(`Transaction record ${paymentToDelete.id} deleted.`)
    }
    setIsDeleteModalOpen(false)
    setPaymentToDelete(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Refunded':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  // Summary Metrics
  const totalRevenueCollected = payments
    .filter((p) => p.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0)

  const pendingSettlementTotal = payments
    .filter((p) => p.paymentStatus === 'Pending')
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0)

  const paidCount = payments.filter((p) => p.paymentStatus === 'Paid').length
  const refundedCount = payments.filter((p) => p.paymentStatus === 'Refunded').length

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-orange-600 rounded-2xl shadow-lg shadow-orange-600/30">
            <CreditCard className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 bg-stone-800/80 px-2.5 py-0.5 rounded-full text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-3 w-3" />
              <span>Module 7 Active • Financial Gateway & Tax Invoices</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Payments & Invoice Management</h1>
            <p className="text-stone-400 text-xs mt-0.5">
              Record guest payments, issue tax invoices, manage gateways, and track real-time revenue collection.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-orange-600/30 flex items-center space-x-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Financial Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Revenue</span>
            <span className="text-lg font-extrabold text-emerald-700">${totalRevenueCollected}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Pending Settlement</span>
            <span className="text-lg font-extrabold text-amber-700">${pendingSettlementTotal}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Paid Invoices</span>
            <span className="text-lg font-extrabold text-blue-700">{paidCount} Transactions</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Refunded Count</span>
            <span className="text-lg font-extrabold text-red-700">{refundedCount} Records</span>
          </div>
        </div>

      </div>

      {/* Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'all'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>All Transactions ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('paid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'paid'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Paid Invoices ({paidCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'pending'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Pending Settlement</span>
          </button>

          <button
            onClick={() => setActiveTab('refunded')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'refunded'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Refunded ({refundedCount})</span>
          </button>
        </div>

        {/* Search & Payment Method Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Transaction ID, Invoice #, Guest Name, Booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-stone-400" />
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Payment Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="UPI / Digital Wallet">UPI / Digital Wallet</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Financial Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-transparent"></div>
            <p className="text-xs font-medium text-stone-500">Loading payment transactions...</p>
          </div>
        ) : currentPayments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="h-12 w-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-700">No Payment Records Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              No financial transaction records match your active tab or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Txn & Invoice #</th>
                  <th className="py-4 px-6">Guest Billed</th>
                  <th className="py-4 px-6">Room Spec</th>
                  <th className="py-4 px-6">Gateway / Method</th>
                  <th className="py-4 px-6">Total Billed</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {currentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-orange-50/30 transition-colors">
                    
                    {/* Txn & Invoice */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-stone-900">{p.invoiceNumber}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">ID: {p.id} • {p.transactionDate}</div>
                    </td>

                    {/* Guest Billed */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-stone-100 rounded-lg text-stone-600">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-800">{p.guestName}</div>
                          <div className="text-[10px] text-stone-400">{p.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Room */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600">
                          <BedDouble className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-800">Room {p.roomNumber}</div>
                          <div className="text-[10px] text-stone-500">{p.bookingId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Method */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-stone-800">{p.paymentMethod}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{p.transactionRef}</div>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-stone-900">${p.totalAmount}</div>
                      <div className="text-[10px] text-stone-400">Tax Included</div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          p.paymentStatus
                        )}`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* View Tax Invoice */}
                        <button
                          onClick={() => {
                            setSelectedPaymentForInvoice(p)
                            setIsInvoiceModalOpen(true)
                          }}
                          title="View Tax Invoice Receipt"
                          className="p-1.5 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Issue Refund */}
                        {p.paymentStatus === 'Paid' && (
                          <button
                            onClick={() => handleIssueRefund(p)}
                            title="Issue Refund"
                            className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}

                        {/* Delete Transaction */}
                        <button
                          onClick={() => {
                            setPaymentToDelete(p)
                            setIsDeleteModalOpen(true)
                          }}
                          title="Delete Payment Record"
                          className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredPayments.length > itemsPerPage && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">
              Showing <span className="font-bold text-stone-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-bold text-stone-800">
                {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
              </span>{' '}
              of <span className="font-bold text-stone-800">{filteredPayments.length}</span> transactions
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 bg-white border border-stone-200 rounded-xl text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-stone-700 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 bg-white border border-stone-200 rounded-xl text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <PaymentFormModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleRecordPayment}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false)
          setSelectedPaymentForInvoice(null)
        }}
        payment={selectedPaymentForInvoice}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setPaymentToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        roomNumber={paymentToDelete?.invoiceNumber}
      />

    </div>
  )
}

export default Payments
