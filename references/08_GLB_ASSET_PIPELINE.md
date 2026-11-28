# 08 — GLB Asset Pipeline & Ricks Clips Visual Polish

## 1. Where to Put Free CC0 `.glb` Models
Drop your downloaded `.glb` files (from Kenney.nl, Quaternius, Poly Pizza, or Grab3D) into `code/public/models/`:

```text
code/public/models/
├── cars/        # e.g., sedan.glb, police_car.glb, truck.glb
├── trees/       # e.g., oak_tree.glb, pine_tree.glb, bush.glb
├── buildings/   # e.g., house_01.glb, shop_corner.glb, apartment.glb
└── props/       # e.g., bench.glb, streetlight.glb, desk.glb, hydrant.glb
```

## 2. How `<GlbProp />` Fixes Scale & Floating Bugs
Raw `.glb` files from different websites use wildly different units (some export in centimeters, making a car 400 meters wide; others center the origin in the middle of the mesh, sinking half the car underground).

`<GlbProp />` solves this automatically:
- **`targetHeight` or `targetLength`:** Pass the desired real-world size in meters (relative to a `1.7m` character), and `<GlbProp />` scales the model uniformly while preserving proportions.
- **`ground={true}` (default):** Automatically shifts the mesh vertically so its lowest vertex sits at `Y = 0.0`.
- **`stylizeMaterials={true}` (default):** Adjusts `roughness` (`>= 0.65`) and `envMapIntensity` so low-poly `.glb` models look like rich, matte miniature sets instead of shiny plastic.

## 3. Recommended Real-World Scale Reference (Character = 1.7m)
Use these dimensions in `set.tsx` so every scene feels consistent:
- **2D Stick Figure Character:** `1.7m` tall
- **Sedan / Compact Car:** `targetLength={4.2}`
- **SUV / Delivery Van:** `targetLength={4.8}`
- **1-Story House / Shop:** `targetHeight={4.2}`
- **2-Story Townhouse:** `targetHeight={7.5}`
- **Street Tree:** `targetHeight={5.0}` to `6.5`
- **Park Bench:** `targetHeight={0.85}`
- **Streetlight:** `targetHeight={4.5}`

## 4. Example `set.tsx` Using `.glb` Models + 2.5D Characters
```tsx
import React from 'react';
import { GlbProp } from '../../engine/kits/glb/GlbProp';
import { CharacterRig } from '../../engine/chars/rig';

export const VideoSet: React.FC = () => {
  return (
    <group>
      {/* Asphalt Road & Sidewalk Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#3b3f46" roughness={0.9} />
      </mesh>

      {/* Pre-made .glb Buildings & Trees in Background */}
      <GlbProp
        src="models/buildings/shop_corner.glb"
        position={[-6, 0, -8]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={5.5}
      />
      <GlbProp
        src="models/trees/oak_tree.glb"
        position={[5.5, 0, -6]}
        targetHeight={5.8}
      />

      {/* Pre-made .glb Car on the Street */}
      <GlbProp
        src="models/cars/sedan.glb"
        position={[2.2, 0, -2.5]}
        rotation={[0, -Math.PI / 2, 0]}
        targetLength={4.2}
      />

      {/* 2D Stick Figure Characters in Foreground */}
      <CharacterRig id="rick" position={[-1.2, 0, 0]} />
      <CharacterRig id="buddy" position={[1.0, 0, 0.2]} />
    </group>
  );
};
```
