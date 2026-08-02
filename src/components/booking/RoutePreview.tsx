import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MapPin, Route as RouteIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buildRoutePreview, type RouteMode } from "@/lib/inventory";
import { cn } from "@/lib/utils";

export function RoutePreview({
  mode, origin, destination, km, totalMins, seed,
}: { mode: RouteMode; origin: string; destination: string; km: number; totalMins: number; seed: string }) {
  const [open, setOpen] = useState(false);
  const preview = buildRoutePreview(mode, origin, destination, km, totalMins, seed);

  return (
    <div className="mt-3 rounded-xl border border-border/60 bg-background/50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
          <RouteIcon className="h-3.5 w-3.5 text-primary" /> Full route · {preview.networkName}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-border/60 px-3 py-3">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <Badge variant="outline" className="rounded-full text-[10px]">{preview.distanceKm} km</Badge>
                <Badge variant="outline" className="rounded-full text-[10px]">{preview.duration}</Badge>
              </div>
              <ol className="space-y-3">
                {preview.stops.map((s, i) => (
                  <li key={`${s.name}-${i}`} className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                          i === 0 || i === preview.stops.length - 1
                            ? "border-primary bg-[color:var(--brand-soft)]"
                            : "border-border bg-background",
                        )}
                      >
                        <MapPin className="h-2.5 w-2.5 text-primary" />
                      </span>
                      {i < preview.stops.length - 1 && <span className="mt-0.5 h-full w-px flex-1 bg-border" />}
                    </div>
                    <div className="pb-3">
                      <div className="text-[13px] font-medium">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {s.at} · {s.km} km{s.halt ? ` · ${s.halt}` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="text-[11px] leading-relaxed text-muted-foreground" data-a11y="optional">{preview.note}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
