// 3D Set for 05_postit_notes: 4-legged Lab Table, Choir Risers + Hymnbook, and Post-it Finale Table
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

/** Proper 4-legged Lab Table with beakers, flask, and yellow test notes at [-21.3, 0, 7.2] */
const LabTable: React.FC<{f: number}> = ({f}) => (
  <group position={[-21.3, 0, 7.2]}>
    {/* Tabletop */}
    <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.25, 0.06, 0.85]} />
      <meshToonMaterial color="#543622" />
    </mesh>
    {/* 4 Legs */}
    {[[-0.55, -0.35], [0.55, -0.35], [-0.55, 0.35], [0.55, 0.35]].map(([lx, lz], i) => (
      <mesh key={i} position={[lx, 0.42, lz]} castShadow>
        <boxGeometry args={[0.07, 0.84, 0.07]} />
        <meshToonMaterial color="#3a261a" />
      </mesh>
    ))}
    {/* Glowing yellow glue beaker */}
    <mesh position={[-0.25, 1.01, 0.1]} castShadow>
      <cylinderGeometry args={[0.07, 0.1, 0.26, 12]} />
      <meshToonMaterial color="#d8f0e8" transparent opacity={0.82} />
    </mesh>
    <mesh position={[-0.25, 0.96 + 0.015 * Math.sin(f * 0.25), 0.1]}>
      <cylinderGeometry args={[0.065, 0.09, 0.14, 12]} />
      <meshToonMaterial color="#ffe838" />
    </mesh>
    {/* Blue chemical flask */}
    <mesh position={[0.15, 1.03, -0.1]} castShadow>
      <cylinderGeometry args={[0.04, 0.09, 0.3, 12]} />
      <meshToonMaterial color="#68b5d0" transparent opacity={0.85} />
    </mesh>
    {/* Yellow Post-it test strip on table */}
    <mesh position={[0.3, 0.89, 0.18]} rotation={[-Math.PI / 2, 0, 0.25]} castShadow>
      <planeGeometry args={[0.24, 0.24]} />
      <meshToonMaterial color="#ffe838" side={THREE.DoubleSide} />
    </mesh>
  </group>
);

/** Choir Risers + Music Stand + Open Hymnbook at [-26.5, 0, 20.6] */
const ChoirStage: React.FC<{f: number}> = ({f}) => {
  const isEureka = f >= 564;
  const fall = ((f - 318) % 55) / 55;

  return (
    <group position={[-26.5, 0, 20.6]} rotation={[0, Math.PI, 0]}>
      {/* Red Choir Riser Carpet Mat */}
      <mesh position={[0, 0.02, -0.8]} receiveShadow>
        <boxGeometry args={[3.4, 0.04, 1.8]} />
        <meshToonMaterial color="#8a2828" />
      </mesh>
      {/* Music Stand */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.045, 0.07, 1.1, 10]} />
        <meshToonMaterial color="#543622" />
      </mesh>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.3, 0.08, 12]} />
        <meshToonMaterial color="#3e2617" />
      </mesh>
      {/* Slanted Desk & Open Hymnbook */}
      <group position={[0, 1.12, 0]} rotation={[0.42, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.74, 0.04, 0.48]} />
          <meshToonMaterial color="#6b4228" />
        </mesh>
        <mesh position={[-0.16, 0.04, 0]} rotation={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.38]} />
          <meshToonMaterial color="#fbf3e0" />
        </mesh>
        <mesh position={[0.16, 0.04, 0]} rotation={[0, 0, -0.08]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.38]} />
          <meshToonMaterial color="#fbf3e0" />
        </mesh>
        {/* Glowing oversized yellow Post-it bookmark on the page in Eureka */}
        {isEureka && (
          <mesh position={[0.22, 0.075, 0.08]} rotation={[-Math.PI / 2, 0, 0.14]}>
            <planeGeometry args={[0.18, 0.18]} />
            <meshToonMaterial color="#ffe838" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
      {/* Falling paper bookmarks during choir frustration */}
      {!isEureka && [0, 1, 2, 3].map((i) => {
        const t = (fall + i * 0.25) % 1;
        return (
          <mesh
            key={i}
            position={[-0.25 + i * 0.18 + Math.sin(t * 6 + i) * 0.14, 1.05 - t * 0.98, 0.35 + t * 0.25]}
            rotation={[t * 4, i + t * 2, t * 3]}
          >
            <planeGeometry args={[0.1, 0.18]} />
            <meshToonMaterial color="#fbf3e0" side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
};

/** 4-Legged Display Table + Swirling Storm of 24 Yellow Post-it Notes at [30, 0, 20.6] */
const SuccessFinale: React.FC<{f: number}> = ({f}) => (
  <group position={[30, 0, 20.6]}>
    {/* Display Table */}
    <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.25, 0.06, 0.85]} />
      <meshToonMaterial color="#2f4f6a" />
    </mesh>
    {[[-0.55, -0.35], [0.55, -0.35], [-0.55, 0.35], [0.55, 0.35]].map(([lx, lz], i) => (
      <mesh key={i} position={[lx, 0.42, lz]} castShadow>
        <boxGeometry args={[0.07, 0.84, 0.07]} />
        <meshToonMaterial color="#1f3448" />
      </mesh>
    ))}
    {/* Stack of yellow Post-it pads */}
    <mesh position={[0, 0.99, 0]} castShadow>
      <boxGeometry args={[0.42, 0.22, 0.42]} />
      <meshToonMaterial color="#ffe838" />
    </mesh>
    {/* 24 swirling yellow Post-it notes across the street */}
    {Array.from({length: 24}, (_, i) => {
      const ang = f * 0.055 + i * (Math.PI * 2 / 24);
      const rad = 0.9 + 0.55 * (i % 4);
      const y = 0.8 + ((i * 0.19 + f * 0.03) % 2.1);
      return (
        <mesh
          key={i}
          position={[Math.cos(ang) * rad, y, Math.sin(ang) * 0.8 - 1.0]}
          rotation={[0.45 * Math.sin(f * 0.08 + i), ang, 0.35 * Math.cos(f * 0.07 + i)]}
          castShadow
        >
          <planeGeometry args={[0.18, 0.18]} />
          <meshToonMaterial color={i % 2 === 0 ? '#ffe838' : '#f7d930'} side={THREE.DoubleSide} />
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
    <LabTable f={f} />
    <ChoirStage f={f} />
    <SuccessFinale f={f} />
    {st.cars.map((c, i) => <Car key={i} c={c} />)}
  </>
);
export const SetAfter: React.FC<P> = () => null;
