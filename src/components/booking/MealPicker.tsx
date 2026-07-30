import { Minus, Plus, UtensilsCrossed } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { meals, mealCategories } from "@/lib/inventory";
import { cn } from "@/lib/utils";

export function MealPicker({
  quantities, onChange,
}: { quantities: Record<string, number>; onChange: (id: string, qty: number) => void }) {
  const { formatCurrency } = useI18n();
  return (
    <div className="space-y-5">
      {mealCategories.map((cat) => (
        <div key={cat}>
          <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">{cat}</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {meals.filter((m) => m.category === cat).map((m) => {
              const qty = quantities[m.id] ?? 0;
              return (
                <Card key={m.id} className={cn("flex items-center justify-between gap-2 rounded-2xl p-3", qty > 0 && "border-primary/40 bg-[color:var(--brand-soft)]")}>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                      <UtensilsCrossed className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">{formatCurrency(m.price)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Decrease ${m.name}`}
                      onClick={() => onChange(m.id, Math.max(0, qty - 1))}
                      className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${m.name}`}
                      onClick={() => onChange(m.id, qty + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
