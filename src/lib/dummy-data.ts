// src/lib/dummy-data.ts

// ============================================================
// TRANSIT INDIA — DUMMY / DEMO DATA ENGINE
// ============================================================

export type Station = {
  name: string;
  code: string;
  city: string;
  state: string;
};

export const stations: Station[] = [
  // ----------------------------------------------------------
  // DELHI / NCR
  // ----------------------------------------------------------
  { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
  { name: "Hazrat Nizamuddin", code: "NZM", city: "Delhi", state: "Delhi" },
  { name: "Anand Vihar Terminal", code: "ANVT", city: "Delhi", state: "Delhi" },

  // ----------------------------------------------------------
  // RAJASTHAN
  // ----------------------------------------------------------
  { name: "Jaipur Junction", code: "JP", city: "Jaipur", state: "Rajasthan" },
  { name: "Jodhpur Junction", code: "JU", city: "Jodhpur", state: "Rajasthan" },
  { name: "Ajmer Junction", code: "AII", city: "Ajmer", state: "Rajasthan" },
  { name: "Kota Junction", code: "KOTA", city: "Kota", state: "Rajasthan" },
  { name: "Udaipur City", code: "UDZ", city: "Udaipur", state: "Rajasthan" },

  // ----------------------------------------------------------
  // MAHARASHTRA
  // ----------------------------------------------------------
  { name: "Mumbai Central", code: "BCT", city: "Mumbai", state: "Maharashtra" },
  { name: "Chhatrapati Shivaji Maharaj Terminus", code: "CSMT", city: "Mumbai", state: "Maharashtra" },
  { name: "Lokmanya Tilak Terminus", code: "LTT", city: "Mumbai", state: "Maharashtra" },
  { name: "Pune Junction", code: "PUNE", city: "Pune", state: "Maharashtra" },
  { name: "Nagpur Junction", code: "NGP", city: "Nagpur", state: "Maharashtra" },
  { name: "Nashik Road", code: "NK", city: "Nashik", state: "Maharashtra" },

  // ----------------------------------------------------------
  // GUJARAT
  // ----------------------------------------------------------
  { name: "Ahmedabad Junction", code: "ADI", city: "Ahmedabad", state: "Gujarat" },
  { name: "Vadodara Junction", code: "BRC", city: "Vadodara", state: "Gujarat" },
  { name: "Surat", code: "ST", city: "Surat", state: "Gujarat" },
  { name: "Rajkot Junction", code: "RJT", city: "Rajkot", state: "Gujarat" },

  // ----------------------------------------------------------
  // UTTAR PRADESH
  // ----------------------------------------------------------
  { name: "Lucknow Charbagh", code: "LKO", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Kanpur Central", code: "CNB", city: "Kanpur", state: "Uttar Pradesh" },
  { name: "Varanasi Junction", code: "BSB", city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Prayagraj Junction", code: "PRYJ", city: "Prayagraj", state: "Uttar Pradesh" },
  { name: "Agra Cantt", code: "AGC", city: "Agra", state: "Uttar Pradesh" },
  { name: "Gorakhpur Junction", code: "GKP", city: "Gorakhpur", state: "Uttar Pradesh" },

  // ----------------------------------------------------------
  // WEST BENGAL
  // ----------------------------------------------------------
  { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" },
  { name: "Sealdah", code: "SDAH", city: "Kolkata", state: "West Bengal" },
  { name: "Durgapur", code: "DGR", city: "Durgapur", state: "West Bengal" },

  // ----------------------------------------------------------
  // BIHAR
  // ----------------------------------------------------------
  { name: "Patna Junction", code: "PNBE", city: "Patna", state: "Bihar" },
  { name: "Gaya Junction", code: "GAYA", city: "Gaya", state: "Bihar" },
  { name: "Muzaffarpur Junction", code: "MFP", city: "Muzaffarpur", state: "Bihar" },

  // ----------------------------------------------------------
  // JHARKHAND
  // ----------------------------------------------------------
  { name: "Ranchi Junction", code: "RNC", city: "Ranchi", state: "Jharkhand" },
  { name: "Dhanbad Junction", code: "DHN", city: "Dhanbad", state: "Jharkhand" },

  // ----------------------------------------------------------
  // MADHYA PRADESH
  // ----------------------------------------------------------
  { name: "Bhopal Junction", code: "BPL", city: "Bhopal", state: "Madhya Pradesh" },
  { name: "Indore Junction", code: "INDB", city: "Indore", state: "Madhya Pradesh" },
  { name: "Gwalior Junction", code: "GWL", city: "Gwalior", state: "Madhya Pradesh" },

  // ----------------------------------------------------------
  // CHHATTISGARH
  // ----------------------------------------------------------
  { name: "Raipur Junction", code: "R", city: "Raipur", state: "Chhattisgarh" },
  { name: "Bilaspur Junction", code: "BSP", city: "Bilaspur", state: "Chhattisgarh" },

  // ----------------------------------------------------------
  // PUNJAB / HARYANA
  // ----------------------------------------------------------
  { name: "Chandigarh", code: "CDG", city: "Chandigarh", state: "Chandigarh" },
  { name: "Amritsar Junction", code: "ASR", city: "Amritsar", state: "Punjab" },
  { name: "Ludhiana Junction", code: "LDH", city: "Ludhiana", state: "Punjab" },
  { name: "Ambala Cantt", code: "UMB", city: "Ambala", state: "Haryana" },
  { name: "Gurugram", code: "GGN", city: "Gurugram", state: "Haryana" },

  // ----------------------------------------------------------
  // JAMMU & KASHMIR
  // ----------------------------------------------------------
  { name: "Jammu Tawi", code: "JAT", city: "Jammu", state: "Jammu & Kashmir" },
  { name: "Srinagar", code: "SINA", city: "Srinagar", state: "Jammu & Kashmir" },

  // ----------------------------------------------------------
  // HIMACHAL PRADESH
  // ----------------------------------------------------------
  { name: "Shimla", code: "SML", city: "Shimla", state: "Himachal Pradesh" },

  // ----------------------------------------------------------
  // ODISHA
  // ----------------------------------------------------------
  { name: "Bhubaneswar", code: "BBS", city: "Bhubaneswar", state: "Odisha" },
  { name: "Cuttack", code: "CTC", city: "Cuttack", state: "Odisha" },

  // ----------------------------------------------------------
  // ASSAM / NORTH EAST
  // ----------------------------------------------------------
  { name: "Guwahati", code: "GHY", city: "Guwahati", state: "Assam" },
  { name: "Dibrugarh", code: "DBRG", city: "Dibrugarh", state: "Assam" },

  // ----------------------------------------------------------
  // TELANGANA
  // ----------------------------------------------------------
  { name: "Secunderabad Junction", code: "SC", city: "Hyderabad", state: "Telangana" },
  { name: "Hyderabad Deccan", code: "HYB", city: "Hyderabad", state: "Telangana" },

  // ----------------------------------------------------------
  // KARNATAKA
  // ----------------------------------------------------------
  { name: "KSR Bengaluru", code: "SBC", city: "Bengaluru", state: "Karnataka" },
  { name: "Yesvantpur Junction", code: "YPR", city: "Bengaluru", state: "Karnataka" },
  { name: "Mysuru Junction", code: "MYS", city: "Mysuru", state: "Karnataka" },

  // ----------------------------------------------------------
  // TAMIL NADU
  // ----------------------------------------------------------
  { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Coimbatore Junction", code: "CBE", city: "Coimbatore", state: "Tamil Nadu" },
  { name: "Madurai Junction", code: "MDU", city: "Madurai", state: "Tamil Nadu" },

  // ----------------------------------------------------------
  // KERALA
  // ----------------------------------------------------------
  { name: "Ernakulam Junction", code: "ERS", city: "Kochi", state: "Kerala" },
  { name: "Thiruvananthapuram Central", code: "TVC", city: "Thiruvananthapuram", state: "Kerala" },
  { name: "Kozhikode", code: "CLT", city: "Kozhikode", state: "Kerala" },

  // ----------------------------------------------------------
  // ANDHRA PRADESH
  // ----------------------------------------------------------
  { name: "Vijayawada Junction", code: "BZA", city: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Visakhapatnam", code: "VSKP", city: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Tirupati", code: "TPTY", city: "Tirupati", state: "Andhra Pradesh" },

  // ----------------------------------------------------------
  // GOA
  // ----------------------------------------------------------
  { name: "Madgaon", code: "MAO", city: "Madgaon", state: "Goa" },
  { name: "Vasco Da Gama", code: "VSG", city: "Vasco", state: "Goa" },

  // ----------------------------------------------------------
  // KONKAN / COASTAL
  // ----------------------------------------------------------
  { name: "Ratnagiri", code: "RN", city: "Ratnagiri", state: "Maharashtra" },
  { name: "Karmali", code: "KRMI", city: "Karmali", state: "Goa" },
];

// ============================================================
// SEARCH SUGGESTIONS
// ============================================================

export const suggestions = [
  "Cheapest AC train from Delhi to Jaipur tomorrow morning",
  "Vande Bharat from Mumbai to Ahmedabad this Friday",
  "Overnight sleeper from Bengaluru to Chennai",
  "Fastest train Delhi to Lucknow under ₹1500",
  "Tatkal 3A from Patna to Howrah for Monday",
  "Volvo bus from Delhi to Jaipur tonight",
  "Flight from Delhi to Mumbai tomorrow morning",
  "Ferry from Mumbai to Mandwa this weekend",
  "Delhi Metro from Rajiv Chowk to Saket",
  "Hotel near Connaught Place under ₹5000",
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
  { id: "early", label: "Early", range: "00:00 – 06:00" },
  { id: "morning", label: "Morning", range: "06:00 – 12:00" },
  { id: "afternoon", label: "Afternoon", range: "12:00 – 18:00" },
  { id: "night", label: "Night", range: "18:00 – 24:00" },
];

// ============================================================
// POPULAR STATIONS
// ============================================================

export const popularStationCodes = [
  "NDLS",
  "BCT",
  "MAS",
  "HWH",
  "SBC",
  "SC",
  "JP",
  "PUNE",
  "ADI",
  "LKO",
];

// ============================================================
// HELPER
// ============================================================

export function stationByCode(code?: string, fallback = "NDLS"): Station {
  return (
    stations.find((station) => station.code === code) ??
    stations.find((station) => station.code === fallback) ??
    stations[0]
  );
}

// ============================================================
// TRANSPORT MODES
// ============================================================

export type TransportMode = "train" | "bus" | "flight" | "hotel" | "metro" | "ferry";

export const transportModes: { id: TransportMode; label: string }[] = [
  { id: "train", label: "Trains" },
  { id: "bus", label: "Buses" },
  { id: "flight", label: "Flights" },
  { id: "hotel", label: "Hotels" },
  { id: "metro", label: "Metro" },
  { id: "ferry", label: "Ferries" },
];

// ============================================================
// SMALL DETERMINISTIC HASH (keeps demo data stable per key)
// ============================================================

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ============================================================
// ROUTE CATALOG (per-mode, non-overlapping route pairs)
// ============================================================

export type RouteDef = {
  from: Station;
  to: Station;
};

function buildRoutePool(offset: number, size: number): RouteDef[] {
  const n = stations.length;
  const pool: RouteDef[] = [];
  const seen = new Set<string>();
  let i = 0;
  let attempts = 0;

  while (pool.length < size && attempts < size * 20) {
    attempts++;
    const fromIdx = (offset + i * 5) % n;
    const toIdx = (offset + i * 5 + 11 + (i % 7)) % n;
    i++;

    if (fromIdx === toIdx) continue;

    const a = stations[fromIdx];
    const b = stations[toIdx];
    const key = `${a.code}-${b.code}`;

    if (seen.has(key)) continue;
    seen.add(key);
    pool.push({ from: a, to: b });
  }

  return pool;
}

export const modeRoutes: Record<Exclude<TransportMode, "hotel">, RouteDef[]> = {
  train: buildRoutePool(0, 24),
  bus: buildRoutePool(211, 18),
  flight: buildRoutePool(433, 14),
  metro: buildRoutePool(617, 10),
  ferry: buildRoutePool(809, 8),
};

// ============================================================
// HOTELS
// ============================================================

export type HotelProperty = {
  id: string;
  name: string;
  city: string;
  state: string;
  area: string;
  rating: number;
  priceFrom: number;
  previewImages: string[];
  amenities: string[];
  category: "Budget" | "Standard" | "Luxury";
};

export const famousHotelDestinations = [
  { city: "Delhi", state: "Delhi", landmark: "Connaught Place" },
  { city: "Jaipur", state: "Rajasthan", landmark: "Hawa Mahal" },
  { city: "Mumbai", state: "Maharashtra", landmark: "Marine Drive" },
  { city: "Goa", state: "Goa", landmark: "Calangute Beach" },
  { city: "Udaipur", state: "Rajasthan", landmark: "Lake Pichola" },
  { city: "Agra", state: "Uttar Pradesh", landmark: "Taj Mahal" },
  { city: "Bengaluru", state: "Karnataka", landmark: "MG Road" },
  { city: "Kochi", state: "Kerala", landmark: "Fort Kochi" },
];

const hotelNamePrefixes = ["Grand", "Royal", "Heritage", "Comfort", "City", "Sunrise"];
const hotelNameSuffixByCategory: Record<HotelProperty["category"], string> = {
  Budget: "Inn",
  Standard: "Residency",
  Luxury: "Palace",
};

export const allHotels: HotelProperty[] = famousHotelDestinations.flatMap((dest, di) => {
  const categories: HotelProperty["category"][] = ["Budget", "Standard", "Luxury"];

  return categories.map((cat, ci) => {
    const idx = di * 3 + ci;
    const h = hashString(`${dest.city}-${cat}-${idx}`);
    const priceBase = cat === "Budget" ? 1200 : cat === "Standard" ? 2800 : 6500;
    const price = priceBase + (h % 800);

    return {
      id: `hotel-${dest.city.toLowerCase().replace(/\s+/g, "-")}-${cat.toLowerCase()}-${idx}`,
      name: `${cat === "Luxury" ? "The " : ""}${hotelNamePrefixes[h % hotelNamePrefixes.length]} ${hotelNameSuffixByCategory[cat]}`,
      city: dest.city,
      state: dest.state,
      area: dest.landmark,
      rating:
        cat === "Luxury"
          ? 4.5 + (h % 5) / 10
          : cat === "Standard"
            ? 3.8 + (h % 6) / 10
            : 3.2 + (h % 5) / 10,
      priceFrom: price,
      previewImages: [
        `https://source.unsplash.com/collection/hotel-interior/${idx}a`,
        `https://source.unsplash.com/collection/hotel-interior/${idx}b`,
      ],
      amenities:
        cat === "Luxury"
          ? ["Free WiFi", "Pool", "Spa", "Breakfast Included", "Valet Parking"]
          : cat === "Standard"
            ? ["Free WiFi", "Breakfast Included", "AC"]
            : ["Free WiFi", "AC"],
      category: cat,
    };
  });
});

// ============================================================
// SEGMENTS (search results shown for train/bus/flight/metro/ferry/hotel)
// ============================================================

export type SeatOption = {
  code: string;
  label: string;
  fare: number;
  available: number;
  probability: number;
};

export type Segment = {
  id: string;
  mode: TransportMode;
  name: string;
  code: string;
  operator?: string;
  from?: string;
  fromCode?: string;
  to?: string;
  toCode?: string;
  depart: string;
  arrive: string;
  durationMins: number;
  duration: string;
  distanceKm: number;
  tags: string[];
  options: SeatOption[];
};

// ------------------------------------------------------------
// distance / demand / fare
// ------------------------------------------------------------

export function distanceKm(from: Station, to: Station): number {
  if (!from || !to || from.code === to.code) return 0;
  const key = [from.code, to.code].sort().join("-");
  const h = hashString(key);
  return 80 + (h % 1800);
}

export function demandIndex(from: Station, to: Station, date: Date): number {
  const key = `${from.code}-${to.code}-${date.toISOString().slice(0, 10)}`;
  const h = hashString(key);
  const base = 1 + (h % 40) / 100; // 1.00 – 1.39
  return Math.round(base * 100) / 100;
}

const classFareFactors: Record<string, number> = {
  SL: 0.35,
  "3A": 0.9,
  "2A": 1.3,
  "1A": 2.1,
  CC: 0.8,
  EC: 1.0,
  GEN: 0.2,
  SEATER: 0.5,
  SLEEPER: 0.75,
  VOLVO: 0.85,
  ECONOMY: 1,
  PREMIUM_ECONOMY: 1.6,
  BUSINESS: 2.8,
  TOKEN: 0.05,
  DECK: 0.4,
  CABIN: 1.2,
  DELUXE: 1,
  PREMIUM: 1.4,
  EXECUTIVE: 1.8,
  SUITE: 2.5,
  FAMILY: 1.6,
};

function classFareFactor(code: string): number {
  return classFareFactors[code] ?? 1;
}

export function computeFare(
  km: number,
  code: string,
  demand: number,
  multiplier = 1,
): number {
  const factor = classFareFactor(code) * multiplier;
  const raw = km * 1.1 * factor + 120 * factor;
  const withDemand = raw * Math.max(0.8, demand);
  return Math.max(49, Math.round(withDemand / 10) * 10);
}

// ------------------------------------------------------------
// meals
// ------------------------------------------------------------

export const meals = [
  { id: "veg-thali", name: "Veg Thali", price: 180 },
  { id: "nonveg-thali", name: "Non-Veg Thali", price: 220 },
  { id: "sandwich", name: "Sandwich Combo", price: 120 },
  { id: "biryani", name: "Chicken Biryani", price: 250 },
  { id: "snack-box", name: "Snack Box", price: 90 },
];

// ------------------------------------------------------------
// seat availability state (re-evaluated on a ticking timer)
// ------------------------------------------------------------

export type SeatTone = "available" | "low" | "rac" | "wl" | "sold";

export function seatState(
  key: string,
  availableBase: number,
  tick: number,
  opts?: { racWl?: boolean },
): { tone: SeatTone; label: string } {
  const h = hashString(`${key}:${tick}`);
  const avail = Math.max(0, availableBase - (h % (availableBase + 3)));

  if (avail <= 0) {
    if (opts?.racWl && h % 5 !== 0) {
      const isRac = h % 2 === 0;
      return isRac
        ? { tone: "rac", label: `RAC ${1 + (h % 20)}` }
        : { tone: "wl", label: `WL ${1 + (h % 40)}` };
    }
    return { tone: "sold", label: "Sold Out" };
  }

  if (avail <= 3) {
    return { tone: "low", label: `Only ${avail} left` };
  }

  return { tone: "available", label: `${avail} available` };
}

// ------------------------------------------------------------
// service disruptions
// ------------------------------------------------------------

export function serviceDisruption(id: string): {
  cancelled: boolean;
  delayMins: number;
  reason: string;
} {
  const h = hashString(id);

  if (h % 23 === 0) {
    return { cancelled: true, delayMins: 0, reason: "Operational constraints" };
  }

  if (h % 7 === 0) {
    return { cancelled: false, delayMins: 15 + (h % 60), reason: "Traffic congestion" };
  }

  return { cancelled: false, delayMins: 0, reason: "" };
}

// ------------------------------------------------------------
// seat allocation (used once a booking is confirmed)
// ------------------------------------------------------------

export function allocateSeats(
  pnr: string,
  mode: TransportMode,
  classCode: string,
  paxCount: number,
): string[] {
  const seats: string[] = [];
  const h = hashString(pnr + mode + classCode);
  const rowLetters = "ABCDEF";

  for (let i = 0; i < Math.max(1, paxCount); i++) {
    const seatNum = 1 + ((h + i * 7) % 72);
    const letter = rowLetters[(h + i) % rowLetters.length];
    seats.push(`${letter}${seatNum}`);
  }

  return seats;
}

// ------------------------------------------------------------
// time helpers
// ------------------------------------------------------------

function slotStartMinutes(slot: string): number {
  switch (slot) {
    case "early":
      return 0;
    case "morning":
      return 360;
    case "afternoon":
      return 720;
    case "night":
      return 1080;
    default:
      return 360;
  }
}

function timeFromMinutes(mins: number): string {
  const normalized = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const period = h >= 12 ? "PM" : "AM";
  let hh = h % 12;
  if (hh === 0) hh = 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ------------------------------------------------------------
// per-mode segment builders
// ------------------------------------------------------------

type ClassDef = { code: string; label: string };

const modeProfiles: Record<
  Exclude<TransportMode, "hotel">,
  {
    speedKmh: number;
    overheadMins: number;
    namePool: string[];
    codePrefix: string;
    classCodes: ClassDef[];
    tagsPool: string[];
    hasOperatorName: boolean;
  }
> = {
  train: {
    speedKmh: 55,
    overheadMins: 10,
    namePool: [
      "Rajdhani Express",
      "Shatabdi Express",
      "Duronto Express",
      "Garib Rath Express",
      "Humsafar Express",
      "Sampark Kranti Express",
      "Jan Shatabdi Express",
      "Superfast Mail Express",
    ],
    codePrefix: "1",
    classCodes: [
      { code: "SL", label: "Sleeper" },
      { code: "3A", label: "AC 3-Tier" },
      { code: "2A", label: "AC 2-Tier" },
      { code: "1A", label: "AC First" },
      { code: "CC", label: "AC Chair" },
    ],
    tagsPool: ["Superfast", "Pantry Car", "E-Catering"],
    hasOperatorName: false,
  },
  bus: {
    speedKmh: 45,
    overheadMins: 5,
    namePool: [
      "Volvo Multi-Axle",
      "Rajasthan Roadways",
      "IntrCity SmartBus",
      "Neeta Travels",
      "Orange Tours",
      "VRL Travels",
    ],
    codePrefix: "BUS",
    classCodes: [
      { code: "SEATER", label: "AC Seater" },
      { code: "SLEEPER", label: "AC Sleeper" },
    ],
    tagsPool: ["Volvo A/C", "Live Tracking", "Charging Point"],
    hasOperatorName: true,
  },
  flight: {
    speedKmh: 700,
    overheadMins: 45,
    namePool: ["IndiGo", "Air India", "Vistara", "SpiceJet", "Akasa Air"],
    codePrefix: "AI",
    classCodes: [
      { code: "ECONOMY", label: "Economy" },
      { code: "PREMIUM_ECONOMY", label: "Premium Economy" },
      { code: "BUSINESS", label: "Business" },
    ],
    tagsPool: ["Non-stop", "Free Meal", "On-time Performance"],
    hasOperatorName: true,
  },
  metro: {
    speedKmh: 33,
    overheadMins: 2,
    namePool: ["Blue Line", "Yellow Line", "Red Line", "Violet Line", "Pink Line"],
    codePrefix: "MTR",
    classCodes: [{ code: "TOKEN", label: "Token" }],
    tagsPool: ["Every 5 min", "Every 8 min", "Air Conditioned"],
    hasOperatorName: false,
  },
  ferry: {
    speedKmh: 28,
    overheadMins: 10,
    namePool: ["Konkan Sea Link", "Coastal Cruiser", "Harbour Express", "Island Hopper"],
    codePrefix: "FRY",
    classCodes: [
      { code: "DECK", label: "Deck Class" },
      { code: "CABIN", label: "Cabin" },
    ],
    tagsPool: ["Life Jackets Provided", "Onboard Cafe"],
    hasOperatorName: true,
  },
};

function buildTransportSegment(
  mode: Exclude<TransportMode, "hotel">,
  from: Station,
  to: Station,
  km: number,
  demand: number,
  slot: string,
  index: number,
  seed: string,
): Segment {
  const profile = modeProfiles[mode];
  const h = hashString(seed);

  const slotStart = slotStartMinutes(slot);
  const departMins = (slotStart + (h % 300)) % 1440;
  const durationMins = Math.max(
    20,
    Math.round((km / profile.speedKmh) * 60) + profile.overheadMins + (h % 20),
  );
  const arriveMins = departMins + durationMins;

  const name = profile.namePool[h % profile.namePool.length];
  const code = `${profile.codePrefix}${1000 + (h % 8999)}`;
  const operator = profile.hasOperatorName ? name : undefined;

  const options: SeatOption[] = profile.classCodes.map((cls) => {
    const availSeed = hashString(`${seed}-${cls.code}`);
    const available = 5 + (availSeed % 60);
    const fare = computeFare(km, cls.code, demand);
    const probability =
      mode === "metro" ? 100 : Math.max(15, 100 - (availSeed % 100));

    return {
      code: cls.code,
      label: cls.label,
      fare,
      available,
      probability,
    };
  });

  const tags = [profile.tagsPool[h % profile.tagsPool.length]];
  if (mode === "flight" && h % 3 === 0) {
    tags.push("1 stop");
  }

  return {
    id: `${mode}-${seed}-${index}`,
    mode,
    name,
    code,
    operator,
    from: from.city,
    fromCode: from.code,
    to: to.city,
    toCode: to.code,
    depart: timeFromMinutes(departMins),
    arrive: timeFromMinutes(arriveMins),
    durationMins,
    duration: formatDuration(durationMins),
    distanceKm: km,
    tags,
    options,
  };
}

const hotelNames = [
  "The Grand Residency",
  "Heritage Palace Hotel",
  "Comfort Inn & Suites",
  "Royal Orchid Stay",
  "Sunrise Boutique Hotel",
  "City Central Hotel",
];

const hotelRoomTypes: ClassDef[] = [
  { code: "DELUXE", label: "Deluxe Room" },
  { code: "PREMIUM", label: "Premium Room" },
  { code: "EXECUTIVE", label: "Executive Room" },
  { code: "SUITE", label: "Family Suite" },
];

function buildHotelSegment(
  location: Station,
  demand: number,
  index: number,
  seed: string,
): Segment {
  const h = hashString(seed);
  const name = hotelNames[h % hotelNames.length];

  const options: SeatOption[] = hotelRoomTypes.map((rt) => {
    const availSeed = hashString(`${seed}-${rt.code}`);
    const available = 1 + (availSeed % 12);
    const fare = computeFare(120, rt.code, demand);
    const probability = Math.max(20, 100 - (availSeed % 80));

    return {
      code: rt.code,
      label: rt.label,
      fare,
      available,
      probability,
    };
  });

  return {
    id: `hotel-${location.code}-${index}-${h}`,
    mode: "hotel",
    name: `${name}, ${location.city}`,
    code: `HTL${1000 + (h % 8999)}`,
    operator: name,
    from: location.city,
    fromCode: location.code,
    to: location.city,
    toCode: location.code,
    depart: "2:00 PM",
    arrive: "11:00 AM",
    durationMins: 1260,
    duration: "1 Night",
    distanceKm: 0,
    tags: h % 2 === 0 ? ["Free Cancellation", "Breakfast Included"] : ["Free Cancellation"],
    options,
  };
}

// ------------------------------------------------------------
// public entry point used by inventory.ts and the booking page
// ------------------------------------------------------------

export function generateResults(
  mode: TransportMode,
  from: Station,
  to: Station,
  date: Date,
  slot: string,
  count: number,
  seed: string,
): Segment[] {
  const segments: Segment[] = [];
  const demand = demandIndex(from, to, date);
  const km = mode === "hotel" ? 0 : distanceKm(from, to);

  for (let i = 0; i < Math.max(0, count); i++) {
    const localSeed = `${seed}-${mode}-${from.code}-${to.code}-${i}`;

    if (mode === "hotel") {
      segments.push(buildHotelSegment(from, demand, i, localSeed));
      continue;
    }

    segments.push(
      buildTransportSegment(mode, from, to, km, demand, slot, i, localSeed),
    );
  }

  return segments;
}
