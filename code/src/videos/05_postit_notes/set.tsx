// 3D Set for 05_postit_notes: Indoor Chemistry Lab (x=-60) + Indoor Church Sanctuary (x=60) + Office Supply Finale (30, 20.6)
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

/** Indoor Chemistry Lab Room at x=-120, z=-6..4 */
const ChemistryLab: React.FC<{f: number}> = ({f}) => (
  <group position={[-120, 0, 0]}>
    {/* Tiled Lab Floor & Ceiling */}
    <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 10]} />
      <meshToonMaterial color="#d8e2dc" />
    </mesh>
    <mesh position={[0, 3.8, -1]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 10]} />
      <meshToonMaterial color="#f4f6f4" />
    </mesh>
    {/* Back & Side Walls */}
    <mesh position={[0, 1.9, -6]} receiveShadow>
      <boxGeometry args={[8, 3.8, 0.2]} />
      <meshToonMaterial color="#e6ede8" />
    </mesh>
    <mesh position={[-4, 1.9, -1]} receiveShadow>
      <boxGeometry args={[0.2, 3.8, 10]} />
      <meshToonMaterial color="#dce6df" />
    </mesh>
    <mesh position={[4, 1.9, -1]} receiveShadow>
      <boxGeometry args={[0.2, 3.8, 10]} />
      <meshToonMaterial color="#dce6df" />
    </mesh>
    {/* Green Chalkboard on Back Wall */}
    <mesh position={[-1.4, 2.0, -5.86]}>
      <boxGeometry args={[2.2, 1.15, 0.06]} />
      <meshToonMaterial color="#2a5a42" />
    </mesh>
    <mesh position={[-1.4, 2.0, -5.89]}>
      <boxGeometry args={[2.32, 1.27, 0.04]} />
      <meshToonMaterial color="#6b4228" />
    </mesh>
    {/* Wall Shelf with Colorful Chemical Bottles */}
    <mesh position={[1.4, 1.9, -5.65]} castShadow>
      <boxGeometry args={[2.2, 0.08, 0.4]} />
      <meshToonMaterial color="#543622" />
    </mesh>
    {['#ffe838', '#4fa3d1', '#e05a47', '#6cc28a', '#f2992a'].map((col, i) => (
      <mesh key={i} position={[0.6 + i * 0.4, 2.12, -5.65]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.34, 10]} />
        <meshToonMaterial color={col} />
      </mesh>
    ))}
    {/* Overhead Lab Light */}
    <pointLight position={[0, 3.2, -2.5]} intensity={1.8} distance={10} color="#fff7e6" />
    <mesh position={[0, 3.4, -2.5]}>
      <coneGeometry args={[0.35, 0.22, 12]} />
      <meshToonMaterial color="#2f4f6a" />
    </mesh>

    {/* 4-legged Lab Table at local [0, 0, -3.0] */}
    <group position={[0, 0, -3.0]}>
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.06, 0.85]} />
        <meshToonMaterial color="#543622" />
      </mesh>
      {[[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.42, lz]} castShadow>
          <boxGeometry args={[0.07, 0.84, 0.07]} />
          <meshToonMaterial color="#3a261a" />
        </mesh>
      ))}
      <mesh position={[-0.25, 1.01, 0.1]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.26, 12]} />
        <meshToonMaterial color="#d8f0e8" transparent opacity={0.82} />
      </mesh>
      <mesh position={[-0.25, 0.96 + 0.015 * Math.sin(f * 0.25), 0.1]}>
        <cylinderGeometry args={[0.065, 0.09, 0.14, 12]} />
        <meshToonMaterial color="#ffe838" />
      </mesh>
      <mesh position={[0.18, 1.03, -0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.09, 0.3, 12]} />
        <meshToonMaterial color="#68b5d0" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.35, 0.89, 0.18]} rotation={[-Math.PI / 2, 0, 0.25]}>
        <planeGeometry args={[0.24, 0.24]} />
        <meshToonMaterial color="#ffe838" side={THREE.DoubleSide} />
      </mesh>
    </group>
  </group>
);

/** Indoor Church Sanctuary Room at x=120, z=-6..4 */
const ChurchSanctuary: React.FC<{f: number}> = ({f}) => {
  const isEureka = f >= 564;
  const fall = ((f - 318) % 55) / 55;

  return (
    <group position={[120, 0, 0]}>
      {/* Warm Wood Floor & Cream Stone Walls */}
      <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 10]} />
        <meshToonMaterial color="#6e472b" />
      </mesh>
      <mesh position={[0, 2.1, -6]} receiveShadow>
        <boxGeometry args={[8, 4.2, 0.2]} />
        <meshToonMaterial color="#f2e8d5" />
      </mesh>
      <mesh position={[-4, 2.1, -1]} receiveShadow>
        <boxGeometry args={[0.2, 4.2, 10]} />
        <meshToonMaterial color="#e8dcc6" />
      </mesh>
      <mesh position={[4, 2.1, -1]} receiveShadow>
        <boxGeometry args={[0.2, 4.2, 10]} />
        <meshToonMaterial color="#e8dcc6" />
      </mesh>
      {/* 3 Arched Stained-Glass Windows on Back Wall */}
      {[-2.1, 0, 2.1].map((wx, i) => (
        <group key={i} position={[wx, 2.3, -5.86]}>
          <mesh>
            <boxGeometry args={[1.0, 1.8, 0.06]} />
            <meshBasicMaterial color={i === 1 ? '#f7d060' : '#6ca6d9'} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.06, 12]} />
            <meshBasicMaterial color="#e87a5a" />
          </mesh>
        </group>
      ))}
      {/* Wooden Church Pews */}
      {[-2.4, 2.4].map((px, i) => (
        <group key={i} position={[px, 0, -4.1]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.9, 0.1, 0.55]} />
            <meshToonMaterial color="#543622" />
          </mesh>
          <mesh position={[0, 0.72, -0.22]} castShadow>
            <boxGeometry args={[1.9, 0.6, 0.1]} />
            <meshToonMaterial color="#6b4228" />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 3.4, -2.5]} intensity={1.8} distance={10} color="#fff0d4" />

      {/* Red Choir Carpet + Music Stand + Hymnbook at local [0, 0, -2.6] */}
      <group position={[0, 0, -2.6]}>
        <mesh position={[0, 0.02, 0.5]} receiveShadow>
          <boxGeometry args={[3.6, 0.04, 2.2]} />
          <meshToonMaterial color="#8a2828" />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.07, 1.1, 10]} />
          <meshToonMaterial color="#543622" />
        </mesh>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.3, 0.08, 12]} />
          <meshToonMaterial color="#3e2617" />
        </mesh>
        <group position={[0, 1.12, 0]} rotation={[0.42, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.74, 0.04, 0.48]} />
            <meshToonMaterial color="#6b4228" />
          </mesh>
          <mesh position={[-0.16, 0.04, 0]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.28, 0.03, 0.38]} />
            <meshToonMaterial color="#fbf3e0" />
          </mesh>
          <mesh position={[0.16, 0.04, 0]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[0.28, 0.03, 0.38]} />
            <meshToonMaterial color="#fbf3e0" />
          </mesh>
          {isEureka && (
            <mesh position={[0.22, 0.075, 0.08]} rotation={[-Math.PI / 2, 0, 0.14]}>
              <planeGeometry args={[0.18, 0.18]} />
              <meshToonMaterial color="#ffe838" side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
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
    </group>
  );
};

/** 4-Legged Display Table + Swirling Storm of 24 Yellow Post-it Notes at [30, 0, 20.6] */
const SuccessFinale: React.FC<{f: number}> = ({f}) => (
  <group position={[30, 0, 20.6]}>
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
    <mesh position={[0, 0.99, 0]} castShadow>
      <boxGeometry args={[0.42, 0.22, 0.42]} />
      <meshToonMaterial color="#ffe838" />
    </mesh>
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
    <ChemistryLab f={f} />
    <ChurchSanctuary f={f} />
    <SuccessFinale f={f} />
    {st.cars.map((c, i) => <Car key={i} c={c} />)}
  </>
);
export const SetAfter: React.FC<P> = () => null;
