import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  BedDouble,
  Sparkles,
  Award,
  LogOut,
  ChevronRight
} from 'lucide-react'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info('Logged out successfully.')
    navigate('/login')
  }

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently'

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Authentication Module Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              You are currently logged into the GrandVista Hotel Booking Management System.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/profile"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-red-600/90 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-700 flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Session Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <span>Session Details (Stored in LocalStorage)</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <User className="h-4 w-4 text-blue-500" />
              <span>Full Name</span>
            </div>
            <div className="text-sm font-bold text-slate-800">{user?.fullName}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <Mail className="h-4 w-4 text-blue-500" />
              <span>Email Address</span>
            </div>
            <div className="text-sm font-bold text-slate-800 truncate">{user?.email}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <Award className="h-4 w-4 text-blue-500" />
              <span>Account Role</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 font-bold rounded-md text-xs">
              {user?.role || 'Guest'}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>Member Since</span>
            </div>
            <div className="text-sm font-bold text-slate-800">{joinedDate}</div>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Bookings
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">2 Suites</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">✓ Confirmed & Check-in ready</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <BedDouble className="h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Loyalty Points
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">1,450 pts</p>
            <p className="text-xs text-blue-600 font-medium mt-1">Gold Tier Member</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Award className="h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Account Security
            </p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">Protected</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Protected Route Guarded</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
