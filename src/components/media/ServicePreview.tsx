import trainPreview from "@/assets/preview/train-2.jpg";
import busPreview from "@/assets/preview/bus-2.jpg";
import flightPreview from "@/assets/preview/flight-2.jpg";
import metroPreview from "@/assets/preview/metro-2.jpg";
import ferryPreview from "@/assets/preview/ferry-2.jpg";

import cabSedan from "@/assets/preview/cab-sedan.jpg";
import cabSuv from "@/assets/preview/cab-suv.jpg";
import cabAuto from "@/assets/preview/cab-auto.jpg";
import cabBike from "@/assets/preview/cab-bike.jpg";

import hotelPreview from "@/assets/preview/hotel-2.webp";
import stayA from "@/assets/preview/stay-a.png";
import stayB from "@/assets/preview/stay-b.png";
import stayC from "@/assets/preview/stay-c.png";
import stayD from "@/assets/preview/stay-d.png";

import { cn } from "@/lib/utils";

/** Photo sets used for vehicle / stay previews in search results and tickets. */
const gallery: Record<string, string[]> = {
  train: [trainPreview],
  bus: [busPreview],
  flight: [flightPreview],
  metro: [metroPreview],
  ferry: [ferryPreview],
  cab: [cabSedan, cabSuv, cabAuto],
  hotel: [stayA, stayB, stayC, stayD, hotelPreview],
};

/** Exact photo for a cab vehicle class, used on the assigned-driver card. */
export const cabVehicleImages: Record<string, string> = {
  Bike: cabBike,
  Auto: cabAuto,
  Sedan: cabSedan,
  SUV: cabSuv,
};

export function cabVehicleImage(vehicleType: string) {
  return cabVehicleImages[vehicleType] ?? cabSedan;
}

function hash(str: string) {
  let h = 2166136261;

  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return Math.abs(h);
}

/** Stable preview photo for a service, so the same service keeps the same shot. */
export function previewImage(mode: string, seed: string) {
  const set = gallery[mode] ?? gallery.train;
  return set[hash(seed) % set.length];
}

export function ServicePreview({
  mode,
  seed,
  alt,
  src,
  className,
  ratio = "aspect-[16/10]",
}: {
  mode: string;
  seed: string;
  alt: string;
  /** Override the auto-picked photo (e.g. exact cab vehicle class). */
  src?: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-muted ring-1 ring-border/60",
        ratio,
        className
      )}
    >
      <img
        src={src ?? previewImage(mode, seed)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition duration-500 hover:scale-[1.04]"
        draggable={false}
      />
    </div>
  );
}
