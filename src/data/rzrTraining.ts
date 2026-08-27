import baseFront from "@/assets/MRZR_front_armadillo_copy.jpg.asset.json";
import frontCoverOpen from "@/assets/MRZR_front_armadillo_t.png.asset.json";
import frontThreeQuarter from "@/assets/MRZR_front_armadillo_t_side.png.asset.json";
import isolatedCover from "@/assets/MRZR_front_armadillo_infrastructure_t.png.asset.json";

/**
 * ASSET REGISTRY
 * All vehicle photography flows through this map. Replacing or adding
 * photography is a one-line change here plus a VIEW_ANGLES entry.
 */
export const RZR_ASSETS = {
  baseFront: baseFront.url,
  frontCoverOpen: frontCoverOpen.url,
  frontThreeQuarter: frontThreeQuarter.url,
  isolatedCover: isolatedCover.url,
} as const;

export type AngleId = "front-34" | "front" | "front-open" | "left" | "right" | "rear";

export interface ViewAngle {
  id: AngleId;
  /** Short label used by the angle buttons */
  label: string;
  /** Long technical label: "VIEW ANGLE: FRONT — 000°" */
  readout: string;
  degrees: number;
  /** Undefined when no photography exists for this angle yet */
  image?: string | undefined;
  /** Intrinsic aspect ratio of the photograph, used to keep overlays aligned */
  aspect?: number | undefined;
  available: boolean;
  /** Nearest documented angle used when this one has no asset */
  fallback?: AngleId | undefined;
}

/**
 * Ordered left-to-right as a simulated rotation. Add real LEFT / RIGHT / REAR
 * photography by filling in `image` + `aspect` and flipping `available`.
 */
export const VIEW_ANGLES: ViewAngle[] = [
  {
    id: "front-34",
    label: "FRONT 3/4",
    readout: "FRONT 3/4 — 045°",
    degrees: 45,
    image: RZR_ASSETS.frontThreeQuarter,
    aspect: 1443 / 1090,
    available: true,
  },
  {
    id: "front",
    label: "FRONT",
    readout: "FRONT — 000°",
    degrees: 0,
    image: RZR_ASSETS.baseFront,
    aspect: 1018 / 962,
    available: true,
  },
  {
    id: "front-open",
    label: "COVER OPEN",
    readout: "FRONT — 000° / COVER OPEN",
    degrees: 0,
    image: RZR_ASSETS.frontCoverOpen,
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
    fallback: "front",
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
export const DISASSEMBLY_ANGLE: AngleId = "front";

export function resolveAngle(id: AngleId): ViewAngle {
  const angle = VIEW_ANGLES.find((a) => a.id === id) ?? VIEW_ANGLES[1]!;
  if (angle.available) return angle;
  const fb = VIEW_ANGLES.find((a) => a.id === angle.fallback);
  return fb ? { ...angle, image: fb.image, aspect: fb.aspect } : angle;
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
  /** "01" .. "05" */
  code: string;
  name: string;
  shortName: string;
  /** Cropped area of the base photograph that forms this removable layer */
  region: Region;
  /** Where the detached layer parks, in % of the vehicle box */
  detached: { x: number; y: number; rotate: number };
  /** Hotspot anchor, in % of the vehicle box */
  hotspot: { x: number; y: number };
  /** z-index inside the layer stack (Layer 1..5) */
  layer: number;
  estTime: string;
  difficulty: string;
  videoUrl: string | null;
  steps: string[];
}

/**
 * Single source of truth. Adding a sixth camouflage part is a data edit:
 * append an entry with its crop region, park position and hotspot anchor.
 */
export const CAMO_COMPONENTS: CamoComponent[] = [
  {
    id: "front-hood",
    code: "01",
    name: "Front Grille / Hood Camouflage Cover",
    shortName: "Front Grille / Hood",
    region: { left: 35, top: 29, width: 24, height: 40 },
    detached: { x: -38, y: 4, rotate: -4 },
    hotspot: { x: 47, y: 47 },
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
    id: "left-panel",
    code: "02",
    name: "Left Front Camouflage Panel",
    shortName: "Left Panel",
    region: { left: 4, top: 30, width: 32, height: 43 },
    detached: { x: -36, y: 20, rotate: -6 },
    hotspot: { x: 17, y: 50 },
    layer: 2,
    estTime: "02:30",
    difficulty: "BASIC",
    videoUrl: null,
    steps: [
      "Release the upper attachment points.",
      "Disconnect the side retention straps.",
      "Support the panel while removing the lower attachment.",
      "Pull the camouflage panel away from the vehicle.",
      "Inspect attachment points before storage or reinstallation.",
    ],
  },
  {
    id: "right-panel",
    code: "03",
    name: "Right Front Camouflage Panel",
    shortName: "Right Panel",
    region: { left: 55, top: 29, width: 41, height: 44 },
    detached: { x: 36, y: 20, rotate: 6 },
    hotspot: { x: 80, y: 50 },
    layer: 3,
    estTime: "02:30",
    difficulty: "BASIC",
    videoUrl: null,
    steps: [
      "Release the upper attachment points.",
      "Disconnect the side retention straps.",
      "Support the panel while removing the lower attachment.",
      "Pull the camouflage panel away from the vehicle.",
      "Inspect attachment points before storage or reinstallation.",
    ],
  },
  {
    id: "roof-netting",
    code: "04",
    name: "Roof / Windshield Camouflage Netting",
    shortName: "Roof / Windshield",
    region: { left: 23, top: 17, width: 54, height: 15 },
    detached: { x: 0, y: -15, rotate: 0 },
    hotspot: { x: 50, y: 24 },
    layer: 4,
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
    code: "05",
    name: "Rear Cargo / Engine Camouflage Cover",
    shortName: "Rear Cargo / Engine",
    region: { left: 29, top: 7, width: 43, height: 10 },
    detached: { x: 34, y: -8, rotate: 4 },
    hotspot: { x: 50, y: 12 },
    layer: 5,
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
