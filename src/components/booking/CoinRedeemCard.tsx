import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";
import { COIN_VALUE, maxCoinDiscount } from "@/lib/store";

export function CoinRedeemCard({
  coins, total, applied, onApply,
}: { coins: number; total: number; applied: number; onApply: (coins: number) => void }) {
  const { formatCurrency } = useI18n();
  const maxDiscount = maxCoinDiscount(total, coins);
  const maxCoins = Math.min(coins, Math.floor(maxDiscount / COIN_VALUE));
  const appliedDiscount = Math.round(applied * COIN_VALUE);

  return (
    <Card className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[color:var(--brand-soft)] text-primary">
          <Coins className="h-4 w-4" />
        </span>
        Transit Coins
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
        <div className="rounded-xl bg-muted px-3 py-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Available</div>
          <div className="text-sm font-semibold">{coins} coins</div>
        </div>
        <div className="rounded-xl bg-muted px-3 py-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Max discount</div>
          <div className="text-sm font-semibold">{formatCurrency(maxDiscount)}</div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground" data-a11y="optional">
        1 coin = ₹{COIN_VALUE.toFixed(2)}, capped at 15% of the fare.
      </p>

      {maxCoins > 0 ? (
        <>
          <div className="mt-4 flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground">Apply coins</span>
            <span className="font-medium">{applied} coins · −{formatCurrency(appliedDiscount)}</span>
          </div>
          <Slider
            value={[applied]}
            max={maxCoins}
            step={1}
            onValueChange={([v]) => onApply(v)}
            className="mt-2"
          />
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => onApply(maxCoins)}>
              Apply max
            </Button>
            {applied > 0 && (
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => onApply(0)}>
                Remove
              </Button>
            )}
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground">
            Coins remaining after redemption: {coins - applied}
          </div>
        </>
      ) : (
        <p className="mt-3 text-[12px] text-muted-foreground">You don't have enough coins to redeem on this fare yet.</p>
      )}
    </Card>
  );
}
