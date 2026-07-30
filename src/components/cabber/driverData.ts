import { destinationsFor, driverFor, etaFor, fareFor, lastMileDistance, vehicleCatalog, type VehicleType } from "./data";

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const riderNames = ["Aisha", "Rahul", "Neha", "Vivek", "Simran", "Tarun", "Divya", "Karan", "Meera", "Zoya"];
const pickupSpots = ["Green Park Metro Gate 2", "Sunrise Apartments", "Cyber Hub Gate 4", "MG Road Signal", "Lakeview Society", "Central Mall Entrance"];

export type RideRequest = {
  id: string;
  rider: string;
  pickup: string;
  destination: string;
  km: number;
  eta: number;
  fare: number;
};

export function generateRequests(vehicleType: VehicleType, seed: string, count = 3): RideRequest[] {
  const vehicle = vehicleCatalog.find((v) => v.type === vehicleType) ?? vehicleCatalog[1];
  const destOptions = destinationsFor("Railway Station", "Delhi").concat(destinationsFor("Airport", "Delhi"));
  return Array.from({ length: count }).map((_, i) => {
    const s = `${seed}-${i}`;
    const h = hash(s);
    const pickup = pickupSpots[h % pickupSpots.length];
    const dest = destOptions[(h >> 2) % destOptions.length];
    const km = lastMileDistance(pickup, dest.id + s);
    return {
      id: s,
      rider: riderNames[(h >> 4) % riderNames.length],
      pickup,
      destination: dest.label,
      km,
      eta: etaFor(km, vehicle),
      fare: fareFor(km, vehicle),
    };
  });
}

export type HistoryRow = {
  id: string;
  date: string;
  rider: string;
  route: string;
  fare: number;
  rating: number;
};

export function generateHistory(vehicleType: VehicleType, driverName: string, count = 8): HistoryRow[] {
  const vehicle = vehicleCatalog.find((v) => v.type === vehicleType) ?? vehicleCatalog[1];
  const destOptions = destinationsFor("Railway Station", "Delhi").concat(destinationsFor("Bus Terminal", "Delhi"));
  return Array.from({ length: count }).map((_, i) => {
    const s = `${driverName}-hist-${i}`;
    const h = hash(s);
    const daysAgo = i;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dest = destOptions[h % destOptions.length];
    const pickup = pickupSpots[(h >> 3) % pickupSpots.length];
    const km = lastMileDistance(pickup, dest.id + s);
    return {
      id: s,
      date: d.toISOString().slice(0, 10),
      rider: riderNames[(h >> 5) % riderNames.length],
      route: `${pickup} → ${dest.label}`,
      fare: fareFor(km, vehicle),
      rating: 4 + ((h >> 6) % 10) / 10,
    };
  });
}

export function earningsSeries(driverName: string) {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const h = hash(`${driverName}-earn-${i}`);
    return { day: d.toLocaleDateString("en-IN", { weekday: "short" }), earnings: 400 + (h % 1400) };
  });
}

export { driverFor };
