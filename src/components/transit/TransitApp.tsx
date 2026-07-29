import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowRightLeft,
  Armchair,
  Bus,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  Download,
  IndianRupee,
  MapPin,
  Mic,
  Moon,
  Route as RouteIcon,
  Search,
  Share2,
  Shield,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Timer,
  Train as TrainIcon,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  alternatives,
  savedPassengers,
  stations,
  suggestions,
  timeSlots,
  trains,
  travelClasses,
  type Passenger,
  type Station,
  type Train,
} from "@/lib/dummy-data";

type Screen = "search" | "results" | "passengers" | "payment" | "confirmed";


export function TransitApp() {
  const [screen, setScreen] = useState<Screen>("search");
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("Cheapest AC train from Delhi to Jaipur tomorrow morning");
  const [listening, setListening] = useState(false);
  const [from, setFrom] = useState<Station>(stations.find((s) => s.code === "NDLS")!);
  const [to, setTo] = useState<Station>(stations.find((s) => s.code === "JP")!);
  const [date, setDate] = useState<Date>(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d;
  });
  const [slot, setSlot] = useState<string>("morning");
  const [travelClass, setTravelClass] = useState<string>("ALL");
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("CC");
  const [chosen, setChosen] = useState<string[]>(["p1", "p2"]);
  const [paying, setPaying] = useState(false);
  const [pnr] = useState(() => Math.floor(1000000000 + Math.random() * 9000000000).toString());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const chosenPassengers = useMemo(
    () => savedPassengers.filter((p) => chosen.includes(p.id)),
    [chosen],
  );

  const cls = selectedTrain?.classes.find((c) => c.code === selectedClass) ?? selectedTrain?.classes[0];
  const base = (cls?.fare ?? 0) * chosenPassengers.length;
  const taxes = Math.round(base * 0.05);
  const conv = chosenPassengers.length ? 20 : 0;
  const total = base + taxes + conv;

  const swap = () => { const a = from; setFrom(to); setTo(a); };

  return (
    <div className="min-h-screen">
      <Header dark={dark} setDark={setDark} />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pt-10">
        <AnimatePresence mode="wait">
          {screen === "search" && (
            <SearchScreen
              key="s"
              query={query} setQuery={setQuery}
              listening={listening} setListening={setListening}
              from={from} setFrom={setFrom}
              to={to} setTo={setTo}
              date={date} setDate={setDate}
              slot={slot} setSlot={setSlot}
              travelClass={travelClass} setTravelClass={setTravelClass}
              onSwap={swap}
              onSearch={() => setScreen("results")}
            />
          )}

          {screen === "results" && (
            <ResultsScreen
              key="r"
              query={query}
              from={from} to={to} date={date} slot={slot} travelClass={travelClass}
              onBack={() => setScreen("search")}
              onPick={(t, c) => {
                setSelectedTrain(t);
                setSelectedClass(c);
                setScreen("passengers");
              }}
            />
          )}



          {screen === "passengers" && selectedTrain && cls && (
            <PassengersScreen
              key="p"
              train={selectedTrain}
              classCode={selectedClass}
              chosen={chosen}
              setChosen={setChosen}
              base={base}
              taxes={taxes}
              conv={conv}
              total={total}
              onBack={() => setScreen("results")}
              onPay={() => setScreen("payment")}
            />
          )}

          {screen === "payment" && (
            <PaymentScreen
              key="pay"
              total={total}
              paying={paying}
              setPaying={setPaying}
              onDone={() => setScreen("confirmed")}
              onBack={() => setScreen("passengers")}
            />
          )}

          {screen === "confirmed" && selectedTrain && (
            <ConfirmedScreen
              key="c"
              train={selectedTrain}
              classCode={selectedClass}
              passengers={chosenPassengers}
              pnr={pnr}
              total={total}
              onNew={() => setScreen("search")}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ---------------- Header ---------------- */

function Header({ dark, setDark }: { dark: boolean; setDark: (b: boolean) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-lg brand-gradient">
            <TrainIcon className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight">Transit India</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Rail · Bus · Metro</div>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a className="hover:text-foreground">Trains</a>
          <a className="hover:text-foreground">Buses</a>
          <a className="hover:text-foreground">PNR</a>
          <a className="hover:text-foreground">Tatkal</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" className="rounded-full">
            <UserRound className="mr-1.5 h-4 w-4" /> Aarav
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Search ---------------- */

function SearchScreen({
  query, setQuery, listening, setListening, onSearch,
}: {
  query: string; setQuery: (s: string) => void;
  listening: boolean; setListening: (b: boolean) => void; onSearch: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="mx-auto max-w-3xl pt-6"
    >
      <div className="mb-6 flex justify-center">
        <Badge variant="outline" className="rounded-full border-border/70 bg-background/60 px-3 py-1 text-[11px] font-medium backdrop-blur">
          <Sparkles className="mr-1.5 h-3 w-3 text-[color:var(--accent-orange)]" />
          New — AI powered booking
        </Badge>
      </div>

      <h1 className="text-center text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        Book your journey with a <span className="text-brand-gradient">single sentence.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-[15px] text-muted-foreground">
        No forms. No dropdowns. Just tell Transit India where you're going, and we'll find the fastest, cheapest and smartest way there.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); onSearch(); }}
        className="glass-card mx-auto mt-10 flex items-center gap-2 rounded-full p-2 pl-5"
      >
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Cheapest AC train from Delhi to Jaipur tomorrow morning"
          className="h-12 flex-1 border-0 bg-transparent text-[15px] shadow-none focus-visible:ring-0"
        />
        <button
          type="button"
          onClick={() => { setListening(!listening); setTimeout(() => setListening(false), 1500); }}
          className={`grid h-11 w-11 place-items-center rounded-full transition ${
            listening ? "bg-[color:var(--accent-orange)]/20 text-[color:var(--accent-orange)] pulse-ring" : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
          aria-label="Voice search"
        >
          <Mic className="h-4 w-4" />
        </button>
        <Button type="submit" className="h-11 rounded-full px-5 text-white brand-gradient">
          Search <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </form>

      <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setQuery(s)}
            className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard icon={<Zap className="h-5 w-5" />} title="Tatkal Ready Queue" text="Prepare in advance. We auto-submit the moment the counter opens." />
        <FeatureCard icon={<Shield className="h-5 w-5" />} title="Confirmation probability" text="See real chance of getting a berth before you book — not after." />
        <FeatureCard icon={<RouteIcon className="h-5 w-5" />} title="Smart alternatives" text="Sold out? We stitch trains, buses and metros into the fastest path." />
      </div>
    </motion.section>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/70 p-5 backdrop-blur">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--brand-soft)] text-primary">
        {icon}
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{text}</div>
    </Card>
  );
}

/* ---------------- Results ---------------- */

function ResultsScreen({
  query, onBack, onPick,
}: { query: string; onBack: () => void; onPick: (t: Train, c: string) => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div>
        <button onClick={onBack} className="mb-4 text-xs text-muted-foreground hover:text-foreground">← Modify search</button>
        <Card className="glass-card mb-5 rounded-2xl p-4">
          <div className="flex items-center gap-3 text-sm">
            <Sparkles className="h-4 w-4 text-[color:var(--accent-orange)]" />
            <div className="flex-1 truncate text-muted-foreground">"{query}"</div>
            <Badge className="rounded-full bg-[color:var(--brand-soft)] text-primary">6 matches</Badge>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
            <Pill><TrainIcon className="mr-1 h-3.5 w-3.5" /> NDLS → JP</Pill>
            <Pill>Tue, 30 Jul · Morning</Pill>
            <Pill>AC classes only</Pill>
            <Pill>Sorted by fare</Pill>
          </div>
        </Card>

        <TatkalCard />

        <div className="mt-6 space-y-4">
          {trains.map((t, i) => (
            <TrainCard key={t.id} train={t} index={i} onPick={onPick} />
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <Card className="rounded-2xl border-border/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <RouteIcon className="h-4 w-4 text-primary" /> Alternative travel
          </div>
          <div className="space-y-2">
            {alternatives.map((a) => (
              <div key={a.id} className="group flex items-start gap-3 rounded-xl border border-transparent p-2 hover:border-border hover:bg-accent/40">
                <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                  {a.icon === "bus" ? <Bus className="h-4 w-4" /> :
                   a.icon === "route" ? <RouteIcon className="h-4 w-4" /> :
                   a.icon === "coins" ? <Coins className="h-4 w-4" /> :
                   <TrainIcon className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{a.kind}</div>
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-[12px] text-muted-foreground">{a.detail}</div>
                </div>
                <ChevronRight className="mt-2 h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </motion.section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{children}</span>;
}

function TatkalCard() {
  const target = useMemo(() => {
    const d = new Date();
    d.setHours(10, 0, 0, 0);
    if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
    return d.getTime();
  }, []);
  const [left, setLeft] = useState(target - Date.now());
  useEffect(() => {
    const i = setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(i);
  }, [target]);
  const open = left <= 0;
  const h = Math.max(0, Math.floor(left / 3.6e6));
  const m = Math.max(0, Math.floor((left % 3.6e6) / 6e4));
  const s = Math.max(0, Math.floor((left % 6e4) / 1000));

  return (
    <Card className="overflow-hidden rounded-2xl border-[color:var(--accent-orange)]/30 bg-gradient-to-br from-[color:var(--accent-orange)]/10 via-transparent to-transparent p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[color:var(--accent-orange)]/20 text-[color:var(--accent-orange)]">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">Tatkal Ready Queue</div>
              <Badge variant="outline" className="rounded-full border-[color:var(--accent-orange)]/40 text-[10px] text-[color:var(--accent-orange)]">AC · 10:00 AM</Badge>
            </div>
            <div className="mt-1 text-[13px] text-muted-foreground">
              Prepare passengers & payment now — we'll auto-submit the second booking opens.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-lg font-semibold tabular-nums">
            <TimeChunk v={h} l="h" />
            <span className="text-muted-foreground">:</span>
            <TimeChunk v={m} l="m" />
            <span className="text-muted-foreground">:</span>
            <TimeChunk v={s} l="s" />
          </div>
          <Button className={`rounded-full ${open ? "bg-[color:var(--success)] text-white" : "brand-gradient text-white"}`}>
            {open ? <>Book instantly <Zap className="ml-1.5 h-4 w-4" /></> : <>Prepare booking <ArrowRight className="ml-1.5 h-4 w-4" /></>}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function TimeChunk({ v, l }: { v: number; l: string }) {
  return (
    <span className="relative rounded-md bg-background/80 px-1.5 py-0.5 shadow-sm ring-1 ring-border">
      {v.toString().padStart(2, "0")}
      <span className="ml-0.5 text-[9px] font-normal uppercase text-muted-foreground">{l}</span>
    </span>
  );
}

function TrainCard({ train, index, onPick }: { train: Train; index: number; onPick: (t: Train, c: string) => void }) {
  const [cls, setCls] = useState(train.classes[0].code);
  const active = train.classes.find((c) => c.code === cls)!;
  const probColor = active.probability >= 85 ? "text-[color:var(--success)]" : active.probability >= 50 ? "text-[color:var(--accent-orange)]" : "text-destructive";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="rounded-2xl border-border/70 p-5 transition hover:border-primary/40 hover:shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-[15px] font-semibold">{train.name}</div>
              <Badge variant="secondary" className="rounded-full text-[10px]">#{train.number}</Badge>
              <Badge className="rounded-full bg-[color:var(--brand-soft)] text-[10px] text-primary">{train.type}</Badge>
            </div>
            <div className="mt-0.5 flex flex-wrap gap-1.5">
              {train.tags?.map((t) => <span key={t} className="text-[11px] text-muted-foreground">· {t}</span>)}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="text-2xl font-semibold tracking-tight">{active.fare.toLocaleString("en-IN")}</div>
            </div>
            <div className="text-[11px] text-muted-foreground">per adult · {active.code}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight">{train.depart}</div>
            <div className="text-xs text-muted-foreground">{train.from} <span className="opacity-60">({train.fromCode})</span></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[11px] text-muted-foreground">{train.duration}</div>
            <div className="my-1 flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <div className="h-px w-16 bg-gradient-to-r from-primary to-[color:var(--accent-orange)] md:w-32" />
              <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-orange)]" />
            </div>
            <div className="text-[11px] text-muted-foreground"><Clock className="mr-0.5 inline h-3 w-3" />Non-stop</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold tracking-tight">{train.arrive}</div>
            <div className="text-xs text-muted-foreground">{train.to} <span className="opacity-60">({train.toCode})</span></div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-wrap items-center gap-2">
          {train.classes.map((c) => (
            <button
              key={c.code}
              onClick={() => setCls(c.code)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                cls === c.code ? "border-primary bg-[color:var(--brand-soft)] text-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <span className="font-medium">{c.code}</span>
              <span className="ml-1 opacity-70">₹{c.fare}</span>
              <span className={`ml-2 ${c.available > 0 ? "text-[color:var(--success)]" : "text-destructive"}`}>
                {c.available > 0 ? `AVL ${c.available}` : "WL"}
              </span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Confirm chance</div>
              <div className={`text-sm font-semibold ${probColor}`}>{active.probability}%</div>
            </div>
            <Button onClick={() => onPick(train, cls)} className="rounded-full brand-gradient text-white">
              Book now <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ---------------- Passengers ---------------- */

function PassengersScreen({
  train, classCode, chosen, setChosen, base, taxes, conv, total, onBack, onPay,
}: {
  train: Train; classCode: string;
  chosen: string[]; setChosen: (s: string[]) => void;
  base: number; taxes: number; conv: number; total: number;
  onBack: () => void; onPay: () => void;
}) {
  const toggle = (id: string) =>
    setChosen(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]"
    >
      <div>
        <button onClick={onBack} className="mb-4 text-xs text-muted-foreground hover:text-foreground">← Change train</button>

        <Card className="rounded-2xl border-border/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">{train.from} → {train.to}</div>
              <div className="text-lg font-semibold">{train.name} <span className="text-muted-foreground">· {classCode}</span></div>
            </div>
            <Badge className="rounded-full bg-[color:var(--brand-soft)] text-primary">{train.depart} → {train.arrive}</Badge>
          </div>
        </Card>

        <Card className="mt-5 rounded-2xl border-border/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div className="text-sm font-semibold">Saved passengers</div>
              <Badge variant="outline" className="rounded-full text-[10px]">Tap to add</Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">+ Add new</Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {savedPassengers.map((p) => (
              <PassengerChip key={p.id} p={p} active={chosen.includes(p.id)} onClick={() => toggle(p.id)} />
            ))}
          </div>
        </Card>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="glass-card rounded-2xl p-5">
          <div className="mb-3 text-sm font-semibold">Fare breakdown</div>
          <FareRow label={`Base fare × ${chosen.length}`} value={base} />
          <FareRow label="Taxes & GST (5%)" value={taxes} />
          <FareRow label="Convenience fee" value={conv} />
          <Separator className="my-3" />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Total payable</div>
            <div className="flex items-center gap-1 text-2xl font-semibold tracking-tight">
              <IndianRupee className="h-4 w-4" />{total.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Includes all taxes. No hidden charges.</div>
          <Button
            disabled={!chosen.length}
            onClick={onPay}
            className="mt-4 h-11 w-full rounded-full brand-gradient text-white disabled:opacity-50"
          >
            Continue to payment <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Shield className="h-3 w-3" /> Secured by Transit India · UPI, Cards, Netbanking
          </div>
        </Card>
      </aside>
    </motion.section>
  );
}

function PassengerChip({ p, active, onClick }: { p: Passenger; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
        active ? "border-primary bg-[color:var(--brand-soft)]" : "border-border hover:border-primary/40"
      }`}
    >
      <div className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{p.name}</div>
        <div className="text-[11px] text-muted-foreground">{p.age} · {p.gender} · {p.berth} · {p.idType}</div>
      </div>
      <div className={`grid h-5 w-5 place-items-center rounded-full border ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
        {active && <CheckCircle2 className="h-4 w-4" />}
      </div>
    </button>
  );
}

function FareRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="flex items-center tabular-nums"><IndianRupee className="h-3 w-3 opacity-60" />{value.toLocaleString("en-IN")}</div>
    </div>
  );
}

/* ---------------- Payment ---------------- */

function PaymentScreen({
  total, paying, setPaying, onDone, onBack,
}: {
  total: number; paying: boolean; setPaying: (b: boolean) => void; onDone: () => void; onBack: () => void;
}) {
  const [method, setMethod] = useState<"upi" | "card" | "nb">("upi");

  function pay() {
    setPaying(true);
    setTimeout(onDone, 2200);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="mx-auto max-w-lg"
    >
      <button onClick={onBack} className="mb-4 text-xs text-muted-foreground hover:text-foreground">← Back</button>
      <Card className="glass-card rounded-3xl p-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Amount payable</div>
          <div className="mt-1 flex items-center justify-center text-4xl font-semibold tracking-tight">
            <IndianRupee className="h-6 w-6" />{total.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {(["upi", "card", "nb"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`rounded-xl border p-3 text-xs font-medium transition ${
                method === m ? "border-primary bg-[color:var(--brand-soft)] text-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {m === "upi" ? "UPI" : m === "card" ? "Card" : "Netbanking"}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {method === "upi" && <Input placeholder="yourname@upi" defaultValue="aarav@okhdfc" className="h-11 rounded-xl" />}
          {method === "card" && (
            <>
              <Input placeholder="Card number" defaultValue="4242 4242 4242 4242" className="h-11 rounded-xl" />
              <div className="flex gap-2">
                <Input placeholder="MM/YY" defaultValue="12/28" className="h-11 rounded-xl" />
                <Input placeholder="CVV" defaultValue="•••" className="h-11 rounded-xl" />
              </div>
            </>
          )}
          {method === "nb" && (
            <div className="grid grid-cols-3 gap-2">
              {["HDFC", "ICICI", "SBI", "Axis", "Kotak", "PNB"].map((b) => (
                <button key={b} className="rounded-xl border border-border p-2 text-xs hover:border-primary/40">{b}</button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={pay}
          disabled={paying}
          className="mt-6 h-12 w-full rounded-full brand-gradient text-white text-[15px]"
        >
          {paying ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
              Processing securely…
            </span>
          ) : (
            <>Pay ₹{total.toLocaleString("en-IN")}</>
          )}
        </Button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Shield className="h-3 w-3" /> Prototype only — no real payment is taken.
        </div>
      </Card>
    </motion.section>
  );
}

/* ---------------- Confirmation ---------------- */

function ConfirmedScreen({
  train, classCode, passengers, pnr, total, onNew,
}: {
  train: Train; classCode: string; passengers: Passenger[]; pnr: string; total: number; onNew: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-6 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)]"
        >
          <CheckCircle2 className="h-9 w-9" />
        </motion.div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">Booking confirmed</h2>
        <p className="text-sm text-muted-foreground">Your e-ticket has been sent to your registered email & SMS.</p>
      </div>

      <Card className="overflow-hidden rounded-3xl border-border/70">
        <div className="relative brand-gradient p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest opacity-80">PNR</div>
              <div className="font-mono text-xl font-semibold tracking-wider">{pnr.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}</div>
            </div>
            <TrainIcon className="h-8 w-8 opacity-70" />
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div>
              <div className="text-2xl font-semibold">{train.depart}</div>
              <div className="text-xs opacity-80">{train.from} ({train.fromCode})</div>
            </div>
            <div className="text-center text-[11px] opacity-80">
              <div>{train.duration}</div>
              <div className="my-1 h-px w-16 bg-white/60" />
              <div>{classCode}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">{train.arrive}</div>
              <div className="text-xs opacity-80">{train.to} ({train.toCode})</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-4 p-5">
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">Passengers</div>
            <div className="space-y-2">
              {passengers.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.age} · {p.gender} · {p.berth}</div>
                  </div>
                  <Badge className="rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)]">
                    CNF · B{Math.floor(i / 4) + 1}/{(i * 7 + 21) % 72 + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <QRPlaceholder />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/30 px-5 py-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Total paid</span>{" "}
            <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full"><Share2 className="mr-1.5 h-4 w-4" /> Share</Button>
            <Button variant="outline" className="rounded-full"><Download className="mr-1.5 h-4 w-4" /> Download</Button>
            <Button onClick={onNew} className="rounded-full brand-gradient text-white">Book another</Button>
          </div>
        </div>
      </Card>
    </motion.section>
  );
}

function QRPlaceholder() {
  // deterministic pseudo-QR
  const cells = Array.from({ length: 25 * 25 }, (_, i) => (i * 9301 + 49297) % 233280 / 233280 > 0.55);
  return (
    <div className="rounded-2xl border border-border bg-white p-2 shadow-sm">
      <div className="grid grid-cols-25 gap-[1px]" style={{ gridTemplateColumns: "repeat(25, 5px)" }}>
        {cells.map((on, i) => (
          <div key={i} className={on ? "bg-black" : "bg-white"} style={{ width: 5, height: 5 }} />
        ))}
      </div>
      <div className="mt-1 text-center text-[9px] text-muted-foreground">Scan at gate</div>
    </div>
  );
}
