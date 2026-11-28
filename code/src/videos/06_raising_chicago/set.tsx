// 3D Set for 06_raising_chicago: 1856 Muddy Street w/ CC0 .glb Houses rising on Screw Jacks + Indoor Dining Room w/ .glb Table/Chairs
import React from 'react';
import * as THREE from 'three';
import type {Tod} from '../../engine/look/look';
import {GlbProp} from '../../engine/kits/glb/GlbProp';
import {CinematicLighting} from '../../engine/look/CinematicLighting';
import type {Stage} from './stage';

export const AUDIO: {voice: string | null; bed: string | null} = {
  voice: '06_raising_chicago/voice.wav',
  bed: '06_raising_chicago/bed.wav'
};
export const useSetData = () => null;

/** 1856 Chicago Street (x=-120): Muddy road -> Screw Jacks lifting .glb houses -> Clean Elevated City */
const ChicagoStreet: React.FC<{f: number}> = ({f}) => {
  const liftU = f < 357 ? 0 : f >= 576 ? 1 : Math.min(1, (f - 357) / 180);
  const liftY = liftU * 1.35;
  const isClean = f >= 747;

  return (
    <group position={[-120, 0, 0]}>
      {/* Ground: Thick Muddy Road (before) -> Clean Dry Cobblestone/Plank Street (after) */}
      <mesh position={[0, -0.01, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 32]} />
        <meshStandardMaterial color={isClean ? '#7c7e85' : '#5b4028'} roughness={0.92} />
      </mesh>
      {/* Sidewalk Strip */}
      <mesh position={[0, 0.02, -1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 4.5]} />
        <meshStandardMaterial color={isClean ? '#c6c0b2' : '#7a5c3c'} roughness={0.88} />
      </mesh>

      {/* 3 CC0 Kenney .glb Houses rising into the air */}
      <group position={[0, liftY, 0]}>
        <GlbProp src="models/buildings/house_a.glb" position={[-4.2, 0, -5.2]} targetHeight={5.4} />
        <GlbProp src="models/buildings/house_b.glb" position={[0.0, 0, -5.2]} targetHeight={6.0} />
        <GlbProp src="models/buildings/house_c.glb" position={[4.2, 0, -5.2]} targetHeight={5.2} />
      </group>

      {/* Wooden Screw-Jack Cribbing Towers supporting the lifted houses */}
      {liftY > 0.05 &&
        [-5.2, -3.2, -1.0, 1.0, 3.2, 5.2].map((jx, i) => (
          <group key={i} position={[jx, 0, -4.4]}>
            <mesh position={[0, liftY / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.42, liftY, 0.42]} />
              <meshStandardMaterial color="#8a5a32" roughness={0.85} />
            </mesh>
            <mesh position={[0, liftY * 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, liftY + 0.1, 8]} />
              <meshStandardMaterial color="#3c4048" metalness={0.5} roughness={0.5} />
            </mesh>
          </group>
        ))}

      {/* CC0 Oak Tree on the corner */}
      <GlbProp src="models/tree_detailed.glb" position={[-8.2, 0, -3.5]} targetHeight={5.8} />
    </group>
  );
};

/** Indoor Dining Room inside the rising house (x=120) with CC0 .glb Table, Chairs & Soup Bowls */
const DiningRoom: React.FC<{f: number}> = ({f}) => {
  const wobble = f >= 576 && f < 747 ? 0.008 * Math.sin(f * 0.25) : 0;
  return (
    <group position={[120, wobble, 0]}>
      <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 10]} />
        <meshStandardMaterial color="#7a4c2a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.0, -6]} receiveShadow>
        <boxGeometry args={[8, 4.0, 0.2]} />
        <meshStandardMaterial color="#f2e2c6" roughness={0.9} />
      </mesh>
      <mesh position={[-4, 2.0, -1]} receiveShadow>
        <boxGeometry args={[0.2, 4.0, 10]} />
        <meshStandardMaterial color="#e6d3b3" roughness={0.9} />
      </mesh>
      <mesh position={[4, 2.0, -1]} receiveShadow>
        <boxGeometry args={[0.2, 4.0, 10]} />
        <meshStandardMaterial color="#e6d3b3" roughness={0.9} />
      </mesh>
      {/* Window looking out to blue sky */}
      <mesh position={[0, 2.2, -5.86]}>
        <boxGeometry args={[1.8, 1.4, 0.06]} />
        <meshBasicMaterial color="#9ecae6" />
      </mesh>
      {/* CC0 .glb Dining Table & Chairs */}
      <GlbProp src="models/props/table.glb" position={[0, 0, -2.0]} targetHeight={0.82} />
      <GlbProp src="models/props/chair.glb" position={[-0.95, 0, -2.0]} rotation={[0, Math.PI / 2, 0]} targetHeight={0.9} />
      <GlbProp src="models/props/chair.glb" position={[0.95, 0, -2.0]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.9} />
      {/* Two warm soup bowls on the table */}
      {[-0.35, 0.35].map((bx, i) => (
        <group key={i} position={[bx, 0.85, -2.0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.08, 0.09, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.04, 14]} />
            <meshStandardMaterial color="#e88a30" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

type P = {d: any; f: number; st: Stage; cam: THREE.Vector3; vel: (THREE.Vector3 | null)[]; tod: Tod};
export const SetBefore: React.FC<P> = ({f}) => (
  <>
    <CinematicLighting />
    <ChicagoStreet f={f} />
    <DiningRoom f={f} />
  </>
);
export const SetAfter: React.FC<P> = () => null;
