// 3D Set for 05_postit_notes: Downtown backdrop + shot-specific Lab Bench / Choir Podium + fluttering yellow sticky notes
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

/** Lab Bench (shots: lab, mockery) placed cleanly behind characters at z=6.2 */
const LabBench: React.FC<{f: number}> = ({f}) => (
  <group position={[0, 0, 6.2]}>
    <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.7, 0.88, 0.8]} />
      <meshToonMaterial color="#7a3b22" />
    </mesh>
    <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.06, 0.88]} />
      <meshToonMaterial color="#3a2a22" />
    </mesh>
    {/* Beakers & flasks */}
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
    {/* Test yellow note on bench */}
    <mesh position={[0.35, 0.94, 0.18]} rotation={[-Math.PI / 2, 0, 0.2]} castShadow>
      <planeGeometry args={[0.22, 0.22]} />
      <meshToonMaterial color="#f7ea48" side={THREE.DoubleSide} />
    </mesh>
  </group>
);

/** Choir Music Stand & Hymnbook (shots: choir, eureka) at z=6.2 */
const ChoirPodium: React.FC<{f: number}> = ({f}) => {
  const isEureka = f >= 564;
  const fall = ((f - 318) % 60) / 60;

  return (
    <group position={[0, 0, 6.2]}>
      {/* Wooden Stand */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.08, 1.1, 10]} />
        <meshToonMaterial color="#543622" />
      </mesh>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.08, 12]} />
        <meshToonMaterial color="#3e2617" />
      </mesh>
      {/* Slanted Desk & Open Hymnbook */}
      <group position={[0, 1.12, 0]} rotation={[0.38, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.04, 0.46]} />
          <meshToonMaterial color="#6b4228" />
        </mesh>
        {/* Left & Right white hymnbook pages */}
        <mesh position={[-0.16, 0.04, 0]} rotation={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.36]} />
          <meshToonMaterial color="#fbf3e0" />
        </mesh>
        <mesh position={[0.16, 0.04, 0]} rotation={[0, 0, -0.08]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.36]} />
          <meshToonMaterial color="#fbf3e0" />
        </mesh>
        {/* Eureka: sticky yellow note attached cleanly to hymnbook */}
        {isEureka && (
          <mesh position={[0.22, 0.07, 0.08]} rotation={[-Math.PI / 2, 0, 0.12]}>
            <planeGeometry args={[0.15, 0.15]} />
            <meshToonMaterial color="#f7ea48" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
      {/* Falling paper bookmarks during choir frustration */}
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

/** Success Display & Swirling Storm of Yellow Sticky Notes (shot: success) */
const NotesStorm: React.FC<{f: number}> = ({f}) => (
  <group position={[0, 0, 6.2]}>
    {/* Display pedestal with giant stack of yellow Post-it pads */}
    <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.1, 0.9, 0.7]} />
      <meshToonMaterial color="#2f4f6a" />
    </mesh>
    <mesh position={[0, 1.02, 0]} castShadow>
      <boxGeometry args={[0.45, 0.24, 0.45]} />
      <meshToonMaterial color="#f7ea48" />
    </mesh>
    {/* 16 swirling yellow Post-it notes */}
    {Array.from({length: 16}, (_, i) => {
      const ang = f * 0.05 + i * (Math.PI * 2 / 16);
      const rad = 0.8 + 0.45 * (i % 3);
      const y = 0.9 + ((i * 0.23 + f * 0.025) % 1.8);
      return (
        <mesh
          key={i}
          position={[Math.cos(ang) * rad, y, Math.sin(ang) * 0.7 + 0.6]}
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
    {f < 318 && <LabBench f={f} />}
    {f >= 318 && f < 756 && <ChoirPodium f={f} />}
    {f >= 756 && <NotesStorm f={f} />}
    {st.cars.map((c, i) => <Car key={i} c={c} />)}
  </>
);
export const SetAfter: React.FC<P> = () => null;
