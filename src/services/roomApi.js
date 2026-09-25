import axios from 'axios'

const LOCAL_STORAGE_KEY = 'hotel_rooms_data'
const API_URL = 'https://dummyjson.com/products?limit=12'

const INITIAL_ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540518614846-7ede433c5173?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80'
]

const ROOM_TYPES = ['Deluxe Suite', 'Executive Room', 'Standard Room', 'Presidential Suite']
const AVAILABILITY_STATUSES = ['Available', 'Occupied', 'Maintenance']
const AMENITIES_LIST = [
  ['High-Speed Wi-Fi', 'Ocean View', 'King Bed', 'Mini Bar', 'Air Conditioning'],
  ['Smart TV', 'Balcony', 'City View', 'Breakfast Included', 'Work Desk'],
  ['Jacuzzi Bath', 'Room Service', 'Espresso Machine', 'Safe', 'Soundproof'],
  ['Pool View', 'Queen Bed', 'Free Parking', 'Spa Bathrobe', 'Lounge Area']
]

export const fetchRoomsFromApi = async () => {
  // ALWAYS execute live HTTP API call so Network tab displays GET call on page load/refresh!
  try {
    const response = await axios.get(API_URL)
    const products = response.data.products || []

    const fetchedRooms = products.map((prod, index) => {
      const roomNum = `${(index % 4) + 1}0${(index % 9) + 1}`
      const type = ROOM_TYPES[index % ROOM_TYPES.length]
      const price = Math.round(prod.price * 2.5) + 100
      const floor = Math.floor(index / 3) + 1
      const status = AVAILABILITY_STATUSES[index % 3]
      const img = INITIAL_ROOM_IMAGES[index % INITIAL_ROOM_IMAGES.length]
      const amenities = AMENITIES_LIST[index % AMENITIES_LIST.length]

      return {
        id: `room_${prod.id}_${index}`,
        roomNumber: roomNum,
        roomType: type,
        pricePerNight: price,
        capacity: (index % 3) + 2,
        floorNumber: floor,
        availability: status,
        amenities: amenities,
        image: img,
        description: prod.description || 'Spacious luxury room with modern decor and premium amenities.'
      }
    })

    // Preserve any manually created rooms from localStorage if present
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    let localCreatedRooms = []
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        localCreatedRooms = parsed.filter(
          (r) => !r.id.startsWith('room_') || Number(r.id.replace('room_', '')) > 1000
        )
      } catch {
        console.warn('Failed to parse cached rooms')
      }
    }

    const mergedRooms = [...localCreatedRooms, ...fetchedRooms]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedRooms))
    return mergedRooms
  } catch (error) {
    console.error('Third-Party API Error:', error)
    return getStoredRooms()
  }
}

export const getStoredRooms = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const saveStoredRooms = (rooms) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms))
}

export const updateRoomAvailabilityByNumber = (roomNumber, newAvailability) => {
  const rooms = getStoredRooms()
  const index = rooms.findIndex((r) => String(r.roomNumber) === String(roomNumber))
  if (index !== -1) {
    rooms[index].availability = newAvailability
    saveStoredRooms(rooms)
    return rooms[index]
  }
  return null
}

export const createRoomService = (roomData) => {
  const rooms = getStoredRooms()
  const newRoom = {
    id: `room_${Date.now()}`,
    roomNumber: roomData.roomNumber,
    roomType: roomData.roomType,
    pricePerNight: Number(roomData.pricePerNight),
    capacity: Number(roomData.capacity),
    floorNumber: Number(roomData.floorNumber),
    availability: roomData.availability,
    amenities: Array.isArray(roomData.amenities)
      ? roomData.amenities
      : roomData.amenities.split(',').map((a) => a.trim()),
    image: roomData.image || INITIAL_ROOM_IMAGES[rooms.length % INITIAL_ROOM_IMAGES.length],
    description: roomData.description || 'Modern suite with premium furnishings.'
  }

  const updated = [newRoom, ...rooms]
  saveStoredRooms(updated)
  return newRoom
}

export const updateRoomService = (id, roomData) => {
  const rooms = getStoredRooms()
  const index = rooms.findIndex((r) => r.id === id)

  if (index !== -1) {
    rooms[index] = {
      ...rooms[index],
      roomNumber: roomData.roomNumber,
      roomType: roomData.roomType,
      pricePerNight: Number(roomData.pricePerNight),
      capacity: Number(roomData.capacity),
      floorNumber: Number(roomData.floorNumber),
      availability: roomData.availability,
      amenities: Array.isArray(roomData.amenities)
        ? roomData.amenities
        : roomData.amenities.split(',').map((a) => a.trim()),
      image: roomData.image || rooms[index].image,
      description: roomData.description || rooms[index].description
    }
    saveStoredRooms(rooms)
    return rooms[index]
  }
  return null
}

export const deleteRoomService = (id) => {
  const rooms = getStoredRooms()
  const filtered = rooms.filter((r) => r.id !== id)
  saveStoredRooms(filtered)
  return true
}
