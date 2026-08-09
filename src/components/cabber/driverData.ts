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

/** Courier jobs are valued far higher than passenger rides (up to ₹1,00,000). */
export type CourierRequest = {
  id: string;
  sender: string;
  pickup: string;
  destination: string;
  km: number;
  eta: number;
  /** Declared value of the consignment. */
  value: number;
  /** Payable courier charge — this is what commission is calculated on. */
  fare: number;
  parcel: string;
  weightKg: number;
};

const parcelKinds = ["Documents", "Electronics", "Medical supplies", "Retail consignment", "Jewellery box", "Machine spares"];
const senderNames = ["Kiran Traders", "Sunrise Pharma", "Meera Exports", "Nova Electronics", "Anand & Sons", "Blue Ridge Retail"];

/** Courier charge: base + distance + a small 0.6% handling fee on declared value. */
export function courierFare(km: number, weightKg: number, value: number) {
  return Math.round(60 + km * 9 + weightKg * 12 + value * 0.006);
}

export function generateCourierRequests(seed: string, count = 3): CourierRequest[] {
  const destOptions = destinationsFor("Railway Station", "Delhi").concat(destinationsFor("Airport", "Delhi"));
  return Array.from({ length: count }).map((_, i) => {
    const s = `${seed}-courier-${i}`;
    const h = hash(s);
    const pickup = pickupSpots[h % pickupSpots.length];
    const dest = destOptions[(h >> 2) % destOptions.length];
    const km = lastMileDistance(pickup, dest.id + s);
    const weightKg = 1 + (h >> 5) % 25;
    // High-value consignments are rare: most jobs stay small, one in ~six is big.
    const big = h % 6 === 0;
    const value = big ? 20000 + (h % 80001) : 500 + (h % 12000);
    return {
      id: s,
      sender: senderNames[(h >> 4) % senderNames.length],
      pickup,
      destination: dest.label,
      km,
      eta: etaFor(km, vehicleCatalog[1]),
      value: Math.min(value, 100000),
      fare: courierFare(km, weightKg, Math.min(value, 100000)),
      parcel: parcelKinds[(h >> 7) % parcelKinds.length],
      weightKg,
    };
  });
}
