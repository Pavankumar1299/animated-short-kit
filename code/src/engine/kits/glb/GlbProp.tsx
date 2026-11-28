// Drop-in Remotion-safe GLB Prop Loader with auto-grounding (Y=0), targetHeight/targetLength normalization,
// and material stylization (soft matte miniature finish matching Ricks Clips 2.5D look).
import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {continueRender, delayRender, staticFile} from 'remotion';

const glbCache = new Map<string, THREE.Group>();

export interface GlbPropProps {
  src: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  targetHeight?: number;
  targetLength?: number;
  ground?: boolean;
  stylizeMaterials?: boolean;
  paintColor?: string;
  wheelSpin?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export const GlbProp: React.FC<GlbPropProps> = ({
  src,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  targetHeight,
  targetLength,
  ground = true,
  stylizeMaterials = true,
  paintColor,
  wheelSpin = 0,
  castShadow = true,
  receiveShadow = true
}) => {
  const [scene, setScene] = useState<THREE.Group | null>(() => glbCache.get(src) ?? null);
  const handleRef = useRef<number | null>(null);
  if (!glbCache.has(src) && handleRef.current === null) {
    handleRef.current = delayRender(`Loading GLB ${src}`);
  }

  useEffect(() => {
    if (glbCache.has(src)) {
      setScene(glbCache.get(src)!);
      return;
    }
    const url = src.startsWith('http') || src.startsWith('/') ? src : staticFile(src);
    new GLTFLoader().load(
      url,
      (gltf) => {
        glbCache.set(src, gltf.scene);
        setScene(gltf.scene);
      },
      undefined,
      (err) => {
        console.error(`Failed to load GLB ${src}:`, err);
        if (handleRef.current !== null) {
          continueRender(handleRef.current);
          handleRef.current = null;
        }
      }
    );
  }, [src]);

  const {clonedScene, computedScale, yOffset} = useMemo(() => {
    if (!scene) return {clonedScene: null, computedScale: 1, yOffset: 0};
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mesh.material = mats.map((mat) => {
            const m = mat.clone();
            if (paintColor && m.name === 'Paint' && 'color' in m) {
              (m as THREE.MeshStandardMaterial).color.set(paintColor);
            }
            if (stylizeMaterials && 'roughness' in m) {
              const std = m as THREE.MeshStandardMaterial;
              std.roughness = Math.max(std.roughness ?? 0.5, 0.72);
              std.metalness = Math.min(std.metalness ?? 0.0, 0.25);
              std.envMapIntensity = 0.65;
              std.needsUpdate = true;
            }
            return m;
          }) as any;
          if (!Array.isArray(mat0(mesh.material)) && Array.isArray(mesh.material) && mesh.material.length === 1) {
            mesh.material = mesh.material[0];
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    let normScale = 1;
    if (targetHeight && size.y > 0.0001) normScale = targetHeight / size.y;
    else if (targetLength) {
      const horiz = Math.max(size.x, size.z);
      if (horiz > 0.0001) normScale = targetLength / horiz;
    }
    const finalScale = normScale * scale;
    const minY = ground ? -box.min.y * finalScale : 0;
    return {clonedScene: clone, computedScale: finalScale, yOffset: minY};
  }, [scene, targetHeight, targetLength, scale, ground, stylizeMaterials, paintColor, castShadow, receiveShadow]);

  const {gl, scene: rootScene, camera} = useThree();
  useEffect(() => {
    if (clonedScene && handleRef.current !== null) {
      const h = handleRef.current;
      handleRef.current = null;
      requestAnimationFrame(() => {
        gl.render(rootScene, camera);
        continueRender(h);
      });
    }
  }, [clonedScene, gl, rootScene, camera]);

  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((obj) => {
      if (obj.name.startsWith('Wheel_')) obj.rotation.z = -wheelSpin;
      else if (obj.name.startsWith('wheel-')) obj.rotation.x = wheelSpin;
    });
  }, [clonedScene, wheelSpin]);

  if (!clonedScene) return null;
  return (
    <group position={position} rotation={rotation}>
      <primitive object={clonedScene} scale={computedScale} position={[0, yOffset, 0]} />
    </group>
  );
};

function mat0(m: THREE.Material | THREE.Material[]) {
  return Array.isArray(m) ? m[0] : m;
}
