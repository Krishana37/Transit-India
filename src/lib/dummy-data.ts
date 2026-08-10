// src/lib/dummy-data.ts

// ============================================================
// TRANSIT INDIA — DUMMY / DEMO DATA ENGINE
// ============================================================

// ============================================================
// LOCATION TYPES
// ============================================================

export type LocationType =
  | "train_station"
  | "bus_stand"
  | "airport"
  | "metro_station"
  | "seaport"
  | "hotel_location";

export type Station = {
  name: string;
  code: string;
  city: string;
  state: string;
  locationType?: LocationType;
};

// ============================================================
// TRAIN STATIONS
// ============================================================

export const trainStations: Station[] = [
  // DELHI
  { name: "New Delhi Railway Station", code: "NDLS", city: "Delhi", state: "Delhi", locationType: "train_station" },
  { name: "Hazrat Nizamuddin Railway Station", code: "NZM", city: "Delhi", state: "Delhi", locationType: "train_station" },
  { name: "Anand Vihar Terminal", code: "ANVT", city: "Delhi", state: "Delhi", locationType: "train_station" },

  // RAJASTHAN
  { name: "Jaipur Junction", code: "JP", city: "Jaipur", state: "Rajasthan", locationType: "train_station" },
  { name: "Jodhpur Junction", code: "JU", city: "Jodhpur", state: "Rajasthan", locationType: "train_station" },
  { name: "Ajmer Junction", code: "AII", city: "Ajmer", state: "Rajasthan", locationType: "train_station" },
  { name: "Kota Junction", code: "KOTA", city: "Kota", state: "Rajasthan", locationType: "train_station" },
  { name: "Udaipur City Railway Station", code: "UDZ", city: "Udaipur", state: "Rajasthan", locationType: "train_station" },

  // MAHARASHTRA
  { name: "Mumbai Central", code: "BCT", city: "Mumbai", state: "Maharashtra", locationType: "train_station" },
  { name: "Chhatrapati Shivaji Maharaj Terminus", code: "CSMT", city: "Mumbai", state: "Maharashtra", locationType: "train_station" },
  { name: "Lokmanya Tilak Terminus", code: "LTT", city: "Mumbai", state: "Maharashtra", locationType: "train_station" },
  { name: "Pune Junction", code: "PUNE", city: "Pune", state: "Maharashtra", locationType: "train_station" },
  { name: "Nagpur Junction", code: "NGP", city: "Nagpur", state: "Maharashtra", locationType: "train_station" },
  { name: "Nashik Road Railway Station", code: "NK", city: "Nashik", state: "Maharashtra", locationType: "train_station" },

  // GUJARAT
  { name: "Ahmedabad Junction", code: "ADI", city: "Ahmedabad", state: "Gujarat", locationType: "train_station" },
  { name: "Vadodara Junction", code: "BRC", city: "Vadodara", state: "Gujarat", locationType: "train_station" },
  { name: "Surat Railway Station", code: "ST", city: "Surat", state: "Gujarat", locationType: "train_station" },
  { name: "Rajkot Junction", code: "RJT", city: "Rajkot", state: "Gujarat", locationType: "train_station" },

  // UTTAR PRADESH
  { name: "Lucknow Charbagh Railway Station", code: "LKO", city: "Lucknow", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Kanpur Central", code: "CNB", city: "Kanpur", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Varanasi Junction", code: "BSB", city: "Varanasi", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Prayagraj Junction", code: "PRYJ", city: "Prayagraj", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Agra Cantt", code: "AGC", city: "Agra", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Gorakhpur Junction", code: "GKP", city: "Gorakhpur", state: "Uttar Pradesh", locationType: "train_station" },

  // WEST BENGAL
  { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal", locationType: "train_station" },
  { name: "Sealdah Railway Station", code: "SDAH", city: "Kolkata", state: "West Bengal", locationType: "train_station" },
  { name: "Durgapur Railway Station", code: "DGR", city: "Durgapur", state: "West Bengal", locationType: "train_station" },

  // BIHAR
  { name: "Patna Junction", code: "PNBE", city: "Patna", state: "Bihar", locationType: "train_station" },
  { name: "Gaya Junction", code: "GAYA", city: "Gaya", state: "Bihar", locationType: "train_station" },
  { name: "Muzaffarpur Junction", code: "MFP", city: "Muzaffarpur", state: "Bihar", locationType: "train_station" },

  // JHARKHAND
  { name: "Ranchi Junction", code: "RNC", city: "Ranchi", state: "Jharkhand", locationType: "train_station" },
  { name: "Dhanbad Junction", code: "DHN", city: "Dhanbad", state: "Jharkhand", locationType: "train_station" },

  // MADHYA PRADESH
  { name: "Bhopal Junction", code: "BPL", city: "Bhopal", state: "Madhya Pradesh", locationType: "train_station" },
  { name: "Indore Junction", code: "INDB", city: "Indore", state: "Madhya Pradesh", locationType: "train_station" },
  { name: "Gwalior Junction", code: "GWL", city: "Gwalior", state: "Madhya Pradesh", locationType: "train_station" },

  // CHHATTISGARH
  { name: "Raipur Junction", code: "R", city: "Raipur", state: "Chhattisgarh", locationType: "train_station" },
  { name: "Bilaspur Junction", code: "BSP", city: "Bilaspur", state: "Chhattisgarh", locationType: "train_station" },

  // PUNJAB / HARYANA
  { name: "Chandigarh Railway Station", code: "CDG", city: "Chandigarh", state: "Chandigarh", locationType: "train_station" },
  { name: "Amritsar Junction", code: "ASR", city: "Amritsar", state: "Punjab", locationType: "train_station" },
  { name: "Ludhiana Junction", code: "LDH", city: "Ludhiana", state: "Punjab", locationType: "train_station" },
  { name: "Ambala Cantt", code: "UMB", city: "Ambala", state: "Haryana", locationType: "train_station" },
  { name: "Gurugram Railway Station", code: "GGN", city: "Gurugram", state: "Haryana", locationType: "train_station" },

  // JAMMU & KASHMIR
  { name: "Jammu Tawi", code: "JAT", city: "Jammu", state: "Jammu & Kashmir", locationType: "train_station" },
  { name: "Srinagar Railway Station", code: "SINA", city: "Srinagar", state: "Jammu & Kashmir", locationType: "train_station" },

  // HIMACHAL
  { name: "Shimla Railway Station", code: "SML", city: "Shimla", state: "Himachal Pradesh", locationType: "train_station" },

  // ODISHA
  { name: "Bhubaneswar Railway Station", code: "BBS", city: "Bhubaneswar", state: "Odisha", locationType: "train_station" },
  { name: "Cuttack Railway Station", code: "CTC", city: "Cuttack", state: "Odisha", locationType: "train_station" },

  // ASSAM
  { name: "Guwahati Railway Station", code: "GHY", city: "Guwahati", state: "Assam", locationType: "train_station" },
  { name: "Dibrugarh Railway Station", code: "DBRG", city: "Dibrugarh", state: "Assam", locationType: "train_station" },

  // TELANGANA
  { name: "Secunderabad Junction", code: "SC", city: "Hyderabad", state: "Telangana", locationType: "train_station" },
  { name: "Hyderabad Deccan", code: "HYB", city: "Hyderabad", state: "Telangana", locationType: "train_station" },

  // KARNATAKA
  { name: "KSR Bengaluru", code: "SBC", city: "Bengaluru", state: "Karnataka", locationType: "train_station" },
  { name: "Yesvantpur Junction", code: "YPR", city: "Bengaluru", state: "Karnataka", locationType: "train_station" },
  { name: "Mysuru Junction", code: "MYS", city: "Mysuru", state: "Karnataka", locationType: "train_station" },

  // TAMIL NADU
  { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu", locationType: "train_station" },
  { name: "Coimbatore Junction", code: "CBE", city: "Coimbatore", state: "Tamil Nadu", locationType: "train_station" },
  { name: "Madurai Junction", code: "MDU", city: "Madurai", state: "Tamil Nadu", locationType: "train_station" },

  // KERALA
  { name: "Ernakulam Junction", code: "ERS", city: "Kochi", state: "Kerala", locationType: "train_station" },
  { name: "Thiruvananthapuram Central", code: "TVC", city: "Thiruvananthapuram", state: "Kerala", locationType: "train_station" },
  { name: "Kozhikode Railway Station", code: "CLT", city: "Kozhikode", state: "Kerala", locationType: "train_station" },

  // ANDHRA PRADESH
  { name: "Vijayawada Junction", code: "BZA", city: "Vijayawada", state: "Andhra Pradesh", locationType: "train_station" },
  { name: "Visakhapatnam Railway Station", code: "VSKP", city: "Visakhapatnam", state: "Andhra Pradesh", locationType: "train_station" },
  { name: "Tirupati Railway Station", code: "TPTY", city: "Tirupati", state: "Andhra Pradesh", locationType: "train_station" },

  // GOA
  { name: "Madgaon Junction", code: "MAO", city: "Madgaon", state: "Goa", locationType: "train_station" },
  { name: "Vasco Da Gama Railway Station", code: "VSG", city: "Vasco", state: "Goa", locationType: "train_station" },

  // KONKAN
  { name: "Ratnagiri Railway Station", code: "RN", city: "Ratnagiri", state: "Maharashtra", locationType: "train_station" },
  { name: "Karmali Railway Station", code: "KRMI", city: "Karmali", state: "Goa", locationType: "train_station" },
];

// ============================================================
// BUS STANDS / TERMINALS
// ============================================================

export const busStands: Station[] = [
  { name: "Kashmere Gate ISBT", code: "KGT", city: "Delhi", state: "Delhi", locationType: "bus_stand" },
  { name: "Anand Vihar ISBT", code: "AVB", city: "Delhi", state: "Delhi", locationType: "bus_stand" },
  { name: "Jaipur Sindhi Camp Bus Stand", code: "JSC", city: "Jaipur", state: "Rajasthan", locationType: "bus_stand" },
  { name: "Jodhpur Central Bus Stand", code: "JBS", city: "Jodhpur", state: "Rajasthan", locationType: "bus_stand" },
  { name: "Ajmer Bus Stand", code: "ABS", city: "Ajmer", state: "Rajasthan", locationType: "bus_stand" },
  { name: "Udaipur Bus Stand", code: "UBS", city: "Udaipur", state: "Rajasthan", locationType: "bus_stand" },
  { name: "Mumbai Central Bus Depot", code: "MCB", city: "Mumbai", state: "Maharashtra", locationType: "bus_stand" },
  { name: "Pune Swargate Bus Stand", code: "PSB", city: "Pune", state: "Maharashtra", locationType: "bus_stand" },
  { name: "Ahmedabad Geeta Mandir Bus Stand", code: "AGM", city: "Ahmedabad", state: "Gujarat", locationType: "bus_stand" },
  { name: "Vadodara Central Bus Station", code: "VDB", city: "Vadodara", state: "Gujarat", locationType: "bus_stand" },
  { name: "Lucknow Alambagh Bus Stand", code: "LAB", city: "Lucknow", state: "Uttar Pradesh", locationType: "bus_stand" },
  { name: "Kanpur Jhakarkati Bus Stand", code: "KJB", city: "Kanpur", state: "Uttar Pradesh", locationType: "bus_stand" },
  { name: "Varanasi Cantt Bus Stand", code: "VCB", city: "Varanasi", state: "Uttar Pradesh", locationType: "bus_stand" },
  { name: "Agra ISBT", code: "AIB", city: "Agra", state: "Uttar Pradesh", locationType: "bus_stand" },
  { name: "Kolkata Esplanade Bus Stand", code: "KEB", city: "Kolkata", state: "West Bengal", locationType: "bus_stand" },
  { name: "Patna Mithapur Bus Stand", code: "PMB", city: "Patna", state: "Bihar", locationType: "bus_stand" },
  { name: "Bengaluru Kempegowda Bus Station", code: "KBS", city: "Bengaluru", state: "Karnataka", locationType: "bus_stand" },
  { name: "Chennai CMBT", code: "CMBT", city: "Chennai", state: "Tamil Nadu", locationType: "bus_stand" },
  { name: "Hyderabad MGBS", code: "MGBS", city: "Hyderabad", state: "Telangana", locationType: "bus_stand" },
  { name: "Kochi Vyttila Mobility Hub", code: "VMH", city: "Kochi", state: "Kerala", locationType: "bus_stand" },
];

// ============================================================
// AIRPORTS
// ============================================================

export const airports: Station[] = [
  { name: "Indira Gandhi International Airport", code: "DEL", city: "Delhi", state: "Delhi", locationType: "airport" },
  { name: "Jaipur International Airport", code: "JAI", city: "Jaipur", state: "Rajasthan", locationType: "airport" },
  { name: "Jodhpur Airport", code: "JDH", city: "Jodhpur", state: "Rajasthan", locationType: "airport" },
  { name: "Mumbai Chhatrapati Shivaji Maharaj International Airport", code: "BOM", city: "Mumbai", state: "Maharashtra", locationType: "airport" },
  { name: "Pune International Airport", code: "PNQ", city: "Pune", state: "Maharashtra", locationType: "airport" },
  { name: "Ahmedabad International Airport", code: "AMD", city: "Ahmedabad", state: "Gujarat", locationType: "airport" },
  { name: "Surat Airport", code: "STV", city: "Surat", state: "Gujarat", locationType: "airport" },
  { name: "Lucknow Chaudhary Charan Singh International Airport", code: "LKOA", city: "Lucknow", state: "Uttar Pradesh", locationType: "airport" },
  { name: "Lal Bahadur Shastri International Airport", code: "VNS", city: "Varanasi", state: "Uttar Pradesh", locationType: "airport" },
  { name: "Agra Airport", code: "AGR", city: "Agra", state: "Uttar Pradesh", locationType: "airport" },
  { name: "Netaji Subhas Chandra Bose International Airport", code: "CCU", city: "Kolkata", state: "West Bengal", locationType: "airport" },
  { name: "Jay Prakash Narayan International Airport", code: "PAT", city: "Patna", state: "Bihar", locationType: "airport" },
  { name: "Ranchi Birsa Munda Airport", code: "IXR", city: "Ranchi", state: "Jharkhand", locationType: "airport" },
  { name: "Bhopal Raja Bhoj Airport", code: "BHO", city: "Bhopal", state: "Madhya Pradesh", locationType: "airport" },
  { name: "Indore Devi Ahilya Bai Holkar Airport", code: "IDR", city: "Indore", state: "Madhya Pradesh", locationType: "airport" },
  { name: "Chandigarh International Airport", code: "IXC", city: "Chandigarh", state: "Chandigarh", locationType: "airport" },
  { name: "Amritsar Sri Guru Ram Dass Jee International Airport", code: "ATQ", city: "Amritsar", state: "Punjab", locationType: "airport" },
  { name: "Srinagar International Airport", code: "SXR", city: "Srinagar", state: "Jammu & Kashmir", locationType: "airport" },
  { name: "Shimla Airport", code: "SLV", city: "Shimla", state: "Himachal Pradesh", locationType: "airport" },
  { name: "Bhubaneswar Biju Patnaik International Airport", code: "BBI", city: "Bhubaneswar", state: "Odisha", locationType: "airport" },
  { name: "Guwahati Lokpriya Gopinath Bordoloi International Airport", code: "GAU", city: "Guwahati", state: "Assam", locationType: "airport" },
  { name: "Hyderabad Rajiv Gandhi International Airport", code: "HYDA", city: "Hyderabad", state: "Telangana", locationType: "airport" },
  { name: "Kempegowda International Airport", code: "BLR", city: "Bengaluru", state: "Karnataka", locationType: "airport" },
  { name: "Chennai International Airport", code: "MAA", city: "Chennai", state: "Tamil Nadu", locationType: "airport" },
  { name: "Coimbatore International Airport", code: "CJB", city: "Coimbatore", state: "Tamil Nadu", locationType: "airport" },
  { name: "Madurai Airport", code: "IXM", city: "Madurai", state: "Tamil Nadu", locationType: "airport" },
  { name: "Cochin International Airport", code: "COK", city: "Kochi", state: "Kerala", locationType: "airport" },
  { name: "Trivandrum International Airport", code: "TRV", city: "Thiruvananthapuram", state: "Kerala", locationType: "airport" },
  { name: "Visakhapatnam International Airport", code: "VTZ", city: "Visakhapatnam", state: "Andhra Pradesh", locationType: "airport" },
  { name: "Tirupati Airport", code: "TIR", city: "Tirupati", state: "Andhra Pradesh", locationType: "airport" },
  { name: "Goa Manohar International Airport", code: "GOX", city: "Goa", state: "Goa", locationType: "airport" },
  { name: "Dabolim Airport", code: "GOI", city: "Goa", state: "Goa", locationType: "airport" },
];

// ============================================================
// METRO STATIONS
// ============================================================

export const metroStations: Station[] = [
  { name: "Rajiv Chowk Metro Station", code: "MRC", city: "Delhi", state: "Delhi", locationType: "metro_station" },
  { name: "Kashmere Gate Metro Station", code: "MKG", city: "Delhi", state: "Delhi", locationType: "metro_station" },
  { name: "Saket Metro Station", code: "MSK", city: "Delhi", state: "Delhi", locationType: "metro_station" },
  { name: "Hauz Khas Metro Station", code: "MHK", city: "Delhi", state: "Delhi", locationType: "metro_station" },
  { name: "Dwarka Sector 21 Metro Station", code: "MDW", city: "Delhi", state: "Delhi", locationType: "metro_station" },
  { name: "Noida Sector 18 Metro Station", code: "MN18", city: "Noida", state: "Uttar Pradesh", locationType: "metro_station" },
  { name: "Botanical Garden Metro Station", code: "MBG", city: "Noida", state: "Uttar Pradesh", locationType: "metro_station" },
  { name: "Vaishali Metro Station", code: "MVS", city: "Ghaziabad", state: "Uttar Pradesh", locationType: "metro_station" },

  // Mumbai Metro
  { name: "Andheri Metro Station", code: "MMA", city: "Mumbai", state: "Maharashtra", locationType: "metro_station" },
  { name: "Ghatkopar Metro Station", code: "MMG", city: "Mumbai", state: "Maharashtra", locationType: "metro_station" },
  { name: "Dahisar East Metro Station", code: "MDE", city: "Mumbai", state: "Maharashtra", locationType: "metro_station" },

  // Bengaluru Metro
  { name: "Majestic Metro Station", code: "MBM", city: "Bengaluru", state: "Karnataka", locationType: "metro_station" },
  { name: "MG Road Metro Station", code: "MMGR", city: "Bengaluru", state: "Karnataka", locationType: "metro_station" },

  // Kolkata Metro
  { name: "Esplanade Metro Station", code: "KES", city: "Kolkata", state: "West Bengal", locationType: "metro_station" },
  { name: "Park Street Metro Station", code: "KPS", city: "Kolkata", state: "West Bengal", locationType: "metro_station" },

  // Hyderabad Metro
  { name: "Ameerpet Metro Station", code: "HAM", city: "Hyderabad", state: "Telangana", locationType: "metro_station" },
  { name: "Miyapur Metro Station", code: "HMM", city: "Hyderabad", state: "Telangana", locationType: "metro_station" },

  // Chennai Metro
  { name: "Chennai Central Metro Station", code: "CMC", city: "Chennai", state: "Tamil Nadu", locationType: "metro_station" },
  { name: "Airport Metro Station Chennai", code: "CMA", city: "Chennai", state: "Tamil Nadu", locationType: "metro_station" },

  // Kochi Metro
  { name: "Aluva Metro Station", code: "KMA", city: "Kochi", state: "Kerala", locationType: "metro_station" },
  { name: "Maharaja's College Metro Station", code: "KMC", city: "Kochi", state: "Kerala", locationType: "metro_station" },
];

// ============================================================
// SEAPORTS / FERRY TERMINALS
// ============================================================

export const seaports: Station[] = [
  { name: "Gateway of India Ferry Terminal", code: "GOI-F", city: "Mumbai", state: "Maharashtra", locationType: "seaport" },
  { name: "Mandwa Ferry Terminal", code: "MDW-F", city: "Alibaug", state: "Maharashtra", locationType: "seaport" },
  { name: "Elephanta Island Ferry Terminal", code: "ELP-F", city: "Mumbai", state: "Maharashtra", locationType: "seaport" },
  { name: "Mormugao Harbour", code: "MOR-F", city: "Goa", state: "Goa", locationType: "seaport" },
  { name: "Panaji Ferry Terminal", code: "PNJ-F", city: "Panaji", state: "Goa", locationType: "seaport" },
  { name: "Kochi Fort Ferry Terminal", code: "KFT-F", city: "Kochi", state: "Kerala", locationType: "seaport" },
  { name: "Vypeen Ferry Terminal", code: "VYP-F", city: "Kochi", state: "Kerala", locationType: "seaport" },
  { name: "Chennai Ferry Terminal", code: "CHE-F", city: "Chennai", state: "Tamil Nadu", locationType: "seaport" },
  { name: "Port Blair Ferry Terminal", code: "PBR-F", city: "Port Blair", state: "Andaman & Nicobar Islands", locationType: "seaport" },
  { name: "Swaraj Dweep Ferry Terminal", code: "SWT-F", city: "Swaraj Dweep", state: "Andaman & Nicobar Islands", locationType: "seaport" },
  { name: "Kochi Water Metro Terminal", code: "KWM-F", city: "Kochi", state: "Kerala", locationType: "seaport" },
  { name: "Alappuzha Boat Jetty", code: "ALP-F", city: "Alappuzha", state: "Kerala", locationType: "seaport" },
];

// ============================================================
// ALL LOCATIONS
// ============================================================

// Kept as `stations` for compatibility with existing imports.
export const stations: Station[] = [
  ...trainStations,
  ...busStands,
  ...airports,
  ...metroStations,
  ...seaports,
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
  { id: "early", label: "Early", range: "00:00 – 06:00" },
  { id: "morning", label: "Morning", range: "06:00 – 12:00" },
  { id: "afternoon", label: "Afternoon", range: "12:00 – 18:00" },
  { id: "night", label: "Night", range: "18:00 – 24:00" },
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

// ============================================================
// TRANSPORT MODES
// ============================================================

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
}[] = [
  { id: "train", label: "Trains" },
  { id: "bus", label: "Buses" },
  { id: "flight", label: "Flights" },
  { id: "hotel", label: "Hotels" },
  { id: "metro", label: "Metro" },
  { id: "ferry", label: "Ferries" },
];

// ============================================================
// SMALL DETERMINISTIC HASH
// ============================================================

function hashString(str: string): number {
  let h = 0;

  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }

  return Math.abs(h);
}

// ============================================================
// MODE-SPECIFIC ROUTE BUILDER
// ============================================================

export type RouteDef = {
  from: Station;
  to: Station;
};

function explicitRoutes(
  locations: Station[],
  pairs: [number, number][],
): RouteDef[] {
  return pairs
    .filter(
      ([a, b]) =>
        locations[a] !== undefined &&
        locations[b] !== undefined &&
        a !== b,
    )
    .map(([a, b]) => ({
      from: locations[a],
      to: locations[b],
    }));
}

// ============================================================
// TRAIN ROUTES
// ONLY TRAIN STATIONS
// ============================================================

export const trainRoutes: RouteDef[] = explicitRoutes(trainStations, [
  [0, 3],   // Delhi → Jaipur
  [0, 8],   // Delhi → Mumbai
  [0, 14],  // Delhi → Ahmedabad
  [0, 18],  // Delhi → Lucknow
  [0, 23],  // Delhi → Agra
  [0, 27],  // Delhi → Patna
  [0, 30],  // Delhi → Bhopal
  [0, 37],  // Delhi → Chandigarh
  [0, 42],  // Delhi → Srinagar
  [0, 49],  // Delhi → Hyderabad
  [0, 53],  // Delhi → Chennai
  [0, 57],  // Delhi → Kochi
  [3, 4],   // Jaipur → Jodhpur
  [3, 8],   // Jaipur → Mumbai
  [8, 11],  // Mumbai → Pune
  [8, 14],  // Mumbai → Ahmedabad
  [11, 14], // Pune → Ahmedabad
  [14, 15], // Ahmedabad → Vadodara
  [18, 19], // Lucknow → Kanpur
  [19, 20], // Kanpur → Varanasi
  [23, 20], // Agra → Varanasi
  [27, 25], // Patna → Gaya
  [49, 50], // Hyderabad → Bengaluru
  [53, 54], // Chennai → Coimbatore
  [54, 56], // Coimbatore → Kochi
  [60, 61], // Goa → Goa
]);

// ============================================================
// BUS ROUTES
// ONLY BUS STANDS
// ============================================================

export const busRoutes: RouteDef[] = explicitRoutes(busStands, [
  [0, 2],   // Delhi → Jaipur
  [0, 6],   // Delhi → Mumbai
  [0, 10],  // Delhi → Lucknow
  [0, 13],  // Delhi → Agra
  [0, 15],  // Delhi → Patna
  [0, 16],  // Delhi → Bengaluru
  [0, 17],  // Delhi → Chennai
  [2, 3],   // Jaipur → Jodhpur
  [2, 5],   // Jaipur → Udaipur
  [6, 7],   // Mumbai → Pune
  [6, 8],   // Mumbai → Ahmedabad
  [8, 9],   // Ahmedabad → Vadodara
  [10, 11], // Lucknow → Kanpur
  [11, 12], // Kanpur → Varanasi
  [16, 17], // Bengaluru → Chennai
  [17, 18], // Chennai → Hyderabad
  [18, 19], // Hyderabad → Kochi
]);

// ============================================================
// FLIGHT ROUTES
// ONLY AIRPORTS
// ============================================================

export const flightRoutes: RouteDef[] = explicitRoutes(airports, [
  [0, 3],   // Delhi → Mumbai
  [0, 1],   // Delhi → Jaipur
  [0, 5],   // Delhi → Ahmedabad
  [0, 7],   // Delhi → Lucknow
  [0, 9],   // Delhi → Agra
  [0, 10],  // Delhi → Kolkata
  [0, 11],  // Delhi → Patna
  [0, 15],  // Delhi → Chandigarh
  [0, 17],  // Delhi → Srinagar
  [0, 22],  // Delhi → Bengaluru
  [0, 24],  // Delhi → Chennai
  [0, 27],  // Delhi → Kochi
  [0, 30],  // Delhi → Goa
  [3, 4],   // Mumbai → Pune
  [3, 5],   // Mumbai → Ahmedabad
  [22, 24], // Bengaluru → Chennai
  [24, 27], // Chennai → Kochi
  [30, 31], // Goa → Goa
]);

// ============================================================
// METRO ROUTES
// ONLY METRO STATIONS
// ============================================================

export const metroRoutes: RouteDef[] = explicitRoutes(metroStations, [
  [0, 1],   // Rajiv Chowk → Kashmere Gate
  [0, 2],   // Rajiv Chowk → Saket
  [0, 3],   // Rajiv Chowk → Hauz Khas
  [0, 4],   // Rajiv Chowk → Dwarka
  [1, 5],   // Kashmere Gate → Noida Sector 18
  [5, 6],   // Noida Sector 18 → Botanical Garden
  [6, 7],   // Botanical Garden → Vaishali
  [8, 9],   // Andheri → Ghatkopar
  [9, 10],  // Ghatkopar → Dahisar
  [11, 12], // Bengaluru Majestic → MG Road
  [13, 14], // Kolkata Esplanade → Park Street
  [15, 16], // Hyderabad Ameerpet → Miyapur
  [17, 18], // Chennai Central → Airport
  [19, 20], // Kochi Aluva → Maharaja's
]);

// ============================================================
// FERRY ROUTES
// ONLY SEAPORTS / FERRY TERMINALS
// ============================================================

export const ferryRoutes: RouteDef[] = explicitRoutes(seaports, [
  [0, 1],   // Gateway → Mandwa
  [0, 2],   // Gateway → Elephanta
  [1, 0],   // Mandwa → Gateway
  [2, 0],   // Elephanta → Gateway
  [3, 4],   // Mormugao → Panaji
  [5, 6],   // Fort Kochi → Vypeen
  [8, 9],   // Port Blair → Swaraj Dweep
  [10, 11], // Kochi Water Metro → Alappuzha
]);

// ============================================================
// MODE ROUTES
// ============================================================

export const modeRoutes: Record<
  Exclude<TransportMode, "hotel">,
  RouteDef[]
> = {
  train: trainRoutes,
  bus: busRoutes,
  flight: flightRoutes,
  metro: metroRoutes,
  ferry: ferryRoutes,
};

// ============================================================
// HOTEL DESTINATIONS
// 50 FAMOUS INDIAN DESTINATIONS
// ============================================================

export type HotelDestination = {
  city: string;
  state: string;
  landmark: string;
};

export const famousHotelDestinations: HotelDestination[] = [
  { city: "Delhi", state: "Delhi", landmark: "India Gate & Connaught Place" },
  { city: "Agra", state: "Uttar Pradesh", landmark: "Taj Mahal" },
  { city: "Jaipur", state: "Rajasthan", landmark: "Hawa Mahal & Amber Fort" },
  { city: "Udaipur", state: "Rajasthan", landmark: "Lake Pichola" },
  { city: "Jodhpur", state: "Rajasthan", landmark: "Mehrangarh Fort" },
  { city: "Jaisalmer", state: "Rajasthan", landmark: "Jaisalmer Fort" },
  { city: "Pushkar", state: "Rajasthan", landmark: "Pushkar Lake" },
  { city: "Mumbai", state: "Maharashtra", landmark: "Gateway of India & Marine Drive" },
  { city: "Pune", state: "Maharashtra", landmark: "Shaniwar Wada" },
  { city: "Nashik", state: "Maharashtra", landmark: "Trimbakeshwar" },
  { city: "Aurangabad", state: "Maharashtra", landmark: "Ajanta & Ellora Caves" },
  { city: "Ahmedabad", state: "Gujarat", landmark: "Sabarmati Ashram" },
  { city: "Vadodara", state: "Gujarat", landmark: "Laxmi Vilas Palace" },
  { city: "Rann of Kutch", state: "Gujarat", landmark: "White Rann" },
  { city: "Goa", state: "Goa", landmark: "Baga & Calangute Beach" },
  { city: "Panaji", state: "Goa", landmark: "Fontainhas" },
  { city: "Bengaluru", state: "Karnataka", landmark: "Bangalore Palace & MG Road" },
  { city: "Mysuru", state: "Karnataka", landmark: "Mysore Palace" },
  { city: "Hampi", state: "Karnataka", landmark: "Virupaksha Temple" },
  { city: "Coorg", state: "Karnataka", landmark: "Abbey Falls" },
  { city: "Chennai", state: "Tamil Nadu", landmark: "Marina Beach" },
  { city: "Mahabalipuram", state: "Tamil Nadu", landmark: "Shore Temple" },
  { city: "Ooty", state: "Tamil Nadu", landmark: "Ooty Lake" },
  { city: "Madurai", state: "Tamil Nadu", landmark: "Meenakshi Temple" },
  { city: "Kochi", state: "Kerala", landmark: "Fort Kochi" },
  { city: "Munnar", state: "Kerala", landmark: "Tea Gardens" },
  { city: "Alappuzha", state: "Kerala", landmark: "Alleppey Backwaters" },
  { city: "Thiruvananthapuram", state: "Kerala", landmark: "Kovalam Beach" },
  { city: "Varkala", state: "Kerala", landmark: "Varkala Cliff" },
  { city: "Hyderabad", state: "Telangana", landmark: "Charminar" },
  { city: "Warangal", state: "Telangana", landmark: "Warangal Fort" },
  { city: "Visakhapatnam", state: "Andhra Pradesh", landmark: "RK Beach" },
  { city: "Vijayawada", state: "Andhra Pradesh", landmark: "Kanaka Durga Temple" },
  { city: "Tirupati", state: "Andhra Pradesh", landmark: "Tirumala Temple" },
  { city: "Kolkata", state: "West Bengal", landmark: "Victoria Memorial" },
  { city: "Darjeeling", state: "West Bengal", landmark: "Tiger Hill" },
  { city: "Gangtok", state: "Sikkim", landmark: "MG Marg" },
  { city: "Bhubaneswar", state: "Odisha", landmark: "Lingaraj Temple" },
  { city: "Puri", state: "Odisha", landmark: "Jagannath Temple & Beach" },
  { city: "Varanasi", state: "Uttar Pradesh", landmark: "Dashashwamedh Ghat" },
  { city: "Lucknow", state: "Uttar Pradesh", landmark: "Bara Imambara" },
  { city: "Amritsar", state: "Punjab", landmark: "Golden Temple" },
  { city: "Chandigarh", state: "Chandigarh", landmark: "Rock Garden" },
  { city: "Shimla", state: "Himachal Pradesh", landmark: "The Ridge & Mall Road" },
  { city: "Manali", state: "Himachal Pradesh", landmark: "Solang Valley" },
  { city: "Dharamshala", state: "Himachal Pradesh", landmark: "McLeod Ganj" },
  { city: "Srinagar", state: "Jammu & Kashmir", landmark: "Dal Lake" },
  { city: "Leh", state: "Ladakh", landmark: "Leh Palace" },
  { city: "Rishikesh", state: "Uttarakhand", landmark: "Laxman Jhula & Ganga" },
  { city: "Nainital", state: "Uttarakhand", landmark: "Naini Lake" },
  { city: "Dehradun", state: "Uttarakhand", landmark: "Robber's Cave" },
  { city: "Patna", state: "Bihar", landmark: "Golghar" },
];

// ============================================================
// HOTEL DATA
// MINIMUM 4 HOTELS PER DESTINATION
// 50 DESTINATIONS = 200 HOTELS
// ============================================================

export type HotelProperty = {
  id: string;
  name: string;
  city: string;
  state: string;
  area: string;
  rating: number;
  priceFrom: number;
  previewImages: string[];
  amenities: string[];
  category: "Budget" | "Standard" | "Luxury";
};

const hotelNamePrefixes = [
  "Grand",
  "Royal",
  "Heritage",
  "Comfort",
  "City",
  "Sunrise",
  "Imperial",
  "Regal",
  "The",
  "Urban",
];

const hotelNameSuffixByCategory: Record<
  HotelProperty["category"],
  string
> = {
  Budget: "Inn",
  Standard: "Residency",
  Luxury: "Palace",
};

export const allHotels: HotelProperty[] =
  famousHotelDestinations.flatMap((dest, di) => {
    const categories: HotelProperty["category"][] = [
      "Budget",
      "Standard",
      "Luxury",
      "Standard",
    ];

    return categories.map((cat, ci) => {
      const idx = di * 4 + ci;
      const h = hashString(`${dest.city}-${cat}-${idx}`);

      const priceBase =
        cat === "Budget"
          ? 1200
          : cat === "Standard"
            ? 2800
            : 6500;

      const price = priceBase + (h % 1800);

      const prefix =
        hotelNamePrefixes[h % hotelNamePrefixes.length];

      const uniqueSuffix =
        ci === 3 ? "Suites" : hotelNameSuffixByCategory[cat];

      return {
        id: `hotel-${dest.city
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-${idx}`,

        name:
          cat === "Luxury"
            ? `The ${prefix} ${uniqueSuffix}`
            : `${prefix} ${uniqueSuffix}`,

        city: dest.city,
        state: dest.state,
        area: dest.landmark,

        rating:
          cat === "Luxury"
            ? 4.5 + (h % 5) / 10
            : cat === "Standard"
              ? 3.8 + (h % 6) / 10
              : 3.2 + (h % 5) / 10,

        priceFrom: price,

        previewImages: [
          `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80`,
          `https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80`,
        ],

        amenities:
          cat === "Luxury"
            ? [
                "Free WiFi",
                "Swimming Pool",
                "Spa",
                "Breakfast Included",
                "Valet Parking",
                "Room Service",
              ]
            : cat === "Standard"
              ? [
                  "Free WiFi",
                  "Breakfast Included",
                  "AC",
                  "Room Service",
                ]
              : [
                  "Free WiFi",
                  "AC",
                  "Parking",
                ],

        category: cat,
      };
    });
  });

// ============================================================
// SEGMENTS
// ============================================================

export type SeatOption = {
  code: string;
  label: string;
  fare: number;
  available: number;
  probability: number;
};

export type Segment = {
  id: string;
  mode: TransportMode;
  name: string;
  code: string;
  operator?: string;

  // Optional intentionally:
  // Hotels do NOT have from/to.
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
  options: SeatOption[];
};

// ============================================================
// DISTANCE
// ============================================================

export function distanceKm(
  from: Station,
  to: Station,
): number {
  if (!from || !to || from.code === to.code) return 0;

  const key = [from.code, to.code].sort().join("-");
  const h = hashString(key);

  return 80 + (h % 1800);
}

// ============================================================
// DEMAND
// ============================================================

export function demandIndex(
  from: Station,
  to: Station,
  date: Date,
): number {
  const key = `${from.code}-${to.code}-${date
    .toISOString()
    .slice(0, 10)}`;

  const h = hashString(key);
  const base = 1 + (h % 40) / 100;

  return Math.round(base * 100) / 100;
}

// ============================================================
// FARE FACTORS
// ============================================================

const classFareFactors: Record<string, number> = {
  SL: 0.35,
  "3A": 0.9,
  "2A": 1.3,
  "1A": 2.1,
  CC: 0.8,
  EC: 1.0,

  GEN: 0.2,

  SEATER: 0.5,
  SLEEPER: 0.75,
  VOLVO: 0.85,

  ECONOMY: 1,
  PREMIUM_ECONOMY: 1.6,
  BUSINESS: 2.8,

  TOKEN: 0.05,

  DECK: 0.4,
  CABIN: 1.2,

  DELUXE: 1,
  PREMIUM: 1.4,
  EXECUTIVE: 1.8,
  SUITE: 2.5,
  FAMILY: 1.6,
};

function classFareFactor(code: string): number {
  return classFareFactors[code] ?? 1;
}

// ============================================================
// COMPUTE FARE
// ============================================================

export function computeFare(
  km: number,
  code: string,
  demand: number,
  multiplier = 1,
): number {
  const factor =
    classFareFactor(code) * multiplier;

  const raw =
    km * 1.1 * factor +
    120 * factor;

  const withDemand =
    raw * Math.max(0.8, demand);

  return Math.max(
    49,
    Math.round(withDemand / 10) * 10,
  );
}

// ============================================================
// MEALS
// ============================================================

export const meals = [
  {
    id: "veg-thali",
    name: "Veg Thali",
    price: 180,
  },
  {
    id: "nonveg-thali",
    name: "Non-Veg Thali",
    price: 220,
  },
  {
    id: "sandwich",
    name: "Sandwich Combo",
    price: 120,
  },
  {
    id: "biryani",
    name: "Chicken Biryani",
    price: 250,
  },
  {
    id: "snack-box",
    name: "Snack Box",
    price: 90,
  },
];

// ============================================================
// SEAT AVAILABILITY
// ============================================================

export type SeatTone =
  | "available"
  | "low"
  | "rac"
  | "wl"
  | "sold";

export function seatState(
  key: string,
  availableBase: number,
  tick: number,
  opts?: { racWl?: boolean },
): {
  tone: SeatTone;
  label: string;
} {
  const h = hashString(`${key}:${tick}`);

  const avail = Math.max(
    0,
    availableBase -
      (h % (availableBase + 3)),
  );

  if (avail <= 0) {
    if (
      opts?.racWl &&
      h % 5 !== 0
    ) {
      const isRac = h % 2 === 0;

      return isRac
        ? {
            tone: "rac",
            label: `RAC ${1 + (h % 20)}`,
          }
        : {
            tone: "wl",
            label: `WL ${1 + (h % 40)}`,
          };
    }

    return {
      tone: "sold",
      label: "Sold Out",
    };
  }

  if (avail <= 3) {
    return {
      tone: "low",
      label: `Only ${avail} left`,
    };
  }

  return {
    tone: "available",
    label: `${avail} available`,
  };
}

// ============================================================
// SERVICE DISRUPTIONS
// ============================================================

export function serviceDisruption(
  id: string,
): {
  cancelled: boolean;
  delayMins: number;
  reason: string;
} {
  const h = hashString(id);

  if (h % 23 === 0) {
    return {
      cancelled: true,
      delayMins: 0,
      reason: "Operational constraints",
    };
  }

  if (h % 7 === 0) {
    return {
      cancelled: false,
      delayMins: 15 + (h % 60),
      reason: "Traffic congestion",
    };
  }

  return {
    cancelled: false,
    delayMins: 0,
    reason: "",
  };
}

// ============================================================
// SEAT ALLOCATION
// ============================================================

export function allocateSeats(
  pnr: string,
  mode: TransportMode,
  classCode: string,
  paxCount: number,
): string[] {
  const seats: string[] = [];

  const h = hashString(
    pnr + mode + classCode,
  );

  const rowLetters = "ABCDEF";

  for (
    let i = 0;
    i < Math.max(1, paxCount);
    i++
  ) {
    const seatNum =
      1 + ((h + i * 7) % 72);

    const letter =
      rowLetters[
        (h + i) %
          rowLetters.length
      ];

    seats.push(`${letter}${seatNum}`);
  }

  return seats;
}

// ============================================================
// TIME HELPERS
// ============================================================

function slotStartMinutes(
  slot: string,
): number {
  switch (slot) {
    case "early":
      return 0;

    case "morning":
      return 360;

    case "afternoon":
      return 720;

    case "night":
      return 1080;

    default:
      return 360;
  }
}

function timeFromMinutes(
  mins: number,
): string {
  const normalized =
    ((mins % 1440) + 1440) % 1440;

  const h = Math.floor(
    normalized / 60,
  );

  const m = normalized % 60;

  const period =
    h >= 12 ? "PM" : "AM";

  let hh = h % 12;

  if (hh === 0) {
    hh = 12;
  }

  return `${hh}:${m
    .toString()
    .padStart(2, "0")} ${period}`;
}

function formatDuration(
  mins: number,
): string {
  const h = Math.floor(
    mins / 60,
  );

  const m = mins % 60;

  if (h <= 0) {
    return `${m}m`;
  }

  if (m === 0) {
    return `${h}h`;
  }

  return `${h}h ${m}m`;
}

// ============================================================
// MODE PROFILES
// ============================================================

type ClassDef = {
  code: string;
  label: string;
};

const modeProfiles: Record<
  Exclude<TransportMode, "hotel">,
  {
    speedKmh: number;
    overheadMins: number;
    namePool: string[];
    codePrefix: string;
    classCodes: ClassDef[];
    tagsPool: string[];
    hasOperatorName: boolean;
  }
> = {
  train: {
    speedKmh: 55,
    overheadMins: 10,

    namePool: [
      "Rajdhani Express",
      "Shatabdi Express",
      "Duronto Express",
      "Garib Rath Express",
      "Humsafar Express",
      "Sampark Kranti Express",
      "Jan Shatabdi Express",
      "Superfast Mail Express",
      "Vande Bharat Express",
    ],

    codePrefix: "1",

    classCodes: [
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
    ],

    tagsPool: [
      "Superfast",
      "Pantry Car",
      "E-Catering",
      "Vande Bharat",
    ],

    hasOperatorName: false,
  },

  bus: {
    speedKmh: 45,
    overheadMins: 5,

    namePool: [
      "Volvo Multi-Axle",
      "Rajasthan Roadways",
      "IntrCity SmartBus",
      "Neeta Travels",
      "Orange Tours",
      "VRL Travels",
      "RedBus Premium",
    ],

    codePrefix: "BUS",

    classCodes: [
      {
        code: "SEATER",
        label: "AC Seater",
      },
      {
        code: "SLEEPER",
        label: "AC Sleeper",
      },
    ],

    tagsPool: [
      "Volvo A/C",
      "Live Tracking",
      "Charging Point",
      "Water Bottle",
    ],

    hasOperatorName: true,
  },

  flight: {
    speedKmh: 700,
    overheadMins: 45,

    namePool: [
      "IndiGo",
      "Air India",
      "Vistara",
      "SpiceJet",
      "Akasa Air",
      "Air India Express",
    ],

    codePrefix: "AI",

    classCodes: [
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

    tagsPool: [
      "Non-stop",
      "Free Meal",
      "On-time Performance",
    ],

    hasOperatorName: true,
  },

  metro: {
    speedKmh: 33,
    overheadMins: 2,

    namePool: [
      "Blue Line",
      "Yellow Line",
      "Red Line",
      "Violet Line",
      "Pink Line",
      "Aqua Line",
      "Purple Line",
      "Green Line",
    ],

    codePrefix: "MTR",

    classCodes: [
      {
        code: "TOKEN",
        label: "Token",
      },
    ],

    tagsPool: [
      "Every 5 min",
      "Every 8 min",
      "Air Conditioned",
      "Smart Card",
    ],

    hasOperatorName: false,
  },

  ferry: {
    speedKmh: 28,
    overheadMins: 10,

    namePool: [
      "Coastal Cruiser",
      "Harbour Express",
      "Island Hopper",
      "SeaLink Ferry",
      "Water Metro",
    ],

    codePrefix: "FRY",

    classCodes: [
      {
        code: "DECK",
        label: "Deck Class",
      },
      {
        code: "CABIN",
        label: "Cabin",
      },
    ],

    tagsPool: [
      "Life Jackets Provided",
      "Onboard Cafe",
      "Scenic Route",
      "Weather Monitoring",
    ],

    hasOperatorName: true,
  },
};

// ============================================================
// TRANSPORT SEGMENT BUILDER
// ============================================================

function buildTransportSegment(
  mode: Exclude<TransportMode, "hotel">,
  from: Station,
  to: Station,
  km: number,
  demand: number,
  slot: string,
  index: number,
  seed: string,
): Segment {
  const profile =
    modeProfiles[mode];

  const h = hashString(seed);

  const slotStart =
    slotStartMinutes(slot);

  const departMins =
    (slotStart + (h % 300)) %
    1440;

  const durationMins =
    Math.max(
      20,
      Math.round(
        (km / profile.speedKmh) *
          60,
      ) +
        profile.overheadMins +
        (h % 20),
    );

  const arriveMins =
    departMins +
    durationMins;

  const name =
    profile.namePool[
      h % profile.namePool.length
    ];

  const code =
    `${profile.codePrefix}${
      1000 + (h % 8999)
    }`;

  const operator =
    profile.hasOperatorName
      ? name
      : undefined;

  const options =
    profile.classCodes.map(
      (cls) => {
        const availSeed =
          hashString(
            `${seed}-${cls.code}`,
          );

        const available =
          5 +
          (availSeed % 60);

        const fare =
          computeFare(
            km,
            cls.code,
            demand,
          );

        const probability =
          mode === "metro"
            ? 100
            : Math.max(
                15,
                100 -
                  (availSeed % 100),
              );

        return {
          code: cls.code,
          label: cls.label,
          fare,
          available,
          probability,
        };
      },
    );

  const tags = [
    profile.tagsPool[
      h % profile.tagsPool.length
    ],
  ];

  if (
    mode === "flight" &&
    h % 3 === 0
  ) {
    tags.push("1 stop");
  }

  return {
    id: `${mode}-${seed}-${index}`,

    mode,

    name,
    code,
    operator,

    from: from.city,
    fromCode: from.code,

    to: to.city,
    toCode: to.code,

    depart:
      timeFromMinutes(
        departMins,
      ),

    arrive:
      timeFromMinutes(
        arriveMins,
      ),

    durationMins,

    duration:
      formatDuration(
        durationMins,
      ),

    distanceKm: km,

    tags,

    options,
  };
}

// ============================================================
// HOTEL ROOM TYPES
// ============================================================

const hotelRoomTypes: ClassDef[] = [
  {
    code: "DELUXE",
    label: "Deluxe Room",
  },
  {
    code: "PREMIUM",
    label: "Premium Room",
  },
  {
    code: "EXECUTIVE",
    label: "Executive Room",
  },
  {
    code: "SUITE",
    label: "Family Suite",
  },
];

// ============================================================
// HOTEL SEGMENT
// IMPORTANT: NO FROM / TO
// ============================================================

function buildHotelSegment(
  location: Station,
  demand: number,
  index: number,
  seed: string,
): Segment {
  const h = hashString(seed);

  const hotelCandidates =
    allHotels.filter(
      (hotel) =>
        hotel.city ===
        location.city,
    );

  const hotel =
    hotelCandidates[
      h % Math.max(
        1,
        hotelCandidates.length,
      )
    ];

  const options =
    hotelRoomTypes.map(
      (rt) => {
        const availSeed =
          hashString(
            `${seed}-${rt.code}`,
          );

        const available =
          1 +
          (availSeed % 12);

        const fare =
          computeFare(
            120,
            rt.code,
            demand,
          );

        const probability =
          Math.max(
            20,
            100 -
              (availSeed % 80),
          );

        return {
          code: rt.code,
          label: rt.label,
          fare,
          available,
          probability,
        };
      },
    );

  return {
    id:
      `hotel-${hotel.id}-${index}-${h}`,

    mode: "hotel",

    name:
      hotel.name,

    code:
      `HTL${
        1000 + (h % 8999)
      }`,

    operator:
      hotel.name,

    // --------------------------------------------------------
    // NO FROM
    // NO FROM CODE
    // NO TO
    // NO TO CODE
    // --------------------------------------------------------

    depart: "2:00 PM",
    arrive: "11:00 AM",

    durationMins: 1260,
    duration: "1 Night",

    distanceKm: 0,

    tags:
      h % 2 === 0
        ? [
            "Free Cancellation",
            "Breakfast Included",
          ]
        : [
            "Free Cancellation",
          ],

    options,
  };
}

// ============================================================
// HOTEL DESTINATION → STATION OBJECT
// Used internally without exposing from/to.
// ============================================================

function hotelLocationToStation(
  destination: HotelDestination,
): Station {
  return {
    name: destination.city,
    code:
      `HOTEL-${destination.city
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "-")}`,
    city: destination.city,
    state: destination.state,
    locationType: "hotel_location",
  };
}

// ============================================================
// PUBLIC RESULT GENERATOR
// ============================================================

export function generateResults(
  mode: TransportMode,
  from: Station,
  to: Station,
  date: Date,
  slot: string,
  count: number,
  seed: string,
): Segment[] {
  const segments: Segment[] = [];

  // ==========================================================
  // HOTEL SEARCH
  // Hotels use famous destinations.
  // No From/To is included in returned Segment.
  // ==========================================================

  if (mode === "hotel") {
    const safeCount =
      Math.max(0, count);

    const destinationSeed =
      hashString(
        `${seed}-${date
          .toISOString()
          .slice(0, 10)}`,
      );

    for (
      let i = 0;
      i < safeCount;
      i++
    ) {
      const destination =
        famousHotelDestinations[
          (destinationSeed + i) %
            famousHotelDestinations.length
        ];

      const location =
        hotelLocationToStation(
          destination,
        );

      const demand =
        1 +
        ((hashString(
          `${destination.city}-${date
            .toISOString()
            .slice(0, 10)}`,
        ) %
          40) /
          100);

      segments.push(
        buildHotelSegment(
          location,
          demand,
          i,
          `${seed}-hotel-${destination.city}-${i}`,
        ),
      );
    }

    return segments;
  }

  // ==========================================================
  // TRANSPORT
  // ==========================================================

  const demand =
    demandIndex(
      from,
      to,
      date,
    );

  const km =
    distanceKm(
      from,
      to,
    );

  for (
    let i = 0;
    i < Math.max(0, count);
    i++
  ) {
    const localSeed =
      `${seed}-${mode}-${from.code}-${to.code}-${i}`;

    segments.push(
      buildTransportSegment(
        mode,
        from,
        to,
        km,
        demand,
        slot,
        i,
        localSeed,
      ),
    );
  }

  return segments;
}

// ============================================================
// MODE-SPECIFIC LOCATION HELPERS
// Useful for dropdown/search UI
// ============================================================

export function locationsForMode(
  mode: TransportMode,
): Station[] {
  switch (mode) {
    case "train":
      return trainStations;

    case "bus":
      return busStands;

    case "flight":
      return airports;

    case "metro":
      return metroStations;

    case "ferry":
      return seaports;

    case "hotel":
      return famousHotelDestinations.map(
        hotelLocationToStation,
      );

    default:
      return [];
  }
}

// ============================================================
// VALIDATE WHETHER A LOCATION BELONGS TO A MODE
// ============================================================

export function isValidLocationForMode(
  mode: TransportMode,
  location?: Station,
): boolean {
  if (!location) return false;

  const expected =
    mode === "train"
      ? "train_station"
      : mode === "bus"
        ? "bus_stand"
        : mode === "flight"
          ? "airport"
          : mode === "metro"
            ? "metro_station"
            : mode === "ferry"
              ? "seaport"
              : "hotel_location";

  return (
    location.locationType ===
    expected
  );
}

// ============================================================
// FIND ROUTE
// ============================================================

export function findRoute(
  mode: Exclude<TransportMode, "hotel">,
  fromCode: string,
  toCode: string,
): RouteDef | undefined {
  return modeRoutes[mode].find(
    (route) =>
      route.from.code ===
        fromCode &&
      route.to.code === toCode,
  );
}

// ============================================================
// GET ROUTES FOR A MODE
// ============================================================

export function routesForMode(
  mode: Exclude<TransportMode, "hotel">,
): RouteDef[] {
  return modeRoutes[mode];
}

// ============================================================
// GET AVAILABLE DESTINATIONS FROM ORIGIN
// ============================================================

export function destinationsFrom(
  mode: Exclude<TransportMode, "hotel">,
  fromCode: string,
): Station[] {
  return modeRoutes[mode]
    .filter(
      (route) =>
        route.from.code ===
        fromCode,
    )
    .map(
      (route) =>
        route.to,
    );
}

// ============================================================
// GET AVAILABLE ORIGINS FOR DESTINATION
// ============================================================

export function originsTo(
  mode: Exclude<TransportMode, "hotel">,
  toCode: string,
): Station[] {
  return modeRoutes[mode]
    .filter(
      (route) =>
        route.to.code ===
        toCode,
    )
    .map(
      (route) =>
        route.from,
    );
}
