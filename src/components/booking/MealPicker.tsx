import {
  Minus,
  Plus,
  Search,
  UtensilsCrossed,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import {
  meals,
  mealCategories,
  type MealCategory,
} from "@/lib/inventory";
import { cn } from "@/lib/utils";

/** Passengers may order at most 5 meals each. */
export const MEALS_PER_PASSENGER = 5;

type MealPickerProps = {
  quantities: Record<string, number>;
  onChange: (id: string, qty: number) => void;
  passengerCount?: number;
};

export function MealPicker({
  quantities,
  onChange,
  passengerCount = 1,
}: MealPickerProps) {
  const { formatCurrency } = useI18n();

  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<MealCategory | "All">("All");
  const [limitHit, setLimitHit] = useState(false);

  /*
   * ============================================================
   * FILTER MEALS
   * ============================================================
   */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return meals.filter((meal) => {
      if (
        category !== "All" &&
        meal.category !== category
      ) {
        return false;
      }

      if (
        q &&
        !meal.name.toLowerCase().includes(q)
      ) {
        return false;
      }

      return true;
    });
  }, [query, category]);

  /*
   * ============================================================
   * GROUP MEALS BY CATEGORY
   * ============================================================
   */
  const grouped = useMemo(() => {
    const categories =
      category === "All"
        ? mealCategories
        : [category];

    return categories
      .map((cat) => ({
        cat,
        items: filtered.filter(
          (meal) => meal.category === cat,
        ),
      }))
      .filter(
        (group) => group.items.length > 0,
      );
  }, [filtered, category]);

  /*
   * ============================================================
   * PASSENGER / MEAL LIMIT
   * ============================================================
   */
  const pax = Math.max(
    1,
    passengerCount,
  );

  const maxMeals =
    pax * MEALS_PER_PASSENGER;

  const ordered = Object.values(
    quantities,
  ).reduce(
    (total, qty) => total + qty,
    0,
  );

  const atLimit =
    ordered >= maxMeals;

  /*
   * ============================================================
   * MEAL SUBTOTAL
   * ============================================================
   */
  const subtotal = Object.entries(
    quantities,
  ).reduce(
    (sum, [id, qty]) => {
      const meal = meals.find(
        (item) => item.id === id,
      );

      return (
        sum +
        (meal
          ? meal.price * qty
          : 0)
      );
    },
    0,
  );

  /*
   * ============================================================
   * INCREASE QUANTITY
   * ============================================================
   */
  const increase = (
    id: string,
    qty: number,
  ) => {
    if (ordered >= maxMeals) {
      setLimitHit(true);
      return;
    }

    setLimitHit(false);

    onChange(
      id,
      qty + 1,
    );
  };

  /*
   * ============================================================
   * DECREASE QUANTITY
   * ============================================================
   */
  const decrease = (
    id: string,
    qty: number,
  ) => {
    setLimitHit(false);

    onChange(
      id,
      Math.max(0, qty - 1),
    );
  };

  return (
    <div className="space-y-4">
      {/* ======================================================
          SEARCH
      ====================================================== */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <Input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search meals…"
          className="h-10 rounded-full pl-9"
        />
      </div>

      {/* ======================================================
          CATEGORY FILTER
      ====================================================== */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() =>
            setCategory("All")
          }
          className={cn(
            "rounded-full border px-3 py-1 text-[12px] transition",
            category === "All"
              ? "border-primary bg-[color:var(--brand-soft)] text-primary"
              : "border-border text-muted-foreground hover:border-primary/40",
          )}
        >
          All
        </button>

        {mealCategories.map(
          (cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setCategory(cat)
              }
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] transition",
                category === cat
                  ? "border-primary bg-[color:var(--brand-soft)] text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {cat}
            </button>
          ),
        )}
      </div>

      {/* ======================================================
          LIMIT INFORMATION
      ====================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 px-3 py-2">
        <span className="text-[12px] text-muted-foreground">
          Up to{" "}
          {MEALS_PER_PASSENGER}{" "}
          meals per passenger ·{" "}
          {pax} passenger
          {pax > 1 ? "s" : ""}
        </span>

        <Badge
          variant="outline"
          className="rounded-full text-[10px]"
        >
          {ordered} / {maxMeals} selected
        </Badge>
      </div>

      {limitHit && (
        <p className="text-[12px] text-destructive">
          Meal limit reached — a
          maximum of{" "}
          {maxMeals} meals can be
          ordered for {pax}{" "}
          passenger
          {pax > 1 ? "s" : ""}.
        </p>
      )}

      {/* ======================================================
          SUBTOTAL
      ====================================================== */}
      {subtotal > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Meal subtotal
          </span>

          <span className="text-sm font-semibold">
            {formatCurrency(
              subtotal,
            )}
          </span>
        </div>
      )}

      {/* ======================================================
          MEAL LIST
      ====================================================== */}
      <div className="space-y-5">
        {grouped.length === 0 && (
          <p className="text-[13px] text-muted-foreground">
            No meals match your
            search.
          </p>
        )}

        {grouped.map(
          ({ cat, items }) => (
            <div key={cat}>
              <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                {cat}
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {items.map((meal) => {
                  const qty =
                    quantities[
                      meal.id
                    ] ?? 0;

                  /*
                   * Vegetarian = GREEN
                   * Non-vegetarian = RED
                   */
                  const isVeg =
                    meal.veg === true;

                  return (
                    <Card
                      key={meal.id}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-2xl p-3",
                        qty > 0 &&
                          "border-primary/40 bg-[color:var(--brand-soft)]",
                      )}
                    >
                      {/* ==================================================
                          MEAL DETAILS
                      ================================================== */}
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={cn(
                            "relative grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                            isVeg
                              ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
                              : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
                          )}
                        >
                          <UtensilsCrossed
                            className="h-4 w-4"
                            aria-hidden="true"
                          />

                          {/* Dietary indicator */}
                          <span
                            className={cn(
                              "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                              isVeg
                                ? "bg-green-500"
                                : "bg-red-500",
                            )}
                            aria-label={
                              isVeg
                                ? "Vegetarian"
                                : "Non-vegetarian"
                            }
                            title={
                              isVeg
                                ? "Vegetarian"
                                : "Non-vegetarian"
                            }
                          />
                        </span>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {meal.name}
                          </div>

                          <div className="text-[11px] text-muted-foreground">
                            {formatCurrency(
                              meal.price,
                            )}

                            {meal.note
                              ? ` · ${meal.note}`
                              : ""}
                          </div>

                          <div
                            className={cn(
                              "mt-0.5 text-[10px] font-medium",
                              isVeg
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400",
                            )}
                          >
                            {isVeg
                              ? "Vegetarian"
                              : "Non-vegetarian"}
                          </div>
                        </div>
                      </div>

                      {/* ==================================================
                          QUANTITY CONTROLS
                      ================================================== */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label={`Decrease ${meal.name}`}
                          onClick={() =>
                            decrease(
                              meal.id,
                              qty,
                            )
                          }
                          disabled={
                            qty === 0
                          }
                          className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </button>

                        <span className="w-4 text-center text-sm font-medium">
                          {qty}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase ${meal.name}`}
                          onClick={() =>
                            increase(
                              meal.id,
                              qty,
                            )
                          }
                          disabled={
                            atLimit
                          }
                          className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
