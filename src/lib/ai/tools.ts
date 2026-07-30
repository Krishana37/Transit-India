import { tool } from "ai";
import { z } from "zod";
import { generateResults, type TransportMode } from "@/lib/inventory";
import { stations, type Station } from "@/lib/dummy-data";

function resolveStation(query: string): Station | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return (
    stations.find((s) => s.code.toLowerCase() === q) ??
    stations.find((s) => s.city.toLowerCase() === q) ??
    stations.find((s) => s.name.toLowerCase() === q) ??
    stations.find((s) => s.city.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)) ??
    stations.find((s) => q.includes(s.city.toLowerCase()))
  );
}

const modes: TransportMode[] = ["train", "bus", "flight", "hotel", "metro", "ferry"];

export const searchTravel = tool({
  description:
    "Search the prototype's fictional travel inventory for options between two places. Use this whenever the user asks about routes, fares, timings, or availability so the answer is grounded in real app data.",
  inputSchema: z.object({
    from: z.string().describe("Origin city, station name, or station code"),
    to: z.string().describe("Destination city, station name, or station code"),
    mode: z.enum(["train", "bus", "flight", "hotel", "metro", "ferry"]).default("train"),
    date: z.string().optional().describe("ISO date (YYYY-MM-DD), defaults to tomorrow"),
    preference: z.enum(["cheapest", "fastest", "any"]).default("any"),
    maxBudget: z.number().optional().describe("Maximum fare in INR, if the user gave a budget"),
  }),
  execute: async ({ from, to, mode, date, preference, maxBudget }) => {
    const fromStation = resolveStation(from);
    const toStation = resolveStation(to);
    if (!fromStation || !toStation) {
      return {
        error: `Could not resolve one of the stations ("${from}" -> "${fromStation?.name ?? "not found"}", "${to}" -> "${toStation?.name ?? "not found"}"). Ask the user to clarify the city or station name.`,
      };
    }
    const chosenMode = modes.includes(mode) ? mode : "train";
    const segments = generateResults(chosenMode, fromStation, toStation, date ? new Date(date) : new Date(Date.now() + 86400000));

    let options = segments.flatMap((seg) =>
      seg.options.map((opt) => ({
        name: seg.name,
        code: seg.code,
        depart: seg.depart,
        arrive: seg.arrive,
        duration: seg.duration,
        durationMins: seg.durationMins,
        class: opt.label,
        fare: opt.fare,
        probability: opt.probability,
      })),
    );

    if (maxBudget) options = options.filter((o) => o.fare <= maxBudget);

    if (preference === "cheapest") options = [...options].sort((a, b) => a.fare - b.fare);
    else if (preference === "fastest") options = [...options].sort((a, b) => a.durationMins - b.durationMins);

    return {
      from: fromStation.name,
      to: toStation.name,
      mode: chosenMode,
      count: options.length,
      options: options.slice(0, 8),
    };
  },
});
