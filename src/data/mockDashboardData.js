export const dashboardStats = {
  totalRooms: 48,
  availableRooms: 18,
  occupiedRooms: 30,
  totalGuests: 124,
  todayCheckIns: 8,
  todayCheckOuts: 5,
  totalBookings: 156,
  totalRevenue: 84900,
  occupancyRate: 62.5
}

export const revenueSummary = {
  daily: 3250,
  weekly: 22400,
  monthly: 84900,
  projected: 110000,
  roomTypeRevenue: [
    { type: 'Deluxe Suite', revenue: 38400, percentage: 45 },
    { type: 'Executive Room', revenue: 25500, percentage: 30 },
    { type: 'Standard Room', revenue: 12700, percentage: 15 },
    { type: 'Presidential Suite', revenue: 8300, percentage: 10 }
  ]
}

export const recentBookings = [
  {
    id: 'BK-1089',
    guestName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    roomNumber: '304',
    roomType: 'Deluxe Suite',
    checkIn: '2026-09-22',
    checkOut: '2026-09-25',
    amount: 450,
    status: 'Checked-In'
  },
  {
    id: 'BK-1088',
    guestName: 'Michael Chang',
    email: 'm.chang@example.com',
    roomNumber: '210',
    roomType: 'Executive Room',
    checkIn: '2026-09-22',
    checkOut: '2026-09-24',
    amount: 320,
    status: 'Checked-In'
  },
  {
    id: 'BK-1087',
    guestName: 'Emma Watson',
    email: 'emma.w@example.com',
    roomNumber: '105',
    roomType: 'Standard Room',
    checkIn: '2026-09-23',
    checkOut: '2026-09-26',
    amount: 280,
    status: 'Confirmed'
  },
  {
    id: 'BK-1086',
    guestName: 'Robert Downey',
    email: 'rdowney@example.com',
    roomNumber: '401',
    roomType: 'Presidential Suite',
    checkIn: '2026-09-21',
    checkOut: '2026-09-22',
    amount: 1200,
    status: 'Checked-Out'
  },
  {
    id: 'BK-1085',
    guestName: 'David Miller',
    email: 'dmiller@example.com',
    roomNumber: '302',
    roomType: 'Deluxe Suite',
    checkIn: '2026-09-24',
    checkOut: '2026-09-28',
    amount: 600,
    status: 'Pending'
  },
  {
    id: 'BK-1084',
    guestName: 'Olivia Taylor',
    email: 'olivia.t@example.com',
    roomNumber: '208',
    roomType: 'Executive Room',
    checkIn: '2026-09-20',
    checkOut: '2026-09-22',
    amount: 350,
    status: 'Checked-Out'
  }
]

export const quickActions = [
  {
    title: 'New Booking',
    description: 'Reserve a room for a guest',
    icon: 'CalendarCheck',
    link: '/bookings',
    color: 'bg-orange-600 hover:bg-orange-500'
  },
  {
    title: 'Add Guest',
    description: 'Register a new guest profile',
    icon: 'UserPlus',
    link: '/guests',
    color: 'bg-amber-600 hover:bg-amber-500'
  },
  {
    title: 'Room Inventory',
    description: 'Manage room availability & rates',
    icon: 'BedDouble',
    link: '/rooms',
    color: 'bg-stone-800 hover:bg-stone-700'
  },
  {
    title: 'View Analytics',
    description: 'Detailed revenue & occupancy reports',
    icon: 'BarChart3',
    link: '/reports',
    color: 'bg-orange-700 hover:bg-orange-600'
  }
]
