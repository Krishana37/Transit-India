import logoUrl from "@/assets/brand/logo.png";
import trainAsset from "@/assets/brand/train.png.asset.json";
import busAsset from "@/assets/brand/bus.png.asset.json";
import flightAsset from "@/assets/brand/flight.png.asset.json";
import metroAsset from "@/assets/brand/metro.png.asset.json";
import ferryAsset from "@/assets/brand/ferry.png.asset.json";
import hotelAsset from "@/assets/brand/hotel.png.asset.json";
import cabberAsset from "@/assets/brand/cabber.png.asset.json";
import homeAsset from "@/assets/brand/home.png.asset.json";
import languageAsset from "@/assets/brand/language.png.asset.json";
import accessibilityAsset from "@/assets/brand/accessibility.png.asset.json";
import complaintAsset from "@/assets/brand/complaint.png.asset.json";
import aboutAsset from "@/assets/brand/about.png.asset.json";
import tripsAsset from "@/assets/brand/trips.png.asset.json";
import pnrAsset from "@/assets/brand/pnr.png.asset.json";
import walletAsset from "@/assets/brand/wallet.png.asset.json";
import coinsAsset from "@/assets/brand/coins.png.asset.json";
import pretatkalAsset from "@/assets/brand/pretatkal.png.asset.json";
import bellAsset from "@/assets/brand/bell.png.asset.json";
import feedbackAsset from "@/assets/brand/feedback.png.asset.json";
import { cn } from "@/lib/utils";

export const brandLogoUrl = logoUrl;

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
  accessibility: accessibilityAsset.url,
  complaint: complaintAsset.url,
  about: aboutAsset.url,
  trips: tripsAsset.url,
  pnr: pnrAsset.url,
  wallet: walletAsset.url,
  coins: coinsAsset.url,
  pretatkal: pretatkalAsset.url,
  bell: bellAsset.url,
  feedback: feedbackAsset.url,
} as const;

export type BrandIconName = keyof typeof brandIcons;

/**
 * Official Transit India logo mark. Rendered on a neutral white tile so the
 * artwork keeps identical contrast in light and dark themes.
 */
export function BrandLogo({
  className,
  size = 44,
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
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-contain p-[5%] [image-rendering:auto]"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        draggable={false}
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
  size = 48,
  className,
  rounded = "rounded-full",
  plain,
  eager,
}: {
  name: BrandIconName;
  label?: string;
  size?: number;
  className?: string;
  rounded?: string;
  plain?: boolean;
  eager?: boolean;
}) {
  const inner = Math.round(size * 0.9);
  const img = (
    <img
      src={brandIcons[name]}
      alt={label ?? `${name} icon`}
      width={size * 2}
      height={size * 2}
      className="block object-contain"
      style={{ width: inner, height: inner }}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );

  if (plain) {
    return (
      <span
        className={cn("inline-flex shrink-0 items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        {img}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden bg-white ring-1 ring-black/5 shadow-sm",
        rounded,
        className,
      )}
      style={{ width: size, height: size }}
    >
      {img}
    </span>
  );
}


