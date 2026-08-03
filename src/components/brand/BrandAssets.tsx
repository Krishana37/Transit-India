import logoAsset from "@/assets/brand/logo.png.asset.json";
import trainAsset from "@/assets/brand/train.png.asset.json";
import busAsset from "@/assets/brand/bus.png.asset.json";
import flightAsset from "@/assets/brand/flight.png.asset.json";
import metroAsset from "@/assets/brand/metro.png.asset.json";
import ferryAsset from "@/assets/brand/ferry.png.asset.json";
import hotelAsset from "@/assets/brand/hotel.png.asset.json";
import cabberAsset from "@/assets/brand/cabber.png.asset.json";
import homeAsset from "@/assets/brand/home.png.asset.json";
import languageAsset from "@/assets/brand/language.png.asset.json";
import { cn } from "@/lib/utils";

export const brandLogoUrl = logoAsset.url;

export const brandIcons = {
  train: trainAsset.url,
  bus: busAsset.url,
  flight: flightAsset.url,
  metro: metroAsset.url,
  ferry: ferryAsset.url,
  hotel: hotelAsset.url,
  cabber: cabberAsset.url,
  cab: cabberAsset.url,
  home: homeAsset.url,
  language: languageAsset.url,
} as const;

export type BrandIconName = keyof typeof brandIcons;

/**
 * Official Transit India logo mark. Rendered on a neutral white tile so the
 * artwork keeps identical contrast in light and dark themes.
 */
export function BrandLogo({
  className,
  size = 36,
  rounded = "rounded-full",
}: {
  className?: string;
  size?: number;
  rounded?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden bg-white ring-1 ring-black/5 shadow-sm",
        rounded,
        className,
      )}
      style={{ width: size, height: size }}
    >
      <img
        src={brandLogoUrl}
        alt="Transit India logo"
        width={size}
        height={size}
        className="h-full w-full object-contain p-[6%]"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

/**
 * Uniform icon tile used for every transport mode and utility icon so the whole
 * set reads as a single design system (same radius, padding, ring and shadow).
 */
export function BrandIcon({
  name,
  label,
  size = 40,
  className,
  rounded = "rounded-full",
  plain,
}: {
  name: BrandIconName;
  label?: string;
  size?: number;
  className?: string;
  rounded?: string;
  plain?: boolean;
}) {
  const img = (
    <img
      src={brandIcons[name]}
      alt={label ?? `${name} icon`}
      width={size}
      height={size}
      className="h-full w-full object-contain"
      loading="lazy"
      decoding="async"
    />
  );

  if (plain) {
    return (
      <span className={cn("inline-grid shrink-0 place-items-center", className)} style={{ width: size, height: size }}>
        {img}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center overflow-hidden bg-white p-[8%] ring-1 ring-black/5 shadow-sm",
        rounded,
        className,
      )}
      style={{ width: size, height: size }}
    >
      {img}
    </span>
  );
}
