import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  fetchRoomsFromApi,
  createRoomService,
  updateRoomService,
  deleteRoomService
} from '../services/roomApi'
import RoomFormModal from '../components/RoomFormModal'
import RoomDetailsModal from '../components/RoomDetailsModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import {
  BedDouble,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  AlertCircle
} from 'lucide-react'

const ROOM_TYPES = ['All', 'Deluxe Suite', 'Executive Room', 'Standard Room', 'Presidential Suite']
const AVAILABILITY_TYPES = ['All', 'Available', 'Occupied', 'Maintenance']

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters, Search & Sort
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedAvailability, setSelectedAvailability] = useState('All')
  const [sortOption, setSortOption] = useState('default')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [activeRoom, setActiveRoom] = useState(null)
  const [roomToDelete, setRoomToDelete] = useState(null)

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRoomsFromApi()
      setRooms(data)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch room data from API. Please try again.')
      toast.error('Failed to load room inventory.')
    } finally {
      setLoading(false)
    }
  }

  // Filtered & Sorted Rooms calculation
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        const matchesSearch =
          room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (room.amenities &&
            room.amenities.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase())))

        const matchesType = selectedType === 'All' || room.roomType === selectedType
        const matchesAvailability =
          selectedAvailability === 'All' || room.availability === selectedAvailability

        return matchesSearch && matchesType && matchesAvailability
      })
      .sort((a, b) => {
        if (sortOption === 'price_asc') return a.pricePerNight - b.pricePerNight
        if (sortOption === 'price_desc') return b.pricePerNight - a.pricePerNight
        return 0
      })
  }, [rooms, searchTerm, selectedType, selectedAvailability, sortOption])

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedType, selectedAvailability, sortOption])

  // Paginated slice
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage) || 1
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredRooms.slice(start, start + itemsPerPage)
  }, [filteredRooms, currentPage])

  // Handlers
  const handleOpenAddForm = () => {
    setActiveRoom(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditForm = (room) => {
    setActiveRoom(room)
    setIsFormModalOpen(true)
  }

  const handleOpenDetails = (room) => {
    setActiveRoom(room)
    setIsDetailsModalOpen(true)
  }

  const handleOpenDelete = (room) => {
    setRoomToDelete(room)
    setIsDeleteModalOpen(true)
  }

  const handleFormSubmit = (formData) => {
    if (activeRoom) {
      const updated = updateRoomService(activeRoom.id, formData)
      if (updated) {
        setRooms((prev) => prev.map((r) => (r.id === activeRoom.id ? updated : r)))
        toast.success(`Room ${formData.roomNumber} updated successfully!`)
      }
    } else {
      const newRoom = createRoomService(formData)
      setRooms((prev) => [newRoom, ...prev])
      toast.success(`Room ${formData.roomNumber} created successfully!`)
    }
    setIsFormModalOpen(false)
  }

  const handleConfirmDelete = () => {
    if (roomToDelete) {
      deleteRoomService(roomToDelete.id)
      setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id))
      toast.success(`Room ${roomToDelete.roomNumber} removed from inventory.`)
    }
    setIsDeleteModalOpen(false)
    setRoomToDelete(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Occupied':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Maintenance':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full text-orange-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" />
            <span>Module 3 Active • Room Inventory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Room Management
          </h1>
          <p className="text-stone-500 text-xs mt-1">
            Display, filter, add, edit, and manage suite availability with live Third-Party API data.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={loadRooms}
            title="Reload from API"
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={handleOpenAddForm}
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md shadow-orange-600/30 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Room</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & Sort Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search room number, type, amenity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          />
        </div>

        {/* Filter by Room Type */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-stone-400 flex-shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          >
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Room Types' : type}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Availability */}
        <div className="flex items-center space-x-2">
          <BedDouble className="h-4 w-4 text-stone-400 flex-shrink-0" />
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          >
            {AVAILABILITY_TYPES.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Availability Statuses' : status}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by Price */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4 text-stone-400 flex-shrink-0" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          >
            <option value="default">Sort by Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4 animate-pulse"
            >
              <div className="h-48 bg-stone-200 rounded-2xl w-full" />
              <div className="h-4 bg-stone-200 rounded w-2/3" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-stone-200 rounded w-20" />
                <div className="h-8 bg-stone-200 rounded-xl w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Alert */}
      {error && !loading && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="text-xs font-semibold text-red-800">{error}</p>
          <button
            onClick={loadRooms}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Room Grid Cards */}
      {!loading && !error && (
        <>
          {paginatedRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Image Banner */}
                  <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                    <img
                      src={room.image}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-900/30" />

                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold rounded-xl border border-white/10">
                        Floor {room.floorNumber}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm ${getStatusBadge(
                          room.availability
                        )}`}
                      >
                        {room.availability}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-[10px] font-bold text-orange-300 uppercase tracking-wider">
                        {room.roomType}
                      </div>
                      <h3 className="text-xl font-extrabold tracking-tight">
                        Room {room.roomNumber}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs text-stone-600 font-semibold">
                          <Users className="h-4 w-4 text-orange-600" />
                          <span>Cap: {room.capacity} Guests</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-extrabold text-stone-900">
                            ${room.pricePerNight}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium"> / night</span>
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {room.amenities &&
                          room.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-[10px] font-medium border border-stone-200"
                            >
                              {amenity}
                            </span>
                          ))}
                        {room.amenities && room.amenities.length > 3 && (
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-[10px] font-bold">
                            +{room.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => handleOpenDetails(room)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Details</span>
                      </button>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleOpenEditForm(room)}
                          className="p-1.5 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl transition-colors border border-orange-200"
                          title="Edit Room"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleOpenDelete(room)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-colors border border-red-200"
                          title="Delete Room"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-2xs">
              <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600">
                <BedDouble className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-stone-800">No Matching Rooms Found</h3>
              <p className="text-stone-500 text-xs max-w-sm mx-auto">
                No rooms match your search "{searchTerm}" or selected filters. Try clearing your filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedType('All')
                  setSelectedAvailability('All')
                  setSortOption('default')
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredRooms.length > itemsPerPage && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div className="text-xs text-stone-500">
                Showing{' '}
                <span className="font-bold text-stone-800">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-bold text-stone-800">
                  {Math.min(currentPage * itemsPerPage, filteredRooms.length)}
                </span>{' '}
                of <span className="font-bold text-stone-800">{filteredRooms.length}</span> rooms
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-stone-200 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-stone-800 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-stone-200 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <RoomFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={activeRoom}
      />

      <RoomDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        room={activeRoom}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        roomNumber={roomToDelete?.roomNumber}
      />

    </div>
  )
}

export default Rooms
