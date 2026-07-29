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

export type Station = { name: string; code: string; city: string; state: string };

export const stations: Station[] = [
  { name: "New Delhi", code: "NDLS", city: "Delhi", state: "Delhi" },
  { name: "Old Delhi", code: "DLI", city: "Delhi", state: "Delhi" },
  { name: "Hazrat Nizamuddin", code: "NZM", city: "Delhi", state: "Delhi" },
  { name: "Delhi Sarai Rohilla", code: "DEE", city: "Delhi", state: "Delhi" },
  { name: "Anand Vihar Terminal", code: "ANVT", city: "Delhi", state: "Delhi" },
  { name: "Mumbai Central", code: "BCT", city: "Mumbai", state: "Maharashtra" },
  { name: "Chhatrapati Shivaji Terminus", code: "CSMT", city: "Mumbai", state: "Maharashtra" },
  { name: "Lokmanya Tilak Terminus", code: "LTT", city: "Mumbai", state: "Maharashtra" },
  { name: "Bandra Terminus", code: "BDTS", city: "Mumbai", state: "Maharashtra" },
  { name: "Dadar", code: "DR", city: "Mumbai", state: "Maharashtra" },
  { name: "Pune Junction", code: "PUNE", city: "Pune", state: "Maharashtra" },
  { name: "Nagpur Junction", code: "NGP", city: "Nagpur", state: "Maharashtra" },
  { name: "Nashik Road", code: "NK", city: "Nashik", state: "Maharashtra" },
  { name: "Solapur Junction", code: "SUR", city: "Solapur", state: "Maharashtra" },
  { name: "KSR Bengaluru City", code: "SBC", city: "Bengaluru", state: "Karnataka" },
  { name: "Yesvantpur Junction", code: "YPR", city: "Bengaluru", state: "Karnataka" },
  { name: "Mysuru Junction", code: "MYS", city: "Mysuru", state: "Karnataka" },
  { name: "Hubballi Junction", code: "UBL", city: "Hubballi", state: "Karnataka" },
  { name: "Mangaluru Central", code: "MAQ", city: "Mangaluru", state: "Karnataka" },
  { name: "MGR Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Chennai Egmore", code: "MS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Coimbatore Junction", code: "CBE", city: "Coimbatore", state: "Tamil Nadu" },
  { name: "Madurai Junction", code: "MDU", city: "Madurai", state: "Tamil Nadu" },
  { name: "Tiruchirappalli Junction", code: "TPJ", city: "Trichy", state: "Tamil Nadu" },
  { name: "Salem Junction", code: "SA", city: "Salem", state: "Tamil Nadu" },
  { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" },
  { name: "Sealdah", code: "SDAH", city: "Kolkata", state: "West Bengal" },
  { name: "Kolkata", code: "KOAA", city: "Kolkata", state: "West Bengal" },
  { name: "New Jalpaiguri", code: "NJP", city: "Siliguri", state: "West Bengal" },
  { name: "Asansol Junction", code: "ASN", city: "Asansol", state: "West Bengal" },
  { name: "Secunderabad Junction", code: "SC", city: "Hyderabad", state: "Telangana" },
  { name: "Hyderabad Deccan", code: "HYB", city: "Hyderabad", state: "Telangana" },
  { name: "Kacheguda", code: "KCG", city: "Hyderabad", state: "Telangana" },
  { name: "Warangal", code: "WL", city: "Warangal", state: "Telangana" },
  { name: "Visakhapatnam", code: "VSKP", city: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Vijayawada Junction", code: "BZA", city: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Tirupati", code: "TPTY", city: "Tirupati", state: "Andhra Pradesh" },
  { name: "Guntur Junction", code: "GNT", city: "Guntur", state: "Andhra Pradesh" },
  { name: "Thiruvananthapuram Central", code: "TVC", city: "Thiruvananthapuram", state: "Kerala" },
  { name: "Ernakulam Junction", code: "ERS", city: "Kochi", state: "Kerala" },
  { name: "Kozhikode", code: "CLT", city: "Kozhikode", state: "Kerala" },
  { name: "Kannur", code: "CAN", city: "Kannur", state: "Kerala" },
  { name: "Ahmedabad Junction", code: "ADI", city: "Ahmedabad", state: "Gujarat" },
  { name: "Surat", code: "ST", city: "Surat", state: "Gujarat" },
  { name: "Vadodara Junction", code: "BRC", city: "Vadodara", state: "Gujarat" },
  { name: "Rajkot Junction", code: "RJT", city: "Rajkot", state: "Gujarat" },
  { name: "Jaipur Junction", code: "JP", city: "Jaipur", state: "Rajasthan" },
  { name: "Jodhpur Junction", code: "JU", city: "Jodhpur", state: "Rajasthan" },
  { name: "Udaipur City", code: "UDZ", city: "Udaipur", state: "Rajasthan" },
  { name: "Ajmer Junction", code: "AII", city: "Ajmer", state: "Rajasthan" },
  { name: "Kota Junction", code: "KOTA", city: "Kota", state: "Rajasthan" },
  { name: "Bikaner Junction", code: "BKN", city: "Bikaner", state: "Rajasthan" },
  { name: "Lucknow NR", code: "LKO", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Kanpur Central", code: "CNB", city: "Kanpur", state: "Uttar Pradesh" },
  { name: "Varanasi Junction", code: "BSB", city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Prayagraj Junction", code: "PRYJ", city: "Prayagraj", state: "Uttar Pradesh" },
  { name: "Agra Cantt", code: "AGC", city: "Agra", state: "Uttar Pradesh" },
  { name: "Gorakhpur Junction", code: "GKP", city: "Gorakhpur", state: "Uttar Pradesh" },
  { name: "Mathura Junction", code: "MTJ", city: "Mathura", state: "Uttar Pradesh" },
  { name: "Patna Junction", code: "PNBE", city: "Patna", state: "Bihar" },
  { name: "Gaya Junction", code: "GAYA", city: "Gaya", state: "Bihar" },
  { name: "Muzaffarpur Junction", code: "MFP", city: "Muzaffarpur", state: "Bihar" },
  { name: "Bhubaneswar", code: "BBS", city: "Bhubaneswar", state: "Odisha" },
  { name: "Puri", code: "PURI", city: "Puri", state: "Odisha" },
  { name: "Cuttack", code: "CTC", city: "Cuttack", state: "Odisha" },
  { name: "Bhopal Junction", code: "BPL", city: "Bhopal", state: "Madhya Pradesh" },
  { name: "Indore Junction", code: "INDB", city: "Indore", state: "Madhya Pradesh" },
  { name: "Jabalpur", code: "JBP", city: "Jabalpur", state: "Madhya Pradesh" },
  { name: "Gwalior Junction", code: "GWL", city: "Gwalior", state: "Madhya Pradesh" },
  { name: "Chandigarh", code: "CDG", city: "Chandigarh", state: "Chandigarh" },
  { name: "Amritsar Junction", code: "ASR", city: "Amritsar", state: "Punjab" },
  { name: "Ludhiana Junction", code: "LDH", city: "Ludhiana", state: "Punjab" },
  { name: "Jalandhar City", code: "JUC", city: "Jalandhar", state: "Punjab" },
  { name: "Ambala Cantt", code: "UMB", city: "Ambala", state: "Haryana" },
  { name: "Gurugram", code: "GGN", city: "Gurugram", state: "Haryana" },
  { name: "Faridabad", code: "FDB", city: "Faridabad", state: "Haryana" },
  { name: "Dehradun", code: "DDN", city: "Dehradun", state: "Uttarakhand" },
  { name: "Haridwar Junction", code: "HW", city: "Haridwar", state: "Uttarakhand" },
  { name: "Jammu Tawi", code: "JAT", city: "Jammu", state: "J&K" },
  { name: "Srinagar", code: "SINA", city: "Srinagar", state: "J&K" },
  { name: "Shimla", code: "SML", city: "Shimla", state: "Himachal Pradesh" },
  { name: "Guwahati", code: "GHY", city: "Guwahati", state: "Assam" },
  { name: "Dibrugarh", code: "DBRG", city: "Dibrugarh", state: "Assam" },
  { name: "Agartala", code: "AGTL", city: "Agartala", state: "Tripura" },
  { name: "Ranchi Junction", code: "RNC", city: "Ranchi", state: "Jharkhand" },
  { name: "Dhanbad Junction", code: "DHN", city: "Dhanbad", state: "Jharkhand" },
  { name: "Raipur Junction", code: "R", city: "Raipur", state: "Chhattisgarh" },
  { name: "Bilaspur Junction", code: "BSP", city: "Bilaspur", state: "Chhattisgarh" },
  { name: "Madgaon", code: "MAO", city: "Madgaon", state: "Goa" },
  { name: "Vasco Da Gama", code: "VSG", city: "Vasco", state: "Goa" },
];

export const suggestions = [
  "Cheapest AC train from Delhi to Jaipur tomorrow morning",
  "Vande Bharat from Mumbai to Ahmedabad this Friday",
  "Overnight sleeper from Bengaluru to Chennai",
  "Fastest train Delhi → Lucknow under ₹1500",
  "Tatkal 3A from Patna to Howrah for Monday",
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
