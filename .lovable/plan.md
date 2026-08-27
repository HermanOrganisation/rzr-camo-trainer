# MRZR Armadillo Component Catalog Update

## Goal
Replace the current 5 generic "RZR camouflage cover" components with the real MRZR Armadillo component list and part numbers you provided. Keep the interactive 360°/disassembly viewer working for the 5 front-facing parts that align with the existing front-camo photograph; list the remaining components as catalog-only until their photos are uploaded.

## What will change

### 1. Data model (`src/data/rzrTraining.ts`)
- Normalize the pasted list into 42 catalog entries, including duplicate part numbers and the two bare `MRZR` lines.
- Add a `partNumber` field to every component.
- Make the visual overlay fields (`region`, `hotspot`, `detached`, `layer`) optional so components without photography can still exist in the catalog.
- Map the existing 5 crop/hotspot sets to the 5 visible front parts:
  - **Hood Cover-MRZR** `9001-0413-US` → front hood region
  - **Front Door Cover Left-MRZR** `9001-0430-US` → left front panel region
  - **Front Door Cover Right -MRZR** `9001-0408-US` → right front panel region
  - **Front Roof Cover-MRZR** `9001-0403-US` → roof/windshield region
  - **Rear Roof Cover-MRZR** `9001-0404-US` → rear cargo/engine region
- Use generic placeholder removal steps for catalog-only entries.

### 2. Sidebar (`src/components/rzr/PartsSidebar.tsx`)
- Display the real component name and part number.
- Visually distinguish interactive (photo-backed) components from catalog-only entries.

### 3. Training modal (`src/components/rzr/TrainingModal.tsx`)
- Add a **PART NO.** stat next to Est. Time / Difficulty / Status.

### 4. Interactive viewer (`src/components/rzr/RZRViewer.tsx`)
- Only render hotspots, vehicle parts, silhouettes, and leader lines for components that have `region` data. This prevents 40+ overlapping markers on the single front photo.

### 5. State persistence (`src/hooks/useTrainingState.ts`)
- Bump the localStorage key to `rzr-camo-training-v2` so the old 5-component progress cache does not conflict with the new IDs.

## Cleaned catalog (how it will be stored)

| Code | Component | Part Number |
|------|-----------|-------------|
| 01 | Cargo Tailgate Cover-MRZR | 9001-0405-US |
| 02 | Front Cargo Cover-MRZR | 9001-0406-US |
| 03 | Cargo Floor Concealment Cover-MRZR | 9001-0407-US |
| 04 | Mesh Cargo Cover-MRZR | 9001-0412-US |
| 05 | Windshield Mesh-MRZR | 9001-0399-US |
| 06 | Cargo Tailgate Cover Adapter L-MRZR | 9001-0411-US |
| 07 | Front Wheel Pocket-MRZR | 9001-0414-US |
| 08 | Cargo Tailgate Cover Adapter S-MRZR | 9001-0410-US |
| 09 | Step Cover R-MRZR | 9001-0398-US |
| 10 | Step Cover L-MRZR | 9001-0427-US |
| 11 | Windshield Cover-MRZR | 9001-0401-US |
| 12 | Bedside Cover R-MRZR | 9001-0428-US |
| 13 | Bedside Cover L-MRZR | 9001-0400-US |
| 14 | Rear Roof Cover-MRZR | 9001-0404-US |
| 15 | Hood Cover-MRZR | 9001-0413-US |
| 16 | TVC100 Patch-Armadillo L Size | 9002-0149-0002-0005-US |
| 17 | Rear Door Cover Right -MRZR | 9001-0409-US |
| 18 | Rear Door Cover Right -MRZR | 9001-0431-US |
| 19 | Mid Pole Cover R-MRZR | 9001-0429-US |
| 20 | Mid Pole Cover L-MRZR | 9001-0402-US |
| 21 | Front Roof Cover-MRZR | 9001-0403-US |
| 22 | Front Door Cover Right -MRZR | 9001-0408-US |
| 23 | Front Door Cover Left-MRZR | 9001-0430-US |
| 24 | Front Wheel Case Right-MRZR | 9001-0422-US |
| 25 | Front Wheel Case Left-MRZR | 9001-0426-US |
| 26 | Front Wheel Rear Side Adapter-MRZR | 9001-0415-US |
| 27 | Left Front Wheel Structure-MRZR | 9001-0416-US |
| 28 | Right Front Wheel Infrastructure-MRZR | 9001-0417-US |
| 29 | Front Wheel Mesh Cover LEFT-MRZR | 9001-0418-US |
| 30 | Front Wheel Mesh Cover RIGHT-MRZR | 9001-0419-US |
| 31 | Front Wheel Back Pocket-MRZR | 9001-0425-US |
| 32 | Rear Comb-MRZR | 9001-0397-US |
| 33 | Side Thermal Comb-MRZR | 9001-0432-US |
| 34 | Front Wheel Thermal Comb-MRZR | 9001-0433-US |
| 35 | Rear Wheel Thermal Comb-MRZR | 9001-0438-US |
| 36 | Rear Wheel Thermal Comb-MRZR | 9001-0439-US |
| 37 | MRZR | 9007-1017 |
| 38 | MRZR | 9007-1205-US |
| 39 | Right Front Wheel -MRZR | 9001-0420-US |
| 40 | Left Front Wheel -MRZR | 9001-0421-US |
| 41 | Armadillo Combs Kit-MRZR | 9001-0424-US |
| 42 | Armadillo Patch Kit-MRZR | 9001-0423-US |

Total: 42 catalog entries. 5 of them will be interactive on the current front-camo photo.

## Out of scope
- Uploading new component photography. When photos are added later, any component can be given `region`/`hotspot`/`detached` data and it will automatically become interactive.
- "Spectral W/D" columns — not added per your note.
