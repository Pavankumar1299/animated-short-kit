// 3D Set for 04_speed_car: Downtown street + majestic 100-year-old oak tree + crash FX (leaves, steam)
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

/** 3D Oak Tree on the curb at [3.5, 0, 7.8] */
const Tree: React.FC<{p: [number, number, number]; f: number}> = ({p, f}) => {
  const isCrashed = f >= 150;
  const crashT = Math.max(0, (f - 150) / 30);

  return (
    <group position={p}>
      {/* Base shadow */}
      <mesh geometry={circ} material={mBlob} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[1.8, 1.8, 1]} />

      {/* Flared Trunk Base */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.65, 0.9, 12]} />
        <meshToonMaterial color="#543622" />
      </mesh>

      {/* Main Trunk */}
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.38, 2.0, 12]} />
        <meshToonMaterial color="#623f28" />
      </mesh>

      {/* Stylized Bark Rings */}
      {[0.9, 1.6, 2.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.33, 0.33, 0.06, 10]} />
          <meshToonMaterial color="#3e2617" />
        </mesh>
      ))}

      {/* Dense Canopy */}
      <group position={[0, 3.5, 0]}>
        <mesh position={[0, 0.2, 0]} scale={[1.6, 1.25, 1.6]} castShadow>
          <sphereGeometry args={[1, 14, 10]} />
          <meshToonMaterial color="#2d6837" />
        </mesh>
        <mesh position={[0.55, 0.85, 0.3]} scale={[1.15, 0.9, 1.15]} castShadow>
          <sphereGeometry args={[1, 12, 10]} />
          <meshToonMaterial color="#3a7e45" />
        </mesh>
        <mesh position={[-0.55, 0.75, -0.3]} scale={[1.05, 0.85, 1.05]} castShadow>
          <sphereGeometry args={[1, 12, 10]} />
          <meshToonMaterial color="#3a7e45" />
        </mesh>
        <mesh position={[0, 1.45, 0]} scale={[0.9, 0.75, 0.9]} castShadow>
          <sphereGeometry args={[1, 12, 10]} />
          <meshToonMaterial color="#499a57" />
        </mesh>
      </group>

      {/* Scattered Leaves floating down after collision */}
      {isCrashed &&
        Array.from({length: 12}, (_, i) => {
          const seed = (i * 1.618) % 1;
          const seed2 = (i * 2.718) % 1;
          const fallT = (crashT * 0.9 + seed) % 2.2;
          const y = Math.max(0.04, 3.2 - fallT * 1.45);
          const x = (seed - 0.5) * 1.6 + Math.sin(fallT * 3 + i) * 0.2;
          const z = (seed2 - 0.5) * 1.6 + Math.cos(fallT * 2.5 + i) * 0.2;
          return (
            <mesh key={i} position={[x, y, z]} rotation={[fallT * 4, i, fallT * 2]} scale={[0.09, 0.04, 0.09]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshToonMaterial color={i % 2 === 0 ? '#499a57' : '#3a7e45'} />
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
      {Array.from({length: 6}, (_, i) => {
        const age = (t * 1.3 + i * 0.3) % 1.5;
        const y = 0.8 + age * 1.1;
        const scale = 0.12 + age * 0.22;
        const x = Math.sin(i * 1.5 + t * 2) * 0.14;
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
    {/* 100-year-old sturdy oak tree on the curb */}
    <Tree p={[3.5, 0, 7.8]} f={f} />
    {/* Cars */}
    {st.cars.map((c, i) => (
      <Car key={i} c={c} />
    ))}
    {/* Radiator steam at the crashed car front */}
    <SteamFX p={[3.2, 0, 7.8]} f={f} />
  </>
);

export const SetAfter: React.FC<P> = () => null;
