import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandIcon } from "@/components/brand/BrandAssets";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, Search, Ticket as TicketIcon, TrainFront } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/transit/AppShell";
import { TicketCard } from "@/components/booking/TicketCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { useStore, type Booking } from "@/lib/store";
import { cn } from "@/lib/utils";

type Search = { pnr?: string };

export const Route = createFileRoute("/pnr")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    pnr: typeof search.pnr === "string" ? search.pnr : undefined,
  }),
  head: () => ({
    meta: [
      { title: "PNR status & live journey tracking — TripSync" },
      { name: "description", content: "Check a booking status by PNR, service number or passenger name and follow the prototype live journey progress." },
      { property: "og:title", content: "PNR status — TripSync" },
      { property: "og:description", content: "Prototype PNR tracking with chart status, coach, platform and live journey progress." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PnrPage,
});

const chartStatuses = ["Chart not prepared", "Chart prepared", "Chart prepared"] as const;

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function PnrPage() {
  const { pnr: initial } = Route.useSearch();
  const { bookings, hydrated } = useStore();
  const { formatDate } = useI18n();
  const [query, setQuery] = useState(initial ?? "");
  const [submitted, setSubmitted] = useState(initial ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [submitted]);

  const result: Booking | undefined = useMemo(() => {
    const q = submitted.trim().toLowerCase();
    if (!q) return undefined;
    return bookings.find(
      (b) =>
        b.pnr.toLowerCase() === q ||
        b.serviceCode.toLowerCase() === q ||
        b.serviceName.toLowerCase().includes(q) ||
        b.passengers.some((p) => p.fullName.toLowerCase().includes(q)),
    );
  }, [bookings, submitted]);

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex min-w-0 items-start gap-4">
          <BrandIcon name="pnr" label="PNR status" size={72} className="shrink-0 sm:!h-20 sm:!w-20" eager />
          <div className="min-w-0 space-y-2">
            <Badge variant="secondary" className="rounded-full">Prototype tracking</Badge>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">PNR status</h1>
            <p className="max-w-2xl text-[13px] text-muted-foreground">
              Search by PNR, service number or passenger name. All journeys, charts and platforms shown here are
              fictional demonstration data.
            </p>
          </div>
        </header>

        <Card className="glass-card rounded-3xl border-border/60 p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(query);
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 8412567390, EX-2241 or Aarav Sharma"
                className="h-11 rounded-full pl-9"
                aria-label="PNR, service number or passenger name"
              />
            </div>
            <Button type="submit" className="h-11 rounded-full brand-gradient px-6 text-white">
              Check status
            </Button>
          </form>
          {bookings.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Your PNRs</span>
              {bookings.slice(0, 5).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setQuery(b.pnr);
                    setSubmitted(b.pnr);
                  }}
                  className="rounded-full border border-border/60 px-3 py-1 text-[12px] text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  {b.pnr}
                </button>
              ))}
            </div>
          )}
        </Card>

        {!hydrated || (loading && submitted) ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        ) : submitted && !result ? (
          <Card className="grid place-items-center gap-3 rounded-3xl border-border/60 p-12 text-center">
            <TicketIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No booking matches “{submitted}”</p>
            <p className="max-w-sm text-[13px] text-muted-foreground">
              This prototype only tracks journeys booked on this device. Book a trip and its PNR will appear here
              instantly.
            </p>
            <Button asChild className="rounded-full brand-gradient text-white">
              <Link to="/book/$mode" params={{ mode: "train" }}>Book a journey</Link>
            </Button>
          </Card>
        ) : result ? (
          <StatusPanel booking={result} formatDate={formatDate} />
        ) : (
          <Card className="grid place-items-center gap-3 rounded-3xl border-dashed border-border/60 p-12 text-center">
            <TrainFront className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Enter a PNR to begin</p>
            <p className="max-w-sm text-[13px] text-muted-foreground">
              Every booking made in this prototype generates a 10-digit PNR you can track here.
            </p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function StatusPanel({ booking, formatDate }: { booking: Booking; formatDate: (d: string) => string }) {
  const seed = hash(booking.pnr);
  const chart = chartStatuses[seed % chartStatuses.length];
  const platform = 1 + (seed % 12);
  const progress = booking.status === "confirmed" ? 35 + (seed % 50) : 0;

  const stages = [
    { label: "Booked", done: true },
    { label: "Chart status", done: chart !== "Chart not prepared" },
    { label: "Boarding", done: progress > 30 },
    { label: "In journey", done: progress > 60 },
    { label: "Arrived", done: progress >= 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <Card className="rounded-3xl border-border/60 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">PNR {booking.pnr}</div>
            <h2 className="mt-1 text-lg font-semibold">{booking.serviceName} · {booking.serviceCode}</h2>
            <p className="text-[13px] text-muted-foreground">
              {booking.fromCity} ({booking.fromCode}) → {booking.toCity} ({booking.toCode})
            </p>
            <p className="text-[12px] text-muted-foreground">
              {formatDate(booking.date)} · {booking.depart}–{booking.arrive}
            </p>
          </div>
          <Badge className="rounded-full border-none capitalize">{booking.status}</Badge>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            { icon: TicketIcon, label: "Class", value: booking.classCode },
            { icon: TrainFront, label: "Coach", value: booking.coach ?? "—" },
            { icon: MapPin, label: "Platform", value: `PF ${platform}` },
            { icon: Clock, label: "Chart", value: chart },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border/60 bg-muted/40 p-3">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                <s.icon className="h-3.5 w-3.5" /> {s.label}
              </div>
              <div className="mt-1 text-[13px] font-medium">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-[12px] text-muted-foreground">
            <span>Live journey progress (prototype)</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex flex-wrap gap-3 pt-1">
            {stages.map((st) => (
              <div
                key={st.label}
                className={cn(
                  "flex items-center gap-1.5 text-[12px]",
                  st.done ? "text-primary" : "text-muted-foreground",
                )}
              >
                <CheckCircle2 className={cn("h-3.5 w-3.5", !st.done && "opacity-40")} /> {st.label}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <TicketCard booking={booking} />
    </motion.div>
  );
}
