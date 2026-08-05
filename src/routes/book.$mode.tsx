import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, ArrowLeft, Bus, CheckCircle2, Clock, Plane, Ship, Sparkles, Ticket, Train, TrainFront, TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/transit/AppShell";
import { SmartSearch, stationByCode, type SearchState } from "@/components/transit/SmartSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CoinRedeemCard } from "@/components/booking/CoinRedeemCard";
import { PointsRedeemCard } from "@/components/booking/PointsRedeemCard";
import { FareSidebar, type FareLine } from "@/components/booking/FareSidebar";
import { MealPicker } from "@/components/booking/MealPicker";
import { PassengerPicker } from "@/components/booking/PassengerPicker";
import { PaymentFlow } from "@/components/booking/PaymentFlow";
import { PreTatkalCard } from "@/components/booking/PreTatkalCard";
import { ProbabilityBar, RouteLine } from "@/components/booking/ProbabilityBar";
import { RoutePreview } from "@/components/booking/RoutePreview";
import { ServicePreview } from "@/components/media/ServicePreview";
import { RateDialog } from "@/components/common/RateDialog";
import { StarRating } from "@/components/common/StarRating";
import { blendRating, communityRating, serviceRatingKey } from "@/lib/ratings";
import { TicketCard } from "@/components/booking/TicketCard";
import { useI18n } from "@/lib/i18n";
import {
  allocateSeats, computeFare, demandIndex, distanceKm, generateResults, meals, seatState, serviceDisruption,
  transportModes, type Segment, type TransportMode,
} from "@/lib/inventory";
import { POINT_VALUE, useStore, type Booking, type PreTatkalDraft, type SavedPassenger } from "@/lib/store";

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

type SortKey = "recommended" | "price" | "duration" | "rating";

type Step = "results" | "passengers" | "meals" | "waitlist" | "payment" | "ticket";

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
  const {
    account, hydrated, passengers, addBooking, walletBalance, coins, points, spendCoins, spendPoints,
    payFromWallet, reward, notify, paymentMethods, removeTatkalDraft, ratings,
  } = useStore();

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
  const [activeTatkalDraftId, setActiveTatkalDraftId] = useState<string | null>(null);
  const [appliedCoins, setAppliedCoins] = useState(0);
  const [appliedPoints, setAppliedPoints] = useState(0);
  // Refreshed on every search so fares stay realistic without repeating.
  const [searchNonce, setSearchNonce] = useState(() => uid());
  const [tick, setTick] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>("recommended");

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 12000);
    return () => clearInterval(id);
  }, []);

  const results = useMemo(
    () => generateResults(m, state.from, state.to, state.date, state.slot, 6, searchNonce),
    [m, state.from, state.to, state.date, state.slot, searchNonce],
  );

  const aiInterpretation = useMemo(() => {
    const q = state.query.toLowerCase();
    if (!q) return null;
    if (q.includes("cheapest") || q.includes("budget")) return "Sorted by lowest fare";
    if (q.includes("fastest")) return "Sorted by shortest duration";
    if (q.includes("ac")) return "Filtered to AC classes only";
    return null;
  }, [state.query]);

  const scoreOf = useCallback(
    (seg: Segment) => blendRating(communityRating(serviceRatingKey(m, seg.code)), ratings[serviceRatingKey(m, seg.code)]?.stars).stars,
    [m, ratings],
  );

  const sortedResults = useMemo(() => {
    let list = [...results];
    const q = state.query.toLowerCase();
    if (q.includes("ac")) {
      list = list.filter((s) => s.options.some((o) => /A|AC|CC|EC|3A|2A|1A|VOLVO|DELUXE|SUITE/.test(o.code)));
    }
    const effective =
      sortBy !== "recommended"
        ? sortBy
        : q.includes("cheapest") || q.includes("budget")
          ? "price"
          : q.includes("fastest")
            ? "duration"
            : q.includes("best") || q.includes("rated")
              ? "rating"
              : "recommended";

    if (effective === "price") {
      list.sort((a, b) => Math.min(...a.options.map((o) => o.fare)) - Math.min(...b.options.map((o) => o.fare)));
    } else if (effective === "duration") {
      list.sort((a, b) => a.durationMins - b.durationMins);
    } else if (effective === "rating") {
      list.sort((a, b) => scoreOf(b) - scoreOf(a));
    }
    return list;
  }, [results, state.query, sortBy, scoreOf]);

  const km = distanceKm(state.from, state.to);
  const demand = demandIndex(state.from, state.to, state.date);

  const submitSearch = () => {
    setSearchNonce(uid());
    navigate({
      to: "/book/$mode",
      params: { mode: m },
      search: {
        from: state.from.code, to: state.to.code, date: state.date.toISOString().slice(0, 10), slot: state.slot,
        q: state.query || undefined,
      },
    });
  };

  // RAC / Waiting List apply to trains only, and never to 1st AC.
  const racWlFor = (code: string) => m === "train" && !code.startsWith("1A") && code !== "GEN";
  const seatFor = (seg: Segment, code: string, availableBase: number) =>
    seatState(`${seg.id}-${code}`, availableBase, tick, { racWl: racWlFor(code) });

  const pickOption = (seg: Segment, code: string) => {
    const option = seg.options.find((o) => o.code === code)!;
    const st = seatFor(seg, code, option.available);
    if (st.tone === "sold") return;
    setSegment(seg);
    setClassCode(code);
    if (st.tone === "rac" || st.tone === "wl") {
      setStep("waitlist");
    } else {
      setStep("passengers");
    }
  };

  const togglePax = (id: string) => setSelectedPax((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const chosenPassengers: SavedPassenger[] = passengers.filter((p) => selectedPax.includes(p.id));
  const option = segment?.options.find((o) => o.code === classCode);
  const currentSeatState = segment && option ? seatFor(segment, option.code, option.available) : null;
  const base = option ? option.fare * Math.max(1, chosenPassengers.length) : 0;
  const surge = Math.round(base * (demand - 1 > 0 ? demand - 1 : 0));
  const gst = Math.round((base + surge) * 0.05);
  const convenience = chosenPassengers.length > 0 ? 25 + chosenPassengers.length * 5 : 0;
  const mealsTotal = Object.entries(mealQty).reduce((sum, [id, qty]) => {
    const meal = meals.find((mm) => mm.id === id);
    return sum + (meal ? meal.price * qty : 0);
  }, 0);
  const preCoinTotal = base + surge + gst + convenience + mealsTotal;
  const coinDiscount = Math.round(appliedCoins * 0.25);
  const pointDiscount = Math.min(Math.floor(appliedPoints * POINT_VALUE), Math.max(0, preCoinTotal - coinDiscount));
  const total = Math.max(0, preCoinTotal - coinDiscount - pointDiscount);

  const fareLines: FareLine[] = [
    { label: `Base fare × ${Math.max(1, chosenPassengers.length)}`, amount: base },
    { label: "Dynamic surge", amount: surge, muted: true },
    { label: "Taxes & GST (5%)", amount: gst, muted: true },
    { label: "Convenience fee", amount: convenience, muted: true },
  ];
  if (mealsTotal > 0) fareLines.push({ label: "Meals", amount: mealsTotal });
  if (coinDiscount > 0) fareLines.push({ label: "Transit Coins discount", amount: -coinDiscount });
  if (pointDiscount > 0) fareLines.push({ label: "Transit Points discount", amount: -pointDiscount });

  const showMeals = m !== "hotel" && m !== "metro";

  const goPayment = () => setStep("payment");

  const finalizeBooking = (statusOverride?: Booking["status"], statusLabel?: string) => {
    if (!segment || !option) return;
    const pnr = genPnr();
    const mealsPayload = Object.entries(mealQty)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const meal = meals.find((mm) => mm.id === id);
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
      classCode: statusLabel ? `${classCode} · ${statusLabel}` : classCode,
      passengers: chosenPassengers.length ? chosenPassengers : passengers.slice(0, 1),
      meals: mealsPayload,
      total,
      status: statusOverride ?? "confirmed",
      coach: m === "train" || m === "bus" ? `${classCode}${1 + (Math.abs(pnr.charCodeAt(0)) % 9)}` : undefined,
      seats: allocateSeats(pnr, m, classCode, (chosenPassengers.length ? chosenPassengers : passengers.slice(0, 1)).length),
      tatkal: isTatkalFlow || statusOverride === "queued",
      coinsUsed: appliedCoins,
    });
    setBooking(created);
    return created;
  };

  const onPaymentSuccess = (paidWith: string) => {
    if (paidWith === "Transit Wallet") {
      const res = payFromWallet(total, `Booking · ${segment?.name ?? "Transit India"}`);
      if (!res.ok) {
        notify({ kind: "wallet", title: "Payment failed", body: res.error ?? "Insufficient wallet balance." });
        return;
      }
      reward("wallet");
    }
    if (appliedCoins > 0) spendCoins(appliedCoins);
    if (appliedPoints > 0) spendPoints(appliedPoints, `Points redeemed · ${segment?.name ?? "booking"}`);
    const statusLabel = currentSeatState && (currentSeatState.tone === "rac" || currentSeatState.tone === "wl") ? currentSeatState.label : undefined;
    const created = finalizeBooking("confirmed", statusLabel);
    if (created) {
      if (activeTatkalDraftId) removeTatkalDraft(activeTatkalDraftId);
      reward("booking");
      if (mealsTotal > 0) reward("meal");
      if (m === "hotel") reward("hotel");
      setStep("ticket");
    }
  };

  const proceedFromTatkalDraft = (draft: PreTatkalDraft) => {
    setSegment({
      id: draft.id, mode: m, name: draft.serviceName, code: draft.classCode, depart: "—", arrive: "—",
      durationMins: 0, duration: "", distanceKm: km, tags: [],
      options: [{ code: draft.classCode, label: draft.classCode, fare: draft.total, available: 10, probability: 80 }],
    });
    setClassCode(draft.classCode);
    setSelectedPax(draft.passengerIds);
    setMealQty(Object.fromEntries(draft.mealIds.map((mi) => [mi.id, mi.qty])));
    setIsTatkalFlow(true);
    setActiveTatkalDraftId(draft.id);
    setBooking(null);
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
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[12px] text-muted-foreground">
                    Fares update live with distance ({km} km), class and demand (×{demand}).
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5" data-a11y="optional">
                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Sort</span>
                    {([
                      { id: "recommended", label: "Recommended" },
                      { id: "rating", label: "Top rated" },
                      { id: "price", label: "Cheapest" },
                      { id: "duration", label: "Fastest" },
                    ] as { id: SortKey; label: string }[]).map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setSortBy(o.id)}
                        aria-pressed={sortBy === o.id}
                        className={`rounded-full border px-2.5 py-1 text-[12px] transition ${
                          sortBy === o.id
                            ? "border-primary bg-[color:var(--brand-soft)] text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {sortedResults.map((seg, segIdx) => {
                  const disruption = serviceDisruption(seg.id);
                  const alternatives = sortedResults.filter((s) => s.id !== seg.id).slice(0, 2);
                  return (
                    <Card key={seg.id} className="rounded-2xl border-border/70 bg-card/70 p-4 backdrop-blur">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <ServicePreview
                            mode={m}
                            seed={seg.code}
                            alt={`${seg.name} preview`}
                            className="w-24 shrink-0 sm:w-32"
                            ratio="aspect-[4/3]"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold">{seg.name}</div>
                            <div className="text-[12px] text-muted-foreground">{seg.code}{seg.operator ? ` · ${seg.operator}` : ""}</div>
                            <div className="mt-1.5">
                              <RateDialog
                                ratingKey={serviceRatingKey(m, seg.code)}
                                title={seg.name}
                                subtitle="Rate this service so other travellers can pick the best option on this route."
                                compact
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {disruption.cancelled && (
                            <Badge className="rounded-full border-none bg-destructive text-white text-[10px]">Cancelled</Badge>
                          )}
                          {!disruption.cancelled && disruption.delayMins > 0 && (
                            <Badge variant="outline" className="rounded-full border-[color:var(--accent-orange)]/40 text-[10px] text-[color:var(--accent-orange)]">
                              Delayed by {disruption.delayMins}m
                            </Badge>
                          )}
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

                      <RoutePreview mode={m} origin={state.from.city} destination={state.to.city} km={seg.distanceKm} totalMins={seg.durationMins} seed={seg.id} />

                      <Separator className="my-3" />

                      {disruption.cancelled ? (
                        <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                          <div className="flex items-center gap-2 text-[13px] font-medium text-destructive">
                            <AlertTriangle className="h-4 w-4" /> Service cancelled — {disruption.reason}
                          </div>
                          <p className="text-[12px] text-muted-foreground">
                            Full refund is automatically eligible if you had already booked this service. Try one of these instead:
                          </p>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {alternatives.map((alt) => (
                              <div key={alt.id} className="rounded-xl border border-border bg-background/70 p-2.5 text-[12px]">
                                <div className="font-medium">{alt.name}</div>
                                <div className="text-muted-foreground">{alt.depart} → {alt.arrive}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {seg.options.map((o) => {
                            const st = seatFor(seg, o.code, o.available);
                            const toneClass = st.tone === "sold" ? "text-destructive" : st.tone === "wl" ? "text-destructive" : st.tone === "rac" ? "text-[color:var(--accent-orange)]" : st.tone === "low" ? "text-[color:var(--accent-orange)]" : "text-[color:var(--success)]";
                            return (
                              <div
                                key={o.code}
                                role="button"
                                tabIndex={st.tone === "sold" ? -1 : 0}
                                aria-disabled={st.tone === "sold"}
                                onClick={() => st.tone !== "sold" && pickOption(seg, o.code)}
                                onKeyDown={(e) => {
                                  if (st.tone === "sold") return;
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    pickOption(seg, o.code);
                                  }
                                }}
                                className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-background/70 p-3 text-left transition hover:border-primary/40 hover:-translate-y-0.5 ${st.tone === "sold" ? "pointer-events-none opacity-50" : ""}`}
                              >
                                <div>
                                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{o.label}</div>
                                  <div className="text-base font-bold">{formatCurrency(o.fare)}</div>
                                  <div className={`text-[11px] font-medium ${toneClass}`}>{st.label}</div>
                                  <ProbabilityBar probability={o.probability} className="mt-1.5 w-32" />
                                </div>
                                <Button size="sm" className="rounded-full brand-gradient text-white" disabled={st.tone === "sold"}>
                                  {st.tone === "sold" ? "Sold Out" : "Book"}
                                </Button>
                              </div>

                            );
                          })}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              <div className="space-y-4">
                <Card className="glass-card rounded-2xl p-4" data-a11y="optional">
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
                  <PreTatkalCard
                    segments={sortedResults}
                    fromCode={state.from.code}
                    toCode={state.to.code}
                    date={state.date.toISOString().slice(0, 10)}
                    onProceedToPayment={proceedFromTatkalDraft}
                  />
                )}
              </div>
            </div>
          </motion.section>
        )}

        {step === "waitlist" && segment && option && currentSeatState && (
          <motion.section key="waitlist" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <BackButton onClick={() => setStep("results")} />
            <Card className="mx-auto max-w-xl rounded-2xl p-6">
              <div className="flex items-center gap-2 text-[color:var(--accent-orange)]">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-semibold">{currentSeatState.label} on {segment.name}</span>
              </div>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {currentSeatState.tone === "rac"
                  ? "RAC (Reservation Against Cancellation) confirms a shared berth now, and may upgrade to a full berth before departure."
                  : "This class is currently waitlisted. Waitlisted tickets confirm automatically as seats free up before charting; they're auto-cancelled if not confirmed by chart preparation."}
              </p>

              <div className="mt-4 space-y-2">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Alternative departures on this route</div>
                {sortedResults.filter((s) => s.id !== segment.id).slice(0, 3).map((alt) => (
                  <div key={alt.id} className="flex items-center justify-between rounded-xl border border-border bg-background/70 p-3 text-[13px]">
                    <div>
                      <div className="font-medium">{alt.name}</div>
                      <div className="text-muted-foreground">{alt.depart} → {alt.arrive}</div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => pickOption(alt, alt.options[0].code)}>View</Button>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => setStep("results")}>Try another date</Button>
                <Button className="rounded-full brand-gradient text-white" onClick={() => setStep("passengers")}>
                  Continue with {currentSeatState.label}
                </Button>
                <Button asChild variant="ghost" className="rounded-full">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </Card>
          </motion.section>
        )}

        {step === "passengers" && segment && option && (
          <motion.section key="passengers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <BackButton onClick={() => setStep("results")} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
              <Card className="rounded-2xl p-5">
                <div className="text-sm font-semibold">Select or add passengers</div>
                <p className="mt-1 text-[13px] text-muted-foreground">{segment.name} · {option.label} · {formatDate(state.date)}</p>
                {currentSeatState && (currentSeatState.tone === "rac" || currentSeatState.tone === "wl") && (
                  <Badge variant="outline" className="mt-2 rounded-full border-[color:var(--accent-orange)]/40 text-[10px] text-[color:var(--accent-orange)]">
                    Booking as {currentSeatState.label}
                  </Badge>
                )}
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
                  <MealPicker
                    quantities={mealQty}
                    passengerCount={Math.max(1, chosenPassengers.length)}
                    onChange={(id, qty) => setMealQty((m2) => ({ ...m2, [id]: qty }))}
                  />
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
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-[1fr_280px]">
              <PaymentFlow total={total} walletBalance={walletBalance} paymentMethods={paymentMethods} onSuccess={onPaymentSuccess} />
              <div className="space-y-4">
                <CoinRedeemCard coins={coins} total={preCoinTotal} applied={appliedCoins} onApply={setAppliedCoins} />
                <PointsRedeemCard
                  points={points}
                  total={Math.max(0, preCoinTotal - coinDiscount)}
                  applied={appliedPoints}
                  onApply={setAppliedPoints}
                />
              </div>
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
