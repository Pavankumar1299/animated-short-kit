// 10-second short (300 frames @ 30fps) - "Speed Car Meets The Oak Tree"
export const FPS = 30;
export const OLD_TOTAL = 300;

export const WORDS: [string, number, number][] = [
  // Beat 1: The hotshot speedster (0.0s - 3.2s)
  ["He", 0.20, 0.38],
  ["bragged", 0.42, 0.75],
  ["his", 0.80, 0.95],
  ["speedster", 1.00, 1.48],
  ["could", 1.52, 1.70],
  ["outrun", 1.74, 2.12],
  ["anything", 2.16, 2.55],
  ["on", 2.60, 2.74],
  ["wheels.", 2.78, 3.18],

  // Beat 2: Loss of control & Impact (3.4s - 5.95s)
  ["Until", 3.40, 3.65],
  ["he", 3.70, 3.82],
  ["swerved", 3.86, 4.25],
  ["straight", 4.30, 4.62],
  ["into", 4.66, 4.90],
  ["a", 4.94, 5.02],
  ["century-old", 5.06, 5.55],
  ["oak.", 5.60, 5.95],

  // Beat 3: The unbothered tree & ticket (6.2s - 9.0s)
  ["The", 6.25, 6.40],
  ["tree", 6.45, 6.75],
  ["did", 6.80, 6.98],
  ["not", 7.02, 7.20],
  ["even", 7.25, 7.50],
  ["lose", 7.55, 7.82],
  ["a", 7.86, 7.96],
  ["single", 8.00, 8.40],
  ["leaf.", 8.45, 8.90]
];

export const CAPS: [number, number][] = [
  [0, 3],   // He bragged his speedster
  [4, 8],   // could outrun anything on wheels.
  [9, 13],  // Until he swerved straight into
  [14, 16], // a century-old oak.
  [17, 21], // The tree did not even
  [22, 25]  // lose a single leaf.
];

export const SHOT_START: Record<string, number> = {
  speeding: 0,
  crash: 102,
  aftermath: 180
};

export const SHOT_REAL: Record<string, number> = {
  speeding: 0.0,
  crash: 3.4,
  aftermath: 6.0
};

export const WORDS_REAL = WORDS;
export const END_REAL = 10.0;
export const VOICE_END = 10.0;
export const WARP: [number, number][] = [[0, 0], [10.0, 10.0]];
export const warp = (t: number) => t;
