import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { Menu, User, LogOut, Bell } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info('Logged out successfully.')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center space-x-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-stone-800 tracking-tight">
              Hotel Management Dashboard
            </h1>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Notifications Icon (UI Only) */}
            <button className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-orange-600 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-5 w-px bg-stone-200" />

            {/* Profile Avatar / Quick Link */}
            {user && (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-stone-700 hover:text-orange-600 font-medium text-xs sm:text-sm transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline font-semibold">{user.fullName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
