import json, os

with open("public/06_raising_chicago/words.json") as f:
    words = json.load(f)

chunks = []
i = 0
while i < len(words):
    end = min(i + 2, len(words) - 1)
    chunks.append([i, end])
    i = end + 1

ts = f"""// 30-second short (900 frames @ 30fps) - Why This Town Lifted Every House Into the Air (Chicago 1856)
export const FPS = 30;
export const OLD_TOTAL = 900;

export const WORDS: [string, number, number][] = {json.dumps(words, indent=2)};

export const CAPS: [number, number][] = {json.dumps(chunks)};

export const SHOT_START: Record<string, number> = {{
  mud: 0,       // 0.0s - 5.7s (0 - 171f)
  mockery: 171, // 5.7s - 11.9s (171 - 357f)
  jacks: 357,   // 11.9s - 19.2s (357 - 576f)
  dinner: 576,  // 19.2s - 24.9s (576 - 747f)
  city: 747     // 24.9s - 30.0s (747 - 900f)
}};

export const SHOT_REAL: Record<string, number> = {{
  mud: 0.0,
  mockery: 5.7,
  jacks: 11.9,
  dinner: 19.2,
  city: 24.9
}};

export const WORDS_REAL = WORDS;
export const END_REAL = 30.0;
export const VOICE_END = 30.0;
export const WARP: [number, number][] = [[0, 0], [30.0, 30.0]];
export const warp = (t: number) => t;
"""

with open("src/videos/06_raising_chicago/timeline.ts", "w") as f:
    f.write(ts)

print("Generated 06_raising_chicago/timeline.ts")
