import { stations, type Station } from "./dummy-data";

import trainPreview from "../assets/preview/train-2.jpg";
import busPreview from "../assets/preview/bus-2.jpg";
import flightPreview from "../assets/preview/flight-2.jpg";
import metroPreview from "../assets/preview/metro-2.jpg";
import ferryPreview from "../assets/preview/ferry-2.jpg";

import hotelPreview1 from "../assets/preview/hotel-1.webp";
import hotelPreview2 from "../assets/preview/hotel-2.webp";
import hotelPreview3 from "../assets/preview/hotel.webp";
import hotelPreview4 from "../assets/preview/stay-a.png";
import hotelPreview5 from "../assets/preview/stay-b.png";
import hotelPreview6 from "../assets/preview/stay-c.png";
import hotelPreview7 from "../assets/preview/stay-d.png";

/* =========================================================
   TRANSPORT MODES
   CAB IS INTENTIONALLY NOT PART OF NORMAL SEARCH
========================================================= */

export type TransportMode =
  | "train"
  | "bus"
  | "flight"
  | "hotel"
  | "metro"
  | "ferry";

export const transportModes: {
  id: TransportMode;
  label: string;
  blurb: string;
}[] = [
  { id: "train", label: "Trains", blurb: "Long-distance rail across India" },
  { id: "bus", label: "Buses", blurb: "Sleeper, Volvo and seater coaches" },
  { id: "flight", label: "Flights", blurb: "Domestic flights between cities" },
  { id: "hotel", label: "Hotels", blurb: "Hotels near your selected location" },
  { id: "metro", label: "Metro", blurb: "City rapid transit" },
  { id: "ferry", label: "Ferry", blurb: "Coastal and island crossings" },
];

/* =========================================================
   PREVIEW ASSETS
   These are the REAL files visible in the repository.
========================================================= */

export const previewImagesByMode: Record<Exclude<TransportMode, "hotel">, string> = {
  train: trainPreview,
  bus: busPreview,
  flight: flightPreview,
  metro: metroPreview,
  ferry: ferryPreview,
};

export const hotelPreviewImages = [
  hotelPreview1,
  hotelPreview2,
  hotelPreview3,
  hotelPreview4,
  hotelPreview5,
  hotelPreview6,
  hotelPreview7,
] as const;

/* =========================================================
   DETERMINISTIC HELPERS
========================================================= */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function rand(seed: string, min: number, max: number): number {
  return min + ((hash(seed) % 10000) / 10000) * (max - min);
}

function pick<T>(seed: string, arr: T[]): T {
  if (!arr.length) throw new Error("Cannot pick from an empty array");
  return arr[hash(seed) % arr.length];
}

/* =========================================================
   DISTANCE / DEMAND / PRICING
========================================================= */

export function distanceKm(from: Station, to: Station): number {
  if (from.code === to.code) return 0;
  return Math.round(
    rand([from.code, to.code].sort().join("-"), 140, 2100),
  );
}

export function demandIndex(
  from: Station,
  to: Station,
  date: Date,
): number {
  const day = date.getDay();
  const weekend =
    day === 0 || day === 5 || day === 6 ? 0.12 : 0;

  const daysAway = Math.max(
    0,
    Math.round((date.getTime() - Date.now()) / 86400000),
  );

  const urgency =
    daysAway <= 1 ? 0.14 : daysAway <= 3 ? 0.07 : 0;

  return Number(
    (
      0.9 +
      rand(from.code + to.code + day, 0, 0.18) +
      weekend +
      urgency
    ).toFixed(2),
  );
}

export const classMultiplier: Record<string, number> = {
  GEN: 0.45,
  SL: 1,
  "3A": 2.6,
  "2A": 3.7,
  "1A": 6.2,

  ORDINARY: 0.75,
  DELUXE_BUS: 1.25,
  AC: 1.5,
  SLEEPER: 1.6,
  LUXURY: 2.3,

  ECONOMY: 9,
  PREMIUM_ECONOMY: 13,
  BUSINESS: 22,

  BUDGET: 0.7,
  STANDARD: 1,
  DELUXE: 1.6,
  PREMIUM: 2.1,
  SUITE: 2.8,
  LUXURY_STAY: 3.4,

  TOKEN: 1,
  DAYPASS: 1.4,

  DECK: 1,
  CABIN: 2.2,
};

export function festivalBoost(date: Date): number {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [3, 8, 10, 11, 12].includes(month) && day % 7 < 3
    ? 1.16
    : 1;
}

export function priceFactors(opts: {
  date: Date;
  departHour?: number;
  seatShare?: number;
  seed: string;
}): number {
  const {
    date,
    departHour = 9,
    seatShare = 0.6,
    seed,
  } = opts;

  const day = date.getDay();
  const weekend =
    day === 0 || day === 5 || day === 6 ? 1.08 : 1;

  const peak =
    (departHour >= 7 && departHour <= 10) ||
    (departHour >= 17 && departHour <= 21)
      ? 1.12
      : departHour <= 5
        ? 0.9
        : 1;

  const scarcity =
    1 +
    (1 - Math.max(0, Math.min(1, seatShare))) * 0.18;

  return Number(
    (
      weekend *
      peak *
      festivalBoost(date) *
      scarcity *
      (0.95 + rand(seed, 0, 0.12))
    ).toFixed(3),
  );
}

export function computeFare(
  km: number,
  classCode: string,
  demand: number,
  base = 0.62,
  factor = 1,
): number {
  const raw =
    (60 + km * base) *
    (classMultiplier[classCode] ?? 1) *
    demand *
    factor;

  return Math.max(5, Math.round(raw / 5) * 5);
}

/* =========================================================
   OPERATORS
========================================================= */

const trainPrefix = [
  "Sapphire",
  "Meghdoot",
  "Kaveri",
  "Aravalli",
  "Nilgiri",
  "Chinar",
  "Konkan",
  "Deccan",
  "Sundari",
  "Gangetic",
  "Rajdhani",
  "Bharat",
  "Himalayan",
  "Dakshin",
];

const trainSuffix = [
  "Superfast",
  "Rapid",
  "Sampark",
  "Express",
  "Vega Express",
  "Tejas Express",
];

const busOperators = [
  "Vayu Travels",
  "Sahyadri Coachlines",
  "Bluewheel Roadways",
  "Nimbus Motors",
  "Chariot Lines",
  "Royal Bharat Travels",
  "CityLink Coaches",
  "Highway Star",
  "Bharat Roadways",
  "MetroLink Travels",
];

const airlines = [
  "Aeronix",
  "Skyra",
  "IndiSky",
  "Vayudoot Air",
  "Zephyr Wings",
  "Bharat Air",
  "Horizon India",
  "Aero Bharat",
  "Triveni Air",
  "National Sky",
];

const hotelBrands = [
  "The Marigold",
  "Aster Grand",
  "Nilaya Residency",
  "Copperleaf Suites",
  "Serai Court",
  "Royal Orchid",
  "Blue Lotus",
  "Heritage Grand",
  "Imperial Stay",
  "Regal Palace",
  "Crown Vista",
  "Urban Nest",
  "Lakeview Residency",
  "Grand Meridian",
  "The Fern House",
  "Palm Court",
  "Riverview Inn",
  "Golden Leaf",
  "Cityscape Hotel",
  "The Ivory Stay",
];

const metroLines = [
  "Sapphire Line",
  "Amber Line",
  "Jade Line",
  "Crimson Line",
  "Violet Line",
  "Emerald Line",
  "Silver Line",
  "Gold Line",
  "Blue Line",
  "Green Line",
];

const ferryOperators = [
  "Bluewater Ferries",
  "Coral Coast Marine",
  "Windward Lines",
  "Ocean Pearl",
  "Island Connect",
  "Coastal Bharat",
  "Harbour Link",
  "SeaWay India",
];

/* =========================================================
   RESULT TYPES
========================================================= */

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

  /* Hotel uses location only. from/to stay undefined. */
  location?: string;
  locationId?: string;

  previewImage?: string;
  previewImages?: readonly string[];

  depart: string;
  arrive: string;
  durationMins: number;
  duration: string;
  distanceKm: number;
  tags: string[];

  options: {
    code: string;
    label: string;
    fare: number;
    available: number;
    probability: number;
  }[];
};

function fmtDuration(mins: number): string {
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;
}

function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = (h * 60 + m + mins) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/* =========================================================
   CLASS LADDERS
========================================================= */

export const classLadder: Record<
  TransportMode,
  { code: string; label: string }[]
> = {
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
    { code: "TOKEN", label: "Single Token" },
    { code: "DAYPASS", label: "Day Pass" },
  ],
  ferry: [
    { code: "DECK", label: "Deck Seat" },
    { code: "CABIN", label: "Cabin" },
  ],
};

export const racWlClasses = ["GEN", "SL", "3A", "2A"];

export function supportsRacWl(
  mode: string,
  classCode: string,
): boolean {
  return (
    mode === "train" &&
    racWlClasses.includes(classCode.split(" ")[0])
  );
}

/* =========================================================
   ROUTE NETWORKS
   EXACTLY 30 UNIQUE ROUTES PER MODE.
   No route is reused between modes.
========================================================= */

type DemoRoute = {
  from: Station;
  to: Station;
};

function buildUniqueRoutes(
  seed: string,
  count: number,
  excluded: Set<string> = new Set(),
): DemoRoute[] {
  const result: DemoRoute[] = [];
  const used = new Set<string>();

  const orderedFrom = [...stations].sort(
    (a, b) => hash(seed + a.code) - hash(seed + b.code),
  );

  const orderedTo = [...stations].sort(
    (a, b) => hash(seed + "-to-" + a.code) - hash(seed + "-to-" + b.code),
  );

  for (const from of orderedFrom) {
    for (const to of orderedTo) {
      if (result.length >= count) return result;
      if (from.code === to.code) continue;

      const key = `${from.code}-${to.code}`;
      if (used.has(key) || excluded.has(key)) continue;

      used.add(key);
      result.push({ from, to });
    }
  }

  return result;
}

const allUsedRoutes = new Set<string>();

function getModeRoutes(
  mode: Exclude<TransportMode, "hotel">,
  count = 30,
): DemoRoute[] {
  const routes = buildUniqueRoutes(
    `Transit-India-${mode}`,
    count,
    allUsedRoutes,
  );

  for (const r of routes) {
    allUsedRoutes.add(`${r.from.code}-${r.to.code}`);
  }

  return routes;
}

export const uniqueTrainRoutes = getModeRoutes("train", 30);
export const uniqueBusRoutes = getModeRoutes("bus", 30);
export const uniqueFlightRoutes = getModeRoutes("flight", 30);
export const uniqueMetroRoutes = getModeRoutes("metro", 30);
export const uniqueFerryRoutes = getModeRoutes("ferry", 30);

export const modeRoutes: Record<
  Exclude<TransportMode, "hotel">,
  DemoRoute[]
> = {
  train: uniqueTrainRoutes,
  bus: uniqueBusRoutes,
  flight: uniqueFlightRoutes,
  metro: uniqueMetroRoutes,
  ferry: uniqueFerryRoutes,
};

/* =========================================================
   HOTEL DESTINATIONS
   50 DESTINATIONS
========================================================= */

export type HotelProperty = {
  id: string;
  name: string;
  destinationId: string;
  city: string;
  state: string;
  area: string;
  rating: number;
  distanceKm: number;
  priceFrom: number;
  category: "Budget" | "Standard" | "Premium" | "Luxury";
  amenities: string[];
  previewImages: readonly string[];
};

export type HotelDestination = {
  id: string;
  city: string;
  state: string;
  landmark: string;
  description: string;
  hotels: HotelProperty[];
};

export const famousHotelDestinations: HotelDestination[] = [
  {
    id: "hotel-delhi",
    city: "Delhi",
    state: "Delhi",
    landmark: "India Gate",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    landmark: "Gateway of India",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    landmark: "Bengaluru Palace",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    landmark: "Marina Beach",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-kolkata",
    city: "Kolkata",
    state: "West Bengal",
    landmark: "Victoria Memorial",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    landmark: "Charminar",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-pune",
    city: "Pune",
    state: "Maharashtra",
    landmark: "Shaniwar Wada",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    landmark: "Sabarmati Ashram",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    landmark: "Amber Fort",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-agra",
    city: "Agra",
    state: "Uttar Pradesh",
    landmark: "Taj Mahal",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-varanasi",
    city: "Varanasi",
    state: "Uttar Pradesh",
    landmark: "Dashashwamedh Ghat",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-goa",
    city: "Goa",
    state: "Goa",
    landmark: "Baga Beach",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-udaipur",
    city: "Udaipur",
    state: "Rajasthan",
    landmark: "Lake Pichola",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-manali",
    city: "Manali",
    state: "Himachal Pradesh",
    landmark: "Solang Valley",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-srinagar",
    city: "Srinagar",
    state: "Jammu & Kashmir",
    landmark: "Dal Lake",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-kochi",
    city: "Kochi",
    state: "Kerala",
    landmark: "Fort Kochi",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-mysuru",
    city: "Mysuru",
    state: "Karnataka",
    landmark: "Mysore Palace",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-amritsar",
    city: "Amritsar",
    state: "Punjab",
    landmark: "Golden Temple",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-rishikesh",
    city: "Rishikesh",
    state: "Uttarakhand",
    landmark: "Laxman Jhula",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-dehradun",
    city: "Dehradun",
    state: "Uttarakhand",
    landmark: "Robber's Cave",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-shimla",
    city: "Shimla",
    state: "Himachal Pradesh",
    landmark: "Mall Road",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-chandigarh",
    city: "Chandigarh",
    state: "Chandigarh",
    landmark: "Rock Garden",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-jodhpur",
    city: "Jodhpur",
    state: "Rajasthan",
    landmark: "Mehrangarh Fort",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-jaisalmer",
    city: "Jaisalmer",
    state: "Rajasthan",
    landmark: "Jaisalmer Fort",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh",
    landmark: "Upper Lake",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-indore",
    city: "Indore",
    state: "Madhya Pradesh",
    landmark: "Rajwada Palace",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-lucknow",
    city: "Lucknow",
    state: "Uttar Pradesh",
    landmark: "Bara Imambara",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-patna",
    city: "Patna",
    state: "Bihar",
    landmark: "Golghar",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-ranchi",
    city: "Ranchi",
    state: "Jharkhand",
    landmark: "Dassam Falls",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-bhubaneswar",
    city: "Bhubaneswar",
    state: "Odisha",
    landmark: "Lingaraj Temple",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-puri",
    city: "Puri",
    state: "Odisha",
    landmark: "Jagannath Temple",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-guwahati",
    city: "Guwahati",
    state: "Assam",
    landmark: "Kamakhya Temple",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-shillong",
    city: "Shillong",
    state: "Meghalaya",
    landmark: "Umiam Lake",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-gangtok",
    city: "Gangtok",
    state: "Sikkim",
    landmark: "MG Marg",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-darjeeling",
    city: "Darjeeling",
    state: "West Bengal",
    landmark: "Tiger Hill",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-siliguri",
    city: "Siliguri",
    state: "West Bengal",
    landmark: "Mahananda Wildlife Sanctuary",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-visakhapatnam",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    landmark: "RK Beach",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-vijayawada",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    landmark: "Kanaka Durga Temple",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-madurai",
    city: "Madurai",
    state: "Tamil Nadu",
    landmark: "Meenakshi Temple",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-coimbatore",
    city: "Coimbatore",
    state: "Tamil Nadu",
    landmark: "Marudamalai Temple",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-mangaluru",
    city: "Mangaluru",
    state: "Karnataka",
    landmark: "Panambur Beach",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-kozhikode",
    city: "Kozhikode",
    state: "Kerala",
    landmark: "Kozhikode Beach",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-thiruvananthapuram",
    city: "Thiruvananthapuram",
    state: "Kerala",
    landmark: "Kovalam Beach",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-nashik",
    city: "Nashik",
    state: "Maharashtra",
    landmark: "Sula Vineyards",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-aurangabad",
    city: "Aurangabad",
    state: "Maharashtra",
    landmark: "Ajanta Caves",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-nagpur",
    city: "Nagpur",
    state: "Maharashtra",
    landmark: "Deekshabhoomi",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-surat",
    city: "Surat",
    state: "Gujarat",
    landmark: "Dumas Beach",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-vadodara",
    city: "Vadodara",
    state: "Gujarat",
    landmark: "Laxmi Vilas Palace",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-rajkot",
    city: "Rajkot",
    state: "Gujarat",
    landmark: "Kaba Gandhi No Delo",
    description: "Popular destination with nearby attractions and local experiences.",
  },
  {
    id: "hotel-kota",
    city: "Kota",
    state: "Rajasthan",
    landmark: "Seven Wonders Park",
    description: "Popular destination with nearby attractions and local experiences.",
  }
].map((destination) => {
  const areas = [
    "Central District",
    "City Centre",
    "Heritage Quarter",
    "Tourist Zone",
  ];

  const categories: HotelProperty["category"][] = [
    "Budget",
    "Standard",
    "Premium",
    "Luxury",
  ];

  const basePrices = [1299, 2199, 3999, 6999];

  const hotels: HotelProperty[] = categories.map((category, index) => {
    const seed = `${destination.id}-${index}`;
    const brand = pick(seed, hotelBrands);
    const area = areas[index];

    return {
      id: `${destination.id}-hotel-${index + 1}`,
      name: `${brand} ${destination.city}`,
      destinationId: destination.id,
      city: destination.city,
      state: destination.state,
      area,
      rating: Number((4.0 + (hash(seed) % 10) / 10).toFixed(1)),
      distanceKm: Number((0.8 + (hash(seed + "km") % 35) / 10).toFixed(1)),
      priceFrom:
        basePrices[index] +
        (hash(seed + "price") % 8) * 250,
      category,
      amenities: [
        "Free Wi-Fi",
        "24-hour front desk",
        index >= 1 ? "Breakfast included" : "Parking",
        index >= 2 ? "Swimming pool" : "Room service",
      ],
      previewImages: hotelPreviewImages,
    };
  });

  return {
    ...destination,
    hotels,
  };
});

/* Flat hotel list is useful for hotel cards, filters and autocomplete. */
export const allHotels: HotelProperty[] =
  famousHotelDestinations.flatMap((d) => d.hotels);

/* =========================================================
   HOTEL LOOKUP
========================================================= */

export function findHotelDestination(
  location?: string,
): HotelDestination | undefined {
  const q = location?.trim().toLowerCase();
  if (!q) return undefined;

  return famousHotelDestinations.find(
    (d) =>
      d.city.toLowerCase() === q ||
      d.city.toLowerCase().includes(q),
  );
}

export function hotelsNearLocation(
  location: string,
): HotelProperty[] {
  return (
    findHotelDestination(location)?.hotels ?? []
  );
}

/* =========================================================
   ROUTE POOL
========================================================= */

function routePoolFor(
  mode: Exclude<TransportMode, "hotel">,
): DemoRoute[] {
  return modeRoutes[mode];
}

/* =========================================================
   RESULT GENERATOR
========================================================= */

const slotStart: Record<string, number> = {
  early: 2,
  morning: 6,
  afternoon: 13,
  night: 19,
};

export function generateResults(
  mode: TransportMode,
  from: Station,
  to: Station,
  date: Date,
  slot = "morning",
  count = mode === "hotel" ? 4 : 30,
  nonce = "",
): Segment[] {
  /* =======================================================
     HOTEL SEARCH
     IMPORTANT: Hotel has ONE location, never From → To.
  ======================================================= */

  if (mode === "hotel") {
    const requestedLocation =
      to?.city || from?.city || "";

    const destination =
      findHotelDestination(requestedLocation) ??
      famousHotelDestinations[
        hash(`${requestedLocation}-${date.toISOString().slice(0, 10)}-${nonce}`) %
          famousHotelDestinations.length
      ];

    return destination.hotels.slice(0, Math.max(4, count)).map(
      (hotel, index) => {
        const seed = `${hotel.id}-${date.toISOString().slice(0, 10)}-${nonce}`;
        const availableRooms = 2 + (hash(seed) % 18);

        const options = classLadder.hotel.map(
          ({ code, label }) => ({
            code,
            label,
            fare: Math.round(
              (hotel.priceFrom *
                (classMultiplier[code] ?? 1) *
                priceFactors({
                  date,
                  departHour: 14,
                  seatShare: availableRooms / 20,
                  seed: seed + code,
                })) /
                5,
            ) * 5,
            available: Math.max(
              1,
              availableRooms - index,
            ),
            probability: 92 + (hash(seed + code) % 8),
          }),
        );

        return {
          id: seed,
          mode: "hotel",
          name: hotel.name,
          code: `HTL-${1000 + (hash(seed) % 9000)}`,
          operator: hotel.category,

          /* NO FROM / TO FOR HOTELS */
          from: undefined,
          fromCode: undefined,
          to: undefined,
          toCode: undefined,

          location: `${hotel.city} · ${hotel.area}`,
          locationId: destination.id,

          previewImage:
            hotel.previewImages[
              index % hotel.previewImages.length
            ],
          previewImages: hotel.previewImages,

          depart: "14:00",
          arrive: "11:00",
          durationMins: 1440,
          duration: "1 night",
          distanceKm: hotel.distanceKm,

          tags: [
            hotel.city,
            hotel.area,
            `${hotel.distanceKm} km from ${destination.landmark}`,
            ...hotel.amenities.slice(0, 2),
          ],

          options,
        };
      },
    );
  }

  /* =======================================================
     NORMAL TRANSPORT SEARCH
     Each mode reads ONLY its own 30-route pool.
  ======================================================= */

  const routes = routePoolFor(mode);
  const actualCount = Math.min(
    Math.max(1, count),
    routes.length,
  );

  const dayKey = date.toISOString().slice(0, 10);
  const startHour = slotStart[slot] ?? 6;

  return Array.from({ length: actualCount }, (_, i) => {
    const selectedRoute = routes[i % routes.length];
    const routeFrom = selectedRoute.from;
    const routeTo = selectedRoute.to;

    const km = distanceKm(routeFrom, routeTo);
    const demand = demandIndex(routeFrom, routeTo, date);

    const seed =
      `${mode}-${routeFrom.code}-${routeTo.code}-${dayKey}-${i}-${nonce}`;

    const depart =
      `${String((startHour + i * 2) % 24).padStart(2, "0")}:` +
      pick(seed + "min", ["05", "10", "25", "40", "55"]);

    const departHour = Number(depart.slice(0, 2));
    const ladder = classLadder[mode];

    const buildOptions = (
      fareKm: number,
      base: number,
      capacity: (code: string) => number,
      probability: (
        code: string,
        available: number,
      ) => number,
    ) =>
      ladder.map(({ code, label }) => {
        const available = capacity(code);
        const factor = priceFactors({
          date,
          departHour,
          seatShare: Math.min(
            1,
            available / (available + 20),
          ),
          seed: seed + code,
        });

        return {
          code,
          label,
          fare: computeFare(
            fareKm,
            code,
            demand,
            base,
            factor,
          ),
          available,
          probability: probability(code, available),
        };
      });

    const common = {
      id: seed,
      mode,
      from: routeFrom.city,
      fromCode: routeFrom.code,
      to: routeTo.city,
      toCode: routeTo.code,
      distanceKm: km,
      tags: [] as string[],
    };

    if (mode === "flight") {
      const mins = Math.round(km / 12 + 45);
      const airline = pick(seed, airlines);

      return {
        ...common,
        name: airline,
        code: `${airline.slice(0, 2).toUpperCase()}-${300 + (hash(seed) % 600)}`,
        operator: airline,
        depart,
        arrive: addMinutes(depart, mins),
        durationMins: mins,
        duration: fmtDuration(mins),
        previewImage: flightPreview,
        tags: pick(seed + "tags", [
          ["Non-stop"],
          ["Non-stop", "Cabin bag included"],
          ["1 stop"],
        ]),
        options: buildOptions(
          km,
          0.42,
          (c) => 2 + (hash(seed + c) % (c === "BUSINESS" ? 12 : 40)),
          (c) => 90 + (hash(seed + c) % 10),
        ),
      };
    }

    if (mode === "metro") {
      const line = pick(seed, metroLines);
      const mins = 18 + (hash(seed) % 40);

      return {
        ...common,
        name: `${line} · ${routeFrom.city} Metro`,
        code: `MTR-${10 + (hash(seed) % 80)}`,
        depart,
        arrive: addMinutes(depart, mins),
        durationMins: mins,
        duration: fmtDuration(mins),
        previewImage: metroPreview,
        distanceKm: 4 + (hash(seed) % 30),
        tags: [
          "Every 5 min",
          "Air-conditioned",
          "City rapid transit",
        ],
        options: buildOptions(
          20,
          1.4,
          () => 400,
          () => 100,
        ),
      };
    }

    if (mode === "ferry") {
      const operator = pick(seed, ferryOperators);
      const mins = 60 + (hash(seed) % 240);

      return {
        ...common,
        name: `${operator} Crossing`,
        code: `FRY-${100 + (hash(seed) % 400)}`,
        operator,
        depart,
        arrive: addMinutes(depart, mins),
        durationMins: mins,
        duration: fmtDuration(mins),
        previewImage: ferryPreview,
        distanceKm: Math.max(1, Math.round(km / 6)),
        tags: [
          "Sea route",
          "Snacks onboard",
          "Coastal service",
        ],
        options: buildOptions(
          Math.max(1, Math.round(km / 6)),
          1.1,
          (c) => 10 + (hash(seed + c) % 90),
          (c) => 88 + (hash(seed + c) % 12),
        ),
      };
    }

    if (mode === "bus") {
      const operator = pick(seed, busOperators);
      const mins = Math.round(km / 0.72 + 30);

      return {
        ...common,
        name: operator,
        code: `BUS-${1000 + (hash(seed) % 9000)}`,
        operator,
        depart,
        arrive: addMinutes(depart, mins),
        durationMins: mins,
        duration: fmtDuration(mins),
        previewImage: busPreview,
        tags: pick(seed + "tags", [
          ["A/C Sleeper"],
          ["Volvo Multi-Axle"],
          ["Live tracking", "Charging point"],
        ]),
        options: buildOptions(
          km,
          0.5,
          () => 4 + (hash(seed) % 32),
          (_c, available) => Math.min(99, 55 + available),
        ),
      };
    }

    /* TRAIN */
    const mins = Math.round(km / 0.9 + 40);
    const name =
      `${pick(seed, trainPrefix)} ${pick(seed + "suffix", trainSuffix)}`;

    return {
      ...common,
      name,
      code: String(11000 + (hash(seed) % 8000)),
      depart,
      arrive: addMinutes(depart, mins),
      durationMins: mins,
      duration: fmtDuration(mins),
      previewImage: trainPreview,
      tags: pick(seed + "tags", [
        ["Pantry car"],
        ["Fastest on route"],
        ["Bio-toilets", "Charging point"],
        ["Tatkal available"],
      ]),
      options: buildOptions(
        km,
        0.62,
        (c) =>
          c === "GEN"
            ? 60 + (hash(seed + c) % 120)
            : c === "1A"
              ? 4 + (hash(seed + c) % 14)
              : 10 + (hash(seed + c) % 46),
        (c, available) =>
          Math.min(
            99,
            30 + available + (hash(seed + c) % 20),
          ),
      ),
    };
  });
}

/* =========================================================
   STATION SEARCH
========================================================= */

export function findStation(code: string): Station {
  return stations.find((s) => s.code === code) ?? stations[0];
}

export function searchStations(
  term: string,
  exclude?: string,
  limit = 30,
): Station[] {
  const q = term.trim().toLowerCase();

  return stations
    .filter((s) => s.code !== exclude)
    .filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q),
    )
    .slice(0, limit);
}

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

export const routeCountFor = (s: Station): number =>
  30 + (hash(s.code) % 20);

/* =========================================================
   ROUTE PREVIEW
========================================================= */

export type RouteMode = TransportMode | "cab";

export type RouteStop = {
  name: string;
  at: string;
  km: number;
  halt?: string;
};

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

const networkNodes: Record<
  RouteMode,
  { network: string; nodes: string[]; note: string }
> = {
  train: {
    network: "Bharat Rail Grid",
    nodes: [
      "Amaravati Jn",
      "Sundarpur",
      "Kesari Road",
      "Neelgarh",
      "Chandrapeth",
      "Vishrampur",
      "Rohitgarh",
      "Tapikund",
      "Malwan Jn",
      "Devnagar",
    ],
    note: "Rail corridor with scheduled commercial halts.",
  },
  bus: {
    network: "Highway Coach Network",
    nodes: [
      "Ratanpur Toll",
      "Ghatpara Bypass",
      "Sundar Dhaba Stop",
      "Kalyani Chowk",
      "Barwani Crossing",
      "Panchvati Plaza",
      "Hilltop Junction",
      "Nandgaon Depot",
    ],
    note: "Expressway coach route with road stops.",
  },
  flight: {
    network: "Skyway Air Corridor",
    nodes: [
      "Waypoint ALFA-21",
      "Waypoint TARA-08",
      "Sector Delta Handoff",
      "Waypoint NOVA-14",
      "Coastal Handoff Point",
    ],
    note: "Air corridor waypoints; no passenger boarding at intermediate points.",
  },
  metro: {
    network: "City Rapid Metro Network",
    nodes: [
      "Ashoka Park",
      "Civic Centre",
      "Lotus Garden",
      "Textile Market",
      "Riverbank",
      "University Gate",
      "Tech Corridor",
      "Old Fort",
    ],
    note: "Urban metro network with frequent services.",
  },
  ferry: {
    network: "Coastal Ferry Lanes",
    nodes: [
      "Pearl Jetty",
      "Mangrove Channel",
      "Lighthouse Point",
      "Turtle Bay Anchorage",
      "Palm Islet Dock",
    ],
    note: "Sea lane with tide-dependent timings.",
  },
  cab: {
    network: "Cabber Street Grid",
    nodes: [
      "Ring Road Signal",
      "Market Underpass",
      "Green Avenue",
      "Sector 9 Circle",
      "Riverside Flyover",
    ],
    note: "Door-to-door road route.",
  },
  hotel: {
    network: "Hotel Access Route",
    nodes: ["Station Exit Gate", "Hotel Shuttle Bay"],
    note: "Short access route to the selected property.",
  },
};

const routeStyle: Record<
  RouteMode,
  { kind: string; stopWord: string }
> = {
  train: { kind: "Rail corridor", stopWord: "halts" },
  bus: { kind: "Highway road route", stopWord: "stops" },
  flight: { kind: "Air corridor", stopWord: "waypoints" },
  metro: { kind: "Urban metro line", stopWord: "stations" },
  ferry: { kind: "Sea lane", stopWord: "jetties" },
  cab: { kind: "Road route", stopWord: "checkpoints" },
  hotel: { kind: "Access route", stopWord: "points" },
};

function pickMany(
  seed: string,
  arr: string[],
  n: number,
): string[] {
  const out: string[] = [];
  let h = hash(seed);
  const pool = [...arr];

  for (let i = 0; i < n && pool.length; i++) {
    h = Math.imul(h ^ (i + 1), 16777619);
    out.push(pool.splice(Math.abs(h) % pool.length, 1)[0]);
  }

  return out;
}

export function terminalName(
  mode: RouteMode,
  city: string,
  role: "origin" | "destination" = "origin",
): string {
  switch (mode) {
    case "metro":
      return `${city} Central Metro Station`;
    case "flight":
      return `${city} Airport`;
    case "ferry":
      return `${city} Ferry Terminal`;
    case "bus":
      return role === "origin"
        ? `${city} ISBT`
        : `${city} Central Bus Terminal`;
    case "hotel":
      return role === "origin"
        ? `${city} Arrival Point`
        : `${city} Hotel District`;
    case "cab":
      return role === "origin"
        ? "Your pickup point"
        : `${city} drop point`;
    default:
      return `${city} Junction`;
  }
}

export function buildRoutePreview(
  mode: RouteMode,
  origin: string,
  destination: string,
  km: number,
  totalMins: number,
  seed: string,
): RoutePreview {
  const net = networkNodes[mode];

  const maxStops =
    mode === "hotel"
      ? 1
      : mode === "flight"
        ? 2
        : mode === "metro"
          ? 6
          : 4;

  const count = Math.max(
    1,
    1 + (hash(seed + mode) % maxStops),
  );

  const mids = pickMany(
    seed + mode,
    net.nodes,
    count,
  );

  const start = terminalName(mode, origin, "origin");
  const end = terminalName(mode, destination, "destination");

  const stops: RouteStop[] = [
    { name: start, at: "00:00", km: 0, halt: "Source" },
    ...mids.map((name, i) => {
      const frac = (i + 1) / (mids.length + 1);
      const m = Math.round(totalMins * frac);

      return {
        name,
        at: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
        km: Math.round(km * frac),
        halt:
          mode === "flight"
            ? "Overfly"
            : mode === "metro"
              ? "1 min"
              : `${2 + (hash(seed + name) % 8)} min`,
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
    note: `${routeStyle[mode].kind} with ${routeStyle[mode].stopWord}. ${net.note}`,
  };
}

/* =========================================================
   SEAT / ROOM ALLOCATION
========================================================= */

export function allocateSeats(
  seed: string,
  mode: string,
  classCode: string,
  passengers: number,
): string[] {
  const n = Math.max(1, passengers);
  const cls = classCode.split(" ")[0];

  if (mode === "hotel") {
    return Array.from(
      { length: n },
      (_, i) => `Room ${101 + ((hash(seed) + i) % 40)}`,
    );
  }

  if (mode === "metro") {
    return Array.from(
      { length: n },
      (_, i) => `Pass ${i + 1}`,
    );
  }

  if (cls === "GEN") {
    return Array.from(
      { length: n },
      () => "Unreserved",
    );
  }

  const berths = ["LB", "MB", "UB", "SL", "SU"];
  const start = 1 + (hash(seed + cls) % 56);

  return Array.from({ length: n }, (_, i) => {
    const num = ((start + i - 1) % 72) + 1;
    return mode === "train"
      ? `${num} ${berths[(hash(seed + num) + i) % berths.length]}`
      : String(num);
  });
}

/* =========================================================
   SEAT STATE
========================================================= */

export type SeatState = {
  available: number;
  label: string;
  tone: "ok" | "low" | "rac" | "wl" | "sold";
};

export function seatState(
  seed: string,
  base: number,
  minutes = 0,
  opts: { racWl?: boolean } = {},
): SeatState {
  const perMinute = 1 + (hash(seed) % 3);
  const left = Math.max(
    0,
    base - Math.floor(minutes) * perMinute,
  );

  if (left > 12) {
    return {
      available: left,
      label: `${left} Available`,
      tone: "ok",
    };
  }

  if (left > 4) {
    return {
      available: left,
      label: `${left} Available`,
      tone: "low",
    };
  }

  if (!opts.racWl) {
    return left > 0
      ? {
          available: left,
          label: `${left} Available`,
          tone: "low",
        }
      : {
          available: 0,
          label: "Sold Out",
          tone: "sold",
        };
  }

  if (left > 0) {
    return {
      available: left,
      label: `RAC ${left}`,
      tone: "rac",
    };
  }

  const wl = 1 + (hash(seed + "wl") % 48);

  return wl > 40
    ? {
        available: 0,
        label: "Sold Out",
        tone: "sold",
      }
    : {
        available: 0,
        label: `WL ${wl}`,
        tone: "wl",
      };
}

/* =========================================================
   SERVICE DISRUPTIONS
========================================================= */

export const cancellationReasons = [
  "Track maintenance block",
  "Operational reasons",
  "Adverse weather advisory",
  "Rolling-stock unavailability",
  "Low occupancy on this date",
  "Crew rostering shortfall",
];

export function serviceDisruption(seed: string): {
  cancelled: boolean;
  reason?: string;
  delayMins: number;
} {
  const h = hash(seed + "disrupt");
  const cancelled = h % 9 === 0;

  return {
    cancelled,
    reason: cancelled
      ? cancellationReasons[h % cancellationReasons.length]
      : undefined,
    delayMins: cancelled
      ? 0
      : [0, 0, 0, 10, 25, 45][h % 6],
  };
}

/* =========================================================
   MEALS
========================================================= */

export const mealCategories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Regional",
  "Healthy",
  "Kids",
  "Jain",
  "Vegetarian",
  "Non Vegetarian",
  "Special",
  "Beverages",
  "Desserts",
] as const;

export type MealCategory =
  (typeof mealCategories)[number];

export type Meal = {
  id: string;
  name: string;
  category: MealCategory;
  price: number;
  veg: boolean;
  note?: string;
};

export const meals: Meal[] = [
  { id: "poha", name: "Kanda Poha with Sev", category: "Breakfast", price: 90, veg: true },
  { id: "idli", name: "Idli Sambar (3 pcs)", category: "Breakfast", price: 110, veg: true },
  { id: "paratha", name: "Aloo Paratha & Curd", category: "Breakfast", price: 130, veg: true },
  { id: "omelette", name: "Masala Omelette & Toast", category: "Breakfast", price: 140, veg: false },
  { id: "upma", name: "Rava Upma", category: "Breakfast", price: 85, veg: true },

  { id: "veg-thali", name: "Veg Thali", category: "Lunch", price: 180, veg: true },
  { id: "rajma-rice", name: "Rajma Chawal Bowl", category: "Lunch", price: 160, veg: true },
  { id: "chicken-thali", name: "Chicken Thali", category: "Lunch", price: 260, veg: false },
  { id: "dal-khichdi", name: "Dal Khichdi & Kadhi", category: "Lunch", price: 150, veg: true },

  { id: "paneer-dinner", name: "Paneer Butter Masala & Roti", category: "Dinner", price: 230, veg: true },
  { id: "chicken-curry", name: "Chicken Curry & Rice", category: "Dinner", price: 250, veg: false },
  { id: "veg-pulao", name: "Veg Pulao & Raita", category: "Dinner", price: 170, veg: true },

  { id: "samosa", name: "Samosa (2 pcs)", category: "Snacks", price: 60, veg: true },
  { id: "sandwich", name: "Grilled Veg Sandwich", category: "Snacks", price: 110, veg: true },
  { id: "cutlet", name: "Chicken Cutlet", category: "Snacks", price: 130, veg: false },
  { id: "bhel", name: "Roasted Bhel Cup", category: "Snacks", price: 70, veg: true },

  { id: "misal", name: "Kolhapuri Misal Pav", category: "Regional", price: 140, veg: true },
  { id: "litti", name: "Litti Chokha (4 pcs)", category: "Regional", price: 150, veg: true },
  { id: "dhokla", name: "Khaman Dhokla Box", category: "Regional", price: 100, veg: true },
  { id: "fish-curry", name: "Coastal Fish Curry Meal", category: "Regional", price: 290, veg: false },
  { id: "chettinad", name: "Chettinad Veg Meal", category: "Regional", price: 200, veg: true },

  { id: "salad", name: "Sprout & Quinoa Salad", category: "Healthy", price: 160, veg: true },
  { id: "millet", name: "Millet Khichdi (low oil)", category: "Healthy", price: 170, veg: true },
  { id: "grilled-chicken", name: "Grilled Chicken & Greens", category: "Healthy", price: 280, veg: false },
  { id: "soup", name: "Clear Vegetable Soup", category: "Healthy", price: 90, veg: true },

  { id: "kids-pasta", name: "Kids Cheesy Pasta", category: "Kids", price: 150, veg: true },
  { id: "kids-nuggets", name: "Kids Nuggets & Fries", category: "Kids", price: 180, veg: false },
  { id: "kids-combo", name: "Kids Mini Meal Box", category: "Kids", price: 140, veg: true },

  { id: "jain-thali", name: "Jain Thali (no onion/garlic)", category: "Jain", price: 190, veg: true },
  { id: "jain-paratha", name: "Jain Paratha Combo", category: "Jain", price: 150, veg: true },

  { id: "paneer-wrap", name: "Paneer Kathi Wrap", category: "Vegetarian", price: 140, veg: true },
  { id: "chole-bhature", name: "Chole Bhature", category: "Vegetarian", price: 170, veg: true },

  { id: "chicken-biryani", name: "Chicken Biryani", category: "Non Vegetarian", price: 260, veg: false },
  { id: "egg-curry", name: "Egg Curry Rice", category: "Non Vegetarian", price: 190, veg: false },
  { id: "mutton-biryani", name: "Mutton Biryani", category: "Non Vegetarian", price: 320, veg: false },

  { id: "diabetic", name: "Low-GI Diabetic Meal", category: "Special", price: 210, veg: true, note: "Prototype special meal" },
  { id: "gluten-free", name: "Gluten-Free Meal Box", category: "Special", price: 230, veg: true },
  { id: "festive", name: "Festive Special Thali", category: "Special", price: 350, veg: true },
  { id: "senior", name: "Senior Citizen Soft Meal", category: "Special", price: 180, veg: true },

  { id: "masala-chai", name: "Masala Chai", category: "Beverages", price: 40, veg: true },
  { id: "filter-coffee", name: "Filter Coffee", category: "Beverages", price: 50, veg: true },
  { id: "cold-coffee", name: "Cold Coffee", category: "Beverages", price: 90, veg: true },
  { id: "buttermilk", name: "Spiced Buttermilk", category: "Beverages", price: 45, veg: true },
  { id: "water", name: "Packaged Water 1L", category: "Beverages", price: 20, veg: true },

  { id: "gulab", name: "Gulab Jamun (2 pcs)", category: "Desserts", price: 70, veg: true },
  { id: "rasmalai", name: "Rasmalai Cup", category: "Desserts", price: 90, veg: true },
  { id: "icecream", name: "Kulfi Falooda", category: "Desserts", price: 110, veg: true },
  { id: "brownie", name: "Walnut Brownie", category: "Desserts", price: 120, veg: true },
];
