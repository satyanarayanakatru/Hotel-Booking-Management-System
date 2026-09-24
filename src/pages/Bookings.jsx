import React, { useState, useEffect } from 'react'
import {
  fetchBookingsFromApi,
  createBookingService,
  cancelBookingService,
  deleteBookingService
} from '../services/bookingApi'
import BookingFormModal from '../components/BookingFormModal'
import BookingSummaryModal from '../components/BookingSummaryModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { toast } from 'react-toastify'
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Eye,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  BedDouble,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Ban
} from 'lucide-react'

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedBookingForSummary, setSelectedBookingForSummary] = useState(null)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Load Bookings
  const loadBookings = async () => {
    setLoading(true)
    try {
      const data = await fetchBookingsFromApi()
      setBookings(data)
    } catch (error) {
      toast.error('Failed to load room bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  // Filter & Search Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.roomNumber.toString().includes(searchQuery) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStatus])

  // Handlers
  const handleCreateBooking = async (newBookingData) => {
    try {
      const created = await createBookingService(newBookingData)
      setBookings((prev) => [created, ...prev])
      setIsFormOpen(false)
      toast.success(`Booking ${created.id} created successfully!`)
      // Automatically open summary modal for invoice viewing
      setSelectedBookingForSummary(created)
      setIsSummaryOpen(true)
    } catch (error) {
      toast.error('Failed to create room booking.')
    }
  }

  const handleCancelBooking = async (booking) => {
    if (booking.status === 'Cancelled') {
      toast.info('Booking is already cancelled.')
      return
    }
    const updated = await cancelBookingService(booking.id)
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)))
      toast.warn(`Booking ${booking.id} has been cancelled.`)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return
    const success = await deleteBookingService(bookingToDelete.id)
    if (success) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingToDelete.id))
      toast.error(`Booking ${bookingToDelete.id} removed.`)
    }
    setIsDeleteOpen(false)
    setBookingToDelete(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Checked-Out':
        return 'bg-stone-100 text-stone-700 border-stone-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  // Summary Metrics
  const totalReservations = bookings.length
  const checkedInCount = bookings.filter((b) => b.status === 'Checked-In').length
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-orange-600 rounded-2xl shadow-lg shadow-orange-600/30">
            <CalendarCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Room Booking Management</h1>
            <p className="text-stone-400 text-xs mt-0.5">
              Module 5: Reserve rooms, calculate nights & rates, auto-prevent double booking
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-orange-600/30 flex items-center space-x-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Bookings</span>
            <span className="text-lg font-extrabold text-stone-900">{totalReservations}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Checked-In</span>
            <span className="text-lg font-extrabold text-emerald-700">{checkedInCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Confirmed</span>
            <span className="text-lg font-extrabold text-blue-700">{confirmedCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Ban className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Cancelled</span>
            <span className="text-lg font-extrabold text-red-700">{cancelledCount}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Booking ID, Guest Name, Room Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-stone-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:border-orange-500"
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

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center text-stone-400 space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-transparent"></div>
            <p className="text-xs font-medium">Loading room reservations...</p>
          </div>
        ) : currentBookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CalendarCheck className="h-12 w-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-700">No Reservations Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              No booking records match your current search query or filter selection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Booking Details</th>
                  <th className="py-4 px-6">Guest</th>
                  <th className="py-4 px-6">Room Spec</th>
                  <th className="py-4 px-6">Dates & Stay</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {currentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-orange-50/30 transition-colors">
                    
                    {/* Booking Details */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-stone-900">{b.id}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">Created: {b.createdAt}</div>
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

                    {/* Room Spec */}
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
                        {b.checkIn} <span className="text-stone-400 font-normal">to</span> {b.checkOut}
                      </div>
                      <div className="text-[10px] text-orange-600 font-bold mt-0.5">
                        {b.numberOfNights} Nights (${b.pricePerNight}/night)
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-stone-900">${b.totalAmount}</div>
                      <div className="text-[10px] text-stone-400">Incl. 10% Tax</div>
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

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* Summary / Invoice Modal Trigger */}
                        <button
                          onClick={() => {
                            setSelectedBookingForSummary(b)
                            setIsSummaryOpen(true)
                          }}
                          title="View Invoice Summary"
                          className="p-1.5 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Cancel Booking */}
                        {b.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(b)}
                            title="Cancel Booking"
                            className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}

                        {/* Delete Booking */}
                        <button
                          onClick={() => {
                            setBookingToDelete(b)
                            setIsDeleteOpen(true)
                          }}
                          title="Delete Reservation"
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
        {filteredBookings.length > itemsPerPage && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">
              Showing <span className="font-bold text-stone-800">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-bold text-stone-800">
                {Math.min(indexOfLastItem, filteredBookings.length)}
              </span>{' '}
              of <span className="font-bold text-stone-800">{filteredBookings.length}</span> reservations
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
      <BookingFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateBooking}
      />

      <BookingSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false)
          setSelectedBookingForSummary(null)
        }}
        booking={selectedBookingForSummary}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setBookingToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        roomNumber={bookingToDelete?.id}
      />

    </div>
  )
}

export default Bookings
