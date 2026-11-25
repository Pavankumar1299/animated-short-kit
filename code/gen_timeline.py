import json
import os

phrases = [
    ("He spent five years trying to invent the strongest glue on earth, but accidentally made the weakest.", 0.25, 5.35),
    ("His boss laughed in his face: Congratulations, you invented glue that does not stick!", 5.60, 10.40),
    ("For five long years, the formula sat in a drawer as a total failure. Until a colleague got sick of loose bookmarks falling from his choir book.", 10.80, 18.50),
    ("He dabbed the useless glue onto bright yellow paper. It held firm, yet peeled off without tearing a single fiber.", 18.90, 25.00),
    ("Today, that failed glue sells fifty billion Post-it Notes every single year.", 25.30, 29.80)
]

all_words = []
caps = []
current_idx = 0

for text, t_start, t_end in phrases:
    words = text.split()
    n = len(words)
    dur = t_end - t_start
    w_dur = dur / n
    phrase_start_idx = current_idx
    
    for i, w in enumerate(words):
        ws = round(t_start + i * w_dur, 2)
        we = round(t_start + (i + 1) * w_dur - 0.03, 2)
        all_words.append([w, ws, we])
    
    p_len = len(words)
    j = 0
    while j < p_len:
        step = 3 if (p_len - j) >= 3 else (p_len - j)
        caps.append([current_idx + j, current_idx + j + step - 1])
        j += step
    current_idx += n

out_dir = os.path.join(os.path.dirname(__file__), 'src', 'videos', '05_postit_notes')
os.makedirs(out_dir, exist_ok=True)
out_ts = os.path.join(out_dir, 'timeline.ts')

with open(out_ts, 'w') as f:
    f.write('// 30-second short (900 frames @ 30fps) - The Failed Glue (Post-it Notes)\n')
    f.write('export const FPS = 30;\n')
    f.write('export const OLD_TOTAL = 900;\n\n')
    f.write('export const WORDS: [string, number, number][] = ' + json.dumps(all_words, indent=2) + ';\n\n')
    f.write('export const CAPS: [number, number][] = ' + json.dumps(caps) + ';\n\n')
    f.write('export const SHOT_START: Record<string, number> = {\n')
    f.write('  lab: 0,        // 0.0s - 5.5s (0 - 165f)\n')
    f.write('  mockery: 165,  // 5.5s - 10.6s (165 - 318f)\n')
    f.write('  choir: 318,    // 10.6s - 18.8s (318 - 564f)\n')
    f.write('  eureka: 564,   // 18.8s - 25.2s (564 - 756f)\n')
    f.write('  success: 756   // 25.2s - 30.0s (756 - 900f)\n')
    f.write('};\n\n')
    f.write('export const SHOT_REAL: Record<string, number> = {\n')
    f.write('  lab: 0.0,\n')
    f.write('  mockery: 5.5,\n')
    f.write('  choir: 10.6,\n')
    f.write('  eureka: 18.8,\n')
    f.write('  success: 25.2\n')
    f.write('};\n\n')
    f.write('export const WORDS_REAL = WORDS;\n')
    f.write('export const END_REAL = 30.0;\n')
    f.write('export const VOICE_END = 30.0;\n')
    f.write('export const WARP: [number, number][] = [[0, 0], [30.0, 30.0]];\n')
    f.write('export const warp = (t: number) => t;\n')

print(f"Generated {out_ts} with {len(all_words)} words and {len(caps)} captions.")
