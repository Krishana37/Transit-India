import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";
import { POINT_VALUE, maxPointDiscount } from "@/lib/store";

export function PointsRedeemCard({
  points, total, applied, onApply,
}: { points: number; total: number; applied: number; onApply: (points: number) => void }) {
  const { formatCurrency } = useI18n();
  const maxDiscount = maxPointDiscount(total, points);
  const maxPoints = Math.min(points, Math.ceil(maxDiscount / POINT_VALUE));
  const appliedDiscount = Math.floor(applied * POINT_VALUE);

  return (
    <Card className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[color:var(--brand-soft)] text-primary">
          <Star className="h-4 w-4" />
        </span>
        TripSync Points
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
        <div className="rounded-xl bg-muted px-3 py-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Available</div>
          <div className="text-sm font-semibold">{points} pts</div>
        </div>
        <div className="rounded-xl bg-muted px-3 py-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Max discount</div>
          <div className="text-sm font-semibold">{formatCurrency(maxDiscount)}</div>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground" data-a11y="optional">
        1 Transit Point = {formatCurrency(POINT_VALUE)}. You can never redeem more points than you own.
      </p>

      {maxPoints > 0 ? (
        <>
          <div className="mt-4 flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground">Apply points</span>
            <span className="font-medium">{applied} pts · −{formatCurrency(appliedDiscount)}</span>
          </div>
          <Slider value={[applied]} max={maxPoints} step={1} onValueChange={([v]) => onApply(v)} className="mt-2" />
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => onApply(maxPoints)}>
              Apply max
            </Button>
            {applied > 0 && (
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => onApply(0)}>
                Remove
              </Button>
            )}
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground">Points remaining after redemption: {points - applied}</div>
        </>
      ) : (
        <p className="mt-3 text-[12px] text-muted-foreground">Not enough points to redeem on this fare yet.</p>
      )}
    </Card>
  );
}
