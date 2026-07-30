import { useMemo } from "react";
import { cn } from "@/lib/utils";

/** Deterministic decorative "QR" grid derived from a seed string. Not a real QR — links nowhere. */
export function QrCode({ seed, size = 132, className }: { seed: string; className?: string; size?: number }) {
  const cells = useMemo(() => {
    const grid = 11;
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const out: boolean[] = [];
    for (let i = 0; i < grid * grid; i++) {
      h ^= h << 13; h >>>= 0;
      h ^= h >>> 17;
      h ^= h << 5; h >>>= 0;
      out.push(h % 3 !== 0);
    }
    return { grid, out };
  }, [seed]);

  const { grid, out } = cells;
  const cellSize = size / grid;

  return (
    <svg
      role="img"
      aria-label="Decorative demo QR code"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("rounded-lg bg-white p-1", className)}
    >
      {Array.from({ length: grid }).map((_, r) =>
        Array.from({ length: grid }).map((_, c) => {
          const isFinder =
            (r < 3 && c < 3) || (r < 3 && c >= grid - 3) || (r >= grid - 3 && c < 3);
          const on = isFinder ? (r === 0 || r === 2 || c === 0 || c === 2 || (r === 1 && c === 1)) : out[r * grid + c];
          if (!on) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#111"
            />
          );
        }),
      )}
    </svg>
  );
}
