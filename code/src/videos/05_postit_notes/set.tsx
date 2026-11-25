// 3D Set for 05_postit_notes: 4 distinct downtown locations (HARDWARE lab, BANK mockery, BOOKS choir, OFFICE SUPPLY finale)
import React from 'react';
import * as THREE from 'three';
import type {Tod} from '../../engine/look/look';
import {Town, StreetClock} from '../../engine/kits/downtown/town';
import {Car} from '../../engine/kits/downtown/street';
import type {Stage} from './stage';

export const AUDIO: {voice: string | null; bed: string | null} = {
  voice: '05_postit_notes/voice.wav',
  bed: '05_postit_notes/bed.wav'
};
export const useSetData = () => null;

/** Lab Bench outside FIVE & DIME (x=-22.5, z=6.1) */
const LabBench: React.FC<{f: number}> = ({f}) => (
  <group position={[-22.5, 0, 6.1]}>
    <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.7, 0.88, 0.8]} />
      <meshToonMaterial color="#7a3b22" />
    </mesh>
    <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.06, 0.88]} />
      <meshToonMaterial color="#3a2a22" />
    </mesh>
    <mesh position={[-0.45, 1.05, 0.1]} castShadow>
      <cylinderGeometry args={[0.07, 0.11, 0.24, 10]} />
      <meshToonMaterial color="#bfe3d8" transparent opacity={0.85} />
    </mesh>
    <mesh position={[-0.45, 1.0 + 0.015 * Math.sin(f * 0.2), 0.1]}>
      <cylinderGeometry args={[0.065, 0.09, 0.12, 10]} />
      <meshToonMaterial color="#f7ea48" />
    </mesh>
    <mesh position={[-0.15, 1.08, -0.05]} castShadow>
      <cylinderGeometry args={[0.04, 0.08, 0.3, 10]} />
      <meshToonMaterial color="#78b9c9" transparent opacity={0.85} />
    </mesh>
    <mesh position={[0.35, 0.94, 0.18]} rotation={[-Math.PI / 2, 0, 0.2]} castShadow>
      <planeGeometry args={[0.22, 0.22]} />
      <meshToonMaterial color="#f7ea48" side={THREE.DoubleSide} />
    </mesh>
  </group>
);

/** Choir Music Stand & Hymnbook across the street at MEN'S WEAR (x=-26.5, z=20.9, facing -z) */
const ChoirPodium: React.FC<{f: number}> = ({f}) => {
  const isEureka = f >= 564;
  const fall = ((f - 318) % 60) / 60;

  return (
    <group position={[-26.5, 0, 20.9]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.08, 1.1, 10]} />
        <meshToonMaterial color="#543622" />
      </mesh>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.08, 12]} />
        <meshToonMaterial color="#3e2617" />
      </mesh>
      <group position={[0, 1.12, 0]} rotation={[0.38, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.04, 0.46]} />
          <meshToonMaterial color="#6b4228" />
        </mesh>
        <mesh position={[-0.16, 0.04, 0]} rotation={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.36]} />
          <meshToonMaterial color="#fbf3e0" />
        </mesh>
        <mesh position={[0.16, 0.04, 0]} rotation={[0, 0, -0.08]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.36]} />
          <meshToonMaterial color="#fbf3e0" />
        </mesh>
        {isEureka && (
          <mesh position={[0.22, 0.07, 0.08]} rotation={[-Math.PI / 2, 0, 0.12]}>
            <planeGeometry args={[0.15, 0.15]} />
            <meshToonMaterial color="#f7ea48" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
      {!isEureka && [0, 1, 2].map((i) => {
        const t = (fall + i * 0.33) % 1;
        return (
          <mesh
            key={i}
            position={[-0.2 + i * 0.22 + Math.sin(t * 6 + i) * 0.12, 1.05 - t * 0.98, 0.35 + t * 0.25]}
            rotation={[t * 4, i + t * 2, t * 3]}
          >
            <planeGeometry args={[0.09, 0.16]} />
            <meshToonMaterial color="#f4ead6" side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Success Display across the street at INSURANCE plaza (x=30, z=20.9) with swirling storm of yellow notes */
const NotesStorm: React.FC<{f: number}> = ({f}) => (
  <group position={[30, 0, 20.9]}>
    <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.1, 0.9, 0.7]} />
      <meshToonMaterial color="#2f4f6a" />
    </mesh>
    <mesh position={[0, 1.02, 0]} castShadow>
      <boxGeometry args={[0.45, 0.24, 0.45]} />
      <meshToonMaterial color="#f7ea48" />
    </mesh>
    {Array.from({length: 18}, (_, i) => {
      const ang = f * 0.055 + i * (Math.PI * 2 / 18);
      const rad = 0.8 + 0.45 * (i % 3);
      const y = 0.9 + ((i * 0.21 + f * 0.028) % 1.9);
      return (
        <mesh
          key={i}
          position={[Math.cos(ang) * rad, y, Math.sin(ang) * 0.7 - 0.8]}
          rotation={[0.4 * Math.sin(f * 0.08 + i), ang, 0.3 * Math.cos(f * 0.07 + i)]}
          castShadow
        >
          <planeGeometry args={[0.17, 0.17]} />
          <meshToonMaterial color={i % 3 === 0 ? '#ffe838' : '#f7ea48'} side={THREE.DoubleSide} />
        </mesh>
      );
    })}
  </group>
);

type P = {d: any; f: number; st: Stage; cam: THREE.Vector3; vel: (THREE.Vector3 | null)[]; tod: Tod};
export const SetBefore: React.FC<P> = ({f, st, tod}) => (
  <>
    <Town tod={tod} />
    <StreetClock hours={st.clock} />
    <LabBench f={f} />
    <ChoirPodium f={f} />
    <NotesStorm f={f} />
    {st.cars.map((c, i) => <Car key={i} c={c} />)}
  </>
);
export const SetAfter: React.FC<P> = () => null;
