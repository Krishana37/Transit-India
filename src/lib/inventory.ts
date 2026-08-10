import { stations } from "./dummy-data";

/* =========================================================
   TRANSIT INDIA — INVENTORY
   ========================================================= */

export type TransportMode =
  | "train"
  | "bus"
  | "flight"
  | "hotel"
  | "metro"
  | "ferry";

export const transportModes = [
  {
    id: "train" as TransportMode,
    label: "Trains",
    blurb: "Long-distance rail across India",
  },
  {
    id: "bus" as TransportMode,
    label: "Buses",
    blurb: "Sleeper, Volvo and seater coaches",
  },
  {
    id: "flight" as TransportMode,
    label: "Flights",
    blurb: "Domestic flights between Indian cities",
  },
  {
    id: "hotel" as TransportMode,
    label: "Hotels",
    blurb: "Hotels near popular destinations",
  },
  {
    id: "metro" as TransportMode,
    label: "Metro",
    blurb: "Urban rapid transit networks",
  },
  {
    id: "ferry" as TransportMode,
    label: "Ferry",
    blurb: "Coastal and island crossings",
  },
];

/* =========================================================
   DETERMINISTIC RANDOM
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
  return min + ((hash(seed) % 10000) / 10000) * (max - min);
}

function pick<T>(seed: string, arr: T[]): T {
  return arr[hash(seed) % arr.length];
}

/* =========================================================
   DISTANCE
   ========================================================= */

export function distanceKm(
  from: any,
  to: any,
): number {
  if (from.code === to.code) return 0;

  return Math.round(
    rand(
      `${from.code}-${to.code}`,
      120,
      2200,
    ),
  );
}

/* =========================================================
   DEMAND
   ========================================================= */

export function demandIndex(
  from: any,
  to: any,
  date: Date,
): number {
  const day = date.getDay();

  const weekend =
    day === 0 || day === 5 || day === 6
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
        `${from.code}${to.code}${day}`,
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
  GEN: 0.45,
  SL: 1,
  "3A": 2.6,
  "2A": 3.7,
  "1A": 6.2,
  CC: 3.1,
  EC: 5.6,

  ORDINARY: 0.75,
  SEATER: 0.9,
  DELUXE_BUS: 1.25,
  AC: 1.5,
  SLEEPER: 1.6,
  LUXURY: 2.3,
  VOLVO: 1.8,

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

  return festiveMonths.includes(month) &&
    day % 7 < 3
    ? 1.16
    : 1;
}

/* =========================================================
   PRICE FACTORS
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
    day === 0 || day === 5 || day === 6
      ? 1.08
      : 1;

  const peak =
    (departHour >= 7 && departHour <= 10) ||
    (departHour >= 17 && departHour <= 21)
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

  return Math.max(
    20,
    Math.round(raw / 5) * 5,
  );
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
  "Himalayan",
  "Rajdhani",
];

const trainSuffix = [
  "Superfast",
  "Rapid",
  "Sampark Express",
  "Express",
  "Vega Express",
  "Tejas Express",
  "Intercity",
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
  "Redline Travels",
  "National Coachways",
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
  evening: 17,
  night: 19,
};

/* =========================================================
   CLASS LADDERS
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
      label: "Single Token",
    },
    {
      code: "DAYPASS",
      label: "Day Pass",
    },
  ],

  ferry: [
    {
      code: "DECK",
      label: "Deck Seat",
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
   ROUTES
   EACH MODE GETS ITS OWN ROUTE POOL
   ========================================================= */

type DemoRoute = {
  from: any;
  to: any;
};

function buildModeRoutes(
  mode: TransportMode,
  count = 30,
): DemoRoute[] {
  const result: DemoRoute[] = [];

  const seed =
    `TRANSIT-${mode}`;

  const ordered = [...stations].sort(
    (a: any, b: any) =>
      hash(seed + a.code) -
      hash(seed + b.code),
  );

  const used = new Set<string>();

  for (let i = 0; i < ordered.length; i++) {
    for (
      let j = ordered.length - 1;
      j >= 0;
      j--
    ) {
      if (result.length >= count)
        break;

      const from = ordered[i];
      const to = ordered[j];

      if (!from || !to) continue;

      if (
        from.code === to.code
      )
        continue;

      const key =
        `${from.code}-${to.code}`;

      if (used.has(key))
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

export const uniqueTrainRoutes =
  buildModeRoutes(
    "train",
    30,
  );

export const uniqueBusRoutes =
  buildModeRoutes(
    "bus",
    30,
  );

export const uniqueFlightRoutes =
  buildModeRoutes(
    "flight",
    30,
  );

export const uniqueMetroRoutes =
  buildModeRoutes(
    "metro",
    30,
  );

export const uniqueFerryRoutes =
  buildModeRoutes(
    "ferry",
    30,
  );

/* =========================================================
   HOTEL DESTINATIONS — 50
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
        "Beach destination with coastal attractions and nightlife.",
    },
    {
      id: "hotel-jaipur",
      city: "Jaipur",
      state: "Rajasthan",
      landmark: "Amber Fort",
      description:
        "Historic city of forts and palaces.",
    },
    {
      id: "hotel-agra",
      city: "Agra",
      state: "Uttar Pradesh",
      landmark: "Taj Mahal",
      description:
        "Historic destination famous for the Taj Mahal.",
    },
    {
      id: "hotel-varanasi",
      city: "Varanasi",
      state: "Uttar Pradesh",
      landmark: "Dashashwamedh Ghat",
      description:
        "Historic spiritual destination on the Ganga.",
    },
    {
      id: "hotel-udaipur",
      city: "Udaipur",
      state: "Rajasthan",
      landmark: "Lake Pichola",
      description:
        "Lake city famous for palaces and scenic views.",
    },
    {
      id: "hotel-manali",
      city: "Manali",
      state: "Himachal Pradesh",
      landmark: "Solang Valley",
      description:
        "Mountain destination in the Himalayas.",
    },
    {
      id: "hotel-srinagar",
      city: "Srinagar",
      state: "Jammu & Kashmir",
      landmark: "Dal Lake",
      description:
        "Kashmir destination known for Dal Lake.",
    },
    {
      id: "hotel-kochi",
      city: "Kochi",
      state: "Kerala",
      landmark: "Fort Kochi",
      description:
        "Coastal heritage destination in Kerala.",
    },
    {
      id: "hotel-mysuru",
      city: "Mysuru",
      state: "Karnataka",
      landmark: "Mysore Palace",
      description:
        "Heritage city famous for its royal palace.",
    },
    {
      id: "hotel-amritsar",
      city: "Amritsar",
      state: "Punjab",
      landmark: "Golden Temple",
      description:
        "Major cultural and heritage destination.",
    },
    {
      id: "hotel-delhi",
      city: "Delhi",
      state: "Delhi",
      landmark: "India Gate",
      description:
        "Capital city with major monuments and museums.",
    },
    {
      id: "hotel-mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      landmark: "Gateway of India",
      description:
        "Major financial and coastal city.",
    },
    {
      id: "hotel-bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      landmark: "Cubbon Park",
      description:
        "Technology hub with parks and cultural attractions.",
    },
    {
      id: "hotel-chennai",
      city: "Chennai",
      state: "Tamil Nadu",
      landmark: "Marina Beach",
      description:
        "Major coastal city in South India.",
    },
    {
      id: "hotel-kolkata",
      city: "Kolkata",
      state: "West Bengal",
      landmark: "Victoria Memorial",
      description:
        "Cultural capital with colonial heritage.",
    },
    {
      id: "hotel-hyderabad",
      city: "Hyderabad",
      state: "Telangana",
      landmark: "Charminar",
      description:
        "Historic city famous for food and monuments.",
    },
    {
      id: "hotel-pune",
      city: "Pune",
      state: "Maharashtra",
      landmark: "Shaniwar Wada",
      description:
        "Educational and cultural destination.",
    },
    {
      id: "hotel-ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat",
      landmark: "Sabarmati Ashram",
      description:
        "Historic city with cultural attractions.",
    },
    {
      id: "hotel-rishikesh",
      city: "Rishikesh",
      state: "Uttarakhand",
      landmark: "Laxman Jhula",
      description:
        "Riverfront and adventure destination.",
    },
    {
      id: "hotel-mussoorie",
      city: "Mussoorie",
      state: "Uttarakhand",
      landmark: "Mall Road",
      description:
        "Popular Himalayan hill station.",
    },
    {
      id: "hotel-shimla",
      city: "Shimla",
      state: "Himachal Pradesh",
      landmark: "The Ridge",
      description:
        "Classic Himalayan hill station.",
    },
    {
      id: "hotel-dharamshala",
      city: "Dharamshala",
      state: "Himachal Pradesh",
      landmark: "McLeod Ganj",
      description:
        "Mountain destination surrounded by Himalayan scenery.",
    },
    {
      id: "hotel-jodhpur",
      city: "Jodhpur",
      state: "Rajasthan",
      landmark: "Mehrangarh Fort",
      description:
        "Blue city famous for its fort and old town.",
    },
    {
      id: "hotel-jaisalmer",
      city: "Jaisalmer",
      state: "Rajasthan",
      landmark: "Jaisalmer Fort",
      description:
        "Desert city with golden sandstone architecture.",
    },
    {
      id: "hotel-ranthambore",
      city: "Ranthambore",
      state: "Rajasthan",
      landmark: "Ranthambore National Park",
      description:
        "Wildlife destination in Rajasthan.",
    },
    {
      id: "hotel-pushkar",
      city: "Pushkar",
      state: "Rajasthan",
      landmark: "Pushkar Lake",
      description:
        "Historic pilgrimage and cultural destination.",
    },
    {
      id: "hotel-khajuraho",
      city: "Khajuraho",
      state: "Madhya Pradesh",
      landmark: "Khajuraho Temples",
      description:
        "Heritage destination known for temple architecture.",
    },
    {
      id: "hotel-bhopal",
      city: "Bhopal",
      state: "Madhya Pradesh",
      landmark: "Upper Lake",
      description:
        "Central Indian city with lakes and museums.",
    },
    {
      id: "hotel-indore",
      city: "Indore",
      state: "Madhya Pradesh",
      landmark: "Rajwada Palace",
      description:
        "Major central Indian food and culture destination.",
    },
    {
      id: "hotel-nashik",
      city: "Nashik",
      state: "Maharashtra",
      landmark: "Godavari Ghats",
      description:
        "Historic city surrounded by vineyards.",
    },
    {
      id: "hotel-aurangabad",
      city: "Aurangabad",
      state: "Maharashtra",
      landmark: "Bibi Ka Maqbara",
      description:
        "Gateway to major heritage sites.",
    },
    {
      id: "hotel-vadodara",
      city: "Vadodara",
      state: "Gujarat",
      landmark: "Laxmi Vilas Palace",
      description:
        "Cultural and heritage city in Gujarat.",
    },
    {
      id: "hotel-surat",
      city: "Surat",
      state: "Gujarat",
      landmark: "Dumas Beach",
      description:
        "Major commercial city near the Arabian Sea.",
    },
    {
      id: "hotel-dwarka",
      city: "Dwarka",
      state: "Gujarat",
      landmark: "Dwarkadhish Temple",
      description:
        "Important coastal pilgrimage destination.",
    },
    {
      id: "hotel-somnath",
      city: "Somnath",
      state: "Gujarat",
      landmark: "Somnath Temple",
      description:
        "Historic coastal pilgrimage destination.",
    },
    {
      id: "hotel-kovalam",
      city: "Kovalam",
      state: "Kerala",
      landmark: "Lighthouse Beach",
      description:
        "Popular beach destination in Kerala.",
    },
    {
      id: "hotel-munnar",
      city: "Munnar",
      state: "Kerala",
      landmark: "Tea Gardens",
      description:
        "Hill destination famous for tea plantations.",
    },
    {
      id: "hotel-alleppey",
      city: "Alleppey",
      state: "Kerala",
      landmark: "Backwaters",
      description:
        "Famous Kerala backwater destination.",
    },
    {
      id: "hotel-ooty",
      city: "Ooty",
      state: "Tamil Nadu",
      landmark: "Ooty Lake",
      description:
        "Popular Nilgiri hill station.",
    },
    {
      id: "hotel-coorg",
      city: "Coorg",
      state: "Karnataka",
      landmark: "Abbey Falls",
      description:
        "Green hill destination known for coffee plantations.",
    },
    {
      id: "hotel-hampi",
      city: "Hampi",
      state: "Karnataka",
      landmark: "Virupaksha Temple",
      description:
        "UNESCO heritage destination with ancient ruins.",
    },
    {
      id: "hotel-vijayawada",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      landmark: "Prakasam Barrage",
      description:
        "Major riverfront city in Andhra Pradesh.",
    },
    {
      id: "hotel-visakhapatnam",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      landmark: "RK Beach",
      description:
        "Coastal city with beaches and hills.",
    },
    {
      id: "hotel-bhubaneswar",
      city: "Bhubaneswar",
      state: "Odisha",
      landmark: "Lingaraj Temple",
      description:
        "Historic temple city of Odisha.",
    },
    {
      id: "hotel-puri",
      city: "Puri",
      state: "Odisha",
      landmark: "Jagannath Temple",
      description:
        "Major pilgrimage and beach destination.",
    },
    {
      id: "hotel-darjeeling",
      city: "Darjeeling",
      state: "West Bengal",
      landmark: "Tiger Hill",
      description:
        "Mountain destination famous for tea and views.",
    },
    {
      id: "hotel-gangtok",
      city: "Gangtok",
      state: "Sikkim",
      landmark: "MG Marg",
      description:
        "Himalayan destination with mountain scenery.",
    },
    {
      id: "hotel-guwahati",
      city: "Guwahati",
      state: "Assam",
      landmark: "Kamakhya Temple",
      description:
        "Gateway to Northeast India.",
    },
    {
      id: "hotel-shillong",
      city: "Shillong",
      state: "Meghalaya",
      landmark: "Ward's Lake",
      description:
        "Hill city known for waterfalls and greenery.",
    },
    {
      id: "hotel-portblair",
      city: "Port Blair",
      state: "Andaman & Nicobar Islands",
      landmark: "Cellular Jail",
      description:
        "Island destination and gateway to Andaman beaches.",
    },
    {
      id: "hotel-mahabaleshwar",
      city: "Mahabaleshwar",
      state: "Maharashtra",
      landmark: "Venna Lake",
      description:
        "Popular Western Ghats hill station.",
    },
    {
      id: "hotel-mountabu",
      city: "Mount Abu",
      state: "Rajasthan",
      landmark: "Nakki Lake",
      description:
        "Rajasthan's famous hill station.",
    },
  ];

/* =========================================================
   4 HOTELS FOR EVERY DESTINATION
   = 200 HOTEL RECORDS
   ========================================================= */

export type Hotel = {
  id: string;
  name: string;
  city: string;
  state: string;
  landmark: string;
  category:
    | "Budget"
    | "Standard"
    | "Premium"
    | "Luxury";
  rating: number;
  distanceKm: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
  refundable: boolean;
};

const hotelPrefixes = [
  "The",
  "Grand",
  "Royal",
  "Urban",
  "Heritage",
  "Regal",
];

const hotelSuffixes = [
  "Residency",
  "Heights",
  "Palace",
  "Suites",
  "Inn",
  "Retreat",
];

const hotelImages = [
  "/preview/hotel-1.jpg",
  "/preview/hotel-2.jpg",
  "/preview/hotel-3.jpg",
  "/preview/hotel-4.jpg",
];

export const hotels: Hotel[] =
  famousHotelDestinations.flatMap(
    (destination, destinationIndex) =>
      [
        "Budget",
        "Standard",
        "Premium",
        "Luxury",
      ].map(
        (category, hotelIndex) => {
          const seed =
            `${destination.id}-${hotelIndex}`;

          const priceBase =
            category === "Budget"
              ? 1200
              : category === "Standard"
                ? 2400
                : category === "Premium"
                  ? 4500
                  : 8500;

          return {
            id: `HTL-${destinationIndex + 1}-${hotelIndex + 1}`,

            name:
              `${pick(
                seed,
                hotelPrefixes,
              )} ${destination.city} ${pick(
                seed + "-suffix",
                hotelSuffixes,
              )}`,

            city: destination.city,
            state: destination.state,
            landmark:
              destination.landmark,

            category:
              category as Hotel["category"],

            rating: Number(
              (
                3.8 +
                rand(
                  seed + "-rating",
                  0,
                  1.1,
                )
              ).toFixed(1),
            ),

            distanceKm: Number(
              (
                0.4 +
                rand(
                  seed + "-distance",
                  0,
                  5.5,
                )
              ).toFixed(1),
            ),

            pricePerNight:
              Math.round(
                (priceBase +
                  rand(
                    seed + "-price",
                    0,
                    priceBase * 0.35,
                  )) /
                  100,
              ) * 100,

            image:
              hotelImages[
                hotelIndex %
                  hotelImages.length
              ],

            amenities: pick(
              seed + "-amenities",
              [
                [
                  "Wi-Fi",
                  "Breakfast",
                  "Parking",
                ],
                [
                  "Wi-Fi",
                  "Pool",
                  "Restaurant",
                ],
                [
                  "Breakfast",
                  "Airport Transfer",
                  "Parking",
                ],
                [
                  "Wi-Fi",
                  "Pool",
                  "Spa",
                  "Restaurant",
                ],
              ],
            ),

            refundable:
              hotelIndex !== 2,
          };
        },
      ),
  );

/* =========================================================
   HOTEL HELPERS
   ========================================================= */

export function hotelsNearDestination(
 city: string,
): Hotel[] {
  return hotels.filter(
    (hotel) =>
      hotel.city.toLowerCase() ===
      city.toLowerCase(),
  );
}

export function getHotelDestination(
 city: string,
): HotelDestination | undefined {
  return famousHotelDestinations.find(
    (destination) =>
      destination.city.toLowerCase() ===
      city.toLowerCase(),
  );
}

/* =========================================================
   ROUTE POOL
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
  from: any,
  to: any,
  date: Date,
  slot = "morning",
  count = mode === "hotel"
    ? 4
    : 30,
  nonce = "",
): Segment[] {
  /* =====================================================
     HOTEL
     ===================================================== */

  if (mode === "hotel") {
    const destination =
      famousHotelDestinations.find(
        (d) =>
          d.city.toLowerCase() ===
          (to?.city ?? "")
            .toLowerCase(),
      ) ??
      famousHotelDestinations[
        hash(
          `${date.toISOString()}-${nonce}`,
        ) %
          famousHotelDestinations.length
      ];

    const nearby =
      hotelsNearDestination(
        destination.city,
      );

    return nearby.map(
      (hotel, index) => {
        const seed =
          `hotel-${hotel.id}-${date
            .toISOString()
            .slice(0, 10)}`;

        const optionCode =
          hotel.category === "Budget"
            ? "BUDGET"
            : hotel.category ===
                "Standard"
              ? "STANDARD"
              : hotel.category ===
                  "Premium"
                ? "PREMIUM"
                : "LUXURY_STAY";

        const factor =
          priceFactors({
            date,
            departHour: 14,
            seatShare: 0.7,
            seed,
          });

        return {
          id: hotel.id,
          mode: "hotel",

          name: hotel.name,

          code: hotel.id,

          operator:
            destination.city,

          from: undefined,
          fromCode: undefined,

          to: destination.city,
          toCode: undefined,

          depart: "14:00",
          arrive: "11:00",

          durationMins: 1260,
          duration: "1 night",

          distanceKm:
            hotel.distanceKm,

          tags: [
            hotel.category,
            `${hotel.rating}★`,
            `${hotel.distanceKm} km from ${destination.landmark}`,
            ...hotel.amenities,
            hotel.refundable
              ? "Free cancellation"
              : "Non-refundable",
          ],

          options: [
            {
              code: optionCode,
              label:
                hotel.category,
              fare: Math.round(
                hotel.pricePerNight *
                  factor /
                  50,
              ) * 50,
              available:
                2 +
                (hash(
                  seed + index,
                ) %
                  10),
              probability:
                90 +
                (hash(
                  seed + "prob",
                ) %
                  10),
            },
          ],
        };
      },
    );
  }

  /* =====================================================
     NORMAL TRANSPORT
     ===================================================== */

  const routes =
    routePoolFor(mode);

  const actualCount =
    Math.min(
      Math.max(count, 1),
      routes.length,
    );

  const dayKey =
    date
      .toISOString()
      .slice(0, 10);

  const startHour =
    slotStart[slot] ?? 6;

  return Array.from({
    length: actualCount,
  }).map((_, i) => {
    const selectedRoute =
      routes[
        (i +
          hash(
            `${from?.code ?? ""}-${to?.code ?? ""}-${mode}`,
          )) %
          routes.length
      ];

    const routeFrom =
      selectedRoute.from;

    const routeTo =
      selectedRoute.to;

    const km =
      distanceKm(
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
      `${mode}-${routeFrom.code}-${routeTo.code}-${dayKey}-${i}-${nonce}`;

    const depart =
      `${String(
        (startHour + i * 2) %
          24,
      ).padStart(2, "0")}:${pick(
        seed + "-minute",
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
      fareKm: number,
      base: number,
      capacity: (
        code: string,
      ) => number,
    ) =>
      ladder.map(
        ({ code, label }) => {
          const available =
            capacity(code);

          const factor =
            priceFactors({
              date,
              departHour,
              seatShare:
                Math.min(
                  1,
                  available /
                    100,
                ),
              seed:
                seed + code,
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

            probability:
              Math.min(
                99,
                60 +
                  available +
                  (hash(
                    seed + code,
                  ) %
                    20),
              ),
          };
        },
      );

    /* ===================================================
       FLIGHT
       =================================================== */

    if (mode === "flight") {
      const mins =
        Math.round(
          km / 12 + 45,
        );

      const airline =
        pick(seed, airlines);

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
        toCode:
          routeTo.code,

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
          seed + "-tags",
          [
            ["Non-stop"],
            [
              "Non-stop",
              "Cabin bag included",
            ],
            [
              "1 stop",
            ],
          ],
        ),

        options:
          buildOptions(
            km,
            0.42,
            (code) =>
              10 +
              (hash(
                seed + code,
              ) %
                (code ===
                "BUSINESS"
                  ? 15
                  : 50)),
          ),
      };
    }

    /* ===================================================
       METRO
       =================================================== */

    if (mode === "metro") {
      const line =
        pick(
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
          (hash(seed) % 90)
        }`,

        from: routeFrom.city,
        fromCode:
          routeFrom.code,

        to: routeTo.city,
        toCode:
          routeTo.code,

        depart,

        arrive:
          addMinutes(
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

        options:
          buildOptions(
            20,
            1.4,
            () => 400,
          ),
      };
    }

    /* ===================================================
       FERRY
       =================================================== */

    if (mode === "ferry") {
      const operator =
        pick(
          seed,
          ferryOperators,
        );

      const mins =
        60 +
        (hash(seed) % 240);

      return {
        id: seed,
        mode,

        name:
          `${operator} Crossing`,

        code: `FRY-${
          100 +
          (hash(seed) % 400)
        }`,

        operator,

        from: routeFrom.city,
        fromCode:
          routeFrom.code,

        to: routeTo.city,
        toCode:
          routeTo.code,

        depart,

        arrive:
          addMinutes(
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

        options:
          buildOptions(
            Math.round(km / 6),
            1.1,
            (code) =>
              10 +
              (hash(
                seed + code,
              ) %
                90),
          ),
      };
    }

    /* ===================================================
       BUS
       =================================================== */

    if (mode === "bus") {
      const operator =
        pick(
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

        name: operator,

        code: `BUS-${
          1000 +
          (hash(seed) % 9000)
        }`,

        operator,

        from: routeFrom.city,
        fromCode:
          routeFrom.code,

        to: routeTo.city,
        toCode:
          routeTo.code,

        depart,

        arrive:
          addMinutes(
            depart,
            mins,
          ),

        durationMins: mins,
        duration:
          fmtDuration(mins),

        distanceKm: km,

        tags: pick(
          seed + "-tags",
          [
            ["AC Sleeper"],
            ["Volvo Multi-Axle"],
            [
              "Live tracking",
              "Charging point",
            ],
          ],
        ),

        options:
          buildOptions(
            km,
            0.5,
            (code) =>
              4 +
              (hash(
                seed + code,
              ) %
                32),
          ),
      };
    }

    /* ===================================================
       TRAIN
       =================================================== */

    const mins =
      Math.round(
        km / 0.9 + 40,
      );

    const trainName =
      `${pick(
        seed,
        trainPrefix,
      )} ${pick(
        seed + "-suffix",
        trainSuffix,
      )}`;

    return {
      id: seed,
      mode: "train",

      name: trainName,

      code: String(
        11000 +
          (hash(seed) % 8000),
      ),

      from: routeFrom.city,
      fromCode:
        routeFrom.code,

      to: routeTo.city,
      toCode:
        routeTo.code,

      depart,

      arrive:
        addMinutes(
          depart,
          mins,
        ),

      durationMins: mins,
      duration:
        fmtDuration(mins),

      distanceKm: km,

      tags: pick(
        seed + "-tags",
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

      options:
        buildOptions(
          km,
          0.62,
          (code) =>
            code === "GEN"
              ? 60 +
                (hash(
                  seed + code,
                ) %
                  120)
              : code === "1A"
                ? 4 +
                  (hash(
                    seed + code,
                  ) %
                    14)
                : hash(
                    seed + code,
                  ) % 46,
        ),
    };
  });
}

/* =========================================================
   STATION HELPERS
   ========================================================= */

export function findStation(
  code: string,
): any {
  return (
    stations.find(
      (s: any) =>
        s.code === code,
    ) ?? stations[0]
  );
}

export function searchStations(
  term: string,
  exclude?: string,
  limit = 30,
): any[] {
  const q =
    term.trim().toLowerCase();

  return stations
    .filter(
      (s: any) =>
        s.code !== exclude,
    )
    .filter(
      (s: any) =>
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
  station: any,
): number =>
  30 +
  (hash(station.code) % 20);

/* =========================================================
   INDEPENDENT ROUTE NETWORKS
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
      "Rail corridor with scheduled commercial halts.",
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
      "Expressway coach route with refreshment stops.",
  },

  flight: {
    network:
      "Skyway Air Corridor",
    nodes: [
      "Waypoint ALFA-21",
      "Waypoint TARA-08",
      "Sector Delta",
      "Waypoint NOVA-14",
      "Coastal Handoff",
    ],
    note:
      "Air corridor waypoints — no intermediate boarding.",
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
      "Urban metro network with frequent services.",
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
      "Sea lane with tide-dependent timings.",
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
  const pool = [...arr];

  let h = hash(seed);

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

/* =========================================================
   TERMINALS
   ========================================================= */

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

/* =========================================================
   ROUTE PREVIEW
   ========================================================= */

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

        const m =
          Math.round(
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
                : `${2 + (hash(
                    seed + name,
                  ) %
                    8)} min`,
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
      Math.floor(
        minutes,
      ) *
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
    name: "Idli Sambar",
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
    id: "samosa",
    name: "Samosa",
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
    id: "misal",
    name: "Kolhapuri Misal Pav",
    category: "Regional",
    price: 140,
    veg: true,
  },
  {
    id: "dhokla",
    name: "Khaman Dhokla",
    category: "Regional",
    price: 100,
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
    id: "kids-pasta",
    name: "Kids Cheesy Pasta",
    category: "Kids",
    price: 150,
    veg: true,
  },
  {
    id: "jain-thali",
    name: "Jain Thali",
    category: "Jain",
    price: 190,
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
    id: "chicken-biryani",
    name: "Chicken Biryani",
    category: "Non Vegetarian",
    price: 260,
    veg: false,
  },
  {
    id: "diabetic",
    name: "Low-GI Meal",
    category: "Special",
    price: 210,
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
    id: "gulab",
    name: "Gulab Jamun",
    category: "Desserts",
    price: 70,
    veg: true,
  },
];
