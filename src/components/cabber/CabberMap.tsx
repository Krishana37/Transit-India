import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Purely decorative, fictional prototype "map" rendered as an SVG.
 * No real GPS / tiles — a stylised road grid + park/water block + animated route.
 */
export function CabberMap({
  distanceKm,
  etaMins,
  status = "en-route",
  className,
}: {
  distanceKm: number;
  etaMins: number;
  status?: "en-route" | "arriving" | "idle";
  className?: string;
}) {
  const seed = Math.round(distanceKm * 13 + etaMins * 7);
  const roads = useMemo(() => {
    const vertical = [40, 95, 150, 210, 265, 320];
    const horizontal = [30, 80, 130, 175, 220];
    return { vertical, horizontal };
  }, []);

  // Fixed pickup/destination pin positions + route path (fictional).
  const pickup = { x: 55, y: 205 };
  const dest = { x: 300, y: 45 };
  const path = `M ${pickup.x} ${pickup.y} C ${pickup.x + 40} ${pickup.y - 60}, ${dest.x - 90} ${dest.y + 70}, ${dest.x - 20} ${dest.y + 10} S ${dest.x - 4} ${dest.y + 2}, ${dest.x} ${dest.y}`;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-muted/40", className)}>
      <svg viewBox="0 0 360 250" className="h-full w-full" role="img" aria-label="Prototype ride map">
        <rect x={0} y={0} width={360} height={250} className="fill-muted/30" />

        {/* park block */}
        <rect x={210} y={130} width={90} height={70} rx={10} className="fill-[color:var(--success)]/10" />
        {/* water block */}
        <rect x={0} y={0} width={70} height={90} rx={10} className="fill-primary/10" />

        {/* road grid */}
        {roads.vertical.map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={250} stroke="currentColor" strokeOpacity={0.12} strokeWidth={6} />
        ))}
        {roads.horizontal.map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={360} y2={y} stroke="currentColor" strokeOpacity={0.12} strokeWidth={6} />
        ))}
        {roads.vertical.map((x) => (
          <line key={`vd${x}`} x1={x} y1={0} x2={x} y2={250} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} strokeDasharray="4 4" />
        ))}

        {/* animated route */}
        <motion.path
          d={path}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray="8 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />

        {/* moving car marker */}
        {status !== "idle" && (
          <motion.g
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ offsetPath: `path('${path}')` as unknown as string, offsetRotate: "auto" }}
          >
            <circle r={7} className="fill-[color:var(--accent-orange)]" stroke="white" strokeWidth={1.5} />
          </motion.g>
        )}

        {/* pickup pin */}
        <g transform={`translate(${pickup.x} ${pickup.y})`}>
          <circle r={9} className="fill-primary" opacity={0.18} />
          <circle r={5} className="fill-primary" stroke="white" strokeWidth={1.5} />
        </g>
        {/* destination pin */}
        <g transform={`translate(${dest.x} ${dest.y})`}>
          <circle r={9} className="fill-[color:var(--destructive)]" opacity={0.18} />
          <path d="M0 -10 C 6 -10 10 -6 10 -1 C 10 6 0 14 0 14 C 0 14 -10 6 -10 -1 C -10 -6 -6 -10 0 -10 Z" className="fill-[color:var(--destructive)]" stroke="white" strokeWidth={1.2} />
        </g>
      </svg>

      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
        {distanceKm} km · {etaMins} min ETA
      </div>
      <div className="absolute bottom-3 right-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
        Prototype map · fictional
      </div>
    </div>
  );
}
