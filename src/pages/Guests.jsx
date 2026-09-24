import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  fetchGuestsFromApi,
  createGuestService,
  updateGuestService,
  deleteGuestService
} from '../services/guestApi'
import GuestFormModal from '../components/GuestFormModal'
import GuestProfileModal from '../components/GuestProfileModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  Globe,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles
} from 'lucide-react'

const STATUS_FILTERS = ['All', 'Active', 'Checked-In', 'Checked-Out']

const Guests = () => {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [activeGuest, setActiveGuest] = useState(null)
  const [guestToDelete, setGuestToDelete] = useState(null)

  useEffect(() => {
    loadGuests()
  }, [])

  const loadGuests = async () => {
    setLoading(true)
    try {
      const data = await fetchGuestsFromApi()
      setGuests(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load guest directory.')
    } finally {
      setLoading(false)
    }
  }

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchesSearch =
        g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.mobileNumber.includes(searchTerm) ||
        g.idProofNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.nationality.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = selectedStatus === 'All' || g.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [guests, searchTerm, selectedStatus])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  // Pagination slice
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage) || 1
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredGuests.slice(start, start + itemsPerPage)
  }, [filteredGuests, currentPage])

  // Actions
  const handleOpenAddForm = () => {
    setActiveGuest(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditForm = (guest) => {
    setActiveGuest(guest)
    setIsFormModalOpen(true)
  }

  const handleOpenProfile = (guest) => {
    setActiveGuest(guest)
    setIsProfileModalOpen(true)
  }

  const handleOpenDelete = (guest) => {
    setGuestToDelete(guest)
    setIsDeleteModalOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    if (activeGuest) {
      const updated = await updateGuestService(activeGuest.id, formData)
      if (updated) {
        setGuests((prev) => prev.map((g) => (g.id === activeGuest.id ? updated : g)))
        toast.success(`Guest profile for ${formData.fullName} updated!`)
      }
    } else {
      const newGuest = await createGuestService(formData)
      setGuests((prev) => [newGuest, ...prev])
      toast.success(`Guest ${formData.fullName} registered successfully!`)
    }
    setIsFormModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (guestToDelete) {
      await deleteGuestService(guestToDelete.id)
      setGuests((prev) => prev.filter((g) => g.id !== guestToDelete.id))
      toast.success(`Guest record for ${guestToDelete.fullName} deleted.`)
    }
    setIsDeleteModalOpen(false)
    setGuestToDelete(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Checked-Out':
        return 'bg-stone-100 text-stone-700 border-stone-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full text-orange-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" />
            <span>Module 4 Active • Guest Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Guest Management
          </h1>
          <p className="text-stone-500 text-xs mt-1">
            Register, search, filter, edit, and view complete guest profiles and ID credentials.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={loadGuests}
            title="Reload Guests"
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={handleOpenAddForm}
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md shadow-orange-600/30 flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Guest</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, ID proof, or nationality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-stone-400 flex-shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          >
            {STATUS_FILTERS.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Guest Statuses' : st}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Skeleton Loading */}
      {loading && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-stone-200 rounded-xl w-full" />
          ))}
        </div>
      )}

      {/* Guest Directory Display */}
      {!loading && (
        <>
          {paginatedGuests.length > 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Guest Info</th>
                      <th className="px-4 py-4">Contact Details</th>
                      <th className="px-4 py-4">ID Proof</th>
                      <th className="px-4 py-4">Nationality</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {paginatedGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-orange-50/40 transition-colors">
                        
                        {/* Avatar & Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img
                              src={guest.avatar}
                              alt={guest.fullName}
                              className="h-10 w-10 rounded-full object-cover border border-stone-200 flex-shrink-0"
                            />
                            <div>
                              <div className="font-bold text-stone-900 text-sm">{guest.fullName}</div>
                              <div className="text-[10px] text-stone-400">ID: {guest.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-1 text-stone-800 font-semibold">
                              <Mail className="h-3 w-3 text-orange-600" />
                              <span>{guest.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-stone-500 text-[11px]">
                              <Phone className="h-3 w-3 text-stone-400" />
                              <span>{guest.mobileNumber}</span>
                            </div>
                          </div>
                        </td>

                        {/* ID Proof */}
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-1 font-bold text-stone-800">
                            <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
                            <span>{guest.idProofNumber}</span>
                          </div>
                        </td>

                        {/* Nationality */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-stone-700 font-semibold">
                            <Globe className="h-3.5 w-3.5 text-stone-400" />
                            <span>{guest.nationality}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              guest.status
                            )}`}
                          >
                            {guest.status}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenProfile(guest)}
                              className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                              title="View Guest Profile"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditForm(guest)}
                              className="p-1.5 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl transition-colors border border-orange-200"
                              title="Edit Guest"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleOpenDelete(guest)}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-colors border border-red-200"
                              title="Delete Guest"
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
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-2xs">
              <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-stone-800">No Guests Found</h3>
              <p className="text-stone-500 text-xs max-w-sm mx-auto">
                No guest profiles match your search "{searchTerm}" or status filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedStatus('All')
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredGuests.length > itemsPerPage && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div className="text-xs text-stone-500">
                Showing{' '}
                <span className="font-bold text-stone-800">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-bold text-stone-800">
                  {Math.min(currentPage * itemsPerPage, filteredGuests.length)}
                </span>{' '}
                of <span className="font-bold text-stone-800">{filteredGuests.length}</span> guests
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
      <GuestFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={activeGuest}
      />

      <GuestProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        guest={activeGuest}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        roomNumber={guestToDelete?.fullName}
      />

    </div>
  )
}

export default Guests
