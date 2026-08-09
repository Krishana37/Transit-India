import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award, Bike, Car, Check, ChevronRight, Clock, IndianRupee, MapPin, PartyPopper, Rocket, Star, Truck, X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";
import { CabberMap } from "@/components/cabber/CabberMap";
import { vehicleCatalog, type VehicleType } from "@/components/cabber/data";
import {
  generateHistory, generateRequests, generateCourierRequests, earningsSeries,
  type RideRequest, type CourierRequest,
} from "@/components/cabber/driverData";
import { AppShell } from "@/components/transit/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";
import {
  cabberCommission, cabberDriverPayout, CABBER_COMMISSION_PER_100, driverEarningsSummary, useStore,
} from "@/lib/store";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Package, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cabber/driver")({
  head: () => ({
    meta: [
      { title: "Become a Cabber driver — earn with your own vehicle" },
      { name: "description", content: "Register as a fictional Cabber driver, manage availability, accept ride requests and track earnings." },
      { property: "og:title", content: "Cabber driver dashboard" },
      { property: "og:description", content: "Prototype driver onboarding and dashboard with earnings, ride requests and history." },
    ],
  }),
  component: DriverPage,
});

const vehicleIcons: Record<VehicleType, typeof Bike> = { Bike, Auto: Rocket, Sedan: Car, SUV: Truck };

const schema = z.object({
  name: z.string().trim().min(3, "Enter your full name"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  licenseNumber: z.string().trim().min(6, "Enter a valid licence number"),
  licenseExpiry: z.string().refine((v) => !!v && new Date(v) > new Date(), "Licence expiry must be a future date"),
  vehicleModel: z.string().trim().min(2, "Enter your vehicle model"),
  vehicleNumber: z.string().trim().min(6, "Enter a valid vehicle number"),
  vehicleType: z.enum(["Bike", "Auto", "Sedan", "SUV"]),
});

type FormState = z.infer<typeof schema>;

function DriverPage() {
  const { driver, registerDriver } = useStore();
  return (
    <AppShell>
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {driver ? <DriverDashboard /> : <DriverOnboarding onRegister={registerDriver} />}
      </motion.section>
    </AppShell>
  );
}

function DriverOnboarding({ onRegister }: { onRegister: (d: Omit<import("@/lib/store").DriverProfile, "registeredAt">) => void }) {
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", licenseNumber: "", licenseExpiry: "", vehicleModel: "", vehicleNumber: "", vehicleType: "Auto",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [celebrate, setCelebrate] = useState(false);

  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof FormState] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    onRegister({ ...parsed.data, available: true });
    toast.success("Welcome to Cabber!", { description: "You're all set to start accepting rides." });
    setCelebrate(true);
  };

  if (celebrate) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="glass-card space-y-4 rounded-3xl p-8 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full text-white brand-gradient">
            <PartyPopper className="h-8 w-8" />
          </span>
          <h2 className="text-xl font-semibold">You're registered!</h2>
          <p className="text-[13px] text-muted-foreground">Your Cabber driver profile is ready. Go online whenever you want to start earning.</p>
          <Button onClick={() => window.location.reload()} className="rounded-full text-white brand-gradient">
            Open my dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 text-center">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Cabber driver onboarding</div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Become a Cabber driver</h1>
        <p className="mt-2 text-[13px] text-muted-foreground">Register your vehicle to start accepting fictional last-mile ride requests.</p>
      </div>

      <Card className="glass-card space-y-6 rounded-3xl p-6">
        <FormSection title="Personal details">
          <Field label="Full name" error={errors.name}>
            <Input value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Ravi Kumar" className="h-11 rounded-xl" />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <Input value={form.phone} onChange={(e) => patch({ phone: e.target.value })} placeholder="98XXXXXXXX" className="h-11 rounded-xl" />
          </Field>
        </FormSection>

        <FormSection title="Licence">
          <Field label="Licence number" error={errors.licenseNumber}>
            <Input value={form.licenseNumber} onChange={(e) => patch({ licenseNumber: e.target.value })} placeholder="DL-0420110012345" className="h-11 rounded-xl" />
          </Field>
          <Field label="Licence expiry" error={errors.licenseExpiry}>
            <Input type="date" value={form.licenseExpiry} onChange={(e) => patch({ licenseExpiry: e.target.value })} className="h-11 rounded-xl" />
          </Field>
        </FormSection>

        <FormSection title="Vehicle">
          <Field label="Vehicle model" error={errors.vehicleModel}>
            <Input value={form.vehicleModel} onChange={(e) => patch({ vehicleModel: e.target.value })} placeholder="Maruti Dzire" className="h-11 rounded-xl" />
          </Field>
          <Field label="Vehicle number" error={errors.vehicleNumber}>
            <Input value={form.vehicleNumber} onChange={(e) => patch({ vehicleNumber: e.target.value })} placeholder="DL-01-AB-1234" className="h-11 rounded-xl" />
          </Field>
        </FormSection>

        <div>
          <Label className="mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground">Vehicle type</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {vehicleCatalog.map((v) => {
              const Icon = vehicleIcons[v.type];
              const active = form.vehicleType === v.type;
              return (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => patch({ vehicleType: v.type })}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border border-border p-3 transition hover:border-primary/40",
                    active && "border-primary bg-[color:var(--brand-soft)]",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                  <div className="text-[12px] font-semibold">{v.type}</div>
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={submit} className="h-12 w-full rounded-full text-white brand-gradient">
          Register as a Cabber driver
        </Button>
        <p className="text-center text-[12px] text-muted-foreground">
          Already have a Cabber account? <Link to="/cabber" className="text-primary underline">Book a ride instead</Link>
        </p>
      </Card>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-[12px] font-medium">{label}</Label>
      {children}
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function DriverDashboard() {
  const { driver, updateDriver, deleteDriverAccount, driverEarnings, driverWithdrawn, addDriverEarning, withdrawEarnings } = useStore();
  const { formatCurrency } = useI18n();
  if (!driver) return null;

  const [requests, setRequests] = useState<RideRequest[]>(() => generateRequests(driver.vehicleType, driver.phone));
  const [courierRequests, setCourierRequests] = useState<CourierRequest[]>(() => generateCourierRequests(driver.phone));
  const [onTrip, setOnTrip] = useState<RideRequest | null>(null);
  const [onCourier, setOnCourier] = useState<CourierRequest | null>(null);
  const services = driver.services ?? "both";
  const acceptsRides = services === "ride" || services === "both";
  const acceptsCourier = services === "courier" || services === "both";
  const [history, setHistory] = useState(() => generateHistory(driver.vehicleType, driver.name));

  const series = useMemo(() => earningsSeries(driver.name), [driver.name]);
  const summary = driverEarningsSummary(driverEarnings, driverWithdrawn);

  const accept = (r: RideRequest) => {
    setRequests((rs) => rs.filter((x) => x.id !== r.id));
    setOnTrip(r);
    toast.success("Ride accepted", { description: `Heading to pick up ${r.rider}.` });
  };
  const decline = (r: RideRequest) => {
    setRequests((rs) => rs.filter((x) => x.id !== r.id));
    toast("Ride declined");
  };

  const acceptCourier = (c: CourierRequest) => {
    setCourierRequests((cs) => cs.filter((x) => x.id !== c.id));
    setOnCourier(c);
    toast.success("Courier job accepted", { description: `Pick up ${c.parcel} from ${c.sender}.` });
  };

  const completeCourier = () => {
    if (!onCourier) return;
    const commission = cabberCommission(onCourier.fare);
    addDriverEarning({
      fare: onCourier.fare,
      kind: "courier",
      label: `Courier Job Completed — ${onCourier.sender}`,
      route: `${onCourier.pickup} → ${onCourier.destination}`,
    });
    toast.success(`Courier job completed +${formatCurrency(cabberDriverPayout(onCourier.fare))}`, {
      description: `Courier charge ${formatCurrency(onCourier.fare)} − commission ${formatCurrency(commission)}. Credited to your Transit Wallet.`,
    });
    setOnCourier(null);
    setCourierRequests((cs) => (cs.length ? cs : generateCourierRequests(driver.phone + Date.now())));
  };

  const completeTrip = () => {
    if (!onTrip) return;
    setHistory((h) => [
      { id: onTrip.id, date: new Date().toISOString().slice(0, 10), rider: onTrip.rider, route: `${onTrip.pickup} → ${onTrip.destination}`, fare: onTrip.fare, rating: 4.6 },
      ...h,
    ]);
    addDriverEarning({
      fare: onTrip.fare,
      kind: "ride",
      label: `Cabber Ride Completed — ${onTrip.rider}`,
      route: `${onTrip.pickup} → ${onTrip.destination}`,
    });
    toast.success(`Cabber Ride Completed +${formatCurrency(cabberDriverPayout(onTrip.fare))}`, {
      description: `Ride fare ${formatCurrency(onTrip.fare)} − commission ${formatCurrency(cabberCommission(onTrip.fare))}. Credited to your Transit Wallet.`,
    });
    setOnTrip(null);
    setRequests((rs) => (rs.length ? rs : generateRequests(driver.vehicleType, driver.phone + Date.now())));
  };

  const withdraw = () => {
    const res = withdrawEarnings(summary.withdrawable);
    if (!res.ok) {
      toast.error(res.error ?? "Nothing to withdraw yet.");
      return;
    }
    toast.success(`${formatCurrency(summary.withdrawable)} moved to your Transit Wallet.`);
  };


  const Icon = vehicleIcons[driver.vehicleType];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl text-white brand-gradient"><Icon className="h-6 w-6" /></span>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Cabber driver</div>
            <h1 className="text-xl font-semibold tracking-tight">{driver.name}</h1>
            <div className="text-[12px] text-muted-foreground">{driver.vehicleModel} · {driver.vehicleNumber}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2">
            <span className={cn("text-[12px] font-medium", driver.available ? "text-[color:var(--success)]" : "text-muted-foreground")}>
              {driver.available ? "Online" : "Offline"}
            </span>
            <Switch checked={driver.available} onCheckedChange={(v) => updateDriver({ available: v })} />
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/cabber">Book a ride <ChevronRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>

      <Card className="glass-card rounded-3xl p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Cabber driver earnings</div>
            <p className="text-[12px] text-muted-foreground">Separate from your customer Transit Wallet · Prototype / Demo Data</p>
          </div>
          <Button
            className="shrink-0 rounded-full text-white brand-gradient"
            disabled={summary.withdrawable <= 0}
            onClick={withdraw}
          >
            Withdraw {formatCurrency(summary.withdrawable)}
          </Button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatCard icon={IndianRupee} label="Today" value={formatCurrency(summary.today)} />
          <StatCard icon={Clock} label="This week" value={formatCurrency(summary.week)} />
          <StatCard icon={Award} label="Total earnings" value={formatCurrency(summary.total)} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <StatCard icon={Check} label="Completed rides" value={String(summary.rides)} />
          <StatCard icon={Clock} label="Pending earnings" value={formatCurrency(summary.pending)} />
          <StatCard icon={IndianRupee} label="Withdrawable" value={formatCurrency(summary.withdrawable)} />
        </div>
        {driverEarnings.length > 0 && (
          <div className="mt-4 space-y-2">
            {driverEarnings.slice(0, 5).map((e) => (
              <div key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/60 p-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{e.label}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {e.route ? `${e.route} · ` : ""}{new Date(e.at).toLocaleString()}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold text-[color:var(--success)]">
                  +{formatCurrency(e.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>


      <Card className="glass-card rounded-3xl p-5">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Earnings — last 7 days</div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ left: -20, right: 10, top: 5 }}>
              <defs>
                <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} />
              <YAxis tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} width={50} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }}
                formatter={(v: number) => [formatCurrency(v), "Earnings"]}
              />
              <Area type="monotone" dataKey="earnings" stroke="var(--primary)" fill="url(#earn)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {onTrip ? (
        <Card className="glass-card space-y-4 rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <Badge className="rounded-full bg-[color:var(--warning)]/15 text-[color:var(--warning)]">On trip</Badge>
            <div className="text-[12px] text-muted-foreground">{onTrip.km} km · ETA {onTrip.eta} min</div>
          </div>
          <CabberMap distanceKm={onTrip.km} etaMins={onTrip.eta} status="en-route" className="aspect-[16/9] w-full" />
          <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-[13px]">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {onTrip.pickup} → {onTrip.destination}</span>
            <span className="font-semibold">{formatCurrency(onTrip.fare)}</span>
          </div>
          <Button onClick={completeTrip} className="h-11 w-full rounded-full text-white brand-gradient">Complete ride</Button>
        </Card>
      ) : (
        <Card className="glass-card space-y-3 rounded-3xl p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Incoming ride requests</div>
          {!driver.available && <p className="text-[13px] text-muted-foreground">You're offline — go online to receive ride requests.</p>}
          {driver.available && requests.length === 0 && <p className="text-[13px] text-muted-foreground">No requests right now. New rides will appear here.</p>}
          {driver.available && requests.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4">
              <div>
                <div className="text-sm font-semibold">{r.rider}</div>
                <div className="text-[12px] text-muted-foreground">{r.pickup} → {r.destination}</div>
                <div className="text-[11px] text-muted-foreground">{r.km} km · ETA {r.eta} min</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatCurrency(r.fare)}</span>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-full text-destructive" onClick={() => decline(r)}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="icon" className="h-9 w-9 rounded-full text-white brand-gradient" onClick={() => accept(r)}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card className="glass-card rounded-3xl p-5">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Ride history</div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Rider</TableHead>
                <TableHead>Route</TableHead>
                <TableHead className="text-right">Fare</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="text-[12px] text-muted-foreground">{h.date}</TableCell>
                  <TableCell className="text-[13px]">{h.rider}</TableCell>
                  <TableCell className="max-w-[240px] truncate text-[12px] text-muted-foreground">{h.route}</TableCell>
                  <TableCell className="text-right text-[13px] font-medium">{formatCurrency(h.fare)}</TableCell>
                  <TableCell className="text-right text-[12px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-[color:var(--accent-orange)] text-[color:var(--accent-orange)]" /> {h.rating.toFixed(1)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof IndianRupee; label: string; value: string }) {
  return (
    <Card className="glass-card flex items-center gap-3 rounded-2xl p-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--brand-soft)] text-primary"><Icon className="h-5 w-5" /></span>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </Card>
  );
}
