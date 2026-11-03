---
name: render-video
description: This skill should be used when the user wants to build or render a Toon Story Studio video after the shot plan is approved, e.g. "render the toon video", "build the shots", "show me the contact sheets", "preview the toon video", "do the final render", "render both formats", or "give me the YouTube package". It runs STATE 7–9: shot building in batches with contact-sheet QC, preview renders, and the final render with captions, thumbnails and upload package.
metadata:
  version: "0.1.0"
---

# Toon Story Studio: Render Video (STATE 7–9)

Shared references are in `../channel-setup/references/` relative to this skill's base directory. Follow the operating rules in `../channel-setup/SKILL.md`.

## Before starting

Work in the active project on the video named in `CLAUDE.md` (`Current STATE: … (<slug>)`); if several videos are open, ask which one. `src/videos/<slug>/shotlist.json` and `public/audio/<slug>/words.json` must exist; if not, switch to the `new-video` skill. Read `stack-and-rules.md` (A2), `style-bible.md`, `characters-and-motion.md`, `sets-and-captions.md`, `output-and-qc.md`, `style/MODEL_BRIEF.md` and `style/LOCKED.md` before writing any code.

## STATE 7: Build shots (batches with contact sheets)

1. Build any new props or sets from the shot plan first, following A6.
2. Write the shots in batches of 6–8. Each shot is its own component in `src/videos/<slug>/shots/`, reading its timing from `shotlist.json`.
3. After each batch, render a mid-frame still of every shot in both formats (`npx remotion still <comp> --frame=N`) and tile them with ffmpeg into `out/<slug>_sheet_b[n]_9x16.png` and `_16x9.png`.
4. Check the batch against A11 and fix issues before showing it.

End each batch with:

> ✅ STATE 7 batch [n]/[total]: contact sheets ready. Approve to continue to the next batch, or list shot fixes.

After the last batch:

> ✅ STATE 7 done: all shots built. Approve to move to STATE 8 (preview render).

## STATE 8: Preview render and revisions

1. Assemble `src/videos/<slug>/Video.tsx`: shots in `<Series>`/`<Sequence>`, the VO `<Audio>`, music and SFX if supplied (A9), and `WordCaptions` (A7). Register both compositions in `Root.tsx`.
2. Render fast previews, at half resolution (`--scale=0.5`) if needed: `out/<slug>_preview_9x16.mp4` and `_16x9.mp4`.
3. Run the full A11 checklist and report pass/fail per item.
4. Apply the user's notes, re-render only the affected shots, and repeat.

End with:

> ✅ STATE 8: previews ready, QC [x/10] passed. Approve for final render, or send revision notes.

## STATE 9: Final render and deliverables

1. Render at full quality per A10, in both formats.
2. Export `out/<slug>.srt` from `words.json` (sentence-level lines).
3. Save 3 thumbnail frames as PNGs: the strongest expression, the most surprising prop, the twist moment.
4. Write the upload package: final title, a 2-line description (hook plus an expanded fact), 3–5 hashtags, and chapter timestamps for long-form.
5. Append new lessons to `style/LOCKED.md`. Set `Current STATE: 4` so the next video starts fresh.

End with:

> ✅ STATE 9 done: final videos, captions, thumbnails and upload package are in `out/`. Approve to close this video. Say "new toon video" to start the next one.
