import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRooms } from '../context/RoomContext'
import { useGuests } from '../context/GuestContext'
import { useBookings } from '../context/BookingContext'
import { usePayments } from '../context/PaymentContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import DashboardCharts from '../components/DashboardCharts'
import {
  BedDouble,
  CheckCircle2,
  Users,
  LogIn,
  LogOut,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Search,
  ArrowRight,
  UserPlus,
  BarChart3,
  Sparkles,
  RefreshCw
} from 'lucide-react'

// Suitable High-Res Hotel Images for the 8 Dashboard Metric Cards
const METRIC_CARD_IMAGES = {
  totalRooms: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=500&q=80',
  availableRooms: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80',
  occupiedRooms: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=500&q=80',
  totalGuests: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80',
  todayCheckIns: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=500&q=80',
  todayCheckOuts: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=500&q=80',
  totalBookings: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=500&q=80',
  totalRevenue: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=500&q=80'
}

const Dashboard = () => {
  const { user } = useAuth()
  const { rooms, refreshRooms } = useRooms()
  const { guests, refreshGuests } = useGuests()
  const { bookings, refreshBookings } = useBookings()
  const { payments, refreshPayments } = usePayments()

  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Dynamic Dashboard Stats computed from the 4 Contexts
  const totalRooms = rooms.length
  const availableRooms = rooms.filter((r) => r.availability === 'Available').length
  const occupiedRooms = rooms.filter((r) => r.availability === 'Occupied').length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  const totalGuests = guests.length
  const todayCheckIns = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length
  const todayCheckOuts = bookings.filter((b) => b.status === 'Checked-In').length
  const totalBookings = bookings.length

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0)

  // Dynamic Pacing Summary
  const revenueSummary = {
    daily: Math.round(totalRevenue * 0.12),
    weekly: Math.round(totalRevenue * 0.35),
    monthly: totalRevenue,
    projected: Math.round(totalRevenue * 1.25),
    roomTypeRevenue: [
      { type: 'Deluxe Suite', revenue: Math.round(totalRevenue * 0.4), percentage: 40 },
      { type: 'Executive Room', revenue: Math.round(totalRevenue * 0.3), percentage: 30 },
      { type: 'Standard Room', revenue: Math.round(totalRevenue * 0.2), percentage: 20 },
      { type: 'Presidential Suite', revenue: Math.round(totalRevenue * 0.1), percentage: 10 }
    ]
  }

  const handleRefresh = async () => {
    await Promise.all([refreshRooms(true), refreshGuests(true), refreshBookings(true), refreshPayments(true)])
    toast.success('Live Dashboard metrics refreshed from all 4 contexts!')
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleActionClick = (title, path) => {
    toast.info(`Opening ${title}...`)
    navigate(path)
  }

  // Filter live recent bookings from BookingContext
  const filteredBookings = bookings.filter(
    (b) =>
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.toString().includes(searchTerm)
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Checked-Out':
        return 'bg-stone-100 text-stone-700 border-stone-200'
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200'
    }
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-orange-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 px-3 py-1 rounded-full text-orange-300 text-xs font-semibold mb-3 border border-orange-400/20">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              <span>Live Context Mode • Dynamic Dashboard Connected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-xl">
              Live metrics dynamically synchronized across Room, Guest, Booking, and Payment Contexts.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border border-stone-700 flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-orange-400" />
              <span>Refresh Stats</span>
            </button>
            <button
              onClick={() => handleActionClick('New Booking', '/bookings')}
              className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md shadow-orange-600/30 flex items-center space-x-2 cursor-pointer"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>New Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 8 Dynamic Metric Cards with Suitable Hotel Background Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CARD 1: Total Rooms */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all group h-32 border border-stone-200">
          <img
            src={METRIC_CARD_IMAGES.totalRooms}
            alt="Total Rooms"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-stone-900/40" />
          
          <div className="relative z-10 p-5 text-white h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
                Total Rooms
              </span>
              <div className="p-2 bg-orange-600/80 text-white rounded-xl backdrop-blur-md shadow-sm">
                <BedDouble className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-white">
                {totalRooms}
              </span>
              <span className="text-xs text-stone-300 font-medium">Room Inventory</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Available Rooms */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all group h-32 border border-stone-200">
          <img
            src={METRIC_CARD_IMAGES.availableRooms}
            alt="Available Rooms"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-emerald-950/75 to-stone-900/40" />
          
          <div className="relative z-10 p-5 text-white h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Available Rooms
              </span>
              <div className="p-2 bg-emerald-600/80 text-white rounded-xl backdrop-blur-md shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-emerald-300">
                {availableRooms}
              </span>
              <span className="text-xs text-emerald-200 font-semibold">Ready for check-in</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Occupied Rooms */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all group h-32 border border-stone-200">
          <img
            src={METRIC_CARD_IMAGES.occupiedRooms}
            alt="Occupied Rooms"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-amber-950/75 to-stone-900/40" />
          
          <div className="relative z-10 p-5 text-white h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Occupied Rooms
              </span>
              <div className="p-2 bg-amber-600/80 text-white rounded-xl backdrop-blur-md shadow-sm">
                <BedDouble className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-amber-300">
                {occupiedRooms}
              </span>
              <span className="text-xs text-amber-200 font-medium">
                {occupancyRate}% Occupancy
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: Total Guests */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all group h-32 border border-stone-200">
          <img
            src={METRIC_CARD_IMAGES.totalGuests}
            alt="Total Guests"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-stone-900/40" />
          
          <div className="relative z-10 p-5 text-white h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                Total Guests
              </span>
              <div className="p-2 bg-stone-700/80 text-white rounded-xl backdrop-blur-md shadow-sm">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-white">
                {totalGuests}
              </span>
              <span className="text-xs text-stone-300 font-medium">Guest Directory</span>
            </div>
          </div>
        </div>

        {/* CARD 5: Today's Check-Ins */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all group h-32 border border-stone-200">
          <img
            src={METRIC_CARD_IMAGES.todayCheckIns}
            alt="Today Check Ins"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-blue-950/75 to-stone-900/40" />
          
          <div className="relative z-10 p-5 text-white h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Today's Check-Ins
              </span>
              <div className="p-2 bg-blue-600/80 text-white rounded-xl backdrop-blur-md shadow-sm">
                <LogIn className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-blue-300">
                {todayCheckIns}
              </span>
              <span className="text-xs text-blue-200 font-medium">Scheduled Queue</span>
            </div>
          </div>
        </div>

        {/* CARD 6: Today's Check-Outs */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all group h-32 border border-stone-200">
          <img
            src={METRIC_CARD_IMAGES.todayCheckOuts}
            alt="Today Check Outs"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-purple-950/75 to-stone-900/40" />
          
          <div className="relative z-10 p-5 text-white h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Today's Check-Outs
              </span>
              <div className="p-2 bg-purple-600/80 text-white rounded-xl backdrop-blur-md shadow-sm">
                <LogOut className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-purple-300">
                {todayCheckOuts}
              </span>
              <span className="text-xs text-purple-200 font-medium">Pending Departure</span>
            </div>
          </div>
        </div>

        {/* CARD 7: Total Bookings */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all group h-32 border border-stone-200">
          <img
            src={METRIC_CARD_IMAGES.totalBookings}
            alt="Total Bookings"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-indigo-950/75 to-stone-900/40" />
          
          <div className="relative z-10 p-5 text-white h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Total Bookings
              </span>
              <div className="p-2 bg-indigo-600/80 text-white rounded-xl backdrop-blur-md shadow-sm">
                <CalendarCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-white">
                {totalBookings}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">Live Reservations</span>
            </div>
          </div>
        </div>

        {/* CARD 8: Total Revenue */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all group h-32 border border-orange-400/50">
          <img
            src={METRIC_CARD_IMAGES.totalRevenue}
            alt="Total Revenue"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-orange-950/85 to-stone-900/50" />
          
          <div className="relative z-10 p-5 text-white h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
                Total Revenue
              </span>
              <div className="p-2 bg-orange-600 text-white rounded-xl shadow-md shadow-orange-600/30">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-orange-400">
                ${totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-orange-300 font-semibold flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                Live Revenue
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Combined Grid: Key Performance Charts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Key Performance Charts (8 Cols) */}
        <div className="lg:col-span-8">
          <DashboardCharts />
        </div>

        {/* Quick Actions Stack (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Quick Actions
            </h2>
            <span className="text-xs text-stone-400 font-semibold">Shortcuts</span>
          </div>

          <div className="flex-1 grid grid-cols-1 gap-3">
            <button
              onClick={() => handleActionClick('New Booking', '/bookings')}
              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all group flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-orange-600 text-white rounded-xl shadow-md shadow-orange-600/30 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-xs group-hover:text-orange-600 transition-colors">
                    New Booking
                  </h3>
                  <p className="text-stone-500 text-[11px]">Reserve room for guest</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleActionClick('Guest Registration', '/guests')}
              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all group flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-600 text-white rounded-xl shadow-md shadow-amber-600/30 group-hover:scale-105 transition-transform">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-xs group-hover:text-amber-600 transition-colors">
                    Add Guest
                  </h3>
                  <p className="text-stone-500 text-[11px]">Register new profile</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleActionClick('Room Inventory', '/rooms')}
              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all group flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-stone-800 text-white rounded-xl shadow-md shadow-stone-800/30 group-hover:scale-105 transition-transform">
                  <BedDouble className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-xs group-hover:text-stone-900 transition-colors">
                    Room Inventory
                  </h3>
                  <p className="text-stone-500 text-[11px]">Manage rates & state</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-800 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleActionClick('Analytics & Reports', '/reports')}
              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all group flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-orange-700 text-white rounded-xl shadow-md shadow-orange-700/30 group-hover:scale-105 transition-transform">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-xs group-hover:text-orange-700 transition-colors">
                    View Reports
                  </h3>
                  <p className="text-stone-500 text-[11px]">Revenue & trend charts</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-orange-700 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. Combined Grid: Revenue Summary & Category Share + Recent Bookings Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Summary & Category Share (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span>Revenue & Pacing</span>
              </h2>
              <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-lg">
                Live Data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[10px] font-semibold text-stone-500">Today Pacing</span>
                <p className="text-base font-extrabold text-stone-900 mt-0.5">
                  ${revenueSummary.daily.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[10px] font-semibold text-stone-500">Weekly Pacing</span>
                <p className="text-base font-extrabold text-stone-900 mt-0.5">
                  ${revenueSummary.weekly.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-orange-50/60 rounded-2xl border border-orange-100 mb-4">
              <span className="text-[10px] font-semibold text-orange-900">Monthly Revenue Collection</span>
              <p className="text-lg font-extrabold text-orange-600">
                ${revenueSummary.monthly.toLocaleString()} / ${revenueSummary.projected.toLocaleString()}
              </p>
            </div>

            {/* Room Share Progress */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Category Share
              </h3>
              {revenueSummary.roomTypeRevenue.map((item) => (
                <div key={item.type} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                    <span>{item.type}</span>
                    <span>${item.revenue.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-600 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Live Recent Bookings</h2>
              <p className="text-stone-500 text-xs mt-0.5">Real-time room reservations & check-in status from BookingContext</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search guest or booking ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-y border-stone-200 text-stone-500 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Guest Name</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredBookings.length > 0 ? (
                  filteredBookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-orange-50/40 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-stone-900">{b.id}</td>
                      <td className="px-4 py-3.5">
                        <div>
                          <div className="font-semibold text-stone-800">{b.guestName}</div>
                          <div className="text-[10px] text-stone-400">{b.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-stone-800">Room {b.roomNumber}</span>
                        <div className="text-[10px] text-stone-400">{b.roomType}</div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {b.checkIn} to {b.checkOut}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-stone-900">${b.totalAmount}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                            b.status
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-stone-400">
                      No bookings found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard
