import { stations, type Station } from "@/lib/dummy-data";

export type DestKind = "Railway Station" | "Airport" | "Bus Terminal";

export type VehicleType = "Bike" | "Auto" | "Sedan" | "SUV";

export const vehicleCatalog: {
  type: VehicleType;
  capacity: string;
  perKm: number;
  base: number;
  speedKmph: number;
}[] = [
  { type: "Bike", capacity: "1 rider", perKm: 6, base: 15, speedKmph: 32 },
  { type: "Auto", capacity: "3 riders", perKm: 11, base: 25, speedKmph: 26 },
  { type: "Sedan", capacity: "4 riders", perKm: 15, base: 45, speedKmph: 34 },
  { type: "SUV", capacity: "6 riders", perKm: 20, base: 60, speedKmph: 30 },
];

export const savedAddresses = [
  "Home — 12 Lotus Enclave, Sector 21",
  "Office — WeWork, MG Road Tower B",
  "Mom's place — 4th Cross, Indiranagar",
];

const airportNames = ["International Airport", "Domestic Terminal", "Airport Cargo Gate"];
const busTerminalNames = ["ISBT", "Central Bus Depot", "Interstate Bus Terminal"];

export function destinationsFor(kind: DestKind, city: string) {
  if (kind === "Railway Station") {
    return stations.filter((s) => s.city === city).map((s) => ({ id: s.code, label: s.name, sub: `${s.city} · ${s.state}` }));
  }
  if (kind === "Airport") {
    return airportNames.map((n, i) => ({ id: `${city}-air-${i}`, label: `${city} ${n}`, sub: "Airport" }));
  }
  return busTerminalNames.map((n, i) => ({ id: `${city}-bus-${i}`, label: `${city} ${n}`, sub: "Bus Terminal" }));
}

export const cityList = Array.from(new Set(stations.map((s) => s.city))).sort();

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic fictional pickup->destination distance in km (2 - 24 km, last-mile scale). */
export function lastMileDistance(pickup: string, destinationId: string) {
  const key = `${pickup}|${destinationId}`;
  return Number((2 + (hash(key) % 2200) / 100).toFixed(1));
}

export function fareFor(km: number, vehicle: (typeof vehicleCatalog)[number]) {
  return Math.round(vehicle.base + km * vehicle.perKm);
}

export function etaFor(km: number, vehicle: (typeof vehicleCatalog)[number]) {
  return Math.max(3, Math.round((km / vehicle.speedKmph) * 60) + 3);
}

const firstNames = ["Ravi", "Suresh", "Ajay", "Vikram", "Manoj", "Deepak", "Anil", "Sunil", "Rakesh", "Naveen", "Farhan", "Iqbal", "Joseph", "Thomas", "Karthik"];
const lastNames = ["Kumar", "Singh", "Yadav", "Sharma", "Reddy", "Nair", "Khan", "Das", "Verma", "Gupta"];

export function driverFor(seedStr: string, vehicleType: VehicleType) {
  const h = hash(seedStr);
  const name = `${firstNames[h % firstNames.length]} ${lastNames[(h >> 3) % lastNames.length]}`;
  const rating = (4 + ((h >> 5) % 10) / 10).toFixed(1);
  const trips = 300 + (h % 4200);
  const models: Record<VehicleType, string[]> = {
    Bike: ["Hero Splendor", "TVS Raider", "Bajaj Pulsar"],
    Auto: ["Bajaj RE Compact", "Piaggio Ape", "Mahindra Treo"],
    Sedan: ["Maruti Dzire", "Honda Amaze", "Hyundai Aura"],
    SUV: ["Mahindra XUV300", "Toyota Innova", "Kia Seltos"],
  };
  const model = models[vehicleType][h % models[vehicleType].length];
  const plate = `${["DL", "MH", "KA", "TN", "UP"][h % 5]}-${String(1 + (h % 99)).padStart(2, "0")}-${String.fromCharCode(65 + (h % 26))}${String.fromCharCode(65 + ((h >> 2) % 26))}-${1000 + (h % 8999)}`;
  const otp = String(1000 + (h % 8999));
  return { name, rating, trips, model, plate, otp, initials: name.split(" ").map((p) => p[0]).join("") };
}
