import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { User, Mail, Lock, Eye, EyeOff, Save, ShieldCheck } from 'lucide-react'

const Profile = () => {
  const { user, updateProfile } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      password: ''
    }
  })

  const onSubmit = (data) => {
    setIsSubmitting(true)
    const result = updateProfile({
      fullName: data.fullName,
      password: data.password || undefined
    })
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Profile updated successfully in LocalStorage!')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
        
        {/* Profile Card Header */}
        <div className="bg-stone-900 p-6 text-white flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-orange-600 border-2 border-orange-400 flex items-center justify-center font-bold text-2xl shadow-md shadow-orange-600/30">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.fullName}</h1>
            <p className="text-xs text-stone-400">{user?.email}</p>
            <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 bg-orange-500/20 text-orange-300 rounded-md text-xs font-medium border border-orange-400/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{user?.role || 'Guest'} Account</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <h2 className="text-base font-bold text-stone-900 border-b pb-2">
            Edit Account Settings
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters'
                  }
                })}
                className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Address (Read-Only) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Email Address (Primary Key - Read Only)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                disabled
                {...register('email')}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-lg text-sm text-stone-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              New Password (Leave blank to keep current)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                {...register('password', {
                  minLength: {
                    value: 6,
                    message: 'New password must be at least 6 characters'
                  }
                })}
                className={`w-full pl-10 pr-10 py-2.5 bg-stone-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all shadow-md shadow-orange-600/20 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Profile
