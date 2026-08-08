import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bike, Building2, Car, MessageCircle, MapPin, Phone, Plane, Rocket, ShieldCheck, Star, Train as TrainIcon, Truck, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CabberMap } from "@/components/cabber/CabberMap";
import {
  cityList, destinationsFor, driverFor, etaFor, fareFor, lastMileDistance, savedAddresses, vehicleCatalog,
  type DestKind, type VehicleType,
} from "@/components/cabber/data";
import { cabVehicleImage, ServicePreview } from "@/components/media/ServicePreview";
import { AppShell } from "@/components/transit/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/common/StarRating";
import { RateDialog } from "@/components/common/RateDialog";
import { communityRating, serviceRatingKey } from "@/lib/ratings";

export const Route = createFileRoute("/cabber/")({
  head: () => ({
    meta: [
      { title: "Cabber — Last-mile rides to your station, airport or bus stand" },
      { name: "description", content: "Book a fictional Cabber ride for the last mile: bikes, autos, sedans and SUVs with live fare and ETA estimates." },
      { property: "og:title", content: "Cabber — last-mile rides" },
      { property: "og:description", content: "Prototype last-mile ride booking with fare comparison, driver matching and a stylised route map." },
    ],
  }),
  component: CabberPage,
});

const destKinds: { id: DestKind; icon: typeof TrainIcon }[] = [
  { id: "Railway Station", icon: TrainIcon },
  { id: "Airport", icon: Plane },
  { id: "Bus Terminal", icon: Building2 },
];

const vehicleIcons: Record<VehicleType, typeof Bike> = { Bike, Auto: Rocket, Sedan: Car, SUV: Truck };

type Stage = "plan" | "matching" | "assigned";

function CabberPage() {
  const { account, hydrated, addBooking, walletBalance, payFromWallet, creditWallet, reward } = useStore();
  const { formatCurrency } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !account) navigate({ to: "/auth" });
  }, [hydrated, account, navigate]);

  const [pickup, setPickup] = useState(savedAddresses[0]);
  const [city, setCity] = useState(cityList[0]);
  const [kind, setKind] = useState<DestKind>("Railway Station");
  const options = useMemo(() => destinationsFor(kind, city), [kind, city]);
  const [destId, setDestId] = useState(options[0]?.id);
  const dest = options.find((o) => o.id === destId) ?? options[0];

  useEffect(() => {
    setDestId(options[0]?.id);
  }, [options]);

  const [vehicle, setVehicle] = useState<VehicleType>("Auto");
  const vehicleInfo = vehicleCatalog.find((v) => v.type === vehicle)!;

  const km = dest ? lastMileDistance(pickup, dest.id) : 0;
  const fare = fareFor(km, vehicleInfo);
  const eta = etaFor(km, vehicleInfo);

  const [stage, setStage] = useState<Stage>("plan");
  const [driver, setDriver] = useState<ReturnType<typeof driverFor> | null>(null);
  const [payMode, setPayMode] = useState<"wallet" | "cash">("wallet");
  const [paidAmount, setPaidAmount] = useState(0);

  const routeLabel = `${pickup.split(" — ")[0]} → ${dest?.label ?? "destination"}`;

  const bookRide = () => {
    if (!dest) return;
    if (payMode === "wallet") {
      const res = payFromWallet(fare, `Cabber Ride — ${routeLabel}`, { category: "Cabber ride", ref: dest.id });
      if (!res.ok) {
        toast.error(res.error ?? "Insufficient wallet balance.", {
          description: "Add money to your TripSync Wallet or pay by cash.",
        });
        return;
      }
      setPaidAmount(fare);
      toast.success(`${formatCurrency(fare)} paid from your TripSync Wallet.`, {
        description: `New balance ${formatCurrency(walletBalance - fare)}.`,
      });
      reward("wallet");
    } else {
      setPaidAmount(0);
    }
    setStage("matching");
    setTimeout(() => {
      const d = driverFor(`${pickup}-${dest.id}-${vehicle}-${Date.now()}`, vehicle);
      setDriver(d);
      setStage("assigned");
    }, 1900);
  };

  const cancelRide = () => {
    if (paidAmount > 0) {
      creditWallet(paidAmount, `Cabber Ride Cancelled — ${routeLabel}`, {
        type: "refund",
        category: "Cabber refund",
      });
      toast.success(`${formatCurrency(paidAmount)} refunded to your TripSync Wallet.`, {
        description: "Refunded instantly — see it in your wallet history.",
      });
    } else {
      toast("Ride cancelled", { description: "Your Cabber ride was cancelled." });
    }
    setPaidAmount(0);
    setStage("plan");
    setDriver(null);
  };

  const completeRide = () => {
    if (!dest || !driver) return;
    const now = new Date();
    const arrive = new Date(now.getTime() + eta * 60000);
    addBooking({
      pnr: String(Math.floor(1000000000 + Math.random() * 9000000000)),
      mode: "cab",

      serviceName: `${driver.model} · ${driver.name}`,
      serviceCode: driver.plate,
      fromCode: "PICKUP",
      fromCity: pickup,
      toCode: dest.id,
      toCity: dest.label,
      date: now.toISOString().slice(0, 10),
      depart: now.toTimeString().slice(0, 5),
      arrive: arrive.toTimeString().slice(0, 5),
      classCode: vehicle,
      passengers: [],
      meals: [],
      total: fare,
      status: "confirmed",
      paidWith: payMode === "wallet" ? "TripSync Wallet" : "Cash to driver",
    });
    reward("cabber");
    toast.success("Ride completed", { description: "Added to My Bookings." });
    setPaidAmount(0);
    setStage("plan");
    setDriver(null);
  };


  if (!account) return null;

  return (
    <AppShell>
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Cabber · Last-mile rides</div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Book a ride to your station, airport or bus stand</h1>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/cabber/driver">Become a Cabber driver</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <Card className="glass-card space-y-4 rounded-3xl p-5">
              <div>
                <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Pickup address</div>
                <Input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter your pickup address" className="h-11 rounded-xl" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {savedAddresses.map((a) => (
                    <button
                      key={a}
                      onClick={() => setPickup(a)}
                      className={cn(
                        "rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground",
                        pickup === a && "border-primary bg-[color:var(--brand-soft)] text-primary",
                      )}
                    >
                      {a.split(" — ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Destination type</div>
                <div className="grid grid-cols-3 gap-2">
                  {destKinds.map((k) => (
                    <button
                      key={k.id}
                      onClick={() => setKind(k.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-2xl border border-border py-3 text-[12px] font-medium transition hover:border-primary/40",
                        kind === k.id && "border-primary bg-[color:var(--brand-soft)] text-primary",
                      )}
                    >
                      <k.icon className="h-4 w-4" /> {k.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">City</div>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  >
                    {cityList.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">{kind}</div>
                  <select
                    value={destId}
                    onChange={(e) => setDestId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  >
                    {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            <Card className="glass-card space-y-3 rounded-3xl p-5">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Choose a vehicle</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {vehicleCatalog.map((v) => {
                  const Icon = vehicleIcons[v.type];
                  const active = vehicle === v.type;
                  return (
                    <button
                      key={v.type}
                      onClick={() => setVehicle(v.type)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-2xl border border-border p-3 text-center transition hover:border-primary/40",
                        active && "border-primary bg-[color:var(--brand-soft)]",
                      )}
                    >
                      <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                      <div className="text-[13px] font-semibold">{v.type}</div>
                      <div className="text-[10px] text-muted-foreground">{v.capacity}</div>
                      <div className="text-[10px] text-muted-foreground">₹{v.perKm}/km</div>
                      <StarRating
                        stars={communityRating(serviceRatingKey("cab", v.type)).stars}
                        size={11}
                        showValue={false}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-border/60 p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <div className="min-w-0 text-[10px] uppercase tracking-widest text-muted-foreground">Payment</div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    Wallet: <span className="font-semibold text-foreground">{formatCurrency(walletBalance)}</span>
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {([
                    { id: "wallet" as const, label: "Pay from TripSync Wallet", hint: "Deducted instantly" },
                    { id: "cash" as const, label: "Pay cash to driver", hint: "Settle at drop-off" },
                  ]).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setPayMode(opt.id)}
                      disabled={stage !== "plan"}
                      className={cn(
                        "min-w-0 rounded-2xl border border-border p-3 text-left transition hover:border-primary/40 disabled:opacity-60",
                        payMode === opt.id && "border-primary bg-[color:var(--brand-soft)]",
                      )}
                    >
                      <div className="text-[12px] font-semibold leading-tight">{opt.label}</div>
                      <div className="text-[11px] text-muted-foreground">{opt.hint}</div>
                    </button>
                  ))}
                </div>
                {payMode === "wallet" && walletBalance < fare && (
                  <p className="mt-2 text-[11px] text-destructive">
                    Insufficient wallet balance — add money or switch to cash.
                  </p>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${vehicle}-${km}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-lg font-semibold">{formatCurrency(fare)}</div>
                    <div className="text-[11px] text-muted-foreground">{km} km · ETA {eta} min</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <RateDialog
                      ratingKey={serviceRatingKey("cab", vehicle)}
                      title={`${vehicle} rides`}
                      subtitle="Rate this ride category so other riders know what to expect."
                      compact
                    />
                    <Button onClick={bookRide} disabled={!dest || stage !== "plan"} className="h-11 rounded-full px-6 text-white brand-gradient">
                      Book ride
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>

            </Card>
          </div>

          <div className="space-y-4">
            <CabberMap distanceKm={km} etaMins={eta} status={stage === "plan" ? "idle" : "en-route"} className="aspect-[4/3] w-full" />

            <AnimatePresence mode="wait">
              {stage === "matching" && (
                <motion.div key="matching" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Card className="glass-card flex items-center gap-3 rounded-2xl p-4">
                    <span className="pulse-ring grid h-9 w-9 place-items-center rounded-full bg-[color:var(--brand-soft)] text-primary">
                      <Car className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">Finding a nearby Cabber…</div>
                      <div className="text-[12px] text-muted-foreground">Matching you with the closest {vehicle.toLowerCase()} driver</div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {stage === "assigned" && driver && (
                <motion.div key="assigned" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Card className="glass-card space-y-4 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <Badge className="rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)]">Driver assigned</Badge>
                      <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" /> OTP <span className="font-semibold text-foreground">{driver.otp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-semibold text-white brand-gradient">
                        {driver.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{driver.name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-[color:var(--accent-orange)] text-[color:var(--accent-orange)]" /> {driver.rating}</span>
                          <span>· {driver.trips} trips</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-[104px_minmax(0,1fr)] items-center gap-3 rounded-xl bg-muted/50 p-2.5">
                      <ServicePreview
                        mode="cab"
                        seed={driver.plate}
                        src={cabVehicleImage(vehicle)}
                        alt={`${vehicle} · ${driver.model}`}
                        ratio="aspect-[4/3]"
                        className="w-full"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Your {vehicle.toLowerCase()}</p>
                        <p className="break-words text-[13px] font-medium">{driver.model}</p>
                        <p className="break-words text-[12px] text-muted-foreground">
                          Plate <span className="font-semibold text-foreground">{driver.plate}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> Picking you up from <span className="truncate font-medium text-foreground">{pickup.split(" — ")[0]}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="rounded-full" onClick={() => toast("Calling driver…", { description: "Prototype only — no real call placed." })}>
                        <Phone className="mr-1.5 h-4 w-4" /> Call
                      </Button>
                      <Button variant="outline" className="rounded-full" onClick={() => toast("Message sent", { description: "Prototype only — no real message sent." })}>
                        <MessageCircle className="mr-1.5 h-4 w-4" /> Message
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="ghost" className="rounded-full text-destructive hover:text-destructive" onClick={cancelRide}>
                        <X className="mr-1.5 h-4 w-4" /> Cancel ride
                      </Button>
                      <Button className="rounded-full text-white brand-gradient" onClick={completeRide}>
                        Complete ride
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
    </AppShell>
  );
}
