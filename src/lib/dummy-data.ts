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
  {
    name: "New Delhi Railway Station",
    code: "NDLS",
    city: "Delhi",
    state: "Delhi",
    locationType: "train_station",
  },
  {
    name: "Hazrat Nizamuddin Railway Station",
    code: "NZM",
    city: "Delhi",
    state: "Delhi",
    locationType: "train_station",
  },
  {
    name: "Anand Vihar Terminal",
    code: "ANVT",
    city: "Delhi",
    state: "Delhi",
    locationType: "train_station",
  },

  // RAJASTHAN
  {
    name: "Jaipur Junction",
    code: "JP",
    city: "Jaipur",
    state: "Rajasthan",
    locationType: "train_station",
  },
  {
    name: "Jodhpur Junction",
    code: "JU",
    city: "Jodhpur",
    state: "Rajasthan",
    locationType: "train_station",
  },
  {
    name: "Ajmer Junction",
    code: "AII",
    city: "Ajmer",
    state: "Rajasthan",
    locationType: "train_station",
  },
  {
    name: "Kota Junction",
    code: "KOTA",
    city: "Kota",
    state: "Rajasthan",
    locationType: "train_station",
  },
  {
    name: "Udaipur City Railway Station",
    code: "UDZ",
    city: "Udaipur",
    state: "Rajasthan",
    locationType: "train_station",
  },

  // MAHARASHTRA
  {
    name: "Mumbai Central",
    code: "BCT",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "train_station",
  },
  {
    name: "Chhatrapati Shivaji Maharaj Terminus",
    code: "CSMT",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "train_station",
  },
  {
    name: "Lokmanya Tilak Terminus",
    code: "LTT",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "train_station",
  },
  {
    name: "Pune Junction",
    code: "PUNE",
    city: "Pune",
    state: "Maharashtra",
    locationType: "train_station",
  },
  {
    name: "Nagpur Junction",
    code: "NGP",
    city: "Nagpur",
    state: "Maharashtra",
    locationType: "train_station",
  },
  {
    name: "Nashik Road Railway Station",
    code: "NK",
    city: "Nashik",
    state: "Maharashtra",
    locationType: "train_station",
  },

  // GUJARAT
  {
    name: "Ahmedabad Junction",
    code: "ADI",
    city: "Ahmedabad",
    state: "Gujarat",
    locationType: "train_station",
  },
  {
    name: "Vadodara Junction",
    code: "BRC",
    city: "Vadodara",
    state: "Gujarat",
    locationType: "train_station",
  },
  {
    name: "Surat Railway Station",
    code: "ST",
    city: "Surat",
    state: "Gujarat",
    locationType: "train_station",
  },
  {
    name: "Rajkot Junction",
    code: "RJT",
    city: "Rajkot",
    state: "Gujarat",
    locationType: "train_station",
  },

  // UTTAR PRADESH
  {
    name: "Lucknow Charbagh Railway Station",
    code: "LKO",
    city: "Lucknow",
    state: "Uttar Pradesh",
    locationType: "train_station",
  },
  {
    name: "Kanpur Central",
    code: "CNB",
    city: "Kanpur",
    state: "Uttar Pradesh",
    locationType: "train_station",
  },
  {
    name: "Varanasi Junction",
    code: "BSB",
    city: "Varanasi",
    state: "Uttar Pradesh",
    locationType: "train_station",
  },
  {
    name: "Prayagraj Junction",
    code: "PRYJ",
    city: "Prayagraj",
    state: "Uttar Pradesh",
    locationType: "train_station",
  },
  {
    name: "Agra Cantt",
    code: "AGC",
    city: "Agra",
    state: "Uttar Pradesh",
    locationType: "train_station",
  },
  {
    name: "Gorakhpur Junction",
    code: "GKP",
    city: "Gorakhpur",
    state: "Uttar Pradesh",
    locationType: "train_station",
  },

  // WEST BENGAL
  {
    name: "Howrah Junction",
    code: "HWH",
    city: "Kolkata",
    state: "West Bengal",
    locationType: "train_station",
  },
  {
    name: "Sealdah Railway Station",
    code: "SDAH",
    city: "Kolkata",
    state: "West Bengal",
    locationType: "train_station",
  },
  {
    name: "Durgapur Railway Station",
    code: "DGR",
    city: "Durgapur",
    state: "West Bengal",
    locationType: "train_station",
  },

  // BIHAR
  {
    name: "Patna Junction",
    code: "PNBE",
    city: "Patna",
    state: "Bihar",
    locationType: "train_station",
  },
  {
    name: "Gaya Junction",
    code: "GAYA",
    city: "Gaya",
    state: "Bihar",
    locationType: "train_station",
  },
  {
    name: "Muzaffarpur Junction",
    code: "MFP",
    city: "Muzaffarpur",
    state: "Bihar",
    locationType: "train_station",
  },

  // JHARKHAND
  {
    name: "Ranchi Junction",
    code: "RNC",
    city: "Ranchi",
    state: "Jharkhand",
    locationType: "train_station",
  },
  {
    name: "Dhanbad Junction",
    code: "DHN",
    city: "Dhanbad",
    state: "Jharkhand",
    locationType: "train_station",
  },

  // MADHYA PRADESH
  {
    name: "Bhopal Junction",
    code: "BPL",
    city: "Bhopal",
    state: "Madhya Pradesh",
    locationType: "train_station",
  },
  {
    name: "Indore Junction",
    code: "INDB",
    city: "Indore",
    state: "Madhya Pradesh",
    locationType: "train_station",
  },
  {
    name: "Gwalior Junction",
    code: "GWL",
    city: "Gwalior",
    state: "Madhya Pradesh",
    locationType: "train_station",
  },

  // CHHATTISGARH
  {
    name: "Raipur Junction",
    code: "R",
    city: "Raipur",
    state: "Chhattisgarh",
    locationType: "train_station",
  },
  {
    name: "Bilaspur Junction",
    code: "BSP",
    city: "Bilaspur",
    state: "Chhattisgarh",
    locationType: "train_station",
  },

  // PUNJAB / HARYANA
  {
    name: "Chandigarh Railway Station",
    code: "CDG",
    city: "Chandigarh",
    state: "Chandigarh",
    locationType: "train_station",
  },
  {
    name: "Amritsar Junction",
    code: "ASR",
    city: "Amritsar",
    state: "Punjab",
    locationType: "train_station",
  },
  {
    name: "Ludhiana Junction",
    code: "LDH",
    city: "Ludhiana",
    state: "Punjab",
    locationType: "train_station",
  },
  {
    name: "Ambala Cantt",
    code: "UMB",
    city: "Ambala",
    state: "Haryana",
    locationType: "train_station",
  },
  {
    name: "Gurugram Railway Station",
    code: "GGN",
    city: "Gurugram",
    state: "Haryana",
    locationType: "train_station",
  },

  // JAMMU & KASHMIR
  {
    name: "Jammu Tawi",
    code: "JAT",
    city: "Jammu",
    state: "Jammu & Kashmir",
    locationType: "train_station",
  },
  {
    name: "Srinagar Railway Station",
    code: "SINA",
    city: "Srinagar",
    state: "Jammu & Kashmir",
    locationType: "train_station",
  },

  // HIMACHAL
  {
    name: "Shimla Railway Station",
    code: "SML",
    city: "Shimla",
    state: "Himachal Pradesh",
    locationType: "train_station",
  },

  // ODISHA
  {
    name: "Bhubaneswar Railway Station",
    code: "BBS",
    city: "Bhubaneswar",
    state: "Odisha",
    locationType: "train_station",
  },
  {
    name: "Cuttack Railway Station",
    code: "CTC",
    city: "Cuttack",
    state: "Odisha",
    locationType: "train_station",
  },

  // ASSAM
  {
    name: "Guwahati Railway Station",
    code: "GHY",
    city: "Guwahati",
    state: "Assam",
    locationType: "train_station",
  },
  {
    name: "Dibrugarh Railway Station",
    code: "DBRG",
    city: "Dibrugarh",
    state: "Assam",
    locationType: "train_station",
  },

  // TELANGANA
  {
    name: "Secunderabad Junction",
    code: "SC",
    city: "Hyderabad",
    state: "Telangana",
    locationType: "train_station",
  },
  {
    name: "Hyderabad Deccan",
    code: "HYB",
    city: "Hyderabad",
    state: "Telangana",
    locationType: "train_station",
  },

  // KARNATAKA
  {
    name: "KSR Bengaluru",
    code: "SBC",
    city: "Bengaluru",
    state: "Karnataka",
    locationType: "train_station",
  },
  {
    name: "Yesvantpur Junction",
    code: "YPR",
    city: "Bengaluru",
    state: "Karnataka",
    locationType: "train_station",
  },
  {
    name: "Mysuru Junction",
    code: "MYS",
    city: "Mysuru",
    state: "Karnataka",
    locationType: "train_station",
  },

  // TAMIL NADU
  {
    name: "Chennai Central",
    code: "MAS",
    city: "Chennai",
    state: "Tamil Nadu",
    locationType: "train_station",
  },
  {
    name: "Coimbatore Junction",
    code: "CBE",
    city: "Coimbatore",
    state: "Tamil Nadu",
    locationType: "train_station",
  },
  {
    name: "Madurai Junction",
    code: "MDU",
    city: "Madurai",
    state: "Tamil Nadu",
    locationType: "train_station",
  },

  // KERALA
  {
    name: "Ernakulam Junction",
    code: "ERS",
    city: "Kochi",
    state: "Kerala",
    locationType: "train_station",
  },
  {
    name: "Thiruvananthapuram Central",
    code: "TVC",
    city: "Thiruvananthapuram",
    state: "Kerala",
    locationType: "train_station",
  },
  {
    name: "Kozhikode Railway Station",
    code: "CLT",
    city: "Kozhikode",
    state: "Kerala",
    locationType: "train_station",
  },

  // ANDHRA PRADESH
  {
    name: "Vijayawada Junction",
    code: "BZA",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    locationType: "train_station",
  },
  {
    name: "Visakhapatnam Railway Station",
    code: "VSKP",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    locationType: "train_station",
  },
  {
    name: "Tirupati Railway Station",
    code: "TPTY",
    city: "Tirupati",
    state: "Andhra Pradesh",
    locationType: "train_station",
  },

  // GOA
  {
    name: "Madgaon Junction",
    code: "MAO",
    city: "Madgaon",
    state: "Goa",
    locationType: "train_station",
  },
  {
    name: "Vasco Da Gama Railway Station",
    code: "VSG",
    city: "Vasco",
    state: "Goa",
    locationType: "train_station",
  },

  // KONKAN
  {
    name: "Ratnagiri Railway Station",
    code: "RN",
    city: "Ratnagiri",
    state: "Maharashtra",
    locationType: "train_station",
  },
  {
    name: "Karmali Railway Station",
    code: "KRMI",
    city: "Karmali",
    state: "Goa",
    locationType: "train_station",
  },
];

// ============================================================
// BUS STANDS / TERMINALS
// ============================================================

export const busStands: Station[] = [
  {
    name: "Kashmere Gate ISBT",
    code: "KGT",
    city: "Delhi",
    state: "Delhi",
    locationType: "bus_stand",
  },
  {
    name: "Anand Vihar ISBT",
    code: "AVB",
    city: "Delhi",
    state: "Delhi",
    locationType: "bus_stand",
  },
  {
    name: "Jaipur Sindhi Camp Bus Stand",
    code: "JSC",
    city: "Jaipur",
    state: "Rajasthan",
    locationType: "bus_stand",
  },
  {
    name: "Jodhpur Central Bus Stand",
    code: "JBS",
    city: "Jodhpur",
    state: "Rajasthan",
    locationType: "bus_stand",
  },
  {
    name: "Ajmer Bus Stand",
    code: "ABS",
    city: "Ajmer",
    state: "Rajasthan",
    locationType: "bus_stand",
  },
  {
    name: "Udaipur Bus Stand",
    code: "UBS",
    city: "Udaipur",
    state: "Rajasthan",
    locationType: "bus_stand",
  },
  {
    name: "Mumbai Central Bus Depot",
    code: "MCB",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "bus_stand",
  },
  {
    name: "Pune Swargate Bus Stand",
    code: "PSB",
    city: "Pune",
    state: "Maharashtra",
    locationType: "bus_stand",
  },
  {
    name: "Ahmedabad Geeta Mandir Bus Stand",
    code: "AGM",
    city: "Ahmedabad",
    state: "Gujarat",
    locationType: "bus_stand",
  },
  {
    name: "Vadodara Central Bus Station",
    code: "VDB",
    city: "Vadodara",
    state: "Gujarat",
    locationType: "bus_stand",
  },
  {
    name: "Lucknow Alambagh Bus Stand",
    code: "LAB",
    city: "Lucknow",
    state: "Uttar Pradesh",
    locationType: "bus_stand",
  },
  {
    name: "Kanpur Jhakarkati Bus Stand",
    code: "KJB",
    city: "Kanpur",
    state: "Uttar Pradesh",
    locationType: "bus_stand",
  },
  {
    name: "Varanasi Cantt Bus Stand",
    code: "VCB",
    city: "Varanasi",
    state: "Uttar Pradesh",
    locationType: "bus_stand",
  },
  {
    name: "Agra ISBT",
    code: "AIB",
    city: "Agra",
    state: "Uttar Pradesh",
    locationType: "bus_stand",
  },
  {
    name: "Kolkata Esplanade Bus Stand",
    code: "KEB",
    city: "Kolkata",
    state: "West Bengal",
    locationType: "bus_stand",
  },
  {
    name: "Patna Mithapur Bus Stand",
    code: "PMB",
    city: "Patna",
    state: "Bihar",
    locationType: "bus_stand",
  },
  {
    name: "Bengaluru Kempegowda Bus Station",
    code: "KBS",
    city: "Bengaluru",
    state: "Karnataka",
    locationType: "bus_stand",
  },
  {
    name: "Chennai CMBT",
    code: "CMBT",
    city: "Chennai",
    state: "Tamil Nadu",
    locationType: "bus_stand",
  },
  {
    name: "Hyderabad MGBS",
    code: "MGBS",
    city: "Hyderabad",
    state: "Telangana",
    locationType: "bus_stand",
  },
  {
    name: "Kochi Vyttila Mobility Hub",
    code: "VMH",
    city: "Kochi",
    state: "Kerala",
    locationType: "bus_stand",
  },
];

// ============================================================
// AIRPORTS
// ============================================================

export const airports: Station[] = [
  {
    name: "Indira Gandhi International Airport",
    code: "DEL",
    city: "Delhi",
    state: "Delhi",
    locationType: "airport",
  },
  {
    name: "Jaipur International Airport",
    code: "JAI",
    city: "Jaipur",
    state: "Rajasthan",
    locationType: "airport",
  },
  {
    name: "Jodhpur Airport",
    code: "JDH",
    city: "Jodhpur",
    state: "Rajasthan",
    locationType: "airport",
  },
  {
    name: "Mumbai Chhatrapati Shivaji Maharaj International Airport",
    code: "BOM",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "airport",
  },
  {
    name: "Pune International Airport",
    code: "PNQ",
    city: "Pune",
    state: "Maharashtra",
    locationType: "airport",
  },
  {
    name: "Ahmedabad International Airport",
    code: "AMD",
    city: "Ahmedabad",
    state: "Gujarat",
    locationType: "airport",
  },
  {
    name: "Surat Airport",
    code: "STV",
    city: "Surat",
    state: "Gujarat",
    locationType: "airport",
  },
  {
    name: "Lucknow Chaudhary Charan Singh International Airport",
    code: "LKOA",
    city: "Lucknow",
    state: "Uttar Pradesh",
    locationType: "airport",
  },
  {
    name: "Lal Bahadur Shastri International Airport",
    code: "VNS",
    city: "Varanasi",
    state: "Uttar Pradesh",
    locationType: "airport",
  },
  {
    name: "Agra Airport",
    code: "AGR",
    city: "Agra",
    state: "Uttar Pradesh",
    locationType: "airport",
  },
  {
    name: "Netaji Subhas Chandra Bose International Airport",
    code: "CCU",
    city: "Kolkata",
    state: "West Bengal",
    locationType: "airport",
  },
  {
    name: "Jay Prakash Narayan International Airport",
    code: "PAT",
    city: "Patna",
    state: "Bihar",
    locationType: "airport",
  },
  {
    name: "Ranchi Birsa Munda Airport",
    code: "IXR",
    city: "Ranchi",
    state: "Jharkhand",
    locationType: "airport",
  },
  {
    name: "Bhopal Raja Bhoj Airport",
    code: "BHO",
    city: "Bhopal",
    state: "Madhya Pradesh",
    locationType: "airport",
  },
  {
    name: "Indore Devi Ahilya Bai Holkar Airport",
    code: "IDR",
    city: "Indore",
    state: "Madhya Pradesh",
    locationType: "airport",
  },
  {
    name: "Chandigarh International Airport",
    code: "IXC",
    city: "Chandigarh",
    state: "Chandigarh",
    locationType: "airport",
  },
  {
    name: "Amritsar Sri Guru Ram Dass Jee International Airport",
    code: "ATQ",
    city: "Amritsar",
    state: "Punjab",
    locationType: "airport",
  },
  {
    name: "Srinagar International Airport",
    code: "SXR",
    city: "Srinagar",
    state: "Jammu & Kashmir",
    locationType: "airport",
  },
  {
    name: "Shimla Airport",
    code: "SLV",
    city: "Shimla",
    state: "Himachal Pradesh",
    locationType: "airport",
  },
  {
    name: "Bhubaneswar Biju Patnaik International Airport",
    code: "BBI",
    city: "Bhubaneswar",
    state: "Odisha",
    locationType: "airport",
  },
  {
    name: "Guwahati Lokpriya Gopinath Bordoloi International Airport",
    code: "GAU",
    city: "Guwahati",
    state: "Assam",
    locationType: "airport",
  },
  {
    name: "Hyderabad Rajiv Gandhi International Airport",
    code: "HYDA",
    city: "Hyderabad",
    state: "Telangana",
    locationType: "airport",
  },
  {
    name: "Kempegowda International Airport",
    code: "BLR",
    city: "Bengaluru",
    state: "Karnataka",
    locationType: "airport",
  },
  {
    name: "Chennai International Airport",
    code: "MAA",
    city: "Chennai",
    state: "Tamil Nadu",
    locationType: "airport",
  },
  {
    name: "Coimbatore International Airport",
    code: "CJB",
    city: "Coimbatore",
    state: "Tamil Nadu",
    locationType: "airport",
  },
  {
    name: "Madurai Airport",
    code: "IXM",
    city: "Madurai",
    state: "Tamil Nadu",
    locationType: "airport",
  },
  {
    name: "Cochin International Airport",
    code: "COK",
    city: "Kochi",
    state: "Kerala",
    locationType: "airport",
  },
  {
    name: "Trivandrum International Airport",
    code: "TRV",
    city: "Thiruvananthapuram",
    state: "Kerala",
    locationType: "airport",
  },
  {
    name: "Visakhapatnam International Airport",
    code: "VTZ",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    locationType: "airport",
  },
  {
    name: "Tirupati Airport",
    code: "TIR",
    city: "Tirupati",
    state: "Andhra Pradesh",
    locationType: "airport",
  },
  {
    name: "Goa Manohar International Airport",
    code: "GOX",
    city: "Goa",
    state: "Goa",
    locationType: "airport",
  },
  {
    name: "Dabolim Airport",
    code: "GOI",
    city: "Goa",
    state: "Goa",
    locationType: "airport",
  },
];

// ============================================================
// METRO STATIONS
// ============================================================

export const metroStations: Station[] = [
  {
    name: "Rajiv Chowk Metro Station",
    code: "MRC",
    city: "Delhi",
    state: "Delhi",
    locationType: "metro_station",
  },
  {
    name: "Kashmere Gate Metro Station",
    code: "MKG",
    city: "Delhi",
    state: "Delhi",
    locationType: "metro_station",
  },
  {
    name: "Saket Metro Station",
    code: "MSK",
    city: "Delhi",
    state: "Delhi",
    locationType: "metro_station",
  },
  {
    name: "Hauz Khas Metro Station",
    code: "MHK",
    city: "Delhi",
    state: "Delhi",
    locationType: "metro_station",
  },
  {
    name: "Dwarka Sector 21 Metro Station",
    code: "MDW",
    city: "Delhi",
    state: "Delhi",
    locationType: "metro_station",
  },
  {
    name: "Noida Sector 18 Metro Station",
    code: "MN18",
    city: "Noida",
    state: "Uttar Pradesh",
    locationType: "metro_station",
  },
  {
    name: "Botanical Garden Metro Station",
    code: "MBG",
    city: "Noida",
    state: "Uttar Pradesh",
    locationType: "metro_station",
  },
  {
    name: "Vaishali Metro Station",
    code: "MVS",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    locationType: "metro_station",
  },
  {
    name: "Andheri Metro Station",
    code: "MMA",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "metro_station",
  },
  {
    name: "Ghatkopar Metro Station",
    code: "MMG",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "metro_station",
  },
  {
    name: "Dahisar East Metro Station",
    code: "MDE",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "metro_station",
  },
  {
    name: "Majestic Metro Station",
    code: "MBM",
    city: "Bengaluru",
    state: "Karnataka",
    locationType: "metro_station",
  },
  {
    name: "MG Road Metro Station",
    code: "MMGR",
    city: "Bengaluru",
    state: "Karnataka",
    locationType: "metro_station",
  },
  {
    name: "Esplanade Metro Station",
    code: "KES",
    city: "Kolkata",
    state: "West Bengal",
    locationType: "metro_station",
  },
  {
    name: "Park Street Metro Station",
    code: "KPS",
    city: "Kolkata",
    state: "West Bengal",
    locationType: "metro_station",
  },
  {
    name: "Ameerpet Metro Station",
    code: "HAM",
    city: "Hyderabad",
    state: "Telangana",
    locationType: "metro_station",
  },
  {
    name: "Miyapur Metro Station",
    code: "HMM",
    city: "Hyderabad",
    state: "Telangana",
    locationType: "metro_station",
  },
  {
    name: "Chennai Central Metro Station",
    code: "CMC",
    city: "Chennai",
    state: "Tamil Nadu",
    locationType: "metro_station",
  },
  {
    name: "Airport Metro Station Chennai",
    code: "CMA",
    city: "Chennai",
    state: "Tamil Nadu",
    locationType: "metro_station",
  },
  {
    name: "Aluva Metro Station",
    code: "KMA",
    city: "Kochi",
    state: "Kerala",
    locationType: "metro_station",
  },
  {
    name: "Maharaja's College Metro Station",
    code: "KMC",
    city: "Kochi",
    state: "Kerala",
    locationType: "metro_station",
  },
];

// ============================================================
// SEAPORTS / FERRY TERMINALS
// ============================================================

export const seaports: Station[] = [
  {
    name: "Gateway of India Ferry Terminal",
    code: "GOI-F",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "seaport",
  },
  {
    name: "Mandwa Ferry Terminal",
    code: "MDW-F",
    city: "Alibaug",
    state: "Maharashtra",
    locationType: "seaport",
  },
  {
    name: "Elephanta Island Ferry Terminal",
    code: "ELP-F",
    city: "Mumbai",
    state: "Maharashtra",
    locationType: "seaport",
  },
  {
    name: "Mormugao Harbour",
    code: "MOR-F",
    city: "Goa",
    state: "Goa",
    locationType: "seaport",
  },
  {
    name: "Panaji Ferry Terminal",
    code: "PNJ-F",
    city: "Panaji",
    state: "Goa",
    locationType: "seaport",
  },
  {
    name: "Kochi Fort Ferry Terminal",
    code: "KFT-F",
    city: "Kochi",
    state: "Kerala",
    locationType: "seaport",
  },
  {
    name: "Vypeen Ferry Terminal",
    code: "VYP-F",
    city: "Kochi",
    state: "Kerala",
    locationType: "seaport",
  },
  {
    name: "Chennai Ferry Terminal",
    code: "CHE-F",
    city: "Chennai",
    state: "Tamil Nadu",
    locationType: "seaport",
  },
  {
    name: "Port Blair Ferry Terminal",
    code: "PBR-F",
    city: "Port Blair",
    state: "Andaman & Nicobar Islands",
    locationType: "seaport",
  },
  {
    name: "Swaraj Dweep Ferry Terminal",
    code: "SWT-F",
    city: "Swaraj Dweep",
    state: "Andaman & Nicobar Islands",
    locationType: "seaport",
  },
  {
    name: "Kochi Water Metro Terminal",
    code: "KWM-F",
    city: "Kochi",
    state: "Kerala",
    locationType: "seaport",
  },
  {
    name: "Alappuzha Boat Jetty",
    code: "ALP-F",
    city: "Alappuzha",
    state: "Kerala",
    locationType: "seaport",
  },
];

// ============================================================
// ALL LOCATIONS
// ============================================================

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
// ============================================================

export const trainRoutes: RouteDef[] = [
  [trainStations[0], trainStations[3]],
  [trainStations[0], trainStations[8]],
  [trainStations[0], trainStations[14]],
  [trainStations[0], trainStations[18]],
  [trainStations[0], trainStations[22]],
  [trainStations[0], trainStations[27]],
  [trainStations[0], trainStations[32]],
  [trainStations[0], trainStations[37]],
  [trainStations[0], trainStations[42]],
  [trainStations[0], trainStations[49]],
  [trainStations[0], trainStations[54]],
  [trainStations[0], trainStations[57]],

  [trainStations[3], trainStations[4]],
  [trainStations[3], trainStations[8]],
  [trainStations[8], trainStations[11]],
  [trainStations[8], trainStations[14]],
  [trainStations[11], trainStations[14]],
  [trainStations[14], trainStations[15]],
  [trainStations[18], trainStations[19]],
  [trainStations[19], trainStations[20]],
  [trainStations[22], trainStations[20]],
  [trainStations[27], trainStations[28]],
  [trainStations[49], trainStations[51]],
  [trainStations[54], trainStations[55]],
  [trainStations[55], trainStations[57]],
  [trainStations[63], trainStations[64]],
].map(([from, to]) => ({ from, to }));

// ============================================================
// BUS ROUTES
// ============================================================

export const busRoutes: RouteDef[] = [
  [busStands[0], busStands[2]],
  [busStands[0], busStands[6]],
  [busStands[0], busStands[10]],
  [busStands[0], busStands[13]],
  [busStands[0], busStands[15]],
  [busStands[0], busStands[16]],
  [busStands[0], busStands[17]],
  [busStands[2], busStands[3]],
  [busStands[2], busStands[5]],
  [busStands[6], busStands[7]],
  [busStands[6], busStands[8]],
  [busStands[8], busStands[9]],
  [busStands[10], busStands[11]],
  [busStands[11], busStands[12]],
  [busStands[16], busStands[17]],
  [busStands[17], busStands[18]],
  [busStands[18], busStands[19]],
].map(([from, to]) => ({ from, to }));

// ============================================================
// FLIGHT ROUTES
// ============================================================

export const flightRoutes: RouteDef[] = [
  [airports[0], airports[3]],
  [airports[0], airports[1]],
  [airports[0], airports[5]],
  [airports[0], airports[7]],
  [airports[0], airports[9]],
  [airports[0], airports[10]],
  [airports[0], airports[11]],
  [airports[0], airports[15]],
  [airports[0], airports[17]],
  [airports[0], airports[22]],
  [airports[0], airports[24]],
  [airports[0], airports[27]],
  [airports[0], airports[30]],
  [airports[3], airports[4]],
  [airports[3], airports[5]],
  [airports[22], airports[24]],
  [airports[24], airports[27]],
  [airports[30], airports[31]],
].map(([from, to]) => ({ from, to }));

// ============================================================
// METRO ROUTES
// ============================================================

export const metroRoutes: RouteDef[] = [
  [metroStations[0], metroStations[1]],
  [metroStations[0], metroStations[2]],
  [metroStations[0], metroStations[3]],
  [metroStations[0], metroStations[4]],
  [metroStations[1], metroStations[5]],
  [metroStations[5], metroStations[6]],
  [metroStations[6], metroStations[7]],
  [metroStations[8], metroStations[9]],
  [metroStations[9], metroStations[10]],
  [metroStations[11], metroStations[12]],
  [metroStations[13], metroStations[14]],
  [metroStations[15], metroStations[16]],
  [metroStations[17], metroStations[18]],
  [metroStations[19], metroStations[20]],
].map(([from, to]) => ({ from, to }));

// ============================================================
// FERRY ROUTES
// ============================================================

export const ferryRoutes: RouteDef[] = [
  [seaports[0], seaports[1]],
  [seaports[0], seaports[2]],
  [seaports[1], seaports[0]],
  [seaports[2], seaports[0]],
  [seaports[3], seaports[4]],
  [seaports[5], seaports[6]],
  [seaports[8], seaports[9]],
  [seaports[10], seaports[11]],
].map(([from, to]) => ({ from, to }));

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
  {
    city: "Mumbai",
    state: "Maharashtra",
    landmark: "Gateway of India & Marine Drive",
  },
  { city: "Pune", state: "Maharashtra", landmark: "Shaniwar Wada" },
  { city: "Nashik", state: "Maharashtra", landmark: "Trimbakeshwar" },
  {
    city: "Aurangabad",
    state: "Maharashtra",
    landmark: "Ajanta & Ellora Caves",
  },
  { city: "Ahmedabad", state: "Gujarat", landmark: "Sabarmati Ashram" },
  { city: "Vadodara", state: "Gujarat", landmark: "Laxmi Vilas Palace" },
  { city: "Rann of Kutch", state: "Gujarat", landmark: "White Rann" },
  { city: "Goa", state: "Goa", landmark: "Baga & Calangute Beach" },
  { city: "Panaji", state: "Goa", landmark: "Fontainhas" },
  {
    city: "Bengaluru",
    state: "Karnataka",
    landmark: "Bangalore Palace & MG Road",
  },
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
  {
    city: "Thiruvananthapuram",
    state: "Kerala",
    landmark: "Kovalam Beach",
  },
  { city: "Varkala", state: "Kerala", landmark: "Varkala Cliff" },
  { city: "Hyderabad", state: "Telangana", landmark: "Charminar" },
  { city: "Warangal", state: "Telangana", landmark: "Warangal Fort" },
  {
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    landmark: "RK Beach",
  },
  {
    city: "Vijayawada",
    state: "Andhra Pradesh",
    landmark: "Kanaka Durga Temple",
  },
  {
    city: "Tirupati",
    state: "Andhra Pradesh",
    landmark: "Tirumala Temple",
  },
  { city: "Kolkata", state: "West Bengal", landmark: "Victoria Memorial" },
  { city: "Darjeeling", state: "West Bengal", landmark: "Tiger Hill" },
  { city: "Gangtok", state: "Sikkim", landmark: "MG Marg" },
  { city: "Bhubaneswar", state: "Odisha", landmark: "Lingaraj Temple" },
  { city: "Puri", state: "Odisha", landmark: "Jagannath Temple & Beach" },
  {
    city: "Varanasi",
    state: "Uttar Pradesh",
    landmark: "Dashashwamedh Ghat",
  },
  { city: "Lucknow", state: "Uttar Pradesh", landmark: "Bara Imambara" },
  { city: "Amritsar", state: "Punjab", landmark: "Golden Temple" },
  { city: "Chandigarh", state: "Chandigarh", landmark: "Rock Garden" },
  {
    city: "Shimla",
    state: "Himachal Pradesh",
    landmark: "The Ridge & Mall Road",
  },
  { city: "Manali", state: "Himachal Pradesh", landmark: "Solang Valley" },
  {
    city: "Dharamshala",
    state: "Himachal Pradesh",
    landmark: "McLeod Ganj",
  },
  { city: "Srinagar", state: "Jammu & Kashmir", landmark: "Dal Lake" },
  { city: "Leh", state: "Ladakh", landmark: "Leh Palace" },
  {
    city: "Rishikesh",
    state: "Uttarakhand",
    landmark: "Laxman Jhula & Ganga",
  },
  { city: "Nainital", state: "Uttarakhand", landmark: "Naini Lake" },
  { city: "Dehradun", state: "Uttarakhand", landmark: "Robber's Cave" },
  { city: "Patna", state: "Bihar", landmark: "Golghar" },
];

// ============================================================
// HOTEL DATA
// AFFORDABLE → STANDARD → PREMIUM → LUXURY
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
  "Urban",
  "Pearl",
  "Central",
  "Elite",
];

const hotelNameSuffixByCategory: Record<
  HotelProperty["category"],
  string
> = {
  Budget: "Inn",
  Standard: "Residency",
  Luxury: "Palace",
};

// 5 hotels per destination.
// This gives a wider price range:
// ₹700–₹1,499
// ₹1,500–₹2,999
// ₹3,000–₹5,999
// ₹6,000–₹10,999
// ₹11,000–₹19,999
export const allHotels: HotelProperty[] =
  famousHotelDestinations.flatMap((dest, di) => {
    const hotelLevels: {
      category: HotelProperty["category"];
      min: number;
      max: number;
    }[] = [
      {
        category: "Budget",
        min: 700,
        max: 1499,
      },
      {
        category: "Budget",
        min: 1500,
        max: 2999,
      },
      {
        category: "Standard",
        min: 3000,
        max: 5999,
      },
      {
        category: "Luxury",
        min: 6000,
        max: 10999,
      },
      {
        category: "Luxury",
        min: 11000,
        max: 19999,
      },
    ];

    return hotelLevels.map((level, ci) => {
      const idx = di * hotelLevels.length + ci;
      const h = hashString(`${dest.city}-${level.category}-${idx}`);

      const price =
        level.min +
        (h % (level.max - level.min + 1));

      const prefix =
        hotelNamePrefixes[h % hotelNamePrefixes.length];

      let suffix = hotelNameSuffixByCategory[level.category];

      if (ci === 1) {
        suffix = "Hotel";
      }

      if (ci === 2) {
        suffix = "Residency";
      }

      if (ci === 4) {
        suffix = "Grand Palace";
      }

      return {
        id: `hotel-${dest.city
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-${idx}`,

        name:
          level.category === "Luxury"
            ? `The ${prefix} ${suffix}`
            : `${prefix} ${suffix}`,

        city: dest.city,
        state: dest.state,
        area: dest.landmark,

        rating:
          level.category === "Luxury"
            ? 4.5 + (h % 5) / 10
            : level.category === "Standard"
              ? 4.0 + (h % 6) / 10
              : 3.2 + (h % 7) / 10,

        priceFrom: price,

        previewImages: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",
        ],

        amenities:
          level.category === "Luxury"
            ? [
                "Free WiFi",
                "Swimming Pool",
                "Spa",
                "Breakfast Included",
                "Valet Parking",
                "Room Service",
                "Gym",
                "Airport Transfer",
              ]
            : level.category === "Standard"
              ? [
                  "Free WiFi",
                  "Breakfast Included",
                  "AC",
                  "Room Service",
                  "Parking",
                ]
              : [
                  "Free WiFi",
                  "AC",
                  "Parking",
                  "24×7 Reception",
                ],

        category: level.category,
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
// IMPORTANT:
// SAME-CITY LOCATIONS MUST NOT SHOW HUGE RANDOM DISTANCES.
// ============================================================

export function distanceKm(
  from: Station,
  to: Station,
): number {
  if (!from || !to || from.code === to.code) {
    return 0;
  }

  const key = [from.code, to.code].sort().join("-");

  // Nearby stations / terminals in same city.
  // Keep them realistically close.
  if (
    from.city.toLowerCase() ===
    to.city.toLowerCase()
  ) {
    const h = hashString(key);

    if (
      from.locationType === "metro_station" ||
      to.locationType === "metro_station"
    ) {
      return 2 + (h % 8);
    }

    return 2 + (h % 14);
  }

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
  // TRAIN
  SL: 0.65,
  "3A": 1.35,
  "2A": 2.05,
  "1A": 4.2,
  CC: 1.25,
  EC: 1.65,
  GEN: 0.35,

  // BUS
  SEATER: 0.55,
  SLEEPER: 0.9,
  VOLVO: 1.15,

  // FLIGHT
  ECONOMY: 1,
  PREMIUM_ECONOMY: 1.55,
  BUSINESS: 3.2,

  // METRO
  TOKEN: 0.05,

  // FERRY
  DECK: 0.4,
  CABIN: 1.2,

  // HOTEL ROOMS
  BUDGET_ROOM: 1,
  STANDARD_ROOM: 1.45,
  DELUXE: 1.8,
  PREMIUM: 2.2,
  EXECUTIVE: 2.7,
  SUITE: 3.5,
  FAMILY: 2.8,
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
    220 * factor;

  const withDemand =
    raw * Math.max(0.85, demand);

  return Math.max(
    49,
    Math.round(withDemand / 10) * 10,
  );
}

// ============================================================
// MEALS
// VEG = GREEN CATEGORY
// NON-VEG = RED CATEGORY
// ============================================================

export type MealCategory = "veg" | "nonveg";

export type Meal = {
  id: string;
  name: string;
  price: number;
  category: MealCategory;
  isVeg: boolean;
};

export const meals: Meal[] = [
  // ============================================================
  // VEG MEALS
  // ============================================================

  {
    id: "veg-thali",
    name: "Veg Thali",
    price: 180,
    category: "veg",
    isVeg: true,
  },
  {
    id: "mini-veg-thali",
    name: "Mini Veg Thali",
    price: 130,
    category: "veg",
    isVeg: true,
  },
  {
    id: "premium-veg-thali",
    name: "Premium Veg Thali",
    price: 260,
    category: "veg",
    isVeg: true,
  },
  {
    id: "paneer-thali",
    name: "Paneer Thali",
    price: 220,
    category: "veg",
    isVeg: true,
  },
  {
    id: "south-indian-meal",
    name: "South Indian Meal",
    price: 170,
    category: "veg",
    isVeg: true,
  },
  {
    id: "south-indian-deluxe",
    name: "Deluxe South Indian Meal",
    price: 230,
    category: "veg",
    isVeg: true,
  },
  {
    id: "masala-dosa",
    name: "Masala Dosa Combo",
    price: 140,
    category: "veg",
    isVeg: true,
  },
  {
    id: "plain-dosa",
    name: "Plain Dosa Combo",
    price: 120,
    category: "veg",
    isVeg: true,
  },
  {
    id: "idli-sambar",
    name: "Idli Sambar",
    price: 100,
    category: "veg",
    isVeg: true,
  },
  {
    id: "vada-sambar",
    name: "Vada Sambar",
    price: 110,
    category: "veg",
    isVeg: true,
  },
  {
    id: "uttapam",
    name: "Vegetable Uttapam",
    price: 130,
    category: "veg",
    isVeg: true,
  },
  {
    id: "veg-biryani",
    name: "Veg Biryani",
    price: 160,
    category: "veg",
    isVeg: true,
  },
  {
    id: "paneer-biryani",
    name: "Paneer Biryani",
    price: 210,
    category: "veg",
    isVeg: true,
  },
  {
    id: "veg-pulao",
    name: "Vegetable Pulao",
    price: 145,
    category: "veg",
    isVeg: true,
  },
  {
    id: "jeera-rice-dal",
    name: "Jeera Rice with Dal",
    price: 150,
    category: "veg",
    isVeg: true,
  },
  {
    id: "rajma-rice",
    name: "Rajma Rice",
    price: 140,
    category: "veg",
    isVeg: true,
  },
  {
    id: "chole-rice",
    name: "Chole Rice",
    price: 145,
    category: "veg",
    isVeg: true,
  },
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    price: 150,
    category: "veg",
    isVeg: true,
  },
  {
    id: "dal-roti",
    name: "Dal Roti Meal",
    price: 130,
    category: "veg",
    isVeg: true,
  },
  {
    id: "dal-makhani-roti",
    name: "Dal Makhani Roti Combo",
    price: 170,
    category: "veg",
    isVeg: true,
  },
  {
    id: "aloo-paratha",
    name: "Aloo Paratha Combo",
    price: 125,
    category: "veg",
    isVeg: true,
  },
  {
    id: "paneer-paratha",
    name: "Paneer Paratha Combo",
    price: 160,
    category: "veg",
    isVeg: true,
  },
  {
    id: "pav-bhaji",
    name: "Pav Bhaji",
    price: 120,
    category: "veg",
    isVeg: true,
  },
  {
    id: "veg-korma-rice",
    name: "Veg Korma with Rice",
    price: 190,
    category: "veg",
    isVeg: true,
  },
  {
    id: "shahi-paneer-roti",
    name: "Shahi Paneer Roti Combo",
    price: 210,
    category: "veg",
    isVeg: true,
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka Combo",
    price: 240,
    category: "veg",
    isVeg: true,
  },
  {
    id: "veg-noodles",
    name: "Veg Hakka Noodles",
    price: 150,
    category: "veg",
    isVeg: true,
  },
  {
    id: "veg-manchurian",
    name: "Veg Manchurian Combo",
    price: 170,
    category: "veg",
    isVeg: true,
  },
  {
    id: "veg-fried-rice",
    name: "Veg Fried Rice",
    price: 150,
    category: "veg",
    isVeg: true,
  },
  {
    id: "veg-wrap",
    name: "Veg Wrap Combo",
    price: 135,
    category: "veg",
    isVeg: true,
  },
  {
    id: "grilled-veg-sandwich",
    name: "Grilled Veg Sandwich",
    price: 120,
    category: "veg",
    isVeg: true,
  },
  {
    id: "cheese-sandwich",
    name: "Cheese Sandwich",
    price: 140,
    category: "veg",
    isVeg: true,
  },
  {
    id: "veg-burger",
    name: "Veg Burger Combo",
    price: 160,
    category: "veg",
    isVeg: true,
  },
  {
    id: "veg-pizza",
    name: "Veg Pizza",
    price: 220,
    category: "veg",
    isVeg: true,
  },
  {
    id: "vegetable-snack-box",
    name: "Vegetarian Snack Box",
    price: 90,
    category: "veg",
    isVeg: true,
  },
  {
    id: "samosa-combo",
    name: "Samosa & Tea Combo",
    price: 80,
    category: "veg",
    isVeg: true,
  },
  {
    id: "kachori-combo",
    name: "Kachori & Tea Combo",
    price: 90,
    category: "veg",
    isVeg: true,
  },
  {
    id: "poha-combo",
    name: "Poha Breakfast Combo",
    price: 90,
    category: "veg",
    isVeg: true,
  },
  {
    id: "upma-combo",
    name: "Upma Breakfast Combo",
    price: 90,
    category: "veg",
    isVeg: true,
  },
  {
    id: "fresh-fruit-box",
    name: "Fresh Fruit Box",
    price: 110,
    category: "veg",
    isVeg: true,
  },
  {
    id: "fruit-salad",
    name: "Fresh Fruit Salad",
    price: 100,
    category: "veg",
    isVeg: true,
  },
  {
    id: "curd-rice",
    name: "Curd Rice",
    price: 120,
    category: "veg",
    isVeg: true,
  },
  {
    id: "lemon-rice",
    name: "Lemon Rice",
    price: 120,
    category: "veg",
    isVeg: true,
  },

  // ============================================================
  // NON-VEG MEALS
  // ============================================================

  {
    id: "chicken-thali",
    name: "Chicken Thali",
    price: 260,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "mini-chicken-thali",
    name: "Mini Chicken Thali",
    price: 220,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "premium-chicken-thali",
    name: "Premium Chicken Thali",
    price: 320,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    price: 250,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "premium-chicken-biryani",
    name: "Premium Chicken Biryani",
    price: 320,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "egg-biryani",
    name: "Egg Biryani",
    price: 190,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "mutton-biryani",
    name: "Mutton Biryani",
    price: 320,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "egg-curry-rice",
    name: "Egg Curry Rice",
    price: 190,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-curry-rice",
    name: "Chicken Curry Rice",
    price: 270,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-korma-rice",
    name: "Chicken Korma with Rice",
    price: 290,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-roti-combo",
    name: "Chicken Curry Roti Combo",
    price: 260,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-wrap",
    name: "Chicken Wrap Combo",
    price: 210,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-burger",
    name: "Chicken Burger Combo",
    price: 230,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-sandwich",
    name: "Chicken Sandwich Combo",
    price: 200,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "egg-sandwich",
    name: "Egg Sandwich Combo",
    price: 160,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-noodles",
    name: "Chicken Hakka Noodles",
    price: 220,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-fried-rice",
    name: "Chicken Fried Rice",
    price: 220,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-manchurian",
    name: "Chicken Manchurian Combo",
    price: 250,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-kebab",
    name: "Chicken Kebab Combo",
    price: 280,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka Combo",
    price: 290,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "fish-meal",
    name: "Fish Meal",
    price: 290,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "fish-curry-rice",
    name: "Fish Curry Rice",
    price: 300,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "fish-fry-combo",
    name: "Fish Fry Combo",
    price: 320,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "mutton-curry-rice",
    name: "Mutton Curry Rice",
    price: 340,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "mutton-roti-combo",
    name: "Mutton Curry Roti Combo",
    price: 350,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "egg-roll",
    name: "Egg Roll Combo",
    price: 150,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "chicken-roll",
    name: "Chicken Roll Combo",
    price: 190,
    category: "nonveg",
    isVeg: false,
  },
  {
    id: "nonveg-snack-box",
    name: "Non-Veg Snack Box",
    price: 180,
    category: "nonveg",
    isVeg: false,
  },

  // ============================================================
  // DRINKS / ADD-ONS
  // Kept as meals so existing UI does not need schema changes.
  // ============================================================

  {
    id: "tea",
    name: "Tea",
    price: 25,
    category: "veg",
    isVeg: true,
  },
  {
    id: "coffee",
    name: "Coffee",
    price: 40,
    category: "veg",
    isVeg: true,
  },
  {
    id: "masala-tea",
    name: "Masala Tea",
    price: 35,
    category: "veg",
    isVeg: true,
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    price: 80,
    category: "veg",
    isVeg: true,
  },
  {
    id: "mineral-water",
    name: "Mineral Water",
    price: 20,
    category: "veg",
    isVeg: true,
  },
  {
    id: "fresh-lime-water",
    name: "Fresh Lime Water",
    price: 50,
    category: "veg",
    isVeg: true,
  },
  {
    id: "mango-drink",
    name: "Mango Drink",
    price: 45,
    category: "veg",
    isVeg: true,
  },
  {
    id: "lassi",
    name: "Sweet Lassi",
    price: 70,
    category: "veg",
    isVeg: true,
  },
  {
    id: "buttermilk",
    name: "Buttermilk",
    price: 45,
    category: "veg",
    isVeg: true,
  },
  {
    id: "curd",
    name: "Plain Curd",
    price: 50,
    category: "veg",
    isVeg: true,
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    price: 70,
    category: "veg",
    isVeg: true,
  },
  {
    id: "rasgulla",
    name: "Rasgulla",
    price: 70,
    category: "veg",
    isVeg: true,
  },
  {
    id: "ice-cream",
    name: "Ice Cream Cup",
    price: 80,
    category: "veg",
    isVeg: true,
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
    speedKmh: 70,
    overheadMins: 8,

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

  // Nearby stations should depart normally,
  // but duration must remain short.
  const departMins =
    (slotStart + (h % 180)) %
    1440;

  let durationMins =
    Math.max(
      5,
      Math.round(
        (km / profile.speedKmh) *
          60,
      ) +
        profile.overheadMins +
        (h % 8),
    );

  // Same-city / nearby locations:
  // never allow absurd multi-hour duration.
  if (
    from.city.toLowerCase() ===
    to.city.toLowerCase()
  ) {
    if (mode === "metro") {
      durationMins = Math.min(
        durationMins,
        18,
      );
    } else {
      durationMins = Math.min(
        durationMins,
        35,
      );
    }
  }

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
    code: "BUDGET_ROOM",
    label: "Budget Room",
  },
  {
    code: "STANDARD_ROOM",
    label: "Standard Room",
  },
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
      h %
        Math.max(
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

    name: hotel.name,

    code:
      `HTL${
        1000 + (h % 8999)
      }`,

    operator:
      hotel.name,

    // Hotels intentionally have no from/to.
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
// ============================================================

function hotelLocationToStation(
  destination: HotelDestination,
): Station {
  return {
    name: destination.city,
    code:
      `HOTEL-${destination.city
        .toUpperCase()
        .replace(
          /[^A-Z0-9]+/g,
          "-",
        )}`,
    city: destination.city,
    state: destination.state,
    locationType:
      "hotel_location",
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
        ((
          hashString(
            `${destination.city}-${date
              .toISOString()
              .slice(0, 10)}`,
          ) % 40
        ) /
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
  if (!location) {
    return false;
  }

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
      route.to.code ===
        toCode,
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
