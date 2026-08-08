import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, RouteIcon, Shield, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandIcon } from "@/components/brand/BrandAssets";
import { AppShell } from "@/components/transit/AppShell";
import { AIChat } from "@/components/transit/AIChat";
import { SmartSearch, stationByCode, type SearchState } from "@/components/transit/SmartSearch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RateDialog } from "@/components/common/RateDialog";
import { StarRating } from "@/components/common/StarRating";
import { blendRating, communityRating, ratingTone } from "@/lib/ratings";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transportModes, type TransportMode } from "@/lib/inventory";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TripSync — Book trains, buses, flights & more with one sentence" },
      { name: "description", content: "AI-powered travel booking prototype for India: conversational search, pre-Tatkal queue, passenger profiles, multilingual UI and Cabber last-mile rides." },
      { property: "og:title", content: "TripSync — Smarter travel booking" },
      { property: "og:description", content: "Conversational booking across trains, buses, flights, hotels, metro and ferries. Hackathon prototype." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});


function Home() {
  const { account, hydrated, reward, dark, setDark, ratings } = useStore();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState<SearchState>(() => ({
    from: stationByCode("NDLS"),
    to: stationByCode("JP"),
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })(),
    slot: "morning",
    query: "",
  }));

  useEffect(() => {
    if (hydrated && account) reward("daily");
  }, [hydrated, account, reward]);


  useEffect(() => {
    if (hydrated && !account) navigate({ to: "/auth" });
  }, [hydrated, account, navigate]);

  const go = (mode: TransportMode) =>
    navigate({
      to: "/book/$mode",
      params: { mode },
      search: {
        from: search.from.code,
        to: search.to.code,
        date: search.date.toISOString().slice(0, 10),
        slot: search.slot,
        q: search.query || undefined,
      },
    });

  const appScore = blendRating(communityRating("app"), ratings["app"]?.stars);

  if (!hydrated || !account) return null;

  return (
    <>
      <AppShell>
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl pt-2">
          <div className="mb-4 flex items-center justify-end">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 backdrop-blur"
              data-a11y="optional"
            >
              <Sun className={`h-3.5 w-3.5 ${dark ? "text-muted-foreground" : "text-[color:var(--accent-orange)]"}`} />
              <Switch
                id="home-theme"
                checked={dark}
                onCheckedChange={setDark}
                aria-label="Toggle dark mode"
              />
              <Moon className={`h-3.5 w-3.5 ${dark ? "text-primary" : "text-muted-foreground"}`} />
              <Label htmlFor="home-theme" className="cursor-pointer text-[12px] text-muted-foreground">
                {dark ? "Dark" : "Light"} mode
              </Label>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <Badge variant="outline" className="rounded-full border-border/70 bg-background/60 px-3 py-1 text-[11px] font-medium backdrop-blur">
              <Sparkles className="mr-1.5 h-3 w-3 text-[color:var(--accent-orange)]" />
              Welcome back, {account.username} — AI booking across 90+ stations
            </Badge>
          </div>

          <h1 className="text-center text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Every journey. Every mode. <span className="text-brand-gradient">One search.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-[15px] text-muted-foreground">
            Trains, buses, flights, hotels, metro and ferries — plus last-mile Cabber rides. Just say where you're going.
          </p>

          <div className="mt-8">
            <SmartSearch mode="train" value={search} onChange={(p) => setSearch((s) => ({ ...s, ...p }))} onSubmit={() => go("train")} />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
            {transportModes.map((m) => (
              <button
                key={m.id}
                onClick={() => go(m.id)}
                className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 text-left backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <BrandIcon name={m.id} label={m.label} size={64} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{m.label}</div>
                  <div className="text-[12px] leading-relaxed text-muted-foreground">{m.blurb}</div>
                </div>
                <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
              </button>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            <FeatureCard icon={<Zap className="h-5 w-5" />} title="Pre-Tatkal queue" text="Save the whole booking before 10:00 AM. When it opens you only pay." />
            <FeatureCard icon={<Shield className="h-5 w-5" />} title="Confirmation probability" text="See the real chance of a berth before you pay — not after." />
            <FeatureCard icon={<RouteIcon className="h-5 w-5" />} title="Cabber last mile" text="Bike, auto, sedan or SUV from your door to the platform." />
          </div>

          <Card className="glass-card mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl p-6 md:flex-row md:items-center">
            <div>
              <div className="text-sm font-semibold">Enjoying TripSync?</div>
              <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                Rate the app and help us shape what gets built next.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <StarRating stars={appScore.stars} count={appScore.count} />
                <span className="text-[12px] text-muted-foreground">{ratingTone(appScore.stars)}</span>
              </div>
            </div>
            <RateDialog
              ratingKey="app"
              title="TripSync"
              subtitle="Tell us how the whole experience feels — search, booking, wallet and everything in between."
              trigger={
                <Button className="rounded-full brand-gradient text-white">
                  {ratings["app"] ? "Update your rating" : "Rate this app"}
                </Button>
              }
            />
          </Card>

          <Card className="glass-card mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl p-6 md:flex-row md:items-center">
            <div>
              <div className="text-sm font-semibold">Built for a hackathon, designed like a product</div>
              <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                Every fare, train, driver and QR code here is fictional. Read what this prototype demonstrates.
              </p>
            </div>
            <Link to="/about" className="inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-white brand-gradient">
              About this project <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Card>
        </motion.section>
      </AppShell>
      <AIChat />
    </>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/70 p-5 backdrop-blur">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--brand-soft)] text-primary">{icon}</div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{text}</div>
    </Card>
  );
}
