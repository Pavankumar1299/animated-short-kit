import asyncio
import json
import os
import subprocess
import wave
import numpy as np
import edge_tts

VOICE = "en-US-GuyNeural"
RATE = "+13%"
SR = 44100
TOTAL_DUR = 30.0
total_samples = int(SR * TOTAL_DUR)

out_dir = os.path.join(os.path.dirname(__file__), 'public', '05_postit_notes')
os.makedirs(out_dir, exist_ok=True)

phrases = [
    ("He spent five years trying to invent the strongest glue on earth, but accidentally made the weakest.", 0.25),
    ("His boss laughed in his face: Congratulations, you invented glue that does not stick!", 5.60),
    ("For five long years, the formula sat in a drawer as a total failure. Until a colleague got sick of loose bookmarks falling from his choir book.", 10.80),
    ("He dabbed the useless glue onto bright yellow paper. It held firm, yet peeled off without tearing a single fiber.", 18.90),
    ("Today, that failed glue sells fifty billion Post-it Notes every single year.", 25.30)
]

async def generate_voice_and_words():
    voice_track = np.zeros(total_samples, dtype=np.float32)
    all_words = []

    for i, (text, t_start) in enumerate(phrases):
        mp3_path = os.path.join(out_dir, f"temp_{i}.mp3")
        wav_path = os.path.join(out_dir, f"temp_{i}.wav")
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)

        with open(mp3_path, "wb") as f_mp3:
            async for chunk in comm.stream():
                if chunk["type"] == "audio":
                    f_mp3.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    w_text = chunk["text"]
                    w_start = t_start + (chunk["offset"] / 10_000_000.0)
                    w_end = w_start + (chunk["duration"] / 10_000_000.0)
                    all_words.append([w_text, round(w_start, 2), round(w_end, 2)])

        subprocess.run(["ffmpeg", "-y", "-i", mp3_path, "-ar", str(SR), "-ac", "1", wav_path],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        with wave.open(wav_path, 'rb') as w:
            frames = w.readframes(w.getnframes())
            audio = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
            start_idx = int(t_start * SR)
            end_idx = min(total_samples, start_idx + len(audio))
            voice_track[start_idx:end_idx] += audio[:end_idx - start_idx]

        if os.path.exists(mp3_path):
            os.remove(mp3_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)

    max_v = np.max(np.abs(voice_track))
    if max_v > 0:
        voice_track = voice_track / max_v * 0.95

    return voice_track, all_words

voice_track, all_words = asyncio.run(generate_voice_and_words())

# Synthesize Sound Bed (30 seconds)
bed_track = np.zeros(total_samples, dtype=np.float32)
t_arr = np.linspace(0, TOTAL_DUR, total_samples, endpoint=False)

# 1. Comedic walking bass & groove
tempo = 132 # bpm
beat_dur = 60 / tempo
beats = np.arange(0, TOTAL_DUR, beat_dur)
bass_notes = [110, 138.6, 164.8, 146.8, 130, 164.8, 196, 174.6]
for i, b in enumerate(beats):
    idx = int(b * SR)
    dur = int(0.14 * SR)
    if idx + dur < total_samples:
        t_b = np.linspace(0, 0.14, dur)
        f_bass = bass_notes[i % len(bass_notes)]
        hit = np.sin(2 * np.pi * f_bass * t_b) * np.exp(-t_b * 16)
        bed_track[idx:idx+dur] += hit * 0.16

# 2. Glass clink at 0.5s & 2.2s (chemistry lab)
for clink_t in [0.6, 2.4]:
    idx = int(clink_t * SR)
    dur = int(0.25 * SR)
    t_c = np.linspace(0, 0.25, dur)
    clink = (np.sin(2 * np.pi * 2800 * t_c) + np.sin(2 * np.pi * 4200 * t_c)) * np.exp(-t_c * 24)
    bed_track[idx:idx+dur] += clink * 0.18

# 3. Paper flutter sound effect at 15.2s and 20.1s
for flutter_t in [15.2, 20.0]:
    idx = int(flutter_t * SR)
    dur = int(0.6 * SR)
    t_f = np.linspace(0, 0.6, dur)
    rustle = np.random.normal(0, 0.2, dur) * np.sin(np.pi * t_f / 0.6)
    rustle = rustle - np.roll(rustle, 2)
    bed_track[idx:idx+dur] += rustle * 0.22

# 4. Eureka Chime chord at 21.0s
eureka_t = 21.0
idx_e = int(eureka_t * SR)
dur_e = int(1.2 * SR)
t_e = np.linspace(0, 1.2, dur_e)
chime = (
    np.sin(2 * np.pi * 1046.5 * t_e) + # C6
    np.sin(2 * np.pi * 1318.5 * t_e) + # E6
    np.sin(2 * np.pi * 1567.9 * t_e) + # G6
    np.sin(2 * np.pi * 2093.0 * t_e)   # C7
) * np.exp(-t_e * 5)
bed_track[idx_e:idx_e+dur_e] += chime * 0.25

# 5. Triumphant Brass/Synth swell (25.5s to 29.5s)
t_swell = t_arr[int(25.5 * SR):int(29.8 * SR)] - 25.5
swell_freq = 220 + 220 * (t_swell / 4.3)
swell_phase = np.cumsum(swell_freq / SR) * 2 * np.pi
brass = (
    0.4 * np.sin(swell_phase) +
    0.3 * np.sin(swell_phase * 2) +
    0.2 * np.sin(swell_phase * 3)
) * np.linspace(0.1, 1.0, len(t_swell)) * np.exp(-(t_swell - 3.8).clip(min=0) * 10)
bed_track[int(25.5 * SR):int(25.5 * SR)+len(brass)] += brass * 0.35

max_b = np.max(np.abs(bed_track))
if max_b > 0:
    bed_track = bed_track / max_b * 0.50

# Export voice.wav
voice_wav = os.path.join(out_dir, 'voice.wav')
voice_int = (np.clip(voice_track, -1.0, 1.0) * 32767).astype(np.int16)
with wave.open(voice_wav, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(voice_int.tobytes())

# Export bed.wav (stereo)
bed_wav = os.path.join(out_dir, 'bed.wav')
bed_stereo = np.column_stack([bed_track, bed_track])
bed_int = (np.clip(bed_stereo, -1.0, 1.0) * 32767).astype(np.int16)
with wave.open(bed_wav, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(bed_int.tobytes())

# Export mixed.wav
mixed_wav = os.path.join(out_dir, 'mixed.wav')
mix_track = np.clip(voice_track + bed_track * 0.65, -1.0, 1.0)
mix_stereo = np.column_stack([mix_track, mix_track])
mix_int = (mix_stereo * 32767).astype(np.int16)
with wave.open(mixed_wav, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(mix_int.tobytes())

# Dump word timestamps as JSON for timeline.ts generator
words_json = os.path.join(out_dir, 'words.json')
with open(words_json, 'w') as f:
    json.dump(all_words, f, indent=2)

print("05_postit_notes audio created successfully:")
print(" - voice.wav:", os.path.getsize(voice_wav), "bytes")
print(" - bed.wav:", os.path.getsize(bed_wav), "bytes")
print(" - mixed.wav:", os.path.getsize(mixed_wav), "bytes")
print(f" - words.json: {len(all_words)} words saved.")
