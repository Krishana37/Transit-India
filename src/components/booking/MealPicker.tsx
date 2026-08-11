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

/**
 * Passengers may order at most 5 meals each.
 */
export const MEALS_PER_PASSENGER = 5;

type DietaryFilter =
  | "All"
  | "Vegetarian"
  | "Non Vegetarian";

type MealPickerProps = {
  quantities: Record<string, number>;
  onChange: (id: string, qty: number) => void;
  passengerCount?: number;
};

/**
 * ------------------------------------------------------------
 * NON-VEGETARIAN KEYWORDS
 * ------------------------------------------------------------
 *
 * This is intentionally used as a safety check because the UI
 * should NEVER show a vegetarian-looking item as non-vegetarian
 * just because the dummy-data flag is incorrect.
 *
 * Everything else is treated as vegetarian unless the meal
 * explicitly contains one of these non-veg terms.
 */
const NON_VEG_KEYWORDS = [
  "chicken",
  "mutton",
  "fish",
  "prawn",
  "prawns",
  "shrimp",
  "seafood",
  "egg",
  "eggs",
  "omelette",
  "omelet",
  "non veg",
  "non-veg",
  "nonveg",
  "meat",
  "lamb",
  "keema",
  "kebab",
  "kabab",
  "tandoori chicken",
  "chicken tikka",
  "fish curry",
];

/**
 * Determines the dietary type from the meal data + meal name.
 *
 * Name-based detection prevents an incorrect dummy-data `veg`
 * flag from turning vegetarian meals red.
 */
function isMealVegetarian(meal: {
  name: string;
  veg?: boolean;
}): boolean {
  const name = meal.name
    .trim()
    .toLowerCase();

  const explicitlyNonVeg =
    NON_VEG_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );

  if (explicitlyNonVeg) {
    return false;
  }

  return true;
}

export function MealPicker({
  quantities,
  onChange,
  passengerCount = 1,
}: MealPickerProps) {
  const { formatCurrency } = useI18n();

  const [query, setQuery] = useState("");

  const [category, setCategory] =
    useState<MealCategory | "All">("All");

  const [diet, setDiet] =
    useState<DietaryFilter>("All");

  const [limitHit, setLimitHit] =
    useState(false);

  /**
   * ----------------------------------------------------------
   * FILTERED MEALS
   * ----------------------------------------------------------
   */
  const filtered = useMemo(() => {
    const q = query
      .trim()
      .toLowerCase();

    return meals.filter((meal) => {
      /**
       * Category filter
       */
      if (
        category !== "All" &&
        meal.category !== category
      ) {
        return false;
      }

      /**
       * IMPORTANT:
       *
       * Do NOT trust meal.veg directly here.
       * Use the same classification used by the UI.
       */
      const isVeg =
        isMealVegetarian(meal);

      /**
       * Vegetarian filter
       */
      if (
        diet === "Vegetarian" &&
        !isVeg
      ) {
        return false;
      }

      /**
       * Non-vegetarian filter
       */
      if (
        diet === "Non Vegetarian" &&
        isVeg
      ) {
        return false;
      }

      /**
       * Search filter
       */
      if (
        q &&
        !meal.name
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      return true;
    });
  }, [
    query,
    category,
    diet,
  ]);

  /**
   * ----------------------------------------------------------
   * GROUP MEALS BY CATEGORY
   * ----------------------------------------------------------
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
          (meal) =>
            meal.category === cat,
        ),
      }))
      .filter(
        (group) =>
          group.items.length > 0,
      );
  }, [
    filtered,
    category,
  ]);

  /**
   * ----------------------------------------------------------
   * SUBTOTAL
   * ----------------------------------------------------------
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

  /**
   * ----------------------------------------------------------
   * PASSENGER / ORDER LIMIT
   * ----------------------------------------------------------
   */
  const pax = Math.max(
    1,
    passengerCount,
  );

  const maxMeals =
    pax *
    MEALS_PER_PASSENGER;

  const ordered =
    Object.values(
      quantities,
    ).reduce(
      (total, qty) =>
        total + qty,
      0,
    );

  const atLimit =
    ordered >= maxMeals;

  /**
   * ----------------------------------------------------------
   * INCREASE QUANTITY
   * ----------------------------------------------------------
   */
  const increase = (
    id: string,
    qty: number,
  ) => {
    if (
      ordered >= maxMeals
    ) {
      setLimitHit(true);
      return;
    }

    setLimitHit(false);

    onChange(
      id,
      qty + 1,
    );
  };

  /**
   * ----------------------------------------------------------
   * RESET FILTERS
   * ----------------------------------------------------------
   */
  const resetFilters = () => {
    setCategory("All");
    setDiet("All");
    setQuery("");
  };

  return (
    <div className="space-y-4">

      {/* =====================================================
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
            setQuery(
              event.target.value,
            )
          }
          placeholder="Search meals..."
          className="h-10 rounded-full pl-9"
        />
      </div>

      {/* =====================================================
          DIETARY FILTER
      ====================================================== */}
      <div className="flex flex-wrap gap-1.5">
        {(
          [
            "All",
            "Vegetarian",
            "Non Vegetarian",
          ] as const
        ).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() =>
              setDiet(filter)
            }
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] transition",

              diet === filter
                ? filter ===
                  "Vegetarian"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : filter ===
                    "Non Vegetarian"
                    ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                    : "border-primary bg-[color:var(--brand-soft)] text-primary"
                : "border-border text-muted-foreground hover:border-primary/40",
            )}
          >
            {filter ===
            "Non Vegetarian"
              ? "Non-Vegetarian"
              : filter}
          </button>
        ))}
      </div>

      {/* =====================================================
          MEAL CATEGORIES
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

      {/* =====================================================
          SELECTION INFORMATION
      ====================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 px-3 py-2">
        <span className="text-[12px] text-muted-foreground">
          Up to{" "}
          {MEALS_PER_PASSENGER}{" "}
          meals per passenger ·{" "}
          {pax} passenger
          {pax > 1
            ? "s"
            : ""}
        </span>

        <Badge
          variant="outline"
          className="rounded-full text-[10px]"
        >
          {ordered} /{" "}
          {maxMeals} selected
        </Badge>
      </div>

      {/* =====================================================
          LIMIT MESSAGE
      ====================================================== */}
      {limitHit && (
        <p className="text-[12px] text-destructive">
          Meal limit reached —
          maximum{" "}
          {maxMeals} meals can
          be ordered for{" "}
          {pax} passenger
          {pax > 1
            ? "s"
            : ""}.
        </p>
      )}

      {/* =====================================================
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

      {/* =====================================================
          MEAL LIST
      ====================================================== */}
      <div className="space-y-5">

        {/* No results */}
        {grouped.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-5 text-center">
            <p className="text-[13px] text-muted-foreground">
              No meals match your
              selected filters.
            </p>

            <button
              type="button"
              onClick={
                resetFilters
              }
              className="mt-2 text-[12px] font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Groups */}
        {grouped.map(
          ({
            cat,
            items,
          }) => (
            <div key={cat}>

              <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                {cat}
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                {items.map(
                  (meal) => {
                    const qty =
                      quantities[
                        meal.id
                      ] ?? 0;

                    /**
                     * IMPORTANT:
                     *
                     * This is the ONLY classification
                     * used by the visual UI.
                     */
                    const isVeg =
                      isMealVegetarian(
                        meal,
                      );

                    const dietaryLabel =
                      isVeg
                        ? "Vegetarian"
                        : "Non-Vegetarian";

                    return (
                      <Card
                        key={meal.id}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-2xl p-3 transition",

                          qty > 0 &&
                            isVeg &&
                            "border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-950/20",

                          qty > 0 &&
                            !isVeg &&
                            "border-red-500/50 bg-red-50/60 dark:bg-red-950/20",
                        )}
                      >

                        {/* =================================
                            MEAL INFORMATION
                        ================================== */}
                        <div className="flex min-w-0 items-center gap-2">

                          {/* Meal icon */}
                          <span
                            className={cn(
                              "relative grid h-9 w-9 shrink-0 place-items-center rounded-xl",

                              isVeg
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
                            )}
                          >
                            <UtensilsCrossed
                              className="h-4 w-4"
                            />

                            {/* =================================
                                DIETARY DOT
                            ================================== */}
                            <span
                              className={cn(
                                "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",

                                isVeg
                                  ? "bg-emerald-500"
                                  : "bg-red-500",
                              )}
                              aria-label={
                                dietaryLabel
                              }
                            />
                          </span>

                          {/* Meal text */}
                          <div className="min-w-0">

                            <div className="truncate text-sm font-medium">
                              {meal.name}
                            </div>

                            {/* =================================
                                PRICE + DIETARY LABEL
                            ================================== */}
                            <div className="flex flex-wrap items-center gap-1 text-[11px]">

                              <span className="text-muted-foreground">
                                {formatCurrency(
                                  meal.price,
                                )}
                              </span>

                              <span className="text-muted-foreground">
                                ·
                              </span>

                              <span
                                className={cn(
                                  "font-medium",

                                  isVeg
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400",
                                )}
                              >
                                {dietaryLabel}
                              </span>

                              {meal.note && (
                                <>
                                  <span className="text-muted-foreground">
                                    ·
                                  </span>

                                  <span className="text-muted-foreground">
                                    {
                                      meal.note
                                    }
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* =================================
                            QUANTITY CONTROLS
                        ================================== */}
                        <div className="flex items-center gap-1.5">

                          {/* Minus */}
                          <button
                            type="button"
                            aria-label={`Decrease ${meal.name}`}
                            onClick={() =>
                              onChange(
                                meal.id,
                                Math.max(
                                  0,
                                  qty - 1,
                                ),
                              )
                            }
                            className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          {/* Quantity */}
                          <span className="w-4 text-center text-sm font-medium">
                            {qty}
                          </span>

                          {/* Plus */}
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
                            <Plus className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      </Card>
                    );
                  },
                )}

              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
