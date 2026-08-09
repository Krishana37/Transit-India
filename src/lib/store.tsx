import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Account = {
  id: string;
  email: string;
  username: string;
  password: string;
  photo?: string;
  phone?: string;
  fullName?: string;
  language?: string;
  location?: string;
  remember?: boolean;
  createdAt: string;
};

export type SavedPassenger = {
  id: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  mobile: string;
  email: string;
  nationality: string;
  idType: string;
  idNumber: string;
  berth?: string;
};

export type BookingStatus = "confirmed" | "queued" | "cancelled" | "refunded" | "completed";
export type RefundStatus = "none" | "requested" | "processing" | "credited";

export type Booking = {
  id: string;
  pnr: string;
  mode: string; // train | bus | flight | hotel | metro | ferry | cab
  serviceName: string;
  serviceCode: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  date: string;
  depart: string;
  arrive: string;
  classCode: string;
  passengers: SavedPassenger[];
  meals: { id: string; name: string; price: number; qty: number }[];
  total: number;
  status: BookingStatus;
  coach?: string;
  seats?: string[];
  createdAt: string;
  tatkal?: boolean;
  coinsUsed?: number;
  paidWith?: string;
  refundStatus?: RefundStatus;
  refundAmount?: number;
  refundedAt?: string;
  cancelReason?: string;
};

export type DriverProfile = {
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleType: "Bike" | "Auto" | "Sedan" | "SUV";
  available: boolean;
  registeredAt: string;
};

export type WalletTxnStatus = "success" | "pending" | "failed";

export type WalletTxn = {
  id: string;
  type: "credit" | "debit" | "refund" | "earning";
  amount: number;
  label: string;
  at: string;
  status?: WalletTxnStatus;
  /** Human category shown as a chip, e.g. "Cabber ride", "Top-up". */
  category?: string;
  /** Related booking id / PNR / payout reference. */
  ref?: string;
};

/** A single completed Cabber job payout for the signed-in driver. */
export type DriverEarning = {
  id: string;
  /** Net amount the driver keeps (gross fare minus the ₹5 per ₹100 commission). */
  amount: number;
  /** Gross fare / courier value of the job. */
  fare?: number;
  /** Transit India commission taken from the fare. */
  commission?: number;
  /** Passenger ride or courier job — never mixed up. */
  kind?: CabberServiceKind;
  label: string;
  route?: string;
  at: string;
  /** Pending payouts settle into the withdrawable balance in the prototype. */
  status: "settled" | "pending";
};

/** Cabber offers two clearly separated services. */
export type CabberServiceKind = "ride" | "courier";


/** Reward that can be bought with Transit Points. Valid for ONE trip only. */
export type RewardCatalogItem = {
  id: string;
  name: string;
  cost: number;
  desc: string;
  benefit: string;
  /** Flat rupee benefit applied at checkout, if any. */
  discount: number;
};

export type RedeemedRewardStatus = "redeemed" | "applied" | "used" | "expired";

export type RedeemedReward = {
  id: string;
  rewardId: string;
  name: string;
  cost: number;
  benefit: string;
  discount: number;
  status: RedeemedRewardStatus;
  bookingId?: string;
  bookingLabel?: string;
  redeemedAt: string;
  expiresAt: string;
  closedAt?: string;
};


export type PaymentMethodKind = "upi" | "bank" | "debit" | "credit" | "wallet";

export type PaymentMethod = {
  id: string;
  kind: PaymentMethodKind;
  label: string;
  detail: string;
  primary?: boolean;
};

export type AppNotification = {
  id: string;
  kind:
    | "tatkal" | "booking" | "refund" | "cab" | "platform" | "delay"
    | "cancelled" | "wallet" | "coins" | "meal" | "hotel" | "reminder";
  title: string;
  body: string;
  at: string;
  read?: boolean;
};

export type RewardEntry = {
  id: string;
  label: string;
  points: number;
  coins: number;
  at: string;
  kind: "earned" | "redeemed";
};

export type FeedbackTopic =
  | "Overall experience" | "UI / UX" | "Features" | "Performance" | "Accessibility"
  | "Suggestion" | "Bug" | "Other";

export type FeedbackEntry = {
  id: string;
  topic: FeedbackTopic;
  stars: number;
  message: string;
  suggestion?: string;
  screenshot?: string;
  handle: string;
  at: string;
};

export type AccessibilityMode = "default" | "large" | "senior" | "simple";

export type PreTatkalDraft = {
  id: string;
  serviceName: string;
  fromCode: string;
  toCode: string;
  date: string;
  classCode: string;
  passengerIds: string[];
  mealIds: { id: string; qty: number }[];
  boarding: string;
  paymentMethodId?: string;
  total: number;
  createdAt: string;
  armed: boolean;
};

type State = {
  account: Account | null;
  passengers: SavedPassenger[];
  bookings: Booking[];
  driver: DriverProfile | null;
  recentSearches: string[];
  dark: boolean;
  accessibility: AccessibilityMode;
  walletBalance: number;
  walletTxns: WalletTxn[];
  coins: number;
  points: number;
  paymentMethods: PaymentMethod[];
  notifications: AppNotification[];
  tatkalDrafts: PreTatkalDraft[];
  rewardLog: RewardEntry[];
  lastDailyBonus?: string;
  /** Traveller's own ratings, keyed by `mode:code` or a feature key like `app`. */
  ratings: Record<string, ServiceRating>;
  /** Community feedback wall — visible to everyone in the prototype. */
  feedback: FeedbackEntry[];
  /** Cabber driver payouts — only relevant when `driver` is registered. */
  driverEarnings: DriverEarning[];
  /** Total already withdrawn from driver earnings into the Transit Wallet. */
  driverWithdrawn: number;
  /** One-trip rewards bought with Transit Points. */
  redeemedRewards: RedeemedReward[];

};

/** A rating left by the traveller on a service, journey or the app itself. */
export type ServiceRating = { stars: number; note?: string; at: string };

const STORAGE_KEY = "transit-india-state-v2";

const seedPassengers: SavedPassenger[] = [
  { id: "p1", fullName: "Aarav Sharma", age: 32, gender: "Male", mobile: "98100 12345", email: "aarav@example.com", nationality: "Indian", idType: "Aadhaar", idNumber: "XXXX-XXXX-1234", berth: "Lower" },
  { id: "p2", fullName: "Priya Iyer", age: 29, gender: "Female", mobile: "98200 55810", email: "priya@example.com", nationality: "Indian", idType: "Aadhaar", idNumber: "XXXX-XXXX-5581", berth: "Side Lower" },
  { id: "p3", fullName: "Rohan Mehta", age: 8, gender: "Male", mobile: "98100 12345", email: "aarav@example.com", nationality: "Indian", idType: "Birth Certificate", idNumber: "BC-2017-9921", berth: "No Preference" },
];

const seedPaymentMethods: PaymentMethod[] = [
  { id: "pm1", kind: "upi", label: "Primary UPI", detail: "aarav@transitpay", primary: true },
  { id: "pm2", kind: "credit", label: "Transit Card", detail: "•••• 4412 · 09/29" },
];

const seedFeedback: FeedbackEntry[] = [
  { id: "f1", topic: "Overall experience", stars: 5, message: "Booking a train, a cab and a hotel in one flow is genuinely useful. Very smooth.", handle: "traveller_9x", at: "2024-05-12T09:12:00.000Z" },
  { id: "f2", topic: "UI / UX", stars: 4, message: "Love the glass cards and the 3D icons. Dark mode looks great on my phone.", suggestion: "A compact list view for search results would help on small screens.", handle: "designer_nk", at: "2024-05-11T16:40:00.000Z" },
  { id: "f3", topic: "Accessibility", stars: 5, message: "Senior citizen mode made it readable for my father without any help.", handle: "caretaker_ambi", at: "2024-05-10T07:55:00.000Z" },
  { id: "f4", topic: "Features", stars: 4, message: "Pre-Tatkal drafts saved me a lot of typing during the rush window.", suggestion: "Allow two drafts to be armed at once.", handle: "railfan_desi", at: "2024-05-08T12:20:00.000Z" },
  { id: "f5", topic: "Performance", stars: 4, message: "Route search feels quick even with a long list of results.", handle: "commuter_r2", at: "2024-05-06T19:05:00.000Z" },
];

const initialState: State = {
  account: null,
  passengers: seedPassengers,
  bookings: [],
  driver: null,
  recentSearches: [],
  dark: false,
  accessibility: "default",
  walletBalance: 2500,
  walletTxns: [
    { id: "w0", type: "credit", amount: 2500, label: "Welcome prototype balance", at: new Date().toISOString(), status: "success", category: "Top-up" },
  ],
  coins: 480,
  points: 120,
  paymentMethods: seedPaymentMethods,
  notifications: [],
  tatkalDrafts: [],
  rewardLog: [],
  ratings: {},
  feedback: seedFeedback,
  driverEarnings: [],
  driverWithdrawn: 0,
  redeemedRewards: [],

};

/** 1 Transit India Coin = ₹0.25, capped at 15% of the fare. */
export const COIN_VALUE = 0.25;
export const COIN_MAX_SHARE = 0.15;

/** 1 Transit Point = ₹0.50 when redeemed at checkout. */
export const POINT_VALUE = 0.5;

/** Add Money limits per attempt. */
export const WALLET_MIN_TOPUP = 1;
export const WALLET_MAX_TOPUP = 100000;

export function maxCoinDiscount(total: number, coins: number) {
  const cap = Math.floor(total * COIN_MAX_SHARE);
  return Math.max(0, Math.min(cap, Math.floor(coins * COIN_VALUE)));
}

/** Points can cover the whole remaining fare, but never more than you own. */
export function maxPointDiscount(total: number, points: number) {
  return Math.max(0, Math.min(Math.floor(total), Math.floor(points * POINT_VALUE)));
}


export const POINT_EVENTS: Record<string, { points: number; coins: number; label: string }> = {
  search: { points: 2, coins: 1, label: "Searched a route" },
  booking: { points: 40, coins: 25, label: "Completed a booking" },
  pnr: { points: 3, coins: 2, label: "Checked PNR status" },
  wallet: { points: 5, coins: 5, label: "Used Transit Wallet" },
  cabber: { points: 20, coins: 12, label: "Booked a Cabber ride" },
  hotel: { points: 25, coins: 15, label: "Booked a hotel" },
  meal: { points: 10, coins: 6, label: "Ordered a meal" },
  daily: { points: 15, coins: 10, label: "Daily login bonus" },
};

export const TIERS = [
  { name: "Explorer", min: 0, perk: "5% coin discount cap" },
  { name: "Voyager", min: 250, perk: "10% coin discount cap + priority queue" },
  { name: "Pathfinder", min: 750, perk: "15% coin discount cap + free meal upgrade" },
  { name: "Wayfarer", min: 1800, perk: "15% cap + lounge passes + instant refunds" },
];

export function tierFor(points: number) {
  return [...TIERS].reverse().find((t) => points >= t.min) ?? TIERS[0];
}

/** Rewards that can be bought with Transit Points. Each is valid for ONE trip. */
export const REWARD_CATALOG: RewardCatalogItem[] = [
  { id: "meal-upgrade", name: "Free Meal Upgrade", cost: 300, desc: "Upgrade one onboard meal to the premium thali.", benefit: "Premium meal on one journey", discount: 149 },
  { id: "seat-upgrade", name: "Seat Upgrade", cost: 500, desc: "Move one booking up to the next available class.", benefit: "Next-class seat on one journey", discount: 250 },
  { id: "baggage", name: "Extra Baggage Benefit", cost: 350, desc: "Carry 10 kg extra on a single flight or bus trip.", benefit: "+10 kg baggage on one trip", discount: 180 },
  { id: "priority", name: "Priority Queue", cost: 200, desc: "Skip the boarding queue once at any Transit India terminal.", benefit: "Priority boarding on one trip", discount: 99 },
  { id: "fare-discount", name: "Small Fare Discount", cost: 250, desc: "Flat ₹125 off a single booking at checkout.", benefit: "₹125 off one booking", discount: 125 },
  { id: "lounge", name: "Lounge / Travel Perk", cost: 750, desc: "One complimentary lounge visit before departure.", benefit: "Lounge access on one trip", discount: 400 },
];

export const REWARD_VALID_DAYS = 30;

/** Cabber commission: exactly ₹5 for every ₹100 of completed fare — nothing hidden. */
export const CABBER_COMMISSION_PER_100 = 5;

export function cabberCommission(fare: number) {
  return Math.round((Math.max(0, fare) / 100) * CABBER_COMMISSION_PER_100);
}

export function cabberDriverPayout(fare: number) {
  return Math.max(0, Math.round(fare) - cabberCommission(fare));
}

/** Passenger rides go up to ₹10,000; courier jobs up to ₹1,00,000. */
export const CABBER_RIDE_MAX = 10000;
export const CABBER_COURIER_MAX = 100000;

export type DriverEarningsSummary = {
  today: number; week: number; total: number; rides: number; pending: number; withdrawable: number;
  /** Split of the payout log for the driver wallet view. */
  rideJobs: number; courierJobs: number; rideEarnings: number; courierEarnings: number;
  grossFare: number; commission: number;
};

/** Derive the driver dashboard figures from the payout log. */
export function driverEarningsSummary(earnings: DriverEarning[], withdrawn: number): DriverEarningsSummary {
  const now = Date.now();
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  const weekAgo = now - 7 * 86400000;
  let today = 0, week = 0, total = 0, pending = 0;
  let rideJobs = 0, courierJobs = 0, rideEarnings = 0, courierEarnings = 0, grossFare = 0, commission = 0;
  for (const e of earnings) {
    const at = new Date(e.at).getTime();
    total += e.amount;
    grossFare += e.fare ?? e.amount;
    commission += e.commission ?? 0;
    if (e.kind === "courier") { courierJobs += 1; courierEarnings += e.amount; }
    else { rideJobs += 1; rideEarnings += e.amount; }
    if (e.status === "pending") pending += e.amount;
    if (at >= startOfDay.getTime()) today += e.amount;
    if (at >= weekAgo) week += e.amount;
  }
  return {
    today, week, total, rides: earnings.length, pending,
    withdrawable: Math.max(0, total - pending - withdrawn),
    rideJobs, courierJobs, rideEarnings, courierEarnings, grossFare, commission,
  };
}


/** Rewards past their expiry date are treated as expired without extra state. */
export function isRewardExpired(r: RedeemedReward) {
  return (r.status === "redeemed" || r.status === "applied") && new Date(r.expiresAt).getTime() < Date.now();
}

export function rewardBadge(r: RedeemedReward): RedeemedRewardStatus {
  return isRewardExpired(r) ? "expired" : r.status;
}

type StoreValue = State & {
  hydrated: boolean;
  unreadCount: number;

  signUp: (data: { email: string; username: string; password: string; photo?: string; fullName?: string; language?: string; location?: string; remember?: boolean }) => { ok: boolean; error?: string };
  login: (data: { email: string; password: string; remember?: boolean }) => { ok: boolean; error?: string };
  resetPassword: (data: { email: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;
  updateAccount: (patch: Partial<Account>) => void;
  addPassenger: (p: Omit<SavedPassenger, "id">) => SavedPassenger;
  updatePassenger: (id: string, patch: Partial<SavedPassenger>) => void;
  deletePassenger: (id: string) => void;
  addBooking: (b: Omit<Booking, "id" | "createdAt">) => Booking;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  cancelBooking: (id: string, reason?: string) => void;
  requestRefund: (id: string) => { ok: boolean; error?: string };
  registerDriver: (d: Omit<DriverProfile, "registeredAt">) => void;
  updateDriver: (patch: Partial<DriverProfile>) => void;
  /** Permanently remove the Cabber driver profile (never the main Transit India account). */
  deleteDriverAccount: () => void;

  pushRecentSearch: (q: string) => void;
  setDark: (b: boolean) => void;
  setAccessibility: (m: AccessibilityMode) => void;
  addMoney: (amount: number, label?: string) => { ok: boolean; error?: string };
  payFromWallet: (amount: number, label: string, meta?: { category?: string; ref?: string }) => { ok: boolean; error?: string };
  /** Credit the customer wallet instantly (refunds, payouts, promos). */
  creditWallet: (amount: number, label: string, meta?: { category?: string; ref?: string; type?: WalletTxn["type"] }) => void;
  /** Cabber driver payouts. */
  addDriverEarning: (data: { amount: number; label: string; route?: string; status?: DriverEarning["status"] }) => void;
  settlePendingEarnings: () => void;
  withdrawEarnings: (amount: number) => { ok: boolean; error?: string };
  /** One-trip rewards. */
  redeemReward: (rewardId: string) => { ok: boolean; error?: string };
  applyRewardToBooking: (redeemedId: string, bookingId: string, bookingLabel: string) => void;
  closeRewardsForBooking: (bookingId: string, outcome: "used" | "expired") => void;

  addPaymentMethod: (m: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (id: string) => void;
  spendCoins: (coins: number) => void;
  spendPoints: (points: number, label?: string) => void;
  reward: (event: keyof typeof POINT_EVENTS | string) => void;
  notify: (n: Omit<AppNotification, "id" | "at" | "read">) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
  saveTatkalDraft: (d: Omit<PreTatkalDraft, "id" | "createdAt">) => PreTatkalDraft;
  rateService: (key: string, stars: number, note?: string) => void;
  submitFeedback: (f: Omit<FeedbackEntry, "id" | "at" | "handle"> & { handle?: string }) => FeedbackEntry;
  transferMoney: (data: { amount: number; destination: string }) => { ok: boolean; error?: string };
  removeTatkalDraft: (id: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

/** Journey status derived from the scheduled date/time, not stored. */
export function journeyPhase(b: Booking): "upcoming" | "completed" | "cancelled" {
  if (b.status === "cancelled" || b.status === "refunded") return "cancelled";
  const [h, m] = (b.arrive || "23:59").split(":").map(Number);
  const end = new Date(`${b.date}T00:00:00`);
  end.setHours(h || 23, m || 59, 0, 0);
  if (b.arrive < b.depart) end.setDate(end.getDate() + 1);
  return end.getTime() < Date.now() ? "completed" : "upcoming";
}

/**
 * Cancellation is only offered while the journey is still upcoming and the
 * scheduled departure has not passed. Completed journeys can never be cancelled.
 */
export function canCancelBooking(b: Booking): boolean {
  if (b.status === "cancelled" || b.status === "refunded" || b.status === "completed") return false;
  if (journeyPhase(b) !== "upcoming") return false;
  const departAt = new Date(`${b.date}T${b.depart && b.depart !== "—" ? b.depart : "00:00"}`).getTime();
  if (Number.isNaN(departAt)) return true;
  return departAt > Date.now();
}

/** Refunds only for upcoming, non-cancelled, not-already-refunded bookings. */
export function refundEligibility(b: Booking): { eligible: boolean; reason: string; amount: number } {
  if (b.status === "refunded" || b.refundStatus === "credited")
    return { eligible: false, reason: "Already refunded to your Transit Wallet.", amount: 0 };
  if (b.refundStatus === "requested" || b.refundStatus === "processing")
    return { eligible: false, reason: "A refund is already in progress.", amount: 0 };
  const phase = journeyPhase(b);
  if (phase === "completed")
    return { eligible: false, reason: "Journey completed — refunds are not available.", amount: 0 };
  const hoursLeft = (new Date(`${b.date}T${b.depart || "00:00"}`).getTime() - Date.now()) / 3600000;
  const fee = hoursLeft >= 48 ? 0.05 : hoursLeft >= 12 ? 0.2 : hoursLeft >= 4 ? 0.5 : 1;
  if (fee === 1) return { eligible: false, reason: "Under 4 hours to departure — no refund is payable.", amount: 0 };
  return {
    eligible: true,
    reason: `Cancellation fee ${Math.round(fee * 100)}% · credited to Transit Wallet`,
    amount: Math.round(b.total * (1 - fee)),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<State>;
        setState({
          ...initialState,
          ...saved,
          ratings: { ...initialState.ratings, ...(saved.ratings ?? {}) },
          feedback: saved.feedback?.length ? saved.feedback : initialState.feedback,
        });
      }
    } catch {
      /* ignore corrupted state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota — prototype only */
    }
  }, [state, hydrated]);

  // A one-trip reward locked to a booking is burnt once that journey completes.
  useEffect(() => {
    if (!hydrated) return;
    const settle = () =>
      setState((s) => {
        const done = new Set(
          s.bookings.filter((b) => journeyPhase(b) === "completed").map((b) => b.id),
        );
        const needs = s.redeemedRewards.some(
          (r) => r.status === "applied" && r.bookingId && done.has(r.bookingId),
        );
        if (!needs) return s;
        const now = new Date().toISOString();
        return {
          ...s,
          redeemedRewards: s.redeemedRewards.map((r) =>
            r.status === "applied" && r.bookingId && done.has(r.bookingId)
              ? { ...r, status: "used" as const, closedAt: now }
              : r,
          ),
        };
      });
    settle();
    const id = setInterval(settle, 30000);
    return () => clearInterval(id);
  }, [hydrated, state.bookings, state.redeemedRewards]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", state.dark);
  }, [state.dark]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    el.classList.remove("a11y-large", "a11y-senior", "a11y-simple");
    if (state.accessibility === "large") el.classList.add("a11y-large");
    if (state.accessibility === "senior") el.classList.add("a11y-senior");
    if (state.accessibility === "simple") el.classList.add("a11y-simple");
  }, [state.accessibility]);

  const signUp = useCallback<StoreValue["signUp"]>((data) => {
    if (!data.email.includes("@")) return { ok: false, error: "Enter a valid email address." };
    if (data.password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    if (data.username.trim().length < 3) return { ok: false, error: "Username must be at least 3 characters." };
    setState((s) => ({
      ...s,
      account: {
        id: uid(),
        email: data.email.trim(),
        username: data.username.trim(),
        password: data.password,
        photo: data.photo,
        fullName: data.fullName?.trim() || data.username.trim(),
        language: data.language,
        location: data.location,
        remember: data.remember,
        createdAt: new Date().toISOString(),
      },
    }));
    return { ok: true };
  }, []);

  const login = useCallback<StoreValue["login"]>((data) => {
    let result: { ok: boolean; error?: string } = { ok: true };
    setState((s) => {
      const raw = (() => {
        try {
          return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as State | null;
        } catch {
          return null;
        }
      })();
      const known = s.account ?? raw?.account ?? null;
      if (!known || known.email.toLowerCase() !== data.email.trim().toLowerCase()) {
        result = { ok: false, error: "No account found for this email. Please sign up first." };
        return s;
      }
      if (known.password !== data.password) {
        result = { ok: false, error: "Incorrect password." };
        return s;
      }
      return { ...s, account: { ...known, remember: data.remember ?? known.remember } };
    });
    return result;
  }, []);

  const pushNotification = useCallback((s: State, n: Omit<AppNotification, "id" | "at" | "read">): State => ({
    ...s,
    notifications: [{ ...n, id: uid(), at: new Date().toISOString(), read: false }, ...s.notifications].slice(0, 40),
  }), []);

  const value = useMemo<StoreValue>(() => ({
    ...state,
    hydrated,
    unreadCount: state.notifications.filter((n) => !n.read).length,
    signUp,
    login,
    resetPassword: ({ email, password }) => {
      let out: { ok: boolean; error?: string } = { ok: true };
      setState((s) => {
        if (!s.account || s.account.email.toLowerCase() !== email.trim().toLowerCase()) {
          out = { ok: false, error: "No account found for this email address." };
          return s;
        }
        if (password.length < 6) {
          out = { ok: false, error: "Password must be at least 6 characters." };
          return s;
        }
        return { ...s, account: { ...s.account, password } };
      });
      return out;
    },
    logout: () => setState((s) => ({ ...s, account: null })),
    updateAccount: (patch) => setState((s) => (s.account ? { ...s, account: { ...s.account, ...patch } } : s)),
    addPassenger: (p) => {
      const created: SavedPassenger = { ...p, id: uid() };
      setState((s) => ({ ...s, passengers: [...s.passengers, created] }));
      return created;
    },
    updatePassenger: (id, patch) =>
      setState((s) => ({ ...s, passengers: s.passengers.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    deletePassenger: (id) => setState((s) => ({ ...s, passengers: s.passengers.filter((p) => p.id !== id) })),
    addBooking: (b) => {
      const created: Booking = { ...b, id: uid(), createdAt: new Date().toISOString(), refundStatus: b.refundStatus ?? "none" };
      setState((s) => {
        const next = { ...s, bookings: [created, ...s.bookings] };
        return pushNotification(next, {
          kind: "booking",
          title: "Booking successful",
          body: `${created.serviceName} · ${created.fromCity} → ${created.toCity} on ${created.date}`,
        });
      });
      return created;
    },
    updateBooking: (id, patch) =>
      setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
    cancelBooking: (id, reason) =>
      setState((s) => {
        const b = s.bookings.find((x) => x.id === id);
        if (!b || !canCancelBooking(b)) return s;
        const elig = refundEligibility(b);
        const now = new Date().toISOString();
        // Instant prototype refund: eligible amounts always land in the Transit Wallet.
        let next: State = {
          ...s,
          walletBalance: s.walletBalance + elig.amount,
          walletTxns: elig.amount > 0
            ? [{
                id: uid(), type: "refund" as const, amount: elig.amount,
                label: `Refund · ${b.serviceName}`, at: now, status: "success" as const,
                category: "Cancellation refund", ref: b.pnr,
              }, ...s.walletTxns]
            : s.walletTxns,
          bookings: s.bookings.map((x) =>
            x.id === id
              ? {
                  ...x,
                  status: (elig.amount > 0 ? "refunded" : "cancelled") as BookingStatus,
                  cancelReason: reason ?? "Cancelled by passenger",
                  refundStatus: (elig.amount > 0 ? "credited" : "none") as RefundStatus,
                  refundAmount: elig.amount,
                  refundedAt: elig.amount > 0 ? now : undefined,
                }
              : x,
          ),
          // A one-trip reward attached to a cancelled booking is burnt.
          redeemedRewards: s.redeemedRewards.map((r) =>
            r.bookingId === id && r.status === "applied" ? { ...r, status: "expired" as const, closedAt: now } : r,
          ),
        };
        next = pushNotification(next, {
          kind: "cancelled",
          title: "Booking cancelled",
          body: `${b.serviceName} · ${elig.amount > 0 ? `₹${elig.amount} refunded instantly.` : elig.reason}`,
        });
        return elig.amount > 0
          ? pushNotification(next, {
              kind: "refund",
              title: "Refund credited",
              body: `₹${elig.amount} added to your Transit Wallet for ${b.serviceName}.`,
            })
          : next;
      }),
    requestRefund: (id) => {
      let out: { ok: boolean; error?: string } = { ok: true };
      setState((s) => {
        const b = s.bookings.find((x) => x.id === id);
        if (!b) { out = { ok: false, error: "Booking not found." }; return s; }
        const elig = refundEligibility(b);
        if (!elig.eligible) { out = { ok: false, error: elig.reason }; return s; }
        const next: State = {
          ...s,
          walletBalance: s.walletBalance + elig.amount,
          walletTxns: [
            { id: uid(), type: "refund", amount: elig.amount, label: `Refund · ${b.serviceName}`, at: new Date().toISOString(), status: "success", category: "Booking refund", ref: b.pnr },
            ...s.walletTxns,
          ],
          bookings: s.bookings.map((x) =>
            x.id === id
              ? { ...x, status: "refunded" as BookingStatus, refundStatus: "credited" as RefundStatus, refundAmount: elig.amount, refundedAt: new Date().toISOString() }
              : x,
          ),
        };
        return pushNotification(next, {
          kind: "refund",
          title: "Refund credited",
          body: `₹${elig.amount} added to your Transit Wallet for ${b.serviceName}.`,
        });
      });
      return out;
    },
    registerDriver: (d) => setState((s) => ({ ...s, driver: { ...d, registeredAt: new Date().toISOString() } })),
    updateDriver: (patch) => setState((s) => (s.driver ? { ...s, driver: { ...s.driver, ...patch } } : s)),
    pushRecentSearch: (q) =>
      setState((s) => ({ ...s, recentSearches: [q, ...s.recentSearches.filter((r) => r !== q)].slice(0, 6) })),
    setDark: (b) => setState((s) => ({ ...s, dark: b })),
    setAccessibility: (m) => setState((s) => ({ ...s, accessibility: m })),
    addMoney: (amount, label) => {
      if (!Number.isFinite(amount) || Math.floor(amount) !== amount)
        return { ok: false, error: "Enter a whole rupee amount." };
      if (amount < WALLET_MIN_TOPUP)
        return { ok: false, error: `Minimum add money amount is ₹${WALLET_MIN_TOPUP}.` };
      if (amount > WALLET_MAX_TOPUP)
        return { ok: false, error: `Maximum ₹${WALLET_MAX_TOPUP.toLocaleString("en-IN")} can be added per transaction.` };
      setState((s) => {
        const next: State = {
          ...s,
          walletBalance: s.walletBalance + amount,
          walletTxns: [{ id: uid(), type: "credit", amount, label: label ?? "Money added", at: new Date().toISOString(), status: "success", category: "Wallet top-up" }, ...s.walletTxns],
        };
        return pushNotification(next, { kind: "wallet", title: "Wallet credited", body: `₹${amount} added to your Transit Wallet.` });
      });
      return { ok: true };
    },
    payFromWallet: (amount, label, meta) => {
      let out: { ok: boolean; error?: string } = { ok: true };
      setState((s) => {
        if (s.walletBalance < amount) { out = { ok: false, error: "Insufficient wallet balance." }; return s; }
        return {
          ...s,
          walletBalance: s.walletBalance - amount,
          walletTxns: [{
            id: uid(), type: "debit", amount, label, at: new Date().toISOString(),
            status: "success" as const, category: meta?.category ?? "Booking payment", ref: meta?.ref,
          }, ...s.walletTxns],
        };
      });
      return out;
    },
    creditWallet: (amount, label, meta) =>
      setState((s) => pushNotification({
        ...s,
        walletBalance: s.walletBalance + amount,
        walletTxns: [{
          id: uid(), type: meta?.type ?? "credit", amount, label, at: new Date().toISOString(),
          status: "success" as const, category: meta?.category, ref: meta?.ref,
        }, ...s.walletTxns],
      }, { kind: "wallet", title: "Wallet credited", body: `₹${amount.toLocaleString("en-IN")} · ${label}` })),
    addDriverEarning: ({ amount, label, route, status }) =>
      setState((s) => pushNotification({
        ...s,
        driverEarnings: [
          { id: uid(), amount, label, route, at: new Date().toISOString(), status: status ?? "settled" },
          ...s.driverEarnings,
        ].slice(0, 80),
      }, { kind: "cab", title: "Cabber ride completed", body: `+₹${amount} added to your driver earnings.` })),
    settlePendingEarnings: () =>
      setState((s) => ({ ...s, driverEarnings: s.driverEarnings.map((e) => ({ ...e, status: "settled" as const })) })),
    withdrawEarnings: (amount) => {
      let out: { ok: boolean; error?: string } = { ok: true };
      setState((s) => {
        const sum = driverEarningsSummary(s.driverEarnings, s.driverWithdrawn);
        if (!Number.isFinite(amount) || amount <= 0) { out = { ok: false, error: "Enter a valid amount." }; return s; }
        if (amount > sum.withdrawable) { out = { ok: false, error: "Amount exceeds your withdrawable earnings." }; return s; }
        return pushNotification({
          ...s,
          driverWithdrawn: s.driverWithdrawn + amount,
          walletBalance: s.walletBalance + amount,
          walletTxns: [{
            id: uid(), type: "earning" as const, amount, label: "Cabber driver earnings payout",
            at: new Date().toISOString(), status: "success" as const, category: "Driver earnings",
          }, ...s.walletTxns],
        }, { kind: "wallet", title: "Earnings transferred", body: `₹${amount.toLocaleString("en-IN")} moved to your Transit Wallet.` });
      });
      return out;
    },
    redeemReward: (rewardId) => {
      let out: { ok: boolean; error?: string } = { ok: true };
      const item = REWARD_CATALOG.find((r) => r.id === rewardId);
      if (!item) return { ok: false, error: "Reward not found." };
      setState((s) => {
        if (s.points < item.cost) { out = { ok: false, error: "Not enough Transit Points for this reward." }; return s; }
        const now = new Date();
        const expires = new Date(now.getTime() + REWARD_VALID_DAYS * 86400000);
        return pushNotification({
          ...s,
          points: s.points - item.cost,
          rewardLog: [
            { id: uid(), label: `${item.name} redeemed`, points: -item.cost, coins: 0, at: now.toISOString(), kind: "redeemed" as const },
            ...s.rewardLog,
          ].slice(0, 60),
          redeemedRewards: [{
            id: uid(), rewardId: item.id, name: item.name, cost: item.cost, benefit: item.benefit,
            discount: item.discount, status: "redeemed" as const,
            redeemedAt: now.toISOString(), expiresAt: expires.toISOString(),
          }, ...s.redeemedRewards],
        }, { kind: "coins", title: "Reward redeemed", body: `${item.name} · valid for 1 trip until ${expires.toDateString()}.` });
      });
      return out;
    },
    applyRewardToBooking: (redeemedId, bookingId, bookingLabel) =>
      setState((s) => ({
        ...s,
        redeemedRewards: s.redeemedRewards.map((r) =>
          r.id === redeemedId && r.status === "redeemed" ? { ...r, status: "applied" as const, bookingId, bookingLabel } : r,
        ),
      })),
    closeRewardsForBooking: (bookingId, outcome) =>
      setState((s) => {
        if (!s.redeemedRewards.some((r) => r.bookingId === bookingId && r.status === "applied")) return s;
        return {
          ...s,
          redeemedRewards: s.redeemedRewards.map((r) =>
            r.bookingId === bookingId && r.status === "applied"
              ? { ...r, status: outcome, closedAt: new Date().toISOString() }
              : r,
          ),
        };
      }),

    addPaymentMethod: (m) => setState((s) => ({ ...s, paymentMethods: [...s.paymentMethods, { ...m, id: uid() }] })),
    removePaymentMethod: (id) => setState((s) => ({ ...s, paymentMethods: s.paymentMethods.filter((m) => m.id !== id) })),
    spendCoins: (coins) =>
      setState((s) => ({
        ...s,
        coins: Math.max(0, s.coins - coins),
        rewardLog: coins > 0
          ? [{ id: uid(), label: "Coins redeemed at checkout", points: 0, coins: -coins, at: new Date().toISOString(), kind: "redeemed" as const }, ...s.rewardLog].slice(0, 60)
          : s.rewardLog,
      })),
    spendPoints: (points, label) =>
      setState((s) => {
        const used = Math.max(0, Math.min(points, s.points));
        if (used === 0) return s;
        return {
          ...s,
          points: s.points - used,
          rewardLog: [
            { id: uid(), label: label ?? "Points redeemed at checkout", points: -used, coins: 0, at: new Date().toISOString(), kind: "redeemed" as const },
            ...s.rewardLog,
          ].slice(0, 60),
        };
      }),
    reward: (event) =>
      setState((s) => {
        const e = POINT_EVENTS[event];
        if (!e) return s;
        if (event === "daily" && s.lastDailyBonus === new Date().toDateString()) return s;
        const next: State = {
          ...s,
          coins: s.coins + e.coins,
          points: s.points + e.points,
          lastDailyBonus: event === "daily" ? new Date().toDateString() : s.lastDailyBonus,
          rewardLog: [
            { id: uid(), label: e.label, points: e.points, coins: e.coins, at: new Date().toISOString(), kind: "earned" as const },
            ...s.rewardLog,
          ].slice(0, 60),
        };
        return e.coins >= 10
          ? pushNotification(next, { kind: "coins", title: "Transit Coins earned", body: `+${e.coins} coins · ${e.label}` })
          : next;
      }),
    notify: (n) => setState((s) => pushNotification(s, n)),
    markAllRead: () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    clearNotifications: () => setState((s) => ({ ...s, notifications: [] })),
    rateService: (key, stars, note) =>
      setState((s) => ({
        ...s,
        ratings: { ...s.ratings, [key]: { stars, note, at: new Date().toISOString() } },
      })),
    submitFeedback: (f) => {
      const created: FeedbackEntry = {
        ...f,
        handle: f.handle || state.account?.username || "guest_traveller",
        id: uid(),
        at: new Date().toISOString(),
      };
      setState((s) => pushNotification({ ...s, feedback: [created, ...s.feedback].slice(0, 60) }, {
        kind: "platform",
        title: "Feedback received",
        body: `Thanks for the ${created.stars}★ feedback on ${created.topic}.`,
      }));
      return created;
    },
    transferMoney: ({ amount, destination }) => {
      let out: { ok: boolean; error?: string } = { ok: true };
      if (!Number.isFinite(amount) || amount <= 0 || Math.floor(amount) !== amount) {
        return { ok: false, error: "Enter a valid whole rupee amount greater than zero." };
      }
      setState((s) => {
        if (amount > s.walletBalance) {
          out = { ok: false, error: "Amount exceeds your available wallet balance." };
          return s;
        }
        const next: State = {
          ...s,
          walletBalance: s.walletBalance - amount,
          walletTxns: [
            { id: uid(), type: "debit", amount, label: `Transferred to ${destination}`, at: new Date().toISOString() },
            ...s.walletTxns,
          ],
        };
        return pushNotification(next, {
          kind: "wallet",
          title: "Transfer successful",
          body: `₹${amount.toLocaleString("en-IN")} sent to ${destination} from your Transit Wallet.`,
        });
      });
      return out;
    },
    saveTatkalDraft: (d) => {
      const created: PreTatkalDraft = { ...d, id: uid(), createdAt: new Date().toISOString() };
      setState((s) => pushNotification({ ...s, tatkalDrafts: [created, ...s.tatkalDrafts] }, {
        kind: "tatkal",
        title: "Pre-Tatkal saved",
        body: `${created.serviceName} is queued. We'll alert you when Tatkal opens.`,
      }));
      return created;
    },
    removeTatkalDraft: (id) => setState((s) => ({ ...s, tatkalDrafts: s.tatkalDrafts.filter((d) => d.id !== id) })),
  }), [state, hydrated, signUp, login, pushNotification]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
