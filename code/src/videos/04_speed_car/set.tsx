// 3D Set for 04_speed_car: Branching Oak Tree + Roadside Grass + In-World Crash Sign + Skid Marks + Steam FX
import React from 'react';
import * as THREE from 'three';
import type {Tod} from '../../engine/look/look';
import {Town, StreetClock} from '../../engine/kits/downtown/town';
import {Car} from '../../engine/kits/downtown/street';
import type {Stage} from './stage';

export const AUDIO: {voice: string | null; bed: string | null} = {
  voice: '04_speed_car/voice.wav',
  bed: '04_speed_car/bed.wav'
};
export const useSetData = () => null;

const circ = new THREE.CircleGeometry(1, 24);
const mBlob = new THREE.MeshBasicMaterial({color: '#000000', transparent: true, opacity: 0.35, depthWrite: false});

/** Canvas2D Sign Texture: DAYS SINCE LAST CRASH 7 (inspired by sample.mp4) */
function useCrashSignTex() {
  return React.useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 320;
    const g = c.getContext('2d')!;
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, 256, 320);
    g.strokeStyle = '#241726';
    g.lineWidth = 10;
    g.strokeRect(5, 5, 246, 310);
    g.fillStyle = '#c8241e';
    g.fillRect(14, 14, 228, 92);
    g.fillStyle = '#ffffff';
    g.font = 'bold 28px Arial, sans-serif';
    g.textAlign = 'center';
    g.fillText('DAYS SINCE', 128, 52);
    g.fillText('LAST CRASH', 128, 88);
    g.fillStyle = '#1e1c24';
    g.fillRect(28, 122, 200, 178);
    g.fillStyle = '#ffffff';
    g.font = 'bold 148px Impact, Arial Black, sans-serif';
    g.fillText('7', 128, 266);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

const CrashSign: React.FC<{p: [number, number, number]}> = ({p}) => {
  const tex = useCrashSignTex();
  return (
    <group position={p} rotation={[0, -0.35, 0]}>
      <mesh position={[-0.22, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.5, 8]} />
        <meshToonMaterial color="#707880" />
      </mesh>
      <mesh position={[0.22, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.5, 8]} />
        <meshToonMaterial color="#707880" />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.62, 0.78, 0.04]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </group>
  );
};

/** Grass Patch around the tree base */
const GrassTufts: React.FC<{p: [number, number, number]}> = ({p}) => (
  <group position={p}>
    {Array.from({length: 28}, (_, i) => {
      const a = i * 2.39996;
      const r = 0.45 + (i % 7) * 0.24;
      const gx = Math.cos(a) * r;
      const gz = Math.sin(a) * r * 0.7;
      const h = 0.16 + (i % 4) * 0.06;
      return (
        <mesh key={i} position={[gx, h / 2, gz]} rotation={[0.15 * Math.sin(i), a, 0.18 * Math.cos(i)]}>
          <coneGeometry args={[0.045, h, 4]} />
          <meshToonMaterial color={i % 2 === 0 ? '#55b046' : '#3d8e36'} />
        </mesh>
      );
    })}
  </group>
);

/** Branching, Bark-Ridged 100-Year-Old Oak Tree at [3.5, 0, 7.8] */
const Tree: React.FC<{p: [number, number, number]; f: number}> = ({p, f}) => {
  const isCrashed = f >= 150;
  const crashT = Math.max(0, (f - 150) / 30);

  return (
    <group position={p}>
      <mesh geometry={circ} material={mBlob} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[2.0, 2.0, 1]} />
      <GrassTufts p={[0, 0, 0]} />

      {/* Flared Root Base + Ridged Trunk */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.72, 0.96, 12]} />
        <meshToonMaterial color="#543622" />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.39, 2.2, 12]} />
        <meshToonMaterial color="#623f28" />
      </mesh>
      {/* Vertical Bark Ridges */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ang = (i * Math.PI) / 3;
        return (
          <mesh key={i} position={[Math.cos(ang) * 0.34, 1.4, Math.sin(ang) * 0.34]} rotation={[0, -ang, 0]}>
            <boxGeometry args={[0.05, 2.4, 0.06]} />
            <meshToonMaterial color="#3c2416" />
          </mesh>
        );
      })}

      {/* 4 Spreading 3D Tree Limbs */}
      {[
        {pos: [-0.65, 2.85, 0.15] as [number, number, number], rot: [0, 0, 0.85] as [number, number, number], len: 1.5},
        {pos: [0.68, 2.95, -0.1] as [number, number, number], rot: [0, 0, -0.78] as [number, number, number], len: 1.55},
        {pos: [0.1, 3.05, 0.6] as [number, number, number], rot: [0.75, 0, 0.1] as [number, number, number], len: 1.3},
        {pos: [-0.15, 3.1, -0.58] as [number, number, number], rot: [-0.75, 0, -0.1] as [number, number, number], len: 1.3}
      ].map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot} castShadow>
          <cylinderGeometry args={[0.1, 0.17, b.len, 8]} />
          <meshToonMaterial color="#583822" />
        </mesh>
      ))}

      {/* Rich Multi-Cluster Canopy */}
      <group position={[0, 3.7, 0]}>
        {[
          [0, 0.25, 0, 1.65, 1.25, 1.65, '#2d6837'],
          [-1.05, 0.05, 0.25, 1.15, 0.9, 1.1, '#3a7e45'],
          [1.05, 0.15, -0.15, 1.2, 0.95, 1.15, '#3a7e45'],
          [0.3, 0.95, 0.55, 1.15, 0.9, 1.15, '#499a57'],
          [-0.45, 0.85, -0.5, 1.1, 0.85, 1.1, '#499a57'],
          [0, 1.55, 0, 0.95, 0.78, 0.95, '#5bb35d']
        ].map(([x, y, z, sx, sy, sz, col], i) => (
          <mesh key={i} position={[x as number, y as number, z as number]} scale={[sx as number, sy as number, sz as number]} castShadow>
            <sphereGeometry args={[1, 12, 9]} />
            <meshToonMaterial color={col as string} />
          </mesh>
        ))}
      </group>

      {/* Scattered Leaves floating down after collision */}
      {isCrashed &&
        Array.from({length: 16}, (_, i) => {
          const seed = (i * 1.618) % 1;
          const seed2 = (i * 2.718) % 1;
          const fallT = (crashT * 0.9 + seed) % 2.2;
          const y = Math.max(0.04, 3.4 - fallT * 1.5);
          const x = (seed - 0.5) * 2.1 + Math.sin(fallT * 3 + i) * 0.24;
          const z = (seed2 - 0.5) * 1.9 + Math.cos(fallT * 2.5 + i) * 0.22;
          return (
            <mesh key={i} position={[x, y, z]} rotation={[fallT * 4, i, fallT * 2]} scale={[0.1, 0.04, 0.1]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshToonMaterial color={i % 2 === 0 ? '#5bb35d' : '#3a7e45'} />
            </mesh>
          );
        })}
    </group>
  );
};

/** Radiator Steam FX from the crashed car hood */
const SteamFX: React.FC<{p: [number, number, number]; f: number}> = ({p, f}) => {
  if (f < 150) return null;
  const t = (f - 150) / 30;
  return (
    <group position={p}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const age = (t + i * 0.35) % 1.5;
        const y = 0.85 + age * 1.35;
        const scale = 0.18 + age * 0.34;
        const x = Math.sin(i * 1.5 + t * 2) * 0.16;
        const z = Math.cos(i * 1.2 + t * 2) * 0.14;
        return (
          <mesh key={i} position={[x, y, z]} scale={scale}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={Math.max(0, 0.45 * (1 - age / 1.5))} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Tire Skid Marks left on the asphalt as the car swerves into the tree */
const SkidMarks: React.FC<{f: number}> = ({f}) => {
  if (f < 115) return null;
  const u = Math.min(1, (f - 115) / 35);
  return (
    <group position={[-2.1, 0.015, 8.65]} rotation={[0, 0.22, 0]}>
      <mesh position={[0, 0, -0.35]} rotation={[-Math.PI / 2, 0, 0]} scale={[u, 1, 1]}>
        <planeGeometry args={[7.4, 0.16]} />
        <meshBasicMaterial color="#1a181c" transparent opacity={0.75} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.35]} rotation={[-Math.PI / 2, 0, 0]} scale={[u, 1, 1]}>
        <planeGeometry args={[7.4, 0.16]} />
        <meshBasicMaterial color="#1a181c" transparent opacity={0.75} depthWrite={false} />
      </mesh>
    </group>
  );
};

type P = {d: any; f: number; st: Stage; cam: THREE.Vector3; vel: (THREE.Vector3 | null)[]; tod: Tod};

export const SetBefore: React.FC<P> = ({f, st, tod}) => (
  <>
    <Town tod={tod} />
    <StreetClock hours={st.clock} />
    <SkidMarks f={f} />
    <CrashSign p={[2.1, 0, 6.9]} />
    <Tree p={[3.5, 0, 7.8]} f={f} />
    {st.cars.map((c, i) => (
      <Car key={i} c={c} />
    ))}
    <SteamFX p={[3.2, 0, 7.8]} f={f} />
  </>
);

export const SetAfter: React.FC<P> = () => null;
