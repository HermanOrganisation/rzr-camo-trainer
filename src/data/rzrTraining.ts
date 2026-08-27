import { getAsset, type AssetKey, type CamoPattern } from "./rzrAssets";

export type AngleId = "front-34" | "front-camo" | "front-open" | "left" | "right" | "rear";

export interface ViewAngle {
  id: AngleId;
  /** Short label used by the angle buttons */
  label: string;
  /** Long technical label: "VIEW ANGLE: FRONT — 000°" */
  readout: string;
  degrees: number;
  /** Which photograph of the active camouflage set this angle shows */
  assetKey?: AssetKey | undefined;
  /** Intrinsic aspect ratio of the photograph, used to keep overlays aligned */
  aspect?: number | undefined;
  available: boolean;
  /** Nearest documented angle used when this one has no asset */
  fallback?: AngleId | undefined;
}

/**
 * Ordered left-to-right as a simulated rotation. Add real LEFT / RIGHT / REAR
 * photography by filling in `assetKey` + `aspect` and flipping `available`.
 */
export const VIEW_ANGLES: ViewAngle[] = [
  {
    id: "front-34",
    label: "FRONT 3/4",
    readout: "FRONT 3/4 — 045°",
    degrees: 45,
    assetKey: "front34",
    aspect: 1443 / 1090,
    available: true,
  },
  {
    id: "front-camo",
    label: "FRONT CAMO",
    readout: "FRONT — 000° / CAMO PATTERN",
    degrees: 0,
    assetKey: "frontCamo",
    aspect: 1024 / 1024,
    available: true,
  },
  {
    id: "front-open",
    label: "COVER OPEN",
    readout: "FRONT — 000° / COVER OPEN",
    degrees: 0,
    assetKey: "markiza",
    aspect: 973 / 962,
    available: true,
  },
  {
    id: "left",
    label: "LEFT",
    readout: "LEFT — 270° / NO ASSET",
    degrees: 270,
    available: false,
    fallback: "front-34",
  },
  {
    id: "right",
    label: "RIGHT",
    readout: "RIGHT — 090° / NO ASSET",
    degrees: 90,
    available: false,
    fallback: "front-camo",
  },
  {
    id: "rear",
    label: "REAR",
    readout: "REAR — 180° / NO ASSET",
    degrees: 180,
    available: false,
    fallback: "front-34",
  },
];

/** The frame the exploded-view interface is authored against. */
export const DISASSEMBLY_ANGLE: AngleId = "front-camo";

export interface ResolvedAngle extends ViewAngle {
  /** Photograph for the active camouflage pattern, if one exists */
  image?: string | undefined;
}

/** Resolves an angle to a concrete photograph of the active camouflage set. */
export function resolveAngle(id: AngleId, camo: CamoPattern): ResolvedAngle {
  const angle = VIEW_ANGLES.find((a) => a.id === id) ?? VIEW_ANGLES[0]!;
  const source = angle.available
    ? angle
    : (VIEW_ANGLES.find((a) => a.id === angle.fallback) ?? angle);
  return {
    ...angle,
    aspect: source.aspect,
    image: source.assetKey ? getAsset(camo, source.assetKey) : undefined,
  };
}


/** Region of the FRONT photograph, in % of the vehicle box. */
export interface Region {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CamoComponent {
  id: string;
  /** "01" .. "07" */
  code: string;
  name: string;
  shortName: string;
  /** Cropped area of the base photograph that forms this removable layer */
  region: Region;
  /** Where the detached layer parks, in % of the vehicle box */
  detached: { x: number; y: number; rotate: number };
  /** Hotspot anchor, in % of the vehicle box */
  hotspot: { x: number; y: number };
  /** z-index inside the layer stack (Layer 1..7) */
  layer: number;
  estTime: string;
  difficulty: string;
  videoUrl: string | null;
  steps: string[];
  /**
   * Id of another component that must be installed before this one can be.
   * Enforced only for this specific relationship — everything else stays
   * free-form (any part can be detached/reattached in any order).
   */
  requires?: string;
}

/**
 * Single source of truth. Adding another camouflage part is a data edit:
 * append an entry with its crop region, park position and hotspot anchor.
 */
export const CAMO_COMPONENTS: CamoComponent[] = [
  {
    id: "front-hood",
    code: "01",
    name: "Front Grille / Hood Camouflage Cover",
    shortName: "Front Grille / Hood",
    region: { left: 38.9, top: 40.7, width: 26, height: 17.8 },
    detached: { x: -4, y: 30, rotate: -4 },
    hotspot: { x: 52.4, y: 49.6 },
    layer: 1,
    estTime: "02:00",
    difficulty: "BASIC",
    videoUrl: null,
    steps: [
      "Release the upper hood attachment points.",
      "Unclip the grille retention tabs at both corners.",
      "Lift the cover clear of the bumper tubing.",
      "Pull the camouflage cover forward and away from the vehicle.",
      "Inspect attachment points before storage or reinstallation.",
    ],
  },
  {
    id: "wheel-skeleton-left",
    code: "02",
    name: "Left Wheel Skeleton Frame",
    shortName: "Wheel Skeleton — Left",
    // Placeholder crop pending dedicated skeleton-frame photography — no
    // uncovered/frame-only reference image exists yet, so this uses the same
    // base photograph as everything else, cropped over the wheel area.
    region: { left: 8, top: 55, width: 26, height: 18 },
    detached: { x: -16, y: 26, rotate: -8 },
    hotspot: { x: 21, y: 64 },
    layer: 2,
    estTime: "01:45",
    difficulty: "INTERMEDIATE",
    videoUrl: null,
    steps: [
      "Confirm the left wheel camouflage cover has been fully removed.",
      "Release the skeleton frame's hub-mounted retention clips.",
      "Unclip the lower support brace from the fender rail.",
      "Lift the frame clear of the wheel well.",
      "Inspect the frame and clips before storage or reinstallation.",
    ],
  },
  {
    id: "wheel-camo-left",
    code: "03",
    name: "Left Wheel Camouflage Cover",
    shortName: "Wheel Camo — Left",
    region: { left: 0.4, top: 30.8, width: 42.6, height: 42.5 },
    detached: { x: -30, y: 10, rotate: -6 },
    hotspot: { x: 20.2, y: 52.6 },
    layer: 3,
    estTime: "02:30",
    difficulty: "BASIC",
    videoUrl: null,
    requires: "wheel-skeleton-left",
    steps: [
      "Release the upper attachment points.",
      "Disconnect the side retention straps.",
      "Support the panel while removing the lower attachment.",
      "Pull the camouflage cover away from the vehicle.",
      "Inspect attachment points before storage or reinstallation.",
      "Wheel skeleton frame remains fitted underneath — remove it separately once the cover is off.",
    ],
  },
  {
    id: "wheel-skeleton-right",
    code: "04",
    name: "Right Wheel Skeleton Frame",
    shortName: "Wheel Skeleton — Right",
    // Placeholder crop pending dedicated skeleton-frame photography — see
    // wheel-skeleton-left.
    region: { left: 66, top: 55, width: 26, height: 18 },
    detached: { x: 16, y: 26, rotate: 8 },
    hotspot: { x: 79, y: 64 },
    layer: 4,
    estTime: "01:45",
    difficulty: "INTERMEDIATE",
    videoUrl: null,
    steps: [
      "Confirm the right wheel camouflage cover has been fully removed.",
      "Release the skeleton frame's hub-mounted retention clips.",
      "Unclip the lower support brace from the fender rail.",
      "Lift the frame clear of the wheel well.",
      "Inspect the frame and clips before storage or reinstallation.",
    ],
  },
  {
    id: "wheel-camo-right",
    code: "05",
    name: "Right Wheel Camouflage Cover",
    shortName: "Wheel Camo — Right",
    region: { left: 56.5, top: 33.8, width: 45.7, height: 40.5 },
    detached: { x: 30, y: 10, rotate: 6 },
    hotspot: { x: 80.4, y: 54.5 },
    layer: 5,
    estTime: "02:30",
    difficulty: "BASIC",
    videoUrl: null,
    requires: "wheel-skeleton-right",
    steps: [
      "Release the upper attachment points.",
      "Disconnect the side retention straps.",
      "Support the panel while removing the lower attachment.",
      "Pull the camouflage cover away from the vehicle.",
      "Inspect attachment points before storage or reinstallation.",
      "Wheel skeleton frame remains fitted underneath — remove it separately once the cover is off.",
    ],
  },
  {
    id: "roof-netting",
    code: "06",
    name: "Roof / Windshield Camouflage Netting",
    shortName: "Roof / Windshield",
    region: { left: 30.5, top: 10.1, width: 46.8, height: 21.7 },
    detached: { x: -2, y: -19, rotate: 0 },
    hotspot: { x: 53.4, y: 20.9 },
    layer: 6,
    estTime: "03:15",
    difficulty: "INTERMEDIATE",
    videoUrl: null,
    steps: [
      "Unhook the netting from the roll cage anchor loops.",
      "Release the windshield edge retention cord.",
      "Fold the netting forward over the cage.",
      "Lift the assembly clear of the cage and set it aside.",
      "Inspect anchor loops and cord tension before reinstallation.",
    ],
  },
  {
    id: "rear-cover",
    code: "07",
    name: "Rear Cargo / Engine Camouflage Cover",
    shortName: "Rear Cargo / Engine",
    region: { left: 33.7, top: 9.1, width: 42.6, height: 6.9 },
    detached: { x: 26, y: -17, rotate: 4 },
    hotspot: { x: 54.5, y: 12.1 },
    layer: 7,
    estTime: "02:45",
    difficulty: "INTERMEDIATE",
    videoUrl: null,
    steps: [
      "Release the cargo bed perimeter clips.",
      "Disconnect the engine bay heat-shield standoffs.",
      "Slide the cover rearward off the bed rails.",
      "Lift the cover away from the vehicle.",
      "Inspect standoffs and clips before storage or reinstallation.",
    ],
  },
];

export const TOTAL_COMPONENTS = CAMO_COMPONENTS.length;

/**
 * Checks whether `component` can transition to `nextDetached`, given which
 * ids are currently detached. Only components with a `requires` relationship
 * are ever blocked (currently: each wheel camo cover requires its skeleton
 * frame) — everything else is always free to toggle.
 */
export function resolveLock(
  component: CamoComponent,
  nextDetached: boolean,
  detachedIds: string[],
): string | null {
  if (!nextDetached) {
    // Attaching: the required part must already be installed.
    if (component.requires && detachedIds.includes(component.requires)) {
      const required = CAMO_COMPONENTS.find((c) => c.id === component.requires);
      return `Install ${required?.shortName ?? "the required part"} first.`;
    }
    return null;
  }
  // Detaching: any part that requires this one must already be off.
  const dependent = CAMO_COMPONENTS.find(
    (c) => c.requires === component.id && !detachedIds.includes(c.id),
  );
  return dependent ? `Remove ${dependent.shortName} first.` : null;
}
