import subprocess
import os
import wave
import numpy as np

os.makedirs('public/03_shopping_cart', exist_ok=True)

SR = 44100
TOTAL_DUR = 10.0
total_samples = int(SR * TOTAL_DUR)

phrases = [
    ("He paid complete strangers to push empty carts around his store.", 0.25, "p1.wav"),
    ("Real customers refused, mocking them as ridiculous baby carriages.", 3.60, "p2.wav"),
    ("Until the trick worked, sparking a billion dollar shopping revolution.", 7.00, "p3.wav")
]

ps_script = """
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.Rate = 1
"""
for text, t, fname in phrases:
    out_path = os.path.abspath(f"public/03_shopping_cart/{fname}").replace('\\', '/')
    ps_script += f"""
$s.SetOutputToWaveFile("{out_path}")
$s.Speak("{text}")
"""
ps_script += "$s.Dispose()\n"

subprocess.run(["powershell", "-Command", ps_script], check=True)

voice_track = np.zeros(total_samples, dtype=np.float32)

for text, t_start, fname in phrases:
    fpath = f"public/03_shopping_cart/{fname}"
    with wave.open(fpath, 'rb') as w:
        n_ch = w.getnchannels()
        sr = w.getframerate()
        frames = w.readframes(w.getnframes())
        audio = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
        if n_ch == 2:
            audio = audio.mean(axis=1)
        if sr != SR:
            indices = np.round(np.arange(0, len(audio), sr / SR)).astype(int)
            indices = indices[indices < len(audio)]
            audio = audio[indices]
            
        start_idx = int(t_start * SR)
        end_idx = min(total_samples, start_idx + len(audio))
        voice_track[start_idx:end_idx] += audio[:end_idx - start_idx]
    os.remove(fpath)

max_v = np.max(np.abs(voice_track))
if max_v > 0:
    voice_track = voice_track / max_v * 0.95

# Synthesize cheerful store ambience & cash register chime
bed_track = np.zeros(total_samples, dtype=np.float32)
# Chime chords at 7.2s, 7.8s, 8.4s
for chime_t in [7.2, 7.8, 8.4, 9.0]:
    c_idx = int(chime_t * SR)
    c_len = int(0.6 * SR)
    t_c = np.linspace(0, 0.6, c_len)
    bell = (np.sin(2 * np.pi * 1760 * t_c) + np.sin(2 * np.pi * 2637 * t_c)) * np.exp(-t_c * 8)
    end_bell = min(total_samples, c_idx + c_len)
    bed_track[c_idx:end_bell] += bell[:end_bell - c_idx] * 0.25

# Upbeat bass line
tempo = 135
beat_dur = 60 / tempo
beats = np.arange(0, TOTAL_DUR, beat_dur)
for i, b in enumerate(beats):
    idx = int(b * SR)
    dur = int(0.12 * SR)
    if idx + dur < total_samples:
        t_b = np.linspace(0, 0.12, dur)
        f_bass = [130, 164.8, 196, 164.8][i % 4]
        bass_hit = np.sin(2 * np.pi * f_bass * t_b) * np.exp(-t_b * 16)
        bed_track[idx:idx+dur] += bass_hit * 0.16

max_b = np.max(np.abs(bed_track))
if max_b > 0:
    bed_track = bed_track / max_b * 0.5

mix_track = np.clip(voice_track + bed_track * 0.6, -1.0, 1.0)
mix_stereo = np.column_stack([mix_track, mix_track])
mix_int = (mix_stereo * 32767).astype(np.int16)
with wave.open('public/03_shopping_cart/mixed.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(mix_int.tobytes())

print("Audio for 03 generated!")
