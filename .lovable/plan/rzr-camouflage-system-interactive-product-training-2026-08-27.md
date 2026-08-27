# RZR Camouflage System — Interactive Product Training

A single full-screen dark tactical training interface built around your four uploaded photographs. No generated or stock vehicle imagery anywhere.

## What your images give us (and what they don't)

| Image | Role in the app |
|---|---|
| `MRZR_front_armadillo_copy.jpg` — fully covered front view | Layer 0 base vehicle, `FRONT — 000°` |
| `MRZR_front_armadillo_t_side.png` — front 3/4 view | `FRONT 3/4 — 045°` viewpoint, the hero frame on first load |
| `MRZR_front_armadillo_t.png` — front view, right cover detached/hanging | `FRONT — COVER OPEN` frame + reference for the "cover removed" state |
| `MRZR_front_armadillo_infrastructure_t.png` — isolated camo cover | The detached-component visual, cropped/scaled per part |

The frame set is therefore three real viewpoints: `FRONT 3/4 — 045°`, `FRONT — 000°`, and `FRONT — COVER OPEN`. There is still no true left, right, or rear photography, so `LEFT`, `RIGHT`, and `REAR` render as disabled angle buttons labelled `NO ASSET` and fall back to the nearest available view rather than inventing a different vehicle. Angles live in a single data array, so dropping in more photos later enables those buttons with no code change.

Same honesty rule for the exploded view: detached parts are drawn using the isolated cover photo (cropped/scaled per part), and the area vacated on the vehicle gets a subtle dark technical silhouette with a hatch pattern and an `UNDOCUMENTED STRUCTURE` micro-label instead of fabricated mechanical detail.

## Screen layout (desktop 1920×1080 first, landscape tablet second)

```text
┌──────────────────────────────────────────────────────────────┐
│ RZR CAMOUFLAGE SYSTEM      TRAINING PROGRESS ▓▓▓░░ 40%   HELP│
│ Interactive Product Training      2 / 5 COMPONENTS COMPLETE   │
├───────────────────────────────────────────┬──────────────────┤
│      [ 360° INSPECTION | DISASSEMBLY ]    │ CAMOUFLAGE       │
│                                           │ COMPONENTS       │
│   ◀      the RZR, ~65% of the area    ▶   │ 01 Front Grille  │
│          hotspots ①..⑤ pulsing            │    ● INSTALLED   │
│          ground shadow beneath             │ 02 Left Panel    │
│                                           │ 03 Right Panel   │
│  VIEW ANGLE: FRONT — 000°   ↻ RESET       │ 04 Roof/Windshld │
│  [FRONT][LEFT*][RIGHT*][REAR*]  zoom +/-  │ 05 Rear Cargo    │
└───────────────────────────────────────────┴──────────────────┘
```

Sidebar collapses into a bottom drawer on tablet; hotspots get 44px touch targets.

## Interactions that actually work

- **Mode switch** — segmented control, amber active indicator, crossfade between inspection and disassembly.
- **Viewer** — drag to rotate through the frame set, wheel/pinch zoom (delta-normalised, cursor-anchored), drag-to-pan when zoomed, reset view.
- **Hotspots 01–05** — percentage-positioned inside an aspect-ratio container so they stay pinned at any size. Hover tooltip: number, name, status, `VIEW TRAINING`. Click opens the modal.
- **Disassembly** — each of the 5 covers is a positioned image layer that both click-to-detach and drag-to-remove. Drag gives a slight scale-up, amber outline, and a direction cue; past threshold it springs to its parked position (front → left, left panel → left, right panel → right, roof → up, rear → right/rear). Detached parts stay on screen with a thin technical leader line back to the mount point — a proper exploded diagram.
- **Reattach** — click the part or its sidebar row again to spring it home.
- **Reset Vehicle** — all parts return sequentially with ~80 ms stagger, statuses back to `INSTALLED`, no reload.
- **First-time disassembly coach** — small contextual card with `GOT IT` / `DON'T SHOW AGAIN` (the latter persisted).
- **Training modal** — `COMPONENT 0N` header, 16:9 dark video placeholder with centred play button, `REMOVAL PROCEDURE` steps, EST. TIME / DIFFICULTY / STATUS, `MARK TRAINING COMPLETE`. Closing restores the exact previous viewer state (mode, angle, zoom, detached set).
- **Progress** — thin animated bar in the top bar, `n / 5 COMPONENTS COMPLETE` and percent, persisted to localStorage so a refresh keeps progress.

## Visual system

Near-black/charcoal ground, slate panels, military olive and muted khaki, amber only for active controls, soft white technical type. Subtle grid background, hairline technical rules, small uppercase mono labels, restrained glow. No gaming aesthetic, no gradient hero.

## Technical notes

- One route: `src/routes/index.tsx` (replaces the placeholder), with its own SEO head.
- Components: `RZRViewer`, `ModeSelector`, `VehiclePart`, `Hotspot`, `PartsSidebar`, `TrainingModal`, `ProgressIndicator`, `ResetVehicleButton`, plus a `DisassemblyCoach`.
- Single source of truth in `src/data/camoComponents.ts`: id, number, name, status, layer image, hotspot `%` position, installed transform, detached transform, video URL, removal steps, difficulty, est. time. Adding a sixth part is a data edit.
- Angle frames in `src/data/viewAngles.ts` with an `available` flag driving the disabled angle buttons.
- State in a single reducer hook (`useTrainingState`) — mode, angle, zoom/pan, per-part status, completion, coach dismissal — with localStorage persistence for completion + coach only.
- Framer Motion for springs/stagger/crossfade, Lucide for icons, Tailwind v4 tokens added to `src/styles.css` (tactical palette, no hardcoded colour classes).
- All four uploads are registered as CDN assets and imported as pointers, kept in a small `assets` map so replacement photography is a one-line swap.
