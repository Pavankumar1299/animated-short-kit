import subprocess
import os
import wave
import numpy as np

os.makedirs('public/04_speed_car', exist_ok=True)

SR = 44100
TOTAL_DUR = 10.0
total_samples = int(SR * TOTAL_DUR)

# 1. Generate Voice Phrases using Windows TTS
phrases = [
    ("He bragged his speedster could outrun anything on wheels.", 0.25, "p1.wav"),
    ("Until he swerved straight into a century-old oak.", 3.50, "p2.wav"),
    ("The tree did not even lose a single leaf.", 6.30, "p3.wav")
]

ps_script = """
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.Rate = 1
"""
for text, t, fname in phrases:
    out_path = os.path.abspath(f"public/04_speed_car/{fname}").replace('\\', '/')
    ps_script += f"""
$s.SetOutputToWaveFile("{out_path}")
$s.Speak("{text}")
"""
ps_script += "$s.Dispose()\n"

subprocess.run(["powershell", "-Command", ps_script], check=True)

voice_track = np.zeros(total_samples, dtype=np.float32)

for text, t_start, fname in phrases:
    fpath = f"public/04_speed_car/{fname}"
    with wave.open(fpath, 'rb') as w:
        n_ch = w.getnchannels()
        sr = w.getframerate()
        frames = w.readframes(w.getnframes())
        audio = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
        if n_ch == 2:
            audio = audio.reshape(-1, 2).mean(axis=1)
        # resample if needed
        if sr != SR:
            indices = np.round(np.arange(0, len(audio), sr / SR)).astype(int)
            indices = indices[indices < len(audio)]
            audio = audio[indices]
            
        start_idx = int(t_start * SR)
        end_idx = min(total_samples, start_idx + len(audio))
        voice_track[start_idx:end_idx] += audio[:end_idx - start_idx]
    os.remove(fpath)

# Normalize voice
max_v = np.max(np.abs(voice_track))
if max_v > 0:
    voice_track = voice_track / max_v * 0.95

# 2. Synthesize Sound FX & Music Bed (bed_track)
bed_track = np.zeros(total_samples, dtype=np.float32)
t_arr = np.linspace(0, TOTAL_DUR, total_samples, endpoint=False)

# A. Engine roar (0.0s to 5.0s) - pitch climbs from 60Hz to 160Hz
t_eng = t_arr[t_arr < 5.0]
eng_freq = 65.0 + 35.0 * (t_eng / 5.0)**1.5
eng_phase = np.cumsum(eng_freq / SR) * 2 * np.pi
# Rich harmonic engine sound
engine_snd = (
    0.35 * np.sin(eng_phase) +
    0.25 * np.sin(eng_phase * 2) +
    0.15 * np.sin(eng_phase * 3) +
    0.10 * np.sin(eng_phase * 4) +
    0.15 * np.random.normal(0, 0.2, len(t_eng))
)
# Fade in slightly at start, fade out at crash
engine_env = np.ones_like(t_eng)
engine_env[:int(0.2 * SR)] = np.linspace(0, 1, int(0.2 * SR))
engine_env[int(4.8 * SR):] = np.linspace(1, 0, len(engine_env) - int(4.8 * SR))
bed_track[:len(t_eng)] += engine_snd * engine_env * 0.35

# B. Tire screech (3.6s to 5.0s) - modulated frequency screech
screech_start = int(3.6 * SR)
screech_end = int(5.0 * SR)
t_sc = t_arr[screech_start:screech_end] - 3.6
sc_freq = 1800 + 400 * np.sin(t_sc * 25)
sc_phase = np.cumsum(sc_freq / SR) * 2 * np.pi
screech_snd = (np.sin(sc_phase) + 0.6 * np.random.normal(0, 0.5, len(t_sc))) * np.sin(np.linspace(0, np.pi, len(t_sc)))
bed_track[screech_start:screech_end] += screech_snd * 0.28

# C. Crash Impact (at 5.0s)
crash_idx = int(5.0 * SR)
crash_len = int(1.8 * SR)
t_cr = np.linspace(0, 1.8, crash_len, endpoint=False)
# Low boom + noise burst + metal decay
boom = np.sin(2 * np.pi * 55 * np.exp(-t_cr * 4) * t_cr) * np.exp(-t_cr * 3)
metal_noise = np.random.normal(0, 1, crash_len) * np.exp(-t_cr * 7)
clang = (np.sin(2 * np.pi * 420 * t_cr) + np.sin(2 * np.pi * 680 * t_cr)) * np.exp(-t_cr * 5)
crash_snd = boom * 0.7 + metal_noise * 0.5 + clang * 0.4
end_c = min(total_samples, crash_idx + crash_len)
bed_track[crash_idx:end_c] += crash_snd[:end_c - crash_idx] * 0.85

# D. Radiator Hiss / Steam (5.1s to 9.5s)
steam_idx = int(5.1 * SR)
steam_len = int(4.4 * SR)
t_st = np.linspace(0, 4.4, steam_len, endpoint=False)
steam_snd = np.random.normal(0, 0.15, steam_len) * np.exp(-t_st * 0.6)
# High pass filter simple
steam_snd = steam_snd - np.roll(steam_snd, 1)
end_st = min(total_samples, steam_idx + steam_len)
bed_track[steam_idx:end_st] += steam_snd[:end_st - steam_idx] * 0.22

# E. Upbeat comedic 1930s swing rhythm bed (bass + chords)
tempo = 140 # bpm
beat_dur = 60 / tempo
beats = np.arange(0, TOTAL_DUR, beat_dur)
for i, b in enumerate(beats):
    if 4.8 <= b <= 6.2:  # pause beat during crash impact
        continue
    idx = int(b * SR)
    dur = int(0.12 * SR)
    if idx + dur < total_samples:
        t_b = np.linspace(0, 0.12, dur)
        # Walking bass note
        f_bass = [110, 138.6, 164.8, 146.8][i % 4]
        bass_hit = np.sin(2 * np.pi * f_bass * t_b) * np.exp(-t_b * 18)
        bed_track[idx:idx+dur] += bass_hit * 0.18

# Normalize bed
max_b = np.max(np.abs(bed_track))
if max_b > 0:
    bed_track = bed_track / max_b * 0.55

# Write voice.wav
voice_int = (np.clip(voice_track, -1.0, 1.0) * 32767).astype(np.int16)
with wave.open('public/04_speed_car/voice.wav', 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(voice_int.tobytes())

# Write bed.wav (stereo)
bed_stereo = np.column_stack([bed_track, bed_track])
bed_int = (np.clip(bed_stereo, -1.0, 1.0) * 32767).astype(np.int16)
with wave.open('public/04_speed_car/bed.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(bed_int.tobytes())

# Write full mixed.wav for muxing
mix_track = np.clip(voice_track + bed_track * 0.7, -1.0, 1.0)
mix_stereo = np.column_stack([mix_track, mix_track])
mix_int = (mix_stereo * 32767).astype(np.int16)
with wave.open('public/04_speed_car/mixed.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(mix_int.tobytes())

print("Audio generated successfully:")
print(" - voice.wav:", os.path.getsize('public/04_speed_car/voice.wav'), "bytes")
print(" - bed.wav:", os.path.getsize('public/04_speed_car/bed.wav'), "bytes")
print(" - mixed.wav:", os.path.getsize('public/04_speed_car/mixed.wav'), "bytes")
