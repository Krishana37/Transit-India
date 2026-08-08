import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle, Bot, Car, Globe2, Languages, MapPinned, ReceiptText, Ticket, Timer, Users,
} from "lucide-react";
import { BrandIcon } from "@/components/brand/BrandAssets";
import { AppShell } from "@/components/transit/AppShell";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TripSync | AI travel booking prototype" },
      {
        name: "description",
        content: "Learn how the TripSync hackathon prototype demonstrates conversational AI, pre-Tatkal booking, multi-transport search, multilingual UX and last-mile connectivity.",
      },
      { property: "og:title", content: "About TripSync" },
      {
        property: "og:description",
        content: "A conceptual AI-powered travel platform prototype built for a hackathon — conversational booking, Tatkal automation, and more.",
      },
    ],
  }),
  component: AboutPage,
});

const features = [
  { icon: Bot, title: "Conversational AI", body: "Yatra, the in-app assistant, reasons about cheapest, fastest and budget-constrained requests and searches live prototype inventory to answer." },
  { icon: Timer, title: "Pre-Tatkal Queue", body: "Prepare a booking ahead of time and auto-submit the moment the Tatkal window opens, down to the second." },
  { icon: Ticket, title: "Multi-transport Booking", body: "One search flow spans trains, buses, flights, hotels, metro and ferries with a consistent fare model." },
  { icon: Users, title: "Passenger Management", body: "Save traveller profiles once — name, age, berth preference and ID — and reuse them across every booking." },
  { icon: Languages, title: "Multilingual + RTL", body: "The whole UI translates on the fly across 14 languages, including full right-to-left layout for Arabic." },
  { icon: Car, title: "Cabber Last-mile", body: "Book a cab straight from your arrival station or airport to finish the journey door to door." },
  { icon: ReceiptText, title: "Transparent Fares", body: "Every fare is broken down by distance, class and demand so pricing logic is never a black box." },
  { icon: MapPinned, title: "Digital Tickets", body: "Confirmed bookings generate a shareable digital ticket with QR code, ready for the dashboard or wallet." },
];

const steps = [
  { title: "Describe your trip", body: "Type a route, date and preference in plain language — Yatra or the search bar understands it." },
  { title: "Compare grounded options", body: "Results are generated from a deterministic fictional inventory, so fares and timings stay consistent." },
  { title: "Pick passengers & extras", body: "Attach saved passengers, choose seats or meals, and review the transparent fare breakdown." },
  { title: "Confirm & get your ticket", body: "Complete the mock payment flow and receive an instant digital ticket with QR code." },
];



function AboutPage() {
  const { t } = useI18n();

  return (
    <AppShell>
      <div className="space-y-16 pb-10">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl space-y-5 text-center"
        >
          <BrandIcon name="about" label="About" size={112} className="mx-auto" eager />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[color:var(--brand-soft)] px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Globe2 className="h-3 w-3" /> Hackathon Prototype
          </span>
          <h1 className="text-4xl font-bold leading-tight text-brand-gradient sm:text-5xl">
            One conversation, every way to travel across India
          </h1>
          <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm">{t("about.summary")}</p>
        </motion.section>

        <section>
          <div className="mb-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">What it demonstrates</p>
            <h2 className="mt-1 text-2xl font-semibold">Built to showcase modern travel UX</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full rounded-2xl p-5">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-full text-white brand-gradient">
                    <f.icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{f.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">How it works</p>
            <h2 className="mt-1 text-2xl font-semibold">From a sentence to a ticket</h2>
          </div>
          <div className="mx-auto grid max-w-3xl gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="glass-card flex items-start gap-4 rounded-2xl p-4"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold text-white brand-gradient">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        <section className="mx-auto max-w-3xl">
          <Card className="rounded-3xl border-[color:var(--accent-orange)]/30 bg-[color:var(--brand-soft)] p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[color:var(--accent-orange)]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Disclaimer</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{t("disclaimer.text")}</p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
