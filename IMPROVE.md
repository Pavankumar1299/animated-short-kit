# Animated Shorts Kit — Iterative Improvement Log (`IMPROVE.md`)

> Living audit & improvement tracker for `03_shopping_cart`, `04_speed_car`, `05_postit_notes`, and the shared rendering pipeline.  
> Every round diagnoses what is wrong, fixes it across **all** videos + engine, benchmarks render speed & visual quality, and logs the next targets.

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
