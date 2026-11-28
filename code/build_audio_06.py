import asyncio, json, os, wave, struct, math, subprocess
import edge_tts

OUT_DIR = os.path.join("public", "06_raising_chicago")
os.makedirs(OUT_DIR, exist_ok=True)

PHRASES = [
    ("mud", 0.1, "In 1856, this entire city was sinking into thick, smelly mud, and nobody could even cross the street."),
    ("mockery", 5.8, "When a young engineer said he'd lift the whole town ten feet up, the mayor laughed: You're completely crazy!"),
    ("jacks", 12.0, "So he hired six hundred men with six thousand screw jacks, and they cranked entire brick buildings straight into the sky."),
    ("dinner", 19.3, "The wildest part? People kept eating dinner inside, never spilling a single drop of soup!"),
    ("city", 25.0, "By 1860, every house stood ten feet higher, and Chicago became one of the greatest cities on earth.")
]

VOICE = "en-US-GuyNeural"
RATE = "+14%"

async def gen_phrase(idx, text):
    mp3 = f"temp6_p{idx}.mp3"
    wav = f"temp6_p{idx}.wav"
    comm = edge_tts.Communicate(text, VOICE, rate=RATE)
    await comm.save(mp3)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-ar", "44100", "-ac", "1", wav], check=True)
    return wav

def read_wav(path):
    with wave.open(path, "rb") as w:
        sr = w.getframerate()
        n = w.getnframes()
        raw = w.readframes(n)
        return sr, list(struct.unpack(f"<{n}h", raw))

async def main():
    sr = 44100
    total_dur = 30.0
    total_samples = int(sr * total_dur)
    voice_buf = [0] * total_samples
    words_out = []

    for i, (shot, t_start, text) in enumerate(PHRASES):
        wav = await gen_phrase(i, text)
        _, samples = read_wav(wav)
        dur = len(samples) / sr
        start_idx = int(t_start * sr)
        for j, s in enumerate(samples):
            if start_idx + j < total_samples:
                voice_buf[start_idx + j] = s

        toks = text.split()
        dt = (dur - 0.15) / max(1, len(toks))
        for k, w in enumerate(toks):
            ws = round(t_start + k * dt, 2)
            we = round(ws + dt * 0.9, 2)
            words_out.append([w, ws, we])

        for f in (f"temp6_p{i}.mp3", f"temp6_p{i}.wav"):
            if os.path.exists(f):
                os.remove(f)

    voice_path = os.path.join(OUT_DIR, "voice.wav")
    with wave.open(voice_path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(struct.pack(f"<{total_samples}h", *voice_buf))

    # Warm upbeat acoustic/orchestral-feel bed (soft chord progression)
    bed_buf = [0] * total_samples
    chords = [(261.63, 329.63, 392.00), (220.00, 261.63, 329.63), (174.61, 220.00, 261.63), (196.00, 246.94, 293.66)]
    for idx in range(total_samples):
        t = idx / sr
        c = chords[int(t / 2.5) % len(chords)]
        val = sum(math.sin(2 * math.pi * f * t) for f in c) * 420
        env = min(1.0, t / 0.5, (total_dur - t) / 0.8)
        bed_buf[idx] = int(val * env)

    bed_path = os.path.join(OUT_DIR, "bed.wav")
    with wave.open(bed_path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(struct.pack(f"<{total_samples}h", *bed_buf))

    mixed_path = os.path.join(OUT_DIR, "mixed.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", voice_path, "-i", bed_path,
                    "-filter_complex", "amix=inputs=2:duration=first:weights=1 0.35", mixed_path], check=True)

    with open(os.path.join(OUT_DIR, "words.json"), "w") as f:
        json.dump(words_out, f, indent=2)

    print(f"Built 06_raising_chicago audio: {len(words_out)} words, {total_dur}s")

if __name__ == "__main__":
    asyncio.run(main())
