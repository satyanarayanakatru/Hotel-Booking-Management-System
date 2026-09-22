import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const USERS_STORAGE_KEY = 'hotel_auth_users'
const CURRENT_USER_STORAGE_KEY = 'hotel_current_user'

// Pre-seeded demo user
const INITIAL_DEMO_USERS = [
  {
    id: 'user_demo_1',
    fullName: 'Demo Admin',
    email: 'admin@hotel.com',
    password: 'Password123!',
    role: 'Admin',
    createdAt: new Date().toISOString()
  }
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize users database in localStorage if not exists
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
    if (!storedUsers) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS))
    }

    // Load active session user if present
    const storedCurrentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
    if (storedCurrentUser) {
      try {
        setUser(JSON.parse(storedCurrentUser))
      } catch (err) {
        console.error('Failed to parse current user session:', err)
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const getUsers = () => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : INITIAL_DEMO_USERS
    } catch {
      return INITIAL_DEMO_USERS
    }
  }

  const login = (email, password) => {
    const users = getUsers()
    const targetUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (targetUser) {
      const sessionUser = {
        id: targetUser.id,
        fullName: targetUser.fullName,
        email: targetUser.email,
        role: targetUser.role || 'Guest',
        createdAt: targetUser.createdAt
      }
      setUser(sessionUser)
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sessionUser))
      return { success: true, user: sessionUser }
    } else {
      return { success: false, message: 'Invalid email address or password.' }
    }
  }

  const register = (userData) => {
    const users = getUsers()
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase())

    if (existing) {
      return { success: false, message: 'An account with this email already exists.' }
    }

    const newUser = {
      id: `user_${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: 'Guest',
      createdAt: new Date().toISOString()
    }

    const updatedUsers = [...users, newUser]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))

    // Automatically log in newly registered user
    const sessionUser = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    }
    setUser(sessionUser)
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sessionUser))

    return { success: true, user: sessionUser }
  }

  const forgotPassword = (email) => {
    const users = getUsers()
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (existing) {
      return {
        success: true,
        message: `Password reset instructions have been sent to ${email}.`
      }
    } else {
      return {
        success: false,
        message: 'No account found registered with this email address.'
      }
    }
  }

  const updateProfile = (updatedData) => {
    if (!user) return { success: false, message: 'No active session' }

    const users = getUsers()
    const userIndex = users.findIndex((u) => u.id === user.id)

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        fullName: updatedData.fullName || users[userIndex].fullName,
        ...(updatedData.password ? { password: updatedData.password } : {})
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    }

    const newSessionUser = {
      ...user,
      fullName: updatedData.fullName || user.fullName
    }
    setUser(newSessionUser)
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newSessionUser))

    return { success: true, user: newSessionUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        forgotPassword,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
