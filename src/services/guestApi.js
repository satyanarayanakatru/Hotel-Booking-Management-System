import axios from 'axios'

const LOCAL_STORAGE_KEY = 'hotel_guests_data'
const API_URL = 'https://dummyjson.com/users?limit=12'

export const fetchGuestsFromApi = async () => {
  // ALWAYS execute live HTTP API call so Network tab displays GET call on page load/refresh!
  try {
    const response = await axios.get(API_URL)
    const apiUsers = response.data.users || []
    const statusList = ['Active', 'Checked-In', 'Checked-Out', 'Active', 'Checked-In']

    const fetchedGuests = apiUsers.map((user, index) => {
      const addressStr = user.address
        ? `${user.address.address}, ${user.address.city}, ${user.address.state}`
        : '100 Hotel Blvd, New York, NY'

      return {
        id: `guest_${user.id}`,
        numericId: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        mobileNumber: user.phone || '+1 (555) 000-1234',
        address: addressStr,
        idProofNumber: user.ssn ? `ID-SSN-${user.ssn}` : `ID-PASS-${user.id * 8923}`,
        nationality: user.address?.country || 'United States',
        status: statusList[index % statusList.length],
        joinedDate: user.birthDate || '2025-10-15',
        avatar: user.image || `https://dummyjson.com/icon/${user.username}/128`
      }
    })

    // Preserve any manually added guest records from localStorage if present
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    let localCreatedGuests = []
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Keep guests created locally (e.g. timestamp-based IDs or custom entries)
        localCreatedGuests = parsed.filter(
          (g) => !g.id.startsWith('guest_') || Number(g.id.replace('guest_', '')) > 200
        )
      } catch {
        console.warn('Failed to parse cached guests')
      }
    }

    const mergedGuests = [...localCreatedGuests, ...fetchedGuests]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedGuests))
    return mergedGuests
  } catch (error) {
    console.error('Failed to fetch from DummyJSON Users API:', error)
    return getStoredGuests()
  }
}

export const getStoredGuests = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    const isLegacyMockData = parsed.some((g) => g.fullName === 'Sarah Jenkins' || g.id === 'guest_101')
    return isLegacyMockData ? [] : parsed
  } catch {
    return []
  }
}

export const saveStoredGuests = (guests) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guests))
}

export const updateGuestStatusById = (guestId, newStatus) => {
  const guests = getStoredGuests()
  const index = guests.findIndex((g) => g.id === guestId)
  if (index !== -1) {
    guests[index].status = newStatus
    saveStoredGuests(guests)
    return guests[index]
  }
  return null
}

// Live POST call to DummyJSON API
export const createGuestService = async (guestData) => {
  let apiResponseData = null
  try {
    const response = await axios.post('https://dummyjson.com/users/add', {
      firstName: guestData.fullName.split(' ')[0] || guestData.fullName,
      lastName: guestData.fullName.split(' ').slice(1).join(' ') || 'Guest',
      email: guestData.email,
      phone: guestData.mobileNumber
    })
    apiResponseData = response.data
  } catch (error) {
    console.warn('API POST call warning:', error)
  }

  const guests = getStoredGuests()
  const generatedId = apiResponseData?.id ? `guest_${apiResponseData.id}` : `guest_${Date.now()}`

  const newGuest = {
    id: generatedId,
    numericId: apiResponseData?.id || Date.now(),
    fullName: guestData.fullName,
    email: guestData.email,
    mobileNumber: guestData.mobileNumber,
    address: guestData.address,
    idProofNumber: guestData.idProofNumber,
    nationality: guestData.nationality,
    status: guestData.status || 'Active',
    joinedDate: new Date().toISOString().split('T')[0],
    avatar:
      guestData.avatar ||
      `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`
  }

  const updated = [newGuest, ...guests]
  saveStoredGuests(updated)
  return newGuest
}

// Live PUT call to DummyJSON API
export const updateGuestService = async (id, guestData) => {
  const numericId = String(id).replace('guest_', '')
  try {
    await axios.put(`https://dummyjson.com/users/${numericId || 1}`, {
      firstName: guestData.fullName.split(' ')[0] || guestData.fullName,
      lastName: guestData.fullName.split(' ').slice(1).join(' ') || 'Guest',
      email: guestData.email,
      phone: guestData.mobileNumber
    })
  } catch (error) {
    console.warn('API PUT call warning:', error)
  }

  const guests = getStoredGuests()
  const index = guests.findIndex((g) => g.id === id)

  if (index !== -1) {
    guests[index] = {
      ...guests[index],
      fullName: guestData.fullName,
      email: guestData.email,
      mobileNumber: guestData.mobileNumber,
      address: guestData.address,
      idProofNumber: guestData.idProofNumber,
      nationality: guestData.nationality,
      status: guestData.status || guests[index].status,
      avatar: guestData.avatar || guests[index].avatar
    }
    saveStoredGuests(guests)
    return guests[index]
  }
  return null
}

// Live DELETE call to DummyJSON API
export const deleteGuestService = async (id) => {
  const numericId = String(id).replace('guest_', '')
  try {
    await axios.delete(`https://dummyjson.com/users/${numericId || 1}`)
  } catch (error) {
    console.warn('API DELETE call warning:', error)
  }

  const guests = getStoredGuests()
  const filtered = guests.filter((g) => g.id !== id)
  saveStoredGuests(filtered)
  return true
}
