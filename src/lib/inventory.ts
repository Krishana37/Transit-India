import { stations, type Station } from "./dummy-data";

/* =========================================================
   TRANSPORT MODES
   CAB IS NOT PART OF NORMAL TRANSPORT SEARCH
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
  {
    id: "train",
    label: "Trains",
    blurb: "Long-distance rail across the country",
  },
  {
    id: "bus",
    label: "Buses",
    blurb: "Sleeper, Volvo and seater coaches",
  },
  {
    id: "flight",
    label: "Flights",
    blurb: "Domestic hops between metros",
  },
  {
    id: "hotel",
    label: "Hotels",
    blurb: "Stays near your destination",
  },
  {
    id: "metro",
    label: "Metro",
    blurb: "City rapid transit day passes",
  },
  {
    id: "ferry",
    label: "Ferry",
    blurb: "Coastal and island crossings",
  },
];

/* =========================================================
   DETERMINISTIC PSEUDO-RANDOMNESS
========================================================= */

function hash(str: string): number {
  let h = 2166136261;

  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return Math.abs(h);
}

function rand(
  seed: string,
  min: number,
  max: number,
): number {
  const h = hash(seed);
  return min + ((h % 10000) / 10000) * (max - min);
}

/* FIXED: generic type added here */
function pick<T>(seed: string, arr: T[]): T {
  return arr[hash(seed) % arr.length];
}

/* =========================================================
   DISTANCE
========================================================= */

export function distanceKm(
  from: Station,
  to: Station,
): number {
  if (from.code === to.code) return 0;

  const key = [from.code, to.code]
    .sort()
    .join("-");

  return Math.round(
    rand(key, 140, 2100),
  );
}

/* =========================================================
   DEMAND
========================================================= */

export function demandIndex(
  from: Station,
  to: Station,
  date: Date,
): number {
  const day = date.getDay();

  const weekend =
    day === 0 ||
    day === 5 ||
    day === 6
      ? 0.12
      : 0;

  const daysAway = Math.max(
    0,
    Math.round(
      (date.getTime() - Date.now()) /
        86400000,
    ),
  );

  const urgency =
    daysAway <= 1
      ? 0.14
      : daysAway <= 3
        ? 0.07
        : 0;

  return Number(
    (
      0.9 +
      rand(
        from.code + to.code + day,
        0,
        0.18,
      ) +
      weekend +
      urgency
    ).toFixed(2),
  );
}

/* =========================================================
   FARE MULTIPLIERS
========================================================= */

export const classMultiplier: Record<
  string,
  number
> = {
  /* Train */
  GEN: 0.45,
  SL: 1,
  "3A": 2.6,
  "2A": 3.7,
  "1A": 6.2,
  CC: 3.1,
  EC: 5.6,

  /* Bus */
  ORDINARY: 0.75,
  SEATER: 0.9,
  DELUXE_BUS: 1.25,
  AC: 1.5,
  SLEEPER: 1.6,
  LUXURY: 2.3,
  VOLVO: 1.8,

  /* Flight */
  ECONOMY: 9,
  PREMIUM_ECONOMY: 13,
  BUSINESS: 22,

  /* Hotel */
  BUDGET: 0.7,
  STANDARD: 1,
  DELUXE: 1.6,
  PREMIUM: 2.1,
  SUITE: 2.8,
  LUXURY_STAY: 3.4,

  /* Metro */
  TOKEN: 1,
  DAYPASS: 1.4,

  /* Ferry */
  DECK: 1,
  CABIN: 2.2,
};

/* =========================================================
   FESTIVAL
========================================================= */

export function festivalBoost(
  date: Date,
): number {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const festiveMonths = [
    3,
    8,
    10,
    11,
    12,
  ];

  const festive =
    festiveMonths.includes(month) &&
    day % 7 < 3;

  return festive ? 1.16 : 1;
}

/* =========================================================
   DYNAMIC PRICE FACTORS
========================================================= */

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
    day === 0 ||
    day === 5 ||
    day === 6
      ? 1.08
      : 1;

  const peak =
    (departHour >= 7 &&
      departHour <= 10) ||
    (departHour >= 17 &&
      departHour <= 21)
      ? 1.12
      : departHour <= 5
        ? 0.9
        : 1;

  const scarcity =
    1 +
    (1 -
      Math.max(
        0,
        Math.min(1, seatShare),
      )) *
      0.18;

  const jitter =
    0.95 + rand(seed, 0, 0.12);

  return Number(
    (
      weekend *
      peak *
      festivalBoost(date) *
      scarcity *
      jitter
    ).toFixed(3),
  );
}

/* =========================================================
   FARE
========================================================= */

export function computeFare(
  km: number,
  classCode: string,
  demand: number,
  base = 0.62,
  factor = 1,
): number {
  const mult =
    classMultiplier[classCode] ?? 1;

  const raw =
    (60 + km * base) *
    mult *
    demand *
    factor;

  return Math.round(raw / 5) * 5;
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
];

const hotelNames = [
  "The Marigold House",
  "Aster Grand",
  "Nilaya Residency",
  "Copperleaf Suites",
  "Serai Court",
  "The Royal Orchid",
  "Blue Lotus Residency",
  "Heritage Grand",
  "The Imperial Stay",
  "Regal Palace",
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
];

const ferryOperators = [
  "Bluewater Ferries",
  "Coral Coast Marine",
  "Windward Lines",
  "Ocean Pearl",
  "Island Connect",
  "Coastal Bharat",
];

/* =========================================================
   RESULT TYPE
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

/* =========================================================
   UTILITIES
========================================================= */

function fmtDuration(
  mins: number,
): string {
  return `${Math.floor(mins / 60)}h ${String(
    mins % 60,
  ).padStart(2, "0")}m`;
}

function addMinutes(
  hhmm: string,
  mins: number,
): string {
  const [h, m] = hhmm
    .split(":")
    .map(Number);

  const total =
    (h * 60 + m + mins) % 1440;

  return `${String(
    Math.floor(total / 60),
  ).padStart(2, "0")}:${String(
    total % 60,
  ).padStart(2, "0")}`;
}

const slotStart: Record<
  string,
  number
> = {
  early: 2,
  morning: 6,
  afternoon: 13,
  night: 19,
};

/* =========================================================
   CLASS LADDERS
   CAB REMOVED
========================================================= */

export const classLadder: Record<
  TransportMode,
  { code: string; label: string }[]
> = {
  train: [
    {
      code: "GEN",
      label: "General (Unreserved)",
    },
    {
      code: "SL",
      label: "Sleeper",
    },
    {
      code: "3A",
      label: "AC 3-Tier",
    },
    {
      code: "2A",
      label: "AC 2-Tier",
    },
    {
      code: "1A",
      label: "AC First",
    },
  ],

  bus: [
    {
      code: "ORDINARY",
      label: "Ordinary",
    },
    {
      code: "DELUXE_BUS",
      label: "Deluxe",
    },
    {
      code: "AC",
      label: "AC Seater",
    },
    {
      code: "SLEEPER",
      label: "AC Sleeper",
    },
    {
      code: "LUXURY",
      label: "Luxury Coach",
    },
  ],

  flight: [
    {
      code: "ECONOMY",
      label: "Economy",
    },
    {
      code: "PREMIUM_ECONOMY",
      label: "Premium Economy",
    },
    {
      code: "BUSINESS",
      label: "Business",
    },
  ],

  hotel: [
    {
      code: "BUDGET",
      label: "Budget",
    },
    {
      code: "STANDARD",
      label: "Standard",
    },
    {
      code: "PREMIUM",
      label: "Premium",
    },
    {
      code: "LUXURY_STAY",
      label: "Luxury",
    },
  ],

  metro: [
    {
      code: "TOKEN",
      label: "Single token",
    },
    {
      code: "DAYPASS",
      label: "Day pass",
    },
  ],

  ferry: [
    {
      code: "DECK",
      label: "Deck seat",
    },
    {
      code: "CABIN",
      label: "Cabin",
    },
  ],
};

/* =========================================================
   RAC / WL
========================================================= */

export const racWlClasses = [
  "GEN",
  "SL",
  "3A",
  "2A",
];

export function supportsRacWl(
  mode: string,
  classCode: string,
): boolean {
  return (
    mode === "train" &&
    racWlClasses.includes(
      classCode.split(" ")[0],
    )
  );
}

/* =========================================================
   ROUTE TYPES
========================================================= */

type DemoRoute = {
  from: Station;
  to: Station;
};

function route(
  fromCode: string,
  toCode: string,
): DemoRoute | null {
  const from = stations.find(
    (s) => s.code === fromCode,
  );

  const to = stations.find(
    (s) => s.code === toCode,
  );

  if (!from || !to) return null;
  if (from.code === to.code) return null;

  return { from, to };
}

/* =========================================================
   GUARANTEED UNIQUE ROUTES
========================================================= */

function buildUniqueRoutes(
  seed: string,
  count: number,
  excluded: Set<string> = new Set(),
): DemoRoute[] {
  const result: DemoRoute[] = [];
  const used = new Set<string>();

  const shuffled = [...stations].sort(
    (a, b) =>
      hash(seed + a.code) -
      hash(seed + b.code),
  );

  for (const from of shuffled) {
    for (const to of shuffled) {
      if (result.length >= count)
        break;

      if (from.code === to.code)
        continue;

      const key = `${from.code}-${to.code}`;

      if (used.has(key))
        continue;

      if (excluded.has(key))
        continue;

      used.add(key);
      result.push({
        from,
        to,
      });
    }

    if (result.length >= count)
      break;
  }

  return result;
}

const allUsedRoutes =
  new Set<string>();

function getModeRoutes(
  mode: TransportMode,
  count = 30,
): DemoRoute[] {
  const routes =
    buildUniqueRoutes(
      `Transit-India-${mode}`,
      count,
      allUsedRoutes,
    );

  routes.forEach((r) => {
    allUsedRoutes.add(
      `${r.from.code}-${r.to.code}`,
    );
  });

  return routes;
}

export const uniqueTrainRoutes =
  getModeRoutes("train", 30);

export const uniqueBusRoutes =
  getModeRoutes("bus", 30);

export const uniqueFlightRoutes =
  getModeRoutes("flight", 30);

export const uniqueMetroRoutes =
  getModeRoutes("metro", 30);

export const uniqueFerryRoutes =
  getModeRoutes("ferry", 30);

/* =========================================================
   HOTEL DESTINATIONS
========================================================= */

export type HotelDestination = {
  id: string;
  city: string;
  state: string;
  landmark: string;
  description: string;
};

export const famousHotelDestinations: HotelDestination[] =
  [
    {
      id: "hotel-goa",
      city: "Goa",
      state: "Goa",
      landmark: "Baga Beach",
      description:
        "Popular beach destination with nightlife and coastal attractions.",
    },
    {
      id: "hotel-jaipur",
      city: "Jaipur",
      state: "Rajasthan",
      landmark: "Amber Fort",
      description:
        "Historic destination known for forts, palaces and heritage streets.",
    },
    {
      id: "hotel-agra",
      city: "Agra",
      state: "Uttar Pradesh",
      landmark: "Taj Mahal",
      description:
        "Famous heritage destination and home of the Taj Mahal.",
    },
    {
      id: "hotel-varanasi",
      city: "Varanasi",
      state: "Uttar Pradesh",
      landmark:
        "Dashashwamedh Ghat",
      description:
        "Historic spiritual destination on the banks of the Ganga.",
    },
    {
      id: "hotel-udaipur",
      city: "Udaipur",
      state: "Rajasthan",
      landmark: "Lake Pichola",
      description:
        "Famous lake city with palaces and scenic views.",
    },
    {
      id: "hotel-manali",
      city: "Manali",
      state: "Himachal Pradesh",
      landmark: "Solang Valley",
      description:
        "Mountain destination surrounded by Himalayan landscapes.",
    },
    {
      id: "hotel-srinagar",
      city: "Srinagar",
      state: "J&K",
      landmark: "Dal Lake",
      description:
        "Famous Kashmir destination known for Dal Lake and houseboats.",
    },
    {
      id: "hotel-kochi",
      city: "Kochi",
      state: "Kerala",
      landmark: "Fort Kochi",
      description:
        "Coastal heritage destination with historic streets and beaches.",
    },
    {
      id: "hotel-mysuru",
      city: "Mysuru",
      state: "Karnataka",
      landmark: "Mysore Palace",
      description:
        "Heritage city famous for its palace and cultural attractions.",
    },
    {
      id: "hotel-amritsar",
      city: "Amritsar",
      state: "Punjab",
      landmark: "Golden Temple",
      description:
        "Major cultural destination centred around the Golden Temple.",
    },
  ];

/* =========================================================
   ROUTE SELECTION
========================================================= */

function routePoolFor(
  mode: TransportMode,
): DemoRoute[] {
  switch (mode) {
    case "train":
      return uniqueTrainRoutes;

    case "bus":
      return uniqueBusRoutes;

    case "flight":
      return uniqueFlightRoutes;

    case "metro":
      return uniqueMetroRoutes;

    case "ferry":
      return uniqueFerryRoutes;

    default:
      return uniqueTrainRoutes;
  }
}

/* =========================================================
   RESULT GENERATOR
========================================================= */

export function generateResults(
  mode: TransportMode,
  from: Station,
  to: Station,
  date: Date,
  slot = "morning",
  count = mode === "hotel"
    ? 1
    : 30,
  nonce = "",
): Segment[] {
  /* HOTEL */

  if (mode === "hotel") {
    const destination =
      famousHotelDestinations[
        hash(
          `${date.toISOString()}-${nonce}`,
        ) %
          famousHotelDestinations.length
      ];

    const seed =
      `hotel-${destination.id}-${date
        .toISOString()
        .slice(0, 10)}`;

    const demand = 1;

    const ladder =
      classLadder.hotel;

    const depart = "14:00";

    const options =
      ladder.map(
        ({ code, label }) => {
          const available =
            2 +
            (hash(seed + code) %
              12);

          const factor =
            priceFactors({
              date,
              departHour: 14,
              seatShare:
                available / 15,
              seed:
                seed + code,
            });

          return {
            code,
            label,
            fare: computeFare(
              60,
              code,
              demand,
              12,
              factor,
            ),
            available,
            probability:
              92 +
              (hash(seed + code) %
                8),
          };
        },
      );

    return [
      {
        id: seed,
        mode: "hotel",

        name: `${pick(
          seed,
          hotelNames,
        )} — ${destination.landmark}`,

        code: `HTL-${
          1000 +
          (hash(seed) % 8000)
        }`,

        operator:
          destination.city,

        from: undefined,
        fromCode: undefined,

        to: destination.city,
        toCode: undefined,

        depart,
        arrive: "11:00",

        durationMins: 1260,
        duration: "1 night",

        distanceKm:
          1 + (hash(seed) % 9),

        tags: [
          destination.city,
          destination.state,
          destination.landmark,
          pick(
            seed + "tag",
            [
              "Breakfast included",
              "Free cancellation",
              "Near famous attraction",
              "Wi-Fi included",
            ],
          ),
        ],

        options,
      },
    ];
  }

  /* ALL OTHER NORMAL TRANSPORT */

  const routes =
    routePoolFor(mode);

  const actualCount = Math.min(
    Math.max(count, 1),
    routes.length,
  );

  const dayKey = date
    .toISOString()
    .slice(0, 10);

  const startHour =
    slotStart[slot] ?? 6;

  return Array.from({
    length: actualCount,
  }).map((_, i) => {
    const selectedRoute =
      routes[
        i % routes.length
      ];

    const routeFrom =
      selectedRoute.from;

    const routeTo =
      selectedRoute.to;

    const km = distanceKm(
      routeFrom,
      routeTo,
    );

    const demand =
      demandIndex(
        routeFrom,
        routeTo,
        date,
      );

    const seed =
      `${mode}-${routeFrom.code}-${routeTo.code}-${dayKey}-${i}${
        nonce
          ? `-${nonce}`
          : ""
      }`;

    const depart =
      `${String(
        (startHour + i * 2) % 24,
      ).padStart(2, "0")}:${pick(
        seed + "min",
        [
          "05",
          "10",
          "25",
          "40",
          "55",
        ],
      )}`;

    const departHour =
      Number(
        depart.slice(0, 2),
      );

    const ladder =
      classLadder[mode];

    const buildOptions = (
      opts: {
        fareKm: number;
        base: number;
        capacity: (
          code: string,
        ) => number;
        probability: (
          code: string,
          available: number,
        ) => number;
      },
    ) =>
      ladder.map(
        ({ code, label }) => {
          const available =
            opts.capacity(code);

          const cap =
            Math.max(
              available,
              1,
            );

          const factor =
            priceFactors({
              date,
              departHour,
              seatShare:
                Math.min(
                  1,
                  available /
                    (cap + 20),
                ),
              seed:
                seed + code,
            });

          return {
            code,
            label,
            fare: computeFare(
              opts.fareKm,
              code,
              demand,
              opts.base,
              factor,
            ),
            available,
            probability:
              opts.probability(
                code,
                available,
              ),
          };
        },
      );

    /* =====================================================
       FLIGHT
    ===================================================== */

    if (mode === "flight") {
      const mins =
        Math.round(
          km / 12 + 45,
        );

      const airline = pick(
        seed,
        airlines,
      );

      return {
        id: seed,
        mode,

        name: airline,

        code: `${airline
          .slice(0, 2)
          .toUpperCase()}-${
          300 +
          (hash(seed) % 600)
        }`,

        operator: airline,

        from: routeFrom.city,
        fromCode:
          routeFrom.code,

        to: routeTo.city,
        toCode: routeTo.code,

        depart,

        arrive: addMinutes(
          depart,
          mins,
        ),

        durationMins: mins,
        duration:
          fmtDuration(mins),

        distanceKm: km,

        tags: pick(
          seed + "t",
          [
            ["Non-stop"],
            [
              "Non-stop",
              "Cabin bag only",
            ],
            ["1 stop"],
          ],
        ),

        options: buildOptions({
          fareKm: km,
          base: 0.42,

          capacity: (c) =>
            2 +
            (hash(seed + c) %
              (c === "BUSINESS"
                ? 12
                : 40)),

          probability: (c) =>
            90 +
            (hash(seed + c) %
              10),
        }),
      };
    }

    /* =====================================================
       METRO
    ===================================================== */

    if (mode === "metro") {
      const line = pick(
        seed,
        metroLines,
      );

      const mins =
        18 +
        (hash(seed) % 40);

      return {
        id: seed,
        mode,

        name: `${line} · ${routeFrom.city} Metro`,

        code: `MTR-${
          10 +
          (hash(seed) % 80)
        }`,

        from: routeFrom.city,
        fromCode:
          routeFrom.code,

        to: routeTo.city,
        toCode: routeTo.code,

        depart,

        arrive: addMinutes(
          depart,
          mins,
        ),

        durationMins: mins,
        duration:
          fmtDuration(mins),

        distanceKm:
          4 +
          (hash(seed) % 30),

        tags: [
          "Every 5 min",
          "Air-conditioned",
          "City rapid transit",
        ],

        options: buildOptions({
          fareKm: 20,
          base: 1.4,

          capacity: () => 400,

          probability: () => 100,
        }),
      };
    }

    /* =====================================================
       FERRY
    ===================================================== */

    if (mode === "ferry") {
      const op = pick(
        seed,
        ferryOperators,
      );

      const mins =
        60 +
        (hash(seed) % 240);

      return {
        id: seed,
        mode,

        name: `${op} Crossing`,

        code: `FRY-${
          100 +
          (hash(seed) % 400)
        }`,

        operator: op,

        from: routeFrom.city,
        fromCode:
          routeFrom.code,

        to: routeTo.city,
        toCode: routeTo.code,

        depart,

        arrive: addMinutes(
          depart,
          mins,
        ),

        durationMins: mins,
        duration:
          fmtDuration(mins),

        distanceKm:
          Math.round(km / 6),

        tags: [
          "Sea route",
          "Snacks onboard",
          "Coastal service",
        ],

        options: buildOptions({
          fareKm:
            Math.round(km / 6),

          base: 1.1,

          capacity: (c) =>
            10 +
            (hash(seed + c) %
              90),

          probability: (c) =>
            88 +
            (hash(seed + c) %
              12),
        }),
      };
    }

    /* =====================================================
       BUS
    ===================================================== */

    if (mode === "bus") {
      const op = pick(
        seed,
        busOperators,
      );

      const mins =
        Math.round(
          km / 0.72 + 30,
        );

      return {
        id: seed,
        mode,

        name: op,

        code: `BUS-${
          1000 +
          (hash(seed) % 9000)
        }`,

        operator: op,

        from: routeFrom.city,
        fromCode:
          routeFrom.code,

        to: routeTo.city,
        toCode: routeTo.code,

        depart,

        arrive: addMinutes(
          depart,
          mins,
        ),

        durationMins: mins,
        duration:
          fmtDuration(mins),

        distanceKm: km,

        tags: pick(
          seed + "t",
          [
            ["A/C Sleeper"],
            ["Volvo Multi-Axle"],
            [
              "Live tracking",
              "Charging point",
            ],
          ],
        ),

        options: buildOptions({
          fareKm: km,
          base: 0.5,

          capacity: (c) =>
            4 +
            (hash(seed + c) %
              32),

          probability: (c, a) =>
            Math.min(
              99,
              55 + a,
            ),
        }),
      };
    }

    /* =====================================================
       TRAIN
    ===================================================== */

    const mins =
      Math.round(
        km / 0.9 + 40,
      );

    const name =
      `${pick(
        seed,
        trainPrefix,
      )} ${pick(
        seed + "s",
        trainSuffix,
      )}`;

    return {
      id: seed,
      mode: "train",

      name,

      code: String(
        11000 +
          (hash(seed) % 8000),
      ),

      from: routeFrom.city,
      fromCode:
        routeFrom.code,

      to: routeTo.city,
      toCode: routeTo.code,

      depart,

      arrive: addMinutes(
        depart,
        mins,
      ),

      durationMins: mins,
      duration:
        fmtDuration(mins),

      distanceKm: km,

      tags: pick(
        seed + "t",
        [
          ["Pantry car"],
          ["Fastest on route"],
          [
            "Bio-toilets",
            "Charging point",
          ],
          ["Tatkal available"],
        ],
      ),

      options: buildOptions({
        fareKm: km,
        base: 0.62,

        capacity: (c) =>
          c === "GEN"
            ? 60 +
              (hash(seed + c) %
                120)
            : c === "1A"
              ? 4 +
                (hash(seed + c) %
                  14)
              : hash(
                  seed + c,
                ) % 46,

        probability: (c, a) =>
          Math.min(
            99,
            30 +
              a +
              (hash(
                seed + c,
              ) % 20),
          ),
      }),
    };
  });
}

/* =========================================================
   STATIONS
========================================================= */

export function findStation(
  code: string,
): Station {
  return (
    stations.find(
      (s) => s.code === code,
    ) ?? stations[0]
  );
}

export function searchStations(
  term: string,
  exclude?: string,
  limit = 30,
): Station[] {
  const q =
    term.trim().toLowerCase();

  return stations
    .filter(
      (s) =>
        s.code !== exclude,
    )
    .filter(
      (s) =>
        !q ||
        s.name
          .toLowerCase()
          .includes(q) ||
        s.code
          .toLowerCase()
          .includes(q) ||
        s.city
          .toLowerCase()
          .includes(q) ||
        s.state
          .toLowerCase()
          .includes(q),
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

export const routeCountFor = (
  s: Station,
): number =>
  30 + (hash(s.code) % 20);

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
  {
    id: "poha",
    name: "Kanda Poha with Sev",
    category: "Breakfast",
    price: 90,
    veg: true,
  },
  {
    id: "idli",
    name: "Idli Sambar (3 pcs)",
    category: "Breakfast",
    price: 110,
    veg: true,
  },
  {
    id: "paratha",
    name: "Aloo Paratha & Curd",
    category: "Breakfast",
    price: 130,
    veg: true,
  },
  {
    id: "omelette",
    name: "Masala Omelette & Toast",
    category: "Breakfast",
    price: 140,
    veg: false,
  },
  {
    id: "upma",
    name: "Rava Upma",
    category: "Breakfast",
    price: 85,
    veg: true,
  },

  {
    id: "veg-thali",
    name: "Veg Thali",
    category: "Lunch",
    price: 180,
    veg: true,
  },
  {
    id: "rajma-rice",
    name: "Rajma Chawal Bowl",
    category: "Lunch",
    price: 160,
    veg: true,
  },
  {
    id: "chicken-thali",
    name: "Chicken Thali",
    category: "Lunch",
    price: 260,
    veg: false,
  },
  {
    id: "dal-khichdi",
    name: "Dal Khichdi & Kadhi",
    category: "Lunch",
    price: 150,
    veg: true,
  },

  {
    id: "paneer-dinner",
    name: "Paneer Butter Masala & Roti",
    category: "Dinner",
    price: 230,
    veg: true,
  },
  {
    id: "chicken-curry",
    name: "Chicken Curry & Rice",
    category: "Dinner",
    price: 250,
    veg: false,
  },
  {
    id: "veg-pulao",
    name: "Veg Pulao & Raita",
    category: "Dinner",
    price: 170,
    veg: true,
  },

  {
    id: "samosa",
    name: "Samosa (2 pcs)",
    category: "Snacks",
    price: 60,
    veg: true,
  },
  {
    id: "sandwich",
    name: "Grilled Veg Sandwich",
    category: "Snacks",
    price: 110,
    veg: true,
  },
  {
    id: "cutlet",
    name: "Chicken Cutlet",
    category: "Snacks",
    price: 130,
    veg: false,
  },
  {
    id: "bhel",
    name: "Roasted Bhel Cup",
    category: "Snacks",
    price: 70,
    veg: true,
  },

  {
    id: "misal",
    name: "Kolhapuri Misal Pav",
    category: "Regional",
    price: 140,
    veg: true,
  },
  {
    id: "litti",
    name: "Litti Chokha (4 pcs)",
    category: "Regional",
    price: 150,
    veg: true,
  },
  {
    id: "dhokla",
    name: "Khaman Dhokla Box",
    category: "Regional",
    price: 100,
    veg: true,
  },
  {
    id: "fish-curry",
    name: "Coastal Fish Curry Meal",
    category: "Regional",
    price: 290,
    veg: false,
  },
  {
    id: "chettinad",
    name: "Chettinad Veg Meal",
    category: "Regional",
    price: 200,
    veg: true,
  },

  {
    id: "salad",
    name: "Sprout & Quinoa Salad",
    category: "Healthy",
    price: 160,
    veg: true,
  },
  {
    id: "millet",
    name: "Millet Khichdi (low oil)",
    category: "Healthy",
    price: 170,
    veg: true,
  },
  {
    id: "grilled-chicken",
    name: "Grilled Chicken & Greens",
    category: "Healthy",
    price: 280,
    veg: false,
  },
  {
    id: "soup",
    name: "Clear Vegetable Soup",
    category: "Healthy",
    price: 90,
    veg: true,
  },

  {
    id: "kids-pasta",
    name: "Kids Cheesy Pasta",
    category: "Kids",
    price: 150,
    veg: true,
  },
  {
    id: "kids-nuggets",
    name: "Kids Nuggets & Fries",
    category: "Kids",
    price: 180,
    veg: false,
  },
  {
    id: "kids-combo",
    name: "Kids Mini Meal Box",
    category: "Kids",
    price: 140,
    veg: true,
  },

  {
    id: "jain-thali",
    name: "Jain Thali (no onion/garlic)",
    category: "Jain",
    price: 190,
    veg: true,
  },
  {
    id: "jain-paratha",
    name: "Jain Paratha Combo",
    category: "Jain",
    price: 150,
    veg: true,
  },

  {
    id: "paneer-wrap",
    name: "Paneer Kathi Wrap",
    category: "Vegetarian",
    price: 140,
    veg: true,
  },
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    category: "Vegetarian",
    price: 170,
    veg: true,
  },

  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    category: "Non Vegetarian",
    price: 260,
    veg: false,
  },
  {
    id: "egg-curry",
    name: "Egg Curry Rice",
    category: "Non Vegetarian",
    price: 190,
    veg: false,
  },
  {
    id: "mutton-biryani",
    name: "Mutton Biryani",
    category: "Non Vegetarian",
    price: 320,
    veg: false,
  },

  {
    id: "diabetic",
    name: "Low-GI Diabetic Meal",
    category: "Special",
    price: 210,
    veg: true,
    note: "Prototype special meal",
  },
  {
    id: "gluten-free",
    name: "Gluten-Free Meal Box",
    category: "Special",
    price: 230,
    veg: true,
  },
  {
    id: "festive",
    name: "Festive Special Thali",
    category: "Special",
    price: 350,
    veg: true,
  },
  {
    id: "senior",
    name: "Senior Citizen Soft Meal",
    category: "Special",
    price: 180,
    veg: true,
  },

  {
    id: "masala-chai",
    name: "Masala Chai",
    category: "Beverages",
    price: 40,
    veg: true,
  },
  {
    id: "filter-coffee",
    name: "Filter Coffee",
    category: "Beverages",
    price: 50,
    veg: true,
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    category: "Beverages",
    price: 90,
    veg: true,
  },
  {
    id: "buttermilk",
    name: "Spiced Buttermilk",
    category: "Beverages",
    price: 45,
    veg: true,
  },
  {
    id: "water",
    name: "Packaged Water 1L",
    category: "Beverages",
    price: 20,
    veg: true,
  },

  {
    id: "gulab",
    name: "Gulab Jamun (2 pcs)",
    category: "Desserts",
    price: 70,
    veg: true,
  },
  {
    id: "rasmalai",
    name: "Rasmalai Cup",
    category: "Desserts",
    price: 90,
    veg: true,
  },
  {
    id: "icecream",
    name: "Kulfi Falooda",
    category: "Desserts",
    price: 110,
    veg: true,
  },
  {
    id: "brownie",
    name: "Walnut Brownie",
    category: "Desserts",
    price: 120,
    veg: true,
  },
];

/* =========================================================
   INDEPENDENT ROUTE NETWORKS
   CAB REMAINS ONLY FOR SEPARATE CAB SECTION
========================================================= */

export type RouteMode =
  | TransportMode
  | "cab";

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
  {
    network: string;
    nodes: string[];
    note: string;
  }
> = {
  train: {
    network:
      "Bharat Rail Grid",
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
    note:
      "Rail corridor with scheduled technical and commercial halts.",
  },

  bus: {
    network:
      "Highway Coach Network",
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
    note:
      "Expressway coach route with driver-change and refreshment halts.",
  },

  flight: {
    network:
      "Skyway Air Corridor",
    nodes: [
      "Waypoint ALFA-21",
      "Waypoint TARA-08",
      "Sector Delta Handoff",
      "Waypoint NOVA-14",
      "Coastal Handoff Point",
    ],
    note:
      "Air corridor waypoints — no passenger boarding at intermediate points.",
  },

  metro: {
    network:
      "City Rapid Metro Network",
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
    note:
      "Urban metro network with frequent city services.",
  },

  ferry: {
    network:
      "Coastal Ferry Lanes",
    nodes: [
      "Pearl Jetty",
      "Mangrove Channel",
      "Lighthouse Point",
      "Turtle Bay Anchorage",
      "Palm Islet Dock",
    ],
    note:
      "Sea lane with tide-dependent timings and jetty stops.",
  },

  cab: {
    network:
      "Cabber Street Grid",
    nodes: [
      "Ring Road Signal",
      "Market Underpass",
      "Green Avenue",
      "Sector 9 Circle",
      "Riverside Flyover",
    ],
    note:
      "Door-to-door road route with traffic checkpoints.",
  },

  hotel: {
    network:
      "Hotel Access Route",
    nodes: [
      "Station Exit Gate",
      "Hotel Shuttle Bay",
    ],
    note:
      "Short access route to the selected property.",
  },
};

function pickMany(
  seed: string,
  arr: string[],
  n: number,
): string[] {
  const out: string[] = [];

  let h = hash(seed);

  const pool = [...arr];

  for (
    let i = 0;
    i < n && pool.length;
    i++
  ) {
    h = Math.imul(
      h ^ (i + 1),
      16777619,
    );

    out.push(
      pool.splice(
        Math.abs(h) %
          pool.length,
        1,
      )[0],
    );
  }

  return out;
}

export function terminalName(
  mode: RouteMode,
  city: string,
  role:
    | "origin"
    | "destination" = "origin",
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

export const routeStyle: Record<
  RouteMode,
  {
    kind: string;
    stopWord: string;
  }
> = {
  train: {
    kind: "Rail corridor",
    stopWord: "halts",
  },

  bus: {
    kind: "Highway road route",
    stopWord: "stops",
  },

  flight: {
    kind: "Air corridor",
    stopWord: "waypoints",
  },

  metro: {
    kind: "Urban metro line",
    stopWord: "stations",
  },

  ferry: {
    kind: "Sea lane",
    stopWord: "jetties",
  },

  cab: {
    kind: "Road route",
    stopWord: "checkpoints",
  },

  hotel: {
    kind: "Access route",
    stopWord: "points",
  },
};

export function buildRoutePreview(
  mode: RouteMode,
  origin: string,
  destination: string,
  km: number,
  totalMins: number,
  seed: string,
): RoutePreview {
  const net =
    networkNodes[mode];

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
    1 +
      (hash(
        seed + mode,
      ) %
        maxStops),
  );

  const mids = pickMany(
    seed + mode,
    net.nodes,
    count,
  );

  const start =
    terminalName(
      mode,
      origin,
      "origin",
    );

  const end =
    terminalName(
      mode,
      destination,
      "destination",
    );

  const stops: RouteStop[] = [
    {
      name: start,
      at: "00:00",
      km: 0,
      halt: "Source",
    },

    ...mids.map(
      (name, i) => {
        const frac =
          (i + 1) /
          (mids.length + 1);

        const m = Math.round(
          totalMins * frac,
        );

        return {
          name,

          at: `${String(
            Math.floor(m / 60),
          ).padStart(2, "0")}:${String(
            m % 60,
          ).padStart(2, "0")}`,

          km: Math.round(
            km * frac,
          ),

          halt:
            mode === "flight"
              ? "Overfly"
              : mode === "metro"
                ? "1 min"
                : `${2 + (hash(seed + name) % 8)} min`,
        };
      },
    ),

    {
      name: end,

      at: `${String(
        Math.floor(
          totalMins / 60,
        ),
      ).padStart(2, "0")}:${String(
        totalMins % 60,
      ).padStart(2, "0")}`,

      km,

      halt: "Destination",
    },
  ];

  return {
    networkName:
      net.network,

    label:
      `${start} → ${end}`,

    origin: start,

    destination: end,

    stops,

    distanceKm: km,

    duration:
      fmtDuration(totalMins),

    note: net.note,
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
  const n = Math.max(
    1,
    passengers,
  );

  const cls =
    classCode.split(" ")[0];

  if (mode === "hotel") {
    return Array.from(
      { length: n },
      (_, i) =>
        `Room ${
          101 +
          ((hash(seed) + i) %
            40)
        }`,
    );
  }

  if (mode === "metro") {
    return Array.from(
      { length: n },
      (_, i) =>
        `Pass ${i + 1}`,
    );
  }

  if (cls === "GEN") {
    return Array.from(
      { length: n },
      () => "Unreserved",
    );
  }

  const berths = [
    "LB",
    "MB",
    "UB",
    "SL",
    "SU",
  ];

  const start =
    1 +
    (hash(
      seed + cls,
    ) % 56);

  return Array.from(
    { length: n },
    (_, i) => {
      const num =
        ((start + i - 1) %
          72) +
        1;

      return mode === "train"
        ? `${num} ${
            berths[
              (hash(
                seed + num,
              ) +
                i) %
                berths.length
            ]
          }`
        : String(num);
    },
  );
}

/* =========================================================
   SEAT STATE
========================================================= */

export type SeatState = {
  available: number;
  label: string;
  tone:
    | "ok"
    | "low"
    | "rac"
    | "wl"
    | "sold";
};

export function seatState(
  seed: string,
  base: number,
  minutes = 0,
  opts: {
    racWl?: boolean;
  } = {},
): SeatState {
  const perMinute =
    1 + (hash(seed) % 3);

  const left = Math.max(
    0,
    base -
      Math.floor(minutes) *
        perMinute,
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
    if (left > 0) {
      return {
        available: left,
        label: `${left} Available`,
        tone: "low",
      };
    }

    return {
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

  const wl =
    1 +
    (hash(
      seed + "wl",
    ) % 48);

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

export function serviceDisruption(
  seed: string,
): {
  cancelled: boolean;
  reason?: string;
  delayMins: number;
} {
  const h =
    hash(seed + "disrupt");

  const cancelled =
    h % 9 === 0;

  return {
    cancelled,

    reason: cancelled
      ? cancellationReasons[
          h %
            cancellationReasons.length
        ]
      : undefined,

    delayMins: cancelled
      ? 0
      : [0, 0, 0, 10, 25, 45][
          h % 6
        ],
  };
}
