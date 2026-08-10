/*
IMPORTANT:
This file is now an adapter around dummy-data.ts.

Route generation is handled centrally by dummy-data.ts.
Therefore:

- Train routes are separate
- Bus routes are separate
- Flight routes are separate
- Metro routes are separate
- Ferry routes are separate
- Hotel is location based
- No transport mode shares another mode's route

Do NOT maintain duplicate route arrays here.
*/

import {
  stations,
  type Station,
  modeRoutes,
  famousHotelDestinations,
  allHotels,
  generateResults,
  allocateSeats,
  computeFare,
  demandIndex,
  distanceKm,
  meals,
  seatState,
  serviceDisruption,
  transportModes,
  type Segment,
  type TransportMode,
  type HotelProperty,
} from "./dummy-data";

export {
  allocateSeats,
  computeFare,
  demandIndex,
  distanceKm,
  generateResults,
  meals,
  seatState,
  serviceDisruption,
  transportModes,
};

/* ============================================================
COMMON HELPERS
============================================================ */

const DEMO_DATE = new Date("2026-08-20T00:00:00");

const DEFAULT_FROM =
  stations.find((s) => s.code === "NDLS") ?? stations[0];

const DEFAULT_TO =
  stations.find((s) => s.code === "JP") ??
  stations.find((s) => s.code !== DEFAULT_FROM.code) ??
  stations[1];

function generateInventoryResults(
  mode: Exclude<TransportMode, "hotel">,
): Segment[] {
  return generateResults(
    mode,
    DEFAULT_FROM,
    DEFAULT_TO,
    DEMO_DATE,
    "morning",
    modeRoutes[mode].length,
    `inventory-${mode}`,
  );
}

/* ============================================================
TRAIN INVENTORY
============================================================ */

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

  type:
    | "Rajdhani"
    | "Shatabdi"
    | "Superfast"
    | "Express"
    | "Vande Bharat";

  tags?: string[];
};

function getTrainType(segment: Segment): Train["type"] {
  const name = segment.name.toLowerCase();

  if (name.includes("rajdhani")) {
    return "Rajdhani";
  }

  if (name.includes("shatabdi")) {
    return "Shatabdi";
  }

  if (name.includes("tejas")) {
    return "Vande Bharat";
  }

  if (
    name.includes("vega") ||
    name.includes("sapphire") ||
    name.includes("kaveri")
  ) {
    return "Superfast";
  }

  return "Express";
}

function convertTrain(segment: Segment): Train {
  return {
    id: segment.id,

    name: segment.name,
    number: segment.code,

    from: segment.from ?? "",
    fromCode: segment.fromCode ?? "",

    to: segment.to ?? "",
    toCode: segment.toCode ?? "",

    depart: segment.depart,
    arrive: segment.arrive,

    duration: segment.duration,

    type: getTrainType(segment),

    tags: segment.tags,

    classes: segment.options.map((option) => ({
      code: option.code,
      fare: option.fare,
      available: option.available,
      probability: option.probability,
    })),
  };
}

/*
All train inventory.

Route count comes directly from dummy-data.ts.
*/

export const trains: Train[] =
  generateInventoryResults("train").map(convertTrain);

/* ============================================================
BUS INVENTORY
============================================================ */

export type BusRoute = {
  id: string;

  operator: string;
  busNumber: string;

  from: string;
  fromCode: string;

  to: string;
  toCode: string;

  depart: string;
  arrive: string;

  duration: string;

  busType:
    | "AC Sleeper"
    | "AC Seater"
    | "Volvo AC"
    | "Non-AC Seater";

  fare: number;

  seatsAvailable: number;

  amenities: string[];
};

function getBusType(
  segment: Segment,
): BusRoute["busType"] {
  const tags = segment.tags.map((tag) =>
    tag.toLowerCase(),
  );

  if (
    tags.some((tag) =>
      tag.includes("volvo"),
    )
  ) {
    return "Volvo AC";
  }

  if (
    tags.some((tag) =>
      tag.includes("sleeper"),
    )
  ) {
    return "AC Sleeper";
  }

  if (
    tags.some((tag) =>
      tag.includes("a/c"),
    )
  ) {
    return "AC Seater";
  }

  return "Non-AC Seater";
}

function convertBus(
  segment: Segment,
): BusRoute {
  const cheapest =
    segment.options.reduce(
      (best, current) =>
        current.fare < best.fare
          ? current
          : best,
      segment.options[0],
    );

  return {
    id: segment.id,

    operator:
      segment.operator ??
      segment.name,

    busNumber: segment.code,

    from: segment.from ?? "",
    fromCode: segment.fromCode ?? "",

    to: segment.to ?? "",
    toCode: segment.toCode ?? "",

    depart: segment.depart,
    arrive: segment.arrive,

    duration: segment.duration,

    busType: getBusType(segment),

    fare: cheapest?.fare ?? 0,

    seatsAvailable:
      cheapest?.available ?? 0,

    amenities: segment.tags,
  };
}

export const busRoutes: BusRoute[] =
  generateInventoryResults("bus").map(
    convertBus,
  );

/* ============================================================
FLIGHT INVENTORY
============================================================ */

export type FlightRoute = {
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

  fare: number;

  seatsAvailable: number;

  cabin:
    | "Economy"
    | "Premium Economy"
    | "Business";
};

function getFlightCabin(
  code: string,
): FlightRoute["cabin"] {
  switch (code) {
    case "BUSINESS":
      return "Business";

    case "PREMIUM_ECONOMY":
      return "Premium Economy";

    default:
      return "Economy";
  }
}

function convertFlight(
  segment: Segment,
): FlightRoute {
  const economy =
    segment.options.find(
      (option) =>
        option.code === "ECONOMY",
    ) ??
    segment.options[0];

  const stopTag = segment.tags.find(
    (tag) =>
      tag.toLowerCase().includes("stop"),
  );

  const stops =
    stopTag === "1 stop"
      ? 1
      : 0;

  return {
    id: segment.id,

    airline:
      segment.operator ??
      segment.name,

    flightNumber:
      segment.code,

    from:
      segment.from ?? "",

    fromCode:
      segment.fromCode ?? "",

    to:
      segment.to ?? "",

    toCode:
      segment.toCode ?? "",

    depart:
      segment.depart,

    arrive:
      segment.arrive,

    duration:
      segment.duration,

    stops,

    fare:
      economy?.fare ?? 0,

    seatsAvailable:
      economy?.available ?? 0,

    cabin:
      getFlightCabin(
        economy?.code ?? "ECONOMY",
      ),
  };
}

export const flightRoutes: FlightRoute[] =
  generateInventoryResults("flight").map(
    convertFlight,
  );

/* ============================================================
METRO INVENTORY
============================================================ */

export type MetroRoute = {
  id: string;

  metro: string;
  line: string;

  from: string;
  fromCode: string;

  to: string;
  toCode: string;

  duration: string;

  fare: number;

  frequency: string;

  interchanges: number;
};

function convertMetro(
  segment: Segment,
): MetroRoute {
  const parts =
    segment.name.split(" · ");

  const line =
    parts[0] ??
    "Metro Line";

  const token =
    segment.options.find(
      (option) =>
        option.code === "TOKEN",
    ) ??
    segment.options[0];

  return {
    id: segment.id,

    metro:
      segment.from
        ? `${segment.from} Metro`
        : "City Metro",

    line,

    from:
      segment.from ?? "",

    fromCode:
      segment.fromCode ?? "",

    to:
      segment.to ?? "",

    toCode:
      segment.toCode ?? "",

    duration:
      segment.duration,

    fare:
      token?.fare ?? 20,

    frequency:
      segment.tags.find(
        (tag) =>
          tag
            .toLowerCase()
            .includes("every"),
      ) ??
      "Every 5 min",

    interchanges: 0,
  };
}

export const metroRoutes: MetroRoute[] =
  generateInventoryResults("metro").map(
    convertMetro,
  );

/* ============================================================
FERRY INVENTORY
============================================================ */

export type FerryRoute = {
  id: string;

  operator: string;
  ferryName: string;

  from: string;
  fromCode: string;

  to: string;
  toCode: string;

  depart: string;
  arrive: string;

  duration: string;

  fare: number;

  seatsAvailable: number;

  ferryType:
    | "High Speed"
    | "Passenger Ferry"
    | "Catamaran";
};

function getFerryType(
  segment: Segment,
): FerryRoute["ferryType"] {
  const seed =
    segment.id.length +
    segment.name.length;

  if (seed % 3 === 0) {
    return "Catamaran";
  }

  if (seed % 2 === 0) {
    return "High Speed";
  }

  return "Passenger Ferry";
}

function convertFerry(
  segment: Segment,
): FerryRoute {
  const deck =
    segment.options.find(
      (option) =>
        option.code === "DECK",
    ) ??
    segment.options[0];

  return {
    id: segment.id,

    operator:
      segment.operator ??
      "Coastal Bharat",

    ferryName:
      segment.name,

    from:
      segment.from ?? "",

    fromCode:
      segment.fromCode ?? "",

    to:
      segment.to ?? "",

    toCode:
      segment.toCode ?? "",

    depart:
      segment.depart,

    arrive:
      segment.arrive,

    duration:
      segment.duration,

    fare:
      deck?.fare ?? 0,

    seatsAvailable:
      deck?.available ?? 0,

    ferryType:
      getFerryType(segment),
  };
}

export const ferryRoutes: FerryRoute[] =
  generateInventoryResults("ferry").map(
    convertFerry,
  );

/* ============================================================
HOTEL INVENTORY
============================================================ */

export type Hotel = {
  id: string;

  name: string;

  city: string;
  state: string;
  area: string;

  rating: number;
  reviews: number;

  pricePerNight: number;
  originalPrice: number;

  image: string;

  amenities: string[];

  tags: string[];

  roomType:
    | "Deluxe Room"
    | "Premium Room"
    | "Executive Room"
    | "Family Room";

  refundable: boolean;

  breakfastIncluded: boolean;
};

function hotelToLegacy(
  hotel: HotelProperty,
  index: number,
): Hotel {
  const roomTypes: Hotel["roomType"][] = [
    "Deluxe Room",
    "Premium Room",
    "Executive Room",
    "Family Room",
  ];

  const roomType =
    roomTypes[
      index % roomTypes.length
    ];

  const originalPrice =
    Math.round(
      (hotel.priceFrom * 1.25) / 50,
    ) * 50;

  return {
    id: hotel.id,

    name: hotel.name,

    city: hotel.city,
    state: hotel.state,
    area: hotel.area,

    rating: hotel.rating,

    reviews:
      500 +
      index * 137,

    pricePerNight:
      hotel.priceFrom,

    originalPrice,

    /*
     * Existing hotel UI may expect a string path.
     * dummy-data also exposes real preview images separately.
     */
    image:
      hotel.previewImages[
        index %
          hotel.previewImages.length
      ],

    amenities:
      hotel.amenities,

    tags: [
      hotel.category,
      hotel.city,
      "Popular",
    ],

    roomType,

    refundable:
      hotel.category !== "Luxury",

    breakfastIncluded:
      hotel.amenities.some(
        (item) =>
          item
            .toLowerCase()
            .includes("breakfast"),
      ),
  };
}

export const hotels: Hotel[] =
  allHotels.map(
    hotelToLegacy,
  );

/* ============================================================
HOTEL DESTINATIONS
============================================================ */

export const hotelDestinations =
  famousHotelDestinations.map(
    (destination) => ({
      city:
        destination.city,

      state:
        destination.state,

      area:
        destination.landmark,
    }),
  );

/* ============================================================
PASSENGERS
============================================================ */

export type Passenger = {
  id: string;

  name: string;

  age: number;

  gender:
    | "M"
    | "F"
    | "O";

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

export const savedPassengers:
  Passenger[] = [
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

/*
Re-export stations from dummy-data.ts so old imports such as:

import { stations } from "./inventory";

continue working.
*/

export { stations };

/* ============================================================
POPULAR STATIONS
============================================================ */

export const popularStationCodes = [
  "NDLS",
  "MMCT",
  "MAS",
  "HWH",
  "SBC",
  "SC",
  "JP",
  "PUNE",
  "ADI",
  "LKO",
];

/* ============================================================
SEARCH HELPERS
============================================================ */

export function findStation(
  code: string,
): Station {
  return (
    stations.find(
      (station) =>
        station.code === code,
    ) ??
    stations[0]
  );
}

export function searchStations(
  term: string,
  exclude?: string,
  limit = 30,
): Station[] {
  const query =
    term
      .trim()
      .toLowerCase();

  return stations
    .filter(
      (station) =>
        station.code !== exclude,
    )
    .filter(
      (station) =>
        !query ||
        station.name
          .toLowerCase()
          .includes(query) ||
        station.code
          .toLowerCase()
          .includes(query) ||
        station.city
          .toLowerCase()
          .includes(query) ||
        station.state
          .toLowerCase()
          .includes(query),
    )
    .slice(0, limit);
}

/* ============================================================
MEAL HELPERS
============================================================ */

/*
Meal categories are derived from dummy-data.ts.

This prevents maintaining a second duplicate meal-category
database in inventory.ts.
*/

export type MealCategory =
  (typeof meals)[number]["category"];

export const mealCategories: MealCategory[] = [
  ...new Set(
    meals.map(
      (meal) => meal.category,
    ),
  ),
];

/* ============================================================
ROUTE COUNTS
============================================================ */

export const routeCounts = {
  train: modeRoutes.train.length,
  bus: modeRoutes.bus.length,
  flight: modeRoutes.flight.length,
  metro: modeRoutes.metro.length,
  ferry: modeRoutes.ferry.length,
};

/*
Returns the number of routes for a transport mode.

Hotels are location/property based, so for hotel this returns
the number of available hotel properties rather than a route count.
*/

export function routeCountFor(
  mode: TransportMode,
): number {
  if (mode === "hotel") {
    return hotels.length;
  }

  return routeCounts[mode];
}

/* ============================================================
ROUTE PREVIEW
============================================================ */

export type RoutePreviewMode =
  Exclude<TransportMode, "hotel">;

export type RoutePreviewStop = {
  name: string;
  at: string;
  km: number;
  halt?: string;
};

export type RoutePreview = {
  networkName: string;
  distanceKm: number;
  duration: string;
  stops: RoutePreviewStop[];
  note: string;
};

function formatRouteDuration(
  totalMins: number,
): string {
  const mins =
    Math.max(
      0,
      Math.round(totalMins),
    );

  const hours =
    Math.floor(mins / 60);

  const remaining =
    mins % 60;

  if (hours === 0) {
    return `${remaining} min`;
  }

  if (remaining === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remaining} min`;
}

/*
Builds a deterministic route preview for the booking UI.

The actual route catalog remains owned by dummy-data.ts.
This function only converts route information into the
display structure expected by RoutePreview.tsx.
*/

export function buildRoutePreview(
  mode: RoutePreviewMode,
  origin: string,
  destination: string,
  km: number,
  totalMins: number,
  seed: string,
): RoutePreview {
  const networkNames: Record<
    RoutePreviewMode,
    string
  > = {
    train: "Indian Rail Network",
    bus: "Bharat Bus Network",
    flight: "Indian Air Network",
    metro: "Metro Network",
    ferry: "Coastal Ferry Network",
  };

  const safeKm =
    Math.max(
      0,
      Math.round(km),
    );

  const safeMins =
    Math.max(
      0,
      Math.round(totalMins),
    );

  /*
   * Keep previews simple for short routes and add
   * intermediate points only for longer journeys.
   */
  const intermediateCount =
    safeKm >= 900
      ? 2
      : safeKm >= 450
        ? 1
        : 0;

  const stops: RoutePreviewStop[] = [
    {
      name: origin,
      at: "Departure",
      km: 0,
    },
  ];

  for (
    let i = 1;
    i <= intermediateCount;
    i++
  ) {
    const progress =
      i /
      (intermediateCount + 1);

    const stopKm =
      Math.round(
        safeKm * progress,
      );

    const stopMins =
      Math.round(
        safeMins * progress,
      );

    stops.push({
      name:
        mode === "metro"
          ? `Metro Point ${i}`
          : `Transit Point ${i}`,

      at:
        `${stopMins} min`,

      km:
        stopKm,

      halt:
        mode === "train"
          ? "2 min halt"
          : undefined,
    });
  }

  stops.push({
    name: destination,
    at: "Arrival",
    km: safeKm,
  });

  return {
    networkName:
      networkNames[mode],

    distanceKm:
      safeKm,

    duration:
      formatRouteDuration(
        safeMins,
      ),

    stops,

    note:
      `Route preview generated for ${origin} → ${destination}. ` +
      `Preview seed: ${seed}.`,
  };
}

/* ============================================================
ROUTE ARRAYS — DIRECT ACCESS
============================================================ */

export const trainRoutes =
  modeRoutes.train;

export const uniqueTrainRoutes =
  modeRoutes.train;

export const uniqueBusRoutes =
  modeRoutes.bus;

export const uniqueFlightRoutes =
  modeRoutes.flight;

export const uniqueMetroRoutes =
  modeRoutes.metro;

export const uniqueFerryRoutes =
  modeRoutes.ferry;

/* ============================================================
MODE SUMMARY
============================================================ */

export const inventorySummary = {
  trains: trains.length,
  buses: busRoutes.length,
  flights: flightRoutes.length,
  metros: metroRoutes.length,
  ferries: ferryRoutes.length,
  hotels: hotels.length,

  routes: {
    train:
      modeRoutes.train.length,

    bus:
      modeRoutes.bus.length,

    flight:
      modeRoutes.flight.length,

    metro:
      modeRoutes.metro.length,

    ferry:
      modeRoutes.ferry.length,
  },
};

/*
These checks make accidental duplicate route reuse
between transport modes visible during development.
*/

function routeKey(
  fromCode: string,
  toCode: string,
): string {
  return `${fromCode}-${toCode}`;
}

function getRouteKeys(
  mode: Exclude<
    TransportMode,
    "hotel"
  >,
): Set<string> {
  return new Set(
    modeRoutes[mode].map(
      (route) =>
        routeKey(
          route.from.code,
          route.to.code,
        ),
    ),
  );
}

export const routeIntegrity = {
  train:
    getRouteKeys("train"),

  bus:
    getRouteKeys("bus"),

  flight:
    getRouteKeys("flight"),

  metro:
    getRouteKeys("metro"),

  ferry:
    getRouteKeys("ferry"),
};

/*
Returns true when the same exact directed route
is shared by two different transport modes.
*/

export function hasCrossModeRouteDuplicate(): boolean {
  const modes: Exclude<
    TransportMode,
    "hotel"
  >[] = [
    "train",
    "bus",
    "flight",
    "metro",
    "ferry",
  ];

  for (
    let i = 0;
    i < modes.length;
    i++
  ) {
    for (
      let j = i + 1;
      j < modes.length;
      j++
    ) {
      const first =
        routeIntegrity[modes[i]];

      const second =
        routeIntegrity[modes[j]];

      for (const key of first) {
        if (second.has(key)) {
          return true;
        }
      }
    }
  }

  return false;
}

/* ============================================================
DEFAULT EXPORT
============================================================ */

export default {
  trains,
  busRoutes,
  flightRoutes,
  metroRoutes,
  ferryRoutes,
  hotels,
  stations,
  savedPassengers,
  popularStationCodes,
  routeCounts,
  inventorySummary,
  mealCategories,
  routeCountFor,
  buildRoutePreview,
};
