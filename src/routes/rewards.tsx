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

        <Card className="rounded-3xl border-border/60 p-5">
          <h2 className="text-sm font-semibold">Rewards catalogue</h2>
          <p className="text-[12px] text-muted-foreground">Fictional prototype rewards — unlock as your points grow.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {catalogue.map((item) => {
              const unlocked = points >= item.cost;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border p-4",
                    unlocked ? "border-primary/40 bg-[color:var(--brand-soft)]/40" : "border-border/60 opacity-80",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-background text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    {unlocked ? <Unlock className="h-4 w-4 text-[color:var(--success)]" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="mt-2 text-[13px] font-medium">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
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
