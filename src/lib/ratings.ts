/**
 * Ratings for services (trains, buses, flights, hotels, metro, ferries, cabs).
 *
 * Community scores are deterministic per service so a given train always shows
 * the same reputation across renders and sessions. The traveller's own rating
 * (stored in the app store) is blended in on top.
 */

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export type CommunityRating = { stars: number; count: number };

/** Stable community score in the 3.2 – 4.9 range with a plausible review count. */
export function communityRating(seed: string): CommunityRating {
  const h = hash(seed);
  const stars = Number((3.2 + ((h % 170) / 100)).toFixed(1));
  const count = 48 + (hash(seed + "c") % 4200);
  return { stars, count };
}

/** Blend the traveller's own rating into the community score. */
export function blendRating(base: CommunityRating, mine?: number): CommunityRating {
  if (!mine) return base;
  const total = base.stars * base.count + mine;
  const count = base.count + 1;
  return { stars: Number((total / count).toFixed(1)), count };
}

export function ratingTone(stars: number) {
  if (stars >= 4.5) return "Excellent";
  if (stars >= 4.0) return "Very good";
  if (stars >= 3.6) return "Good";
  return "Average";
}

/** Stable key for a service so ratings survive re-generated search results. */
export function serviceRatingKey(mode: string, code: string) {
  return `${mode}:${code}`;
}
