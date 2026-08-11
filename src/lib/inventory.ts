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
All transport-specific station catalogs are combined ONLY for
station search and lookup.

IMPORTANT:
Different stations in the same city are NOT considered the same.

Example:

NDLS -> New Delhi Railway Station
ANVT -> Anand Vihar Terminal

Both may belong to Delhi, but they are different stations.
*/

export const stations: Station[] = Array.from(
  new Map(
    [
      ...trainStations,
      ...busStands,
      ...airports,
      ...metroStations,
      ...seaports,
    ].map((station) => [
      station.code.trim().toUpperCase(),
      station,
    ]),
  ).values(),
);

/* ============================================================
NORMALIZATION HELPERS
============================================================ */

function normalizeText(
  value: string | null | undefined,
): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeCode(
  value: string | null | undefined,
): string {
  return (value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

/*
Create a stable station identity.

Station code is the strongest identifier.

If code is unavailable, station name is used.
*/

function stationIdentity(
  station: Station,
): string {
  const code = normalizeCode(
    station.code,
  );

  if (code) {
    return `code:${code}`;
  }

  const name = normalizeText(
    station.name,
  );

  return `name:${name}`;
}

/* ============================================================
EXACT SAME-STATION CHECK
============================================================ */

/*
IMPORTANT:

A station is considered the same ONLY when it is actually
the same station.

We DO NOT compare city + state.

Therefore:

Delhi NDLS -> Delhi ANVT
is VALID.

Delhi NDLS -> Delhi NDLS
is INVALID.

Mumbai CSMT -> Mumbai CSMT
is INVALID.

Mumbai CSMT -> Mumbai LTT
is VALID.
*/

export function isSameStation(
  from: Station,
  to: Station,
): boolean {
  const fromCode =
    normalizeCode(from.code);

  const toCode =
    normalizeCode(to.code);

  /*
  Strongest check:
  Same station code = same station.
  */
  if (
    fromCode &&
    toCode &&
    fromCode === toCode
  ) {
    return true;
  }

  /*
  Fallback:
  Same normalized station name = same station.

  We intentionally DO NOT compare city/state.
  */
  const fromName =
    normalizeText(from.name);

  const toName =
    normalizeText(to.name);

  if (
    fromName &&
    toName &&
    fromName === toName
  ) {
    return true;
  }

  return false;
}

/* ============================================================
ROUTE VALIDATION
============================================================ */

/*
A valid route MUST have two different stations.
*/

function isValidRoute(
  route: {
    from: Station;
    to: Station;
  },
): boolean {
  return !isSameStation(
    route.from,
    route.to,
  );
}

/* ============================================================
SEPARATE ROUTE CATALOGS
============================================================ */

const modeRoutes = {
  train: trainRouteCatalog,
  bus: busRouteCatalog,
  flight: flightRouteCatalog,
  metro: metroRouteCatalog,
  ferry: ferryRouteCatalog,
} as const;

/* ============================================================
FILTERED ROUTE CATALOGS
============================================================ */

/*
Only exact same-station routes are removed.

Same-city routes are NOT removed.

This is important for metro and city transport.
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

function generateInventoryResults(
  mode: Exclude<
    TransportMode,
    "hotel"
  >,
): Segment[] {
  const routes =
    filteredModeRoutes[mode];

  return routes.flatMap(
    (route, index) => {
      /*
      Final safety check.

      Even if a bad route somehow enters the filtered catalog,
      never generate an inventory result for it.
      */
      if (
        isSameStation(
          route.from,
          route.to,
        )
      ) {
        return [];
      }

      return generateResults(
        mode,
        route.from,
        route.to,
        DEMO_DATE,
        "morning",
        1,
        `inventory-${mode}-${index}-${normalizeCode(
          route.from.code,
        )}-${normalizeCode(
          route.to.code,
        )}`,
      );
    },
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
    hotel.previewImages ?? [];

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

/*
Find station by code.
*/

export function findStation(
  code: string,
): Station {
  const normalized =
    normalizeCode(code);

  const found =
    stations.find(
      (station) =>
        normalizeCode(
          station.code,
        ) === normalized,
    );

  if (found) {
    return found;
  }

  /*
  Preserve the original non-null return type
  for legacy components.
  */
  return stations[0];
}

/*
Determine whether a station is the exact station
that was selected as the From station.

IMPORTANT:

We compare station identity only.

We DO NOT compare city/state.

Therefore:

NDLS -> ANVT = allowed
NDLS -> NDLS = blocked
CSMT -> LTT = allowed
*/

function matchesExcludedStation(
  station: Station,
  exclude?: string,
): boolean {
  if (
    !exclude ||
    !exclude.trim()
  ) {
    return false;
  }

  const normalizedExclude =
    normalizeText(exclude);

  const normalizedCodeExclude =
    normalizeCode(exclude);

  const stationCode =
    normalizeCode(
      station.code,
    );

  const stationName =
    normalizeText(
      station.name,
    );

  if (
    stationCode &&
    normalizedCodeExclude &&
    stationCode ===
      normalizedCodeExclude
  ) {
    return true;
  }

  if (
    stationName &&
    stationName ===
      normalizedExclude
  ) {
    return true;
  }

  return false;
}

/*
Search stations.

IMPORTANT:

If From is NDLS, NDLS will NOT appear in To results.

But other Delhi stations CAN appear.

Example:

From:
New Delhi Railway Station (NDLS)

To:
Anand Vihar Terminal (ANVT)

=> allowed.

From:
New Delhi Railway Station (NDLS)

To:
New Delhi Railway Station (NDLS)

=> blocked.
*/

export function searchStations(
  term: string,
  exclude?: string,
  limit = 30,
): Station[] {
  const query =
    normalizeText(term);

  /*
  Resolve the excluded From station.

  The UI may pass:
  - station code
  - station name
  - city

  We intentionally use city only as a fallback to identify
  the selected station when no exact code/name is supplied.
  */
  let excludedStation:
    | Station
    | undefined;

  if (
    exclude &&
    exclude.trim()
  ) {
    const normalizedExclude =
      normalizeText(exclude);

    const normalizedCodeExclude =
      normalizeCode(exclude);

    /*
    1. Exact station code
    */
    excludedStation =
      stations.find(
        (station) =>
          normalizeCode(
            station.code,
          ) ===
          normalizedCodeExclude,
      );

    /*
    2. Exact station name
    */
    if (!excludedStation) {
      excludedStation =
        stations.find(
          (station) =>
            normalizeText(
              station.name,
            ) ===
            normalizedExclude,
        );
    }

    /*
    3. Exact city fallback.

    This is ONLY used when the UI supplies a city rather
    than a station. Once a station is found, the actual
    exclusion below still compares station identity.
    */
    if (!excludedStation) {
      excludedStation =
        stations.find(
          (station) =>
            normalizeText(
              station.city,
            ) ===
            normalizedExclude,
        );
    }
  }

  return stations
    /*
    First remove the exact selected station.

    DO NOT use city/state comparison here.
    Different stations in the same city must remain available.
    */
    .filter(
      (station) => {
        if (
          excludedStation &&
          isSameStation(
            excludedStation,
            station,
          )
        ) {
          return false;
        }

        /*
        If no station was resolved, still support the
        direct code/name exclusion.
        */
        if (
          !excludedStation &&
          matchesExcludedStation(
            station,
            exclude,
          )
        ) {
          return false;
        }

        return true;
      },
    )

    /*
    Apply search query AFTER exclusion.
    */
    .filter(
      (station) => {
        if (!query) {
          return true;
        }

        return (
          normalizeText(
            station.name,
          ).includes(query) ||

          normalizeCode(
            station.code,
          ).includes(
            normalizeCode(query),
          ) ||

          normalizeText(
            station.city,
          ).includes(query) ||

          normalizeText(
            station.state,
          ).includes(query)
        );
      },
    )

    .slice(
      0,
      limit,
    );
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
Compare From/To strings safely.

The UI may pass:

"NDLS"
"ndls"

or:

"New Delhi Railway Station"
" new   delhi railway station "

All values are normalized before comparison.
*/

function isSamePreviewLocation(
  origin: string,
  destination: string,
): boolean {
  const normalizedOrigin =
    normalizeText(origin);

  const normalizedDestination =
    normalizeText(destination);

  if (
    !normalizedOrigin ||
    !normalizedDestination
  ) {
    return false;
  }

  /*
  Exact normalized text.
  */
  if (
    normalizedOrigin ===
    normalizedDestination
  ) {
    return true;
  }

  /*
  Station/code comparison.
  */
  const originCode =
    normalizeCode(origin);

  const destinationCode =
    normalizeCode(destination);

  if (
    originCode &&
    destinationCode &&
    originCode ===
      destinationCode
  ) {
    return true;
  }

  /*
  Resolve known stations.

  This catches:

  NDLS
  vs
  New Delhi Railway Station
  */

  const originStation =
    stations.find(
      (station) =>
        (
          originCode &&
          normalizeCode(
            station.code,
          ) === originCode
        ) ||
        normalizeText(
          station.name,
        ) === normalizedOrigin,
    );

  const destinationStation =
    stations.find(
      (station) =>
        (
          destinationCode &&
          normalizeCode(
            station.code,
          ) === destinationCode
        ) ||
        normalizeText(
          station.name,
        ) === normalizedDestination,
    );

  if (
    originStation &&
    destinationStation
  ) {
    return isSameStation(
      originStation,
      destinationStation,
    );
  }

  return false;
}

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

  const samePreviewLocation =
    isSamePreviewLocation(
      origin,
      destination,
    );

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
  Never create a route preview for the exact same station.
  */
  if (
    samePreviewLocation
  ) {
    return {
      networkName:
        networkNames[mode],

      distanceKm:
        0,

      duration:
        "0 min",

      stops: [
        {
          name:
            origin,

          at:
            "Same Location",

          km:
            0,
        },
      ],

      note:
        "Invalid route preview: From and To must be different stations.",
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
      name:
        origin,

      at:
        "Departure",

      km:
        0,
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

function routeKey(
  fromCode: string,
  toCode: string,
): string {
  return `${normalizeCode(
    fromCode,
  )}-${normalizeCode(
    toCode,
  )}`;
}

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
Checks the ORIGINAL dummy-data catalogs.

Only EXACT SAME STATION routes are counted.

Same city with different stations is NOT invalid.
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
        isSameStation(
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
Return exact invalid routes from the original catalogs.
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
            isSameStation(
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

  isSameStation,
};
