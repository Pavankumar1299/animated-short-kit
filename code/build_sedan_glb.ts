// Generates a detailed, Blender-compatible .glb sedan model (open windshields, interior steering wheel & seats,
// metallic rims, chrome grille/bumpers, headlights & taillights) at code/public/models/sedan.glb.
import * as THREE from 'three';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as fs from 'fs';
import * as path from 'path';

// Polyfill FileReader for Node GLTFExporter binary mode
(globalThis as any).FileReader = class {
  result: ArrayBuffer | null = null;
  onloadend: (() => void) | null = null;
  readAsArrayBuffer(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

const root = new THREE.Group();
root.name = 'Sedan';

const paintMat = new THREE.MeshStandardMaterial({name: 'Paint', color: '#c8241e', roughness: 0.35, metalness: 0.15});
const roofMat = new THREE.MeshStandardMaterial({name: 'Roof', color: '#f6f2e8', roughness: 0.4, metalness: 0.08});
const darkMat = new THREE.MeshStandardMaterial({name: 'DarkTrim', color: '#1e1c24', roughness: 0.75, metalness: 0.1});
const chromeMat = new THREE.MeshStandardMaterial({name: 'Chrome', color: '#d8dee6', roughness: 0.22, metalness: 0.85});
const rimMat = new THREE.MeshStandardMaterial({name: 'Rim', color: '#c6cdd6', roughness: 0.25, metalness: 0.8});
const glassMat = new THREE.MeshStandardMaterial({
  name: 'Glass', color: '#9ecae6', transparent: true, opacity: 0.28, roughness: 0.1, metalness: 0.2, side: THREE.DoubleSide
});
const seatMat = new THREE.MeshStandardMaterial({name: 'Seat', color: '#4a3428', roughness: 0.85});
const lampMat = new THREE.MeshStandardMaterial({name: 'Headlight', color: '#fff8dc', emissive: '#ffe89c', emissiveIntensity: 0.8});
const tailMat = new THREE.MeshStandardMaterial({name: 'Taillight', color: '#e62222', emissive: '#b01010', emissiveIntensity: 0.7});

const addBox = (parent: THREE.Object3D, mat: THREE.Material, size: [number, number, number], pos: [number, number, number], rot: [number, number, number] = [0, 0, 0]) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  parent.add(m);
  return m;
};

// 1. Lower Chassis & Fenders (faces +x)
addBox(root, paintMat, [4.15, 0.48, 1.62], [0, 0.62, 0]);           // Main lower body
addBox(root, paintMat, [1.28, 0.22, 1.56], [1.38, 0.92, 0]);        // Sloped front hood
addBox(root, paintMat, [0.95, 0.18, 1.56], [-1.52, 0.92, 0]);       // Rear trunk deck
addBox(root, darkMat, [3.9, 0.08, 1.68], [0, 0.36, 0]);             // Rocker trim / frame

// 2. Two-Tone Roof & Open-Window Cabin Pillars
addBox(root, roofMat, [1.82, 0.09, 1.48], [-0.28, 1.64, 0]);        // Roof cap
addBox(root, roofMat, [0.08, 0.68, 0.08], [0.68, 1.32, 0.7], [0, 0, 0.36]);   // Front A-pillar L
addBox(root, roofMat, [0.08, 0.68, 0.08], [0.68, 1.32, -0.7], [0, 0, 0.36]);  // Front A-pillar R
addBox(root, roofMat, [0.09, 0.62, 0.08], [-0.22, 1.35, 0.7]);                // Center B-pillar L
addBox(root, roofMat, [0.09, 0.62, 0.08], [-0.22, 1.35, -0.7]);               // Center B-pillar R
addBox(root, roofMat, [0.1, 0.66, 0.08], [-1.18, 1.32, 0.7], [0, 0, -0.28]);  // Rear C-pillar L
addBox(root, roofMat, [0.1, 0.66, 0.08], [-1.18, 1.32, -0.7], [0, 0, -0.28]); // Rear C-pillar R

// Front & Rear Windshields (semi-transparent glass so interior & driver are clearly visible!)
const fGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 0.64), glassMat);
fGlass.position.set(0.66, 1.33, 0);
fGlass.rotation.set(0, Math.PI / 2, 0);
fGlass.rotateX(-0.36);
root.add(fGlass);

const rGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 0.62), glassMat);
rGlass.position.set(-1.16, 1.33, 0);
rGlass.rotation.set(0, -Math.PI / 2, 0);
rGlass.rotateX(-0.28);
root.add(rGlass);

// 3. Interior: Dashboard, Steering Wheel & Seats
addBox(root, darkMat, [0.35, 0.32, 1.36], [0.55, 0.98, 0]);         // Dashboard
addBox(root, seatMat, [0.46, 0.56, 0.52], [-0.28, 0.92, -0.34]);    // Driver seat back
addBox(root, seatMat, [0.46, 0.56, 0.52], [-0.28, 0.92, 0.34]);     // Passenger seat back
const steerWheel = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.024, 8, 20), darkMat);
steerWheel.position.set(0.32, 1.14, -0.34);
steerWheel.rotation.set(0, Math.PI / 2, 0);
steerWheel.rotateX(0.35);
root.add(steerWheel);

// 4. Chrome Bumpers, Front Grille, Headlights & Taillights
addBox(root, chromeMat, [0.12, 0.12, 1.72], [2.12, 0.44, 0]);       // Front bumper
addBox(root, chromeMat, [0.12, 0.12, 1.72], [-2.12, 0.44, 0]);      // Rear bumper
addBox(root, chromeMat, [0.06, 0.28, 0.72], [2.08, 0.72, 0]);       // Front grille frame
addBox(root, darkMat, [0.07, 0.22, 0.64], [2.09, 0.72, 0]);         // Grille slats
for (const z of [-0.56, 0.56]) {
  const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16), lampMat);
  hl.rotation.z = Math.PI / 2;
  hl.position.set(2.07, 0.78, z);
  root.add(hl);

  addBox(root, tailMat, [0.06, 0.14, 0.22], [-2.08, 0.76, z]);     // Red taillights
}

// 5. 4 Detailed Wheels (Wheel_FL, Wheel_FR, Wheel_RL, Wheel_RR) with rubber tire + metallic 5-spoke rim
const wheelSpecs: [string, number, number][] = [
  ['Wheel_FL', 1.32, 0.84],
  ['Wheel_FR', 1.32, -0.84],
  ['Wheel_RL', -1.3, 0.84],
  ['Wheel_RR', -1.3, -0.84]
];
for (const [name, wx, wz] of wheelSpecs) {
  const wg = new THREE.Group();
  wg.name = name;
  wg.position.set(wx, 0.36, wz);

  const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 24), darkMat);
  tire.rotation.x = Math.PI / 2;
  wg.add(tire);

  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.25, 18), rimMat);
  rim.rotation.x = Math.PI / 2;
  wg.add(rim);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.27, 14), chromeMat);
  cap.rotation.x = Math.PI / 2;
  wg.add(cap);

  for (let s = 0; s < 5; s++) {
    const a = (s * Math.PI * 2) / 5;
    addBox(wg, darkMat, [0.18, 0.035, 0.255], [Math.cos(a) * 0.11, Math.sin(a) * 0.11, 0], [0, 0, a]);
  }
  root.add(wg);
}

const outDir = path.resolve(process.cwd(), 'public/models');
fs.mkdirSync(outDir, {recursive: true});
const outPath = path.join(outDir, 'sedan.glb');

const exporter = new GLTFExporter();
exporter.parse(
  root,
  (result) => {
    const buf = Buffer.from(result as ArrayBuffer);
    fs.writeFileSync(outPath, buf);
    console.log(`Generated Blender-compatible GLB: ${outPath} (${buf.length} bytes)`);
  },
  (err) => {
    console.error('GLTFExporter error:', err);
    process.exit(1);
  },
  {binary: true}
);
