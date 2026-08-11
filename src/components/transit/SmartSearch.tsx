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
  Users,
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
  "Fastest travel under Rs 1500",
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

  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
};

// ============================================================
// MODE HELPERS
// ============================================================

function getModeLocations(mode: TransportMode): Station[] {
  return locationsForMode(mode);
}

function findStation(
  code: string | undefined,
  locations: Station[],
): Station | undefined {
  if (!code) {
    return undefined;
  }

  return locations.find((station) => station.code === code);
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

  const isHotel = mode === "hotel";

  const modeLocations = useMemo(
    () => getModeLocations(mode),
    [mode],
  );

  // ==========================================================
  // IMPORTANT:
  // Never automatically select the first station.
  // ==========================================================

  const selectedFrom = findStation(
    value.from?.code,
    modeLocations,
  );

  const selectedTo = findStation(
    value.to?.code,
    modeLocations,
  );

  // ==========================================================
  // HOTEL LOCATION
  // ==========================================================

  const hotelLocation = selectedFrom;

  // ==========================================================
  // SAME STATION CHECK
  // ==========================================================

  const sameStation =
    !isHotel &&
    !!selectedFrom &&
    !!selectedTo &&
    selectedFrom.code === selectedTo.code;

  // ==========================================================
  // HOTEL DATES
  // ==========================================================

  const hotelCheckIn = value.checkIn ?? value.date;

  const hotelCheckOut =
    value.checkOut ??
    (() => {
      const nextDate = new Date(hotelCheckIn);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate;
    })();

  const hotelGuests = Math.max(1, value.guests ?? 1);

  // ==========================================================
  // CAN SEARCH
  // ==========================================================

  const canSearchHotel = !!hotelLocation;

  const canSearchTransport =
    !!selectedFrom &&
    !!selectedTo &&
    !sameStation;

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const submit = () => {
    if (isHotel) {
      if (!canSearchHotel) {
        return;
      }

      if (value.query.trim()) {
        pushRecentSearch(value.query.trim());
      }

      onChange({
        from: hotelLocation,
        to: hotelLocation,
        date: hotelCheckIn,
        checkIn: hotelCheckIn,
        checkOut: hotelCheckOut,
        guests: hotelGuests,
      });

      onSubmit();
      return;
    }

    if (!canSearchTransport) {
      return;
    }

    if (value.query.trim()) {
      pushRecentSearch(value.query.trim());
    }

    onSubmit();
  };

  // ==========================================================
  // SWAP
  // ==========================================================

  const swap = () => {
    if (isHotel) {
      return;
    }

    if (!selectedFrom || !selectedTo) {
      return;
    }

    onChange({
      from: selectedTo,
      to: selectedFrom,
    });
  };

  // ==========================================================
  // VOICE SEARCH
  // ==========================================================

  const voice = () => {
    setListening(true);

    setTimeout(() => {
      setListening(false);

      const suggestion =
        aiSuggestions[
          Math.floor(Math.random() * aiSuggestions.length)
        ];

      onChange({
        query: suggestion,
      });
    }, 1400);
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
          // ====================================================
          // HOTEL SEARCH
          // Location + Check-in + Check-out + Guests
          // ====================================================
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto]">
              {/* HOTEL LOCATION */}

              <StationPicker
                label="Location"
                value={hotelLocation}
                locations={modeLocations}
                onChange={(station) => {
                  onChange({
                    from: station,
                    to: station,
                  });
                }}
              />

              {/* CHECK-IN */}

              <DateField
                label="Check-in"
                date={hotelCheckIn}
                setDate={(date) => {
                  let nextCheckOut = hotelCheckOut;

                  if (date >= hotelCheckOut) {
                    nextCheckOut = new Date(date);

                    nextCheckOut.setDate(
                      nextCheckOut.getDate() + 1,
                    );
                  }

                  onChange({
                    date,
                    checkIn: date,
                    checkOut: nextCheckOut,
                  });
                }}
              />

              {/* CHECK-OUT */}

              <DateField
                label="Check-out"
                date={hotelCheckOut}
                minDate={hotelCheckIn}
                setDate={(date) => {
                  onChange({
                    checkOut: date,
                  });
                }}
              />

              {/* GUESTS */}

              <GuestField
                guests={hotelGuests}
                setGuests={(guests) => {
                  onChange({
                    guests,
                  });
                }}
              />

              {/* SEARCH */}

              <Button
                type="button"
                onClick={submit}
                disabled={!canSearchHotel}
                className="h-full min-h-14 rounded-2xl px-5 text-white brand-gradient disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Search className="mr-1.5 h-4 w-4" />
                Search
              </Button>
            </div>

            {/* HOTEL SUMMARY */}

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                <MapPin className="h-3 w-3" />

                {hotelLocation
                  ? hotelLocation.city
                  : "Select location"}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                <CalendarDays className="h-3 w-3" />

                {formatDate(hotelCheckIn)}
                {" - "}
                {formatDate(hotelCheckOut)}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                <Users className="h-3 w-3" />

                {hotelGuests}{" "}
                {hotelGuests === 1 ? "Guest" : "Guests"}
              </span>
            </div>
          </div>
        ) : (
          // ====================================================
          // NORMAL TRANSPORT SEARCH
          // Train / Bus / Flight / Metro / Ferry
          // ====================================================
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_auto]">
              {/* FROM */}

              <StationPicker
                label={t("common.from")}
                value={selectedFrom}
                locations={modeLocations}
                exclude={selectedTo?.code}
                onChange={(station) => {
                  onChange({
                    from: station,
                  });
                }}
              />

              {/* SWAP */}

              <div className="hidden items-center justify-center md:flex">
                <button
                  onClick={swap}
                  type="button"
                  disabled={!selectedFrom || !selectedTo}
                  aria-label="Swap stations"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition hover:rotate-180 hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
              </div>

              {/* TO */}

              <StationPicker
                label={t("common.to")}
                value={selectedTo}
                locations={modeLocations}
                exclude={selectedFrom?.code}
                onChange={(station) => {
                  onChange({
                    to: station,
                  });
                }}
              />

              {/* DATE */}

              <DateField
                label="Date"
                date={value.date}
                setDate={(date) => {
                  onChange({
                    date,
                  });
                }}
              />

              {/* TIME */}

              <SlotField
                slot={value.slot}
                setSlot={(slot) => {
                  onChange({
                    slot,
                  });
                }}
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
                {/* ROUTE SUMMARY */}

                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                  <MapPin className="h-3 w-3" />

                  {selectedFrom
                    ? selectedFrom.city
                    : "Select From"}

                  {" -> "}

                  {selectedTo
                    ? selectedTo.city
                    : "Select To"}
                </span>

                {/* DATE SUMMARY */}

                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                  <CalendarDays className="h-3 w-3" />

                  {formatDate(value.date)}
                </span>

                {/* MOBILE SWAP */}

                <button
                  onClick={swap}
                  type="button"
                  disabled={!selectedFrom || !selectedTo}
                  className="underline disabled:cursor-not-allowed disabled:opacity-40 md:hidden"
                >
                  Swap
                </button>
              </div>

              {/* SEARCH */}

              <Button
                type="button"
                onClick={submit}
                disabled={!canSearchTransport}
                className="h-11 rounded-full px-6 text-white brand-gradient disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Search className="mr-1.5 h-4 w-4" />

                {t("common.search")} {mode}
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* ======================================================
          AI SEARCH
          ====================================================== */}

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
          onChange={(event) => {
            onChange({
              query: event.target.value,
            });
          }}
          placeholder={
            isHotel
              ? 'Ask in plain language - "Find hotels near destination"'
              : 'Ask in plain language - "Book the cheapest morning train"'
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
          disabled={
            isHotel
              ? !canSearchHotel
              : !canSearchTransport
          }
          className="h-9 rounded-full px-4 text-white brand-gradient disabled:cursor-not-allowed disabled:opacity-50"
        >
          Ask Yatra
        </Button>
      </form>

      {/* ======================================================
          SUGGESTIONS
          ====================================================== */}

      <div className="mt-4 space-y-3">
        <ChipRow
          icon={<Sparkles className="h-3 w-3" />}
          label="AI suggestions"
          items={
            isHotel
              ? [
                  "Find hotels near destination",
                  "Find cheapest hotels",
                  "Show luxury hotels",
                  "Hotels for family stay",
                  "Best rated hotels",
                ]
              : aiSuggestions
          }
          onPick={(query) => {
            onChange({
              query,
            });
          }}
        />

        {recentSearches.length > 0 && (
          <ChipRow
            icon={<History className="h-3 w-3" />}
            label="Recent"
            items={recentSearches}
            onPick={(query) => {
              onChange({
                query,
              });
            }}
          />
        )}

        {/* ==================================================
            POPULAR LOCATIONS
            ================================================== */}

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Flame className="h-3 w-3" />
            Popular
          </span>

          {modeLocations.slice(0, 10).map((station) => (
            <button
              key={station.code}
              type="button"
              onClick={() => {
                if (isHotel) {
                  onChange({
                    from: station,
                    to: station,
                  });

                  return;
                }

                if (
                  selectedFrom &&
                  station.code === selectedFrom.code
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
// ============================================================

export function StationPicker({
  label,
  value,
  locations,
  onChange,
  exclude,
}: {
  label: string;
  value?: Station;
  locations: Station[];
  onChange: (station: Station) => void;
  exclude?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return locations
      .filter((station) => station.code !== exclude)
      .filter((station) => {
        if (!normalized) {
          return true;
        }

        return (
          station.name.toLowerCase().includes(normalized) ||
          station.code.toLowerCase().includes(normalized) ||
          station.city.toLowerCase().includes(normalized) ||
          station.state.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 40);
  }, [locations, query, exclude]);

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (isOpen) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 30);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition hover:border-primary/40"
        >
          <MapPin className="h-4 w-4 text-primary" />

          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {label}
            </div>

            {value ? (
              <>
                <div className="truncate text-sm font-semibold">
                  {value.city}{" "}
                  <span className="text-muted-foreground">
                    ({value.code})
                  </span>
                </div>

                <div className="truncate text-[11px] text-muted-foreground">
                  {value.name}
                  {" - "}
                  {value.state}
                </div>
              </>
            ) : (
              <>
                <div className="truncate text-sm font-semibold text-muted-foreground">
                  Select location
                </div>

                <div className="truncate text-[11px] text-muted-foreground">
                  Choose a location to continue
                </div>
              </>
            )}
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
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Type a station, code or city..."
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
                station.code === value?.code &&
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
                  {station.city}
                  {" - "}
                  {station.state}
                </div>
              </div>

              <Badge
                variant="outline"
                className="shrink-0 rounded-full text-[10px] text-muted-foreground"
              >
                {routeCountFor(station)} routes
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
  label,
  date,
  setDate,
  minDate,
}: {
  label: string;
  date: Date;
  setDate: (date: Date) => void;
  minDate?: Date;
}) {
  const { formatDate } = useI18n();

  const [open, setOpen] = useState(false);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const minimum =
    minDate && minDate > today ? minDate : today;

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition hover:border-primary/40"
        >
          <CalendarDays className="h-4 w-4 text-primary" />

          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {label}
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
          disabled={(day) => day < minimum}
          initialFocus
          className="pointer-events-auto p-3"
        />

        <div className="flex gap-1 border-t border-border p-2">
          {[0, 1, 2].map((offset) => {
            const quickDate = new Date();

            quickDate.setDate(
              quickDate.getDate() + offset,
            );

            quickDate.setHours(0, 0, 0, 0);

            if (quickDate < minimum) {
              return null;
            }

            return (
              <button
                key={offset}
                type="button"
                onClick={() => {
                  setDate(quickDate);
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

// ============================================================
// HOTEL GUEST FIELD
// ============================================================

function GuestField({
  guests,
  setGuests,
}: {
  guests: number;
  setGuests: (guests: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const guestOptions = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
  ];

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition hover:border-primary/40"
        >
          <Users className="h-4 w-4 text-primary" />

          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Guests
            </div>

            <div className="text-sm font-semibold">
              {guests}{" "}
              {guests === 1 ? "Guest" : "Guests"}
            </div>

            <div className="text-[11px] text-muted-foreground">
              Rooms and guests
            </div>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="pointer-events-auto w-[230px] p-3"
      >
        <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          Number of guests
        </div>

        <div className="grid grid-cols-4 gap-2">
          {guestOptions.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => {
                setGuests(count);
                setOpen(false);
              }}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm transition",
                guests === count
                  ? "border-primary bg-[color:var(--brand-soft)] text-primary"
                  : "border-border hover:border-primary/40",
              )}
            >
              {count}
            </button>
          ))}
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
  const [open, setOpen] = useState(false);

  const current =
    timeSlots.find((time) => time.id === slot) ??
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
          {timeSlots.map((time) => (
            <button
              key={time.id}
              type="button"
              onClick={() => {
                setSlot(time.id);
                setOpen(false);
              }}
              className={cn(
                "rounded-xl border p-3 text-left transition",
                slot === time.id
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
          ))}
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

export const MotionSection = motion.section;
