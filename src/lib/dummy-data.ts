// src/lib/dummy-data.ts

// ============================================================
// TRANSIT INDIA — DUMMY / DEMO STATION DATA
// ============================================================

export type Station = {
  name: string;
  code: string;
  city: string;
  state: string;
};

export const stations: Station[] = [
  // ----------------------------------------------------------
  // DELHI / NCR
  // ----------------------------------------------------------
  {
    name: "New Delhi",
    code: "NDLS",
    city: "Delhi",
    state: "Delhi",
  },
  {
    name: "Hazrat Nizamuddin",
    code: "NZM",
    city: "Delhi",
    state: "Delhi",
  },
  {
    name: "Anand Vihar Terminal",
    code: "ANVT",
    city: "Delhi",
    state: "Delhi",
  },

  // ----------------------------------------------------------
  // RAJASTHAN
  // ----------------------------------------------------------
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
    name: "Ajmer Junction",
    code: "AII",
    city: "Ajmer",
    state: "Rajasthan",
  },
  {
    name: "Kota Junction",
    code: "KOTA",
    city: "Kota",
    state: "Rajasthan",
  },
  {
    name: "Udaipur City",
    code: "UDZ",
    city: "Udaipur",
    state: "Rajasthan",
  },

  // ----------------------------------------------------------
  // MAHARASHTRA
  // ----------------------------------------------------------
  {
    name: "Mumbai Central",
    code: "BCT",
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
    name: "Lokmanya Tilak Terminus",
    code: "LTT",
    city: "Mumbai",
    state: "Maharashtra",
  },
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

  // ----------------------------------------------------------
  // GUJARAT
  // ----------------------------------------------------------
  {
    name: "Ahmedabad Junction",
    code: "ADI",
    city: "Ahmedabad",
    state: "Gujarat",
  },
  {
    name: "Vadodara Junction",
    code: "BRC",
    city: "Vadodara",
    state: "Gujarat",
  },
  {
    name: "Surat",
    code: "ST",
    city: "Surat",
    state: "Gujarat",
  },
  {
    name: "Rajkot Junction",
    code: "RJT",
    city: "Rajkot",
    state: "Gujarat",
  },

  // ----------------------------------------------------------
  // UTTAR PRADESH
  // ----------------------------------------------------------
  {
    name: "Lucknow Charbagh",
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
    name: "Prayagraj Junction",
    code: "PRYJ",
    city: "Prayagraj",
    state: "Uttar Pradesh",
  },
  {
    name: "Agra Cantt",
    code: "AGC",
    city: "Agra",
    state: "Uttar Pradesh",
  },
  {
    name: "Gorakhpur Junction",
    code: "GKP",
    city: "Gorakhpur",
    state: "Uttar Pradesh",
  },

  // ----------------------------------------------------------
  // WEST BENGAL
  // ----------------------------------------------------------
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
  {
    name: "Durgapur",
    code: "DGR",
    city: "Durgapur",
    state: "West Bengal",
  },

  // ----------------------------------------------------------
  // BIHAR
  // ----------------------------------------------------------
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
  {
    name: "Muzaffarpur Junction",
    code: "MFP",
    city: "Muzaffarpur",
    state: "Bihar",
  },

  // ----------------------------------------------------------
  // JHARKHAND
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // MADHYA PRADESH
  // ----------------------------------------------------------
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
  {
    name: "Gwalior Junction",
    code: "GWL",
    city: "Gwalior",
    state: "Madhya Pradesh",
  },

  // ----------------------------------------------------------
  // CHHATTISGARH
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // PUNJAB / HARYANA
  // ----------------------------------------------------------
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
  {
    name: "Ludhiana Junction",
    code: "LDH",
    city: "Ludhiana",
    state: "Punjab",
  },
  {
    name: "Ambala Cantt",
    code: "UMB",
    city: "Ambala",
    state: "Haryana",
  },
  {
    name: "Gurugram",
    code: "GGN",
    city: "Gurugram",
    state: "Haryana",
  },

  // ----------------------------------------------------------
  // JAMMU & KASHMIR
  // ----------------------------------------------------------
  {
    name: "Jammu Tawi",
    code: "JAT",
    city: "Jammu",
    state: "Jammu & Kashmir",
  },
  {
    name: "Srinagar",
    code: "SINA",
    city: "Srinagar",
    state: "Jammu & Kashmir",
  },

  // ----------------------------------------------------------
  // HIMACHAL PRADESH
  // ----------------------------------------------------------
  {
    name: "Shimla",
    code: "SML",
    city: "Shimla",
    state: "Himachal Pradesh",
  },

  // ----------------------------------------------------------
  // ODISHA
  // ----------------------------------------------------------
  {
    name: "Bhubaneswar",
    code: "BBS",
    city: "Bhubaneswar",
    state: "Odisha",
  },
  {
    name: "Cuttack",
    code: "CTC",
    city: "Cuttack",
    state: "Odisha",
  },

  // ----------------------------------------------------------
  // ASSAM / NORTH EAST
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // TELANGANA
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // KARNATAKA
  // ----------------------------------------------------------
  {
    name: "KSR Bengaluru",
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

  // ----------------------------------------------------------
  // TAMIL NADU
  // ----------------------------------------------------------
  {
    name: "Chennai Central",
    code: "MAS",
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

  // ----------------------------------------------------------
  // KERALA
  // ----------------------------------------------------------
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
  {
    name: "Kozhikode",
    code: "CLT",
    city: "Kozhikode",
    state: "Kerala",
  },

  // ----------------------------------------------------------
  // ANDHRA PRADESH
  // ----------------------------------------------------------
  {
    name: "Vijayawada Junction",
    code: "BZA",
    city: "Vijayawada",
    state: "Andhra Pradesh",
  },
  {
    name: "Visakhapatnam",
    code: "VSKP",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
  },
  {
    name: "Tirupati",
    code: "TPTY",
    city: "Tirupati",
    state: "Andhra Pradesh",
  },

  // ----------------------------------------------------------
  // GOA
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // KONKAN / COASTAL
  // ----------------------------------------------------------
  {
    name: "Ratnagiri",
    code: "RN",
    city: "Ratnagiri",
    state: "Maharashtra",
  },
  {
    name: "Karmali",
    code: "KRMI",
    city: "Karmali",
    state: "Goa",
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
  {
    code: "ALL",
    label: "All classes",
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
  {
    code: "CC",
    label: "AC Chair",
  },
  {
    code: "EC",
    label: "Exec. Chair",
  },
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
// POPULAR STATIONS
// ============================================================

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

// ============================================================
// HELPER
// ============================================================

export function stationByCode(
  code?: string,
  fallback = "NDLS",
): Station {
  return (
    stations.find((station) => station.code === code) ??
    stations.find((station) => station.code === fallback) ??
    stations[0]
  );
}
