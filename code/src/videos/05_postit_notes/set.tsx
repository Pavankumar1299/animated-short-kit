// 3D Set for 05_postit_notes: Downtown backdrop + chemistry lab desk + fluttering yellow sticky notes
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

/** 3D Sticky Notes & Lab Props */
const NotesProp: React.FC<{f: number}> = ({f}) => {
  const isFinal = f >= 765;

  return (
    <group position={[0, 0, 7.5]}>
      {/* Lab Desk */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.9, 0.85]} />
        <meshToonMaterial color="#7a3b22" />
      </mesh>

      {/* Beaker with weak glue on desk */}
      <mesh position={[-0.4, 0.98, 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.11, 0.22, 10]} />
        <meshToonMaterial color="#bfe3d8" transparent opacity={0.8} />
      </mesh>

      {/* Hero Yellow Post-It Note on desk */}
      <mesh position={[0.25, 0.91, 0.15]} rotation={[-Math.PI / 2, 0, 0.15]} castShadow receiveShadow>
        <planeGeometry args={[0.22, 0.22]} />
        <meshToonMaterial color="#f7ea48" side={THREE.DoubleSide} />
      </mesh>

      {/* Floating storm of yellow notes for victory shot */}
      {isFinal && (
        <group>
          {[-0.9, -0.45, 0.0, 0.45, 0.9].map((x, i) => (
            <mesh
              key={i}
              position={[x, 1.35 + 0.25 * Math.sin(f * 0.12 + i), -0.2 + 0.15 * Math.cos(f * 0.08 + i)]}
              rotation={[0.3 * Math.sin(f * 0.06 + i), 0.4 * Math.cos(f * 0.06 + i), 0]}
              castShadow
            >
              <planeGeometry args={[0.18, 0.18]} />
              <meshToonMaterial color="#f7ea48" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

type P = {d: any; f: number; st: Stage; cam: THREE.Vector3; vel: (THREE.Vector3 | null)[]; tod: Tod};
export const SetBefore: React.FC<P> = ({f, st, tod}) => (
  <>
    <Town tod={tod} />
    <StreetClock hours={st.clock} />
    <NotesProp f={f} />
    {st.cars.map((c, i) => <Car key={i} c={c} />)}
  </>
);
export const SetAfter: React.FC<P> = () => null;
