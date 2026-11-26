# Animated Shorts Kit — Iterative Improvement Log (`IMPROVE.md`)

> Living audit & improvement tracker for `03_shopping_cart`, `04_speed_car`, `05_postit_notes`, and the shared rendering pipeline.  
> Every round diagnoses what is wrong, fixes it across **all** videos + engine, benchmarks render speed & visual quality, and logs the next targets.

---

## MANDATORY PRE-PRODUCTION CHECKLIST (Before Generating Any Frame / Video)
Never write staging/camera code until every beat passes this cross-check:
1. **Location & Environment**: Where does this beat *actually* happen in the story?
   - Scientist / Inventor &rarr; **Inside a real Lab** (lab walls, chemical shelves, chalkboard, lab table), NOT a street sidewalk.
   - Choir / Church &rarr; **Inside a Church** (arched stained-glass windows, wooden pews, choir risers, hymnbook), NOT a hat store.
   - Store / Customers &rarr; **Inside the Grocery Store** (checkered floor, stocked aisles `z = -8..2`), NOT outside on the sidewalk.
   - Street / Car Crash &rarr; **On the Street & Curb** with road, skid marks, tree, and sidewalk.
2. **Cast Count & Who Talks to Whom**:
   - List exact character count per beat, distinct `who` models, who has `talk: true` (speaking/mocking), who has `sweat: true` / reaction expression (`shock`, `sad`, `grin`), and explicit `gaze` targets (at the prop or scene partner, not blankly at the camera).
3. **Props & Placement**:
   - Every prop's `[x, y, z]` bounding box must be registered in `solids.ts` and separated from character paths so nobody stands inside furniture.
4. **Camera Angles**:
   - Use 3D depth angles (`az ±25..65`) and multi-key Ricks Clips moves (`arc`, `pullpush`, `dolly`), avoiding flat wall-facing shots and foreground occluders (`lamps`, `cars`, `shelves`).

---

## Round 5 Blueprint: True Indoor Sets (`05_postit_notes` Lab + Church, `03_shopping_cart` Store Interior)
- **`05_postit_notes`**:
  - `lab` & `mockery` (`0 - 10.6s`): **Indoor Chemistry Lab** at `x = -60, z = 0` (3 walls, tiled floor, chemical bottle shelves, chalkboard, hanging lamp, 4-legged lab table). Cast: `magee` (sweat, inspecting beaker) + `banker` (talk: true, mocking).
  - `choir` & `eureka` (`10.6 - 25.2s`): **Indoor Church Sanctuary** at `x = 60, z = 0` (wood floor, stone walls, arched stained-glass windows, wooden pews, red choir risers, hymnbook). Cast: `youngman` (Art Fry, sweat, eureka) + `youngwoman` (talk: true) + `grandma`.
  - `success` (`25.2 - 30.0s`): **Office Supply Plaza** at `x = 19, z = 19.5` (4-legged Post-it table + 24 swirling yellow notes). Cast: `magee` + `youngman`.
- **`03_shopping_cart`**:
  - Move `hook`, `refusal`, `revolution` **INSIDE the Grocery Store** (`x = -1.4..1.4, z = -1.5..2.2`, checkered floor between stocked aisles!). Cast: `goldman` (`talk: true`), `shopper` (walking with cart), `shopper2` + `grandma` (`talk: true`), `youngwoman` (walking with full cart).

---

## Ricks Clips Gold Standard (`code/out/sample.mp4` — 59.43s, 720x1280 @ 30fps)
Inspected 8 frames (`sample_0.jpg`..`sample_7.jpg`) of the user's real *Ricks Clips* reference video:

| Element | What `sample.mp4` Does | What We Must Apply (Current + Upcoming Videos) |
|---|---|---|
| **Characters** | Same 2D cut-out style (white egg head, stick limbs, thick ink outlines, hats/badges), **seated inside cars holding steering wheels** & reacting physically. | Keep 2D cut-out rig, use `talk: true`, `sweat: true`, `gaze`, and place characters inside vehicles/rooms interacting with props. |
| **Trees & Nature** | Ridged bark trunk, spreading 3D branches, rich layered leaf clusters, **instanced 3D grass blades** along the roadside. | Replace plain sphere-on-cylinder trees with branching trunks, textured bark, dense foliage, and roadside grass tufts. |
| **Vehicles & Roads** | Detailed cars/trucks with wheels, rims, windshields, **visible interior dashboard/steering wheel**, glowing **headlights & red taillights**, double-yellow road lines, wet/specular reflections. | Add glowing headlights/taillights, road markings, and interior/close-up vehicle framing. |
| **Sky, Clouds & Mood** | **Gradient sky + layered 3D clouds + sunbeams/horizon haze**, shifting from bright sunny day to **dramatic rainy night** with fog & rain streaks. | Replace flat solid `<color attach="background" />` with a **Sky Dome + Layered 3D Clouds + Horizon Glow** component. |
| **In-World Signs** | Bold readable props inside the 3D world (`DAYS SINCE LAST CRASH 7`, `TREE TOWING $ CASH ONLY $`, lit `DON'T HIT THIS TREE` neon arrow). | Add bold CanvasTexture story signs directly in the 3D set for every video. |
| **Camera Variety** | High-angle chase/drone shot down the road (`sample_6`), **1st-person driver POV** through windshield (`sample_7`), driver-window CU (`sample_3`), ultra-low ground-up sky shot (`sample_4`). | Mix high-angle chase (`el: 16..24`), low-angle hero (`el: -4..0`), window CUs, and wide landscape reveals. |
| **Narration Lock** | `59.43s` tight, zero-dead-air pacing, continuous music bed + SFX. | Keep `< 0.15s` pause gaps, `+14%..+16%` neural voice pace, and SFX synced to impacts/reveals. |

---

## Round 6: Applying `sample.mp4` Visual Quality (`SkyClouds` + `04_speed_car` Overhaul)
- [x] Created shared `SkyClouds` component in `code/src/engine/look/SkyClouds.tsx` (sun disc + halo + drifting layered 3D clouds) and mounted it in `Video.tsx`.
- [x] Upgraded `04_speed_car/set.tsx`: branching bark-ridged Oak Tree with 4 spreading limbs & multi-cluster canopy, roadside grass tufts, readable `DAYS SINCE LAST CRASH 7` Canvas2D sign, and steam/leaves FX.
- [x] Verified `gates.ts` (`hard=0, warnings=6`), rendered `preview_04.mp4` (6.8 MB), and inspected extracted frames (`p4_r6_*.jpg`).

---

## Round 1: Initial Audit (2026-11-25)

### What Is Wrong Right Now
1. **Visuals Not in Their Place**:
   - **`05_postit_notes`**: `NotesProp` lab desk was placed at `[0, 0, 7.5]` (`x: -0.9..0.9, z: 7.075..7.925`) right on top of the characters (`z: 7.4..7.6`), causing characters to stand *inside* the desk. Same lab desk stayed in the `choir` and `eureka` shots where a church/choir hymnbook belongs.
   - **`03_shopping_cart`**: In `hook`, `shopper` has `act: 'walk'` while her position `[0.85, 0, 7.4]` and cart `[0.55, 0, 7.4]` never move (moonwalking in place).
   - **`04_speed_car`**: Crash at the tree `[3.5, 0, 7.8]` lacks impact visuals (skid marks, impact smoke/dust puffs, scattered leaves) and the driver never steps out or reacts visibly outside the car.
2. **No Character Activity ("just standing in their place")**:
   - Characters in `03`, `04`, and `05` have static `[x, 0, z]` positions in every shot. Nobody walks across the sidewalk, steps back in shock, approaches to inspect, or interacts dynamically with props.
   - Zero background pedestrians (`bg: true`) walking on the far sidewalk, making the downtown street look empty/lifeless.
3. **Repetitive Cast ("using same chars again and again")**:
   - `05_postit_notes` reused `man`, `goldman`, `youngman` (same 3 characters from `01_example` & `03_shopping_cart`), ignoring the other 17 characters in `charparts.ts` (`banker`, `teacher`, `nurse`, `preacher`, `baker`, `mechanic`, `paperboy`, `grandma`, `youngwoman`, `kid`, `magee`, `rancher`, etc.).
4. **Slow Video Generation ("taking too much time")**:
   - Rendering `preview_05.mp4` (900 frames, 540x960) took **~13+ minutes** (~0.87s/frame) because Remotion ran with `--concurrency=2` and software WebGL (SwiftShader) instead of hardware ANGLE (`--gl=angle`) + `--concurrency=4`, and `Video.tsx` used a heavy `2048x2048` shadow map on every frame.
5. **Visual Quality**:
   - Static lighting/props and lack of dynamic motion cues (floating notes, flying coins, crash smoke/skids, hymnbooks, active pedestrians) make shots feel flat.

---

### Round 1 Action Plan (Apply to Engine + All Videos)
- [x] **Render Speed (`Video.tsx` & `render.bat`)**:
  - Enabled `--gl=angle` (hardware GPU WebGL on Windows) and `--concurrency=4` in `render.bat`.
  - Reduced `Lights` shadow map in `Video.tsx` from `2048x2048` to `1024x1024`.
  - **Benchmark Results**:
    - `05_postit_notes` (900 frames): **227.96s (3m 48s, 0.25s/frame)** vs. **~800s+ (13+ min, 0.89s/frame)** before (**~3.5x speedup**).
    - `04_speed_car` (300 frames): **130.34s (2m 10s, 0.43s/frame)**.
    - `03_shopping_cart` (300 frames): **249.93s (4m 10s, 0.83s/frame)**.
- [x] **`05_postit_notes` Upgrade**:
  - **Cast**: `magee` (Spencer Silver), `banker` (3M boss), `preacher` (Art Fry), `youngwoman` (choir), plus walking background `paperboy`, `nurse`, `baker`.
  - **Motion & Placement**: Moved lab bench / choir podium / display pedestal cleanly behind characters to `z = 6.2` (enforced in `solids.ts`), added walking/pacing locomotion in every shot, and 16 swirling yellow Post-it notes in `success`.
- [x] **`03_shopping_cart` Upgrade**:
  - **Cast**: `goldman`, `shopper`, `shopper2`, `grandma`, `youngwoman` + walking `paperboy` & `baker` on far sidewalk.
  - **Motion & Placement**: Fixed `AUDIO` in `set.tsx`, animated `shopper` & `youngwoman` actually walking across the sidewalk pushing carts (`hold` synced to cart `x`), and animated `shopper2` & `grandma` stepping back in `refusal`.
- [x] **`04_speed_car` Upgrade**:
  - **Cast**: `oldman`, `cop`, `paperboy` + walking `nurse` & `baker` on far sidewalk.
  - **Motion & Visuals**: Added tire `SkidMarks` on asphalt, animated `oldman` & `paperboy` stepping back as the car swerves, `cop` walking briskly toward the wreck in `aftermath`, and flipped `aftermath` camera azimuth (`-18` / `-22`) clear of `car 0`.
- [x] **Verify**: `gates.ts` passed with `hard=0` on all three (`03`, `04`, `05`), and all three previews rendered cleanly.

---

## Round 2: Ricks Clips Reference Comparison (`gc07FGjpTa4`, `7xS87iActkU`, `R-mWVMM-LAs`)
Compared against `references/03_CAMERA_GRAMMAR.md` (which measured `7xS87iActkU` *Perfect Railroads*):
1. **Different Places / Locations per Beat** (`05_postit_notes`):
   - [x] `lab`: `x = -22.5, z = 7.35` (outside `FIVE & DIME` workshop with Lab Bench)
   - [x] `mockery`: `x = 22.4, z = 7.35` (outside `FIRST NATIONAL BANK` — fitting for `banker` 3M boss)
   - [x] `choir` & `eureka`: `x = -26.5, z = 19.5` (across the street at `MEN'S WEAR`, opposite camera direction `az ~ 172`)
   - [x] `success`: `x = 30.0, z = 19.5` (across the street at `INSURANCE` plaza with swirling Post-it storm)
2. **Dynamic Camera Angles & 3-Key Takes (77% moving)**:
   - [x] Upgraded `05_postit_notes/takes.ts` to 2–3 key takes per beat with low-angle `MCU`/`CU` (`el: -2`), fast `pullpush` reveals (`dur: 0.7..0.85`), and `arc` orbits.
3. **Verification & Benchmark**:
   - [x] `gates.ts`: `GATES: PASS  hard=0  waived=0  warnings=0`
   - [x] Render time (`preview_05.mp4`, 900f): **124.97s (2m 5s, 0.139s/frame)** — **6.4x faster** than the initial ~13+ min baseline!

---

## Round 3: Visual Frame Inspection & 3D Depth Upgrade (`05_postit_notes`)
Extracted 6 frames (`2s, 7s, 13s, 20s, 27s, 29s`) from Round 2 `preview_05.mp4` and diagnosed why it still felt flat:
- Solid box props looked like crates instead of furniture, and `az ~ 0..18` camera angles flattened the 3D avenue into a 2D wall.
- **Fixes Applied**:
  - [x] Replaced solid boxes with **4-legged tables** (`LabTable`, `SuccessFinale` table) and **red choir risers** (`ChoirStage`).
  - [x] Switched camera angles to 3D street-perspective (`az ±26..42` / `126..160`) with `magee` looking at the beaker and `youngman` looking at the hymnbook.
  - [x] Re-rendered `preview_05.mp4` (**134.81s / 2m 15s**), `gates.ts`: `hard=0, warnings=1`, and visually verified all 6 extracted frames (`p5_r3_*.jpg`).

---

## Round 4: Honest Ricks Clips Scorecard & Reaction/Prop Upgrade
Audited against `02_STORY_FORMULA.md`, `03_CAMERA_GRAMMAR.md`, and `04_SHAPE_GUIDE.md`:

| Criterion | Before Round 4 | Gap Found | Round 4 Fix |
|---|---|---|---|
| **Character Response** | `4/10` | `rig.tsx` has `talk: true` (viseme lip-sync) & `sweat: true` (nervous sweat drops), **unused in all 3 videos**. No reaction beat cutting to the victim's face. | Added `talk: true` on speaking/mocking characters (`banker`, `goldman`, `shopper2`, `cop`), `sweat: true` on stressed characters (`magee`, `preacher`, `oldman`, `paperboy`), and reaction camera key in `05/mockery`. |
| **Story-Specific Props** | `6/10` | Lab jars/finale lacked in-world sticky-note spread on surrounding objects. | Added yellow Post-it notes stuck onto the lab bench & finale window/pedestal in `05/set.tsx`. |
| **Positioning & Angles** | `7/10` | `03_shopping_cart` still used flatter `az ±15..22` angles. | Upgraded `03_shopping_cart/takes.ts` to 3D street-perspective `az ±32..42` angles. |
| **Render Speed** | `9/10` | **0.139s/frame** (`2m 05s` for 900f) — 6.4x faster than baseline. | Keep ANGLE + `--concurrency=4` + `1024` shadow map. |
