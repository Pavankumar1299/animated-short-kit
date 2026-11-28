#!/usr/bin/env python3
"""Scans code/public/models/ for .glb files and prints ready-to-paste <GlbProp /> JSX snippets."""
import os

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "public", "models")

def main():
    if not os.path.exists(MODELS_DIR):
        print(f"Created models folder at: {os.path.abspath(MODELS_DIR)}")
        os.makedirs(MODELS_DIR, exist_ok=True)
        return

    glb_files = []
    for root, _, files in os.walk(MODELS_DIR):
        for f in sorted(files):
            if f.lower().endswith(".glb"):
                rel = os.path.relpath(os.path.join(root, f), os.path.join(MODELS_DIR, "..")).replace("\\", "/")
                glb_files.append(rel)

    if not glb_files:
        print("No .glb files found in code/public/models/ yet. Drop your CC0 .glb files there!")
        return

    print(f"Found {len(glb_files)} .glb models ready for set.tsx:\n")
    for rel in glb_files:
        size_hint = 'targetLength={4.2}' if 'car' in rel.lower() else 'targetHeight={4.5}'
        print(f'<GlbProp src="{rel}" position={{[0, 0, 0]}} {size_hint} />')

if __name__ == "__main__":
    main()
