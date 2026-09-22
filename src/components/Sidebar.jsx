import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import {
  Hotel,
  LayoutDashboard,
  User,
  LogOut,
  BedDouble,
  Users,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  History,
  BarChart3,
  X
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info('Logged out successfully.')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Room Management', path: '/rooms', icon: BedDouble },
    { name: 'Guest Management', path: '/guests', icon: Users },
    { name: 'Room Booking', path: '/bookings', icon: CalendarCheck },
    { name: 'Check-In / Out', path: '/check-in-out', icon: ClipboardList },
    { name: 'Payments & Invoice', path: '/payments', icon: CreditCard },
    { name: 'Booking History', path: '/history', icon: History },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'My Profile', path: '/profile', icon: User } // Put last as requested
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-stone-900 text-stone-100 z-50 flex flex-col justify-between border-r border-stone-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-stone-800">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="p-2 bg-orange-600 rounded-xl group-hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/30">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-orange-400 via-amber-200 to-white bg-clip-text text-transparent block leading-tight">
                  GrandVista
                </span>
                <span className="text-[10px] text-orange-400/90 tracking-wider uppercase font-semibold block">
                  Hotel Admin
                </span>
              </div>
            </Link>

            {/* Close Button for Mobile */}
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            <div className="px-3 pb-2 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Main Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const activePath = isActive(item.path)

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activePath
                      ? 'bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/30'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Profile Footer & Logout */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60 space-y-3">
          {user && (
            <div className="flex items-center space-x-3 p-2 bg-stone-800/80 rounded-xl border border-stone-700/60">
              <div className="h-9 w-9 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-md shadow-orange-600/20">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-bold text-stone-100 truncate">{user.fullName}</div>
                <div className="text-[10px] text-stone-400 truncate">{user.email}</div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white rounded-xl text-xs font-semibold transition-all border border-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
