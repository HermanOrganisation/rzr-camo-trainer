# Wheel skeleton and wheel camo parts

GitHub has nothing new — I listed the full file tree of `main` (`05012f8`) and it matches this
project exactly: no wheel files, no PNGs, `parts/` folders empty. So the wheel parts get built here,
from the photography already in the project.

## What gets added

Two new component groups in the camouflage set, alongside the existing five:

1. **Front Wheel Camouflage — Left** (`Front Wheel Case Left-MRZR`, P/N 9001-0426-US)
2. **Front Wheel Camouflage — Right** (`Front Wheel Case Right-MRZR`, P/N 9001-0422-US)

Each behaves exactly like the current camo components:

- numbered hotspot on the vehicle in the front camo view
- row in the components sidebar with a thumbnail
- click in disassembly mode detaches the cover to the side
- training card opens with the component image

## The wheel skeleton

Under each detached wheel cover, the **wheel skeleton / infrastructure** layer is revealed —
the bare wheel structure with no camouflage on it. This uses the
`MRZR_front_infrastructure` photograph already registered in the forest asset set, cropped to
the matching wheel region, so the reveal shows real product imagery rather than a blank gap.

Registered as a new asset role (`wheelSkeleton`) in the asset registry, so a dedicated skeleton
photograph — or a desert version — can be dropped in later without touching components.

## Part numbers

Part names and P/Ns come verbatim from the catalogue you supplied. Nothing is invented or altered.

## Technical notes

- `src/data/rzrAssets.ts` — add the `wheelSkeleton` asset key mapped to the existing
  infrastructure image for `forest`, with the documented desert fallback.
- `src/data/rzrTraining.ts` — append the two wheel components with `region`, `detached`,
  `hotspot`, `layer`, plus a new optional `skeletonRegion` field describing which part of the
  skeleton photograph shows through when the cover is off.
- `src/components/rzr/VehiclePart.tsx` — when a part with a `skeletonRegion` is detached, render
  the skeleton crop in the vacated area beneath it.
- Everything else (sidebar, hotspots, training modal, progress, persistence) picks the new parts up
  automatically from the data array; no component rewrites.
- Verified in the browser afterwards: hotspot placement, detach animation, skeleton reveal
  alignment, and no aspect-ratio distortion.

## Adjusting later

Crop and hotspot coordinates are approximations against the current front camo photograph. Once
real wheel photography is uploaded, the coordinates are single-line data edits — or drop the images
into `src/assets/<pattern>/parts/` and they replace the crops automatically.
