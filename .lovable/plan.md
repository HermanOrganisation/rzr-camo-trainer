# MRZR Interactive Anatomy

A new, deliberately simple training page replaces the current home experience:
rotate the vehicle, click a numbered hotspot (or an index card), watch the training video.

## Layout

- Header: "MRZR INTERACTIVE ANATOMY" / "Interactive Product & Training Guide" plus the instruction line
  "Rotate the vehicle and select a numbered hotspot to view the training video."
- Desktop-first two-column body: large vehicle viewer on the left/center, scrollable ANATOMY INDEX on the right.
  On narrow screens the index stacks below the viewer.
- Palette: charcoal, dark olive, khaki, warm gray, off-white — reusing the existing tactical tokens,
  minus the camouflage-patterned UI decoration. No dashboards, no progress bars.

## Vehicle viewer

- Eight view slots: FRONT, FRONT LEFT, LEFT, REAR LEFT, REAR, REAR RIGHT, RIGHT, FRONT RIGHT.
- The project currently has three photographs, so each missing view falls back to the nearest
  available frame and its label shows a quiet "NO ASSET" tag. Dropping in the real photos later is a
  one-line data edit per view.
- Rotation via mouse drag, touch drag, left/right arrow keys, on-image arrow buttons, and
  FRONT / LEFT / REAR / RIGHT quick buttons. Cross-fade between frames.
- No zoom/pan, no disassembly, no exploded view, no draggable parts.

## Numbered hotspots

- Small circular high-contrast markers (01–48) drawn from data, positioned per view in percentages.
- Subtle pulse on hover, stronger ring when selected. A hotspot only renders on views where it has coordinates.
- Click: select the hotspot, highlight and auto-scroll the matching index card, open the video modal.
- I place approximate starting coordinates for the parts visible in the current photography;
  parts with no coordinates stay index-only until positions are given. All coordinates live in the data file.

## Anatomy index

- Title, search field ("Search by Part Name or P/N") filtering on name and P/N.
- Each card: index number, part thumbnail, part name, "P/N: …", and a "WATCH VIDEO →" affordance.
  The whole card is clickable and performs exactly the same action as the hotspot.
- Thumbnails are blank placeholder frames with the index number until per-part photos are uploaded.
- Selected card is highlighted; selecting from the vehicle scrolls it into view.

## Training video modal

- Centered modal: index number, part name, P/N, embedded Vimeo player, close (X),
  PREVIOUS PART / NEXT PART navigation.
- All 48 entries start with an empty Vimeo URL and show "Training video coming soon."
  Adding a URL to the data entry is all that's needed to make a video live.
- Playback stays on-site via the Vimeo iframe embed; no redirect.

## Data

All 48 entries exactly as supplied (names and P/Ns unchanged, TBD kept as-is) in one content module,
`src/data/anatomyParts.ts`, separate from components:

```ts
{
  id: "front-roof-cover",
  indexNumber: "29",
  name: "Front Roof Cover-MRZR",
  partNumber: "9001-0403-US",
  thumbnail: "",
  vimeoUrl: "",
  hotspots: { front: { x: 50, y: 18 }, left: { x: 56, y: 20 } },
}
```

Editing a name, P/N, thumbnail, Vimeo URL, or hotspot position never touches the visual components.

## Technical notes

- New files: `src/data/anatomyParts.ts` (parts + view definitions), `src/components/anatomy/VehicleViewer.tsx`,
  `AnatomyHotspot.tsx`, `AnatomyIndex.tsx`, `VideoModal.tsx`.
- `src/routes/index.tsx` is rewritten to compose these, with its own head() metadata (title, description, og tags).
- Selected-part state (id + current view) lives in the route component; index auto-scroll uses a ref map.
- The existing training components (`src/components/rzr/*`, `useTrainingState`, asset registry) stay in the
  project unused, as requested, so nothing already built is lost.
