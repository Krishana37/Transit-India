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
import { AppShell } from "@/components/transit/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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
  const { account, hydrated, addBooking } = useStore();
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

  const bookRide = () => {
    if (!dest) return;
    setStage("matching");
    setTimeout(() => {
      const d = driverFor(`${pickup}-${dest.id}-${vehicle}-${Date.now()}`, vehicle);
      setDriver(d);
      setStage("assigned");
    }, 1900);
  };

  const cancelRide = () => {
    setStage("plan");
    setDriver(null);
    toast("Ride cancelled", { description: "Your Cabber ride was cancelled." });
  };

  const completeRide = () => {
    if (!dest || !driver) return;
    const now = new Date();
    const arrive = new Date(now.getTime() + eta * 60000);
    addBooking({
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
    });
    toast.success("Ride completed", { description: "Added to My Bookings." });
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
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${vehicle}-${km}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3"
                >
                  <div>
                    <div className="text-lg font-semibold">{formatCurrency(fare)}</div>
                    <div className="text-[11px] text-muted-foreground">{km} km · ETA {eta} min</div>
                  </div>
                  <Button onClick={bookRide} disabled={!dest || stage !== "plan"} className="h-11 rounded-full px-6 text-white brand-gradient">
                    Book ride
                  </Button>
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
                    <div className="rounded-xl bg-muted/50 px-3 py-2 text-[12px] text-muted-foreground">
                      {driver.model} · <span className="font-medium text-foreground">{driver.plate}</span>
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
