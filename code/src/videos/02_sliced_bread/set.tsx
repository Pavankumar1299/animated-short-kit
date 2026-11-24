// Set and props for 02_sliced_bread: 1930s grocery/bakery interior, downtown street, and bread slicing machine props
import React, {useMemo} from 'react';
import * as THREE from 'three';
import type {Tod} from '../../engine/look/look';
import {useMats, Set, type Mats} from '../../engine/kits/grocery/store';
import {Town, StreetClock} from '../../engine/kits/downtown/town';
import {Car} from '../../engine/kits/downtown/street';
import type {Stage} from './stage';
import {shotAt} from './stage';

export const AUDIO: {voice: string | null; bed: string | null} = {voice: null, bed: null};
export const useSetData = () => useMats();

type P = {d: Mats; f: number; st: Stage; cam: THREE.Vector3; vel: (THREE.Vector3 | null)[]; tod: Tod};

/** 3D Bread Loaf (golden crust, rounded top) */
const Loaf: React.FC<{pos: [number, number, number]; rot?: number; sliced?: boolean}> = ({pos, rot = 0, sliced = false}) => {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      {/* Base bread loaf body */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.14, 0.16]} />
        <meshToonMaterial color="#b26d38" />
      </mesh>
      {/* Curved top crust */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.28, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshToonMaterial color="#c47d44" />
      </mesh>
      {sliced && (
        <>
          {/* Visible slice cuts */}
          {[-0.09, -0.045, 0, 0.045, 0.09].map((x, i) => (
            <mesh key={i} position={[x, 0.11, 0]}>
              <boxGeometry args={[0.006, 0.17, 0.162]} />
              <meshToonMaterial color="#f8eed8" />
            </mesh>
          ))}
          {/* Wax paper packaging band */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.16, 0.145, 0.165]} />
            <meshToonMaterial color="#3d7aa6" />
          </mesh>
        </>
      )}
    </group>
  );
};

/** 3D Slicing Machine (counter/bench mounted with vertical slicing blades and crank) */
const SlicingMachine: React.FC<{pos: [number, number, number]; burnt?: boolean}> = ({pos, burnt = false}) => {
  return (
    <group position={pos}>
      {/* Machine cast-iron chassis */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.24, 0.32]} />
        <meshToonMaterial color={burnt ? '#282326' : '#344254'} />
      </mesh>
      {/* Bread feed chute */}
      <mesh position={[-0.14, 0.25, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.3, 0.02, 0.22]} />
        <meshToonMaterial color={burnt ? '#1f1a1d' : '#8892a0'} />
      </mesh>
      {/* Parallel vertical slicing blades rack */}
      {!burnt ? (
        <group position={[0.04, 0.28, 0]}>
          {[-0.08, -0.05, -0.02, 0.01, 0.04, 0.07].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <boxGeometry args={[0.005, 0.26, 0.2]} />
              <meshToonMaterial color="#d2d8e0" />
            </mesh>
          ))}
          {/* Top blade guide arch */}
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[0.22, 0.03, 0.22]} />
            <meshToonMaterial color="#2a3442" />
          </mesh>
        </group>
      ) : (
        /* Charred remains / smoke embers */
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[0.3, 0.15, 0.24]} />
          <meshToonMaterial color="#1a1416" />
        </mesh>
      )}
      {/* Hand crank wheel */}
      <mesh position={[0.22, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.03, 12]} />
        <meshToonMaterial color={burnt ? '#201b1e' : '#b24434'} />
      </mesh>
    </group>
  );
};

export const SetBefore: React.FC<P> = ({d, f, st, tod}) => {
  const s = shotAt(f);
  const isBurnt = s.name === 'disaster';
  const isClimax = s.name === 'climax' || s.name === 'ending';

  return (
    <>
      <Set m={d} f={f} />
      <Town tod={tod} />
      <StreetClock hours={st.clock} />
      {st.cars.map((c, i) => (
        <Car key={i} c={c} />
      ))}

      {/* Slicing Machine mounted at workshop / bakery bench */}
      <SlicingMachine pos={[0.05, 0.65, 7.3]} burnt={isBurnt} />

      {/* Whole loaf on bench */}
      {!isBurnt && <Loaf pos={[-0.22, 0.68, 7.32]} rot={0.1} />}

      {/* Sliced loaf exiting machine */}
      {!isBurnt && (s.name === 'theturn' || isClimax) && (
        <Loaf pos={[0.28, 0.68, 7.32]} rot={-0.05} sliced={true} />
      )}

      {/* Extra pre-sliced loaves on the bakery counter during climax */}
      {isClimax && (
        <>
          <Loaf pos={[-0.5, 0.68, 7.28]} rot={0.2} sliced={true} />
          <Loaf pos={[-0.78, 0.68, 7.3]} rot={-0.1} sliced={true} />
        </>
      )}
    </>
  );
};

export const SetAfter: React.FC<P> = () => null;
