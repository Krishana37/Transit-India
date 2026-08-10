import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  CalendarDays,
  Clock,
  Flame,
  History,
  MapPin,
  Mic,
  Search,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  locationsForMode,
  timeSlots,
  type Station,
} from "@/lib/dummy-data";

import { useI18n } from "@/lib/i18n";
import {
  routeCountFor,
  type TransportMode,
} from "@/lib/inventory";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================================
// AI SUGGESTIONS
// ============================================================

export const aiSuggestions = [
  "Book the cheapest morning train",
  "Find hotels near destination",
  "Show evening buses",
  "Fastest travel under ₹1500",
  "AC train tomorrow morning",
];

// ============================================================
// SEARCH STATE
// ============================================================

export type SearchState = {
  from: Station;
  to: Station;
  date: Date;
  slot: string;
  query: string;
};

// ============================================================
// MODE HELPERS
// ============================================================

function getModeLocations(mode: TransportMode): Station[] {
  return locationsForMode(mode);
}

function stationByCode(
  code: string | undefined,
  locations: Station[],
): Station | undefined {
  return (
    locations.find((station) => station.code === code) ??
    locations[0]
  );
}

// ============================================================
// SMART SEARCH
// ============================================================

export function SmartSearch({
  mode,
  value,
  onChange,
  onSubmit,
  compact,
}: {
  mode: TransportMode;
  value: SearchState;
  onChange: (patch: Partial<SearchState>) => void;
  onSubmit: () => void;
  compact?: boolean;
}) {
  const { t, formatDate } = useI18n();
  const { recentSearches, pushRecentSearch } = useStore();

  const [listening, setListening] = useState(false);

  const modeLocations = useMemo(
    () => getModeLocations(mode),
    [mode],
  );

  const sameStation =
    value.from.code === value.to.code;

  const submit = () => {
    if (sameStation) return;

    if (value.query.trim()) {
      pushRecentSearch(value.query.trim());
    }

    onSubmit();
  };

  const swap = () => {
    onChange({
      from: value.to,
      to: value.from,
    });
  };

  const voice = () => {
    setListening(true);

    setTimeout(() => {
      setListening(false);

      onChange({
        query:
          aiSuggestions[
            Math.floor(
              Math.random() *
                aiSuggestions.length,
            )
          ],
      });
    }, 1400);
  };

  /*
   * Make sure the current From/To stations belong
   * to the selected transport mode.
   */
  const safeFrom =
    stationByCode(
      value.from?.code,
      modeLocations,
    ) ?? modeLocations[0];

  const safeTo =
    stationByCode(
      value.to?.code,
      modeLocations,
    ) ??
    modeLocations[1] ??
    modeLocations[0];

  /*
   * If the parent state still contains locations
   * from another mode, automatically correct them.
   */
  if (
    safeFrom &&
    safeTo &&
    (
      value.from?.code !== safeFrom.code ||
      value.to?.code !== safeTo.code
    )
  ) {
    queueMicrotask(() => {
      onChange({
        from: safeFrom,
        to: safeTo,
      });
    });
  }

  return (
    <div className="mx-auto w-full">
      <Card
        className={cn(
          "glass-card rounded-3xl p-4 md:p-5",
          compact &&
            "rounded-2xl p-3 md:p-4",
        )}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_auto]">

          {/* FROM */}
          <StationPicker
            label={t("common.from")}
            value={safeFrom}
            locations={modeLocations}
            exclude={safeTo?.code}
            onChange={(station) =>
              onChange({
                from: station,
              })
            }
          />

          {/* SWAP */}
          <div className="hidden items-center justify-center md:flex">
            <button
              onClick={swap}
              type="button"
              aria-label="Swap stations"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition hover:rotate-180 hover:border-primary/50 hover:text-primary"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          {/* TO */}
          <StationPicker
            label={t("common.to")}
            value={safeTo}
            locations={modeLocations}
            exclude={safeFrom?.code}
            onChange={(station) =>
              onChange({
                to: station,
              })
            }
          />

          {/* DATE */}
          <DateField
            date={value.date}
            setDate={(date) =>
              onChange({ date })
            }
          />

          {/* TIME */}
          <SlotField
            slot={value.slot}
            setSlot={(slot) =>
              onChange({ slot })
            }
          />
        </div>

        {/* SAME LOCATION WARNING */}
        {sameStation && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-[13px] text-destructive">
            <TriangleAlert className="h-4 w-4" />

            {t("error.sameStation")}
          </div>
        )}

        <div className="mt-3 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">

            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
              <MapPin className="h-3 w-3" />

              {safeFrom?.city} → {safeTo?.city}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
              <CalendarDays className="h-3 w-3" />

              {formatDate(value.date)}
            </span>

            <button
              onClick={swap}
              type="button"
              className="underline md:hidden"
            >
              Swap
            </button>
          </div>

          <Button
            onClick={submit}
            disabled={sameStation}
            className="h-11 rounded-full px-6 text-white brand-gradient disabled:opacity-50"
          >
            <Search className="mr-1.5 h-4 w-4" />

            {t("common.search")} {mode}
          </Button>
        </div>
      </Card>

      {/* AI SEARCH */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="mt-4 flex items-center gap-2 rounded-full border border-border/70 bg-background/70 p-2 pl-5 backdrop-blur"
      >
        <Sparkles className="h-4 w-4 shrink-0 text-[color:var(--accent-orange)]" />

        <Input
          value={value.query}
          onChange={(event) =>
            onChange({
              query: event.target.value,
            })
          }
          placeholder='Ask in plain language — “Book the cheapest morning train”'
          className="h-10 flex-1 border-0 bg-transparent text-[14px] shadow-none focus-visible:ring-0"
        />

        <button
          type="button"
          onClick={voice}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full transition",
            listening
              ? "bg-[color:var(--accent-orange)]/20 text-[color:var(--accent-orange)] pulse-ring"
              : "bg-muted text-muted-foreground hover:bg-accent",
          )}
          aria-label="Voice search"
        >
          <Mic className="h-4 w-4" />
        </button>

        <Button
          type="submit"
          size="sm"
          className="h-9 rounded-full px-4 text-white brand-gradient"
        >
          Ask Yatra
        </Button>
      </form>

      {/* SUGGESTIONS */}
      <div className="mt-4 space-y-3">

        <ChipRow
          icon={
            <Sparkles className="h-3 w-3" />
          }
          label="AI suggestions"
          items={aiSuggestions}
          onPick={(query) =>
            onChange({ query })
          }
        />

        {recentSearches.length > 0 && (
          <ChipRow
            icon={
              <History className="h-3 w-3" />
            }
            label="Recent"
            items={recentSearches}
            onPick={(query) =>
              onChange({ query })
            }
          />
        )}

        {/* MODE-SPECIFIC POPULAR LOCATIONS */}
        <div className="flex flex-wrap items-center gap-2">

          <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Flame className="h-3 w-3" />
            Popular
          </span>

          {modeLocations
            .slice(0, 10)
            .map((station) => (
              <button
                key={station.code}
                type="button"
                onClick={() => {
                  if (
                    station.code ===
                    value.from.code
                  ) {
                    return;
                  }

                  onChange({
                    to: station,
                  });
                }}
                className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
              >
                {station.city} ({station.code})
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHIP ROW
// ============================================================

function ChipRow({
  icon,
  label,
  items,
  onPick,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">

      <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </span>

      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// STATION PICKER
// MODE-SPECIFIC
// ============================================================

export function StationPicker({
  label,
  value,
  locations,
  onChange,
  exclude,
}: {
  label: string;
  value: Station;
  locations: Station[];
  onChange: (station: Station) => void;
  exclude?: string;
}) {
  const [open, setOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  /*
   * IMPORTANT:
   * Search ONLY inside the selected transport
   * mode's locations.
   */
  const filtered = useMemo(() => {
    const normalized =
      query.trim().toLowerCase();

    return locations
      .filter(
        (station) =>
          station.code !== exclude,
      )
      .filter((station) => {
        if (!normalized) {
          return true;
        }

        return (
          station.name
            .toLowerCase()
            .includes(normalized) ||
          station.code
            .toLowerCase()
            .includes(normalized) ||
          station.city
            .toLowerCase()
            .includes(normalized) ||
          station.state
            .toLowerCase()
            .includes(normalized)
        );
      })
      .slice(0, 40);
  }, [
    locations,
    query,
    exclude,
  ]);

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (isOpen) {
          setTimeout(
            () =>
              inputRef.current?.focus(),
            30,
          );
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition hover:border-primary/40"
        >
          <MapPin className="h-4 w-4 text-primary" />

          <div className="min-w-0 flex-1">

            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {label}
            </div>

            <div className="truncate text-sm font-semibold">
              {value?.city}{" "}
              <span className="text-muted-foreground">
                ({value?.code})
              </span>
            </div>

            <div className="truncate text-[11px] text-muted-foreground">
              {value?.name} ·{" "}
              {value?.state}
            </div>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="pointer-events-auto w-[340px] p-0"
      >
        <div className="border-b border-border p-2">

          <Input
            ref={inputRef}
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Type a station, code or city…"
            className="h-9 rounded-lg"
          />
        </div>

        <div className="max-h-72 overflow-y-auto py-1">

          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No locations found for this transport mode.
            </div>
          )}

          {filtered.map((station) => (
            <button
              key={station.code}
              type="button"
              onClick={() => {
                onChange(station);
                setOpen(false);
                setQuery("");
              }}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-accent",
                station.code ===
                  value?.code &&
                  "bg-[color:var(--brand-soft)]",
              )}
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-[10px] font-semibold text-muted-foreground">
                {station.code}
              </div>

              <div className="min-w-0 flex-1">

                <div className="truncate font-medium">
                  {station.name}
                </div>

                <div className="truncate text-[11px] text-muted-foreground">
                  {station.city} ·{" "}
                  {station.state}
                </div>
              </div>

              <Badge
                variant="outline"
                className="shrink-0 rounded-full text-[10px] text-muted-foreground"
              >
                {routeCountFor(
                  station,
                )}{" "}
                routes
              </Badge>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================
// DATE FIELD
// ============================================================

function DateField({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const { formatDate } =
    useI18n();

  const [open, setOpen] =
    useState(false);

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0,
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition hover:border-primary/40"
        >
          <CalendarDays className="h-4 w-4 text-primary" />

          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Date
            </div>

            <div className="text-sm font-semibold">
              {formatDate(date)}
            </div>

            <div className="text-[11px] text-muted-foreground">
              {date.getFullYear()}
            </div>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="pointer-events-auto w-auto p-0"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              setOpen(false);
            }
          }}
          disabled={(day) =>
            day < today
          }
          initialFocus
          className="pointer-events-auto p-3"
        />

        <div className="flex gap-1 border-t border-border p-2">

          {[0, 1, 2].map(
            (offset) => {
              const d =
                new Date();

              d.setDate(
                d.getDate() +
                  offset,
              );

              d.setHours(
                0,
                0,
                0,
                0,
              );

              return (
                <button
                  key={offset}
                  type="button"
                  onClick={() => {
                    setDate(d);
                    setOpen(false);
                  }}
                  className="flex-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {offset === 0
                    ? "Today"
                    : offset === 1
                      ? "Tomorrow"
                      : "Day after"}
                </button>
              );
            },
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================
// TIME SLOT
// ============================================================

function SlotField({
  slot,
  setSlot,
}: {
  slot: string;
  setSlot: (slot: string) => void;
}) {
  const [open, setOpen] =
    useState(false);

  const current =
    timeSlots.find(
      (time) =>
        time.id === slot,
    ) ??
    timeSlots[1];

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition hover:border-primary/40"
        >
          <Clock className="h-4 w-4 text-primary" />

          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Depart
            </div>

            <div className="text-sm font-semibold">
              {current.label}
            </div>

            <div className="text-[11px] text-muted-foreground">
              {current.range}
            </div>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="pointer-events-auto w-[240px] p-2"
      >
        <div className="grid grid-cols-2 gap-2">

 
          {timeSlots.map(
            (time) => (
              <button
                key={time.id}
                type="button"
                onClick={() => {
                  setSlot(
                    time.id,
                  );
                  setOpen(false);
                }}
                className={cn(
                  "rounded-xl border p-3 text-left transition",
                  slot ===
                    time.id
                    ? "border-primary bg-[color:var(--brand-soft)]"
                    : "border-border hover:border-primary/40",
                )}
              >
                <div className="text-[13px] font-semibold">
                  {time.label}
                </div>

                <div className="text-[11px] text-muted-foreground">
                  {time.range}
                </div>
              </button>
            ),
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================
// ANIMATION
// ============================================================

export const searchMotion = {
  initial: {
    opacity: 0,
    y: 12,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    y: -8,
  },
};

export const MotionSection =
  motion.section;
