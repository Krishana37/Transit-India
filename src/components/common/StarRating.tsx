import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Read-only star row with optional score + review count. */
export function StarRating({
  stars,
  count,
  size = 14,
  className,
  showValue = true,
}: {
  stars: number;
  count?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, stars - (i - 1)));
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-muted-foreground/40" style={{ width: size, height: size }} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star
                  className="text-[color:var(--accent-orange)]"
                  style={{ width: size, height: size }}
                  fill="currentColor"
                />
              </span>
            </span>
          );
        })}
      </span>
      {showValue && (
        <span className="text-[12px] font-medium text-foreground">
          {stars.toFixed(1)}
          {count !== undefined && (
            <span className="ml-1 font-normal text-muted-foreground">({count.toLocaleString("en-IN")})</span>
          )}
        </span>
      )}
      <span className="sr-only">{stars.toFixed(1)} out of 5{count !== undefined ? ` from ${count} ratings` : ""}</span>
    </span>
  );
}

/** Interactive 1–5 star picker. */
export function StarInput({
  value,
  onChange,
  size = 30,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
  className?: string;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className={cn("inline-flex items-center gap-1", className)} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
          aria-pressed={value === i}
          onMouseEnter={() => setHover(i)}
          onFocus={() => setHover(i)}
          onClick={() => onChange(i)}
          className="rounded-full p-1 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition",
              i <= active ? "text-[color:var(--accent-orange)]" : "text-muted-foreground/40",
            )}
            fill={i <= active ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}
