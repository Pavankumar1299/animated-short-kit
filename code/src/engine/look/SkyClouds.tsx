// Shared Sky Dome + Layered 3D Clouds + Sun Glow for outdoor depth (inspired by Ricks Clips sample.mp4)
import React from 'react';
import * as THREE from 'three';

const CLOUDS: [number, number, number, number][] = [
  [-35, 22, -45, 1.4],
  [-8, 25, -52, 1.8],
  [24, 21, -48, 1.5],
  [48, 24, -40, 1.3],
  [-42, 23, 55, 1.5],
  [-10, 26, 60, 1.7],
  [22, 22, 56, 1.4],
  [46, 24, 48, 1.2]
];

export const SkyClouds: React.FC<{f: number}> = ({f}) => {
  const drift = (f * 0.015) % 120;
  return (
    <group>
      {/* Warm Sun Disc & Halo */}
      <mesh position={[35, 28, -65]}>
        <circleGeometry args={[4.5, 24]} />
        <meshBasicMaterial color="#fff8d6" fog={false} />
      </mesh>
      <mesh position={[35, 28, -65.2]}>
        <circleGeometry args={[8.5, 24]} />
        <meshBasicMaterial color="#ffe8a8" transparent opacity={0.32} fog={false} />
      </mesh>

      {/* Layered Fluffy 3D Clouds */}
      {CLOUDS.map(([cx, cy, cz, sc], i) => {
        const x = ((cx + drift + 60) % 120) - 60;
        return (
          <group key={i} position={[x, cy, cz]} scale={[sc, sc * 0.72, sc]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[3.2, 10, 8]} />
              <meshBasicMaterial color="#ffffff" fog={false} />
            </mesh>
            <mesh position={[-2.6, -0.5, 0.2]}>
              <sphereGeometry args={[2.3, 10, 8]} />
              <meshBasicMaterial color="#f2f6fa" fog={false} />
            </mesh>
            <mesh position={[2.7, -0.4, -0.2]}>
              <sphereGeometry args={[2.5, 10, 8]} />
              <meshBasicMaterial color="#f2f6fa" fog={false} />
            </mesh>
            <mesh position={[0.4, 1.1, 0]}>
              <sphereGeometry args={[2.2, 10, 8]} />
              <meshBasicMaterial color="#ffffff" fog={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
