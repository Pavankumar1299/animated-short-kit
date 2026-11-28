import React from 'react';

export interface CinematicLightingProps {
  /** Sky gradient top/ambient tint */
  skyColor?: string;
  /** Ground bounce fill tint (prevents pitch-black shadows) */
  groundBounceColor?: string;
  /** Warm sun key light color */
  keyColor?: string;
  /** Key light intensity */
  keyIntensity?: number;
  /** Distance fog color to separate foreground characters from background .glb sets */
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
}

export const CinematicLighting: React.FC<CinematicLightingProps> = ({
  skyColor = '#cfe2ff',
  groundBounceColor = '#5b526b',
  keyColor = '#fff1dc',
  keyIntensity = 2.4,
  fogColor = '#dce7f5',
  fogNear = 18,
  fogFar = 65,
}) => {
  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* Soft Hemisphere Fill so shadows have rich cool-purple depth */}
      <hemisphereLight args={[skyColor, groundBounceColor, 0.95]} />

      {/* Main Warm Sun Key Light with high-res soft shadows */}
      <directionalLight
        position={[12, 18, 10]}
        intensity={keyIntensity}
        color={keyColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0004}
      />

      {/* Subtle Cool Rim Light to separate 2D character cutouts from 3D background */}
      <directionalLight position={[-10, 8, -12]} intensity={0.65} color="#a9c8ff" />
    </>
  );
};
