import { motion } from "framer-motion";
import {
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { stations, timeSlots, type Station } from "@/lib/dummy-data";
import { useI18n } from "@/lib/i18n";
import {
  popularStationCodes,
  routeCountFor,
  searchStations,
  type TransportMode,
} from "@/lib/inventory";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const aiSuggestions = [
  "Book the cheapest morning train",
  "Find hotels near destination",
  "Show evening buses",
  "Fastest travel under ₹1500",
  "AC train tomorrow morning",
];

export type SearchState = {
  from: Station;
  to: Station;
  date: Date;
  slot: string;
  query: string;
};

export function stationByCode(code?: string, fallback = "NDLS") {
  return (
    stations.find((s) => s.code === code) ??
    stations.find((s) => s.code === fallback)!
  );
}

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

  const isHotel = mode === "hotel";

  /*
   * Hotel searches use ONE location only.
   *
   * We keep from/to internally because the existing booking flow and
   * inventory functions still use Station objects. The user does NOT
   * see a From → To selector for hotels.
   */
  const hotelLocation = value.to;

  const sameStation =
    !isHotel && value.from.code === value.to.code;

  const submit = () => {
    if (sameStation) return;

    if (value.query.trim()) {
      pushRecentSearch(value.query.trim());
    }

    onSubmit();
  };

  const voice = () => {
    setListening(true);

    setTimeout(() => {
      setListening(false);

      onChange({
        query:
          aiSuggestions[
            Math.floor(Math.random() * aiSuggestions.length)
          ],
      });
    }, 1400);
  };

  /*
   * For hotels, clicking a popular city changes the hotel location.
   * For every other transport mode it changes the destination.
   */
  const selectPopular = (station: Station) => {
    if (isHotel) {
      onChange({
        to: station,
        from:
          value.from.code === station.code
            ? stationByCode(undefined, "NDLS")
            : value.from,
      });
      return;
    }

    if (value.from.code === station.code) {
      const fallback =
        stations.find((s) => s.code !== station.code) ??
        stationByCode("NDLS");

      onChange({ to: fallback });
      return;
    }

    onChange({ to: station });
  };

  return (
    <div className="mx-auto w-full">
      <Card
        className={cn(
          "glass-card rounded-3xl p-4 md:p-5",
          compact && "rounded-2xl p-3 md:p-4",
        )}
      >
        {isHotel ? (
          /*
           * HOTEL SEARCH
           *
           * No From field.
           * No To field.
           * No swap button.
           *
           * Only one location is shown.
           */
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
            <StationPicker
              label="Hotel location"
              value={hotelLocation}
              onChange={(s) =>
                onChange({
                  to: s,
                })
              }
            />

            <DateField
              date={value.date}
              setDate={(d) => onChange({ date: d })}
            />

            <SlotField
              slot={value.slot}
              setSlot={(s) => onChange({ slot: s })}
            />
          </div>
        ) : (
          /*
           * TRAIN / BUS / FLIGHT / METRO / FERRY
           *
           * These modes continue to use separate From and To.
           */
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_auto]">
            <StationPicker
              label={t("common.from")}
              value={value.from}
              exclude={value.to.code}
              onChange={(s) => onChange({ from: s })}
            />

            <div className="hidden items-center justify-center md:flex">
              <button
                onClick={() =>
                  onChange({
                    from: value.to,
                    to: value.from,
                  })
                }
                type="button"
                aria-label="Swap stations"
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition hover:rotate-180 hover:border-primary/50 hover:text-primary"
              >
                <span className="text-sm">⇄</span>
              </button>
            </div>

            <StationPicker
              label={t("common.to")}
              value={value.to}
              exclude={value.from.code}
              onChange={(s) => onChange({ to: s })}
            />

            <DateField
              date={value.date}
              setDate={(d) => onChange({ date: d })}
            />

            <SlotField
              slot={value.slot}
              setSlot={(s) => onChange({ slot: s })}
            />
          </div>
        )}

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

              {isHotel ? (
                <>
                  {hotelLocation.city} ({hotelLocation.code})
                </>
              ) : (
                <>
                  {value.from.city} → {value.to.city}
                </>
              )}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(value.date)}
            </span>
          </div>

          <Button
            onClick={submit}
            disabled={sameStation}
            className="h-11 rounded-full px-6 text-white brand-gradient disabled:opacity-50"
          >
            <Search className="mr-1.5 h-4 w-4" />
            {isHotel ? "Search Hotels" : `${t("common.search")} ${mode}`}
          </Button>
        </div>
      </Card>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mt-4 flex items-center gap-2 rounded-full border border-border/70 bg-background/70 p-2 pl-5 backdrop-blur"
      >
        <Sparkles className="h-4 w-4 shrink-0 text-[color:var(--accent-orange)]" />

        <Input
          value={value.query}
          onChange={(e) =>
            onChange({
              query: e.target.value,
            })
          }
          placeholder={
            isHotel
              ? 'Ask in plain language — "Find hotels near destination"'
              : 'Ask in plain language — “Book the cheapest morning train”'
          }
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

      <div className="mt-4 space-y-3">
        <ChipRow
          icon={<Sparkles className="h-3 w-3" />}
          label="AI suggestions"
          items={
            isHotel
              ? [
                  "Find hotels near destination",
                  "Best hotels in Delhi",
                  "Affordable hotels",
                  "Luxury hotels",
                  "Hotels near airport",
                ]
              : aiSuggestions
          }
          onPick={(q) =>
            onChange({
              query: q,
            })
          }
        />

        {recentSearches.length > 0 && (
          <ChipRow
            icon={<History className="h-3 w-3" />}
            label="Recent"
            items={recentSearches}
            onPick={(q) =>
              onChange({
                query: q,
              })
            }
          />
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Flame className="h-3 w-3" />
            {isHotel ? "Popular locations" : "Popular"}
          </span>

          {popularStationCodes.map((c) => {
            const s = stationByCode(c);

            return (
              <button
                key={c}
                onClick={() => selectPopular(s)}
                type="button"
                className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
              >
                {s.city} ({s.code})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChipRow({
  icon,
  label,
  items,
  onPick,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  onPick: (s: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </span>

      {items.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onPick(s)}
          className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export function StationPicker({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: Station;
  onChange: (s: Station) => void;
  exclude?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => searchStations(q, exclude, 40),
    [q, exclude],
  );

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);

        if (o) {
          setTimeout(() => inputRef.current?.focus(), 30);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition hover:border-primary/40"
        >
          <MapPin className="h-4 w-4 shrink-0 text-primary" />

          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {label}
            </div>

            <div className="truncate text-sm font-semibold">
              {value.city}{" "}
              <span className="text-muted-foreground">
                ({value.code})
              </span>
            </div>

            <div className="truncate text-[11px] text-muted-foreground">
              {value.name} · {value.state}
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
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a station, code or city…"
            className="h-9 rounded-lg"
          />
        </div>

        <div className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No station matches “{q}”.
            </div>
          )}

          {filtered.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => {
                onChange(s);
                setOpen(false);
                setQ("");
              }}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-accent",
                s.code === value.code &&
                  "bg-[color:var(--brand-soft)]",
              )}
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-[10px] font-semibold text-muted-foreground">
                {s.code}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">
                  {s.name}
                </div>

                <div className="truncate text-[11px] text-muted-foreground">
                  {s.city} · {s.state}
                </div>
              </div>

              <Badge
                variant="outline"
                className="shrink-0 rounded-full text-[10px] text-muted-foreground"
              >
                {routeCountFor(s)} routes
              </Badge>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DateField({
  date,
  setDate,
}: {
  date: Date;
  setDate: (d: Date) => void;
}) {
  const { formatDate } = useI18n();
  const [open, setOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
          onSelect={(d) => {
            if (d) {
              setDate(d);
              setOpen(false);
            }
          }}
          disabled={(d) => d < today}
          initialFocus
          className={cn("pointer-events-auto p-3")}
        />

        <div className="flex gap-1 border-t border-border p-2">
          {[0, 1, 2].map((offset) => {
            const d = new Date();

            d.setDate(d.getDate() + offset);
            d.setHours(0, 0, 0, 0);

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
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SlotField({
  slot,
  setSlot,
}: {
  slot: string;
  setSlot: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const cur =
    timeSlots.find((t) => t.id === slot) ?? timeSlots[1];

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
              {cur.label}
            </div>

            <div className="text-[11px] text-muted-foreground">
              {cur.range}
            </div>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="pointer-events-auto w-[240px] p-2"
      >
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSlot(s.id);
                setOpen(false);
              }}
              className={cn(
                "rounded-xl border p-3 text-left transition",
                slot === s.id
                  ? "border-primary bg-[color:var(--brand-soft)]"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div className="text-[13px] font-semibold">
                {s.label}
              </div>

              <div className="text-[11px] text-muted-foreground">
                {s.range}
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const searchMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const MotionSection = motion.section;
