# Clean Background for the Viewer Canvas

## Goal
Remove the tech-grid pattern from the main vehicle viewer so the background-free vehicle image sits on a clean, plain dark canvas.

## Changes

1. **Viewer canvas** (`src/components/rzr/RZRViewer.tsx`, line 104)
   - Remove the `tech-grid` utility class from the viewer stage.
   - Result: a clean solid dark background (`bg-background`), keeping the subtle radial vignette and ground shadow so the vehicle still feels grounded.

2. **Leave the training modal's grid untouched**
   - `TrainingModal.tsx` uses `tech-grid-fine` behind the simulated video player — that stays as-is unless you'd like it removed too.

## Verification
- Screenshot the viewer in both 360° Inspection and Disassembly modes to confirm the canvas renders clean with no grid lines, and the vehicle shadow still reads correctly.

## Optional
- If you want the grid removed site-wide (header, modal, parts drawer), say so and the plan extends to those surfaces too.
