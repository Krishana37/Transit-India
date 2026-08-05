import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandIcon } from "@/components/brand/BrandAssets";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bus, Car, CheckCircle2, Clock, MapPin, Plane, Ship, Ticket, Train, TrainFront, Users, XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/transit/AppShell";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketCard } from "@/components/booking/TicketCard";
import { useI18n } from "@/lib/i18n";
import { canCancelBooking, journeyPhase, refundEligibility, useStore, type Booking } from "@/lib/store";
import { ServicePreview } from "@/components/media/ServicePreview";
import { RateDialog } from "@/components/common/RateDialog";
import { serviceRatingKey } from "@/lib/ratings";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trips")({
  head: () => ({
    meta: [
      { title: "My Trips — Transit India" },
      { name: "description", content: "Track upcoming journeys, revisit completed trips and manage cancellations and refunds." },
      { property: "og:title", content: "My Trips — Transit India" },
      { property: "og:description", content: "All your upcoming, completed and cancelled bookings across trains, buses, flights and more." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TripsPage,
});

type Phase = "upcoming" | "completed" | "cancelled";

const modeIcons: Record<string, typeof Train> = {
  train: Train, bus: Bus, flight: Plane, metro: TrainFront, ferry: Ship, hotel: Ticket, cab: Car,
};

const refundLabels: Record<string, string> = {
  train: "Train refund", bus: "Bus refund", flight: "Flight refund", ferry: "Ferry refund",
  metro: "Metro refund", hotel: "Hotel refund", cab: "Cab refund",
};

const statusStyles: Record<string, string> = {
  confirmed: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  queued: "bg-[color:var(--accent-orange)]/15 text-[color:var(--accent-orange)]",
  cancelled: "bg-[color:var(--destructive)]/15 text-[color:var(--destructive)]",
  refunded: "bg-muted text-muted-foreground",
  completed: "bg-primary/10 text-primary",
};

function TripsPage() {
  const { bookings } = useStore();
  const [tab, setTab] = useState<Phase>("upcoming");

  const grouped = useMemo(() => {
    const out: Record<Phase, Booking[]> = { upcoming: [], completed: [], cancelled: [] };
    for (const b of bookings) out[journeyPhase(b)].push(b);
    return out;
  }, [bookings]);

  return (
    <AppShell>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex min-w-0 items-center gap-4">
          <BrandIcon name="trips" label="My Trips" size={72} className="sm:!h-20 sm:!w-20" eager />
          <div className="min-w-0">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground">Bookings</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My Trips</h1>
            <p className="text-[13px] text-muted-foreground">Track journeys, manage cancellations and request refunds.</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Phase)}>
          <TabsList className="grid w-full grid-cols-3 rounded-full">
            <TabsTrigger className="rounded-full text-[13px]" value="upcoming">Upcoming ({grouped.upcoming.length})</TabsTrigger>
            <TabsTrigger className="rounded-full text-[13px]" value="completed">Completed ({grouped.completed.length})</TabsTrigger>
            <TabsTrigger className="rounded-full text-[13px]" value="cancelled">Cancelled ({grouped.cancelled.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {grouped[tab].length === 0 ? (
          <EmptyState phase={tab} />
        ) : (
          <div className="space-y-4">
            {grouped[tab].map((b) => (
              <TripCard key={b.id} booking={b} phase={tab} />
            ))}
          </div>
        )}
      </motion.section>
    </AppShell>
  );
}

function EmptyState({ phase }: { phase: Phase }) {
  const copy: Record<Phase, { title: string; body: string }> = {
    upcoming: { title: "No upcoming trips", body: "Book a train, bus or flight and it will show up here with live status." },
    completed: { title: "No completed trips yet", body: "Once a journey's arrival time passes, it will move here automatically." },
    cancelled: { title: "No cancelled trips", body: "Cancelled bookings and their refund status will appear in this tab." },
  };
  const Icon = phase === "upcoming" ? Clock : phase === "completed" ? CheckCircle2 : XCircle;
  return (
    <Card className="glass-card grid place-items-center gap-3 rounded-3xl p-10 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">{copy[phase].title}</p>
      <p className="max-w-xs text-[13px] text-muted-foreground">{copy[phase].body}</p>
      <Button asChild className="rounded-full brand-gradient text-white">
        <Link to="/book/$mode" params={{ mode: "train" }}>Book a trip</Link>
      </Button>
    </Card>
  );
}

function TripCard({ booking, phase }: { booking: Booking; phase: Phase }) {
  const { formatDate, formatCurrency } = useI18n();
  const { cancelBooking } = useStore();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const Icon = modeIcons[booking.mode] ?? Ticket;
  const cancellable = canCancelBooking(booking);
  const first = booking.passengers[0];
  const more = booking.passengers.length - 1;

  return (
    <Card className="glass-card rounded-2xl p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 gap-3">
          <ServicePreview
            mode={booking.mode}
            seed={booking.serviceCode}
            alt={`${booking.serviceName} preview`}
            className="hidden w-28 shrink-0 sm:block"
            ratio="aspect-[4/3]"
          />
          <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate text-[15px] font-semibold">{booking.serviceName}</span>
            <span className="shrink-0 text-[12px] text-muted-foreground">{booking.serviceCode}</span>
          </div>
          <p className="mt-1 truncate text-[13px] text-muted-foreground">
            {booking.fromCity} <span aria-hidden>→</span> {booking.toCity}
          </p>
          <p className="text-[12px] text-muted-foreground">
            {formatDate(booking.date)} · {booking.depart}–{booking.arrive} · {booking.classCode}
          </p>
          {booking.mode === "train" ? (
            <p className="mt-1 text-[12px] text-muted-foreground">
              PNR {booking.pnr} ·{" "}
              <Link to="/pnr" search={{ pnr: booking.pnr }} className="text-primary underline-offset-2 hover:underline">
                Track PNR
              </Link>
            </p>
          ) : (
            <p className="mt-1 text-[12px] text-muted-foreground">Booking reference {booking.id.toUpperCase()}</p>
          )}
          <p className="mt-1 flex items-center gap-1 text-[12px] text-muted-foreground">
            <Users className="h-3 w-3" /> {first?.fullName ?? "Guest"}{more > 0 ? ` +${more} more` : ""}
          </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge className={cn("rounded-full border-none capitalize", statusStyles[booking.status])}>{booking.status}</Badge>
          <span className="text-[15px] font-semibold">{formatCurrency(booking.total)}</span>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => setDetailOpen(true)}>
            View ticket
          </Button>
        </div>
      </div>

      {phase === "upcoming" && (
        <>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center justify-end gap-2">
            {cancellable ? (
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-[color:var(--destructive)] hover:text-[color:var(--destructive)]"
                onClick={() => setCancelOpen(true)}
              >
                Cancel booking
              </Button>
            ) : (
              <span className="text-[12px] text-muted-foreground">
                Departure window has closed — this booking can no longer be cancelled.
              </span>
            )}
          </div>
        </>
      )}

      {phase === "completed" && (
        <>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center justify-between gap-2" data-a11y="optional">
            <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" /> Journey completed
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <RateDialog
                ratingKey={serviceRatingKey(booking.mode, booking.serviceCode)}
                title={booking.serviceName}
                subtitle="How was this journey? Your rating helps other travellers choose."
                compact
              />
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link to="/book/$mode" params={{ mode: booking.mode as "train" }}>Book again</Link>
              </Button>
            </div>
          </div>
        </>
      )}

      {phase === "cancelled" && (
        <>
          <Separator className="my-4" />
          <div className="space-y-3">
            {booking.cancelReason && (
              <p className="text-[13px] text-muted-foreground">
                <span className="font-medium text-foreground">Reason: </span>{booking.cancelReason}
              </p>
            )}
            <RefundPanel booking={booking} />
          </div>
        </>
      )}

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              {booking.serviceName} on {formatDate(booking.date)} will be cancelled. You can request a refund afterwards if eligible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep booking</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-[color:var(--destructive)] text-white hover:bg-[color:var(--destructive)]/90"
              onClick={() => {
                cancelBooking(booking.id, "Cancelled by passenger");
                toast.success("Booking cancelled.");
                setCancelOpen(false);
              }}
            >
              Cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{booking.serviceName} ticket</DialogTitle>
          </DialogHeader>
          <TicketCard booking={booking} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function RefundPanel({ booking }: { booking: Booking }) {
  const { requestRefund } = useStore();
  const { formatCurrency } = useI18n();
  const elig = refundEligibility(booking);
  const label = refundLabels[booking.mode] ?? "Refund";

  if (booking.refundStatus === "credited" && booking.refundedAt) {
    const t0 = new Date(booking.refundedAt);
    const steps = [
      { label: "Requested", offsetMin: -40 },
      { label: "Approved", offsetMin: -25 },
      { label: "Processing", offsetMin: -10 },
      { label: "Credited to Transit Wallet", offsetMin: 0 },
    ];
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
        <p className="text-[13px] font-medium">Refund of {formatCurrency(booking.refundAmount ?? 0)} credited</p>
        <ol className="mt-3 space-y-2">
          {steps.map((s) => {
            const at = new Date(t0.getTime() + s.offsetMin * 60000);
            return (
              <li key={s.label} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[color:var(--success)]" />
                <span className="flex-1 text-foreground">{s.label}</span>
                <span>{at.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[11px] text-muted-foreground">Refunds always go to your Transit India Wallet.</p>
      </div>
    );
  }

  if (!elig.eligible) {
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-[13px] text-muted-foreground">
        {elig.reason}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium">Eligible refund: {formatCurrency(elig.amount)}</p>
          <p className="text-[12px] text-muted-foreground">{elig.reason}</p>
        </div>
        <Button
          size="sm"
          className="rounded-full brand-gradient text-white"
          onClick={() => {
            const res = requestRefund(booking.id);
            if (res.ok) toast.success(`${label} requested — credited to your Transit Wallet.`);
            else toast.error(res.error ?? "Could not process refund.");
          }}
        >
          Request refund
        </Button>
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
