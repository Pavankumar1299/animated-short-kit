// 10-second short (300 frames @ 30fps) - "The Fake Shopper Secret" (Shopping Cart)
export const FPS = 30;
export const OLD_TOTAL = 300;

export const WORDS: [string, number, number][] = [
  // Beat 1: Hook (0.2s - 3.42s)
  ["He", 0.20, 0.38],
  ["paid", 0.42, 0.68],
  ["complete", 0.72, 1.05],
  ["strangers", 1.10, 1.48],
  ["to", 1.52, 1.64],
  ["push", 1.68, 1.96],
  ["empty", 2.00, 2.30],
  ["carts", 2.34, 2.65],
  ["around", 2.70, 2.96],
  ["his", 3.00, 3.12],
  ["store.", 3.16, 3.42],

  // Beat 2: Refusal / Mockery (3.6s - 6.78s)
  ["Real", 3.60, 3.85],
  ["customers", 3.90, 4.35],
  ["refused,", 4.40, 4.80],
  ["mocking", 4.95, 5.25],
  ["them", 5.28, 5.42],
  ["as", 5.46, 5.58],
  ["ridiculous", 5.62, 6.10],
  ["baby", 6.15, 6.38],
  ["carriages.", 6.42, 6.78],

  // Beat 3: Turn & Climax (7.0s - 9.95s)
  ["Until", 7.00, 7.24],
  ["the", 7.28, 7.38],
  ["trick", 7.42, 7.68],
  ["worked,", 7.72, 8.05],
  ["sparking", 8.15, 8.52],
  ["a", 8.56, 8.66],
  ["billion", 8.70, 8.98],
  ["dollar", 9.02, 9.28],
  ["shopping", 9.32, 9.58],
  ["revolution.", 9.62, 9.95]
];

export const CAPS: [number, number][] = [
  [0, 3],   // he paid complete strangers
  [4, 7],   // to push empty carts
  [8, 10],  // around his store.
  [11, 13], // real customers refused,
  [14, 16], // mocking them as
  [17, 19], // ridiculous baby carriages.
  [20, 23], // until the trick worked,
  [24, 27], // sparking a billion dollar
  [28, 29]  // shopping revolution.
];

export const SHOT_START: Record<string, number> = {
  hook: 0,
  refusal: 105,
  revolution: 207
};

export const SHOT_REAL: Record<string, number> = {
  hook: 0.0,
  refusal: 3.5,
  revolution: 6.9
};

export const WORDS_REAL = WORDS;
export const END_REAL = 10.0;
export const VOICE_END = 10.0;
export const WARP: [number, number][] = [[0, 0], [10.0, 10.0]];
export const warp = (t: number) => t;
