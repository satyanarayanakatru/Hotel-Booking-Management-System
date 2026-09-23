import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Save, UserPlus, UserCheck } from 'lucide-react'

const STATUS_OPTIONS = ['Active', 'Checked-In', 'Checked-Out']

const GuestFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const isEditing = Boolean(initialData)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      address: '',
      idProofNumber: '',
      nationality: 'United States',
      status: 'Active',
      avatar: ''
    }
  })

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        mobileNumber: initialData.mobileNumber || '',
        address: initialData.address || '',
        idProofNumber: initialData.idProofNumber || '',
        nationality: initialData.nationality || 'United States',
        status: initialData.status || 'Active',
        avatar: initialData.avatar || ''
      })
    } else {
      reset({
        fullName: '',
        email: '',
        mobileNumber: '',
        address: '',
        idProofNumber: '',
        nationality: 'United States',
        status: 'Active',
        avatar: ''
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
              {isEditing ? <UserCheck className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditing ? `Edit Guest: ${initialData.fullName}` : 'Register New Guest'}
              </h2>
              <p className="text-xs text-stone-400">Enter guest profile & contact information</p>
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
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Min 2 characters' }
              })}
              className={`w-full px-3.5 py-2 bg-stone-50 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="sarah@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Enter a valid email'
                  }
                })}
                className={`w-full px-3.5 py-2 bg-stone-50 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="+1 (555) 234-5678"
                {...register('mobileNumber', {
                  required: 'Mobile number is required'
                })}
                className={`w-full px-3.5 py-2 bg-stone-50 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                  errors.mobileNumber
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
              {errors.mobileNumber && (
                <p className="text-[11px] text-red-500 mt-1">{errors.mobileNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* ID Proof Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                ID Proof Number (Passport / DL)
              </label>
              <input
                type="text"
                placeholder="ID-PASSPORT-98214"
                {...register('idProofNumber', {
                  required: 'ID proof number is required'
                })}
                className={`w-full px-3.5 py-2 bg-stone-50 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                  errors.idProofNumber
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
              {errors.idProofNumber && (
                <p className="text-[11px] text-red-500 mt-1">{errors.idProofNumber.message}</p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Nationality
              </label>
              <input
                type="text"
                placeholder="United States"
                {...register('nationality', {
                  required: 'Nationality is required'
                })}
                className={`w-full px-3.5 py-2 bg-stone-50 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                  errors.nationality
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
              {errors.nationality && (
                <p className="text-[11px] text-red-500 mt-1">{errors.nationality.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Residential Address
            </label>
            <input
              type="text"
              placeholder="742 Evergreen Terrace, Springfield, IL"
              {...register('address', {
                required: 'Address is required'
              })}
              className={`w-full px-3.5 py-2 bg-stone-50 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                errors.address
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
              }`}
            />
            {errors.address && (
              <p className="text-[11px] text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Guest Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Avatar URL (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Avatar Image URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://..."
                {...register('avatar')}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
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
              <span>{isEditing ? 'Save Changes' : 'Register Guest'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default GuestFormModal
