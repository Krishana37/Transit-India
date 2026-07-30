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
          <div key={i} className="flex items-center justify-between text-[13px]">
            <span className={l.muted ? "text-muted-foreground" : "text-foreground"}>{l.label}</span>
            <span className={l.muted ? "text-muted-foreground" : "font-medium"}>{formatCurrency(l.amount)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-semibold">Total</span>
        <span className="text-lg font-bold text-brand-gradient">{formatCurrency(total)}</span>
      </div>
      {note && <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{note}</p>}
    </Card>
  );
}
