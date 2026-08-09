import logoUrl from "@/assets/brand/logo.png";
import trainAsset from "@/assets/brand/train.png";
import busAsset from "@/assets/brand/bus.png";
import flightAsset from "@/assets/brand/flight.png";
import metroAsset from "@/assets/brand/metro.png";
import ferryAsset from "@/assets/brand/ferry.png";
import hotelAsset from "@/assets/brand/hotel.png";
import cabberAsset from "@/assets/brand/cabber.png";
import homeAsset from "@/assets/brand/home.png";
import languageAsset from "@/assets/brand/language.png";
import accessibilityAsset from "@/assets/brand/accessibility.png";
import complaintAsset from "@/assets/brand/complaint.png";
import aboutAsset from "@/assets/brand/about.png";
import tripsAsset from "@/assets/brand/trips.png";
import pnrAsset from "@/assets/brand/pnr.png";
import walletAsset from "@/assets/brand/wallet.png";
import coinsAsset from "@/assets/brand/coins.png";
import pretatkalAsset from "@/assets/brand/pretatkal.png";
import bellAsset from "@/assets/brand/bell.png";
import feedbackAsset from "@/assets/brand/feedback.png";
import { cn } from "@/lib/utils";

export const brandLogoUrl = logoUrl;

export const brandIcons = {
  train: trainAsset,
  bus: busAsset,
  flight: flightAsset,
  metro: metroAsset,
  ferry: ferryAsset,
  hotel: hotelAsset,
  cabber: cabberAsset,
  cab: cabberAsset,
  home: homeAsset,
  language: languageAsset,
  accessibility: accessibilityAsset,
  complaint: complaintAsset,
  about: aboutAsset,
  trips: tripsAsset,
  pnr: pnrAsset,
  wallet: walletAsset,
  coins: coinsAsset,
  pretatkal: pretatkalAsset,
  bell: bellAsset,
  feedback: feedbackAsset,
} as const;

export type BrandIconName = keyof typeof brandIcons;

/**
 * Official Transit India logo mark.
 * Rendered on a neutral white tile so the artwork keeps identical contrast
 * in light and dark themes.
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
        className={cn(
          "inline-flex shrink-0 items-center justify-center",
          className,
        )}
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
