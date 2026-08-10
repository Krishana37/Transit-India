// ============================================================
// TRANSIT INDIA — DUMMY DATA
// Frontend / Hackathon Prototype Data
//
// IMPORTANT:
// - Train stations are railway stations.
// - Metro stations are completely separate.
// - Bus terminals are separate from railway stations.
// - Airports are separate from railway stations.
// - Ferry terminals are separate from railway stations.
// - Hotels have location data only.
// - All data is fictional/demo data.
// ============================================================

// ============================================================
// GENERIC TYPES
// ============================================================

export type TransportDataMode =
  | "train"
  | "bus"
  | "flight"
  | "metro"
  | "ferry"
  | "hotel"
  | "cab";

// ============================================================
// RAILWAY STATIONS
// Used primarily for TRAIN search.
// ============================================================

export type Station = {
  name: string;
  code: string;
  city: string;
  state: string;
};

export const stations: Station[] = [
  // DELHI
  { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
  { name: "Old Delhi", code: "DLI", city: "Delhi", state: "Delhi" },
  {
    name: "Hazrat Nizamuddin",
    code: "NZM",
    city: "Delhi",
    state: "Delhi",
  },
  {
    name: "Delhi Sarai Rohilla",
    code: "DEE",
    city: "Delhi",
    state: "Delhi",
  },
  {
    name: "Anand Vihar Terminal",
    code: "ANVT",
    city: "Delhi",
    state: "Delhi",
  },

  // MUMBAI
  {
    name: "Mumbai Central",
    code: "MMCT",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Chhatrapati Shivaji Maharaj Terminus",
    code: "CSMT",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Bandra Terminus",
    code: "BDTS",
    city: "Mumbai",
    state: "Maharashtra",
  },

  // MAHARASHTRA
  {
    name: "Pune Junction",
    code: "PUNE",
    city: "Pune",
    state: "Maharashtra",
  },
  {
    name: "Nagpur Junction",
    code: "NGP",
    city: "Nagpur",
    state: "Maharashtra",
  },
  {
    name: "Nashik Road",
    code: "NK",
    city: "Nashik",
    state: "Maharashtra",
  },

  // KARNATAKA
  {
    name: "KSR Bengaluru City",
    code: "SBC",
    city: "Bengaluru",
    state: "Karnataka",
  },
  {
    name: "Yesvantpur Junction",
    code: "YPR",
    city: "Bengaluru",
    state: "Karnataka",
  },
  {
    name: "Mysuru Junction",
    code: "MYS",
    city: "Mysuru",
    state: "Karnataka",
  },

  // TAMIL NADU
  {
    name: "MGR Chennai Central",
    code: "MAS",
    city: "Chennai",
    state: "Tamil Nadu",
  },
  {
    name: "Chennai Egmore",
    code: "MS",
    city: "Chennai",
    state: "Tamil Nadu",
  },
  {
    name: "Coimbatore Junction",
    code: "CBE",
    city: "Coimbatore",
    state: "Tamil Nadu",
  },
  {
    name: "Madurai Junction",
    code: "MDU",
    city: "Madurai",
    state: "Tamil Nadu",
  },

  // WEST BENGAL
  {
    name: "Howrah Junction",
    code: "HWH",
    city: "Kolkata",
    state: "West Bengal",
  },
  {
    name: "Sealdah",
    code: "SDAH",
    city: "Kolkata",
    state: "West Bengal",
  },

  // TELANGANA
  {
    name: "Secunderabad Junction",
    code: "SC",
    city: "Hyderabad",
    state: "Telangana",
  },
  {
    name: "Hyderabad Deccan",
    code: "HYB",
    city: "Hyderabad",
    state: "Telangana",
  },

  // GUJARAT
  {
    name: "Ahmedabad Junction",
    code: "ADI",
    city: "Ahmedabad",
    state: "Gujarat",
  },
  {
    name: "Surat",
    code: "ST",
    city: "Surat",
    state: "Gujarat",
  },
  {
    name: "Vadodara Junction",
    code: "BRC",
    city: "Vadodara",
    state: "Gujarat",
  },
  {
    name: "Rajkot Junction",
    code: "RJT",
    city: "Rajkot",
    state: "Gujarat",
  },

  // RAJASTHAN
  {
    name: "Jaipur Junction",
    code: "JP",
    city: "Jaipur",
    state: "Rajasthan",
  },
  {
    name: "Jodhpur Junction",
    code: "JU",
    city: "Jodhpur",
    state: "Rajasthan",
  },
  {
    name: "Udaipur City",
    code: "UDZ",
    city: "Udaipur",
    state: "Rajasthan",
  },
  {
    name: "Ajmer Junction",
    code: "AII",
    city: "Ajmer",
    state: "Rajasthan",
  },

  // UTTAR PRADESH
  {
    name: "Lucknow NR",
    code: "LKO",
    city: "Lucknow",
    state: "Uttar Pradesh",
  },
  {
    name: "Kanpur Central",
    code: "CNB",
    city: "Kanpur",
    state: "Uttar Pradesh",
  },
  {
    name: "Varanasi Junction",
    code: "BSB",
    city: "Varanasi",
    state: "Uttar Pradesh",
  },
  {
    name: "Agra Cantt",
    code: "AGC",
    city: "Agra",
    state: "Uttar Pradesh",
  },

  // BIHAR
  {
    name: "Patna Junction",
    code: "PNBE",
    city: "Patna",
    state: "Bihar",
  },
  {
    name: "Gaya Junction",
    code: "GAYA",
    city: "Gaya",
    state: "Bihar",
  },

  // ODISHA
  {
    name: "Bhubaneswar",
    code: "BBS",
    city: "Bhubaneswar",
    state: "Odisha",
  },
  {
    name: "Puri",
    code: "PURI",
    city: "Puri",
    state: "Odisha",
  },

  // MADHYA PRADESH
  {
    name: "Bhopal Junction",
    code: "BPL",
    city: "Bhopal",
    state: "Madhya Pradesh",
  },
  {
    name: "Indore Junction",
    code: "INDB",
    city: "Indore",
    state: "Madhya Pradesh",
  },

  // PUNJAB / CHANDIGARH
  {
    name: "Chandigarh",
    code: "CDG",
    city: "Chandigarh",
    state: "Chandigarh",
  },
  {
    name: "Amritsar Junction",
    code: "ASR",
    city: "Amritsar",
    state: "Punjab",
  },

  // UTTARAKHAND
  {
    name: "Dehradun",
    code: "DDN",
    city: "Dehradun",
    state: "Uttarakhand",
  },
  {
    name: "Haridwar Junction",
    code: "HW",
    city: "Haridwar",
    state: "Uttarakhand",
  },

  // JAMMU & KASHMIR
  {
    name: "Jammu Tawi",
    code: "JAT",
    city: "Jammu",
    state: "Jammu & Kashmir",
  },

  // HIMACHAL
  {
    name: "Shimla",
    code: "SML",
    city: "Shimla",
    state: "Himachal Pradesh",
  },

  // ASSAM
  {
    name: "Guwahati",
    code: "GHY",
    city: "Guwahati",
    state: "Assam",
  },
  {
    name: "Dibrugarh",
    code: "DBRG",
    city: "Dibrugarh",
    state: "Assam",
  },

  // JHARKHAND
  {
    name: "Ranchi Junction",
    code: "RNC",
    city: "Ranchi",
    state: "Jharkhand",
  },
  {
    name: "Dhanbad Junction",
    code: "DHN",
    city: "Dhanbad",
    state: "Jharkhand",
  },

  // CHHATTISGARH
  {
    name: "Raipur Junction",
    code: "R",
    city: "Raipur",
    state: "Chhattisgarh",
  },
  {
    name: "Bilaspur Junction",
    code: "BSP",
    city: "Bilaspur",
    state: "Chhattisgarh",
  },

  // GOA
  {
    name: "Madgaon",
    code: "MAO",
    city: "Madgaon",
    state: "Goa",
  },
  {
    name: "Vasco Da Gama",
    code: "VSG",
    city: "Vasco",
    state: "Goa",
  },

  // KERALA
  {
    name: "Ernakulam Junction",
    code: "ERS",
    city: "Kochi",
    state: "Kerala",
  },
  {
    name: "Thiruvananthapuram Central",
    code: "TVC",
    city: "Thiruvananthapuram",
    state: "Kerala",
  },
];

// ============================================================
// BUS TERMINALS
// IMPORTANT: NOT RAILWAY STATIONS.
// ============================================================

export type BusTerminal = {
  name: string;
  code: string;
  city: string;
  state: string;
};

export const busTerminals: BusTerminal[] = [
  { name: "Kashmere Gate ISBT", code: "DLI-ISBT", city: "Delhi", state: "Delhi" },
  { name: "Anand Vihar ISBT", code: "ANV-ISBT", city: "Delhi", state: "Delhi" },
  { name: "Jaipur Sindhi Camp", code: "JAI-BUS", city: "Jaipur", state: "Rajasthan" },
  { name: "Mumbai Central Bus Depot", code: "BOM-BUS", city: "Mumbai", state: "Maharashtra" },
  { name: "Swargate Bus Stand", code: "PUN-BUS", city: "Pune", state: "Maharashtra" },
  { name: "Bengaluru Majestic", code: "BLR-BUS", city: "Bengaluru", state: "Karnataka" },
  { name: "Chennai CMBT", code: "MAA-BUS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Hyderabad MGBS", code: "HYD-BUS", city: "Hyderabad", state: "Telangana" },
  { name: "Ahmedabad Geeta Mandir", code: "AMD-BUS", city: "Ahmedabad", state: "Gujarat" },
  { name: "Vadodara Central Bus Station", code: "BDQ-BUS", city: "Vadodara", state: "Gujarat" },
  { name: "Lucknow Alambagh", code: "LKO-BUS", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Chandigarh ISBT Sector 43", code: "CDG-BUS", city: "Chandigarh", state: "Chandigarh" },
  { name: "Dehradun ISBT", code: "DDN-BUS", city: "Dehradun", state: "Uttarakhand" },
  { name: "Shimla ISBT Tutikandi", code: "SML-BUS", city: "Shimla", state: "Himachal Pradesh" },
  { name: "Patna ISBT", code: "PAT-BUS", city: "Patna", state: "Bihar" },
  { name: "Ranchi Khadgarha Bus Stand", code: "RNC-BUS", city: "Ranchi", state: "Jharkhand" },
  { name: "Guwahati ISBT", code: "GHY-BUS", city: "Guwahati", state: "Assam" },
  { name: "Bhubaneswar Baramunda", code: "BBI-BUS", city: "Bhubaneswar", state: "Odisha" },
  { name: "Goa Kadamba Bus Stand", code: "GOI-BUS", city: "Panaji", state: "Goa" },
  { name: "Kochi Vyttila Hub", code: "COK-BUS", city: "Kochi", state: "Kerala" },
];

// ============================================================
// AIRPORTS
// Completely separate from railway stations.
// ============================================================

export type Airport = {
  name: string;
  code: string;
  city: string;
  state: string;
};

export const airports: Airport[] = [
  { name: "Indira Gandhi International Airport", code: "DEL", city: "Delhi", state: "Delhi" },
  { name: "Chhatrapati Shivaji Maharaj International Airport", code: "BOM", city: "Mumbai", state: "Maharashtra" },
  { name: "Kempegowda International Airport", code: "BLR", city: "Bengaluru", state: "Karnataka" },
  { name: "Chennai International Airport", code: "MAA", city: "Chennai", state: "Tamil Nadu" },
  { name: "Rajiv Gandhi International Airport", code: "HYD", city: "Hyderabad", state: "Telangana" },
  { name: "Netaji Subhas Chandra Bose International Airport", code: "CCU", city: "Kolkata", state: "West Bengal" },
  { name: "Sardar Vallabhbhai Patel International Airport", code: "AMD", city: "Ahmedabad", state: "Gujarat" },
  { name: "Jaipur International Airport", code: "JAI", city: "Jaipur", state: "Rajasthan" },
  { name: "Pune International Airport", code: "PNQ", city: "Pune", state: "Maharashtra" },
  { name: "Goa International Airport", code: "GOI", city: "Goa", state: "Goa" },
  { name: "Lal Bahadur Shastri International Airport", code: "VNS", city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Chandigarh International Airport", code: "IXC", city: "Chandigarh", state: "Chandigarh" },
  { name: "Lokpriya Gopinath Bordoloi International Airport", code: "GAU", city: "Guwahati", state: "Assam" },
  { name: "Cochin International Airport", code: "COK", city: "Kochi", state: "Kerala" },
  { name: "Trivandrum International Airport", code: "TRV", city: "Thiruvananthapuram", state: "Kerala" },
];

// ============================================================
// METRO STATIONS
// IMPORTANT:
// These are NOT railway stations.
// Inventory.ts will use these for metro routes only.
// ============================================================

export type MetroStation = {
  name: string;
  code: string;
  city: string;
  state: string;
  metro: string;
  line: string;
};

export const metroStations: MetroStation[] = [
  // DELHI
  {
    name: "Rajiv Chowk",
    code: "DM-RJC",
    city: "Delhi",
    state: "Delhi",
    metro: "Delhi Metro",
    line: "Blue / Yellow",
  },
  {
    name: "Kashmere Gate",
    code: "DM-KMG",
    city: "Delhi",
    state: "Delhi",
    metro: "Delhi Metro",
    line: "Red / Yellow / Violet",
  },
  {
    name: "Saket",
    code: "DM-SKT",
    city: "Delhi",
    state: "Delhi",
    metro: "Delhi Metro",
    line: "Yellow",
  },
  {
    name: "Dwarka Sector 21",
    code: "DM-DS21",
    city: "Delhi",
    state: "Delhi",
    metro: "Delhi Metro",
    line: "Blue / Airport Express",
  },
  {
    name: "Botanical Garden",
    code: "DM-BTG",
    city: "Noida",
    state: "Uttar Pradesh",
    metro: "Delhi Metro",
    line: "Blue / Magenta",
  },
  {
    name: "Noida Electronic City",
    code: "DM-NEC",
    city: "Noida",
    state: "Uttar Pradesh",
    metro: "Delhi Metro",
    line: "Blue",
  },
  {
    name: "HUDA City Centre",
    code: "DM-HCC",
    city: "Gurugram",
    state: "Haryana",
    metro: "Delhi Metro",
    line: "Yellow",
  },
  {
    name: "Janakpuri West",
    code: "DM-JPW",
    city: "Delhi",
    state: "Delhi",
    metro: "Delhi Metro",
    line: "Blue / Magenta",
  },

  // MUMBAI
  {
    name: "Versova",
    code: "MM-VER",
    city: "Mumbai",
    state: "Maharashtra",
    metro: "Mumbai Metro",
    line: "Line 1",
  },
  {
    name: "Andheri West",
    code: "MM-AW",
    city: "Mumbai",
    state: "Maharashtra",
    metro: "Mumbai Metro",
    line: "Line 2A",
  },
  {
    name: "Ghatkopar",
    code: "MM-GHA",
    city: "Mumbai",
    state: "Maharashtra",
    metro: "Mumbai Metro",
    line: "Line 1",
  },
  {
    name: "Dahisar East",
    code: "MM-DHE",
    city: "Mumbai",
    state: "Maharashtra",
    metro: "Mumbai Metro",
    line: "Line 7",
  },

  // BENGALURU
  {
    name: "Whitefield",
    code: "BM-WFD",
    city: "Bengaluru",
    state: "Karnataka",
    metro: "Namma Metro",
    line: "Purple",
  },
  {
    name: "Majestic",
    code: "BM-MAJ",
    city: "Bengaluru",
    state: "Karnataka",
    metro: "Namma Metro",
    line: "Purple / Green",
  },
  {
    name: "Silk Institute",
    code: "BM-SI",
    city: "Bengaluru",
    state: "Karnataka",
    metro: "Namma Metro",
    line: "Green",
  },
  {
    name: "Nagasandra",
    code: "BM-NGS",
    city: "Bengaluru",
    state: "Karnataka",
    metro: "Namma Metro",
    line: "Green",
  },

  // CHENNAI
  {
    name: "Chennai Airport Metro",
    code: "CM-AIR",
    city: "Chennai",
    state: "Tamil Nadu",
    metro: "Chennai Metro",
    line: "Blue",
  },
  {
    name: "Central Metro",
    code: "CM-CEN",
    city: "Chennai",
    state: "Tamil Nadu",
    metro: "Chennai Metro",
    line: "Blue / Green",
  },
  {
    name: "Washermenpet",
    code: "CM-WPT",
    city: "Chennai",
    state: "Tamil Nadu",
    metro: "Chennai Metro",
    line: "Blue",
  },

  // HYDERABAD
  {
    name: "Miyapur",
    code: "HM-MYP",
    city: "Hyderabad",
    state: "Telangana",
    metro: "Hyderabad Metro",
    line: "Red",
  },
  {
    name: "LB Nagar",
    code: "HM-LBN",
    city: "Hyderabad",
    state: "Telangana",
    metro: "Hyderabad Metro",
    line: "Red",
  },
  {
    name: "Raidurg",
    code: "HM-RDG",
    city: "Hyderabad",
    state: "Telangana",
    metro: "Hyderabad Metro",
    line: "Blue",
  },
  {
    name: "Nagole",
    code: "HM-NGL",
    city: "Hyderabad",
    state: "Telangana",
    metro: "Hyderabad Metro",
    line: "Blue",
  },

  // KOLKATA
  {
    name: "Noapara",
    code: "KM-NPR",
    city: "Kolkata",
    state: "West Bengal",
    metro: "Kolkata Metro",
    line: "Blue",
  },
  {
    name: "Kavi Subhash",
    code: "KM-KVS",
    city: "Kolkata",
    state: "West Bengal",
    metro: "Kolkata Metro",
    line: "Blue",
  },
  {
    name: "Howrah Maidan Metro",
    code: "KM-HWM",
    city: "Howrah",
    state: "West Bengal",
    metro: "Kolkata Metro",
    line: "Green",
  },
  {
    name: "Salt Lake Sector V",
    code: "KM-SLV",
    city: "Kolkata",
    state: "West Bengal",
    metro: "Kolkata Metro",
    line: "Green",
  },

  // AHMEDABAD
  {
    name: "Motera Stadium",
    code: "AM-MOT",
    city: "Ahmedabad",
    state: "Gujarat",
    metro: "Ahmedabad Metro",
    line: "North-South",
  },
  {
    name: "Vastral Gam",
    code: "AM-VAG",
    city: "Ahmedabad",
    state: "Gujarat",
    metro: "Ahmedabad Metro",
    line: "North-South",
  },

  // JAIPUR
  {
    name: "Mansarovar",
    code: "JM-MSR",
    city: "Jaipur",
    state: "Rajasthan",
    metro: "Jaipur Metro",
    line: "Pink",
  },
  {
    name: "Badi Chaupar",
    code: "JM-BCP",
    city: "Jaipur",
    state: "Rajasthan",
    metro: "Jaipur Metro",
    line: "Pink",
  },

  // KOCHI
  {
    name: "Aluva",
    code: "KM-ALV",
    city: "Kochi",
    state: "Kerala",
    metro: "Kochi Metro",
    line: "Main",
  },
  {
    name: "Tripunithura",
    code: "KM-TPR",
    city: "Kochi",
    state: "Kerala",
    metro: "Kochi Metro",
    line: "Main",
  },

  // PUNE
  {
    name: "Vanaz",
    code: "PM-VNZ",
    city: "Pune",
    state: "Maharashtra",
    metro: "Pune Metro",
    line: "Aqua",
  },
  {
    name: "Ramwadi",
    code: "PM-RMW",
    city: "Pune",
    state: "Maharashtra",
    metro: "Pune Metro",
    line: "Aqua",
  },
  {
    name: "PCMC",
    code: "PM-PCM",
    city: "Pune",
    state: "Maharashtra",
    metro: "Pune Metro",
    line: "Purple",
  },
  {
    name: "Swargate",
    code: "PM-SWG",
    city: "Pune",
    state: "Maharashtra",
    metro: "Pune Metro",
    line: "Purple",
  },
];

// ============================================================
// FERRY TERMINALS
// Completely separate from railway stations.
// ============================================================

export type FerryTerminal = {
  name: string;
  code: string;
  city: string;
  state: string;
  waterbody: string;
};

export const ferryTerminals: FerryTerminal[] = [
  {
    name: "Gateway Ferry Terminal",
    code: "F-GOI",
    city: "Mumbai",
    state: "Maharashtra",
    waterbody: "Arabian Sea",
  },
  {
    name: "Mandwa Jetty",
    code: "F-MNW",
    city: "Alibaug",
    state: "Maharashtra",
    waterbody: "Arabian Sea",
  },
  {
    name: "Elephanta Jetty",
    code: "F-ELP",
    city: "Mumbai",
    state: "Maharashtra",
    waterbody: "Arabian Sea",
  },
  {
    name: "Dona Paula Jetty",
    code: "F-DNP",
    city: "Goa",
    state: "Goa",
    waterbody: "Arabian Sea",
  },
  {
    name: "Panaji Ferry Terminal",
    code: "F-PNJ",
    city: "Panaji",
    state: "Goa",
    waterbody: "Mandovi River",
  },
  {
    name: "Vasco Ferry Terminal",
    code: "F-VSC",
    city: "Vasco",
    state: "Goa",
    waterbody: "Arabian Sea",
  },
  {
    name: "Fort Kochi Jetty",
    code: "F-FKC",
    city: "Kochi",
    state: "Kerala",
    waterbody: "Arabian Sea",
  },
  {
    name: "Vypin Ferry Terminal",
    code: "F-VYP",
    city: "Kochi",
    state: "Kerala",
    waterbody: "Vembanad Lake",
  },
  {
    name: "Alappuzha Jetty",
    code: "F-ALL",
    city: "Alappuzha",
    state: "Kerala",
    waterbody: "Vembanad Lake",
  },
  {
    name: "Kumarakom Jetty",
    code: "F-KUM",
    city: "Kumarakom",
    state: "Kerala",
    waterbody: "Vembanad Lake",
  },
  {
    name: "Port Blair Jetty",
    code: "F-PTB",
    city: "Port Blair",
    state: "Andaman & Nicobar",
    waterbody: "Bay of Bengal",
  },
  {
    name: "Swaraj Dweep Jetty",
    code: "F-HAV",
    city: "Swaraj Dweep",
    state: "Andaman & Nicobar",
    waterbody: "Bay of Bengal",
  },
];

// ============================================================
// TRAIN DATA
// Kept for legacy components that directly consume `trains`.
// ============================================================

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

export const trains: Train[] = [
  {
    id: "t1",
    name: "Vande Bharat Express",
    number: "22439",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Jaipur Junction",
    toCode: "JP",
    depart: "06:10",
    arrive: "10:35",
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
    name: "Mumbai Rajdhani",
    number: "12952",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Mumbai Central",
    toCode: "MMCT",
    depart: "16:55",
    arrive: "08:35",
    duration: "15h 40m",
    type: "Rajdhani",
    tags: ["Meals included"],
    classes: [
      { code: "1A", fare: 4200, available: 8, probability: 94 },
      { code: "2A", fare: 2500, available: 31, probability: 91 },
      { code: "3A", fare: 1780, available: 67, probability: 95 },
    ],
  },
  {
    id: "t3",
    name: "Karnataka Express",
    number: "12628",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "KSR Bengaluru",
    toCode: "SBC",
    depart: "21:15",
    arrive: "06:40",
    duration: "33h 25m",
    type: "Express",
    classes: [
      { code: "SL", fare: 850, available: 94, probability: 76 },
      { code: "3A", fare: 2050, available: 31, probability: 88 },
      { code: "2A", fare: 2950, available: 12, probability: 91 },
    ],
  },
  {
    id: "t4",
    name: "Chennai Rajdhani",
    number: "12434",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Chennai Central",
    toCode: "MAS",
    depart: "15:55",
    arrive: "09:30",
    duration: "17h 35m",
    type: "Rajdhani",
    classes: [
      { code: "1A", fare: 4350, available: 5, probability: 94 },
      { code: "2A", fare: 2600, available: 22, probability: 92 },
      { code: "3A", fare: 1850, available: 49, probability: 95 },
    ],
  },
  {
    id: "t5",
    name: "Howrah Rajdhani",
    number: "12302",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Howrah Junction",
    toCode: "HWH",
    depart: "17:00",
    arrive: "10:00",
    duration: "17h",
    type: "Rajdhani",
    classes: [
      { code: "1A", fare: 4100, available: 7, probability: 95 },
      { code: "2A", fare: 2450, available: 27, probability: 93 },
      { code: "3A", fare: 1720, available: 61, probability: 96 },
    ],
  },
  {
    id: "t6",
    name: "Lucknow Shatabdi",
    number: "12004",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Lucknow",
    toCode: "LKO",
    depart: "06:10",
    arrive: "12:45",
    duration: "6h 35m",
    type: "Shatabdi",
    classes: [
      { code: "CC", fare: 1050, available: 76, probability: 98 },
      { code: "EC", fare: 1990, available: 14, probability: 96 },
    ],
  },
  {
    id: "t7",
    name: "Ahmedabad Vande Bharat",
    number: "20902",
    from: "Mumbai Central",
    fromCode: "MMCT",
    to: "Ahmedabad Junction",
    toCode: "ADI",
    depart: "06:00",
    arrive: "11:25",
    duration: "5h 25m",
    type: "Vande Bharat",
    classes: [
      { code: "CC", fare: 1280, available: 54, probability: 98 },
      { code: "EC", fare: 2380, available: 15, probability: 96 },
    ],
  },
  {
    id: "t8",
    name: "Coromandel Express",
    number: "12842",
    from: "Chennai Central",
    fromCode: "MAS",
    to: "Howrah Junction",
    toCode: "HWH",
    depart: "07:00",
    arrive: "14:20",
    duration: "27h 20m",
    type: "Superfast",
    classes: [
      { code: "SL", fare: 720, available: 110, probability: 87 },
      { code: "3A", fare: 1680, available: 45, probability: 93 },
      { code: "2A", fare: 2380, available: 19, probability: 91 },
    ],
  },
  {
    id: "t9",
    name: "Deccan Queen",
    number: "12124",
    from: "Mumbai Central",
    fromCode: "MMCT",
    to: "Pune Junction",
    toCode: "PUNE",
    depart: "07:10",
    arrive: "10:25",
    duration: "3h 15m",
    type: "Express",
    classes: [
      { code: "CC", fare: 560, available: 72, probability: 97 },
      { code: "EC", fare: 980, available: 12, probability: 93 },
    ],
  },
  {
    id: "t10",
    name: "Patna Rajdhani",
    number: "12310",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Patna Junction",
    toCode: "PNBE",
    depart: "17:15",
    arrive: "07:40",
    duration: "14h 25m",
    type: "Rajdhani",
    classes: [
      { code: "1A", fare: 3650, available: 6, probability: 94 },
      { code: "2A", fare: 2200, available: 25, probability: 92 },
      { code: "3A", fare: 1550, available: 54, probability: 95 },
    ],
  },
  {
    id: "t11",
    name: "Varanasi Vande Bharat",
    number: "22416",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Varanasi Junction",
    toCode: "BSB",
    depart: "06:00",
    arrive: "14:00",
    duration: "8h",
    type: "Vande Bharat",
    classes: [
      { code: "CC", fare: 1800, available: 48, probability: 97 },
      { code: "EC", fare: 3350, available: 11, probability: 95 },
    ],
  },
  {
    id: "t12",
    name: "Jammu Rajdhani",
    number: "12426",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Jammu Tawi",
    toCode: "JAT",
    depart: "20:10",
    arrive: "05:00",
    duration: "8h 50m",
    type: "Rajdhani",
    classes: [
      { code: "1A", fare: 3100, available: 6, probability: 94 },
      { code: "2A", fare: 1850, available: 24, probability: 92 },
      { code: "3A", fare: 1320, available: 58, probability: 95 },
    ],
  },
];

// ============================================================
// BUS ROUTES
// These use BUS TERMINAL codes, NOT railway codes.
// ============================================================

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

export const busRoutes: BusRoute[] = [
  {
    id: "b1",
    operator: "Royal Bharat Travels",
    busNumber: "TI-BUS-101",
    from: "Kashmere Gate ISBT",
    fromCode: "DLI-ISBT",
    to: "Jaipur Sindhi Camp",
    toCode: "JAI-BUS",
    depart: "22:00",
    arrive: "06:30",
    duration: "8h 30m",
    busType: "Volvo AC",
    fare: 899,
    seatsAvailable: 14,
    amenities: ["Wi-Fi", "Charging", "Water"],
  },
  {
    id: "b2",
    operator: "Vayu Travels",
    busNumber: "TI-BUS-102",
    from: "Anand Vihar ISBT",
    fromCode: "ANV-ISBT",
    to: "Lucknow Alambagh",
    toCode: "LKO-BUS",
    depart: "20:30",
    arrive: "07:00",
    duration: "10h 30m",
    busType: "AC Sleeper",
    fare: 1299,
    seatsAvailable: 18,
    amenities: ["Charging", "Blanket"],
  },
  {
    id: "b3",
    operator: "Sahyadri Coachlines",
    busNumber: "TI-BUS-103",
    from: "Mumbai Central Bus Depot",
    fromCode: "BOM-BUS",
    to: "Swargate Bus Stand",
    toCode: "PUN-BUS",
    depart: "08:00",
    arrive: "11:30",
    duration: "3h 30m",
    busType: "Volvo AC",
    fare: 549,
    seatsAvailable: 31,
    amenities: ["Charging", "Water"],
  },
  {
    id: "b4",
    operator: "CityLink Coaches",
    busNumber: "TI-BUS-104",
    from: "Bengaluru Majestic",
    fromCode: "BLR-BUS",
    to: "Chennai CMBT",
    toCode: "MAA-BUS",
    depart: "22:30",
    arrive: "05:30",
    duration: "7h",
    busType: "AC Sleeper",
    fare: 1099,
    seatsAvailable: 17,
    amenities: ["Wi-Fi", "Blanket", "Charging"],
  },
  {
    id: "b5",
    operator: "MetroLink Travels",
    busNumber: "TI-BUS-105",
    from: "Ahmedabad Geeta Mandir",
    fromCode: "AMD-BUS",
    to: "Vadodara Central Bus Station",
    toCode: "BDQ-BUS",
    depart: "07:45",
    arrive: "10:15",
    duration: "2h 30m",
    busType: "Volvo AC",
    fare: 399,
    seatsAvailable: 29,
    amenities: ["Charging", "Water"],
  },
  {
    id: "b6",
    operator: "Highway Star",
    busNumber: "TI-BUS-106",
    from: "Chandigarh ISBT Sector 43",
    fromCode: "CDG-BUS",
    to: "Shimla ISBT Tutikandi",
    toCode: "SML-BUS",
    depart: "08:00",
    arrive: "12:00",
    duration: "4h",
    busType: "Volvo AC",
    fare: 599,
    seatsAvailable: 21,
    amenities: ["Charging"],
  },
  {
    id: "b7",
    operator: "Bharat Roadways",
    busNumber: "TI-BUS-107",
    from: "Dehradun ISBT",
    fromCode: "DDN-BUS",
    to: "Kashmere Gate ISBT",
    toCode: "DLI-ISBT",
    depart: "21:00",
    arrive: "04:30",
    duration: "7h 30m",
    busType: "AC Sleeper",
    fare: 999,
    seatsAvailable: 16,
    amenities: ["Blanket", "Charging"],
  },
  {
    id: "b8",
    operator: "Eastern Coachlines",
    busNumber: "TI-BUS-108",
    from: "Patna ISBT",
    fromCode: "PAT-BUS",
    to: "Ranchi Khadgarha Bus Stand",
    toCode: "RNC-BUS",
    depart: "07:30",
    arrive: "14:00",
    duration: "6h 30m",
    busType: "AC Seater",
    fare: 649,
    seatsAvailable: 24,
    amenities: ["Charging", "Water"],
  },
  {
    id: "b9",
    operator: "NorthEast Connect",
    busNumber: "TI-BUS-109",
    from: "Guwahati ISBT",
    fromCode: "GHY-BUS",
    to: "Shillong",
    toCode: "SHL-BUS",
    depart: "07:00",
    arrive: "10:30",
    duration: "3h 30m",
    busType: "AC Seater",
    fare: 399,
    seatsAvailable: 25,
    amenities: ["Charging"],
  },
  {
    id: "b10",
    operator: "Coastal Bharat",
    busNumber: "TI-BUS-110",
    from: "Kochi Vyttila Hub",
    fromCode: "COK-BUS",
    to: "Goa Kadamba Bus Stand",
    toCode: "GOI-BUS",
    depart: "18:30",
    arrive: "07:30",
    duration: "13h",
    busType: "AC Sleeper",
    fare: 1499,
    seatsAvailable: 13,
    amenities: ["Wi-Fi", "Blanket", "Charging"],
  },
];

// ============================================================
// FLIGHT ROUTES
// Uses AIRPORT codes only.
// ============================================================

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
  fare: number;
  seatsAvailable: number;
  stops: number;
  cabin: "Economy" | "Premium Economy" | "Business";
};

export const flightRoutes: FlightRoute[] = [
  {
    id: "f1",
    airline: "IndiSky",
    flightNumber: "IS-201",
    from: "Delhi Airport",
    fromCode: "DEL",
    to: "Mumbai Airport",
    toCode: "BOM",
    depart: "06:20",
    arrive: "08:30",
    duration: "2h 10m",
    fare: 5499,
    seatsAvailable: 32,
    stops: 0,
    cabin: "Economy",
  },
  {
    id: "f2",
    airline: "Aeronix",
    flightNumber: "AX-311",
    from: "Delhi Airport",
    fromCode: "DEL",
    to: "Bengaluru Airport",
    toCode: "BLR",
    depart: "07:10",
    arrive: "10:05",
    duration: "2h 55m",
    fare: 6499,
    seatsAvailable: 24,
    stops: 0,
    cabin: "Economy",
  },
  {
    id: "f3",
    airline: "Skyra",
    flightNumber: "SK-442",
    from: "Mumbai Airport",
    fromCode: "BOM",
    to: "Bengaluru Airport",
    toCode: "BLR",
    depart: "09:30",
    arrive: "11:10",
    duration: "1h 40m",
    fare: 4299,
    seatsAvailable: 37,
    stops: 0,
    cabin: "Economy",
  },
  {
    id: "f4",
    airline: "Vayudoot Air",
    flightNumber: "VA-551",
    from: "Mumbai Airport",
    fromCode: "BOM",
    to: "Goa International Airport",
    toCode: "GOI",
    depart: "12:15",
    arrive: "13:20",
    duration: "1h 05m",
    fare: 3299,
    seatsAvailable: 28,
    stops: 0,
    cabin: "Economy",
  },
  {
    id: "f5",
    airline: "Bharat Air",
    flightNumber: "BA-612",
    from: "Delhi Airport",
    fromCode: "DEL",
    to: "Chennai Airport",
    toCode: "MAA",
    depart: "15:00",
    arrive: "17:50",
    duration: "2h 50m",
    fare: 6799,
    seatsAvailable: 21,
    stops: 0,
    cabin: "Economy",
  },
  {
    id: "f6",
    airline: "Zephyr Wings",
    flightNumber: "ZW-721",
    from: "Delhi Airport",
    fromCode: "DEL",
    to: "Ahmedabad Airport",
    toCode: "AMD",
    depart: "18:10",
    arrive: "19:50",
    duration: "1h 40m",
    fare: 3899,
    seatsAvailable: 30,
    stops: 0,
    cabin: "Economy",
  },
  {
    id: "f7",
    airline: "Horizon India",
    flightNumber: "HI-833",
    from: "Kolkata Airport",
    fromCode: "CCU",
    to: "Delhi Airport",
    toCode: "DEL",
    depart: "20:20",
    arrive: "22:55",
    duration: "2h 35m",
    fare: 5999,
    seatsAvailable: 19,
    stops: 0,
    cabin: "Economy",
  },
  {
    id: "f8",
    airline: "Aero Bharat",
    flightNumber: "AB-904",
    from: "Pune Airport",
    fromCode: "PNQ",
    to: "Delhi Airport",
    toCode: "DEL",
    depart: "21:30",
    arrive: "23:35",
    duration: "2h 05m",
    fare: 5799,
    seatsAvailable: 16,
    stops: 0,
    cabin: "Economy",
  },
];

// ============================================================
// METRO ROUTES
// IMPORTANT:
// These are generated from metroStations.
// They NEVER use railway station codes.
// ============================================================

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

export const metroRoutes: MetroRoute[] = [
  {
    id: "m1",
    metro: "Delhi Metro",
    line: "Yellow Line",
    from: "Rajiv Chowk",
    fromCode: "DM-RJC",
    to: "Saket",
    toCode: "DM-SKT",
    duration: "24m",
    fare: 30,
    frequency: "3-5 min",
    interchanges: 0,
  },
  {
    id: "m2",
    metro: "Delhi Metro",
    line: "Blue Line",
    from: "Dwarka Sector 21",
    fromCode: "DM-DS21",
    to: "Noida Electronic City",
    toCode: "DM-NEC",
    duration: "65m",
    fare: 60,
    frequency: "3-5 min",
    interchanges: 0,
  },
  {
    id: "m3",
    metro: "Delhi Metro",
    line: "Yellow Line",
    from: "Kashmere Gate",
    fromCode: "DM-KMG",
    to: "HUDA City Centre",
    toCode: "DM-HCC",
    duration: "52m",
    fare: 40,
    frequency: "3-5 min",
    interchanges: 0,
  },
  {
    id: "m4",
    metro: "Delhi Metro",
    line: "Magenta Line",
    from: "Janakpuri West",
    fromCode: "DM-JPW",
    to: "Botanical Garden",
    toCode: "DM-BTG",
    duration: "43m",
    fare: 50,
    frequency: "4-6 min",
    interchanges: 0,
  },
  {
    id: "m5",
    metro: "Mumbai Metro",
    line: "Line 1",
    from: "Versova",
    fromCode: "MM-VER",
    to: "Ghatkopar",
    toCode: "MM-GHA",
    duration: "42m",
    fare: 40,
    frequency: "4-6 min",
    interchanges: 0,
  },
  {
    id: "m6",
    metro: "Mumbai Metro",
    line: "Line 2A",
    from: "Dahisar East",
    fromCode: "MM-DHE",
    to: "Andheri West",
    toCode: "MM-AW",
    duration: "38m",
    fare: 30,
    frequency: "5-7 min",
    interchanges: 0,
  },
  {
    id: "m7",
    metro: "Bengaluru Metro",
    line: "Purple Line",
    from: "Whitefield",
    fromCode: "BM-WFD",
    to: "Majestic",
    toCode: "BM-MAJ",
    duration: "35m",
    fare: 40,
    frequency: "4-6 min",
    interchanges: 0,
  },
  {
    id: "m8",
    metro: "Bengaluru Metro",
    line: "Green Line",
    from: "Nagasandra",
    fromCode: "BM-NGS",
    to: "Silk Institute",
    toCode: "BM-SI",
    duration: "56m",
    fare: 50,
    frequency: "4-6 min",
    interchanges: 0,
  },
  {
    id: "m9",
    metro: "Chennai Metro",
    line: "Blue Line",
    from: "Chennai Airport Metro",
    fromCode: "CM-AIR",
    to: "Washermenpet",
    toCode: "CM-WPT",
    duration: "35m",
    fare: 40,
    frequency: "5-7 min",
    interchanges: 0,
  },
  {
    id: "m10",
    metro: "Chennai Metro",
    line: "Blue / Green",
    from: "Central Metro",
    fromCode: "CM-CEN",
    to: "Chennai Airport Metro",
    toCode: "CM-AIR",
    duration: "29m",
    fare: 30,
    frequency: "5-7 min",
    interchanges: 0,
  },
  {
    id: "m11",
    metro: "Hyderabad Metro",
    line: "Red Line",
    from: "Miyapur",
    fromCode: "HM-MYP",
    to: "LB Nagar",
    toCode: "HM-LBN",
    duration: "52m",
    fare: 50,
    frequency: "4-6 min",
    interchanges: 0,
  },
  {
    id: "m12",
    metro: "Hyderabad Metro",
    line: "Blue Line",
    from: "Nagole",
    fromCode: "HM-NGL",
    to: "Raidurg",
    toCode: "HM-RDG",
    duration: "45m",
    fare: 50,
    frequency: "4-6 min",
    interchanges: 0,
  },
  {
    id: "m13",
    metro: "Kolkata Metro",
    line: "Blue Line",
    from: "Noapara",
    fromCode: "KM-NPR",
    to: "Kavi Subhash",
    toCode: "KM-KVS",
    duration: "43m",
    fare: 30,
    frequency: "5-7 min",
    interchanges: 0,
  },
  {
    id: "m14",
    metro: "Kolkata Metro",
    line: "Green Line",
    from: "Howrah Maidan Metro",
    fromCode: "KM-HWM",
    to: "Salt Lake Sector V",
    toCode: "KM-SLV",
    duration: "35m",
    fare: 30,
    frequency: "5-7 min",
    interchanges: 0,
  },
  {
    id: "m15",
    metro: "Ahmedabad Metro",
    line: "North-South",
    from: "Motera Stadium",
    fromCode: "AM-MOT",
    to: "Vastral Gam",
    toCode: "AM-VAG",
    duration: "48m",
    fare: 40,
    frequency: "6-8 min",
    interchanges: 0,
  },
  {
    id: "m16",
    metro: "Jaipur Metro",
    line: "Pink Line",
    from: "Mansarovar",
    fromCode: "JM-MSR",
    to: "Badi Chaupar",
    toCode: "JM-BCP",
    duration: "31m",
    fare: 30,
    frequency: "6-8 min",
    interchanges: 0,
  },
  {
    id: "m17",
    metro: "Kochi Metro",
    line: "Main",
    from: "Aluva",
    fromCode: "KM-ALV",
    to: "Tripunithura",
    toCode: "KM-TPR",
    duration: "45m",
    fare: 50,
    frequency: "5-7 min",
    interchanges: 0,
  },
  {
    id: "m18",
    metro: "Pune Metro",
    line: "Aqua",
    from: "Vanaz",
    fromCode: "PM-VNZ",
    to: "Ramwadi",
    toCode: "PM-RMW",
    duration: "29m",
    fare: 30,
    frequency: "5-8 min",
    interchanges: 0,
  },
  {
    id: "m19",
    metro: "Pune Metro",
    line: "Purple",
    from: "PCMC",
    fromCode: "PM-PCM",
    to: "Swargate",
    toCode: "PM-SWG",
    duration: "34m",
    fare: 30,
    frequency: "5-8 min",
    interchanges: 0,
  },
];

// ============================================================
// FERRY ROUTES
// Uses FERRY TERMINAL codes.
// ============================================================

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
    | "Passenger Ferry"
    | "Catamaran"
    | "High Speed"
    | "Cruise Ferry";
};

export const ferryRoutes: FerryRoute[] = [
  {
    id: "fy1",
    operator: "Bluewater Ferries",
    ferryName: "Gateway Express",
    from: "Gateway Ferry Terminal",
    fromCode: "F-GOI",
    to: "Mandwa Jetty",
    toCode: "F-MNW",
    depart: "08:00",
    arrive: "09:15",
    duration: "1h 15m",
    fare: 450,
    seatsAvailable: 82,
    ferryType: "High Speed",
  },
  {
    id: "fy2",
    operator: "Island Connect",
    ferryName: "Elephanta Explorer",
    from: "Gateway Ferry Terminal",
    fromCode: "F-GOI",
    to: "Elephanta Jetty",
    toCode: "F-ELP",
    depart: "09:30",
    arrive: "10:20",
    duration: "50m",
    fare: 350,
    seatsAvailable: 96,
    ferryType: "Passenger Ferry",
  },
  {
    id: "fy3",
    operator: "Coastal Bharat",
    ferryName: "Mandovi Star",
    from: "Panaji Ferry Terminal",
    fromCode: "F-PNJ",
    to: "Vasco Ferry Terminal",
    toCode: "F-VSC",
    depart: "10:00",
    arrive: "10:45",
    duration: "45m",
    fare: 180,
    seatsAvailable: 120,
    ferryType: "Passenger Ferry",
  },
  {
    id: "fy4",
    operator: "Coral Coast Marine",
    ferryName: "Fort Kochi Runner",
    from: "Fort Kochi Jetty",
    fromCode: "F-FKC",
    to: "Vypin Ferry Terminal",
    toCode: "F-VYP",
    depart: "11:00",
    arrive: "11:25",
    duration: "25m",
    fare: 60,
    seatsAvailable: 135,
    ferryType: "Passenger Ferry",
  },
  {
    id: "fy5",
    operator: "Kerala Waterways",
    ferryName: "Kumarakom Express",
    from: "Kumarakom Jetty",
    fromCode: "F-KUM",
    to: "Alappuzha Jetty",
    toCode: "F-ALL",
    depart: "16:00",
    arrive: "17:15",
    duration: "1h 15m",
    fare: 300,
    seatsAvailable: 74,
    ferryType: "Catamaran",
  },
  {
    id: "fy6",
    operator: "Andaman Ferries",
    ferryName: "Island Star",
    from: "Port Blair Jetty",
    fromCode: "F-PTB",
    to: "Swaraj Dweep Jetty",
    toCode: "F-HAV",
    depart: "15:00",
    arrive: "16:00",
    duration: "1h",
    fare: 950,
    seatsAvailable: 51,
    ferryType: "High Speed",
  },
];

// ============================================================
// HOTEL DATA
// Hotels have NO from/to route.
// ============================================================

export type Hotel = {
  id: string;
  name: string;
  city: string;
  state: string;
  area: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  originalPrice?: number;
  image?: string;
  amenities: string[];
  tags?: string[];
  roomType: string;
  refundable: boolean;
  breakfastIncluded: boolean;
};

const hotelDestinations = [
  ["Delhi", "Delhi", "Connaught Place"],
  ["Mumbai", "Maharashtra", "Andheri"],
  ["Bengaluru", "Karnataka", "Whitefield"],
  ["Chennai", "Tamil Nadu", "T Nagar"],
  ["Hyderabad", "Telangana", "Banjara Hills"],
  ["Kolkata", "West Bengal", "Park Street"],
  ["Jaipur", "Rajasthan", "MI Road"],
  ["Ahmedabad", "Gujarat", "Navrangpura"],
  ["Pune", "Maharashtra", "Hinjewadi"],
  ["Lucknow", "Uttar Pradesh", "Gomti Nagar"],
  ["Agra", "Uttar Pradesh", "Taj Ganj"],
  ["Varanasi", "Uttar Pradesh", "Cantonment"],
  ["Amritsar", "Punjab", "Golden Temple Area"],
  ["Chandigarh", "Chandigarh", "Sector 17"],
  ["Goa", "Goa", "Calangute"],
  ["Kochi", "Kerala", "Fort Kochi"],
  ["Thiruvananthapuram", "Kerala", "Kowdiar"],
  ["Coimbatore", "Tamil Nadu", "RS Puram"],
  ["Madurai", "Tamil Nadu", "KK Nagar"],
  ["Mysuru", "Karnataka", "City Centre"],
  ["Bhopal", "Madhya Pradesh", "MP Nagar"],
  ["Indore", "Madhya Pradesh", "Vijay Nagar"],
  ["Nagpur", "Maharashtra", "Dharampeth"],
  ["Surat", "Gujarat", "Athwa"],
  ["Vadodara", "Gujarat", "Alkapuri"],
  ["Rajkot", "Gujarat", "Kalawad Road"],
  ["Udaipur", "Rajasthan", "Lake Pichola"],
  ["Jodhpur", "Rajasthan", "Ratanada"],
  ["Ajmer", "Rajasthan", "Civil Lines"],
  ["Kota", "Rajasthan", "Talwandi"],
  ["Patna", "Bihar", "Fraser Road"],
  ["Gaya", "Bihar", "Gaya Town"],
  ["Ranchi", "Jharkhand", "Main Road"],
  ["Jamshedpur", "Jharkhand", "Bistupur"],
  ["Bhubaneswar", "Odisha", "Jaydev Vihar"],
  ["Puri", "Odisha", "Swargadwar"],
  ["Guwahati", "Assam", "Paltan Bazaar"],
  ["Shimla", "Himachal Pradesh", "Mall Road"],
  ["Manali", "Himachal Pradesh", "Old Manali"],
  ["Dehradun", "Uttarakhand", "Rajpur Road"],
  ["Haridwar", "Uttarakhand", "Har Ki Pauri"],
  ["Srinagar", "Jammu & Kashmir", "Dal Lake"],
  ["Jammu", "Jammu & Kashmir", "Residency Road"],
  ["Visakhapatnam", "Andhra Pradesh", "Beach Road"],
  ["Vijayawada", "Andhra Pradesh", "Benz Circle"],
  ["Tirupati", "Andhra Pradesh", "Temple Area"],
  ["Mangaluru", "Karnataka", "Hampankatta"],
  ["Pondicherry", "Puducherry", "White Town"],
  ["Rishikesh", "Uttarakhand", "Tapovan"],
  ["Andaman", "Andaman & Nicobar", "Port Blair"],
] as const;

const hotelNames = [
  "Grand",
  "Royal",
  "City",
  "Central",
];

const hotelRoomTypes = [
  "Deluxe Room",
  "Premium Room",
  "Executive Room",
  "Family Room",
];

const hotelAmenities = [
  ["Free Wi-Fi", "Breakfast", "Parking"],
  ["Free Wi-Fi", "Swimming Pool", "Restaurant"],
  ["Free Wi-Fi", "Gym", "24×7 Reception"],
  ["Free Wi-Fi", "Breakfast", "Room Service"],
];

export const hotels: Hotel[] = hotelDestinations.flatMap(
  ([city, state, area], destinationIndex) =>
    hotelNames.map((prefix, hotelIndex) => {
      const basePrice =
        1799 +
        destinationIndex * 35 +
        hotelIndex * 550;

      return {
        id: `h${destinationIndex + 1}-${hotelIndex + 1}`,
        name: `${prefix} ${city} Hotel`,
        city,
        state,
        area,
        rating: Number(
          (4.0 + ((destinationIndex + hotelIndex) % 10) * 0.1).toFixed(1),
        ),
        reviews:
          450 +
          destinationIndex * 83 +
          hotelIndex * 127,
        pricePerNight: basePrice,
        originalPrice: basePrice + 900,
        image: `/hotel-${(hotelIndex % 4) + 1}.jpg`,
        amenities: hotelAmenities[hotelIndex],
        tags:
          hotelIndex === 0
            ? ["Popular", "Best value"]
            : hotelIndex === 1
              ? ["Highly rated"]
              : hotelIndex === 2
                ? ["Near attractions"]
                : ["Family friendly"],
        roomType: hotelRoomTypes[hotelIndex],
        refundable: hotelIndex !== 3,
        breakfastIncluded:
          hotelIndex === 0 ||
          hotelIndex === 3,
      };
    }),
);

// ============================================================
// PASSENGERS
// ============================================================

export type Passenger = {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F" | "O";
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

export const savedPassengers: Passenger[] = [
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

// ============================================================
// SEARCH SUGGESTIONS
// ============================================================

export const suggestions = [
  "Cheapest AC train from Delhi to Jaipur tomorrow morning",
  "Vande Bharat from Mumbai to Ahmedabad this Friday",
  "Overnight sleeper from Bengaluru to Chennai",
  "Fastest train Delhi to Lucknow under ₹1500",
  "Tatkal 3A from Patna to Howrah for Monday",
  "Volvo bus from Delhi to Jaipur tonight",
  "Flight from Delhi to Mumbai tomorrow morning",
  "Ferry from Mumbai to Mandwa this weekend",
  "Delhi Metro from Rajiv Chowk to Saket",
  "Hotel near Connaught Place under ₹5000",
];

// ============================================================
// TRAIN CLASSES
// ============================================================

export const travelClasses = [
  { code: "ALL", label: "All classes" },
  { code: "GEN", label: "General" },
  { code: "SL", label: "Sleeper" },
  { code: "3A", label: "AC 3-Tier" },
  { code: "2A", label: "AC 2-Tier" },
  { code: "1A", label: "AC First" },
  { code: "CC", label: "AC Chair" },
  { code: "EC", label: "Exec. Chair" },
];

// ============================================================
// TIME SLOTS
// ============================================================

export const timeSlots = [
  {
    id: "early",
    label: "Early",
    range: "00:00 – 06:00",
  },
  {
    id: "morning",
    label: "Morning",
    range: "06:00 – 12:00",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    range: "12:00 – 18:00",
  },
  {
    id: "night",
    label: "Night",
    range: "18:00 – 24:00",
  },
];

// ============================================================
// HELPER LOOKUPS
// ============================================================

export function findRailwayStation(
  code: string,
): Station | undefined {
  return stations.find(
    (station) => station.code === code,
  );
}

export function findMetroStation(
  code: string,
): MetroStation | undefined {
  return metroStations.find(
    (station) => station.code === code,
  );
}

export function findBusTerminal(
  code: string,
): BusTerminal | undefined {
  return busTerminals.find(
    (terminal) => terminal.code === code,
  );
}

export function findAirport(
  code: string,
): Airport | undefined {
  return airports.find(
    (airport) => airport.code === code,
  );
}

export function findFerryTerminal(
  code: string,
): FerryTerminal | undefined {
  return ferryTerminals.find(
    (terminal) => terminal.code === code,
  );
}

// ============================================================
// DATA COUNTS
// ============================================================

export const inventoryCounts = {
  trains: trains.length,
  buses: busRoutes.length,
  flights: flightRoutes.length,
  ferries: ferryRoutes.length,
  metros: metroRoutes.length,
  hotels: hotels.length,

  railwayStations: stations.length,
  busTerminals: busTerminals.length,
  airports: airports.length,
  metroStations: metroStations.length,
  ferryTerminals: ferryTerminals.length,
};
