export type ComplaintStatus = "Open" | "Under review" | "Action taken" | "Resolved";
export type ComplaintCategory =
  | "Cleanliness" | "Delay" | "Staff behaviour" | "Ticketing" | "Safety" | "Food quality" | "Accessibility" | "Others";

export type Complaint = {
  id: string;
  handle: string;
  mode: string;
  route: string;
  station: string;
  category: ComplaintCategory;
  body: string;
  upvotes: number;
  status: ComplaintStatus;
  date: string;
  moderation?: string;
};

export const transportTypes = ["Train", "Bus", "Flight", "Ferry", "Metro", "Hotel", "Cab"];
export const categories: ComplaintCategory[] = [
  "Cleanliness", "Delay", "Staff behaviour", "Ticketing", "Safety", "Food quality", "Accessibility", "Others",
];
export const statuses: ComplaintStatus[] = ["Open", "Under review", "Action taken", "Resolved"];

export const seedComplaints: Complaint[] = [
  {
    id: "TIC-10482", handle: "traveller_9x", mode: "Train", station: "New Delhi", route: "New Delhi → Mumbai Central",
    category: "Cleanliness", body: "Coach S4 washrooms were unclean for most of the journey, no refill of water either.",
    upvotes: 34, status: "Under review", date: "2024-05-02",
  },
  {
    id: "TIC-10391", handle: "wanderlust_kavi", mode: "Bus", station: "Bengaluru", route: "Bengaluru → Hyderabad",
    category: "Delay", body: "Volvo bus departed almost 2 hours late with no announcement at the boarding point.",
    upvotes: 51, status: "Action taken", date: "2024-04-28",
    moderation: "Operator issued a formal warning; boarding point display screens updated (demo).",
  },
  {
    id: "TIC-10276", handle: "flyhigh_arjun", mode: "Flight", station: "IGI Airport T3", route: "Delhi → Goa",
    category: "Staff behaviour", body: "Ground staff at check-in counter was dismissive about a wheelchair request.",
    upvotes: 89, status: "Resolved", date: "2024-04-15",
    moderation: "Airline retrained ground staff at T3; passenger received a formal apology (demo).",
  },
  {
    id: "TIC-10198", handle: "seaside_ritu", mode: "Ferry", station: "Mandapam Jetty", route: "Mandapam → Rameswaram",
    category: "Safety", body: "Life jackets were not visibly available on the upper deck during the crossing.",
    upvotes: 22, status: "Open", date: "2024-05-08",
  },
  {
    id: "TIC-10120", handle: "metro_mohan", mode: "Metro", station: "Rajiv Chowk", route: "Rajiv Chowk → Dwarka Sec 21",
    category: "Ticketing", body: "Token vending machine repeatedly rejected valid ₹100 notes.",
    upvotes: 12, status: "Under review", date: "2024-05-10",
  },
  {
    id: "TIC-10087", handle: "hotelhopper_z", mode: "Hotel", station: "Jaipur Pink Palace Suites", route: "Jaipur stay",
    category: "Food quality", body: "Breakfast buffet had cold food and repeated menu for three days straight.",
    upvotes: 8, status: "Open", date: "2024-05-11",
  },
  {
    id: "TIC-10054", handle: "cabrider_neha", mode: "Cab", station: "Pune Station Stand", route: "Pune Station → Hinjewadi",
    category: "Staff behaviour", body: "Driver took a long detour despite being asked to follow the app route.",
    upvotes: 17, status: "Action taken", date: "2024-04-30",
    moderation: "Driver counselled by fleet partner; fare difference adjusted to wallet (demo).",
  },
  {
    id: "TIC-09988", handle: "railfan_desi", mode: "Train", station: "Howrah Jn", route: "Howrah → Patna",
    category: "Accessibility", body: "No ramp available for wheelchair boarding at platform 12.",
    upvotes: 63, status: "Resolved", date: "2024-04-10",
    moderation: "Station added a portable ramp roster for platform 12 (demo).",
  },
  {
    id: "TIC-09876", handle: "backpacker_sam", mode: "Bus", station: "Manali ISBT", route: "Manali → Delhi",
    category: "Cleanliness", body: "Seats had food stains and blankets smelled musty on an overnight service.",
    upvotes: 29, status: "Open", date: "2024-05-06",
  },
  {
    id: "TIC-09754", handle: "flyer_tanya", mode: "Flight", station: "Chhatrapati Shivaji Airport", route: "Mumbai → Bengaluru",
    category: "Delay", body: "Flight delayed by 4 hours with only a text notification 20 minutes prior.",
    upvotes: 41, status: "Under review", date: "2024-05-09",
  },
  {
    id: "TIC-09622", handle: "ferryfan_om", mode: "Ferry", station: "Elephanta Jetty", route: "Gateway of India → Elephanta",
    category: "Ticketing", body: "Counter refused digital ticket, insisted on cash despite signage saying UPI accepted.",
    upvotes: 6, status: "Open", date: "2024-05-12",
  },
  {
    id: "TIC-09540", handle: "commuter_r2", mode: "Metro", station: "MG Road", route: "MG Road → Whitefield",
    category: "Safety", body: "Platform edge doors did not close fully on one coach during peak hours.",
    upvotes: 74, status: "Action taken", date: "2024-04-22",
    moderation: "Maintenance team flagged the coach for inspection same evening (demo).",
  },
  {
    id: "TIC-09411", handle: "stayeasy_priti", mode: "Hotel", station: "Goa Palm Grove Resort", route: "Goa stay",
    category: "Staff behaviour", body: "Front desk was unhelpful about a billing discrepancy on checkout.",
    upvotes: 15, status: "Under review", date: "2024-05-03",
  },
  {
    id: "TIC-09280", handle: "gocab_yash", mode: "Cab", station: "Chennai Airport Stand", route: "Chennai Airport → T Nagar",
    category: "Food quality", body: "N/A — miscategorised complaint about missing invoice, kept for demo variety.",
    upvotes: 3, status: "Open", date: "2024-05-13",
  },
];
