import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchRoomsFromApi,
  getStoredRooms,
  createRoomService,
  updateRoomService,
  deleteRoomService
} from '../services/roomApi'

const RoomContext = createContext(null)

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(true)

  const refreshRooms = useCallback(async (force = false) => {
    setLoadingRooms(true)
    try {
      const data = await fetchRoomsFromApi(force)
      setRooms(data)
    } catch (err) {
      console.error('Failed to load rooms in RoomContext:', err)
    } finally {
      setLoadingRooms(false)
    }
  }, [])

  useEffect(() => {
    refreshRooms()
  }, [refreshRooms])

  const createRoom = async (roomData) => {
    const newRoom = createRoomService(roomData)
    setRooms((prev) => [newRoom, ...prev])
    return newRoom
  }

  const updateRoom = async (id, roomData) => {
    const updated = updateRoomService(id, roomData)
    if (updated) {
      setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)))
    }
    return updated
  }

  const deleteRoom = async (id) => {
    const success = deleteRoomService(id)
    if (success) {
      setRooms((prev) => prev.filter((r) => r.id !== id))
    }
    return success
  }

  return (
    <RoomContext.Provider
      value={{
        rooms,
        loadingRooms,
        refreshRooms,
        createRoom,
        updateRoom,
        deleteRoom
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export const useRooms = () => {
  const context = useContext(RoomContext)
  if (!context) {
    throw new Error('useRooms must be used within a RoomProvider')
  }
  return context
}
