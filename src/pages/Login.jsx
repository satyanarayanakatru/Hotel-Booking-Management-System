import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Eye, EyeOff, Lock, Mail, Hotel, Info, Star, Sparkles } from 'lucide-react'

const FULL_SIDE_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80'

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
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 font-sans bg-white">
      
      {/* LEFT HALF: Full Screen Image Showcase (50% Width, Full Height) */}
      <div className="hidden md:relative md:flex flex-col justify-between p-12 lg:p-16 text-white h-screen overflow-hidden">
        {/* Full Left Image */}
        <img
          src={FULL_SIDE_IMAGE}
          alt="Luxury Hotel Resort"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-stone-900/60" />

        {/* Top Branding */}
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-orange-600/30 border border-orange-400/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-orange-200 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span>GrandVista Hospitality</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-white tracking-tight">
            Effortless Suite & Reservation Management
          </h1>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 p-6 bg-stone-900/70 backdrop-blur-md rounded-3xl border border-white/10 space-y-3">
          <div className="flex items-center space-x-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
            "The most intuitive hotel management system. Real-time occupancy, guest profiles, and seamless check-ins."
          </p>
          <div className="text-xs font-bold text-orange-300 uppercase tracking-wider">
            — GrandVista Operations Team
          </div>
        </div>
      </div>

      {/* RIGHT HALF: Full Screen Form View (50% Width, Full Height) */}
      <div className="h-screen overflow-y-auto flex flex-col justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="max-w-md w-full mx-auto space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex p-3 bg-orange-100 rounded-2xl text-orange-600">
              <Hotel className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Sign In to GrandVista
            </h2>
            <p className="text-stone-500 text-sm">
              Welcome back! Please enter your account credentials below.
            </p>
          </div>

          {/* Demo Hint Banner */}
          <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-start space-x-2 text-xs text-orange-950">
              <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">Demo Account:</span> admin@hotel.com / Password123!
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="text-xs font-semibold text-orange-600 hover:text-orange-800 underline flex-shrink-0 ml-2"
            >
              Auto-fill
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  placeholder="admin@hotel.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={`w-full pl-11 pr-4 py-3 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
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
                  className={`w-full pl-11 pr-11 py-3 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
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
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-600/30 active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs text-stone-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
              Create Account
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login
