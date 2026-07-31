import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Bus, CheckCircle2, Plane, Shield, Ship, Sparkles, Ticket, Train, TrainFront, TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/transit/AppShell";
import { SmartSearch, stationByCode, type SearchState } from "@/components/transit/SmartSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FareSidebar, type FareLine } from "@/components/booking/FareSidebar";
import { MealPicker } from "@/components/booking/MealPicker";
import { PassengerPicker } from "@/components/booking/PassengerPicker";
import { PaymentFlow } from "@/components/booking/PaymentFlow";
import { PreTatkalCard } from "@/components/booking/PreTatkalCard";
import { ProbabilityBar, RouteLine } from "@/components/booking/ProbabilityBar";
import { TicketCard } from "@/components/booking/TicketCard";
import { useI18n } from "@/lib/i18n";
import {
  computeFare, demandIndex, distanceKm, generateResults, transportModes, type Segment, type TransportMode,
} from "@/lib/inventory";
import { useStore, type Booking, type SavedPassenger } from "@/lib/store";

type Search = { from?: string; to?: string; date?: string; slot?: string; q?: string };

export const Route = createFileRoute("/book/$mode")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    from: typeof search.from === "string" ? search.from : undefined,
    to: typeof search.to === "string" ? search.to : undefined,
    date: typeof search.date === "string" ? search.date : undefined,
    slot: typeof search.slot === "string" ? search.slot : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `Book ${params.mode} — Transit India` },
      { name: "description", content: `Search, compare and book ${params.mode} tickets with live fares, confirmation probability and Pre-Tatkal queueing.` },
    ],
  }),
  component: BookPage,
});

const modeIcons: Record<TransportMode, typeof Train> = {
  train: Train, bus: Bus, flight: Plane, hotel: Ticket, metro: TrainFront, ferry: Ship,
};

type Step = "results" | "passengers" | "meals" | "payment" | "ticket";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function genPnr() {
  let s = "";
  for (let i = 0; i < 10; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function BookPage() {
  const { mode } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { t, formatCurrency, formatDate } = useI18n();
  const { account, hydrated, passengers, addBooking, updateBooking } = useStore();

  const m = (transportModes.some((x) => x.id === mode) ? mode : "train") as TransportMode;

  const [state, setState] = useState<SearchState>(() => ({
    from: stationByCode(search.from),
    to: stationByCode(search.to, search.from === "JP" ? "NDLS" : "JP"),
    date: search.date ? new Date(search.date) : (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })(),
    slot: search.slot ?? "morning",
    query: search.q ?? "",
  }));

  useEffect(() => {
    if (hydrated && !account) navigate({ to: "/auth" });
  }, [hydrated, account, navigate]);

  const [step, setStep] = useState<Step>("results");
  const [segment, setSegment] = useState<Segment | null>(null);
  const [classCode, setClassCode] = useState<string>("");
  const [selectedPax, setSelectedPax] = useState<string[]>([]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [mealQty, setMealQty] = useState<Record<string, number>>({});
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isTatkalFlow, setIsTatkalFlow] = useState(false);

  const results = useMemo(
    () => generateResults(m, state.from, state.to, state.date, state.slot, 6),
    [m, state.from, state.to, state.date, state.slot],
  );

  const aiInterpretation = useMemo(() => {
    const q = state.query.toLowerCase();
    if (!q) return null;
    if (q.includes("cheapest") || q.includes("budget")) return "Sorted by lowest fare";
    if (q.includes("fastest")) return "Sorted by shortest duration";
    if (q.includes("ac")) return "Filtered to AC classes only";
    return null;
  }, [state.query]);

  const sortedResults = useMemo(() => {
    let list = [...results];
    const q = state.query.toLowerCase();
    if (q.includes("cheapest") || q.includes("budget")) {
      list.sort((a, b) => Math.min(...a.options.map((o) => o.fare)) - Math.min(...b.options.map((o) => o.fare)));
    } else if (q.includes("fastest")) {
      list.sort((a, b) => a.durationMins - b.durationMins);
    } else if (q.includes("ac")) {
      list = list.filter((s) => s.options.some((o) => /A|AC|CC|EC|3A|2A|1A|VOLVO|DELUXE|SUITE/.test(o.code)));
    }
    return list;
  }, [results, state.query]);

  const km = distanceKm(state.from, state.to);
  const demand = demandIndex(state.from, state.to, state.date);

  const submitSearch = () => {
    navigate({
      to: "/book/$mode",
      params: { mode: m },
      search: {
        from: state.from.code, to: state.to.code, date: state.date.toISOString().slice(0, 10), slot: state.slot,
        q: state.query || undefined,
      },
    });
  };

  const pickOption = (seg: Segment, code: string) => {
    setSegment(seg);
    setClassCode(code);
    setStep("passengers");
  };

  const togglePax = (id: string) => setSelectedPax((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const chosenPassengers: SavedPassenger[] = passengers.filter((p) => selectedPax.includes(p.id));
  const option = segment?.options.find((o) => o.code === classCode);
  const base = option ? option.fare * Math.max(1, chosenPassengers.length) : 0;
  const surge = Math.round(base * (demand - 1 > 0 ? demand - 1 : 0));
  const gst = Math.round((base + surge) * 0.05);
  const convenience = chosenPassengers.length > 0 ? 25 + chosenPassengers.length * 5 : 0;
  const mealsTotal = Object.entries(mealQty).reduce((sum, [id, qty]) => {
    const meal = require("@/lib/inventory").meals.find((mm: any) => mm.id === id);
    return sum + (meal ? meal.price * qty : 0);
  }, 0);
  const total = base + surge + gst + convenience + mealsTotal;

  const fareLines: FareLine[] = [
    { label: `Base fare × ${Math.max(1, chosenPassengers.length)}`, amount: base },
    { label: "Dynamic surge", amount: surge, muted: true },
    { label: "Taxes & GST (5%)", amount: gst, muted: true },
    { label: "Convenience fee", amount: convenience, muted: true },
  ];
  if (mealsTotal > 0) fareLines.push({ label: "Meals", amount: mealsTotal });

  const showMeals = m !== "hotel" && m !== "metro";

  const goPayment = () => setStep("payment");

  const finalizeBooking = (statusOverride?: Booking["status"]) => {
    if (!segment || !option) return;
    const pnr = genPnr();
    const mealsPayload = Object.entries(mealQty)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const meal = require("@/lib/inventory").meals.find((mm: any) => mm.id === id);
        return { id, name: meal?.name ?? id, price: meal?.price ?? 0, qty };
      });
    const created = addBooking({
      pnr,
      mode: m,
      serviceName: segment.name,
      serviceCode: segment.code,
      fromCode: state.from.code,
      fromCity: state.from.city,
      toCode: state.to.code,
      toCity: state.to.city,
      date: state.date.toISOString().slice(0, 10),
      depart: segment.depart,
      arrive: segment.arrive,
      classCode,
      passengers: chosenPassengers.length ? chosenPassengers : passengers.slice(0, 1),
      meals: mealsPayload,
      total,
      status: statusOverride ?? "confirmed",
      coach: m === "train" || m === "bus" ? `${classCode}${1 + (Math.abs(pnr.charCodeAt(0)) % 9)}` : undefined,
      seats: [`${10 + (Number(pnr.slice(-2)) % 60)}`],
      tatkal: statusOverride === "queued",
    });
    setBooking(created);
    return created;
  };

  const onPaymentSuccess = () => {
    const created = finalizeBooking("confirmed");
    if (created) setStep("ticket");
  };

  const saveForTatkal = () => {
    if (!segment || !option) return;
    finalizeBooking("queued");
    setStep("results");
  };

  const completeTatkalPayment = (b: Booking) => {
    setSegment({
      id: b.id, mode: m, name: b.serviceName, code: b.serviceCode, depart: b.depart, arrive: b.arrive,
      durationMins: 0, duration: "", distanceKm: km, tags: [],
      options: [{ code: b.classCode, label: b.classCode, fare: Math.round(b.total), available: 10, probability: 80 }],
    });
    setClassCode(b.classCode);
    setSelectedPax(b.passengers.map((p) => p.id));
    setIsTatkalFlow(true);
    setBooking(b);
    setStep("payment");
  };

  if (!hydrated || !account) return null;

  return (
    <AppShell wide>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {transportModes.map((tm) => {
          const Icon = modeIcons[tm.id];
          return (
            <button
              key={tm.id}
              onClick={() =>
                navigate({
                  to: "/book/$mode",
                  params: { mode: tm.id },
                  search: { from: state.from.code, to: state.to.code, date: state.date.toISOString().slice(0, 10), slot: state.slot, q: undefined },
                })
              }
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition ${
                tm.id === m ? "border-primary bg-[color:var(--brand-soft)] text-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {tm.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === "results" && (
          <motion.section key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <SmartSearch mode={m} value={state} onChange={(p) => setState((s) => ({ ...s, ...p }))} onSubmit={submitSearch} compact />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                {aiInterpretation && (
                  <Badge variant="outline" className="rounded-full border-primary/40 bg-[color:var(--brand-soft)] px-3 py-1 text-[11px] text-primary">
                    <Sparkles className="mr-1.5 h-3 w-3" /> AI applied: {aiInterpretation}
                  </Badge>
                )}
                <p className="text-[12px] text-muted-foreground">
                  Fares update live with distance ({km} km), class and demand (×{demand}).
                </p>

                {sortedResults.map((seg) => (
                  <Card key={seg.id} className="rounded-2xl border-border/70 bg-card/70 p-4 backdrop-blur">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{seg.name}</div>
                        <div className="text-[12px] text-muted-foreground">{seg.code}{seg.operator ? ` · ${seg.operator}` : ""}</div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {seg.tags.map((tg) => (
                          <Badge key={tg} variant="outline" className="rounded-full text-[10px]">{tg}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      {m === "hotel" ? (
                        <div className="text-sm text-muted-foreground">Check-in {seg.depart} · Check-out {seg.arrive} · {seg.duration}</div>
                      ) : (
                        <RouteLine depart={seg.depart} arrive={seg.arrive} duration={seg.duration} />
                      )}
                    </div>

                    <Separator className="my-3" />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {seg.options.map((o) => (
                        <button
                          key={o.code}
                          onClick={() => pickOption(seg, o.code)}
                          className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background/70 p-3 text-left transition hover:border-primary/40 hover:-translate-y-0.5"
                        >
                          <div>
                            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{o.label}</div>
                            <div className="text-base font-bold">{formatCurrency(o.fare)}</div>
                            <div className="text-[11px] text-muted-foreground">{o.available} left</div>
                            <ProbabilityBar probability={o.probability} className="mt-1.5 w-32" />
                          </div>
                          <Button size="sm" className="rounded-full brand-gradient text-white">Book</Button>
                        </button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Card className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-primary" /> Alternative travel</div>
                  <div className="mt-3 space-y-2">
                    {["bus", "metro"].filter((alt) => alt !== m).map((alt) => (
                      <div key={alt} className="rounded-xl border border-border bg-background/70 p-3 text-[13px]">
                        <div className="font-medium capitalize">{alt} via {state.from.city} → {state.to.city}</div>
                        <div className="text-muted-foreground">
                          from {formatCurrency(computeFare(km, alt === "metro" ? "TOKEN" : "SEATER", demand, alt === "metro" ? 1.4 : 0.5))} · cheaper option
                        </div>
                      </div>
                    ))}
                    <div className="rounded-xl border border-dashed border-border p-3 text-[13px] text-muted-foreground">
                      Metro + Bus combo: connect via nearest hub for a lower total fare.
                    </div>
                  </div>
                </Card>

                {m === "train" && (
                  <PreTatkalCard onSaveQueued={saveForTatkal} onCompletePayment={completeTatkalPayment} />
                )}
              </div>
            </div>
          </motion.section>
        )}

        {step === "passengers" && segment && option && (
          <motion.section key="passengers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <BackButton onClick={() => setStep("results")} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
              <Card className="rounded-2xl p-5">
                <div className="text-sm font-semibold">Select or add passengers</div>
                <p className="mt-1 text-[13px] text-muted-foreground">{segment.name} · {option.label} · {formatDate(state.date)}</p>
                <div className="mt-4">
                  <PassengerPicker selected={selectedPax} onToggle={togglePax} />
                </div>

                <Separator className="my-5" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Contact email</Label>
                    <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Contact mobile</Label>
                    <Input value={contactMobile} onChange={(e) => setContactMobile(e.target.value)} placeholder="98xxxxxxx" />
                  </div>
                </div>

                <Button
                  disabled={selectedPax.length === 0}
                  onClick={() => setStep(showMeals ? "meals" : "payment")}
                  className="mt-5 w-full rounded-full brand-gradient text-white disabled:opacity-50"
                >
                  Continue
                </Button>
              </Card>
              <FareSidebar lines={fareLines} total={total} note="Base fare scales with distance, class multiplier and current demand." />
            </div>
          </motion.section>
        )}

        {step === "meals" && segment && option && (
          <motion.section key="meals" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <BackButton onClick={() => setStep("passengers")} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
              <Card className="rounded-2xl p-5">
                <div className="text-sm font-semibold">Add meals (optional)</div>
                <div className="mt-4">
                  <MealPicker quantities={mealQty} onChange={(id, qty) => setMealQty((m2) => ({ ...m2, [id]: qty }))} />
                </div>
                <Button onClick={goPayment} className="mt-5 w-full rounded-full brand-gradient text-white">Continue to payment</Button>
              </Card>
              <FareSidebar lines={fareLines} total={total} />
            </div>
          </motion.section>
        )}

        {step === "payment" && (
          <motion.section key="payment" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {!isTatkalFlow && <BackButton onClick={() => setStep(showMeals ? "meals" : "passengers")} />}
            <div className="mx-auto max-w-lg">
              <PaymentFlow total={isTatkalFlow && booking ? booking.total : total} onSuccess={onPaymentSuccess} />
            </div>
          </motion.section>
        )}

        {step === "ticket" && booking && (
          <motion.section key="ticket" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-[color:var(--success)]">
              <CheckCircle2 className="h-5 w-5" /> <span className="text-sm font-semibold">Booking confirmed</span>
            </div>
            <TicketCard booking={booking} />
          </motion.section>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mb-4 flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> Back
    </button>
  );
}
