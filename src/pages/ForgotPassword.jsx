import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react'

const HOTEL_BG_IMAGE_FP =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80'

const ForgotPassword = () => {
  const { forgotPassword } = useAuth()
  const [submittedMessage, setSubmittedMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (data) => {
    setIsSubmitting(true)
    const result = forgotPassword(data.email)
    setIsSubmitting(false)

    if (result.success) {
      setSubmittedMessage(result.message)
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-stone-900 overflow-hidden font-sans">
      
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${HOTEL_BG_IMAGE_FP})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-950/90 via-stone-900/80 to-orange-950/40 backdrop-blur-xs" />

      {/* Main Container */}
      <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-stone-900 p-6 text-center text-white">
          <div className="inline-flex p-3 bg-orange-600/20 rounded-2xl mb-2 border border-orange-500/30">
            <KeyRound className="h-7 w-7 text-orange-400" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Reset Password</h2>
          <p className="text-stone-400 text-xs mt-1">
            Enter your email to receive password reset instructions
          </p>
        </div>

        {submittedMessage ? (
          <div className="p-8 text-center space-y-4">
            <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-base font-bold text-stone-800">Check your inbox</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {submittedMessage}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline pt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-stone-200 focus:border-orange-500 focus:ring-orange-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-orange-600/30 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Link...' : 'Send Reset Instructions'}
            </button>

            <div className="text-center pt-1">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}

export default ForgotPassword
