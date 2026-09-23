import axios from 'axios'

const LOCAL_STORAGE_KEY = 'hotel_rooms_data'
const API_URL = 'https://dummyjson.com/products?limit=12'

const INITIAL_ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
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
  // Check if rooms already exist in localStorage
  const storedRooms = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (storedRooms) {
    try {
      return JSON.parse(storedRooms)
    } catch {
      console.warn('Failed to parse cached rooms, re-fetching from API...')
    }
  }

  try {
    // Fetch Third-Party API data (DummyJSON)
    const response = await axios.get(API_URL)
    const products = response.data.products || []

    // Enrich API data into hotel room schema
    const enrichedRooms = products.map((prod, index) => {
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
        capacity: (index % 3) + 2, // 2, 3, 4 guests
        floorNumber: floor,
        availability: status,
        amenities: amenities,
        image: img,
        description: prod.description || 'Spacious luxury room with modern decor and premium amenities.'
      }
    })

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(enrichedRooms))
    return enrichedRooms
  } catch (error) {
    console.error('Third-Party API Error:', error)
    // Fallback seed rooms if API is unreachable
    const fallbackRooms = Array.from({ length: 8 }, (_, index) => ({
      id: `room_fallback_${index + 1}`,
      roomNumber: `10${index + 1}`,
      roomType: ROOM_TYPES[index % ROOM_TYPES.length],
      pricePerNight: 150 + index * 45,
      capacity: (index % 3) + 2,
      floorNumber: Math.floor(index / 2) + 1,
      availability: AVAILABILITY_STATUSES[index % 3],
      amenities: AMENITIES_LIST[index % AMENITIES_LIST.length],
      image: INITIAL_ROOM_IMAGES[index % INITIAL_ROOM_IMAGES.length],
      description: 'Elegant hotel room designed for relaxation and comfort.'
    }))

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackRooms))
    return fallbackRooms
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
    image: roomData.image || INITIAL_ROOM_IMAGES[0],
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
