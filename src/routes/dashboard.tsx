import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BadgeCheck, Camera, IdCard, LogOut, Moon, Pencil, Plus, Sun, Ticket, Trash2, Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AppShell } from "@/components/transit/AppShell";
import { PassengerFormDialog, type PassengerFormValues } from "@/components/account/PassengerFormDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useI18n, languages } from "@/lib/i18n";
import { useStore, type BookingStatus, type SavedPassenger } from "@/lib/store";
import { cn } from "@/lib/utils";

type DashboardTab = "profile" | "bookings" | "passengers" | "settings";

const searchSchema = z.object({
  tab: z.enum(["profile", "bookings", "passengers", "settings"]).catch("profile").optional(),
});

export const Route = createFileRoute("/dashboard")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "My Dashboard — Transit India" },
      { name: "description", content: "Manage your Transit India profile, bookings, saved passengers and preferences." },
      { property: "og:title", content: "Dashboard — Transit India" },
      { property: "og:description", content: "View bookings, manage saved passengers and update your account settings." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DashboardPage,
});

const tabs: { key: DashboardTab; label: string; icon: typeof BadgeCheck }[] = [
  { key: "profile", label: "My Profile", icon: BadgeCheck },
  { key: "bookings", label: "My Bookings", icon: Ticket },
  { key: "passengers", label: "Saved Passengers", icon: Users },
  { key: "settings", label: "Settings", icon: Sun },
];

const statusStyles: Record<BookingStatus, string> = {
  confirmed: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  queued: "bg-[color:var(--accent-orange)]/15 text-[color:var(--accent-orange)]",
  cancelled: "bg-[color:var(--destructive)]/15 text-[color:var(--destructive)]",
  refunded: "bg-muted text-muted-foreground",
  completed: "bg-primary/10 text-primary",
};

function DashboardPage() {
  const { account, hydrated } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const hour = new Date().getHours();
  const greetKey = hour < 12 ? "greet.morning" : hour < 17 ? "greet.afternoon" : "greet.evening";
  const activeTab: DashboardTab = search.tab ?? "profile";

  useEffect(() => {
    if (hydrated && !account) navigate({ to: "/auth" });
  }, [hydrated, account, navigate]);

  const setTab = (tab: DashboardTab) => navigate({ to: "/dashboard", search: { tab } });

  if (!hydrated || !account) {
    return (
      <AppShell>
        <div className="grid h-64 place-items-center text-sm text-muted-foreground">Loading your dashboard…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div>
          <p className="text-[12px] uppercase tracking-widest text-muted-foreground">{t("dash.profile")}</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t(greetKey)}, {account.fullName || account.username}
          </h1>
          <p className="text-[13px] text-muted-foreground">Manage your profile, bookings and travel preferences.</p>
        </div>

        <div className="flex gap-1 overflow-x-auto rounded-full border border-border/60 bg-card p-1 md:hidden">
          {tabs.map((tItem) => (
            <button
              key={tItem.key}
              onClick={() => setTab(tItem.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition",
                activeTab === tItem.key ? "brand-gradient text-white" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tItem.icon className="h-3.5 w-3.5" />
              {tItem.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <nav className="hidden flex-col gap-1 md:flex">
            {tabs.map((tItem) => (
              <button
                key={tItem.key}
                onClick={() => setTab(tItem.key)}
                className={cn(
                  "flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-left text-[13px] transition",
                  activeTab === tItem.key
                    ? "bg-[color:var(--brand-soft)] font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <tItem.icon className="h-4 w-4" />
                {tItem.label}
              </button>
            ))}
          </nav>

          <div>
            {activeTab === "profile" && <ProfilePanel />}
            {activeTab === "bookings" && <BookingsPanel />}
            {activeTab === "passengers" && <PassengersPanel />}
            {activeTab === "settings" && <SettingsPanel />}
          </div>
        </div>
      </motion.section>
    </AppShell>
  );
}

function ProfilePanel() {
  const { account, updateAccount, bookings, passengers } = useStore();
  const { formatDate } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(account?.username ?? "");
  const [phone, setPhone] = useState(account?.phone ?? "");

  useEffect(() => {
    setUsername(account?.username ?? "");
    setPhone(account?.phone ?? "");
  }, [account?.username, account?.phone]);

  if (!account) return null;

  const upcoming = bookings.filter((b) => b.status === "confirmed" || b.status === "queued").length;

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Photo is too large. Please pick an image under 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateAccount({ photo: reader.result as string });
      toast.success("Profile photo updated.");
    };
    reader.onerror = () => toast.error("Could not read that image.");
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }
    updateAccount({ username: username.trim(), phone: phone.trim() });
    setEditing(false);
    toast.success("Profile updated.");
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-border/60 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative mx-auto sm:mx-0">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Change profile photo"
              className="group grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-border/60 bg-muted"
            >
              {account.photo ? (
                <img src={account.photo} alt={account.username} className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-brand-gradient">{account.username.slice(0, 2).toUpperCase()}</span>
              )}
              <span className="absolute inset-0 grid place-items-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
                <Camera className="h-4 w-4 text-white" />
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </div>

          <div className="flex-1 space-y-3">
            {editing ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="dash-username">Username</Label>
                  <Input id="dash-username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dash-phone">Phone</Label>
                  <Input id="dash-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98100 12345" />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold">{account.username}</h2>
                <p className="text-[13px] text-muted-foreground">{account.email}</p>
                <p className="text-[13px] text-muted-foreground">{account.phone || "No phone number added"}</p>
              </div>
            )}
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Member since {formatDate(account.createdAt)}
            </p>
          </div>

          <div>
            {editing ? (
              <div className="flex gap-2">
                <Button variant="ghost" className="rounded-full" onClick={() => setEditing(false)}>Cancel</Button>
                <Button className="rounded-full brand-gradient text-white" onClick={save}>Save</Button>
              </div>
            ) : (
              <Button variant="outline" className="rounded-full" onClick={() => setEditing(true)}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Bookings" value={bookings.length} />
        <StatCard label="Upcoming Trips" value={upcoming} />
        <StatCard label="Saved Passengers" value={passengers.length} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="rounded-2xl border-border/60 p-5">
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </Card>
  );
}

function BookingsPanel() {
  const { bookings } = useStore();
  const { formatDate, formatCurrency } = useI18n();

  if (bookings.length === 0) {
    return (
      <Card className="grid place-items-center gap-3 rounded-3xl border-border/60 p-10 text-center">
        <Ticket className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No bookings yet</p>
        <p className="max-w-xs text-[13px] text-muted-foreground">
          Once you book a train, bus, flight or hotel, it will show up here with live status and PNR tracking.
        </p>
        <Button asChild className="rounded-full brand-gradient text-white">
          <Link to="/book/$mode" params={{ mode: "train" }}>Book your first trip</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <Card key={b.id} className="rounded-2xl border-border/60 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{b.mode}</span>
                <Badge className={cn("rounded-full border-none capitalize", statusStyles[b.status])}>{b.status}</Badge>
              </div>
              <h3 className="mt-1 text-[15px] font-semibold">{b.serviceName} · {b.serviceCode}</h3>
              <p className="text-[13px] text-muted-foreground">
                {b.fromCity} ({b.fromCode}) → {b.toCity} ({b.toCode})
              </p>
              <p className="text-[12px] text-muted-foreground">{formatDate(b.date)} · {b.depart}–{b.arrive} · PNR {b.pnr}</p>
            </div>
            <div className="text-right">
              <div className="text-base font-semibold">{formatCurrency(b.total)}</div>
              <Button asChild variant="outline" size="sm" className="mt-2 rounded-full">
                <Link to="/pnr" search={{ pnr: b.pnr }}>Track PNR</Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PassengersPanel() {
  const { passengers, addPassenger, updatePassenger, deletePassenger } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<SavedPassenger | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedPassenger | null>(null);

  const openAdd = () => {
    setEditingPassenger(null);
    setDialogOpen(true);
  };
  const openEdit = (p: SavedPassenger) => {
    setEditingPassenger(p);
    setDialogOpen(true);
  };

  const handleSubmit = (values: PassengerFormValues) => {
    if (editingPassenger) {
      updatePassenger(editingPassenger.id, values);
      toast.success("Passenger updated.");
    } else {
      addPassenger(values);
      toast.success("Passenger added.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">{passengers.length} saved passenger(s)</h2>
        <Button onClick={openAdd} className="rounded-full brand-gradient text-white">
          <Plus className="mr-1.5 h-4 w-4" /> Add passenger
        </Button>
      </div>

      {passengers.length === 0 ? (
        <Card className="grid place-items-center gap-2 rounded-3xl border-border/60 p-10 text-center">
          <IdCard className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No saved passengers</p>
          <p className="max-w-xs text-[13px] text-muted-foreground">Add passenger details once, reuse them for every booking.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {passengers.map((p) => (
            <Card key={p.id} className="rounded-2xl border-border/60 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[15px] font-semibold">{p.fullName}</h3>
                  <p className="text-[12px] text-muted-foreground">{p.age} yrs · {p.gender} · {p.nationality}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" aria-label={`Edit ${p.fullName}`} onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label={`Delete ${p.fullName}`} onClick={() => setDeleteTarget(p)}>
                    <Trash2 className="h-4 w-4 text-[color:var(--destructive)]" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-[12px] text-muted-foreground">
                <p>{p.mobile} · {p.email}</p>
                <p>{p.idType}: {p.idNumber}</p>
                {p.berth && <p>Berth: {p.berth}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <PassengerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editingPassenger}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete passenger?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {deleteTarget?.fullName} from your saved passengers. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-[color:var(--destructive)] text-white hover:bg-[color:var(--destructive)]/90"
              onClick={() => {
                if (deleteTarget) {
                  deletePassenger(deleteTarget.id);
                  toast.success("Passenger removed.");
                }
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SettingsPanel() {
  const { dark, setDark, logout } = useStore();
  const { lang, setLang } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/60 p-5">
        <h3 className="text-sm font-medium">Language</h3>
        <p className="mb-3 text-[13px] text-muted-foreground">Choose the language used across Transit India.</p>
        <Select value={lang} onValueChange={(v) => setLang(v as typeof lang)}>
          <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {languages.map((l) => (
              <SelectItem key={l.code} value={l.code}>{l.native} · {l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="flex items-center justify-between rounded-2xl border-border/60 p-5">
        <div className="flex items-center gap-3">
          {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <div>
            <h3 className="text-sm font-medium">Dark mode</h3>
            <p className="text-[13px] text-muted-foreground">Toggle the app's appearance.</p>
          </div>
        </div>
        <Switch checked={dark} onCheckedChange={setDark} aria-label="Toggle dark mode" />
      </Card>

      <Card className="rounded-2xl border-border/60 p-5">
        <h3 className="text-sm font-medium">Account</h3>
        <p className="mb-3 text-[13px] text-muted-foreground">Sign out of Transit India on this device.</p>
        <Button
          variant="outline"
          className="rounded-full text-[color:var(--destructive)]"
          onClick={() => {
            logout();
            navigate({ to: "/auth" });
          }}
        >
          <LogOut className="mr-1.5 h-4 w-4" /> Logout
        </Button>
      </Card>
    </div>
  );
}
