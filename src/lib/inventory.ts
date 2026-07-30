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
  SL: 1, "3A": 2.6, "2A": 3.7, "1A": 6.2, CC: 3.1, EC: 5.6,
  SEATER: 0.9, SLEEPER: 1.3, VOLVO: 1.8,
  ECONOMY: 9, BUSINESS: 22,
  STANDARD: 1, DELUXE: 1.6, SUITE: 2.8,
  TOKEN: 1, DAYPASS: 1.4,
  DECK: 1, CABIN: 2.2,
};

/** Dynamic fare: distance × class × demand, rounded to a believable figure. */
export function computeFare(km: number, classCode: string, demand: number, base = 0.62) {
  const mult = classMultiplier[classCode] ?? 1;
  const raw = (60 + km * base) * mult * demand;
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

export function generateResults(
  mode: TransportMode,
  from: Station,
  to: Station,
  date: Date,
  slot = "morning",
  count = 5,
): Segment[] {
  const km = distanceKm(from, to);
  const demand = demandIndex(from, to, date);
  const dayKey = date.toISOString().slice(0, 10);
  const startHour = slotStart[slot] ?? 6;

  return Array.from({ length: count }).map((_, i) => {
    const seed = `${mode}-${from.code}-${to.code}-${dayKey}-${i}`;
    const depart = `${String((startHour + i * 2) % 24).padStart(2, "0")}:${pick(seed + "min", ["05", "10", "25", "40", "55"])}`;

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
        options: (["ECONOMY", "BUSINESS"] as const).map((c) => ({
          code: c,
          label: c === "ECONOMY" ? "Economy" : "Business",
          fare: computeFare(km, c, demand, 0.42),
          available: 2 + (hash(seed + c) % 40),
          probability: 90 + (hash(seed + c) % 10),
        })),
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
        options: (["STANDARD", "DELUXE", "SUITE"] as const).map((c) => ({
          code: c,
          label: c.charAt(0) + c.slice(1).toLowerCase(),
          fare: computeFare(60, c, demand, 12),
          available: 1 + (hash(seed + c) % 12),
          probability: 92 + (hash(seed + c) % 8),
        })),
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
        options: (["TOKEN", "DAYPASS"] as const).map((c) => ({
          code: c,
          label: c === "TOKEN" ? "Single token" : "Day pass",
          fare: computeFare(20, c, demand, 1.4),
          available: 400,
          probability: 100,
        })),
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
        options: (["DECK", "CABIN"] as const).map((c) => ({
          code: c,
          label: c === "DECK" ? "Deck seat" : "Cabin",
          fare: computeFare(Math.round(km / 6), c, demand, 1.1),
          available: 10 + (hash(seed + c) % 90),
          probability: 88 + (hash(seed + c) % 12),
        })),
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
        options: (["SEATER", "SLEEPER", "VOLVO"] as const).map((c) => ({
          code: c,
          label: c.charAt(0) + c.slice(1).toLowerCase(),
          fare: computeFare(km, c, demand, 0.5),
          available: hash(seed + c) % 32,
          probability: 60 + (hash(seed + c) % 40),
        })),
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
      options: berthClasses.map((c) => ({
        code: c,
        label: { SL: "Sleeper", "3A": "AC 3-Tier", "2A": "AC 2-Tier", "1A": "AC First" }[c] ?? c,
        fare: computeFare(km, c, demand),
        available: hash(seed + c) % 46,
        probability: 30 + (hash(seed + c) % 70),
      })),
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

export const meals = [
  { id: "veg-thali", name: "Veg Thali", category: "Vegetarian", price: 180 },
  { id: "paneer-wrap", name: "Paneer Kathi Wrap", category: "Vegetarian", price: 140 },
  { id: "chicken-biryani", name: "Chicken Biryani", category: "Non Vegetarian", price: 260 },
  { id: "egg-curry", name: "Egg Curry Rice", category: "Non Vegetarian", price: 190 },
  { id: "samosa", name: "Samosa (2 pcs)", category: "Snacks", price: 60 },
  { id: "sandwich", name: "Grilled Sandwich", category: "Snacks", price: 110 },
  { id: "masala-chai", name: "Masala Chai", category: "Drinks", price: 40 },
  { id: "cold-coffee", name: "Cold Coffee", category: "Drinks", price: 90 },
];

export const mealCategories = ["Vegetarian", "Non Vegetarian", "Snacks", "Drinks"] as const;
