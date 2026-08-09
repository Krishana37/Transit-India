import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bell, BellOff, Ticket, RotateCcw, Car, TrainFront, AlertTriangle, XCircle, Wallet, Coins, Utensils, Hotel, Clock, Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/transit/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore, type AppNotification } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notification centre — Transit India" },
      { name: "description", content: "Review journey alerts, wallet updates and reward notifications in one place." },
      { property: "og:title", content: "Notification centre — Transit India" },
      { property: "og:description", content: "Stay on top of platform changes, delays, refunds and rewards." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: NotificationsPage,
});

type FilterKey = "all" | "journeys" | "wallet" | "rewards" | "alerts";

const kindMap: Record<AppNotification["kind"], { icon: typeof Bell; color: string; group: FilterKey }> = {
  tatkal: { icon: Clock, color: "bg-[color:var(--accent-orange)]/15 text-[color:var(--accent-orange)]", group: "alerts" },
  booking: { icon: Ticket, color: "bg-primary/10 text-primary", group: "journeys" },
  refund: { icon: RotateCcw, color: "bg-[color:var(--success)]/15 text-[color:var(--success)]", group: "wallet" },
  cab: { icon: Car, color: "bg-primary/10 text-primary", group: "journeys" },
  platform: { icon: TrainFront, color: "bg-primary/10 text-primary", group: "journeys" },
  delay: { icon: AlertTriangle, color: "bg-[color:var(--accent-orange)]/15 text-[color:var(--accent-orange)]", group: "alerts" },
  cancelled: { icon: XCircle, color: "bg-destructive/15 text-destructive", group: "journeys" },
  wallet: { icon: Wallet, color: "bg-[color:var(--success)]/15 text-[color:var(--success)]", group: "wallet" },
  coins: { icon: Coins, color: "bg-[color:var(--brand-soft)] text-primary", group: "rewards" },
  meal: { icon: Utensils, color: "bg-primary/10 text-primary", group: "journeys" },
  hotel: { icon: Hotel, color: "bg-primary/10 text-primary", group: "journeys" },
  reminder: { icon: Bell, color: "bg-muted text-muted-foreground", group: "alerts" },
};

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "journeys", label: "Journeys" },
  { key: "wallet", label: "Wallet" },
  { key: "rewards", label: "Rewards" },
  { key: "alerts", label: "Alerts" },
];

const sampleAlerts: Omit<AppNotification, "id" | "at" | "read">[] = [
  { kind: "platform", title: "Platform changed", body: "12951 Mumbai Rajdhani now departs from Platform 6 instead of Platform 3." },
  { kind: "delay", title: "Train running late", body: "12301 Howrah Rajdhani is running approximately 35 minutes behind schedule." },
  { kind: "cab", title: "Your cab is arriving", body: "Your Cabber ride is 3 minutes away — driver Arjun in a white Swift Dzire." },
];

function relTime(at: string) {
  const diff = Date.now() - new Date(at).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(at).toLocaleDateString();
}

function NotificationsPage() {
  const { notifications, unreadCount, markAllRead, clearNotifications, notify } = useStore();
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = notifications.filter((n) => filter === "all" || kindMap[n.kind]?.group === filter);

  const sendSample = () => {
    const alert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    notify(alert);
    toast.success("Sample alert sent.");
  };

  return (
    <AppShell>
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground">Notification centre</p>
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Notifications
              {unreadCount > 0 && (
                <Badge className="rounded-full border-none bg-destructive text-white">{unreadCount} unread</Badge>
              )}
            </h1>
            <p className="text-[13px] text-muted-foreground">Journey alerts, wallet updates and rewards in one place.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm" className="rounded-full" onClick={markAllRead} disabled={unreadCount === 0}>
              Mark all read
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={clearNotifications} disabled={notifications.length === 0}>
              Clear all
            </Button>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] transition",
                filter === f.key
                  ? "border-transparent brand-gradient text-white"
                  : "border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Button variant="outline" className="rounded-full" onClick={sendSample} data-a11y="optional">
          <Send className="mr-1.5 h-3.5 w-3.5" /> Send a sample alert
        </Button>

        {filtered.length === 0 ? (
          <Card className="grid place-items-center gap-3 rounded-3xl border-border/60 p-10 text-center">
            <BellOff className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="max-w-xs text-[13px] text-muted-foreground">
              You're all caught up. Booking, wallet and reward updates will appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => {
              const meta = kindMap[n.kind] ?? kindMap.reminder;
              const Icon = meta.icon;
              return (
                <Card key={n.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-2xl border-border/60 p-4">
                  <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", meta.color)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{n.title}</p>
                    <p className="text-[13px] text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{relTime(n.at)}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                </Card>
              );
            })}
          </div>
        )}
      </motion.section>
    </AppShell>
  );
}
