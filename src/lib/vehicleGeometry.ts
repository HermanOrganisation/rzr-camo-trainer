import type { CSSProperties } from "react";
import type { Region } from "@/data/rzrTraining";

/**
 * Positions a box over `region` of the vehicle photograph.
 * All coordinates are % of the vehicle box, so overlays stay aligned at
 * any viewport size.
 */
export function regionStyle(region: Region, zIndex?: number): CSSProperties {
  return {
    left: `${region.left}%`,
    top: `${region.top}%`,
    width: `${region.width}%`,
    height: `${region.height}%`,
    ...(zIndex === undefined ? {} : { zIndex }),
  };
}

/**
 * Sizes and offsets a full photograph inside a `region`-sized box so that only
 * that region is visible — the part is always the real product imagery, never
 * a reconstruction.
 */
export function cropStyle(region: Region): CSSProperties {
  return {
    width: `${(100 / region.width) * 100}%`,
    height: `${(100 / region.height) * 100}%`,
    left: `${(-region.left / region.width) * 100}%`,
    top: `${(-region.top / region.height) * 100}%`,
    maxWidth: "none",
    maxHeight: "none",
  };
}

/** Aspect ratio of a cropped region, given the source photograph's aspect. */
export function regionAspect(region: Region, imageAspect = 1): number {
  return (region.width / region.height) * imageAspect;
}
