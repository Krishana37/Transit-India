import { Gift, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { isRewardExpired, type RedeemedReward } from "@/lib/store";
import { cn } from "@/lib/utils";

export type RewardEligibility = { ok: boolean; reason?: string };

/** Which one-trip rewards make sense for the booking currently in checkout. */
export function rewardEligibility(
  r: RedeemedReward,
  ctx: { mode: string; hasMeals: boolean; total: number },
): RewardEligibility {
  if (isRewardExpired(r)) return { ok: false, reason: "This reward has expired." };
  if (r.status !== "redeemed") return { ok: false, reason: "Already used on another trip." };
  if (ctx.total <= 0) return { ok: false, reason: "Nothing left to discount on this fare." };
  switch (r.rewardId) {
    case "meal-upgrade":
      return ctx.hasMeals
        ? { ok: true }
        : { ok: false, reason: "Add at least one meal to this booking to use the meal upgrade." };
    case "seat-upgrade":
      return ["train", "bus", "flight"].includes(ctx.mode)
        ? { ok: true }
        : { ok: false, reason: "Seat upgrades apply to train, bus and flight bookings only." };
    case "baggage":
      return ["flight", "bus"].includes(ctx.mode)
        ? { ok: true }
        : { ok: false, reason: "Extra baggage applies to flight and bus bookings only." };
    case "lounge":
      return ["flight", "train"].includes(ctx.mode)
        ? { ok: true }
        : { ok: false, reason: "Lounge access applies to flight and train bookings only." };
    default:
      return { ok: true };
  }
}

export function RewardRedeemCard({
  rewards, mode, hasMeals, total, selectedId, onSelect,
}: {
  rewards: RedeemedReward[];
  mode: string;
  hasMeals: boolean;
  total: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { formatCurrency } = useI18n();

  return (
    <Card className="glass-card rounded-2xl p-4">
      <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[color:var(--brand-soft)] text-primary">
          <Gift className="h-4 w-4" />
        </span>
        <span className="min-w-0 break-words">Redeem Rewards</span>
      </div>

      {rewards.length === 0 ? (
        <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
          You have no unused rewards right now. Redeem Transit Points on the Rewards page to unlock meal upgrades,
          seat upgrades and fare discounts.
        </p>
      ) : (
        <>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Each reward is valid for ONE trip. Applying it here locks it to this booking.
          </p>
          <div className="mt-3 space-y-2">
            {rewards.map((r) => {
              const elig = rewardEligibility(r, { mode, hasMeals, total });
              const selected = selectedId === r.id;
              const value = Math.min(r.discount, total);
              return (
                <button
                  key={r.id}
                  type="button"
                  disabled={!elig.ok}
                  onClick={() => onSelect(selected ? null : r.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition",
                    selected ? "border-primary bg-[color:var(--brand-soft)]" : "border-border bg-muted/40",
                    !elig.ok && "cursor-not-allowed opacity-60",
                  )}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <div className="min-w-0">
                      <div className="break-words text-[13px] font-semibold leading-snug">{r.name}</div>
                      <div className="mt-0.5 break-words text-[11px] leading-relaxed text-muted-foreground">{r.benefit}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[13px] font-semibold text-primary">−{formatCurrency(value)}</div>
                      {selected && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                          <Check className="h-3 w-3" /> Applied
                        </span>
                      )}
                    </div>
                  </div>
                  {!elig.ok && (
                    <div className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                      <Info className="mt-[2px] h-3 w-3 shrink-0" />
                      <span className="min-w-0 break-words">{elig.reason}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {selectedId && (
            <Button size="sm" variant="ghost" className="mt-3 rounded-full" onClick={() => onSelect(null)}>
              Remove reward
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
