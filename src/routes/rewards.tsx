import { createFileRoute } from "@tanstack/react-router";
import { BrandIcon } from "@/components/brand/BrandAssets";
import { motion } from "framer-motion";
import {
  Coins, Star, Sparkles, Search, Ticket, ScanLine, Wallet, Car, Hotel, Utensils, CalendarCheck,
  Lock, Unlock, Sofa, Fingerprint,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/transit/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useStore, TIERS, POINT_EVENTS, tierFor, COIN_VALUE, COIN_MAX_SHARE } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Transit Coins & Points — Transit India" },
      { name: "description", content: "Track your Transit Coins and Points, tier progress, ways to earn and rewards catalogue." },
      { property: "og:title", content: "Transit Coins & Points — Transit India" },
      { property: "og:description", content: "Earn coins and points on every booking and redeem them for discounts and perks." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RewardsPage,
});

const eventIcons: Record<string, typeof Search> = {
  search: Search,
  booking: Ticket,
  pnr: ScanLine,
  wallet: Wallet,
  cabber: Car,
  hotel: Hotel,
  meal: Utensils,
  daily: CalendarCheck,
};

const catalogue = [
  { id: "lounge", name: "Airport lounge pass", cost: 600, icon: Sofa, desc: "One-time complimentary lounge access at partner airports." },
  { id: "meal", name: "Free meal upgrade", cost: 300, icon: Utensils, desc: "Upgrade any onboard meal order to the premium thali, free." },
  { id: "tatkal", name: "Priority Tatkal slot", cost: 900, icon: Fingerprint, desc: "Jump the queue in the Tatkal booking rush window." },
];

function RewardsPage() {
  const { coins, points, reward } = useStore();
  const { formatCurrency } = useI18n();
  const tier = tierFor(points);
  const tierIdx = TIERS.findIndex((t) => t.name === tier.name);
  const nextTier = TIERS[tierIdx + 1];
  const progress = nextTier
    ? Math.min(100, Math.round(((points - tier.min) / (nextTier.min - tier.min)) * 100))
    : 100;

  const claimDaily = () => {
    const before = points;
    reward("daily");
    setTimeout(() => {
      toast.success("Daily login bonus claimed! +15 points, +10 coins.");
    }, 0);
  };

  return (
    <AppShell>
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
        <div className="flex min-w-0 items-center gap-4">
          <BrandIcon name="coins" label="Transit Coins" size={72} className="sm:!h-20 sm:!w-20" eager />
          <div className="min-w-0">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground">Loyalty</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Transit Coins & Points</h1>
            <p className="text-[13px] text-muted-foreground">Earn on every action, redeem for discounts and perks.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-3xl border-border/60 p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--brand-soft)] text-primary">
                <Coins className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Transit Coins</p>
                <p className="text-xl font-semibold">{coins}</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] text-muted-foreground">
              1 coin = {formatCurrency(COIN_VALUE)}. Redeemable on the booking payment screen, capped at{" "}
              {Math.round(COIN_MAX_SHARE * 100)}% of the fare.
            </p>
          </Card>

          <Card className="rounded-3xl border-border/60 p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--brand-soft)] text-primary">
                <Star className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Transit Points · {tier.name}</p>
                <p className="text-xl font-semibold">{points}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full brand-gradient" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                {nextTier ? `${nextTier.min - points} points to ${nextTier.name}` : "Highest tier reached"}
              </p>
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">{tier.perk}</p>
          </Card>
        </div>

        <Card className="rounded-3xl border-border/60 p-5" data-a11y="optional">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold">Daily login bonus</h2>
              <p className="text-[13px] text-muted-foreground">Claim once a day for bonus points and coins.</p>
            </div>
            <Button className="shrink-0 rounded-full brand-gradient text-white" onClick={claimDaily}>
              <Sparkles className="mr-1.5 h-4 w-4" /> Claim
            </Button>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 p-5">
          <h2 className="text-sm font-semibold">How you earn</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(POINT_EVENTS).map(([key, ev]) => {
              const Icon = eventIcons[key] ?? Star;
              return (
                <div key={key} className="rounded-2xl border border-border/60 p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--brand-soft)] text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-[12px] font-medium leading-tight">{ev.label}</p>
                  <p className="text-[11px] text-muted-foreground">+{ev.points} pts · +{ev.coins} coins</p>
                </div>
              );
            })}
          </div>
        </Card>

        <RedeemRewards />

        <Card className="rounded-3xl border-border/60 p-5">
          <h2 className="text-sm font-semibold">Tier perks catalogue</h2>
          <p className="text-[12px] text-muted-foreground">Fictional prototype perks — unlock as your points grow.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {catalogue.map((item) => {
              const unlocked = points >= item.cost;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "min-w-0 rounded-2xl border p-4",
                    unlocked ? "border-primary/40 bg-[color:var(--brand-soft)]/40" : "border-border/60 opacity-80",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-background text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    {unlocked ? <Unlock className="h-4 w-4 text-[color:var(--success)]" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="mt-2 break-words text-[13px] font-medium">{item.name}</p>
                  <p className="break-words text-[11px] text-muted-foreground">{item.desc}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">{item.cost} pts</p>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.section>
    </AppShell>
  );
}

const badgeTone: Record<RedeemedRewardStatus, string> = {
  redeemed: "bg-[color:var(--brand-soft)] text-primary",
  applied: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  used: "bg-muted text-muted-foreground",
  expired: "bg-destructive/10 text-destructive",
};

/** Redeem Transit Points for one-trip rewards and track their lifecycle. */
function RedeemRewards() {
  const { points, redeemedRewards, redeemReward, applyRewardToBooking, bookings } = useStore();
  const [confirm, setConfirm] = useState<string | null>(null);
  const pending = redeemedRewards.filter((r) => rewardBadge(r) === "redeemed" || rewardBadge(r) === "applied");
  const closed = redeemedRewards.filter((r) => rewardBadge(r) === "used" || rewardBadge(r) === "expired");
  const eligibleBookings = bookings.filter((b) => journeyPhase(b) === "upcoming");

  const item = REWARD_CATALOG.find((r) => r.id === confirm);

  const doRedeem = () => {
    if (!item) return;
    const res = redeemReward(item.id);
    setConfirm(null);
    if (!res.ok) {
      toast.error(res.error ?? "Could not redeem this reward.");
      return;
    }
    toast.success(`${item.name} redeemed`, { description: `${item.cost} Transit Points used · valid for 1 trip.` });
  };

  return (
    <Card className="rounded-3xl border-border/60 p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Redeem Rewards</h2>
          <p className="text-[12px] text-muted-foreground">
            Every reward is valid for <span className="font-semibold text-foreground">ONE TRIP ONLY</span> · Prototype / Demo Data
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-[12px] font-semibold text-primary">
          {points} pts
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REWARD_CATALOG.map((r) => {
          const affordable = points >= r.cost;
          const activeCount = redeemedRewards.filter((x) => x.rewardId === r.id && (rewardBadge(x) === "redeemed" || rewardBadge(x) === "applied")).length;
          return (
            <div key={r.id} className={cn("flex min-w-0 flex-col rounded-2xl border p-4", affordable ? "border-primary/40" : "border-border/60 opacity-70")}>
              <p className="break-words text-[13px] font-semibold">{r.name}</p>
              <p className="mt-1 break-words text-[11px] leading-relaxed text-muted-foreground">{r.desc}</p>
              <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">{r.cost} pts · 1 trip</p>
              <Button
                size="sm"
                className="mt-3 w-full rounded-full brand-gradient text-white disabled:opacity-50"
                disabled={!affordable || activeCount > 0}
                onClick={() => setConfirm(r.id)}
              >
                {activeCount > 0 ? "Redeemed" : affordable ? "Redeem" : "Not enough points"}
              </Button>
            </div>
          );
        })}
      </div>

      {pending.length > 0 && (
        <div className="mt-5 space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">Active rewards</h3>
          {pending.map((r) => (
            <div key={r.id} className="grid gap-2 rounded-2xl border border-border/60 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="break-words text-[13px] font-medium">{r.name}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", badgeTone[rewardBadge(r)])}>
                    {rewardBadge(r)}
                  </span>
                </div>
                <p className="break-words text-[11px] text-muted-foreground">
                  Valid for: 1 trip · Use before {new Date(r.expiresAt).toLocaleDateString()}
                  {r.bookingLabel ? ` · Applied to: ${r.bookingLabel}` : ""}
                </p>
              </div>
              {r.status === "redeemed" && (
                <div className="min-w-0 sm:w-64">
                  <Select onValueChange={(v) => {
                    const b = eligibleBookings.find((x) => x.id === v);
                    if (!b) return;
                    applyRewardToBooking(r.id, b.id, `${b.serviceName} · ${b.date}`);
                    toast.success("Reward applied", { description: `${r.name} is locked to this one trip.` });
                  }}>
                    <SelectTrigger className="rounded-full text-[12px]">
                      <SelectValue placeholder={eligibleBookings.length ? "Apply to a booking" : "No upcoming trips"} />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleBookings.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.serviceName} · {b.date}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {closed.length > 0 && (
        <div className="mt-5 space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">Reward history</h3>
          {closed.map((r) => (
            <div key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/60 p-3 opacity-80">
              <p className="min-w-0 break-words text-[13px]">{r.name}{r.bookingLabel ? ` · ${r.bookingLabel}` : ""}</p>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", badgeTone[rewardBadge(r)])}>
                {rewardBadge(r)}
              </span>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!item} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Confirm redemption</DialogTitle>
          </DialogHeader>
          {item && (
            <p className="text-[13px] text-muted-foreground">
              Use {item.cost} Transit Points for a {item.name}? The reward is valid for one trip only and expires in {REWARD_VALID_DAYS} days.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setConfirm(null)}>Cancel</Button>
            <Button className="rounded-full brand-gradient text-white" onClick={doRedeem}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

