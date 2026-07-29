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
  classes: { code: string; fare: number; available: number; probability: number }[];
  type: "Rajdhani" | "Shatabdi" | "Superfast" | "Express" | "Vande Bharat";
  tags?: string[];
};

export type Passenger = {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F" | "O";
  berth: "Lower" | "Middle" | "Upper" | "Side Lower" | "Side Upper" | "No Preference";
  idType: string;
  idNumber: string;
};

export const savedPassengers: Passenger[] = [
  { id: "p1", name: "Aarav Sharma", age: 32, gender: "M", berth: "Lower", idType: "Aadhaar", idNumber: "XXXX-1234" },
  { id: "p2", name: "Priya Iyer", age: 29, gender: "F", berth: "Side Lower", idType: "Aadhaar", idNumber: "XXXX-5581" },
  { id: "p3", name: "Rohan Mehta", age: 8, gender: "M", berth: "No Preference", idType: "Birth Cert.", idNumber: "BC-2017-9921" },
  { id: "p4", name: "Ananya Rao", age: 67, gender: "F", berth: "Lower", idType: "Sr. Citizen", idNumber: "SC-1958-7712" },
];

export const trains: Train[] = [
  {
    id: "t1",
    name: "Vande Bharat Express",
    number: "22439",
    from: "New Delhi", fromCode: "NDLS",
    to: "Jaipur Jn", toCode: "JP",
    depart: "06:10", arrive: "10:35",
    duration: "4h 25m",
    type: "Vande Bharat",
    tags: ["Fastest", "Onboard catering"],
    classes: [
      { code: "CC", fare: 1245, available: 42, probability: 98 },
      { code: "EC", fare: 2340, available: 12, probability: 96 },
    ],
  },
  {
    id: "t2",
    name: "Ajmer Shatabdi",
    number: "12015",
    from: "New Delhi", fromCode: "NDLS",
    to: "Jaipur Jn", toCode: "JP",
    depart: "06:05", arrive: "10:40",
    duration: "4h 35m",
    type: "Shatabdi",
    tags: ["AC", "Breakfast incl."],
    classes: [
      { code: "CC", fare: 970, available: 118, probability: 99 },
      { code: "EC", fare: 1815, available: 24, probability: 97 },
    ],
  },
  {
    id: "t3",
    name: "Jaipur Double Decker",
    number: "12985",
    from: "Delhi Sarai R.", fromCode: "DEE",
    to: "Jaipur Jn", toCode: "JP",
    depart: "05:40", arrive: "10:20",
    duration: "4h 40m",
    type: "Superfast",
    tags: ["AC Chair Car"],
    classes: [{ code: "CC", fare: 720, available: 6, probability: 62 }],
  },
  {
    id: "t4",
    name: "Ashram Express",
    number: "12916",
    from: "Old Delhi", fromCode: "DLI",
    to: "Jaipur Jn", toCode: "JP",
    depart: "15:20", arrive: "20:55",
    duration: "5h 35m",
    type: "Superfast",
    tags: ["Sleeper avail."],
    classes: [
      { code: "SL", fare: 285, available: 0, probability: 34 },
      { code: "3A", fare: 755, available: 3, probability: 48 },
      { code: "2A", fare: 1080, available: 0, probability: 22 },
    ],
  },
];

export const alternatives = [
  {
    id: "a1",
    kind: "Earlier train",
    title: "Ashram Express — 15:20",
    detail: "Sleeper class · ₹285 · WL 12/GNWL",
    icon: "train",
  },
  {
    id: "a2",
    kind: "Bus",
    title: "RSRTC Volvo A/C · 22:00",
    detail: "9h 10m · ₹899 · 14 seats left",
    icon: "bus",
  },
  {
    id: "a3",
    kind: "Metro + Bus",
    title: "Delhi Metro → ISBT Kashmere Gate → Bus",
    detail: "Total ~10h · ₹640 · Frequent departures",
    icon: "route",
  },
  {
    id: "a4",
    kind: "Cheapest",
    title: "Volvo Non-A/C Seater · 21:15",
    detail: "10h · ₹549 · 28 seats left",
    icon: "coins",
  },
];

export const stations = [
  "New Delhi (NDLS)",
  "Old Delhi (DLI)",
  "Hazrat Nizamuddin (NZM)",
  "Mumbai Central (BCT)",
  "Chhatrapati Shivaji T. (CSMT)",
  "Bengaluru City (SBC)",
  "Chennai Central (MAS)",
  "Howrah Jn (HWH)",
  "Sealdah (SDAH)",
  "Jaipur Jn (JP)",
  "Ahmedabad Jn (ADI)",
  "Pune Jn (PUNE)",
  "Lucknow NR (LKO)",
  "Patna Jn (PNBE)",
  "Secunderabad Jn (SC)",
];

export const suggestions = [
  "Cheapest AC train from Delhi to Jaipur tomorrow morning",
  "Vande Bharat from Mumbai to Ahmedabad this Friday",
  "Overnight sleeper from Bengaluru to Chennai",
  "Fastest train Delhi → Lucknow under ₹1500",
  "Tatkal 3A from Patna to Howrah for Monday",
];
