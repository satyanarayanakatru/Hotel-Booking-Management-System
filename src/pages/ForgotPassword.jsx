import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react'

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
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-center text-white">
          <div className="inline-flex p-3 bg-blue-600/20 rounded-xl mb-3 border border-blue-500/30">
            <KeyRound className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Reset Your Password</h2>
          <p className="text-slate-400 text-xs mt-1">
            Enter your registered email to receive reset instructions
          </p>
        </div>

        {submittedMessage ? (
          <div className="p-8 text-center space-y-4">
            <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Check your inbox</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {submittedMessage}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline pt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all shadow-md hover:shadow-blue-500/25 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Link...' : 'Send Reset Instructions'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
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
