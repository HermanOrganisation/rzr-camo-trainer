import forestCamo from "@/assets/forest/MRZR_front_camo.png.asset.json";
import forestThreeQuarter from "@/assets/forest/MRZR_front_34.png.asset.json";
import forestMarkiza from "@/assets/forest/MRZR_front_markiza.png.asset.json";
import forestInfrastructure from "@/assets/forest/MRZR_front_infrastructure.png.asset.json";

/**
 * ASSET REGISTRY
 *
 * Photography is organised per camouflage pattern:
 *
 *   src/assets/<pattern>/MRZR_front_camo.png.asset.json
 *   src/assets/<pattern>/parts/<component-id>.png.asset.json
 *
 * Adding the DESERT set is a drop-in: create the pointer files, import them
 * below and register them in ASSETS / PART_IMAGES. Anything still missing
 * falls back to the FOREST set, so the interface never breaks.
 */

export type CamoPattern = "forest" | "desert";

export interface CamoOption {
  id: CamoPattern;
  label: string;
  /** False until that pattern's photography is on file */
  available: boolean;
}

export const CAMO_OPTIONS: CamoOption[] = [
  { id: "forest", label: "FOREST", available: true },
  { id: "desert", label: "DESERT", available: false },
];

export type AssetKey =
  /** Vehicle fully covered — the disassembly reference frame */
  | "frontCamo"
  /** Front 3/4 hero frame */
  | "front34"
  /** Front with the markiza / cover opened */
  | "markiza"
  /** Isolated cover component */
  | "infrastructure"
  /** Bare wheel structure shown under a removed wheel camouflage case */
  | "wheelSkeleton"
  /** Uncovered vehicle, same framing as frontCamo */
  | "bare";

type AssetSet = Partial<Record<AssetKey, string>>;

const ASSETS: Record<CamoPattern, AssetSet> = {
  forest: {
    frontCamo: forestCamo.url,
    front34: forestThreeQuarter.url,
    markiza: forestMarkiza.url,
    infrastructure: forestInfrastructure.url,
    // Until dedicated wheel-skeleton photography is on file, the
    // infrastructure frame stands in for the uncovered wheel structure.
    wheelSkeleton: forestInfrastructure.url,
    // bare: pending upload of the uncovered MRZR photograph
  },
  desert: {
    // pending upload of the desert photography set
  },
};

/** Per-component photography, keyed by CamoComponent.id. */
const PART_IMAGES: Record<CamoPattern, Record<string, string>> = {
  forest: {},
  desert: {},
};

/** Resolves an asset for a pattern, falling back to the documented FOREST set. */
export function getAsset(camo: CamoPattern, key: AssetKey): string | undefined {
  return ASSETS[camo][key] ?? ASSETS.forest[key];
}

/** Per-component photograph, when one has been uploaded. */
export function getPartImage(camo: CamoPattern, componentId: string): string | undefined {
  return PART_IMAGES[camo][componentId] ?? PART_IMAGES.forest[componentId];
}
