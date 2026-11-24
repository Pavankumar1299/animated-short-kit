import argparse
import asyncio
import os
import subprocess
import wave
import numpy as np
import edge_tts

SR = 44100
TOTAL_DUR = 10.0
total_samples = int(SR * TOTAL_DUR)

VOICES = {
    "guy": "en-US-GuyNeural",               # Energetic, viral YouTube shorts narrator
    "christopher": "en-US-ChristopherNeural", # Deep, cinematic documentary narrator
    "jenny": "en-US-JennyNeural",           # Clear, bright narrative female
    "aria": "en-US-AriaNeural",             # Expressive, dynamic female
    "brian": "en-US-BrianNeural",           # Casual, modern storytelling male
    "roger": "en-US-RogerNeural"            # Mature, authoritative cinematic male
}

async def synthesize_phrase(text: str, voice: str, out_path: str, rate="+5%"):
    comm = edge_tts.Communicate(text, voice, rate=rate)
    await comm.save(out_path)

def generate_voice_track(phrases, voice="en-US-GuyNeural", video_id="04_speed_car"):
    out_dir = f"public/{video_id}"
    os.makedirs(out_dir, exist_ok=True)
    
    voice_track = np.zeros(total_samples, dtype=np.float32)
    
    for i, (text, t_start) in enumerate(phrases):
        mp3_path = f"{out_dir}/temp_{i}.mp3"
        wav_path = f"{out_dir}/temp_{i}.wav"
        
        asyncio.run(synthesize_phrase(text, voice, mp3_path))
        
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
        
    out_voice_wav = f"{out_dir}/voice.wav"
    v_int = (np.clip(voice_track, -1.0, 1.0) * 32767).astype(np.int16)
    with wave.open(out_voice_wav, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(v_int.tobytes())
        
    print(f"Synthesized neural voice '{voice}' -> {out_voice_wav}")
    return voice_track

def mux_video(video_id, voice_track):
    bed_path = f"public/{video_id}/bed.wav"
    if os.path.exists(bed_path):
        with wave.open(bed_path, 'rb') as w:
            frames = w.readframes(w.getnframes())
            bed = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
            bed = bed.reshape(-1, 2)[:, 0]
            if len(bed) < total_samples:
                bed = np.pad(bed, (0, total_samples - len(bed)))
            else:
                bed = bed[:total_samples]
    else:
        bed = np.zeros(total_samples, dtype=np.float32)
        
    mix = np.clip(voice_track + bed * 0.7, -1.0, 1.0)
    mix_stereo = np.column_stack([mix, mix])
    mix_int = (mix_stereo * 32767).astype(np.int16)
    
    mix_path = f"public/{video_id}/mixed.wav"
    with wave.open(mix_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(mix_int.tobytes())
        
    # Mux into out/preview_<id>.mp4
    video_num = video_id.split('_')[0]
    out_mp4 = f"out/preview_{video_num}.mp4"
    if not os.path.exists(out_mp4):
        out_mp4 = f"out/preview_{video_id}.mp4"
        
    if os.path.exists(out_mp4):
        temp_mp4 = f"out/temp_mux_{video_num}.mp4"
        subprocess.run([
            "ffmpeg", "-y",
            "-i", out_mp4,
            "-i", mix_path,
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            temp_mp4
        ], check=True)
        if os.path.exists(temp_mp4):
            os.replace(temp_mp4, out_mp4)
            print(f"Muxed fresh audio directly into {out_mp4}!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download and apply real neural voice narration.")
    parser.add_argument("--voice", default="guy", help="Voice choice: guy, christopher, jenny, aria, brian, roger or full ShortName")
    parser.add_argument("--video", default="04_speed_car", help="Target video ID")
    args = parser.parse_args()
    
    v_name = VOICES.get(args.voice.lower(), args.voice)
    
    if args.video == "04_speed_car":
        phrases = [
            ("He bragged his speedster could outrun anything on wheels.", 0.25),
            ("Until he swerved straight into a century-old oak.", 3.50),
            ("The tree did not even lose a single leaf.", 6.30)
        ]
    elif args.video == "03_shopping_cart":
        phrases = [
            ("He paid complete strangers to push empty carts around his store.", 0.25),
            ("Real customers refused, mocking them as ridiculous baby carriages.", 3.60),
            ("Until the trick worked, sparking a billion dollar shopping revolution.", 7.00)
        ]
    else:
        phrases = [
            ("He sold three jewelry stores just to build a machine that cuts bread.", 0.3),
            ("And every baker in town said he had lost his mind.", 3.78)
        ]
        
    v_track = generate_voice_track(phrases, voice=v_name, video_id=args.video)
    mux_video(args.video, v_track)
