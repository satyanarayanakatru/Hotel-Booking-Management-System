import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  fetchHistoryFromApi,
  addAuditNoteService,
  deleteHistoryRecordService,
  exportHistoryToCSV
} from '../services/historyApi'
import BookingAuditModal from '../components/BookingAuditModal'
import InvoiceModal from '../components/InvoiceModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import {
  History as HistoryIcon,
  Download,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  Ban,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  User,
  BedDouble,
  Sparkles,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react'

const History = () => {
  const [historyLogs, setHistoryLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('all') // 'all', 'completed', 'cancelled'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedRoomType, setSelectedRoomType] = useState('All')

  // Date Range Filter
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Modals
  const [selectedRecordForAudit, setSelectedRecordForAudit] = useState(null)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)

  const [selectedRecordForInvoice, setSelectedRecordForInvoice] = useState(null)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)

  const [recordToDelete, setRecordToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const loadHistory = async () => {
    setLoading(true)
    try {
      const data = await fetchHistoryFromApi()
      setHistoryLogs(data)
    } catch (err) {
      toast.error('Failed to load reservation history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  // Filter History
  const filteredHistory = useMemo(() => {
    return historyLogs.filter((h) => {
      const matchesSearch =
        h.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.roomNumber.toString().includes(searchQuery) ||
        h.email.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesTab = true
      if (activeTab === 'completed') matchesTab = h.status === 'Checked-Out'
      else if (activeTab === 'cancelled') matchesTab = h.status === 'Cancelled'

      let matchesStatus = selectedStatus === 'All' || h.status === selectedStatus
      let matchesRoomType = selectedRoomType === 'All' || h.roomType === selectedRoomType

      let matchesDate = true
      if (fromDate) {
        matchesDate = matchesDate && new Date(h.checkIn) >= new Date(fromDate)
      }
      if (toDate) {
        matchesDate = matchesDate && new Date(h.checkOut) <= new Date(toDate)
      }

      return matchesSearch && matchesTab && matchesStatus && matchesRoomType && matchesDate
    })
  }, [historyLogs, activeTab, searchQuery, selectedStatus, selectedRoomType, fromDate, toDate])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery, selectedStatus, selectedRoomType, fromDate, toDate])

  // Pagination slice
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredHistory.slice(start, start + itemsPerPage)
  }, [filteredHistory, currentPage])

  // Handlers
  const handleAddAuditNote = async (bookingId, noteText) => {
    const updated = await addAuditNoteService(bookingId, noteText)
    if (updated) {
      setHistoryLogs((prev) => prev.map((item) => (item.bookingId === bookingId ? updated : item)))
      setSelectedRecordForAudit(updated)
      toast.success('Audit note logged to reservation timeline!')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return
    const success = await deleteHistoryRecordService(recordToDelete.id)
    if (success) {
      setHistoryLogs((prev) => prev.filter((item) => item.id !== recordToDelete.id))
      toast.error(`History record ${recordToDelete.bookingId} removed.`)
    }
    setIsDeleteModalOpen(false)
    setRecordToDelete(null)
  }

  const handleExportCSV = () => {
    exportHistoryToCSV(filteredHistory)
    toast.success(`Exported ${filteredHistory.length} booking records to CSV!`)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-Out':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Checked-In':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  // Financial & Historic Overview Metrics
  const totalHistoricCount = historyLogs.length
  const completedStaysCount = historyLogs.filter((h) => h.status === 'Checked-Out').length
  const cancelledCount = historyLogs.filter((h) => h.status === 'Cancelled').length
  const totalLifetimeRevenue = historyLogs.reduce((sum, h) => sum + (h.totalAmount || 0), 0)

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-orange-600 rounded-2xl shadow-lg shadow-orange-600/30">
            <HistoryIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 bg-stone-800/80 px-2.5 py-0.5 rounded-full text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-3 w-3" />
              <span>Module 8 Active • Archived Logs & Audit Timeline</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Booking History & Audit Logs</h1>
            <p className="text-stone-400 text-xs mt-0.5">
              Review completed stays, cancellation archives, step-by-step audit timelines, and export CSV reports.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={loadHistory}
            title="Refresh History"
            className="p-3 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-2xl transition-colors border border-stone-700"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-orange-600/30 flex items-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <HistoryIcon className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Historic Records</span>
            <span className="text-lg font-extrabold text-stone-900">{totalHistoricCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Completed Stays</span>
            <span className="text-lg font-extrabold text-purple-700">{completedStaysCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Ban className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Cancellations</span>
            <span className="text-lg font-extrabold text-red-700">{cancelledCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Lifetime Revenue</span>
            <span className="text-lg font-extrabold text-emerald-700">${totalLifetimeRevenue}</span>
          </div>
        </div>

      </div>

      {/* Tabs & Multi-Filter Controls */}
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
            <HistoryIcon className="h-3.5 w-3.5" />
            <span>All History ({historyLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'completed'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Completed Stays ({completedStaysCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'cancelled'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Ban className="h-3.5 w-3.5" />
            <span>Cancellations ({cancelledCount})</span>
          </button>
        </div>

        {/* Date Range & Dropdown Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Booking ID, Guest Name, Room #, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Reservation Statuses</option>
              <option value="Checked-Out">Checked-Out</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Room Type Dropdown */}
          <div>
            <select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Room Types</option>
              <option value="Deluxe Suite">Deluxe Suite</option>
              <option value="Executive Room">Executive Room</option>
              <option value="Standard Room">Standard Room</option>
              <option value="Presidential Suite">Presidential Suite</option>
            </select>
          </div>

        </div>

        {/* Date Range Picker Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center space-x-2 text-stone-500 font-semibold">
            <Calendar className="h-4 w-4 text-orange-600" />
            <span>Filter Check-In / Check-Out Date Range:</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="text-stone-400 font-medium">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-stone-400 font-medium">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            {(fromDate || toDate) && (
              <button
                onClick={() => {
                  setFromDate('')
                  setToDate('')
                }}
                className="px-2.5 py-1.5 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300 transition-colors"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Main History Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-transparent"></div>
            <p className="text-xs font-medium text-stone-500">Loading reservation archives...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <HistoryIcon className="h-12 w-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-700">No History Records Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              No historical reservation records match your date range or filter selection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Booking & Invoice</th>
                  <th className="py-4 px-6">Guest Billed</th>
                  <th className="py-4 px-6">Room Spec</th>
                  <th className="py-4 px-6">Stay Dates</th>
                  <th className="py-4 px-6">Lifetime Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {currentItems.map((h) => (
                  <tr key={h.id} className="hover:bg-orange-50/30 transition-colors">
                    
                    {/* Booking ID & Invoice */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-stone-900">{h.bookingId}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{h.invoiceNumber}</div>
                    </td>

                    {/* Guest */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-stone-100 rounded-lg text-stone-600">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-800">{h.guestName}</div>
                          <div className="text-[10px] text-stone-400">{h.mobileNumber}</div>
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
                          <div className="font-bold text-stone-800">Room {h.roomNumber}</div>
                          <div className="text-[10px] text-stone-500">{h.roomType}</div>
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-6">
                      <div className="text-stone-800 font-semibold">
                        {h.checkIn} <span className="text-stone-400">→</span> {h.checkOut}
                      </div>
                      <div className="text-[10px] text-orange-600 font-bold mt-0.5">
                        {h.numberOfNights} Nights Stay
                      </div>
                    </td>

                    {/* Lifetime Total */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-stone-900">${h.totalAmount}</div>
                      <div className="text-[10px] text-stone-400">{h.paymentMethod}</div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          h.status
                        )}`}
                      >
                        {h.status}
                      </span>
                    </td>

                    {/* Audit Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* View Audit Event Log */}
                        <button
                          onClick={() => {
                            setSelectedRecordForAudit(h)
                            setIsAuditModalOpen(true)
                          }}
                          title="View Lifecycle Audit Event Timeline"
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <HistoryIcon className="h-3.5 w-3.5 text-orange-600" />
                          <span>Audit Timeline</span>
                        </button>

                        {/* View Tax Invoice */}
                        <button
                          onClick={() => {
                            setSelectedRecordForInvoice(h)
                            setIsInvoiceModalOpen(true)
                          }}
                          title="View Tax Invoice"
                          className="p-1.5 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Delete Log */}
                        <button
                          onClick={() => {
                            setRecordToDelete(h)
                            setIsDeleteModalOpen(true)
                          }}
                          title="Delete History Log"
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
        {filteredHistory.length > itemsPerPage && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">
              Showing <span className="font-bold text-stone-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-bold text-stone-800">
                {Math.min(currentPage * itemsPerPage, filteredHistory.length)}
              </span>{' '}
              of <span className="font-bold text-stone-800">{filteredHistory.length}</span> records
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
      <BookingAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => {
          setIsAuditModalOpen(false)
          setSelectedRecordForAudit(null)
        }}
        record={selectedRecordForAudit}
        onAddNote={handleAddAuditNote}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false)
          setSelectedRecordForInvoice(null)
        }}
        payment={selectedRecordForInvoice}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setRecordToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        roomNumber={recordToDelete?.bookingId}
      />

    </div>
  )
}

export default History
