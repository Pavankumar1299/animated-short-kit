// Reusable Blender .glb / .gltf Loader for Remotion + React Three Fiber
// Drop any Blender-exported .glb into code/public/models/<name>.glb and render with <GlbModel path="models/<name>.glb" />
import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {continueRender, delayRender, staticFile} from 'remotion';

const glbCache = new Map<string, THREE.Group>();

type GlbProps = {
  path: string;
  paintColor?: string;
  wheelSpin?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
};

export const GlbModel: React.FC<GlbProps> = ({
  path,
  paintColor,
  wheelSpin = 0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  const [scene, setScene] = useState<THREE.Group | null>(() => glbCache.get(path) ?? null);
  const handleRef = useRef<number | null>(null);
  if (!glbCache.has(path) && handleRef.current === null) {
    handleRef.current = delayRender(`Loading GLB ${path}`);
  }

  useEffect(() => {
    if (glbCache.has(path)) {
      setScene(glbCache.get(path)!);
      return;
    }
    const loader = new GLTFLoader();
    loader.load(
      staticFile(path),
      (gltf) => {
        gltf.scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
        glbCache.set(path, gltf.scene);
        setScene(gltf.scene);
      },
      undefined,
      (err) => {
        console.error(`Failed to load GLB ${path}:`, err);
        if (handleRef.current !== null) {
          continueRender(handleRef.current);
          handleRef.current = null;
        }
      }
    );
  }, [path]);

  const instance = useMemo(() => {
    if (!scene) return null;
    const clone = scene.clone(true);
    if (paintColor) {
      clone.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && mat.name === 'Paint') {
          const tinted = mat.clone();
          tinted.color.set(paintColor);
          mesh.material = tinted;
        }
      });
    }
    return clone;
  }, [scene, paintColor]);

  const {gl, scene: rootScene, camera} = useThree();

  // Wait until React commits <primitive object={instance} /> AND force WebGL draw before continueRender!
  useEffect(() => {
    if (instance && handleRef.current !== null) {
      const h = handleRef.current;
      handleRef.current = null;
      requestAnimationFrame(() => {
        gl.render(rootScene, camera);
        continueRender(h);
      });
    }
  }, [instance, gl, rootScene, camera]);

  useEffect(() => {
    if (!instance) return;
    instance.traverse((obj) => {
      if (obj.name.startsWith('Wheel_')) {
        obj.rotation.z = -wheelSpin;
      } else if (obj.name.startsWith('wheel-')) {
        obj.rotation.x = wheelSpin;
      }
    });
  }, [instance, wheelSpin]);

  if (!instance) return null;
  return <primitive object={instance} position={position} rotation={rotation} scale={scale} />;
};
