// src/lib/dummy-data.ts

// ============================================================
// TRANSIT INDIA — DUMMY / DEMO DATA ENGINE
// ============================================================

export type LocationType =
  | "train_station"
  | "bus_stand"
  | "airport"
  | "metro_station"
  | "seaport"
  | "hotel_location"
  | "cab_pickup";

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
  { name: "New Delhi Railway Station", code: "NDLS", city: "Delhi", state: "Delhi", locationType: "train_station" },
  { name: "Hazrat Nizamuddin Railway Station", code: "NZM", city: "Delhi", state: "Delhi", locationType: "train_station" },
  { name: "Anand Vihar Terminal", code: "ANVT", city: "Delhi", state: "Delhi", locationType: "train_station" },
  { name: "Jaipur Junction", code: "JP", city: "Jaipur", state: "Rajasthan", locationType: "train_station" },
  { name: "Jodhpur Junction", code: "JU", city: "Jodhpur", state: "Rajasthan", locationType: "train_station" },
  { name: "Ajmer Junction", code: "AII", city: "Ajmer", state: "Rajasthan", locationType: "train_station" },
  { name: "Kota Junction", code: "KOTA", city: "Kota", state: "Rajasthan", locationType: "train_station" },
  { name: "Udaipur City Railway Station", code: "UDZ", city: "Udaipur", state: "Rajasthan", locationType: "train_station" },
  { name: "Mumbai Central", code: "BCT", city: "Mumbai", state: "Maharashtra", locationType: "train_station" },
  { name: "Chhatrapati Shivaji Maharaj Terminus", code: "CSMT", city: "Mumbai", state: "Maharashtra", locationType: "train_station" },
  { name: "Lokmanya Tilak Terminus", code: "LTT", city: "Mumbai", state: "Maharashtra", locationType: "train_station" },
  { name: "Pune Junction", code: "PUNE", city: "Pune", state: "Maharashtra", locationType: "train_station" },
  { name: "Nagpur Junction", code: "NGP", city: "Nagpur", state: "Maharashtra", locationType: "train_station" },
  { name: "Nashik Road Railway Station", code: "NK", city: "Nashik", state: "Maharashtra", locationType: "train_station" },
  { name: "Ahmedabad Junction", code: "ADI", city: "Ahmedabad", state: "Gujarat", locationType: "train_station" },
  { name: "Vadodara Junction", code: "BRC", city: "Vadodara", state: "Gujarat", locationType: "train_station" },
  { name: "Surat Railway Station", code: "ST", city: "Surat", state: "Gujarat", locationType: "train_station" },
  { name: "Rajkot Junction", code: "RJT", city: "Rajkot", state: "Gujarat", locationType: "train_station" },
  { name: "Lucknow Charbagh Railway Station", code: "LKO", city: "Lucknow", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Kanpur Central", code: "CNB", city: "Kanpur", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Varanasi Junction", code: "BSB", city: "Varanasi", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Prayagraj Junction", code: "PRYJ", city: "Prayagraj", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Agra Cantt", code: "AGC", city: "Agra", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Gorakhpur Junction", code: "GKP", city: "Gorakhpur", state: "Uttar Pradesh", locationType: "train_station" },
  { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal", locationType: "train_station" },
  { name: "Sealdah Railway Station", code: "SDAH", city: "Kolkata", state: "West Bengal", locationType: "train_station" },
  { name: "Durgapur Railway Station", code: "DGR", city: "Durgapur", state: "West Bengal", locationType: "train_station" },
  { name: "Patna Junction", code: "PNBE", city: "Patna", state: "Bihar", locationType: "train_station" },
  { name: "Gaya Junction", code: "GAYA", city: "Gaya", state: "Bihar", locationType: "train_station" },
  { name: "Muzaffarpur Junction", code: "MFP", city: "Muzaffarpur", state: "Bihar", locationType: "train_station" },
  { name: "Ranchi Junction", code: "RNC", city: "Ranchi", state: "Jharkhand", locationType: "train_station" },
  { name: "Dhanbad Junction", code: "DHN", city: "Dhanbad", state: "Jharkhand", locationType: "train_station" },
  { name: "Bhopal Junction", code: "BPL", city: "Bhopal", state: "Madhya Pradesh", locationType: "train_station" },
  { name: "Indore Junction", code: "INDB", city: "Indore", state: "Madhya Pradesh", locationType: "train_station" },
  { name: "Gwalior Junction", code: "GWL", city: "Gwalior", state: "Madhya Pradesh", locationType: "train_station" },
  { name: "Raipur Junction", code: "R", city: "Raipur", state: "Chhattisgarh", locationType: "train_station" },
  { name: "Bilaspur Junction", code: "BSP", city: "Bilaspur", state: "Chhattisgarh", locationType: "train_station" },
  { name: "Chandigarh Railway Station", code: "CDG", city: "Chandigarh", state: "Chandigarh", locationType: "train_station" },
  { name: "Amritsar Junction", code: "ASR", city: "Amritsar", state: "Punjab", locationType: "train_station" },
  { name: "Ludhiana Junction", code: "LDH", city: "Ludhiana", state: "Punjab", locationType: "train_station" },
  { name: "Ambala Cantt", code: "UMB", city: "Ambala", state: "Haryana", locationType: "train_station" },
  { name: "Gurugram Railway Station", code: "GGN", city: "Gurugram", state: "Haryana", locationType: "train_station" },
  { name: "Jammu Tawi", code: "JAT", city: "Jammu", state: "Jammu & Kashmir", locationType: "train_station" },
  { name: "Srinagar Railway Station", code: "SINA", city: "Srinagar", state: "Jammu & Kashmir", locationType: "train_station" },
  { name: "Shimla Railway Station", code: "SML", city: "Shimla", state: "Himachal Pradesh", locationType: "train_station" },
  { name: "Bhubaneswar Railway Station", code: "BBS", city: "Bhubaneswar", state: "Odisha", locationType: "train_station" },
  { name: "Cuttack Railway Station", code: "CTC", city: "Cuttack", state: "Odisha", locationType: "train_station" },
  { name: "Guwahati Railway Station", code: "GHY", city: "Guwahati", state: "Assam", locationType: "train_station" },
  { name: "Dibrugarh Railway Station", code: "DBRG", city: "Dibrugarh", state: "Assam", locationType: "train_station" },
  { name: "Secunderabad Junction", code: "SC", city: "Hyderabad", state: "Telangana", locationType: "train_station" },
  { name: "Hyderabad Deccan", code: "HYB", city: "Hyderabad", state: "Telangana", locationType: "train_station" },
  { name: "KSR Bengaluru", code: "SBC", city: "Bengaluru", state: "Karnataka", locationType: "train_station" },
  { name: "Yesvantpur Junction", code: "YPR", city: "Bengaluru", state: "Karnataka", locationType: "train_station" },
  { name: "Mysuru Junction", code: "MYS", city: "Mysuru", state: "Karnataka", locationType: "train_station" },
  { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu", locationType: "train_station" },
  { name: "Coimbatore Junction", code: "CBE", city: "Coimbatore", state: "Tamil Nadu", locationType: "train_station" },
  { name: "Madurai Junction", code: "MDU", city: "Madurai", state: "Tamil Nadu", locationType: "train_station" },
  { name: "Ernakulam Junction", code: "ERS", city: "Kochi", state: "Kerala", locationType: "train_station" },
  { name: "Thiruvananthapuram Central", code: "TVC", city: "Thiruvananthapuram", state: "Kerala", locationType: "train_station" },
  { name: "Kozhikode Railway Station", code: "CLT", city: "Kozhikode", state: "Kerala", locationType: "train_station" },
  { name: "Vijayawada Junction", code: "BZA", city: "Vijayawada", state: "Andhra Pradesh", locationType: "train_station" },
  { name: "Visakhapatnam Railway Station", code: "VSKP", city: "Visakhapatnam", state: "Andhra Pradesh", locationType: "train_station" },
  { name: "Tirupati Railway Station", code: "TPTY", city: "Tirupati", state: "Andhra Pradesh", locationType: "train_station" },
  { name: "Madgaon Junction", code: "MAO", city: "Madgaon", state: "Goa", locationType: "train_station" },
  { name: "Vasco Da Gama Railway Station", code: "VSG", city: "Vasco", state: "Goa", locationType: "train_station" },
  { name: "Ratnagiri Railway Station", code: "RN", city: "Ratnagiri", state: "Maharashtra", locationType: "train_station" },
  { name: "Karmali Railway Station", code: "KRMI", city: "Karmali", state: "Goa", locationType: "train_station" },
];

// ============================================================
// BUS STANDS
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
  { name: "Bhopal ISBT", code: "BPLB", city: "Bhopal", state: "Madhya Pradesh", locationType: "bus_stand" },
  { name: "Indore Sarwate Bus Stand", code: "ISB", city: "Indore", state: "Madhya Pradesh", locationType: "bus_stand" },
  { name: "Chandigarh ISBT Sector 43", code: "CIS", city: "Chandigarh", state: "Chandigarh", locationType: "bus_stand" },
  { name: "Amritsar Bus Stand", code: "ASB", city: "Amritsar", state: "Punjab", locationType: "bus_stand" },
  { name: "Ranchi Khadgarha Bus Stand", code: "RKB", city: "Ranchi", state: "Jharkhand", locationType: "bus_stand" },
  { name: "Bhubaneswar Baramunda Bus Stand", code: "BBSB", city: "Bhubaneswar", state: "Odisha", locationType: "bus_stand" },
  { name: "Guwahati ISBT", code: "GIS", city: "Guwahati", state: "Assam", locationType: "bus_stand" },
  { name: "Pune Hinjewadi Bus Terminal", code: "PHB", city: "Pune", state: "Maharashtra", locationType: "bus_stand" },
  { name: "Coimbatore Gandhipuram Bus Stand", code: "CGB", city: "Coimbatore", state: "Tamil Nadu", locationType: "bus_stand" },
  { name: "Vijayawada PNBS", code: "VPB", city: "Vijayawada", state: "Andhra Pradesh", locationType: "bus_stand" },
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
  { name: "Nagpur Dr. Babasaheb Ambedkar International Airport", code: "NAG", city: "Nagpur", state: "Maharashtra", locationType: "airport" },
  { name: "Mangalore International Airport", code: "IXE", city: "Mangaluru", state: "Karnataka", locationType: "airport" },
];

// ============================================================
// METRO STATIONS — SEPARATE FROM TRAIN ROUTES
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
  { name: "Andheri Metro Station", code: "MMA", city: "Mumbai", state: "Maharashtra", locationType: "metro_station" },
  { name: "Ghatkopar Metro Station", code: "MMG", city: "Mumbai", state: "Maharashtra", locationType: "metro_station" },
  { name: "Dahisar East Metro Station", code: "MDE", city: "Mumbai", state: "Maharashtra", locationType: "metro_station" },
  { name: "Majestic Metro Station", code: "MBM", city: "Bengaluru", state: "Karnataka", locationType: "metro_station" },
  { name: "MG Road Metro Station", code: "MMGR", city: "Bengaluru", state: "Karnataka", locationType: "metro_station" },
  { name: "Esplanade Metro Station", code: "KES", city: "Kolkata", state: "West Bengal", locationType: "metro_station" },
  { name: "Park Street Metro Station", code: "KPS", city: "Kolkata", state: "West Bengal", locationType: "metro_station" },
  { name: "Ameerpet Metro Station", code: "HAM", city: "Hyderabad", state: "Telangana", locationType: "metro_station" },
  { name: "Miyapur Metro Station", code: "HMM", city: "Hyderabad", state: "Telangana", locationType: "metro_station" },
  { name: "Chennai Central Metro Station", code: "CMC", city: "Chennai", state: "Tamil Nadu", locationType: "metro_station" },
  { name: "Airport Metro Station Chennai", code: "CMA", city: "Chennai", state: "Tamil Nadu", locationType: "metro_station" },
  { name: "Aluva Metro Station", code: "KMA", city: "Kochi", state: "Kerala", locationType: "metro_station" },
  { name: "Maharaja's College Metro Station", code: "KMC", city: "Kochi", state: "Kerala", locationType: "metro_station" },
  { name: "Civil Lines Metro Station", code: "MCL", city: "Jaipur", state: "Rajasthan", locationType: "metro_station" },
  { name: "Chandpole Metro Station", code: "MCP", city: "Jaipur", state: "Rajasthan", locationType: "metro_station" },
  { name: "Vastral Gam Metro Station", code: "MVG", city: "Ahmedabad", state: "Gujarat", locationType: "metro_station" },
  { name: "Thaltej Metro Station", code: "MTT", city: "Ahmedabad", state: "Gujarat", locationType: "metro_station" },
  { name: "Motera Stadium Metro Station", code: "MMS", city: "Ahmedabad", state: "Gujarat", locationType: "metro_station" },
  { name: "Nagpur Airport Metro Station", code: "MNA", city: "Nagpur", state: "Maharashtra", locationType: "metro_station" },
  { name: "Sitabuldi Metro Station", code: "MSB", city: "Nagpur", state: "Maharashtra", locationType: "metro_station" },
  { name: "Hinjewadi Metro Station", code: "MHM", city: "Pune", state: "Maharashtra", locationType: "metro_station" },
  { name: "Civil Court Metro Station", code: "MCC", city: "Pune", state: "Maharashtra", locationType: "metro_station" },
];

// ============================================================
// FERRY / SEAPORTS
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
  { name: "Vasco Ferry Terminal", code: "VFT-F", city: "Vasco", state: "Goa", locationType: "seaport" },
  { name: "Betul Ferry Terminal", code: "BET-F", city: "Goa", state: "Goa", locationType: "seaport" },
  { name: "Nerul Ferry Terminal", code: "NER-F", city: "Goa", state: "Goa", locationType: "seaport" },
  { name: "Dona Paula Ferry Terminal", code: "DPA-F", city: "Panaji", state: "Goa", locationType: "seaport" },
  { name: "Alappuzha Finishing Point", code: "AFP-F", city: "Alappuzha", state: "Kerala", locationType: "seaport" },
  { name: "Kumarakom Boat Jetty", code: "KUM-F", city: "Kumarakom", state: "Kerala", locationType: "seaport" },
  { name: "Kollam Boat Jetty", code: "KOL-F", city: "Kollam", state: "Kerala", locationType: "seaport" },
  { name: "Andaman Havelock Jetty", code: "HAV-F", city: "Swaraj Dweep", state: "Andaman & Nicobar Islands", locationType: "seaport" },
];

// ============================================================
// CABBER LOCATIONS
// ============================================================

export const cabLocations: Station[] = [
  { name: "Connaught Place", code: "CAB-CP", city: "Delhi", state: "Delhi", locationType: "cab_pickup" },
  { name: "Saket", code: "CAB-SKT", city: "Delhi", state: "Delhi", locationType: "cab_pickup" },
  { name: "Dwarka", code: "CAB-DWK", city: "Delhi", state: "Delhi", locationType: "cab_pickup" },
  { name: "Gurugram Cyber City", code: "CAB-GGN", city: "Gurugram", state: "Haryana", locationType: "cab_pickup" },
  { name: "Noida Sector 62", code: "CAB-N62", city: "Noida", state: "Uttar Pradesh", locationType: "cab_pickup" },
  { name: "Jaipur C-Scheme", code: "CAB-JCS", city: "Jaipur", state: "Rajasthan", locationType: "cab_pickup" },
  { name: "Mumbai Andheri", code: "CAB-MAN", city: "Mumbai", state: "Maharashtra", locationType: "cab_pickup" },
  { name: "Mumbai Bandra", code: "CAB-MBA", city: "Mumbai", state: "Maharashtra", locationType: "cab_pickup" },
  { name: "Pune Koregaon Park", code: "CAB-PKP", city: "Pune", state: "Maharashtra", locationType: "cab_pickup" },
  { name: "Ahmedabad Navrangpura", code: "CAB-ANP", city: "Ahmedabad", state: "Gujarat", locationType: "cab_pickup" },
  { name: "Lucknow Gomti Nagar", code: "CAB-LGN", city: "Lucknow", state: "Uttar Pradesh", locationType: "cab_pickup" },
  { name: "Kolkata Salt Lake", code: "CAB-KSL", city: "Kolkata", state: "West Bengal", locationType: "cab_pickup" },
  { name: "Patna Boring Road", code: "CAB-PBR", city: "Patna", state: "Bihar", locationType: "cab_pickup" },
  { name: "Bengaluru Indiranagar", code: "CAB-BIN", city: "Bengaluru", state: "Karnataka", locationType: "cab_pickup" },
  { name: "Chennai T Nagar", code: "CAB-CTN", city: "Chennai", state: "Tamil Nadu", locationType: "cab_pickup" },
  { name: "Hyderabad Banjara Hills", code: "CAB-HBH", city: "Hyderabad", state: "Telangana", locationType: "cab_pickup" },
  { name: "Kochi Kakkanad", code: "CAB-KKA", city: "Kochi", state: "Kerala", locationType: "cab_pickup" },
  { name: "Bhopal MP Nagar", code: "CAB-BMP", city: "Bhopal", state: "Madhya Pradesh", locationType: "cab_pickup" },
  { name: "Indore Vijay Nagar", code: "CAB-IVN", city: "Indore", state: "Madhya Pradesh", locationType: "cab_pickup" },
  { name: "Chandigarh Sector 17", code: "CAB-C17", city: "Chandigarh", state: "Chandigarh", locationType: "cab_pickup" },
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
  ...cabLocations,
];

// ============================================================
// SUGGESTIONS / CLASSES / TIME
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
  "Book a cab from my home to New Delhi Railway Station",
  "Hotel near Connaught Place under ₹5000",
];

export const travelClasses = [
  { code: "ALL", label: "All classes" },
  { code: "SL", label: "Sleeper" },
  { code: "3A", label: "AC 3-Tier" },
  { code: "2A", label: "AC 2-Tier" },
  { code: "1A", label: "AC First" },
  { code: "CC", label: "AC Chair" },
  { code: "EC", label: "Exec. Chair" },
];

export const timeSlots = [
  { id: "early", label: "Early", range: "00:00 – 06:00" },
  { id: "morning", label: "Morning", range: "06:00 – 12:00" },
  { id: "afternoon", label: "Afternoon", range: "12:00 – 18:00" },
  { id: "night", label: "Night", range: "18:00 – 24:00" },
];

export const popularStationCodes = [
  "NDLS", "BCT", "MAS", "HWH", "SBC", "SC", "JP", "PUNE", "ADI", "LKO",
];

// ============================================================
// HELPERS
// ============================================================

export function stationByCode(code?: string, fallback = "NDLS"): Station {
  return (
    stations.find((station) => station.code === code) ??
    stations.find((station) => station.code === fallback) ??
    stations[0]
  );
}

export type TransportMode =
  | "train"
  | "bus"
  | "flight"
  | "hotel"
  | "metro"
  | "ferry"
  | "cabber";

export const transportModes: { id: TransportMode; label: string }[] = [
  { id: "train", label: "Trains" },
  { id: "bus", label: "Buses" },
  { id: "flight", label: "Flights" },
  { id: "hotel", label: "Hotels" },
  { id: "metro", label: "Metro" },
  { id: "ferry", label: "Ferries" },
  { id: "cabber", label: "Cabber" },
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export type RouteDef = {
  from: Station;
  to: Station;
};

function explicitRoutes(
  locations: Station[],
  pairs: [number, number][],
): RouteDef[] {
  return pairs
    .filter(([a, b]) => locations[a] !== undefined && locations[b] !== undefined && a !== b)
    .map(([a, b]) => ({ from: locations[a], to: locations[b] }));
}

// ============================================================
// MODE-SPECIFIC ROUTES
// Every mode has its own independent route list.
// ============================================================

export const trainRoutes: RouteDef[] = explicitRoutes(trainStations, [
  [0, 3], [0, 8], [0, 14], [0, 18], [0, 23], [0, 27], [0, 30], [0, 37],
  [0, 42], [0, 49], [0, 53], [0, 57], [3, 4], [3, 5], [3, 6], [3, 7],
  [8, 11], [8, 12], [8, 13], [8, 14], [11, 14], [11, 12], [14, 15],
  [15, 16], [16, 17], [18, 19], [19, 20], [20, 21], [23, 20], [20, 27],
  [27, 28], [27, 29], [30, 32], [32, 33], [37, 38], [38, 39], [38, 40],
  [42, 43], [43, 44], [45, 46], [46, 47], [49, 50], [50, 51], [53, 54],
  [54, 55], [55, 56], [57, 58], [58, 59], [60, 61], [61, 62], [63, 64],
]);

export const busRoutes: RouteDef[] = explicitRoutes(busStands, [
  [0, 2], [0, 10], [0, 13], [0, 15], [0, 16], [0, 17], [1, 3], [1, 4],
  [2, 3], [2, 5], [2, 8], [3, 5], [5, 6], [6, 7], [6, 8], [8, 9],
  [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
  [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23],
  [23, 24], [24, 25], [25, 26], [26, 27], [27, 28], [28, 29], [29, 20],
]);

export const flightRoutes: RouteDef[] = explicitRoutes(airports, [
  [0, 3], [0, 1], [0, 5], [0, 7], [0, 10], [0, 11], [0, 15], [0, 17],
  [0, 22], [0, 24], [0, 27], [0, 30], [0, 32], [0, 33], [3, 4], [3, 5],
  [3, 10], [3, 22], [3, 24], [3, 27], [3, 30], [5, 6], [5, 14], [7, 8],
  [10, 11], [10, 22], [11, 12], [14, 22], [17, 22], [22, 23], [22, 24],
  [22, 27], [23, 24], [24, 25], [24, 27], [27, 28], [27, 29], [30, 31],
  [32, 33],
]);

export const metroRoutes: RouteDef[] = explicitRoutes(metroStations, [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [5, 6], [6, 7],
  [8, 9], [9, 10], [11, 12], [13, 14], [15, 16], [17, 18], [19, 20],
  [21, 22], [22, 21], [23, 24], [24, 25], [25, 26], [26, 27],
  [28, 29], [29, 28], [27, 28], [21, 23], [23, 21], [2, 3], [3, 4],
  [4, 0], [9, 8], [12, 11],
]);

export const ferryRoutes: RouteDef[] = explicitRoutes(seaports, [
  [0, 1], [1, 0], [0, 2], [2, 0], [3, 4], [4, 3], [5, 6], [6, 5],
  [7, 3], [8, 9], [9, 8], [10, 11], [11, 10], [12, 13], [13, 12],
  [14, 15], [15, 14], [16, 17], [17, 16], [17, 18], [18, 16],
  [8, 19], [19, 8], [10, 17], [3, 12], [12, 14], [14, 3],
]);

export const cabRoutes: RouteDef[] = explicitRoutes(cabLocations, [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 2], [1, 3], [1, 4],
  [2, 0], [2, 3], [2, 4], [3, 0], [3, 1], [3, 4], [4, 0], [4, 1],
  [5, 0], [5, 6], [5, 7], [5, 8], [6, 7], [6, 8], [7, 6], [7, 8],
  [8, 6], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14],
  [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 13],
]);

export const modeRoutes: Record<Exclude<TransportMode, "hotel">, RouteDef[]> = {
  train: trainRoutes,
  bus: busRoutes,
  flight: flightRoutes,
  metro: metroRoutes,
  ferry: ferryRoutes,
  cabber: cabRoutes,
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
// HOTEL DATA — 4 HOTELS PER DESTINATION
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
  "Grand", "Royal", "Heritage", "Comfort", "City",
  "Sunrise", "Imperial", "Regal", "Urban", "Central",
];

const hotelNameSuffixByCategory: Record<HotelProperty["category"], string> = {
  Budget: "Inn",
  Standard: "Residency",
  Luxury: "Palace",
};

export const allHotels: HotelProperty[] = famousHotelDestinations.flatMap((dest, di) => {
  const categories: HotelProperty["category"][] = ["Budget", "Standard", "Luxury", "Standard"];

  return categories.map((cat, ci) => {
    const idx = di * 4 + ci;
    const h = hashString(`${dest.city}-${cat}-${idx}`);
    const priceBase = cat === "Budget" ? 1200 : cat === "Standard" ? 2800 : 6500;
    const price = priceBase + (h % 1800);
    const prefix = hotelNamePrefixes[h % hotelNamePrefixes.length];
    const uniqueSuffix = ci === 3 ? "Suites" : hotelNameSuffixByCategory[cat];

    return {
      id: `hotel-${dest.city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${idx}`,
      name: cat === "Luxury" ? `The ${prefix} ${uniqueSuffix}` : `${prefix} ${uniqueSuffix}`,
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
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",
      ],
      amenities:
        cat === "Luxury"
          ? ["Free WiFi", "Swimming Pool", "Spa", "Breakfast Included", "Valet Parking", "Room Service"]
          : cat === "Standard"
            ? ["Free WiFi", "Breakfast Included", "AC", "Room Service"]
            : ["Free WiFi", "AC", "Parking"],
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
// DISTANCE / DEMAND / FARE
// ============================================================

export function distanceKm(from: Station, to: Station): number {
  if (!from || !to || from.code === to.code) return 0;
  const key = [from.code, to.code].sort().join("-");
  return 80 + (hashString(key) % 1800);
}

export function demandIndex(from: Station, to: Station, date: Date): number {
  const key = `${from.code}-${to.code}-${date.toISOString().slice(0, 10)}`;
  const base = 1 + (hashString(key) % 40) / 100;
  return Math.round(base * 100) / 100;
}

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
  MINI: 0.8,
  SEDAN: 1,
  SUV: 1.35,
  XL: 1.7,
};

function classFareFactor(code: string): number {
  return classFareFactors[code] ?? 1;
}

export function computeFare(km: number, code: string, demand: number, multiplier = 1): number {
  const factor = classFareFactor(code) * multiplier;
  const raw = km * 1.1 * factor + 120 * factor;
  const withDemand = raw * Math.max(0.8, demand);
  return Math.max(49, Math.round(withDemand / 10) * 10);
}

// ============================================================
// MEALS
// ============================================================

export const meals = [
  { id: "veg-thali", name: "Veg Thali", price: 180 },
  { id: "nonveg-thali", name: "Non-Veg Thali", price: 220 },
  { id: "sandwich", name: "Sandwich Combo", price: 120 },
  { id: "biryani", name: "Chicken Biryani", price: 250 },
  { id: "snack-box", name: "Snack Box", price: 90 },
];

// ============================================================
// SEAT AVAILABILITY
// ============================================================

export type SeatTone = "available" | "low" | "rac" | "wl" | "sold";

export function seatState(
  key: string,
  availableBase: number,
  tick: number,
  opts?: { racWl?: boolean },
): { tone: SeatTone; label: string } {
  const h = hashString(`${key}:${tick}`);
  const avail = Math.max(0, availableBase - (h % (availableBase + 3)));

  if (avail <= 0) {
    if (opts?.racWl && h % 5 !== 0) {
      const isRac = h % 2 === 0;
      return isRac
        ? { tone: "rac", label: `RAC ${1 + (h % 20)}` }
        : { tone: "wl", label: `WL ${1 + (h % 40)}` };
    }
    return { tone: "sold", label: "Sold Out" };
  }

  if (avail <= 3) return { tone: "low", label: `Only ${avail} left` };
  return { tone: "available", label: `${avail} available` };
}

// ============================================================
// SERVICE / SEATS
// ============================================================

export function serviceDisruption(id: string): {
  cancelled: boolean;
  delayMins: number;
  reason: string;
} {
  const h = hashString(id);

  if (h % 23 === 0) {
    return { cancelled: true, delayMins: 0, reason: "Operational constraints" };
  }

  if (h % 7 === 0) {
    return { cancelled: false, delayMins: 15 + (h % 60), reason: "Traffic congestion" };
  }

  return { cancelled: false, delayMins: 0, reason: "" };
}

export function allocateSeats(
  pnr: string,
  mode: TransportMode,
  classCode: string,
  paxCount: number,
): string[] {
  const seats: string[] = [];
  const h = hashString(pnr + mode + classCode);
  const rowLetters = "ABCDEF";

  for (let i = 0; i < Math.max(1, paxCount); i++) {
    const seatNum = 1 + ((h + i * 7) % 72);
    const letter = rowLetters[(h + i) % rowLetters.length];
    seats.push(`${letter}${seatNum}`);
  }

  return seats;
}

// ============================================================
// TIME HELPERS
// ============================================================

function slotStartMinutes(slot: string): number {
  switch (slot) {
    case "early": return 0;
    case "morning": return 360;
    case "afternoon": return 720;
    case "night": return 1080;
    default: return 360;
  }
}

function timeFromMinutes(mins: number): string {
  const normalized = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const period = h >= 12 ? "PM" : "AM";
  let hh = h % 12;
  if (hh === 0) hh = 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ============================================================
// MODE PROFILES
// ============================================================

type ClassDef = {
  code: string;
  label: string;
};

type ModeProfile = {
  speedKmh: number;
  overheadMins: number;
  namePool: string[];
  codePrefix: string;
  classCodes: ClassDef[];
  tagsPool: string[];
  hasOperatorName: boolean;
};

const modeProfiles: Record<Exclude<TransportMode, "hotel">, ModeProfile> = {
  train: {
    speedKmh: 55,
    overheadMins: 10,
    namePool: [
      "Rajdhani Express", "Shatabdi Express", "Duronto Express",
      "Garib Rath Express", "Humsafar Express", "Sampark Kranti Express",
      "Jan Shatabdi Express", "Superfast Mail Express", "Vande Bharat Express",
    ],
    codePrefix: "1",
    classCodes: [
      { code: "SL", label: "Sleeper" },
      { code: "3A", label: "AC 3-Tier" },
      { code: "2A", label: "AC 2-Tier" },
      { code: "1A", label: "AC First" },
      { code: "CC", label: "AC Chair" },
    ],
    tagsPool: ["Superfast", "Pantry Car", "E-Catering", "Vande Bharat"],
    hasOperatorName: false,
  },

  bus: {
    speedKmh: 45,
    overheadMins: 5,
    namePool: [
      "Volvo Multi-Axle", "Rajasthan Roadways", "IntrCity SmartBus",
      "Neeta Travels", "Orange Tours", "VRL Travels", "RedBus Premium",
    ],
    codePrefix: "BUS",
    classCodes: [
      { code: "SEATER", label: "AC Seater" },
      { code: "SLEEPER", label: "AC Sleeper" },
    ],
    tagsPool: ["Volvo A/C", "Live Tracking", "Charging Point", "Water Bottle"],
    hasOperatorName: true,
  },

  flight: {
    speedKmh: 700,
    overheadMins: 45,
    namePool: ["IndiGo", "Air India", "Vistara", "SpiceJet", "Akasa Air", "Air India Express"],
    codePrefix: "FLT",
    classCodes: [
      { code: "ECONOMY", label: "Economy" },
      { code: "PREMIUM_ECONOMY", label: "Premium Economy" },
      { code: "BUSINESS", label: "Business" },
    ],
    tagsPool: ["Non-stop", "Free Meal", "On-time Performance"],
    hasOperatorName: true,
  },

  metro: {
    speedKmh: 33,
    overheadMins: 2,
    namePool: [
      "Blue Line", "Yellow Line", "Red Line", "Violet Line",
      "Pink Line", "Aqua Line", "Purple Line", "Green Line",
    ],
    codePrefix: "MTR",
    classCodes: [{ code: "TOKEN", label: "Token" }],
    tagsPool: ["Every 5 min", "Every 8 min", "Air Conditioned", "Smart Card"],
    hasOperatorName: false,
  },

  ferry: {
    speedKmh: 28,
    overheadMins: 10,
    namePool: ["Coastal Cruiser", "Harbour Express", "Island Hopper", "SeaLink Ferry", "Water Metro"],
    codePrefix: "FRY",
    classCodes: [
      { code: "DECK", label: "Deck Class" },
      { code: "CABIN", label: "Cabin" },
    ],
    tagsPool: ["Life Jackets Provided", "Onboard Cafe", "Scenic Route", "Weather Monitoring"],
    hasOperatorName: true,
  },

  cabber: {
    speedKmh: 32,
    overheadMins: 8,
    namePool: ["Transit India Cabber", "Cabber Go", "City Cabber", "Transit Premium Cabber"],
    codePrefix: "CAB",
    classCodes: [
      { code: "MINI", label: "Mini" },
      { code: "SEDAN", label: "Sedan" },
      { code: "SUV", label: "SUV" },
      { code: "XL", label: "Cabber XL" },
    ],
    tagsPool: ["Doorstep Pickup", "Live Driver Tracking", "Verified Driver", "Cashless Ride"],
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
  const profile = modeProfiles[mode];
  const h = hashString(seed);
  const slotStart = slotStartMinutes(slot);
  const departMins = (slotStart + (h % 300)) % 1440;

  const durationMins = Math.max(
    mode === "metro" ? 8 : mode === "cabber" ? 10 : 20,
    Math.round((km / profile.speedKmh) * 60) + profile.overheadMins + (h % 20),
  );

  const arriveMins = departMins + durationMins;
  const name = profile.namePool[h % profile.namePool.length];
  const code = `${profile.codePrefix}${1000 + (h % 8999)}`;
  const operator = profile.hasOperatorName ? name : undefined;

  const options = profile.classCodes.map((cls) => {
    const availSeed = hashString(`${seed}-${cls.code}`);
    const available = 5 + (availSeed % 60);

    // Cabber fares are intentionally lower for short-distance city travel.
    const fare =
      mode === "cabber"
        ? Math.max(99, Math.round((km * 12 * classFareFactor(cls.code) + 50) / 10) * 10)
        : computeFare(km, cls.code, demand);

    const probability = mode === "metro"
      ? 100
      : Math.max(15, 100 - (availSeed % 100));

    return {
      code: cls.code,
      label: cls.label,
      fare,
      available,
      probability,
    };
  });

  const tags = [profile.tagsPool[h % profile.tagsPool.length]];

  if (mode === "flight" && h % 3 === 0) tags.push("1 stop");
  if (mode === "cabber") tags.push("Pickup available now");

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
    depart: timeFromMinutes(departMins),
    arrive: timeFromMinutes(arriveMins),
    durationMins,
    duration: formatDuration(durationMins),
    distanceKm: km,
    tags,
    options,
  };
}

// ============================================================
// HOTEL ROOM TYPES
// ============================================================

const hotelRoomTypes: ClassDef[] = [
  { code: "DELUXE", label: "Deluxe Room" },
  { code: "PREMIUM", label: "Premium Room" },
  { code: "EXECUTIVE", label: "Executive Room" },
  { code: "SUITE", label: "Family Suite" },
];

function buildHotelSegment(
  location: Station,
  demand: number,
  index: number,
  seed: string,
): Segment {
  const h = hashString(seed);
  const hotelCandidates = allHotels.filter((hotel) => hotel.city === location.city);

  const hotel = hotelCandidates[h % Math.max(1, hotelCandidates.length)];

  const options = hotelRoomTypes.map((rt) => {
    const availSeed = hashString(`${seed}-${rt.code}`);
    const available = 1 + (availSeed % 12);

    const fare = computeFare(120, rt.code, demand);
    const probability = Math.max(20, 100 - (availSeed % 80));

    return {
      code: rt.code,
      label: rt.label,
      fare,
      available,
      probability,
    };
  });

  return {
    id: `hotel-${hotel.id}-${index}-${h}`,
    mode: "hotel",
    name: hotel.name,
    code: `HTL${1000 + (h % 8999)}`,
    operator: hotel.name,
    // Hotels intentionally have NO from/to.
    depart: "2:00 PM",
    arrive: "11:00 AM",
    durationMins: 1260,
    duration: "1 Night",
    distanceKm: 0,
    tags: h % 2 === 0
      ? ["Free Cancellation", "Breakfast Included"]
      : ["Free Cancellation"],
    options,
  };
}

function hotelLocationToStation(destination: HotelDestination): Station {
  return {
    name: destination.city,
    code: `HOTEL-${destination.city.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`,
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

  if (mode === "hotel") {
    const safeCount = Math.max(0, count);
    const destinationSeed = hashString(`${seed}-${date.toISOString().slice(0, 10)}`);

    for (let i = 0; i < safeCount; i++) {
      const destination =
        famousHotelDestinations[(destinationSeed + i) % famousHotelDestinations.length];

      const location = hotelLocationToStation(destination);

      const demand =
        1 +
        (hashString(`${destination.city}-${date.toISOString().slice(0, 10)}`) % 40) / 100;

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

  const demand = demandIndex(from, to, date);
  const km = distanceKm(from, to);

  for (let i = 0; i < Math.max(0, count); i++) {
    const localSeed = `${seed}-${mode}-${from.code}-${to.code}-${i}`;

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

export function locationsForMode(mode: TransportMode): Station[] {
  switch (mode) {
    case "train": return trainStations;
    case "bus": return busStands;
    case "flight": return airports;
    case "metro": return metroStations;
    case "ferry": return seaports;
    case "cabber": return cabLocations;
    case "hotel": return famousHotelDestinations.map(hotelLocationToStation);
    default: return [];
  }
}

// ============================================================
// VALIDATE LOCATION
// ============================================================

export function isValidLocationForMode(
  mode: TransportMode,
  location?: Station,
): boolean {
  if (!location) return false;

  const expected: LocationType =
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
              : mode === "cabber"
                ? "cab_pickup"
                : "hotel_location";

  return location.locationType === expected;
}

// ============================================================
// ROUTE HELPERS
// ============================================================

export function findRoute(
  mode: Exclude<TransportMode, "hotel">,
  fromCode: string,
  toCode: string,
): RouteDef | undefined {
  return modeRoutes[mode].find(
    (route) => route.from.code === fromCode && route.to.code === toCode,
  );
}

export function routesForMode(
  mode: Exclude<TransportMode, "hotel">,
): RouteDef[] {
  return modeRoutes[mode];
}

export function destinationsFrom(
  mode: Exclude<TransportMode, "hotel">,
  fromCode: string,
): Station[] {
  return modeRoutes[mode]
    .filter((route) => route.from.code === fromCode)
    .map((route) => route.to);
}

export function originsTo(
  mode: Exclude<TransportMode, "hotel">,
  toCode: string,
): Station[] {
  return modeRoutes[mode]
    .filter((route) => route.to.code === toCode)
    .map((route) => route.from);
}

// ============================================================
// CABBER-SPECIFIC HELPERS
// ============================================================

export function cabberLocations(): Station[] {
  return cabLocations;
}

export function cabberRoutes(): RouteDef[] {
  return cabRoutes;
}
