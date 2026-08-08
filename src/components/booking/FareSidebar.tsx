import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type FareLine = { label: string; amount: number; muted?: boolean };

export function FareSidebar({
  title = "Fare summary", lines, total, sticky = true, note,
}: { title?: string; lines: FareLine[]; total: number; sticky?: boolean; note?: string }) {
  const { formatCurrency } = useI18n();
  return (
    <Card className={cn("glass-card rounded-2xl p-4", sticky && "md:sticky md:top-24")}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 text-[13px]">
            <span className={cn("min-w-0 break-words leading-snug", l.muted ? "text-muted-foreground" : "text-foreground")}>
              {l.label}
            </span>
            <span className={cn("shrink-0 text-right tabular-nums", l.muted ? "text-muted-foreground" : "font-medium")}>
              {formatCurrency(l.amount)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-t border-border pt-3">
        <span className="min-w-0 text-sm font-semibold">Total</span>
        <span className="shrink-0 text-right text-lg font-bold tabular-nums text-brand-gradient">{formatCurrency(total)}</span>
      </div>
      {note && <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{note}</p>}
    </Card>
  );
}
