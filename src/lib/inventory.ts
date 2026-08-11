/*
IMPORTANT:
This file is an adapter around dummy-data.ts.

ALL ROUTE DATA IS OWNED BY dummy-data.ts.

Separate transport catalogs:
- Train  -> trainRoutes
- Bus    -> busRoutes
- Flight -> flightRoutes
- Metro  -> metroRoutes
- Ferry  -> ferryRoutes
- Hotel  -> allHotels

This file does NOT create or maintain duplicate route catalogs.

DO NOT add route arrays here.
*/

/* ============================================================
IMPORTS
============================================================ */

import {
  trainStations,
  busStands,
  airports,
  metroStations,
  seaports,

  type Station,

  trainRoutes as trainRouteCatalog,
  busRoutes as busRouteCatalog,
  flightRoutes as flightRouteCatalog,
  metroRoutes as metroRouteCatalog,
  ferryRoutes as ferryRouteCatalog,

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

/* ============================================================
CENTRAL STATION LOOKUP
============================================================ */

/*
Each transport mode owns its own route catalog.

The combined stations list exists ONLY for:
- station search
- station lookup
- legacy components

It does NOT create routes.
*/

export const stations: Station[] = Array.from(
  new Map(
    [
      ...trainStations,
      ...busStands,
      ...airports,
      ...metroStations,
      ...seaports,
    ].map((station) => [station.code, station]),
  ).values(),
);

/* ============================================================
SEPARATE ROUTE CATALOGS
============================================================ */

/*
IMPORTANT:

These are direct references to dummy-data.ts.

There is NO shared route array.

Train -> trainRouteCatalog
Bus -> busRouteCatalog
Flight -> flightRouteCatalog
Metro -> metroRouteCatalog
Ferry -> ferryRouteCatalog
*/

const modeRoutes = {
  train: trainRouteCatalog,
  bus: busRouteCatalog,
  flight: flightRouteCatalog,
  metro: metroRouteCatalog,
  ferry: ferryRouteCatalog,
} as const;

/* ============================================================
ROUTE LOCATION VALIDATION
============================================================ */

/*
A valid route MUST have different origin and destination.

We check:

1. Station code
2. Station name
3. City + state

This prevents accidental routes such as:

Delhi -> Delhi
NDLS -> NDLS
Mumbai -> Mumbai
New Delhi Railway Station -> New Delhi Railway Station

This is only a validation/filtering layer.

It does NOT create any new routes.
*/

function isSameLocation(
  from: Station,
  to: Station,
): boolean {
  const fromCode =
    from.code.trim().toLowerCase();

  const toCode =
    to.code.trim().toLowerCase();

  if (
    fromCode &&
    toCode &&
    fromCode === toCode
  ) {
    return true;
  }

  const fromName =
    from.name.trim().toLowerCase();

  const toName =
    to.name.trim().toLowerCase();

  if (
    fromName &&
    toName &&
    fromName === toName
  ) {
    return true;
  }

  const fromCity =
    from.city.trim().toLowerCase();

  const toCity =
    to.city.trim().toLowerCase();

  const fromState =
    from.state.trim().toLowerCase();

  const toState =
    to.state.trim().toLowerCase();

  if (
    fromCity &&
    toCity &&
    fromState &&
    toState &&
    fromCity === toCity &&
    fromState === toState
  ) {
    return true;
  }

  return false;
}

/*
Returns true only when From and To
are genuinely different locations.
*/

function isValidRoute(
  route: {
    from: Station;
    to: Station;
  },
): boolean {
  return !isSameLocation(
    route.from,
    route.to,
  );
}

/* ============================================================
FILTERED ROUTE CATALOGS
============================================================ */

/*
The original catalogs remain owned by dummy-data.ts.

These filtered catalogs are used by this adapter.

Any route where From and To are the same
location is automatically excluded.
*/

const filteredModeRoutes = {
  train:
    modeRoutes.train.filter(
      isValidRoute,
    ),

  bus:
    modeRoutes.bus.filter(
      isValidRoute,
    ),

  flight:
    modeRoutes.flight.filter(
      isValidRoute,
    ),

  metro:
    modeRoutes.metro.filter(
      isValidRoute,
    ),

  ferry:
    modeRoutes.ferry.filter(
      isValidRoute,
    ),
} as const;

/* ============================================================
RE-EXPORT COMMON DATA / HELPERS
============================================================ */

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
COMMON INVENTORY GENERATOR
============================================================ */

const DEMO_DATE =
  new Date("2026-08-20T00:00:00");

/*
Generate booking/search results from ONLY the selected
transport mode's filtered route catalog.

Example:

generateInventoryResults("train")
    -> only valid train routes

generateInventoryResults("bus")
    -> only valid bus routes

generateInventoryResults("metro")
    -> only valid metro routes

No cross-mode route fallback is performed.
*/

function generateInventoryResults(
  mode: Exclude<
    TransportMode,
    "hotel"
  >,
): Segment[] {
  const routes =
    filteredModeRoutes[mode];

  return routes.flatMap(
    (route, index) =>
      generateResults(
        mode,
        route.from,
        route.to,
        DEMO_DATE,
        "morning",
        1,
        `inventory-${mode}-${index}-${route.from.code}-${route.to.code}`,
      ),
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

/*
Determine train category from the train name.
*/

function getTrainType(
  segment: Segment,
): Train["type"] {
  const name =
    segment.name.toLowerCase();

  if (
    name.includes("rajdhani")
  ) {
    return "Rajdhani";
  }

  if (
    name.includes("shatabdi")
  ) {
    return "Shatabdi";
  }

  if (
    name.includes("vande bharat") ||
    name.includes("tejas")
  ) {
    return "Vande Bharat";
  }

  if (
    name.includes("superfast") ||
    name.includes("vega") ||
    name.includes("sapphire") ||
    name.includes("kaveri")
  ) {
    return "Superfast";
  }

  return "Express";
}

/*
Convert common Segment data into the legacy Train shape
expected by existing UI components.
*/

function convertTrain(
  segment: Segment,
): Train {
  return {
    id:
      segment.id,

    name:
      segment.name,

    number:
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

    type:
      getTrainType(segment),

    tags:
      segment.tags,

    classes:
      segment.options.map(
        (option) => ({
          code:
            option.code,

          fare:
            option.fare,

          available:
            option.available,

          probability:
            option.probability,
        }),
      ),
  };
}

/*
TRAIN INVENTORY

Source:
dummy-data.ts -> trainRoutes

Same-location routes are excluded.
*/

export const trains: Train[] =
  generateInventoryResults(
    "train",
  ).map(convertTrain);

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

/*
Determine bus type from route tags.
*/

function getBusType(
  segment: Segment,
): BusRoute["busType"] {
  const tags =
    segment.tags.map(
      (tag) =>
        tag.toLowerCase(),
    );

  if (
    tags.some(
      (tag) =>
        tag.includes("volvo"),
    )
  ) {
    return "Volvo AC";
  }

  if (
    tags.some(
      (tag) =>
        tag.includes("sleeper"),
    )
  ) {
    return "AC Sleeper";
  }

  if (
    tags.some(
      (tag) =>
        tag.includes("a/c") ||
        tag.includes("ac"),
    )
  ) {
    return "AC Seater";
  }

  return "Non-AC Seater";
}

/*
Convert Segment into legacy BusRoute shape.
*/

function convertBus(
  segment: Segment,
): BusRoute {
  const cheapest =
    segment.options.reduce(
      (best, current) =>
        current.fare <
        best.fare
          ? current
          : best,
      segment.options[0],
    );

  return {
    id:
      segment.id,

    operator:
      segment.operator ??
      segment.name,

    busNumber:
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

    busType:
      getBusType(segment),

    fare:
      cheapest?.fare ?? 0,

    seatsAvailable:
      cheapest?.available ?? 0,

    amenities:
      segment.tags,
  };
}

/*
BUS INVENTORY

Source:
dummy-data.ts -> busRoutes

Same-location routes are excluded.
*/

export const busRoutes: BusRoute[] =
  generateInventoryResults(
    "bus",
  ).map(convertBus);

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

/*
Convert flight option code into cabin name.
*/

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

/*
Convert Segment into legacy FlightRoute shape.
*/

function convertFlight(
  segment: Segment,
): FlightRoute {
  const economy =
    segment.options.find(
      (option) =>
        option.code ===
        "ECONOMY",
    ) ??
    segment.options[0];

  const stopTag =
    segment.tags.find(
      (tag) =>
        tag
          .toLowerCase()
          .includes("stop"),
    );

  const stops =
    stopTag &&
    stopTag
      .toLowerCase()
      .includes("2")
      ? 2
      : stopTag &&
          stopTag
            .toLowerCase()
            .includes("1")
        ? 1
        : 0;

  return {
    id:
      segment.id,

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
        economy?.code ??
          "ECONOMY",
      ),
  };
}

/*
FLIGHT INVENTORY

Source:
dummy-data.ts -> flightRoutes

Same-location routes are excluded.
*/

export const flightRoutes:
  FlightRoute[] =
  generateInventoryResults(
    "flight",
  ).map(convertFlight);

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

/*
Convert Metro Segment into the UI-compatible MetroRoute.
*/

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
        option.code ===
        "TOKEN",
    ) ??
    segment.options[0];

  const frequency =
    segment.tags.find(
      (tag) =>
        tag
          .toLowerCase()
          .includes("every"),
    ) ??
    "Every 5 min";

  return {
    id:
      segment.id,

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

    frequency,

    interchanges:
      0,
  };
}

/*
METRO INVENTORY

Source:
dummy-data.ts -> metroRoutes

IMPORTANT:
Metro does NOT fall back to train routes.

Same-location routes are excluded.
*/

export const metroRoutes:
  MetroRoute[] =
  generateInventoryResults(
    "metro",
  ).map(convertMetro);

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

/*
Deterministically determine ferry type.
*/

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

/*
Convert Segment into legacy FerryRoute shape.
*/

function convertFerry(
  segment: Segment,
): FerryRoute {
  const deck =
    segment.options.find(
      (option) =>
        option.code ===
        "DECK",
    ) ??
    segment.options[0];

  return {
    id:
      segment.id,

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

/*
FERRY INVENTORY

Source:
dummy-data.ts -> ferryRoutes

Same-location routes are excluded.
*/

export const ferryRoutes:
  FerryRoute[] =
  generateInventoryResults(
    "ferry",
  ).map(convertFerry);

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

/*
Convert central HotelProperty data into the legacy Hotel
shape used by the existing UI.
*/

function hotelToLegacy(
  hotel: HotelProperty,
  index: number,
): Hotel {
  const roomTypes:
    Hotel["roomType"][] = [
      "Deluxe Room",
      "Premium Room",
      "Executive Room",
      "Family Room",
    ];

  const roomType =
    roomTypes[
      index %
        roomTypes.length
    ];

  const originalPrice =
    Math.round(
      (hotel.priceFrom * 1.25) /
        50,
    ) * 50;

  const previewImages =
    hotel.previewImages ??
    [];

  const image =
    previewImages.length > 0
      ? previewImages[
          index %
            previewImages.length
        ]
      : "";

  return {
    id:
      hotel.id,

    name:
      hotel.name,

    city:
      hotel.city,

    state:
      hotel.state,

    area:
      hotel.area,

    rating:
      hotel.rating,

    reviews:
      500 +
      index * 137,

    pricePerNight:
      hotel.priceFrom,

    originalPrice,

    image,

    amenities:
      hotel.amenities,

    tags: [
      hotel.category,
      hotel.city,
      "Popular",
    ],

    roomType,

    refundable:
      hotel.category !==
      "Luxury",

    breakfastIncluded:
      hotel.amenities.some(
        (item) =>
          item
            .toLowerCase()
            .includes(
              "breakfast",
            ),
      ),
  };
}

/*
HOTEL INVENTORY

Hotels are NOT routes.

They are location/property based.
*/

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
STATION SEARCH
============================================================ */

export function findStation(
  code: string,
): Station {
  return (
    stations.find(
      (station) =>
        station.code ===
        code,
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
        station.code !==
        exclude,
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

export type MealCategory =
  (typeof meals)[number]["category"];

export const mealCategories:
  MealCategory[] =
  Array.from(
    new Set(
      meals.map(
        (meal) =>
          meal.category,
      ),
    ),
  );

/* ============================================================
ROUTE COUNTS
============================================================ */

export const routeCounts = {
  train:
    filteredModeRoutes.train.length,

  bus:
    filteredModeRoutes.bus.length,

  flight:
    filteredModeRoutes.flight.length,

  metro:
    filteredModeRoutes.metro.length,

  ferry:
    filteredModeRoutes.ferry.length,
};

/*
Hotels return property count instead of route count.
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
  Exclude<
    TransportMode,
    "hotel"
  >;

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
      Math.round(
        totalMins,
      ),
    );

  const hours =
    Math.floor(
      mins / 60,
    );

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
Builds a UI route preview.

IMPORTANT:
This is ONLY a visual preview.

It does not modify or generate the actual route catalog.

Same origin/destination is rejected.
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
    train:
      "Indian Rail Network",

    bus:
      "Bharat Bus Network",

    flight:
      "Indian Air Network",

    metro:
      "Metro Network",

    ferry:
      "Coastal Ferry Network",
  };

  const normalizedOrigin =
    origin.trim().toLowerCase();

  const normalizedDestination =
    destination.trim().toLowerCase();

  const samePreviewLocation =
    normalizedOrigin !== "" &&
    normalizedDestination !== "" &&
    normalizedOrigin ===
      normalizedDestination;

  const safeKm =
    Math.max(
      0,
      Math.round(km),
    );

  const safeMins =
    Math.max(
      0,
      Math.round(
        totalMins,
      ),
    );

  /*
  If the preview receives the same From/To,
  do not create intermediate route points.
  */

  if (samePreviewLocation) {
    return {
      networkName:
        networkNames[mode],

      distanceKm: 0,

      duration: "0 min",

      stops: [
        {
          name: origin,
          at: "Same Location",
          km: 0,
        },
      ],

      note:
        "Invalid route preview: From and To must be different locations.",
    };
  }

  const intermediateCount =
    safeKm >= 900
      ? 2
      : safeKm >= 450
        ? 1
        : 0;

  const stops:
    RoutePreviewStop[] = [
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
    name:
      destination,

    at:
      "Arrival",

    km:
      safeKm,
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
DIRECT ROUTE ACCESS
============================================================ */

/*
These exports point to the FILTERED corresponding
dummy-data.ts catalogs.

Same-location routes are excluded.
*/

export const trainRoutes =
  filteredModeRoutes.train;

export const uniqueTrainRoutes =
  filteredModeRoutes.train;

export const uniqueBusRoutes =
  filteredModeRoutes.bus;

export const uniqueFlightRoutes =
  filteredModeRoutes.flight;

export const uniqueMetroRoutes =
  filteredModeRoutes.metro;

export const uniqueFerryRoutes =
  filteredModeRoutes.ferry;

/* ============================================================
MODE SUMMARY
============================================================ */

export const inventorySummary = {
  trains:
    trains.length,

  buses:
    busRoutes.length,

  flights:
    flightRoutes.length,

  metros:
    metroRoutes.length,

  ferries:
    ferryRoutes.length,

  hotels:
    hotels.length,

  routes: {
    train:
      filteredModeRoutes.train.length,

    bus:
      filteredModeRoutes.bus.length,

    flight:
      filteredModeRoutes.flight.length,

    metro:
      filteredModeRoutes.metro.length,

    ferry:
      filteredModeRoutes.ferry.length,
  },
};

/* ============================================================
ROUTE INTEGRITY CHECKS
============================================================ */

/*
Create a unique key for a directed route.

Example:

NDLS -> BCT

is different from:

BCT -> NDLS
*/

function routeKey(
  fromCode: string,
  toCode: string,
): string {
  return `${fromCode}-${toCode}`;
}

/*
Get all route keys for one transport mode.
*/

function getRouteKeys(
  mode: Exclude<
    TransportMode,
    "hotel"
  >,
): Set<string> {
  return new Set(
    filteredModeRoutes[mode].map(
      (route) =>
        routeKey(
          route.from.code,
          route.to.code,
        ),
    ),
  );
}

/*
Route integrity information.

This lets development code inspect whether
different transport catalogs accidentally contain
the exact same directed route.
*/

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
Returns true if the exact same directed route exists
in more than one transport mode.

Example:

Train: NDLS -> MMCT
Bus:   NDLS -> MMCT

=> true

Train: NDLS -> MMCT
Bus:   MMCT -> NDLS

=> false

NOTE:
This function checks cross-mode duplicates.
It does NOT mean that a train and flight are
forbidden from serving the same city pair.
*/

export function hasCrossModeRouteDuplicate():
  boolean {
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
        routeIntegrity[
          modes[i]
        ];

      const second =
        routeIntegrity[
          modes[j]
        ];

      for (
        const key of first
      ) {
        if (
          second.has(key)
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

/* ============================================================
SAME LOCATION ROUTE CHECK
============================================================ */

/*
Returns the number of invalid routes still present
in the ORIGINAL dummy-data catalogs.

This is useful during development/debugging.

Expected result after fixing dummy-data.ts:

0
*/

export function countSameLocationRoutes(): number {
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

  let count = 0;

  for (
    const mode of modes
  ) {
    for (
      const route of modeRoutes[mode]
    ) {
      if (
        isSameLocation(
          route.from,
          route.to,
        )
      ) {
        count++;
      }
    }
  }

  return count;
}

/*
Development helper.

Returns the exact invalid routes so they can be
identified and corrected in dummy-data.ts.
*/

export function getSameLocationRoutes() {
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

  return modes.flatMap(
    (mode) =>
      modeRoutes[mode]
        .filter(
          (route) =>
            isSameLocation(
              route.from,
              route.to,
            ),
        )
        .map((route) => ({
          mode,

          from:
            route.from.name,

          fromCode:
            route.from.code,

          to:
            route.to.name,

          toCode:
            route.to.code,

          route,
        })),
  );
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

  countSameLocationRoutes,

  getSameLocationRoutes,
};
