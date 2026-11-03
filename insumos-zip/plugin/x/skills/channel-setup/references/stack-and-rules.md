# Stack, setup and render rules

Section numbers (A1–A11) are shared across all Toon Story Studio reference files.

## A1. Stack

| Layer | Tool | Job |
|---|---|---|
| Brain | Claude Code (Opus) | Script, shot plan, all code, renders, QC |
| 3D | three, @react-three/fiber, @react-three/drei | Characters, sets, props, outlines |
| Post FX | @react-three/postprocessing | Bloom, depth of field, vignette |
| Video | remotion, @remotion/cli, @remotion/three | Frame-accurate timeline, rendering, audio |
| Captions | @remotion/captions, @remotion/google-fonts | One-word kinetic captions |
| Timing | @remotion/install-whisper-cpp (+ ffmpeg) | Word-level timestamps from the VO |
| Voice | ElevenLabs (user generates, uploads MP3) | Narration |

Remotion is free for individuals and companies of up to 3 people, including commercial use.

### Setup commands (run in STATE 1)

```bash
npx create-video@latest .            # choose: Blank, TypeScript
npx remotion add @remotion/three
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
npm i -D @types/three
npx remotion add @remotion/captions
npx remotion add @remotion/google-fonts
npx remotion add @remotion/install-whisper-cpp
# ffmpeg must be installed (macOS: brew install ffmpeg; Windows: winget install ffmpeg)
```

If 3D frames render black, flicker, or crawl, set the OpenGL renderer in `remotion.config.ts`:

```ts
import {Config} from '@remotion/cli/config';
Config.setChromiumOpenGlRenderer('angle');
```

### Folder structure

```
toon3d/
├─ CLAUDE.md                 ← project pointer: "Use Toon Story Studio; obey style/LOCKED.md; current STATE"
├─ model/                    ← Model PDF + extracted frames/notes
├─ style/
│  ├─ MODEL_BRIEF.md         ← STATE 0 output
│  └─ LOCKED.md              ← every approved style decision, appended over time
├─ src/
│  ├─ Root.tsx               ← registers compositions (9:16 + 16:9 per video)
│  ├─ engine/                ← rng.ts, toon.ts, timing.ts, camera.ts, Stage.tsx, fx.tsx
│  ├─ characters/            ← Character.tsx, Face.tsx, cast.ts, poses.ts, motions.ts
│  ├─ props/                 ← one file per prop
│  ├─ sets/                  ← one file per environment
│  ├─ captions/              ← WordCaptions.tsx
│  └─ videos/<slug>/         ← script.md, shotlist.json, Video.tsx, shots/
├─ public/
│  ├─ audio/<slug>/vo.mp3    ← ElevenLabs upload
│  ├─ audio/<slug>/words.json← timestamps
│  ├─ music/  sfx/           ← optional, user-supplied
│  └─ textures/              ← only if generated to disk
└─ out/                      ← tests, contact sheets, final MP4s
```

---

## A2. Non-negotiable render rules

1. **All motion comes from `useCurrentFrame()`.** Never use R3F's `useFrame`, `requestAnimationFrame`, CSS transitions, `Date.now()`, or `performance.now()` for animation. Anything that moves by itself flickers in the render.
2. **Wrap 3D in `<ThreeCanvas width={width} height={height}>`**, with sizes taken from `useVideoConfig()`.
3. **Every `<Sequence>` inside a ThreeCanvas gets `layout="none"`.**
4. **Always include lights:** a hemisphere or ambient light plus one directional key. A scene with no lights renders black.
5. **No unseeded randomness.** Use `mulberry32(seed)` from `engine/rng.ts` for every random value: textures, crowd placement, wobble.
6. **Write time in seconds, convert with `fps`.** Example: `interpolate(frame, [1.2*fps, 1.6*fps], ...)`. Never hard-code frame numbers in shot logic.
7. **Load assets through `staticFile()`.** Anything async must use `delayRender`/`continueRender`.
8. **Post FX must be static or frame-driven.** No animated noise or grain unless its seed is the frame number.
9. **One shot = one component.** Shots receive `start`/`duration` from `shotlist.json` and never hard-code timing.
10. **Both formats come from the same shots.** Each shot defines a camera for `9x16` and for `16x9` (see A3.6–A3.7). There is never a separate edit per format.

```ts
// src/engine/rng.ts
export const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
```
