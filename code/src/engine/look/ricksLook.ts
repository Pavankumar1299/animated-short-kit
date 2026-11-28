// Ricks Clips 2.5D Cinematic Look Preset
// Combines warm key lighting, cool shadow bounce, telephoto 65mm compression, and crisp 2D ink outlines.

export const RICKS_CLIPS_LOOK = {
  toneMapping: 'ACESFilmic',
  toneMappingExposure: 1.05,
  cameraFov: 24, // Equivalent to ~65mm telephoto lens for miniature 2.5D depth compression
  lighting: {
    skyColor: '#d4e4ff',
    groundBounceColor: '#564d68',
    keyColor: '#fff0d6',
    keyIntensity: 2.35,
    fogColor: '#dfe9f5',
    fogNear: 20,
    fogFar: 68,
  },
  characterStyle: {
    strokeWidth: 4.5,
    fillColor: '#faf8f2', // Warm off-white fill so characters pop against 3D backgrounds
    inkColor: '#16161a',
    groundContactShadowOpacity: 0.32,
  },
} as const;
