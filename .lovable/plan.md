# Component Imagery, Bare-Vehicle Reveal, and Camo Color Switch

## 1. Asset folder restructure

Reorganize `src/assets` into per-camo-pattern folders:

```text
src/assets/
  forest/
    MRZR_front_markiza.png.asset.json
    MRZR_front_infrastructure.png.asset.json
    MRZR_front_34.png.asset.json
    MRZR_front_bare.png.asset.json        <- your upcoming bare-vehicle photo
    parts/<component-id>.png.asset.json   <- your upcoming per-part photos
  desert/
    (same filenames, populated when you upload the desert set)
```

The current images move into `forest/` under the new names. `desert/` starts empty and every lookup falls back to `forest/` until you upload the desert set, so nothing breaks in the meantime.

A single `src/data/rzrAssets.ts` module owns the folder structure and exposes one lookup: `getAsset(camo, key)`. Adding the desert images later becomes a drop-in — add the pointer files, no component changes.

## 2. Camo color switch

- New `camo` value in `useTrainingState` (`"forest" | "desert"`), persisted with the rest of the training state.
- A `CamoSelector` button group in the toolbar next to the mode selector, styled like the existing mode tabs.
- Every vehicle image (base photo, part crops, bare layer, sidebar thumbnails, modal image) resolves through `getAsset(camo, ...)`.
- The desert option shows a "NO ASSET" hint until those images exist, matching how the unavailable view angles already behave.

## 3. Training modal: image instead of step text

In `TrainingModal.tsx`:
- Remove the "REMOVAL PROCEDURE" numbered step list.
- The right column becomes a large component image panel: the uploaded per-part photo when available, otherwise the auto-cropped region from the vehicle photograph.
- Keep the header, the Est. Time / Difficulty / Status stats, the installed/detached state readout, and the "Mark training complete" action.
- The simulated training-video panel stays as the left column.
- `steps` stays in the data model (unused by the UI) so nothing else breaks; it can be dropped later if you don't want it back.

## 4. Component list thumbnails

In `PartsSidebar.tsx`, each row gets a small square image to the left of the code badge — the per-part photo when uploaded, otherwise the component's crop region from the vehicle photo. Detached parts render their thumbnail dimmed so the installed/detached state stays readable at a glance.

## 5. Disassembly: reveal the bare vehicle under a removed part

Today a detached part leaves a hatched "VACANT MOUNT" placeholder. New behavior:

- A bare-vehicle layer (your uploaded uncovered-MRZR photo, same framing) renders at z-index 1, directly beneath the camo photo.
- When a part detaches, the camo photograph is masked over that part's region so the bare vehicle shows through exactly where the cover used to be — the rest of the vehicle stays covered.
- The mask fades in over ~350ms, in sync with the part flying to its parked position, and the leader line still connects the detached part to its mount.
- A thin amber outline marks the revealed area so it reads as a deliberate technical callout rather than a hole.
- Until the bare photo is uploaded, the current hatched silhouette is used as the fallback, so the interaction is testable immediately.

```text
z-index  layer
   1     bare vehicle photo         (revealed through the mask)
   5     camo photo + reveal mask   (holes where parts are detached)
  10+    part crops (installed or parked to the side)
  30     leader lines
  40     hotspots
```

## 6. Code simplification (no functional change)

- Extract the repeated `region`-to-CSS percentage math from `VehiclePart.tsx` and `PartSilhouette` into one `regionStyle()` / `cropStyle()` helper in `src/lib/vehicleGeometry.ts`, used by the parts, the silhouettes, the reveal mask, and the thumbnails.
- Split `RZRViewer.tsx`'s zoom/pan gesture logic into a `useViewerTransform` hook, leaving the component as layout and layers only.
- Collapse `detachPart` / `attachPart` / `toggleDetached` in `useTrainingState` into one `setPartDetached(id, detached)` plus a thin `toggle`, and drop the now-unused variants.
- Move the shared `label-tech` button styling used across the toolbar into small local presentational components instead of repeating long class strings.

## What I need from you

- The bare uncovered MRZR front photo (same framing/angle as the camo front photo).
- The per-component photos, named by component so I can wire them directly.
- The desert camo image set, when ready.

Everything above ships with automatic fallbacks, so the app stays fully functional before those uploads land.
