import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  fetchBookingsFromApi,
  processCheckInService,
  processCheckOutService
} from '../services/bookingApi'
import CheckInModal from '../components/CheckInModal'
import CheckOutModal from '../components/CheckOutModal'
import BookingSummaryModal from '../components/BookingSummaryModal'
import {
  ClipboardList,
  LogIn,
  LogOut,
  Users,
  Search,
  Filter,
  Eye,
  KeyRound,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  BedDouble,
  Sparkles,
  RefreshCw
} from 'lucide-react'

const CheckInOut = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Tab & Filters
  const [activeTab, setActiveTab] = useState('check-in-queue') // 'check-in-queue', 'in-house', 'check-out-queue', 'all'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Modals state
  const [selectedBookingForCheckIn, setSelectedBookingForCheckIn] = useState(null)
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false)

  const [selectedBookingForCheckOut, setSelectedBookingForCheckOut] = useState(null)
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false)

  const [selectedBookingForSummary, setSelectedBookingForSummary] = useState(null)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchBookingsFromApi()
      setBookings(data)
    } catch (err) {
      toast.error('Failed to load check-in/out records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter Bookings based on Tab & Search
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.roomNumber.toString().includes(searchQuery) ||
        b.email.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesTab = true
      if (activeTab === 'check-in-queue') {
        matchesTab = b.status === 'Confirmed' || b.status === 'Pending'
      } else if (activeTab === 'in-house') {
        matchesTab = b.status === 'Checked-In'
      } else if (activeTab === 'check-out-queue') {
        matchesTab = b.status === 'Checked-In'
      }

      let matchesStatus = selectedStatus === 'All' || b.status === selectedStatus

      return matchesSearch && matchesTab && matchesStatus
    })
  }, [bookings, activeTab, searchQuery, selectedStatus])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery, selectedStatus])

  // Pagination slice
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredBookings.slice(start, start + itemsPerPage)
  }, [filteredBookings, currentPage])

  // Handlers
  const handleOpenCheckIn = (booking) => {
    setSelectedBookingForCheckIn(booking)
    setIsCheckInModalOpen(true)
  }

  const handleConfirmCheckIn = async (bookingId, checkInData) => {
    const updated = await processCheckInService(bookingId, checkInData)
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)))
      toast.success(`Check-In complete for ${updated.guestName}! Keycard ${updated.keycardNo} issued. Room ${updated.roomNumber} is now Occupied.`)
    }
    setIsCheckInModalOpen(false)
    setSelectedBookingForCheckIn(null)
  }

  const handleOpenCheckOut = (booking) => {
    setSelectedBookingForCheckOut(booking)
    setIsCheckOutModalOpen(true)
  }

  const handleConfirmCheckOut = async (bookingId, checkOutData) => {
    const updated = await processCheckOutService(bookingId, checkOutData)
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)))
      toast.success(`Check-Out complete for ${updated.guestName}! Room ${updated.roomNumber} is now ${checkOutData.roomNextStatus || 'Available'}. Total Paid: $${updated.finalAmount}.`)
    }
    setIsCheckOutModalOpen(false)
    setSelectedBookingForCheckOut(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Checked-Out':
        return 'bg-stone-100 text-stone-700 border-stone-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  // Summary Metrics
  const checkInQueueCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length
  const inHouseCount = bookings.filter((b) => b.status === 'Checked-In').length
  const checkedOutCount = bookings.filter((b) => b.status === 'Checked-Out').length

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-orange-600 rounded-2xl shadow-lg shadow-orange-600/30">
            <ClipboardList className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 bg-stone-800/80 px-2.5 py-0.5 rounded-full text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-3 w-3" />
              <span>Module 6 Active • Arrival & Departure Desk</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Check-In / Check-Out Management</h1>
            <p className="text-stone-400 text-xs mt-0.5">
              Process arrivals, keycards, in-house stay monitoring, and settlement check-outs with auto room-sync.
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          title="Refresh Check-In Records"
          className="p-3 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-2xl transition-colors self-start sm:self-auto border border-stone-700 flex items-center space-x-2 text-xs font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <LogIn className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Arrival Queue</span>
            <span className="text-lg font-extrabold text-blue-700">{checkInQueueCount} Guests</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">In-House Stay</span>
            <span className="text-lg font-extrabold text-emerald-700">{inHouseCount} Occupied</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <LogOut className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Pending Departures</span>
            <span className="text-lg font-extrabold text-orange-600">{inHouseCount} Guests</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-3.5">
          <div className="p-3 bg-stone-100 text-stone-600 rounded-xl">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Completed Departures</span>
            <span className="text-lg font-extrabold text-stone-800">{checkedOutCount} Guests</span>
          </div>
        </div>

      </div>

      {/* Tab Bar & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-3">
          <button
            onClick={() => setActiveTab('check-in-queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'check-in-queue'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Check-In Queue ({checkInQueueCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('in-house')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'in-house'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>In-House Guests ({inHouseCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('check-out-queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'check-out-queue'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Check-Out Queue ({inHouseCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'all'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>All Reservations ({bookings.length})</span>
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Guest Name, Booking ID, Room Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-stone-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Pending">Pending</option>
              <option value="Checked-Out">Checked-Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-transparent"></div>
            <p className="text-xs font-medium text-stone-500">Loading check-in queue...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ClipboardList className="h-12 w-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-700">No Reservations Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              No reservation records match the active tab or search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Booking Details</th>
                  <th className="py-4 px-6">Guest Info</th>
                  <th className="py-4 px-6">Assigned Room</th>
                  <th className="py-4 px-6">Stay Dates</th>
                  <th className="py-4 px-6">Keycard #</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {currentItems.map((b) => (
                  <tr key={b.id} className="hover:bg-orange-50/30 transition-colors">
                    
                    {/* Booking */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-stone-900">{b.id}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">Subtotal: ${b.totalAmount}</div>
                    </td>

                    {/* Guest */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-stone-100 rounded-lg text-stone-600">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-800">{b.guestName}</div>
                          <div className="text-[10px] text-stone-400">{b.mobileNumber}</div>
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
                          <div className="font-bold text-stone-800">Room {b.roomNumber}</div>
                          <div className="text-[10px] text-stone-500">{b.roomType}</div>
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-6">
                      <div className="text-stone-800 font-semibold">
                        {b.checkIn} <span className="text-stone-400">→</span> {b.checkOut}
                      </div>
                      <div className="text-[10px] text-orange-600 font-bold mt-0.5">
                        {b.numberOfNights} Nights
                      </div>
                    </td>

                    {/* Keycard */}
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 rounded-lg text-stone-800 font-extrabold text-[11px] border border-stone-200">
                        <KeyRound className="h-3 w-3 text-orange-600" />
                        <span>{b.keycardNo || 'Unassigned'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Desk Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        
                        {/* Process Check-In */}
                        {(b.status === 'Confirmed' || b.status === 'Pending') && (
                          <button
                            onClick={() => handleOpenCheckIn(b)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1"
                          >
                            <LogIn className="h-3.5 w-3.5" />
                            <span>Check-In</span>
                          </button>
                        )}

                        {/* Process Check-Out */}
                        {b.status === 'Checked-In' && (
                          <button
                            onClick={() => handleOpenCheckOut(b)}
                            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/20 flex items-center space-x-1"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Check-Out</span>
                          </button>
                        )}

                        {/* View Invoice Summary */}
                        <button
                          onClick={() => {
                            setSelectedBookingForSummary(b)
                            setIsSummaryModalOpen(true)
                          }}
                          title="View Invoice Summary"
                          className="p-1.5 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
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
        {filteredBookings.length > itemsPerPage && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">
              Showing <span className="font-bold text-stone-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-bold text-stone-800">
                {Math.min(currentPage * itemsPerPage, filteredBookings.length)}
              </span>{' '}
              of <span className="font-bold text-stone-800">{filteredBookings.length}</span> records
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
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => {
          setIsCheckInModalOpen(false)
          setSelectedBookingForCheckIn(null)
        }}
        onConfirm={handleConfirmCheckIn}
        booking={selectedBookingForCheckIn}
      />

      <CheckOutModal
        isOpen={isCheckOutModalOpen}
        onClose={() => {
          setIsCheckOutModalOpen(false)
          setSelectedBookingForCheckOut(null)
        }}
        onConfirm={handleConfirmCheckOut}
        booking={selectedBookingForCheckOut}
      />

      <BookingSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => {
          setIsSummaryModalOpen(false)
          setSelectedBookingForSummary(null)
        }}
        booking={selectedBookingForSummary}
      />

    </div>
  )
}

export default CheckInOut
