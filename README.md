# RZR Camo Trainer

Create a polished, high-end interactive product training website for an RZR off-road vehicle equipped with a specialized camouflage cover system for hunting.

The website must feel like a professional military/defense product training interface: technical, clean, premium, and highly interactive.

IMPORTANT — USE THE PROVIDED IMAGES

I am uploading 3 reference images of the actual RZR and camouflage system.

These exact uploaded images must be used as the main product visuals.

Do NOT:

- generate a generic RZR

- replace the vehicle with another model

- use stock photography

- create an illustrated approximation

- show an empty placeholder instead of the vehicle

The uploaded RZR must be clearly visible as the large central object of the interface.

The images represent:

1. Front view

2. Front 3/4 view

3. Close-up / isolated camouflage cover component

Use these images to create the interactive inspection and disassembly experience.

---

VISUAL DIRECTION

Create a sophisticated dark tactical UI.

Color palette:

- Near-black / charcoal background

- Slate gray panels

- Military olive green

- Muted khaki

- Subtle amber highlights for active controls

- Soft white technical typography

Style inspiration:

- defense industry equipment interfaces

- military training systems

- aerospace product configurators

- technical CAD inspection interfaces

- premium automotive configurators

Avoid a gaming aesthetic.

The interface should feel like an actual professional product training and maintenance system.

Use:

- subtle grid backgrounds

- thin technical lines

- small technical labels

- restrained glow effects

- smooth transitions

- sophisticated micro-interactions

---

MAIN SCREEN

Create a full-screen application.

Top navigation bar.

Left side:

RZR CAMOUFLAGE SYSTEM

Subtitle:

Interactive Product Training

Center:

training progress indicator such as:

TRAINING PROGRESS 35%

Right:

HELP button.

---

MAIN PRODUCT VIEWER

The RZR should occupy approximately 60–70% of the main visual area.

Do not make the vehicle small.

Display the uploaded RZR image prominently against a dark neutral background.

Add a subtle ground shadow underneath the vehicle so it feels visually grounded.

The vehicle should remain sharp and high resolution.

Allow:

- mouse/touch drag

- zoom

- pan

- reset view

---

MODE SELECTOR

Place a highly visible segmented control above the vehicle:

360° INSPECTION MODE

DISASSEMBLY MODE

The currently selected mode should have an amber/olive active indicator.

Switching modes should animate smoothly.

---

360° INSPECTION MODE

Because the uploaded assets contain several viewpoints rather than a real 3D model, create a simulated 360° product viewer.

Allow the user to:

- drag horizontally

- swipe on tablet

- use left/right navigation arrows

Transition smoothly between available uploaded views.

Add angle controls underneath:

FRONT

LEFT

RIGHT

REAR

When an actual image for a requested angle is unavailable, do NOT invent a completely different vehicle.

Use the closest available reference view and clearly structure the code so additional angle images can easily be added later.

Show a small technical indicator:

VIEW ANGLE: FRONT — 000°

---

INTERACTIVE HOTSPOTS

Place animated hotspots directly over camouflage components.

Use small amber/olive circular markers with a subtle pulse animation.

Hotspots:

01 — FRONT GRILLE / HOOD COVER

02 — LEFT CAMO PANEL

03 — RIGHT CAMO PANEL

04 — ROOF / WINDSHIELD NETTING

05 — REAR CARGO / ENGINE COVER

Hotspots must stay visually attached to their component when the viewer scales responsively.

Hovering over a hotspot should show a small tooltip with:

- component number

- component name

- status

- “VIEW TRAINING”

Clicking opens the component training modal.

---

DISASSEMBLY MODE

This is the most important interactive feature.

When DISASSEMBLY MODE is selected, transform the RZR viewer into an interactive exploded-view training interface.

The camouflage covers must behave like separate removable layers.

Use the provided images as the visual source and simulate component separation using layered image masks / transparent overlays / positioned image elements.

Where exact independent component imagery is unavailable, use carefully cropped/masked portions of the provided images rather than inventing unrelated camouflage parts.

---

DETACHABLE COMPONENTS

The following parts should be interactive:

01 FRONT GRILLE / HOOD CAMO COVER

Click or drag the camouflage cover.

Animate it away from the RZR toward the left side.

Keep the RZR chassis visible underneath.

Draw a thin technical leader line from the original mounting position to the detached component.

---

02 LEFT CAMO PANEL

Allow the left camouflage wheel/side cover to detach.

Animation:

vehicle → outward → slightly left → parked beside vehicle.

---

03 RIGHT CAMO PANEL

Same behavior, mirrored toward the right.

---

04 ROOF / WINDSHIELD CAMO NETTING

Detach upward.

The component should float above the vehicle as part of an exploded diagram.

---

05 REAR CARGO / ENGINE COVER

Move rearward/right depending on the active vehicle angle.

---

COMPONENT MOVEMENT

Support BOTH interactions:

CLICK TO DETACH

and

DRAG TO REMOVE

When dragging begins:

- slightly scale the selected component

- add a subtle amber outline

- show its movement direction

- smoothly detach it once the drag threshold is reached

Use spring/eased animation.

Detached components should remain visible around the vehicle.

Do not simply make them disappear.

The result should resemble a professional exploded-view technical diagram.

---

IMPORTANT: UNDERLYING VEHICLE

When a camouflage panel is detached, the user should visually understand that it has been removed from the vehicle.

If the exact mechanical structure behind a panel is not visible in the uploaded photography, do NOT hallucinate detailed mechanical components.

Instead use the visible underlying vehicle/frame from the supplied images wherever possible and use a subtle dark technical silhouette/masked region for areas that cannot be accurately reconstructed.

Accuracy is more important than inventing details.

---

COMPONENT SIDEBAR

Create a vertical sidebar on the left or right.

Title:

CAMOUFLAGE COMPONENTS

Rows:

01 — Front Grille / Hood

02 — Left Panel

03 — Right Panel

04 — Roof / Windshield

05 — Rear Cargo / Engine

Each component has a status badge.

Installed:

● INSTALLED

Detached:

○ DETACHED

Currently selected:

ACTIVE

Clicking a component in the sidebar should highlight the corresponding part on the RZR.

In Disassembly Mode, clicking the row can also detach/reattach the part.

---

RESET VEHICLE

Add a prominent button:

↻ RESET VEHICLE

When clicked:

All detached components animate smoothly back to their original positions.

All component states change back to:

INSTALLED

Do not reload the webpage.

---

TRAINING VIDEO MODAL

Clicking:

- a hotspot

- a component in the sidebar

- or a detached component

should provide access to an instructional training modal.

Design a large premium modal.

Header example:

COMPONENT 02

RIGHT FRONT CAMOUFLAGE PANEL

Include:

TRAINING VIDEO

Large 16:9 video placeholder.

Use a dark player UI with a large centered play button.

Below the video:

REMOVAL PROCEDURE

Example steps:

- Release the upper attachment points.

- Disconnect the side retention straps.

- Support the panel while removing the lower attachment.

- Pull the camouflage panel away from the vehicle.

- Inspect attachment points before storage or reinstallation.

Also include:

EST. TIME: 02:30

DIFFICULTY: BASIC

STATUS: NOT COMPLETED

Button:

MARK TRAINING COMPLETE

Closing the modal returns to exactly the previous viewer state.

---

TRAINING PROGRESS

Training completion should update the top progress indicator.

Example:

2 / 5 COMPONENTS COMPLETE

40%

Use a thin animated progress bar.

Store completion state locally so refreshing the page does not immediately erase training progress.

---

DISASSEMBLY GUIDANCE

When entering Disassembly Mode for the first time, show a small contextual instruction:

DISASSEMBLY MODE ACTIVE

“Drag a highlighted camouflage component away from the vehicle or select a component from the parts panel.”

Buttons:

GOT IT

DON'T SHOW AGAIN

---

MICRO-INTERACTIONS

Use polished animation throughout.

Hotspots:

slow pulse.

Hovering over component:

soft olive/amber outline.

Selecting:

brief technical glow.

Detaching:

smooth 400–700 ms movement.

Reset:

components return sequentially with approximately 80 ms stagger.

Mode change:

smooth crossfade.

Modal:

fade + slight scale.

Avoid excessive animation.

---

RESPONSIVE DESIGN

Optimize primarily for:

Desktop

1920×1080 and similar.

Vehicle should dominate the center.

Sidebar visible.

Tablet

Landscape tablet layout.

Sidebar can collapse into a component drawer.

Touch dragging must work.

Hotspots must have sufficiently large touch targets.

---

TECHNICAL IMPLEMENTATION

Build the site as a functional React application.

Preferred stack:

- React

- TypeScript

- Tailwind CSS

- Framer Motion

- Lucide icons

Create reusable components such as:

"RZRViewer"

"ModeSelector"

"VehiclePart"

"Hotspot"

"PartsSidebar"

"TrainingModal"

"ProgressIndicator"

"ResetVehicleButton"

Create a clear data structure for components so that additional camouflage parts can easily be added later.

Example conceptual structure:

component ID

component name

status

image/mask

hotspot position

installed position

detached position

training video URL

training steps

completion status

---

IMAGE LAYER ARCHITECTURE

Treat the supplied RZR photography as the visual foundation.

Build the viewer in layers:

Layer 0: vehicle/base photograph

Layer 1: removable front cover

Layer 2: left camouflage cover

Layer 3: right camouflage cover

Layer 4: windshield/roof netting

Layer 5: rear cover

Layer 6: hotspots

Layer 7: technical annotations

Use absolute positioning inside a responsive aspect-ratio container.

Positions should use percentages rather than fixed pixels so overlays remain aligned when resizing.

---

IMPORTANT FUNCTIONAL REQUIREMENT

Do NOT create a website where the buttons only look interactive.

The following interactions must actually work:

- Inspection / Disassembly mode switching

- Image angle switching

- Dragging/swiping the viewer

- Hotspot clicking

- Modal opening/closing

- Component selection

- Component detach

- Component reattach

- Drag-to-remove behavior

- Sidebar status updates

- Reset Vehicle

- Training completion

- Progress update

- Responsive tablet behavior

---

ASSET FALLBACK RULE

The supplied images are mandatory.

If automated image masking cannot perfectly isolate all removable parts, still build the full functional interface.

Use the uploaded close-up component image for a detached component where appropriate.

For other components, create temporary cropped image layers from the supplied photographs and clearly organize them as replaceable assets.

Never replace the uploaded RZR with a generic placeholder.

The first rendered page must visibly show the uploaded RZR.

---

FINAL VISUAL GOAL

The final experience should look like a combination of:

military equipment training software + premium automotive configurator + interactive exploded technical manual.

The RZR and its camouflage system are the hero.

Keep the UI sophisticated and restrained.

The user should immediately understand:

INSPECT → SELECT COMPONENT → DETACH → LEARN → RESET

Prioritize functional interaction, accurate use of the supplied images, and a visually impressive professional training experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2ef7f8fa-ae4c-47d9-a782-23770ec1b550).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

### Images not loading locally

Product photography is stored on Lovable's asset CDN, not committed to this
repo — `src/assets/**/*.png.asset.json` are pointer files, not images. The
dev server proxies them at `/__l5e/assets-v1/*`, but only when the
`LOVABLE_PREVIEW_HOST` environment variable is set to this project's preview
host:

```
LOVABLE_PREVIEW_HOST=id-preview--2ef7f8fa-ae4c-47d9-a782-23770ec1b550.lovable.app
```

Set it once as a permanent environment variable on your machine (e.g. on
Windows: `setx LOVABLE_PREVIEW_HOST "id-preview--2ef7f8fa-ae4c-47d9-a782-23770ec1b550.lovable.app"`,
then open a new terminal) so every local `npm run dev` picks it up. Without
it, product images silently 404 and the UI shows "NO ASSET".
