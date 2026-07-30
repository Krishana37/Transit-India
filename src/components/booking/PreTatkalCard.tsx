import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useStore, type Booking } from "@/lib/store";

function msUntilNextTenAM() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(10, 0, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

function fmtCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/** Sidebar card offering to save the current booking as a queued Pre-Tatkal request. */
export function PreTatkalCard({
  onSaveQueued, onCompletePayment,
}: {
  onSaveQueued: () => void;
  onCompletePayment: (booking: Booking) => void;
}) {
  const { t } = useI18n();
  const { bookings } = useStore();
  const [remaining, setRemaining] = useState(msUntilNextTenAM());
  const notified = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setRemaining(msUntilNextTenAM()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining < 1000 && !notified.current) {
      notified.current = true;
      toast.success(t("tatkal.live"));
    }
  }, [remaining, t]);

  const live = remaining < 1000;
  const queued = bookings.filter((b) => b.status === "queued" && b.tatkal);

  return (
    <Card className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[color:var(--brand-soft)] text-primary">
          <Zap className="h-4 w-4" />
        </span>
        Pre-Tatkal queue
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Save your whole booking now — passengers, class and fare locked in. When the 10:00 AM Tatkal window opens, just pay.
      </p>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-muted px-3 py-2">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Window opens in</span>
        <span className={live ? "font-mono text-sm font-semibold text-[color:var(--success)]" : "font-mono text-sm font-semibold"}>
          {live ? "LIVE" : fmtCountdown(remaining)}
        </span>
      </div>

      {!live && (
        <Button onClick={onSaveQueued} variant="outline" className="mt-3 w-full rounded-full">
          Save booking for Tatkal
        </Button>
      )}

      {queued.length > 0 && (
        <div className="mt-4 space-y-2">
          {queued.map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-background/70 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{b.serviceName}</div>
                <Badge variant="outline" className="rounded-full border-[color:var(--accent-orange)]/40 text-[10px] text-[color:var(--accent-orange)]">Queued</Badge>
              </div>
              <div className="text-[11px] text-muted-foreground">{b.fromCity} → {b.toCity} · {b.classCode}</div>
              {live && (
                <Button size="sm" onClick={() => onCompletePayment(b)} className="mt-2 w-full rounded-full brand-gradient text-white">
                  Complete payment
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
