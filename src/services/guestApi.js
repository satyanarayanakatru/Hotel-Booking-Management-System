const LOCAL_STORAGE_KEY = 'hotel_guests_data'

const INITIAL_GUEST_PROFILES = [
  {
    id: 'guest_101',
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    mobileNumber: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, IL',
    idProofNumber: 'ID-PASSPORT-98214',
    nationality: 'United States',
    status: 'Checked-In',
    joinedDate: '2025-11-12',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'guest_102',
    fullName: 'Michael Chang',
    email: 'm.chang@example.com',
    mobileNumber: '+1 (555) 876-5432',
    address: '1204 Sunset Blvd, Los Angeles, CA',
    idProofNumber: 'ID-DL-876123',
    nationality: 'Canada',
    status: 'Checked-In',
    joinedDate: '2026-01-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'guest_103',
    fullName: 'Emma Watson',
    email: 'emma.w@example.com',
    mobileNumber: '+44 20 7946 0912',
    address: '42 Baker Street, London, UK',
    idProofNumber: 'ID-UK-PASSPORT-4412',
    nationality: 'United Kingdom',
    status: 'Active',
    joinedDate: '2026-03-04',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'guest_104',
    fullName: 'Robert Downey',
    email: 'rdowney@example.com',
    mobileNumber: '+1 (555) 345-6789',
    address: '10880 Malibu Point, Malibu, CA',
    idProofNumber: 'ID-SSN-10880',
    nationality: 'United States',
    status: 'Checked-Out',
    joinedDate: '2025-08-20',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'guest_105',
    fullName: 'David Miller',
    email: 'dmiller@example.com',
    mobileNumber: '+61 2 9374 4000',
    address: '88 George Street, Sydney, Australia',
    idProofNumber: 'ID-AUS-88123',
    nationality: 'Australia',
    status: 'Active',
    joinedDate: '2026-04-10',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'guest_106',
    fullName: 'Olivia Taylor',
    email: 'olivia.t@example.com',
    mobileNumber: '+49 30 123456',
    address: 'Friedrichstraße 12, Berlin, Germany',
    idProofNumber: 'ID-GER-PASSPORT-90',
    nationality: 'Germany',
    status: 'Checked-Out',
    joinedDate: '2026-02-18',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'guest_107',
    fullName: 'Carlos Rodriguez',
    email: 'carlos.r@example.com',
    mobileNumber: '+34 91 123 4567',
    address: 'Gran Vía 28, Madrid, Spain',
    idProofNumber: 'ID-ESP-987654',
    nationality: 'Spain',
    status: 'Active',
    joinedDate: '2026-05-02',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'guest_108',
    fullName: 'Aisha Patel',
    email: 'aisha.p@example.com',
    mobileNumber: '+91 98765 43210',
    address: 'MG Road, Bengaluru, Karnataka, India',
    idProofNumber: 'ID-IND-AADHAR-4321',
    nationality: 'India',
    status: 'Active',
    joinedDate: '2026-06-14',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  }
]

export const fetchGuestsFromApi = async () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      console.warn('Failed to parse stored guests, re-initializing...')
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_GUEST_PROFILES))
  return INITIAL_GUEST_PROFILES
}

export const getStoredGuests = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : INITIAL_GUEST_PROFILES
  } catch {
    return INITIAL_GUEST_PROFILES
  }
}

export const saveStoredGuests = (guests) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guests))
}

export const createGuestService = (guestData) => {
  const guests = getStoredGuests()
  const newGuest = {
    id: `guest_${Date.now()}`,
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

export const updateGuestService = (id, guestData) => {
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

export const deleteGuestService = (id) => {
  const guests = getStoredGuests()
  const filtered = guests.filter((g) => g.id !== id)
  saveStoredGuests(filtered)
  return true
}
