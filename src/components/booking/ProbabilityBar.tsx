import { cn } from "@/lib/utils";

export function probabilityColor(p: number) {
  if (p >= 80) return "var(--success)";
  if (p >= 50) return "var(--accent-orange)";
  return "var(--destructive)";
}

export function ProbabilityBar({ probability, className }: { probability: number; className?: string }) {
  const color = probabilityColor(probability);
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>Confirmation chance</span>
        <span style={{ color }} className="font-semibold">
          {probability}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${probability}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function RouteLine({ depart, arrive, duration }: { depart: string; arrive: string; duration: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-right">
        <div className="font-semibold">{depart}</div>
      </div>
      <div className="flex flex-1 flex-col items-center px-1">
        <div className="text-[10px] text-muted-foreground">{duration}</div>
        <div className="relative my-1 flex w-full items-center">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span className="mx-1 h-px flex-1 border-t border-dashed border-border" />
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent-orange)]" />
        </div>
      </div>
      <div>
        <div className="font-semibold">{arrive}</div>
      </div>
    </div>
  );
}
