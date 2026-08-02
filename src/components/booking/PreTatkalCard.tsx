import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { meals } from "@/lib/inventory";
import type { Segment } from "@/lib/inventory";
import { useStore, type PreTatkalDraft } from "@/lib/store";
import { cn } from "@/lib/utils";

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

const quickMeals = meals.filter((m) => ["Breakfast", "Lunch", "Dinner"].includes(m.category)).slice(0, 6);

export function PreTatkalCard({
  segments, fromCode, toCode, date, onProceedToPayment,
}: {
  segments: Segment[];
  fromCode: string;
  toCode: string;
  date: string;
  onProceedToPayment: (draft: PreTatkalDraft) => void;
}) {
  const { formatCurrency } = useI18n();
  const { passengers, paymentMethods, tatkalDrafts, saveTatkalDraft, removeTatkalDraft, notify } = useStore();
  const [remaining, setRemaining] = useState(msUntilNextTenAM());
  const [forceLive, setForceLive] = useState(false);
  const notified = useRef(false);

  const [open, setOpen] = useState(false);
  const [segmentId, setSegmentId] = useState(segments[0]?.id ?? "");
  const [classCode, setClassCode] = useState(segments[0]?.options[0]?.code ?? "");
  const [passengerIds, setPassengerIds] = useState<string[]>([]);
  const [mealIds, setMealIds] = useState<string[]>([]);
  const [boarding, setBoarding] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0]?.id ?? "");

  useEffect(() => {
    const id = setInterval(() => setRemaining(msUntilNextTenAM()), 1000);
    return () => clearInterval(id);
  }, []);

  const live = forceLive || remaining < 1000;

  useEffect(() => {
    if (live && !notified.current && tatkalDrafts.length > 0) {
      notified.current = true;
      notify({ kind: "tatkal", title: "Tatkal is live", body: "The 10:00 AM Tatkal window is now open — proceed to payment for your saved requests." });
    }
  }, [live, notify, tatkalDrafts.length]);

  const segment = segments.find((s) => s.id === segmentId) ?? segments[0];
  const option = segment?.options.find((o) => o.code === classCode) ?? segment?.options[0];
  const paxCount = Math.max(1, passengerIds.length);
  const total = option ? option.fare * paxCount + mealIds.reduce((sum, id) => sum + (meals.find((m) => m.id === id)?.price ?? 0), 0) : 0;

  const togglePax = (id: string) => setPassengerIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleMeal = (id: string) => setMealIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const save = () => {
    if (!segment || !option) return;
    saveTatkalDraft({
      serviceName: segment.name,
      fromCode, toCode, date,
      classCode: option.code,
      passengerIds,
      mealIds: mealIds.map((id) => ({ id, qty: 1 })),
      boarding: boarding || fromCode,
      paymentMethodId,
      total,
      armed: false,
    });
    setOpen(false);
  };

  return (
    <Card className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[color:var(--brand-soft)] text-primary">
          <Zap className="h-4 w-4" />
        </span>
        Pre-Tatkal queue
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Save passengers, payment preference, meals and boarding point now. When the 10:00 AM Tatkal window opens, just pay.
      </p>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-muted px-3 py-2">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Window opens in</span>
        <span className={live ? "font-mono text-sm font-semibold text-[color:var(--success)]" : "font-mono text-sm font-semibold"}>
          {live ? "LIVE" : fmtCountdown(remaining)}
        </span>
      </div>

      {!live && (
        <Button variant="ghost" size="sm" className="mt-2 w-full rounded-full text-[11px] text-muted-foreground" onClick={() => setForceLive(true)}>
          Simulate Tatkal opening (demo)
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-3 w-full rounded-full" disabled={!segment}>
            Save booking for Tatkal
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>Pre-Tatkal request</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Train</Label>
              <Select value={segmentId} onValueChange={(v) => { setSegmentId(v); setClassCode(segments.find((s) => s.id === v)?.options[0]?.code ?? ""); }}>
                <SelectTrigger><SelectValue placeholder="Choose train" /></SelectTrigger>
                <SelectContent>
                  {segments.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} · {s.depart}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {segment && (
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Class</Label>
                <Select value={classCode} onValueChange={setClassCode}>
                  <SelectTrigger><SelectValue placeholder="Choose class" /></SelectTrigger>
                  <SelectContent>
                    {segment.options.map((o) => <SelectItem key={o.code} value={o.code}>{o.label} · {formatCurrency(o.fare)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Passengers</Label>
              <div className="flex flex-wrap gap-1.5">
                {passengers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePax(p.id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[12px]",
                      passengerIds.includes(p.id) ? "border-primary bg-[color:var(--brand-soft)] text-primary" : "border-border text-muted-foreground",
                    )}
                  >
                    {p.fullName}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Meals (optional)</Label>
              <div className="flex flex-wrap gap-1.5">
                {quickMeals.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMeal(m.id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[12px]",
                      mealIds.includes(m.id) ? "border-primary bg-[color:var(--brand-soft)] text-primary" : "border-border text-muted-foreground",
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Boarding point</Label>
                <Input value={boarding} onChange={(e) => setBoarding(e.target.value)} placeholder={fromCode} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Payment preference</Label>
                <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
                  <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-xl bg-muted px-3 py-2 text-[12px] text-muted-foreground">
              Estimated total: <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="rounded-full brand-gradient text-white" onClick={save} disabled={!segment || passengerIds.length === 0}>Save request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {tatkalDrafts.length > 0 && (
        <div className="mt-4 space-y-2">
          {tatkalDrafts.map((d) => (
            <div key={d.id} className="rounded-xl border border-border bg-background/70 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{d.serviceName}</div>
                <Badge variant="outline" className="rounded-full border-[color:var(--accent-orange)]/40 text-[10px] text-[color:var(--accent-orange)]">Queued</Badge>
              </div>
              <div className="text-[11px] text-muted-foreground">{d.fromCode} → {d.toCode} · {d.classCode} · {formatCurrency(d.total)}</div>
              <div className="mt-2 flex gap-2">
                {live && (
                  <Button size="sm" onClick={() => onProceedToPayment(d)} className="flex-1 rounded-full brand-gradient text-white">
                    Proceed to payment
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => removeTatkalDraft(d.id)} className="rounded-full text-muted-foreground">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
