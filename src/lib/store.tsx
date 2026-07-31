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

export type BookingStatus = "confirmed" | "queued" | "cancelled" | "refunded";

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

type State = {
  account: Account | null;
  passengers: SavedPassenger[];
  bookings: Booking[];
  driver: DriverProfile | null;
  recentSearches: string[];
  dark: boolean;
};

const STORAGE_KEY = "transit-india-state-v1";

const seedPassengers: SavedPassenger[] = [
  { id: "p1", fullName: "Aarav Sharma", age: 32, gender: "Male", mobile: "98100 12345", email: "aarav@example.com", nationality: "Indian", idType: "Aadhaar", idNumber: "XXXX-XXXX-1234", berth: "Lower" },
  { id: "p2", fullName: "Priya Iyer", age: 29, gender: "Female", mobile: "98200 55810", email: "priya@example.com", nationality: "Indian", idType: "Aadhaar", idNumber: "XXXX-XXXX-5581", berth: "Side Lower" },
  { id: "p3", fullName: "Rohan Mehta", age: 8, gender: "Male", mobile: "98100 12345", email: "aarav@example.com", nationality: "Indian", idType: "Birth Certificate", idNumber: "BC-2017-9921", berth: "No Preference" },
];

const initialState: State = {
  account: null,
  passengers: seedPassengers,
  bookings: [],
  driver: null,
  recentSearches: [],
  dark: false,
};

type StoreValue = State & {
  hydrated: boolean;
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
  registerDriver: (d: Omit<DriverProfile, "registeredAt">) => void;
  updateDriver: (patch: Partial<DriverProfile>) => void;
  pushRecentSearch: (q: string) => void;
  setDark: (b: boolean) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as State) });
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

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", state.dark);
  }, [state.dark]);

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

  const login = useCallback<StoreValue["login"]>(
    (data) => {
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
    },
    [],
  );

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      hydrated,
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
        const created: Booking = { ...b, id: uid(), createdAt: new Date().toISOString() };
        setState((s) => ({ ...s, bookings: [created, ...s.bookings] }));
        return created;
      },
      updateBooking: (id, patch) =>
        setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      registerDriver: (d) => setState((s) => ({ ...s, driver: { ...d, registeredAt: new Date().toISOString() } })),
      updateDriver: (patch) => setState((s) => (s.driver ? { ...s, driver: { ...s.driver, ...patch } } : s)),
      pushRecentSearch: (q) =>
        setState((s) => ({ ...s, recentSearches: [q, ...s.recentSearches.filter((r) => r !== q)].slice(0, 6) })),
      setDark: (b) => setState((s) => ({ ...s, dark: b })),
    }),
    [state, hydrated, signUp, login],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
