import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchGuestsFromApi,
  getStoredGuests,
  createGuestService,
  updateGuestService,
  deleteGuestService
} from '../services/guestApi'

const GuestContext = createContext(null)

export const GuestProvider = ({ children }) => {
  const [guests, setGuests] = useState([])
  const [loadingGuests, setLoadingGuests] = useState(true)

  const refreshGuests = useCallback(async (force = false) => {
    setLoadingGuests(true)
    try {
      const data = await fetchGuestsFromApi(force)
      setGuests(data)
    } catch (err) {
      console.error('Failed to load guests in GuestContext:', err)
    } finally {
      setLoadingGuests(false)
    }
  }, [])

  useEffect(() => {
    refreshGuests()
  }, [refreshGuests])

  const createGuest = async (guestData) => {
    const newGuest = await createGuestService(guestData)
    setGuests((prev) => [newGuest, ...prev])
    return newGuest
  }

  const updateGuest = async (id, guestData) => {
    const updated = await updateGuestService(id, guestData)
    if (updated) {
      setGuests((prev) => prev.map((g) => (g.id === id ? updated : g)))
    }
    return updated
  }

  const deleteGuest = async (id) => {
    const success = await deleteGuestService(id)
    if (success) {
      setGuests((prev) => prev.filter((g) => g.id !== id))
    }
    return success
  }

  return (
    <GuestContext.Provider
      value={{
        guests,
        loadingGuests,
        refreshGuests,
        createGuest,
        updateGuest,
        deleteGuest
      }}
    >
      {children}
    </GuestContext.Provider>
  )
}

export const useGuests = () => {
  const context = useContext(GuestContext)
  if (!context) {
    throw new Error('useGuests must be used within a GuestProvider')
  }
  return context
}
