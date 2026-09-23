import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Save, BedDouble } from 'lucide-react'

const ROOM_TYPES = ['Deluxe Suite', 'Executive Room', 'Standard Room', 'Presidential Suite']
const AVAILABILITY_OPTIONS = ['Available', 'Occupied', 'Maintenance']

const RoomFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const isEditing = Boolean(initialData)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      roomNumber: '',
      roomType: 'Deluxe Suite',
      pricePerNight: '',
      capacity: '2',
      floorNumber: '1',
      availability: 'Available',
      amenities: 'Wi-Fi, Air Conditioning, TV, Mini Bar',
      image: '',
      description: ''
    }
  })

  useEffect(() => {
    if (initialData) {
      reset({
        roomNumber: initialData.roomNumber || '',
        roomType: initialData.roomType || 'Deluxe Suite',
        pricePerNight: initialData.pricePerNight || '',
        capacity: initialData.capacity || '2',
        floorNumber: initialData.floorNumber || '1',
        availability: initialData.availability || 'Available',
        amenities: Array.isArray(initialData.amenities)
          ? initialData.amenities.join(', ')
          : initialData.amenities || '',
        image: initialData.image || '',
        description: initialData.description || ''
      })
    } else {
      reset({
        roomNumber: '',
        roomType: 'Deluxe Suite',
        pricePerNight: '',
        capacity: '2',
        floorNumber: '1',
        availability: 'Available',
        amenities: 'Wi-Fi, Air Conditioning, TV, Mini Bar',
        image: '',
        description: ''
      })
    }
  }, [initialData, reset, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-600 rounded-xl text-white">
              <BedDouble className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditing ? `Edit Room ${initialData.roomNumber}` : 'Add New Room'}
              </h2>
              <p className="text-xs text-stone-400">Fill in room specification details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Room Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Room Number
              </label>
              <input
                type="text"
                placeholder="e.g. 301"
                {...register('roomNumber', {
                  required: 'Room number is required'
                })}
                className={`w-full px-3.5 py-2 bg-stone-50 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                  errors.roomNumber
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
              {errors.roomNumber && (
                <p className="text-[11px] text-red-500 mt-1">{errors.roomNumber.message}</p>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Room Type
              </label>
              <select
                {...register('roomType')}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Price Per Night */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Price / Night ($)
              </label>
              <input
                type="number"
                placeholder="250"
                {...register('pricePerNight', {
                  required: 'Price is required',
                  min: { value: 10, message: 'Min price $10' }
                })}
                className={`w-full px-3 py-2 bg-stone-50 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                  errors.pricePerNight
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
              {errors.pricePerNight && (
                <p className="text-[11px] text-red-500 mt-1">{errors.pricePerNight.message}</p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Capacity (Guests)
              </label>
              <input
                type="number"
                placeholder="2"
                {...register('capacity', {
                  required: 'Capacity is required',
                  min: { value: 1, message: 'Min 1' }
                })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>

            {/* Floor Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Floor No.
              </label>
              <input
                type="number"
                placeholder="3"
                {...register('floorNumber', {
                  required: 'Floor is required'
                })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Availability Status
            </label>
            <select
              {...register('availability')}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            >
              {AVAILABILITY_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Amenities (Comma separated)
            </label>
            <input
              type="text"
              placeholder="High-Speed Wi-Fi, Ocean View, King Bed, Mini Bar"
              {...register('amenities')}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Image URL (Optional)
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              {...register('image')}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Room Description
            </label>
            <textarea
              rows="2"
              placeholder="Enter room details, features, and view..."
              {...register('description')}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-orange-600/30 flex items-center space-x-1.5"
            >
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Room'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default RoomFormModal
