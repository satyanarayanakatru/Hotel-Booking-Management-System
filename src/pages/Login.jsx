import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Eye, EyeOff, Lock, Mail, Hotel, Info } from 'lucide-react'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (data) => {
    setIsSubmitting(true)
    const result = login(data.email, data.password)
    setIsSubmitting(false)

    if (result.success) {
      toast.success(`Welcome back, ${result.user.fullName}!`)
      navigate(from, { replace: true })
    } else {
      toast.error(result.message)
    }
  }

  const fillDemoAdmin = () => {
    setValue('email', 'admin@hotel.com')
    setValue('password', 'Password123!')
    toast.info('Demo admin credentials populated!')
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Header */}
        <div className="bg-slate-900 p-6 text-center text-white relative">
          <div className="inline-flex p-3 bg-blue-600/20 rounded-xl mb-3 border border-blue-500/30">
            <Hotel className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Sign In to GrandVista</h2>
          <p className="text-slate-400 text-xs mt-1">Manage your hotel reservations & account</p>
        </div>

        {/* Demo Hint Banner */}
        <div className="mx-6 mt-6 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start justify-between">
          <div className="flex items-start space-x-2 text-xs text-blue-800">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold">Demo Account:</span> admin@hotel.com / Password123!
            </div>
          </div>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline flex-shrink-0 ml-2"
          >
            Auto-fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long'
                  }
                })}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all shadow-md hover:shadow-blue-500/25 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
            Register now
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login
