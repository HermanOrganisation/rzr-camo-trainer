# Use Camo-Pattern Front Image for Disassembly Mode

## Goal

Make the exploded-view (Disassembly Mode) use the newly uploaded camouflage-pattern front photo (`MRZR_front_armadillo_cront_covered`) instead of the current solid-green front photo, so the interactive tear-down shows the real camo texture.

## Changes

1. **Switch the disassembly base frame**
   - In `src/data/rzrTraining.ts`, change `DISASSEMBLY_ANGLE` from `"front"` to `"front-camo"`.
   - Both photos are 1018×962 front views with near-identical framing, so the existing component data transfers cleanly.

2. **Verify and fine-tune component geometry against the new photo**
   - Check the 5 crop `region`s (grille/hood, left panel, right panel, roof netting, rear cover) still isolate the correct parts on the camo image; nudge percentages where the framing differs.
   - Check the 5 `hotspot` anchors sit on their parts (hotspots 04/05 currently float above the vehicle on this frame and will be re-anchored).
   - Confirm detached "park" offsets still produce a balanced, in-viewport exploded layout.

3. **Visual verification**
   - Screenshot Disassembly Mode with all parts attached, mid-detach (leader lines visible), and fully exploded; confirm the camo texture renders on every layer and no part is off-screen.

## Technical notes

- Single data edit drives the swap: `RZRViewer` renders layers from `CAMO_COMPONENTS` regions of whatever image `DISASSEMBLY_ANGLE` resolves to — no component code changes needed.
- The newly re-uploaded `cront_covered-2` file is identical to the already-registered asset, so no new CDN upload is required.
