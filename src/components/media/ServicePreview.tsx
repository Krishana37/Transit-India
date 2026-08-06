import trainPreview from "@/assets/preview/train.png.asset.json";
import trainPreview2 from "@/assets/preview/train-2.jpg";
import busPreview from "@/assets/preview/bus.jpg.asset.json";
import busPreview2 from "@/assets/preview/bus-2.jpg";
import flightPreview from "@/assets/preview/flight.png.asset.json";
import flightPreview2 from "@/assets/preview/flight-2.jpg";
import metroPreview from "@/assets/preview/metro.webp.asset.json";
import metroPreview2 from "@/assets/preview/metro-2.jpg";
import ferryPreview from "@/assets/preview/ferry.webp.asset.json";
import ferryPreview2 from "@/assets/preview/ferry-2.jpg";
import cabPreview from "@/assets/preview/cab.webp.asset.json";
import cabSedan from "@/assets/preview/cab-sedan.jpg";
import cabSuv from "@/assets/preview/cab-suv.jpg";
import cabAuto from "@/assets/preview/cab-auto.jpg";
import cabBike from "@/assets/preview/cab-bike.jpg";
import hotelPreview from "@/assets/preview/hotel.webp.asset.json";
import hotelPreview1 from "@/assets/preview/hotel-1.webp.asset.json";
import hotelPreview2 from "@/assets/preview/hotel-2.webp.asset.json";
import stayA from "@/assets/preview/stay-a.png.asset.json";
import stayB from "@/assets/preview/stay-b.png.asset.json";
import stayC from "@/assets/preview/stay-c.png.asset.json";
import stayD from "@/assets/preview/stay-d.png.asset.json";
import { cn } from "@/lib/utils";

/** Photo sets used for vehicle / stay previews in search results and tickets. */
const gallery: Record<string, string[]> = {
  train: [trainPreview.url, trainPreview2],
  bus: [busPreview.url, busPreview2],
  flight: [flightPreview.url, flightPreview2],
  metro: [metroPreview.url, metroPreview2],
  ferry: [ferryPreview.url, ferryPreview2],
  cab: [cabPreview.url, cabSedan, cabSuv, cabAuto],
  hotel: [stayA.url, stayB.url, stayC.url, stayD.url, hotelPreview.url, hotelPreview1.url, hotelPreview2.url],
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

/** Stable preview photo for a service, so the same train keeps the same shot. */
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
    <div className={cn("overflow-hidden rounded-xl bg-muted ring-1 ring-border/60", ratio, className)}>
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
