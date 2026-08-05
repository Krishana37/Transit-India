import { stations, type Station } from "./dummy-data";

export type TransportMode = "train" | "bus" | "flight" | "hotel" | "metro" | "ferry";

export const transportModes: { id: TransportMode; label: string; blurb: string }[] = [
  { id: "train", label: "Trains", blurb: "Long-distance rail across the country" },
  { id: "bus", label: "Buses", blurb: "Sleeper, Volvo and seater coaches" },
  { id: "flight", label: "Flights", blurb: "Domestic hops between metros" },
  { id: "hotel", label: "Hotels", blurb: "Stays near your destination" },
  { id: "metro", label: "Metro", blurb: "City rapid transit day passes" },
  { id: "ferry", label: "Ferry", blurb: "Coastal and island crossings" },
];

/* ---------- deterministic pseudo-randomness (stable across renders) ---------- */

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function rand(seed: string, min: number, max: number) {
  const h = hash(seed);
  return min + (h % 10000) / 10000 * (max - min);
}

function pick<T>(seed: string, arr: T[]): T {
  return arr[hash(seed) % arr.length];
}

/** Fictional but stable "distance" between two stations, in km. */
export function distanceKm(from: Station, to: Station) {
  if (from.code === to.code) return 0;
  const key = [from.code, to.code].sort().join("-");
  return Math.round(rand(key, 140, 2100));
}

/** Prototype demand index (0.85 – 1.35) driven by date + route. */
export function demandIndex(from: Station, to: Station, date: Date) {
  const day = date.getDay();
  const weekend = day === 0 || day === 5 || day === 6 ? 0.12 : 0;
  const daysAway = Math.max(0, Math.round((date.getTime() - Date.now()) / 86400000));
  const urgency = daysAway <= 1 ? 0.14 : daysAway <= 3 ? 0.07 : 0;
  return Number((0.9 + rand(from.code + to.code + day, 0, 0.18) + weekend + urgency).toFixed(2));
}

export const classMultiplier: Record<string, number> = {
  // train
  GEN: 0.45, SL: 1, "3A": 2.6, "2A": 3.7, "1A": 6.2, CC: 3.1, EC: 5.6,
  // bus
  ORDINARY: 0.75, SEATER: 0.9, DELUXE_BUS: 1.25, AC: 1.5, SLEEPER: 1.6, LUXURY: 2.3, VOLVO: 1.8,
  // flight
  ECONOMY: 9, PREMIUM_ECONOMY: 13, BUSINESS: 22,
  // hotel
  BUDGET: 0.7, STANDARD: 1, DELUXE: 1.6, PREMIUM: 2.1, SUITE: 2.8, LUXURY_STAY: 3.4,
  // metro / ferry / cab
  TOKEN: 1, DAYPASS: 1.4,
  DECK: 1, CABIN: 2.2,
  MINI: 0.85, SEDAN: 1.1, SUV: 1.5, CAB_PREMIUM: 1.9,
};

/** Festival windows (fictional demo calendar) that push fares up. */
export function festivalBoost(date: Date) {
  const md = `${date.getMonth() + 1}-${date.getDate()}`;
  const windows = ["3-", "8-", "10-", "11-", "12-"];
  const festive = windows.some((w) => md.startsWith(w)) && date.getDate() % 7 < 3;
  return festive ? 1.16 : 1;
}

/**
 * Realistic demand-side multipliers: peak hours, weekends, festival season,
 * how full the service is and how close to departure the booking is made.
 */
export function priceFactors(opts: {
  date: Date;
  departHour?: number;
  seatShare?: number; // 0..1 remaining seats
  seed: string;
}) {
  const { date, departHour = 9, seatShare = 0.6, seed } = opts;
  const day = date.getDay();
  const weekend = day === 0 || day === 5 || day === 6 ? 1.08 : 1;
  const peak = (departHour >= 7 && departHour <= 10) || (departHour >= 17 && departHour <= 21)
    ? 1.12
    : departHour <= 5 ? 0.9 : 1;
  const scarcity = 1 + (1 - Math.max(0, Math.min(1, seatShare))) * 0.18;
  const jitter = 0.95 + rand(seed, 0, 0.12);
  return Number((weekend * peak * festivalBoost(date) * scarcity * jitter).toFixed(3));
}

/** Dynamic fare: distance × class × demand × market factors. */
export function computeFare(km: number, classCode: string, demand: number, base = 0.62, factor = 1) {
  const mult = classMultiplier[classCode] ?? 1;
  const raw = (60 + km * base) * mult * demand * factor;
  return Math.round(raw / 5) * 5;
}


/* ---------- fictional operator vocabulary ---------- */

const trainPrefix = ["Sapphire", "Meghdoot", "Kaveri", "Aravalli", "Nilgiri", "Chinar", "Konkan", "Deccan", "Sundari", "Gangetic"];
const trainSuffix = ["Superfast", "Rapid", "Sampark", "Duronto-style Express", "Vega Express", "Tejas-style Express"];
const busOperators = ["Vayu Travels", "Sahyadri Coachlines", "Bluewheel Roadways", "Nimbus Motors", "Chariot Lines"];
const airlines = ["Aeronix", "Skyra", "IndiSky", "Vayudoot Air", "Zephyr Wings"];
const hotelNames = ["The Marigold House", "Aster Grand", "Nilaya Residency", "Copperleaf Suites", "Serai Court"];
const metroLines = ["Sapphire Line", "Amber Line", "Jade Line", "Crimson Line"];
const ferryOperators = ["Bluewater Ferries", "Coral Coast Marine", "Windward Lines"];

const berthClasses = ["SL", "3A", "2A", "1A"];

export type Segment = {
  id: string;
  mode: TransportMode;
  name: string;
  code: string;
  operator?: string;
  depart: string;
  arrive: string;
  durationMins: number;
  duration: string;
  distanceKm: number;
  tags: string[];
  options: { code: string; label: string; fare: number; available: number; probability: number }[];
};

function fmtDuration(mins: number) {
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;
}

function addMinutes(hhmm: string, mins: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = (h * 60 + m + mins) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

const slotStart: Record<string, number> = { early: 2, morning: 6, afternoon: 13, night: 19 };

/** Budget → premium ladders per transport mode. */
export const classLadder: Record<string, { code: string; label: string }[]> = {
  train: [
    { code: "GEN", label: "General (Unreserved)" },
    { code: "SL", label: "Sleeper" },
    { code: "3A", label: "AC 3-Tier" },
    { code: "2A", label: "AC 2-Tier" },
    { code: "1A", label: "AC First" },
  ],
  bus: [
    { code: "ORDINARY", label: "Ordinary" },
    { code: "DELUXE_BUS", label: "Deluxe" },
    { code: "AC", label: "AC Seater" },
    { code: "SLEEPER", label: "AC Sleeper" },
    { code: "LUXURY", label: "Luxury Coach" },
  ],
  flight: [
    { code: "ECONOMY", label: "Economy" },
    { code: "PREMIUM_ECONOMY", label: "Premium Economy" },
    { code: "BUSINESS", label: "Business" },
  ],
  hotel: [
    { code: "BUDGET", label: "Budget" },
    { code: "STANDARD", label: "Standard" },
    { code: "PREMIUM", label: "Premium" },
    { code: "LUXURY_STAY", label: "Luxury" },
  ],
  metro: [
    { code: "TOKEN", label: "Single token" },
    { code: "DAYPASS", label: "Day pass" },
  ],
  ferry: [
    { code: "DECK", label: "Deck seat" },
    { code: "CABIN", label: "Cabin" },
  ],
  cab: [
    { code: "MINI", label: "Mini" },
    { code: "SEDAN", label: "Sedan" },
    { code: "SUV", label: "SUV" },
    { code: "CAB_PREMIUM", label: "Premium" },
  ],
};

/** Classes that may be sold as RAC / Waiting List (trains only, never 1st AC). */
export const racWlClasses = ["GEN", "SL", "3A", "2A"];

export function supportsRacWl(mode: string, classCode: string) {
  return mode === "train" && racWlClasses.includes(classCode.split(" ")[0]);
}

export function generateResults(
  mode: TransportMode,
  from: Station,
  to: Station,
  date: Date,
  slot = "morning",
  count = 5,
  nonce = "",
): Segment[] {
  const km = distanceKm(from, to);
  const demand = demandIndex(from, to, date);
  const dayKey = date.toISOString().slice(0, 10);
  const startHour = slotStart[slot] ?? 6;

  return Array.from({ length: count }).map((_, i) => {
    const seed = `${mode}-${from.code}-${to.code}-${dayKey}-${i}${nonce ? `-${nonce}` : ""}`;
    const depart = `${String((startHour + i * 2) % 24).padStart(2, "0")}:${pick(seed + "min", ["05", "10", "25", "40", "55"])}`;
    const departHour = Number(depart.slice(0, 2));

    const ladder = classLadder[mode] ?? classLadder.train;
    const buildOptions = (opts: {
      fareKm: number;
      base: number;
      capacity: (code: string) => number;
      probability: (code: string, available: number) => number;
    }) =>
      ladder.map(({ code, label }) => {
        const available = opts.capacity(code);
        const cap = Math.max(available, 1);
        const factor = priceFactors({
          date,
          departHour,
          seatShare: Math.min(1, available / (cap + 20)),
          seed: seed + code,
        });
        return {
          code,
          label,
          fare: computeFare(opts.fareKm, code, demand, opts.base, factor),
          available,
          probability: opts.probability(code, available),
        };
      });

    if (mode === "flight") {
      const mins = Math.round(km / 12 + 45);
      const airline = pick(seed, airlines);
      return {
        id: seed,
        mode,
        name: airline,
        code: `${airline.slice(0, 2).toUpperCase()}-${300 + (hash(seed) % 600)}`,
        operator: airline,
        depart,
        arrive: addMinutes(depart, mins),
        durationMins: mins,
        duration: fmtDuration(mins),
        distanceKm: km,
        tags: pick(seed + "t", [["Non-stop"], ["Non-stop", "Cabin bag only"], ["1 stop"]]),
        options: buildOptions({
          fareKm: km,
          base: 0.42,
          capacity: (c) => 2 + (hash(seed + c) % (c === "BUSINESS" ? 12 : 40)),
          probability: (c) => 90 + (hash(seed + c) % 10),
        }),
      };
    }

    if (mode === "hotel") {
      const name = pick(seed, hotelNames);
      return {
        id: seed,
        mode,
        name: `${name}, ${to.city}`,
        code: `HTL-${1000 + (hash(seed) % 8000)}`,
        operator: name,
        depart: "14:00",
        arrive: "11:00",
        durationMins: 1260,
        duration: "1 night",
        distanceKm: 1 + (hash(seed) % 9),
        tags: pick(seed + "t", [["Breakfast included"], ["Free cancellation"], ["Near station", "Wi-Fi"]]),
        options: buildOptions({
          fareKm: 60,
          base: 12,
          capacity: (c) => 1 + (hash(seed + c) % 12),
          probability: (c) => 92 + (hash(seed + c) % 8),
        }),
      };
    }

    if (mode === "metro") {
      const line = pick(seed, metroLines);
      const mins = 18 + (hash(seed) % 40);
      return {
        id: seed,
        mode,
        name: `${line} · ${from.city} Metro`,
        code: `MTR-${10 + (hash(seed) % 80)}`,
        depart,
        arrive: addMinutes(depart, mins),
        durationMins: mins,
        duration: fmtDuration(mins),
        distanceKm: 4 + (hash(seed) % 30),
        tags: ["Every 5 min", "Air-conditioned"],
        options: buildOptions({
          fareKm: 20,
          base: 1.4,
          capacity: () => 400,
          probability: () => 100,
        }),
      };
    }

    if (mode === "ferry") {
      const op = pick(seed, ferryOperators);
      const mins = 60 + (hash(seed) % 240);
      return {
        id: seed,
        mode,
        name: `${op} Crossing`,
        code: `FRY-${100 + (hash(seed) % 400)}`,
        operator: op,
        depart,
        arrive: addMinutes(depart, mins),
        durationMins: mins,
        duration: fmtDuration(mins),
        distanceKm: Math.round(km / 6),
        tags: ["Sea route", "Snacks onboard"],
        options: buildOptions({
          fareKm: Math.round(km / 6),
          base: 1.1,
          capacity: (c) => 10 + (hash(seed + c) % 90),
          probability: (c) => 88 + (hash(seed + c) % 12),
        }),
      };
    }

    if (mode === "bus") {
      const op = pick(seed, busOperators);
      const mins = Math.round(km / 0.72 + 30);
      return {
        id: seed,
        mode,
        name: op,
        code: `BUS-${1000 + (hash(seed) % 9000)}`,
        operator: op,
        depart,
        arrive: addMinutes(depart, mins),
        durationMins: mins,
        duration: fmtDuration(mins),
        distanceKm: km,
        tags: pick(seed + "t", [["A/C Sleeper"], ["Volvo Multi-Axle"], ["Live tracking", "Charging point"]]),
        options: buildOptions({
          fareKm: km,
          base: 0.5,
          capacity: (c) => 4 + (hash(seed + c) % 32),
          probability: (c, a) => Math.min(99, 55 + a),
        }),
      };
    }

    // train
    const mins = Math.round(km / 0.9 + 40);
    const name = `${pick(seed, trainPrefix)} ${pick(seed + "s", trainSuffix)}`;
    return {
      id: seed,
      mode: "train" as const,
      name,
      code: String(11000 + (hash(seed) % 8000)),
      depart,
      arrive: addMinutes(depart, mins),
      durationMins: mins,
      duration: fmtDuration(mins),
      distanceKm: km,
      tags: pick(seed + "t", [["Pantry car"], ["Fastest on route"], ["Bio-toilets", "Charging point"], ["Tatkal available"]]),
      options: buildOptions({
        fareKm: km,
        base: 0.62,
        capacity: (c) => (c === "GEN" ? 60 + (hash(seed + c) % 120) : c === "1A" ? 4 + (hash(seed + c) % 14) : hash(seed + c) % 46),
        probability: (c, a) => Math.min(99, 30 + a + (hash(seed + c) % 20)),
      }),
    };
  });
}


export function findStation(code: string): Station {
  return stations.find((s) => s.code === code) ?? stations[0];
}

export function searchStations(term: string, exclude?: string, limit = 30) {
  const q = term.trim().toLowerCase();
  return stations
    .filter((s) => s.code !== exclude)
    .filter((s) =>
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q),
    )
    .slice(0, limit);
}

export const popularStationCodes = ["NDLS", "BCT", "MAS", "HWH", "SBC", "SC", "JP", "PUNE", "ADI", "LKO"];

export const routeCountFor = (s: Station) => 8 + (hash(s.code) % 40);

/* ---------- meals: full onboard catering catalogue ---------- */

export const mealCategories = [
  "Breakfast", "Lunch", "Dinner", "Snacks", "Regional", "Healthy",
  "Kids", "Jain", "Vegetarian", "Non Vegetarian", "Special", "Beverages", "Desserts",
] as const;

export type MealCategory = (typeof mealCategories)[number];

export type Meal = { id: string; name: string; category: MealCategory; price: number; veg: boolean; note?: string };

export const meals: Meal[] = [
  // Breakfast
  { id: "poha", name: "Kanda Poha with Sev", category: "Breakfast", price: 90, veg: true },
  { id: "idli", name: "Idli Sambar (3 pcs)", category: "Breakfast", price: 110, veg: true },
  { id: "paratha", name: "Aloo Paratha & Curd", category: "Breakfast", price: 130, veg: true },
  { id: "omelette", name: "Masala Omelette & Toast", category: "Breakfast", price: 140, veg: false },
  { id: "upma", name: "Rava Upma", category: "Breakfast", price: 85, veg: true },
  // Lunch
  { id: "veg-thali", name: "Veg Thali", category: "Lunch", price: 180, veg: true },
  { id: "rajma-rice", name: "Rajma Chawal Bowl", category: "Lunch", price: 160, veg: true },
  { id: "chicken-thali", name: "Chicken Thali", category: "Lunch", price: 260, veg: false },
  { id: "dal-khichdi", name: "Dal Khichdi & Kadhi", category: "Lunch", price: 150, veg: true },
  // Dinner
  { id: "paneer-dinner", name: "Paneer Butter Masala & Roti", category: "Dinner", price: 230, veg: true },
  { id: "chicken-curry", name: "Chicken Curry & Rice", category: "Dinner", price: 250, veg: false },
  { id: "veg-pulao", name: "Veg Pulao & Raita", category: "Dinner", price: 170, veg: true },
  // Snacks
  { id: "samosa", name: "Samosa (2 pcs)", category: "Snacks", price: 60, veg: true },
  { id: "sandwich", name: "Grilled Veg Sandwich", category: "Snacks", price: 110, veg: true },
  { id: "cutlet", name: "Chicken Cutlet", category: "Snacks", price: 130, veg: false },
  { id: "bhel", name: "Roasted Bhel Cup", category: "Snacks", price: 70, veg: true },
  // Regional
  { id: "misal", name: "Kolhapuri Misal Pav", category: "Regional", price: 140, veg: true },
  { id: "litti", name: "Litti Chokha (4 pcs)", category: "Regional", price: 150, veg: true },
  { id: "dhokla", name: "Khaman Dhokla Box", category: "Regional", price: 100, veg: true },
  { id: "fish-curry", name: "Coastal Fish Curry Meal", category: "Regional", price: 290, veg: false },
  { id: "chettinad", name: "Chettinad Veg Meal", category: "Regional", price: 200, veg: true },
  // Healthy
  { id: "salad", name: "Sprout & Quinoa Salad", category: "Healthy", price: 160, veg: true },
  { id: "millet", name: "Millet Khichdi (low oil)", category: "Healthy", price: 170, veg: true },
  { id: "grilled-chicken", name: "Grilled Chicken & Greens", category: "Healthy", price: 280, veg: false },
  { id: "soup", name: "Clear Vegetable Soup", category: "Healthy", price: 90, veg: true },
  // Kids
  { id: "kids-pasta", name: "Kids Cheesy Pasta", category: "Kids", price: 150, veg: true },
  { id: "kids-nuggets", name: "Kids Nuggets & Fries", category: "Kids", price: 180, veg: false },
  { id: "kids-combo", name: "Kids Mini Meal Box", category: "Kids", price: 140, veg: true },
  // Jain
  { id: "jain-thali", name: "Jain Thali (no onion/garlic)", category: "Jain", price: 190, veg: true },
  { id: "jain-paratha", name: "Jain Paratha Combo", category: "Jain", price: 150, veg: true },
  // Vegetarian
  { id: "paneer-wrap", name: "Paneer Kathi Wrap", category: "Vegetarian", price: 140, veg: true },
  { id: "chole-bhature", name: "Chole Bhature", category: "Vegetarian", price: 170, veg: true },
  // Non Vegetarian
  { id: "chicken-biryani", name: "Chicken Biryani", category: "Non Vegetarian", price: 260, veg: false },
  { id: "egg-curry", name: "Egg Curry Rice", category: "Non Vegetarian", price: 190, veg: false },
  { id: "mutton-biryani", name: "Mutton Biryani", category: "Non Vegetarian", price: 320, veg: false },
  // Special
  { id: "diabetic", name: "Low-GI Diabetic Meal", category: "Special", price: 210, veg: true, note: "Doctor-style prototype menu" },
  { id: "gluten-free", name: "Gluten-Free Meal Box", category: "Special", price: 230, veg: true },
  { id: "festive", name: "Festive Special Thali", category: "Special", price: 350, veg: true },
  { id: "senior", name: "Senior Citizen Soft Meal", category: "Special", price: 180, veg: true },
  // Beverages
  { id: "masala-chai", name: "Masala Chai", category: "Beverages", price: 40, veg: true },
  { id: "filter-coffee", name: "Filter Coffee", category: "Beverages", price: 50, veg: true },
  { id: "cold-coffee", name: "Cold Coffee", category: "Beverages", price: 90, veg: true },
  { id: "buttermilk", name: "Spiced Buttermilk", category: "Beverages", price: 45, veg: true },
  { id: "water", name: "Packaged Water 1L", category: "Beverages", price: 20, veg: true },
  // Desserts
  { id: "gulab", name: "Gulab Jamun (2 pcs)", category: "Desserts", price: 70, veg: true },
  { id: "rasmalai", name: "Rasmalai Cup", category: "Desserts", price: 90, veg: true },
  { id: "icecream", name: "Kulfi Falooda", category: "Desserts", price: 110, veg: true },
  { id: "brownie", name: "Walnut Brownie", category: "Desserts", price: 120, veg: true },
];

/* ---------- independent route networks per transport mode ---------- */

export type RouteMode = TransportMode | "cab";

export type RouteStop = { name: string; at: string; km: number; halt?: string };

export type RoutePreview = {
  networkName: string;
  label: string;
  origin: string;
  destination: string;
  stops: RouteStop[];
  distanceKm: number;
  duration: string;
  note: string;
};

/** Fictional, mode-specific intermediate node pools — no two modes share a network. */
const networkNodes: Record<RouteMode, { network: string; nodes: string[]; note: string }> = {
  train: {
    network: "Bharat Rail Grid (fictional)",
    nodes: ["Amaravati Jn", "Sundarpur", "Kesari Road", "Neelgarh", "Chandrapeth", "Vishrampur", "Rohitgarh", "Tapikund", "Malwan Jn", "Devnagar"],
    note: "Rail corridor with scheduled technical and commercial halts.",
  },
  bus: {
    network: "Highway Coach Network (fictional)",
    nodes: ["Ratanpur Toll", "Ghatpara Bypass", "Sundar Dhaba Stop", "Kalyani Chowk", "Barwani Crossing", "Panchvati Plaza", "Hilltop Junction", "Nandgaon Depot"],
    note: "Expressway coach route with driver-change and refreshment halts.",
  },
  flight: {
    network: "Skyway Air Corridor (fictional)",
    nodes: ["Waypoint ALFA-21", "Waypoint TARA-08", "Sector Delta Handoff", "Waypoint NOVA-14", "Coastal Handoff Point"],
    note: "Air corridor waypoints — no passenger boarding at intermediate points.",
  },
  metro: {
    network: "City Rapid Metro Loop (fictional)",
    nodes: ["Ashoka Park", "Civic Centre", "Lotus Garden", "Textile Market", "Riverbank", "University Gate", "Tech Corridor", "Old Fort"],
    note: "Every station is a boarding station. Trains every 4–6 minutes.",
  },
  ferry: {
    network: "Coastal Ferry Lanes (fictional)",
    nodes: ["Pearl Jetty", "Mangrove Channel", "Lighthouse Point", "Turtle Bay Anchorage", "Palm Islet Dock"],
    note: "Sea lane with tide-dependent timings and jetty stops.",
  },
  cab: {
    network: "Cabber Street Grid (fictional)",
    nodes: ["Ring Road Signal", "Market Underpass", "Green Avenue", "Sector 9 Circle", "Riverside Flyover"],
    note: "Door-to-door road route. Waypoints are traffic checkpoints only.",
  },
  hotel: {
    network: "Stay Access Route (fictional)",
    nodes: ["Station Exit Gate", "Hotel Shuttle Bay"],
    note: "Short access route from your arrival point to the property.",
  },
};

function pickMany(seed: string, arr: string[], n: number) {
  const out: string[] = [];
  let h = hash(seed);
  const pool = [...arr];
  for (let i = 0; i < n && pool.length; i++) {
    h = Math.imul(h ^ (i + 1), 16777619);
    out.push(pool.splice(Math.abs(h) % pool.length, 1)[0]);
  }
  return out;
}

/**
 * Terminal naming is strictly mode-specific: metro rides start and end at metro
 * stations, flights at airports, ferries at terminals, buses at bus terminals.
 */
export function terminalName(mode: RouteMode, city: string, role: "origin" | "destination" = "origin") {
  switch (mode) {
    case "metro":
      return `${city} Central Metro Station`;
    case "flight":
      return `${city} International Airport`;
    case "ferry":
      return `${city} Ferry Terminal`;
    case "bus":
      return role === "origin" ? `${city} ISBT` : `${city} Central Bus Terminal`;
    case "hotel":
      return role === "origin" ? `${city} Arrival Point` : `${city} Hotel District`;
    case "cab":
      return role === "origin" ? "Your pickup point" : `${city} drop point`;
    default:
      return `${city} Junction`;
  }
}

export const routeStyle: Record<RouteMode, { kind: string; stopWord: string }> = {
  train: { kind: "Rail corridor", stopWord: "halts" },
  bus: { kind: "Highway road route", stopWord: "stops" },
  flight: { kind: "Air corridor", stopWord: "waypoints" },
  metro: { kind: "Urban metro line", stopWord: "stations" },
  ferry: { kind: "Sea lane", stopWord: "jetties" },
  cab: { kind: "Road route", stopWord: "checkpoints" },
  hotel: { kind: "Access route", stopWord: "points" },
};

export function buildRoutePreview(
  mode: RouteMode,
  origin: string,
  destination: string,
  km: number,
  totalMins: number,
  seed: string,
): RoutePreview {
  const net = networkNodes[mode];
  const maxStops = mode === "hotel" ? 1 : mode === "flight" ? 2 : mode === "metro" ? 6 : 4;
  const count = Math.max(1, 1 + (hash(seed + mode) % maxStops));
  const mids = pickMany(seed + mode, net.nodes, count);
  const startMins = 0;
  const start = terminalName(mode, origin, "origin");
  const end = terminalName(mode, destination, "destination");

  const stops: RouteStop[] = [
    { name: start, at: "00:00", km: 0, halt: "Source" },
    ...mids.map((name, i) => {
      const frac = (i + 1) / (mids.length + 1);
      const m = Math.round(startMins + totalMins * frac);
      return {
        name,
        at: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
        km: Math.round(km * frac),
        halt: mode === "flight" ? "Overfly" : mode === "metro" ? "1 min" : `${2 + (hash(seed + name) % 8)} min`,
      };
    }),
    {
      name: end,
      at: `${String(Math.floor(totalMins / 60)).padStart(2, "0")}:${String(totalMins % 60).padStart(2, "0")}`,
      km,
      halt: "Destination",
    },
  ];

  return {
    networkName: net.network,
    label: `${start} → ${end}`,
    origin: start,
    destination: end,
    stops,
    distanceKm: km,
    duration: fmtDuration(totalMins),
    note: net.note,
  };
}

/** One seat per passenger, kept adjacent where the class allows it. */
export function allocateSeats(seed: string, mode: string, classCode: string, passengers: number): string[] {
  const n = Math.max(1, passengers);
  const cls = classCode.split(" ")[0];
  if (mode === "hotel") return Array.from({ length: n }, (_, i) => `Room ${101 + ((hash(seed) + i) % 40)}`);
  if (mode === "metro") return Array.from({ length: n }, (_, i) => `Pass ${i + 1}`);
  if (cls === "GEN") return Array.from({ length: n }, () => "Unreserved");

  const berths = ["LB", "MB", "UB", "SL", "SU"];
  const start = 1 + (hash(seed + cls) % 56);
  return Array.from({ length: n }, (_, i) => {
    const num = ((start + i - 1) % 72) + 1;
    return mode === "train"
      ? `${num} ${berths[(hash(seed + num) + i) % berths.length]}`
      : String(num);
  });
}


/* ---------- live-ish seat availability & service disruptions ---------- */

export type SeatState = { available: number; label: string; tone: "ok" | "low" | "rac" | "wl" | "sold" };

/**
 * Seats drain gradually — at most 3 seats per elapsed minute — so availability
 * looks realistic instead of flickering. `minutes` is the minutes since the
 * results were generated. RAC / WL are only ever quoted where they apply.
 */
export function seatState(
  seed: string,
  base: number,
  minutes = 0,
  opts: { racWl?: boolean } = {},
): SeatState {
  const perMinute = 1 + (hash(seed) % 3); // 1–3 seats a minute
  const left = Math.max(0, base - Math.floor(minutes) * perMinute);
  if (left > 12) return { available: left, label: `${left} Available`, tone: "ok" };
  if (left > 4) return { available: left, label: `${left} Available`, tone: "low" };

  if (!opts.racWl) {
    if (left > 0) return { available: left, label: `${left} Available`, tone: "low" };
    return { available: 0, label: "Sold Out", tone: "sold" };
  }

  if (left > 0) return { available: left, label: `RAC ${left}`, tone: "rac" };
  const wl = 1 + (hash(seed + "wl") % 48);
  return wl > 40 ? { available: 0, label: "Sold Out", tone: "sold" } : { available: 0, label: `WL ${wl}`, tone: "wl" };
}


export const cancellationReasons = [
  "Track maintenance block",
  "Operational reasons",
  "Adverse weather advisory",
  "Rolling-stock unavailability",
  "Low occupancy on this date",
  "Crew rostering shortfall",
];

/** ~1 in 9 services is cancelled, deterministically. */
export function serviceDisruption(seed: string): { cancelled: boolean; reason?: string; delayMins: number } {
  const h = hash(seed + "disrupt");
  const cancelled = h % 9 === 0;
  return {
    cancelled,
    reason: cancelled ? cancellationReasons[h % cancellationReasons.length] : undefined,
    delayMins: cancelled ? 0 : [0, 0, 0, 10, 25, 45][h % 6],
  };
}
