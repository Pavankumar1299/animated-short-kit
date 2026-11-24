import asyncio
import os
import subprocess
import wave
import numpy as np
import edge_tts

VOICE = "en-US-GuyNeural"
RATE = "+10%"

out_dir = os.path.join(os.path.dirname(__file__), 'public', '03_shopping_cart')
os.makedirs(out_dir, exist_ok=True)

SR = 44100
TOTAL_DUR = 10.0
total_samples = int(SR * TOTAL_DUR)

phrases = [
    ("He paid complete strangers to push empty carts around his store.", 0.20),
    ("Real customers refused, mocking them as ridiculous baby carriages.", 3.60),
    ("Until the trick worked, sparking a billion dollar shopping revolution.", 7.00)
]

async def synthesize_all():
    voice_track = np.zeros(total_samples, dtype=np.float32)
    for i, (text, t_start) in enumerate(phrases):
        temp_mp3 = os.path.join(out_dir, f"temp_{i}.mp3")
        temp_wav = os.path.join(out_dir, f"temp_{i}.wav")
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(temp_mp3)
        subprocess.run(["ffmpeg", "-y", "-i", temp_mp3, "-ar", str(SR), "-ac", "1", temp_wav],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        with wave.open(temp_wav, 'rb') as w:
            frames = w.readframes(w.getnframes())
            audio = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
            start_idx = int(t_start * SR)
            end_idx = min(total_samples, start_idx + len(audio))
            voice_track[start_idx:end_idx] += audio[:end_idx - start_idx]
        if os.path.exists(temp_mp3):
            os.remove(temp_mp3)
        if os.path.exists(temp_wav):
            os.remove(temp_wav)

    max_v = np.max(np.abs(voice_track))
    if max_v > 0:
        voice_track = voice_track / max_v * 0.95
    return voice_track

voice_track = asyncio.run(synthesize_all())

# Synthesize cheerful store ambience & cash register chime
bed_track = np.zeros(total_samples, dtype=np.float32)
for chime_t in [7.2, 7.8, 8.4, 9.0]:
    c_idx = int(chime_t * SR)
    c_len = int(0.6 * SR)
    t_c = np.linspace(0, 0.6, c_len)
    bell = (np.sin(2 * np.pi * 1760 * t_c) + np.sin(2 * np.pi * 2637 * t_c)) * np.exp(-t_c * 8)
    end_bell = min(total_samples, c_idx + c_len)
    bed_track[c_idx:end_bell] += bell[:end_bell - c_idx] * 0.25

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

# Write voice.wav
voice_wav = os.path.join(out_dir, 'voice.wav')
voice_int = (np.clip(voice_track, -1.0, 1.0) * 32767).astype(np.int16)
with wave.open(voice_wav, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(voice_int.tobytes())

# Write bed.wav
bed_wav = os.path.join(out_dir, 'bed.wav')
bed_stereo = np.column_stack([bed_track, bed_track])
bed_int = (np.clip(bed_stereo, -1.0, 1.0) * 32767).astype(np.int16)
with wave.open(bed_wav, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(bed_int.tobytes())

# Write full mixed.wav
mixed_wav = os.path.join(out_dir, 'mixed.wav')
mix_track = np.clip(voice_track + bed_track * 0.6, -1.0, 1.0)
mix_stereo = np.column_stack([mix_track, mix_track])
mix_int = (mix_stereo * 32767).astype(np.int16)
with wave.open(mixed_wav, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(mix_int.tobytes())

print(f"Neural audio ({VOICE}) for 03 generated successfully:")
print(" - voice.wav:", os.path.getsize(voice_wav), "bytes")
print(" - bed.wav:", os.path.getsize(bed_wav), "bytes")
print(" - mixed.wav:", os.path.getsize(mixed_wav), "bytes")

# Mux directly into out/ videos if present
out_base = os.path.join(os.path.dirname(__file__), 'out')
for target_name in ['preview_03.mp4', '03_shopping_cart_preview.mp4']:
    target_path = os.path.join(out_base, target_name)
    if os.path.exists(target_path):
        temp_target = os.path.join(out_base, f"temp_mux_{target_name}")
        subprocess.run([
            "ffmpeg", "-y",
            "-i", target_path,
            "-i", mixed_wav,
            "-map", "0:v:0",
            "-map", "1:a:0",
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            temp_target
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        if os.path.exists(temp_target):
            os.replace(temp_target, target_path)
            print(f"Muxed fresh neural audio directly into {target_name}!")
