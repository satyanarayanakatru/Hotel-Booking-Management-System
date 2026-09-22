import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Eye, EyeOff, Lock, Mail, User, Hotel, Sparkles, ShieldCheck } from 'lucide-react'

const FULL_SIDE_IMAGE_REG =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80'

const Register = () => {
  const { register: registerAuth } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  })

  const passwordValue = watch('password')

  const onSubmit = (data) => {
    setIsSubmitting(true)
    const result = registerAuth({
      fullName: data.fullName,
      email: data.email,
      password: data.password
    })
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Registration successful! Welcome to GrandVista.')
      navigate('/dashboard', { replace: true })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 font-sans bg-white">
      
      {/* LEFT HALF: Full Screen Image Showcase (50% Width, Full Height) */}
      <div className="hidden md:relative md:flex flex-col justify-between p-12 lg:p-16 text-white h-screen overflow-hidden">
        {/* Full Image */}
        <img
          src={FULL_SIDE_IMAGE_REG}
          alt="Luxury Hotel Suite"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-stone-900/60" />

        {/* Top Branding */}
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-orange-600/30 border border-orange-400/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-orange-200 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span>Join GrandVista Hospitality</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-white tracking-tight">
            Start Managing Your Hotel Suites Today
          </h1>
        </div>

        {/* Bottom Feature Badge */}
        <div className="relative z-10 p-6 bg-stone-900/70 backdrop-blur-md rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center space-x-2 text-orange-400">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Instant Account Setup</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Create your account to access room reservations, guest management, and live financial metrics.
          </p>
        </div>
      </div>

      {/* RIGHT HALF: Full Screen Form View (50% Width, Full Height) */}
      <div className="h-screen overflow-y-auto flex flex-col justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="max-w-md w-full mx-auto space-y-5">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex p-3 bg-orange-100 rounded-2xl text-orange-600 mb-1">
              <Hotel className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Create an Account
            </h2>
            <p className="text-stone-500 text-sm">
              Fill in your details below to set up your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Full name must be at least 2 characters'
                    }
                  })}
                  className={`w-full pl-11 pr-4 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
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

            {/* Email Address */}
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
                  placeholder="john@example.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={`w-full pl-11 pr-4 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
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
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
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
                  className={`w-full pl-11 pr-11 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === passwordValue || 'Passwords do not match'
                  })}
                  className={`w-full pl-11 pr-11 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                {...register('terms', {
                  required: 'You must agree to the Terms'
                })}
                className="mt-1 h-3.5 w-3.5 text-orange-600 border-stone-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="terms" className="text-xs text-stone-600">
                I agree to the{' '}
                <span className="text-orange-600 font-semibold hover:underline cursor-pointer">
                  Terms of Service
                </span>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-500">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-600/30 active:scale-[0.99] disabled:opacity-50 mt-1"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-1 text-center text-xs text-stone-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Register
