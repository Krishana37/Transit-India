export type TrainClass = {
  code: string;
  fare: number;
  available: number;
  probability: number;
};

export type Train = {
  id: string;
  name: string;
  number: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  depart: string;
  arrive: string;
  duration: string;
  classes: TrainClass[];
  type: "Rajdhani" | "Shatabdi" | "Superfast" | "Express" | "Vande Bharat";
  tags?: string[];
};

export const trains: Train[] = [
  {
    id: "t1",
    name: "Vande Bharat Express",
    number: "22439",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Jaipur Jn",
    toCode: "JP",
    depart: "06:10",
    arrive: "10:35",
    duration: "4h 25m",
    type: "Vande Bharat",
    tags: ["Fastest", "Onboard catering"],
    classes: [
      { code: "CC", fare: 1245, available: 42, probability: 98 },
      { code: "EC", fare: 2340, available: 12, probability: 96 },
    ],
  },
  {
    id: "t2",
    name: "Ajmer Shatabdi",
    number: "12015",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Jaipur Jn",
    toCode: "JP",
    depart: "06:05",
    arrive: "10:40",
    duration: "4h 35m",
    type: "Shatabdi",
    tags: ["AC", "Breakfast incl."],
    classes: [
      { code: "CC", fare: 970, available: 118, probability: 99 },
      { code: "EC", fare: 1815, available: 24, probability: 97 },
    ],
  },
  {
    id: "t3",
    name: "Jaipur Double Decker",
    number: "12985",
    from: "Delhi Sarai Rohilla",
    fromCode: "DEE",
    to: "Jaipur Jn",
    toCode: "JP",
    depart: "05:40",
    arrive: "10:20",
    duration: "4h 40m",
    type: "Superfast",
    tags: ["AC Chair Car"],
    classes: [
      { code: "CC", fare: 720, available: 6, probability: 62 },
    ],
  },
  {
    id: "t4",
    name: "Ashram Express",
    number: "12916",
    from: "Old Delhi",
    fromCode: "DLI",
    to: "Jaipur Jn",
    toCode: "JP",
    depart: "15:20",
    arrive: "20:55",
    duration: "5h 35m",
    type: "Superfast",
    tags: ["Sleeper avail."],
    classes: [
      { code: "SL", fare: 285, available: 0, probability: 34 },
      { code: "3A", fare: 755, available: 3, probability: 48 },
      { code: "2A", fare: 1080, available: 0, probability: 22 },
    ],
  },
];

// ============================================================
// PASSENGERS
// ============================================================

export type Passenger = {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F" | "O";
  berth:
    | "Lower"
    | "Middle"
    | "Upper"
    | "Side Lower"
    | "Side Upper"
    | "No Preference";
  idType: string;
  idNumber: string;
};

export const savedPassengers: Passenger[] = [
  {
    id: "p1",
    name: "Aarav Sharma",
    age: 32,
    gender: "M",
    berth: "Lower",
    idType: "Aadhaar",
    idNumber: "XXXX-1234",
  },
  {
    id: "p2",
    name: "Priya Iyer",
    age: 29,
    gender: "F",
    berth: "Side Lower",
    idType: "Aadhaar",
    idNumber: "XXXX-5581",
  },
  {
    id: "p3",
    name: "Rohan Mehta",
    age: 8,
    gender: "M",
    berth: "No Preference",
    idType: "Birth Cert.",
    idNumber: "BC-2017-9921",
  },
  {
    id: "p4",
    name: "Ananya Rao",
    age: 67,
    gender: "F",
    berth: "Lower",
    idType: "Sr. Citizen",
    idNumber: "SC-1958-7712",
  },
];

// ============================================================
// BUS
// IMPORTANT:
// Bus has its own route data.
// ============================================================

export type Bus = {
  id: string;
  operator: string;
  serviceName: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: string;
  busType: string;
  price: number;
  seatsAvailable: number;
  rating: number;
  tags?: string[];
  amenities: string[];
};

export const buses: Bus[] = [
  {
    id: "bus1",
    operator: "RSRTC",
    serviceName: "Volvo Multi-Axle",
    from: "Delhi",
    to: "Jaipur",
    depart: "22:00",
    arrive: "07:10",
    duration: "9h 10m",
    busType: "Volvo AC Sleeper",
    price: 899,
    seatsAvailable: 14,
    rating: 4.5,
    tags: ["Popular", "AC"],
    amenities: ["AC", "Wi-Fi", "Charging Point", "Water Bottle"],
  },
  {
    id: "bus2",
    operator: "IntrCity SmartBus",
    serviceName: "SmartBus Delhi–Jaipur",
    from: "Delhi",
    to: "Jaipur",
    depart: "21:15",
    arrive: "07:15",
    duration: "10h",
    busType: "AC Seater",
    price: 549,
    seatsAvailable: 28,
    rating: 4.4,
    tags: ["Cheapest"],
    amenities: ["AC", "Charging Point", "Live Tracking"],
  },
  {
    id: "bus3",
    operator: "Zingbus",
    serviceName: "Zing Premium",
    from: "Delhi",
    to: "Jaipur",
    depart: "23:00",
    arrive: "07:30",
    duration: "8h 30m",
    busType: "AC Sleeper",
    price: 799,
    seatsAvailable: 9,
    rating: 4.6,
    tags: ["Premium", "Fast"],
    amenities: ["AC", "Blanket", "Charging Point", "Live Tracking"],
  },
];

// ============================================================
// FLIGHT
// ============================================================

export type Flight = {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  depart: string;
  arrive: string;
  duration: string;
  stops: number;
  price: number;
  seatsAvailable: number;
  cabin: "Economy" | "Premium Economy" | "Business";
  tags?: string[];
};

export const flights: Flight[] = [
  {
    id: "f1",
    airline: "IndiGo",
    flightNumber: "6E 2134",
    from: "New Delhi",
    fromCode: "DEL",
    to: "Mumbai",
    toCode: "BOM",
    depart: "06:30",
    arrive: "08:40",
    duration: "2h 10m",
    stops: 0,
    price: 4899,
    seatsAvailable: 18,
    cabin: "Economy",
    tags: ["Non-stop", "Popular"],
  },
  {
    id: "f2",
    airline: "Air India",
    flightNumber: "AI 864",
    from: "New Delhi",
    fromCode: "DEL",
    to: "Mumbai",
    toCode: "BOM",
    depart: "09:15",
    arrive: "11:25",
    duration: "2h 10m",
    stops: 0,
    price: 5699,
    seatsAvailable: 24,
    cabin: "Economy",
    tags: ["Non-stop"],
  },
  {
    id: "f3",
    airline: "Akasa Air",
    flightNumber: "QP 1407",
    from: "New Delhi",
    fromCode: "DEL",
    to: "Bengaluru",
    toCode: "BLR",
    depart: "18:20",
    arrive: "21:05",
    duration: "2h 45m",
    stops: 0,
    price: 5299,
    seatsAvailable: 12,
    cabin: "Economy",
    tags: ["Best value"],
  },
];

// ============================================================
// FERRY
// IMPORTANT:
// Ferry uses its own ports and routes.
// ============================================================

export type Ferry = {
  id: string;
  operator: string;
  vessel: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: string;
  ferryType: "Passenger Ferry" | "Fast Ferry" | "Cruise Ferry";
  price: number;
  seatsAvailable: number;
  rating: number;
  amenities: string[];
};

export const ferries: Ferry[] = [
  {
    id: "fy1",
    operator: "Makruzz",
    vessel: "Makruzz Gold",
    from: "Port Blair",
    to: "Swaraj Dweep",
    depart: "08:00",
    arrive: "10:15",
    duration: "2h 15m",
    ferryType: "Fast Ferry",
    price: 1850,
    seatsAvailable: 42,
    rating: 4.7,
    amenities: ["Air Conditioning", "Reserved Seating", "Refreshments"],
  },
  {
    id: "fy2",
    operator: "Green Ocean",
    vessel: "Green Ocean 1",
    from: "Port Blair",
    to: "Swaraj Dweep",
    depart: "09:30",
    arrive: "12:00",
    duration: "2h 30m",
    ferryType: "Passenger Ferry",
    price: 1550,
    seatsAvailable: 68,
    rating: 4.5,
    amenities: ["Air Conditioning", "Reserved Seating"],
  },
  {
    id: "fy3",
    operator: "Nautika",
    vessel: "Nautika",
    from: "Swaraj Dweep",
    to: "Shaheed Dweep",
    depart: "13:00",
    arrive: "14:00",
    duration: "1h",
    ferryType: "Fast Ferry",
    price: 950,
    seatsAvailable: 35,
    rating: 4.6,
    amenities: ["Air Conditioning", "Reserved Seating"],
  },
];

// ============================================================
// METRO
// IMPORTANT:
// Metro routes are separate from train routes.
// ============================================================

export type Metro = {
  id: string;
  operator: string;
  line: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: string;
  interchanges: number;
  fare: number;
  frequency: string;
  tags?: string[];
};

export const metros: Metro[] = [
  {
    id: "m1",
    operator: "Delhi Metro",
    line: "Yellow Line",
    from: "Samaypur Badli",
    to: "Huda City Centre",
    depart: "06:00",
    arrive: "07:05",
    duration: "1h 05m",
    interchanges: 0,
    fare: 50,
    frequency: "3–5 min",
    tags: ["Direct", "Popular"],
  },
  {
    id: "m2",
    operator: "Delhi Metro",
    line: "Blue Line",
    from: "Dwarka Sector 21",
    to: "Noida Electronic City",
    depart: "07:10",
    arrive: "08:35",
    duration: "1h 25m",
    interchanges: 0,
    fare: 60,
    frequency: "3–5 min",
    tags: ["Direct"],
  },
  {
    id: "m3",
    operator: "Delhi Metro",
    line: "Airport Express",
    from: "New Delhi",
    to: "IGI Airport",
    depart: "08:00",
    arrive: "08:20",
    duration: "20m",
    interchanges: 0,
    fare: 60,
    frequency: "10 min",
    tags: ["Airport", "Fast"],
  },
  {
    id: "m4",
    operator: "Mumbai Metro",
    line: "Line 1",
    from: "Versova",
    to: "Ghatkopar",
    depart: "08:15",
    arrive: "09:00",
    duration: "45m",
    interchanges: 0,
    fare: 40,
    frequency: "5 min",
    tags: ["Direct"],
  },
];

// ============================================================
// HOTEL
// IMPORTANT:
// Hotel DOES NOT use train-style from/to fields.
// ============================================================

export type Hotel = {
  id: string;
  name: string;
  city: string;
  state?: string;
  area?: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  originalPrice?: number;
  image?: string;
  amenities: string[];
  tags?: string[];
  roomType?: string;
  refundable?: boolean;
  breakfastIncluded?: boolean;
};

export const hotels: Hotel[] = [
  {
    id: "h1",
    name: "The Grand Delhi",
    city: "New Delhi",
    state: "Delhi",
    area: "Connaught Place",
    rating: 4.6,
    reviews: 2841,
    pricePerNight: 4299,
    originalPrice: 5499,
    image: "/hotel-1.jpg",
    amenities: [
      "Free Wi-Fi",
      "Breakfast",
      "Swimming Pool",
      "Parking",
    ],
    tags: ["Popular", "Best value"],
    roomType: "Deluxe Room",
    refundable: true,
    breakfastIncluded: true,
  },
  {
    id: "h2",
    name: "Jaipur Palace Hotel",
    city: "Jaipur",
    state: "Rajasthan",
    area: "MI Road",
    rating: 4.5,
    reviews: 1932,
    pricePerNight: 3199,
    originalPrice: 3999,
    image: "/hotel-2.jpg",
    amenities: [
      "Free Wi-Fi",
      "Breakfast",
      "Restaurant",
      "Parking",
    ],
    tags: ["Highly rated"],
    roomType: "Premium Room",
    refundable: true,
    breakfastIncluded: true,
  },
  {
    id: "h3",
    name: "Mumbai Central Residency",
    city: "Mumbai",
    state: "Maharashtra",
    area: "Mumbai Central",
    rating: 4.3,
    reviews: 1548,
    pricePerNight: 3899,
    image: "/hotel-3.jpg",
    amenities: [
      "Free Wi-Fi",
      "Restaurant",
      "24×7 Reception",
    ],
    tags: ["Near station"],
    roomType: "Executive Room",
    refundable: true,
    breakfastIncluded: false,
  },
  {
    id: "h4",
    name: "Bengaluru Tech Suites",
    city: "Bengaluru",
    state: "Karnataka",
    area: "Whitefield",
    rating: 4.4,
    reviews: 1276,
    pricePerNight: 3599,
    originalPrice: 4299,
    image: "/hotel-4.jpg",
    amenities: [
      "Free Wi-Fi",
      "Breakfast",
      "Gym",
      "Parking",
    ],
    tags: ["Business stay"],
    roomType: "Studio Suite",
    refundable: true,
    breakfastIncluded: true,
  },
];

// ============================================================
// ALTERNATIVES
// ============================================================

export const alternatives = [
  {
    id: "a1",
    kind: "Earlier train",
    title: "Ashram Express — 15:20",
    detail: "Sleeper class · ₹285 · WL 12/GNWL",
    icon: "train",
  },
  {
    id: "a2",
    kind: "Bus",
    title: "RSRTC Volvo A/C · 22:00",
    detail: "9h 10m · ₹899 · 14 seats left",
    icon: "bus",
  },
  {
    id: "a3",
    kind: "Metro + Bus",
    title: "Delhi Metro → ISBT Kashmere Gate → Bus",
    detail: "Total ~10h · ₹640 · Frequent departures",
    icon: "route",
  },
  {
    id: "a4",
    kind: "Cheapest",
    title: "Volvo Non-A/C Seater · 21:15",
    detail: "10h · ₹549 · 28 seats left",
    icon: "coins",
  },
];

// ============================================================
// STATIONS
// ============================================================

export type Station = {
  name: string;
  code: string;
  city: string;
  state: string;
};

export const stations: Station[] = [
  { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
  { name: "Old Delhi", code: "DLI", city: "Delhi", state: "Delhi" },
  {
    name: "Hazrat Nizamuddin",
    code: "NZM",
    city: "Delhi",
    state: "Delhi",
  },
  {
    name: "Delhi Sarai Rohilla",
    code: "DEE",
    city: "Delhi",
    state: "Delhi",
  },
  {
    name: "Anand Vihar Terminal",
    code: "ANVT",
    city: "Delhi",
    state: "Delhi",
  },

  {
    name: "Mumbai Central",
    code: "BCT",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Chhatrapati Shivaji Terminus",
    code: "CSMT",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Lokmanya Tilak Terminus",
    code: "LTT",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Bandra Terminus",
    code: "BDTS",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Dadar",
    code: "DR",
    city: "Mumbai",
    state: "Maharashtra",
  },

  {
    name: "Pune Junction",
    code: "PUNE",
    city: "Pune",
    state: "Maharashtra",
  },
  {
    name: "Nagpur Junction",
    code: "NGP",
    city: "Nagpur",
    state: "Maharashtra",
  },
  {
    name: "Nashik Road",
    code: "NK",
    city: "Nashik",
    state: "Maharashtra",
  },
  {
    name: "Solapur Junction",
    code: "SUR",
    city: "Solapur",
    state: "Maharashtra",
  },

  {
    name: "KSR Bengaluru City",
    code: "SBC",
    city: "Bengaluru",
    state: "Karnataka",
  },
  {
    name: "Yesvantpur Junction",
    code: "YPR",
    city: "Bengaluru",
    state: "Karnataka",
  },
  {
    name: "Mysuru Junction",
    code: "MYS",
    city: "Mysuru",
    state: "Karnataka",
  },

  {
    name: "MGR Chennai Central",
    code: "MAS",
    city: "Chennai",
    state: "Tamil Nadu",
  },
  {
    name: "Chennai Egmore",
    code: "MS",
    city: "Chennai",
    state: "Tamil Nadu",
  },
  {
    name: "Coimbatore Junction",
    code: "CBE",
    city: "Coimbatore",
    state: "Tamil Nadu",
  },

  {
    name: "Howrah Junction",
    code: "HWH",
    city: "Kolkata",
    state: "West Bengal",
  },
  {
    name: "Sealdah",
    code: "SDAH",
    city: "Kolkata",
    state: "West Bengal",
  },

  {
    name: "Secunderabad Junction",
    code: "SC",
    city: "Hyderabad",
    state: "Telangana",
  },
  {
    name: "Hyderabad Deccan",
    code: "HYB",
    city: "Hyderabad",
    state: "Telangana",
  },

  {
    name: "Ahmedabad Junction",
    code: "ADI",
    city: "Ahmedabad",
    state: "Gujarat",
  },
  {
    name: "Surat",
    code: "ST",
    city: "Surat",
    state: "Gujarat",
  },
  {
    name: "Vadodara Junction",
    code: "BRC",
    city: "Vadodara",
    state: "Gujarat",
  },

  {
    name: "Jaipur Junction",
    code: "JP",
    city: "Jaipur",
    state: "Rajasthan",
  },
  {
    name: "Jodhpur Junction",
    code: "JU",
    city: "Jodhpur",
    state: "Rajasthan",
  },
  {
    name: "Udaipur City",
    code: "UDZ",
    city: "Udaipur",
    state: "Rajasthan",
  },
  {
    name: "Ajmer Junction",
    code: "AII",
    city: "Ajmer",
    state: "Rajasthan",
  },

  {
    name: "Lucknow NR",
    code: "LKO",
    city: "Lucknow",
    state: "Uttar Pradesh",
  },
  {
    name: "Kanpur Central",
    code: "CNB",
    city: "Kanpur",
    state: "Uttar Pradesh",
  },
  {
    name: "Varanasi Junction",
    code: "BSB",
    city: "Varanasi",
    state: "Uttar Pradesh",
  },
  {
    name: "Agra Cantt",
    code: "AGC",
    city: "Agra",
    state: "Uttar Pradesh",
  },

  {
    name: "Patna Junction",
    code: "PNBE",
    city: "Patna",
    state: "Bihar",
  },
  {
    name: "Gaya Junction",
    code: "GAYA",
    city: "Gaya",
    state: "Bihar",
  },

  {
    name: "Bhubaneswar",
    code: "BBS",
    city: "Bhubaneswar",
    state: "Odisha",
  },
  {
    name: "Puri",
    code: "PURI",
    city: "Puri",
    state: "Odisha",
  },

  {
    name: "Bhopal Junction",
    code: "BPL",
    city: "Bhopal",
    state: "Madhya Pradesh",
  },
  {
    name: "Indore Junction",
    code: "INDB",
    city: "Indore",
    state: "Madhya Pradesh",
  },

  {
    name: "Chandigarh",
    code: "CDG",
    city: "Chandigarh",
    state: "Chandigarh",
  },
  {
    name: "Amritsar Junction",
    code: "ASR",
    city: "Amritsar",
    state: "Punjab",
  },

  {
    name: "Ambala Cantt",
    code: "UMB",
    city: "Ambala",
    state: "Haryana",
  },
  {
    name: "Gurugram",
    code: "GGN",
    city: "Gurugram",
    state: "Haryana",
  },
  {
    name: "Faridabad",
    code: "FDB",
    city: "Faridabad",
    state: "Haryana",
  },

  {
    name: "Dehradun",
    code: "DDN",
    city: "Dehradun",
    state: "Uttarakhand",
  },
  {
    name: "Haridwar Junction",
    code: "HW",
    city: "Haridwar",
    state: "Uttarakhand",
  },

  {
    name: "Jammu Tawi",
    code: "JAT",
    city: "Jammu",
    state: "J&K",
  },

  {
    name: "Guwahati",
    code: "GHY",
    city: "Guwahati",
    state: "Assam",
  },
  {
    name: "Dibrugarh",
    code: "DBRG",
    city: "Dibrugarh",
    state: "Assam",
  },

  {
    name: "Ranchi Junction",
    code: "RNC",
    city: "Ranchi",
    state: "Jharkhand",
  },
  {
    name: "Dhanbad Junction",
    code: "DHN",
    city: "Dhanbad",
    state: "Jharkhand",
  },

  {
    name: "Raipur Junction",
    code: "R",
    city: "Raipur",
    state: "Chhattisgarh",
  },
  {
    name: "Bilaspur Junction",
    code: "BSP",
    city: "Bilaspur",
    state: "Chhattisgarh",
  },

  {
    name: "Madgaon",
    code: "MAO",
    city: "Madgaon",
    state: "Goa",
  },
  {
    name: "Vasco Da Gama",
    code: "VSG",
    city: "Vasco",
    state: "Goa",
  },
];

// ============================================================
// SEARCH SUGGESTIONS
// ============================================================

export const suggestions = [
  "Cheapest AC train from Delhi to Jaipur tomorrow morning",
  "Vande Bharat from Mumbai to Ahmedabad this Friday",
  "Overnight sleeper from Bengaluru to Chennai",
  "Fastest train Delhi → Lucknow under ₹1500",
  "Tatkal 3A from Patna to Howrah for Monday",
  "Cheapest bus from Delhi to Jaipur",
  "Non-stop flight from Delhi to Mumbai",
  "Fastest metro route in Delhi",
  "Ferry from Port Blair to Swaraj Dweep",
  "Best hotel in Jaipur",
];

// ============================================================
// TRAIN CLASSES
// ============================================================

export const travelClasses = [
  { code: "ALL", label: "All classes" },
  { code: "SL", label: "Sleeper" },
  { code: "3A", label: "AC 3-Tier" },
  { code: "2A", label: "AC 2-Tier" },
  { code: "1A", label: "AC First" },
  { code: "CC", label: "AC Chair" },
  { code: "EC", label: "Exec. Chair" },
];

// ============================================================
// TIME SLOTS
// ============================================================

export const timeSlots = [
  {
    id: "early",
    label: "Early",
    range: "00:00 – 06:00",
  },
  {
    id: "morning",
    label: "Morning",
    range: "06:00 – 12:00",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    range: "12:00 – 18:00",
  },
  {
    id: "night",
    label: "Night",
    range: "18:00 – 24:00",
  },
];
