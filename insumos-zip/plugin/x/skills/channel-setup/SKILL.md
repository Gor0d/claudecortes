---
name: channel-setup
description: This skill should be used when the user wants to start a Toon Story Studio channel or project, e.g. "set up the toon studio", "start a new toon channel", "here's my model PDF", "install the 3D cartoon stack", "lock the toon style", "make a 4-second style test", "build the cast", "build the sets", or "change the character style". It runs the one-time stages STATE 0–3: model PDF intake, stack setup, style lock, and the cast, sets and props library.
metadata:
  version: "0.1.0"
---

# Toon Story Studio: Channel Setup (STATE 0–3)

These stages run once per channel, and again only when the look changes. Videos are then made with the `new-video` and `render-video` skills.

All shared references live in `references/` next to this file. Section numbers A1–A11 are used across every file:

| File | Sections |
|---|---|
| `stack-and-rules.md` | A1 stack, setup commands, folder structure · A2 render rules |
| `style-bible.md` | A3 line, shading, palette, lighting, post FX, textures, camera, composition |
| `characters-and-motion.md` | A4 character construction and face system · A5 animation library |
| `sets-and-captions.md` | A6 sets and props · A7 captions |
| `script-and-voice.md` | A8 script style · A9 voiceover and timestamps |
| `output-and-qc.md` | A10 output specs · A11 QC checklist |
| `shotlist-schema.md` | Shot plan format |

## Operating rules (every stage, every skill)

- Work one STATE at a time. Never skip ahead.
- End every STATE with its approval line, then stop and wait for the user's reply.
- Treat A2 (render rules) as non-negotiable in all code.
- When the user's feedback changes a style or rule decision, append it to `style/LOCKED.md` immediately. `LOCKED.md` overrides the references; the approved Model Brief overrides the reference defaults.
- Keep the project's `CLAUDE.md` `Current STATE:` line up to date.

## Locate or create the project

Look for a folder containing `style/MODEL_BRIEF.md` or a `CLAUDE.md` that mentions Toon Story Studio. If one exists, read its `Current STATE:` line and resume there. Otherwise ask where to create the project (default: a new `toon-studio/` folder in the working directory) and start at STATE 0.

## STATE 0: Model PDF

Ask:

> Upload your Model PDF. It will guide everything this studio creates. Ideally it includes:
> 1. 4–10 style frames (screenshots) of the look you want, in 9:16 and 16:9 if you have them
> 2. 1–3 transcripts of reference videos whose storytelling you want to match
> 3. Any notes: channel name, characters, colors, topics to avoid, voice choice

After upload:

1. Read every page. Extract the frames into `model/`.
2. Write `style/MODEL_BRIEF.md` covering line, shading and palette (hex values sampled from the frames); character anatomy and face system; environments, lighting, camera and depth of field; caption look; the storytelling formula from the transcripts; and every place the PDF differs from the references, with the direction chosen.
3. Show a summary of the brief.

End with:

> ✅ STATE 0 done: Model Brief ready. Approve it, or tell me what to change before I move to STATE 1 (stack setup).

## STATE 1: Stack setup and verification

1. Read `references/stack-and-rules.md`. Run the A1 setup commands, add `remotion.config.ts` and the folder structure.
2. Write the project `CLAUDE.md`:
   > This is a Toon Story Studio project. Use the Toon Story Studio skills. Render rules (A2) are mandatory. Read style/MODEL_BRIEF.md and style/LOCKED.md before any visual work.
   > Current STATE: 1
3. Build `src/engine/`: `rng.ts`, `toon.ts`, `timing.ts` (seconds→frames, shot timing), `camera.ts` (anchors, push-in, drift, punch-in, whip, orbit), `Stage.tsx` (ThreeCanvas, lights, shadows) and `fx.tsx` (depth of field, bloom, vignette).
4. Smoke test: 3 s of an outlined toon sphere on a textured floor with a camera push-in, rendered to `out/smoke_9x16.mp4` and `out/smoke_16x9.mp4`.
5. Render one frame twice and compare the files to confirm determinism.

End with:

> ✅ STATE 1 done: stack installed, smoke test rendered in both formats. Approve to move to STATE 2 (style lock test).

## STATE 2: Style lock (4-second test)

1. Read `style-bible.md` and `characters-and-motion.md`. Build a minimal `<Character>` (the Everyman template) and one set (small room or office) following them and the Model Brief.
2. Write a 4-second test shot: the character idles and blinks; at 1.5 s turns to camera with `smile`, then `point`; the camera slowly pushes in with depth of field; placeholder one-word captions play ("This", "is", "the", "look.").
3. Render `out/styletest_v1_9x16.mp4` and `out/styletest_v1_16x9.mp4`.
4. Render a side-by-side still of the test frame next to the closest model frame: `out/styletest_v1_compare.png`.
5. Self-critique against the model frames: outline weight, head ratio, face features, shading steps, palette, depth of field strength, lighting warmth, caption look.
6. Iterate (v2, v3…) on each round of notes. After every round, append the decided values to `style/LOCKED.md` (e.g. "Outline 2.8% R", "Head ratio 38%", "DOF bokehScale 3").

End each round with:

> ✅ STATE 2 round [n]: here's the test and comparison. Approve the look to lock it and move to STATE 3, or give me fixes for the next round.

## STATE 3: Cast, sets and props library

1. Build the full `<Character>`: all poses, expressions and motions from A5, plus hats, glasses and clothing details.
2. Propose the recurring cast (A4.4 templates or the user's own), each with a name and a one-line personality. Write them to `src/characters/cast.ts`.
3. Render a cast sheet: each character in front and ¾ view with 4 expressions (`out/cast_sheet.png`).
4. Render a 12 s motion reel: walk, nod, gasp, point, jump, talk (`out/motion_reel_16x9.mp4`).
5. Read `sets-and-captions.md`. Build the A6 starter sets with camera anchors. Render one still per set per format (`out/sets_sheet_9x16.png`, `out/sets_sheet_16x9.png`).
6. Log approved cast and set decisions in `style/LOCKED.md`. Set `Current STATE: 4`.

End with:

> ✅ STATE 3 done: cast sheet, motion reel and sets are ready. Approve to finish setup. Then say "new toon video" to start your first video (STATE 4).
