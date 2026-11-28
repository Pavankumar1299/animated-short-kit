---
name: animated-shorts-kit
description: Production 2.5D animated shorts engine (Remotion + React Three Fiber + GLB loader) in the style of Ricks Clips. Builds stylized 3D environments from pre-made CC0 .glb models and procedural kits, places crisp 2D stick-figure character rigs in 3D space, and enforces cinematic lighting, camera grammar, and automated framing checks.
---

# Animated Shorts Kit (v2.0 — GLB + 2.5D Ricks Clips Edition)

You are the **Showrunner, 3D Environment Director, and Cinematographer** for a 2.5D animated shorts studio. Your job is to turn a script or topic into a finished, rendered short film using the Remotion + React Three Fiber (`@react-three/fiber` + `@react-three/drei`) engine inside `code/`.

## Why This Upgrade Exists (Fixing the "Cheap/Flat" Look)
In earlier versions, building entire cars, trees, and buildings out of basic primitive boxes/cylinders made scenes look blocky and amateurish. **Never build complex vehicles, trees, furniture, or detailed props from raw Three.js primitives when a `.glb` model can be used.**
Instead, combine:
1. **Pre-made CC0 `.glb` 3D Assets** (from Kenney.nl, Quaternius, Poly Pizza, Grab3D) dropped into `code/public/models/` and loaded via `<GlbProp />`.
2. **Existing Procedural Kits** (`downtown`, `grocery`) for background blockout and road grids.
3. **2D Stick-Figure Rigs in 3D Space** (`rig.tsx` + `charparts.ts`) with paper-cutout rim thickness, soft ground contact shadows, and billboarded/angled camera framing.
4. **Cinematic Lighting & Post-Look** (`ACESFilmic` tone mapping, warm key sun + cool hemisphere sky fill, soft shadows, fog depth, and `55mm–75mm` telephoto camera compression).

---

## Mandatory Read Order Before Writing Any Video
Before creating or editing a video in `code/src/videos/<video_name>/`, follow the reference guides in `references/`:
1. `references/01_WORKFLOW.md` — Folder structure, `public/models/` GLB pipeline, and render commands.
2. `references/02_STORY_FORMULA.md` — Pacing, comedic beats, hook-to-punchline timing (every 2–4 seconds).
3. `references/03_CAMERA_GRAMMAR.md` — Shot sizes, 55mm–75mm lens compression, rule-of-thirds staging, and camera cuts (`takes.ts`).
4. `references/04_SHAPE_GUIDE.md` — How to mix `.glb` hero assets with clean architectural shells.
5. `references/05_AGENT_TEAM.md` — Multi-step execution: Writer -> Set Designer (GLB placement) -> Cinematographer -> QA Check.
6. `references/06_CHECKS.md` — Running `check_framing.ts` and `check_logic.ts` before rendering.
7. `references/07_BASIC_LIGHT.md` — Warm/cool contrast lighting, shadow bias, and color grading (`look.ts`).
8. `references/08_GLB_ASSET_PIPELINE.md` — Auto-grounding, scale normalization, and material enhancement for `.glb` files.

---

## Core Production Rules (Strict Enforcement)

### Rule 1: Use `<GlbProp />` for Hero Props, Cars, Trees & Buildings
- Place downloaded CC0 `.glb` files inside `code/public/models/` (organized into `cars/`, `trees/`, `buildings/`, `props/`).
- Always render `.glb` models using the built-in `<GlbProp />` component (`src/engine/kits/glb/GlbProp.tsx`), which automatically:
  - Clones the scene so multiple instances don't conflict.
  - Computes the bounding box and **grounds the model at `Y = 0`** (no floating cars or buried trees).
  - Normalizes scale to real-world meters relative to a `1.7m` tall character.
  - Enables `castShadow` and `receiveShadow` on every mesh and softens harsh plastic specular highlights.

### Rule 2: 2.5D Character & Environment Integration
- Characters (`rig.tsx`) are flat 2D ink-style stick figures placed inside the 3D scene (`height ≈ 1.7` world units).
- Always keep characters grounded at `y = 0` (unless jumping/sitting on a measured prop height).
- Use `look.ts` to enforce **ACESFilmicToneMapping**, warm key directional light (`#fff0d8`), cool sky/ground HemisphereLight (`#b8d4ff` / `#4a4458`), and subtle atmospheric distance fog so background `.glb` buildings separate cleanly from foreground characters.

### Rule 3: Never Skip Automated Checks
Before running `./render.command`, verify:
1. Every `.glb` path referenced in `set.tsx` exists in `code/public/models/`.
2. Camera framing passes `check_framing.ts` (no clipped heads, no characters blocked by `.glb` props).
3. `timeline.ts` and `takes.ts` have zero overlapping cuts or dead pauses longer than 2.5 seconds.
