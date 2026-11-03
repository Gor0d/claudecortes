---
name: fix-video
description: This skill should be used when a Toon Story Studio video already exists and the user wants changes, e.g. "change shot 5", "the captions are too big", "make the characters' outlines thicker", "swap the banker's suit color", "the camera is too fast", "add a sound effect", "music is too loud", "make a 9:16 version", "re-render in 4K", or "redo the ending". It applies targeted revisions without rerunning the whole pipeline.
metadata:
  version: "0.1.0"
---

# Toon Story Studio: Fix Video

Shared references are in `../channel-setup/references/` relative to this skill's base directory. Follow the operating rules in `../channel-setup/SKILL.md`.

## Steps

1. Identify the project and video (`CLAUDE.md` `Current STATE` line, or the most recent `src/videos/<slug>/`). If several are plausible, ask which one.
2. Read `style/LOCKED.md`, `stack-and-rules.md` (A2) and the reference file that covers the change.
3. Classify the request and change only what it needs:

| Request | Where to change it | Scope |
|---|---|---|
| One shot (action, camera, framing, prop) | That shot's component and its `shotlist.json` entry | This video |
| Timing or cut points | `shotlist.json`, snapped to `words.json` | This video |
| Captions (size, position, emphasis) | `WordCaptions` or `emphasis` lists (A7) | Ask: this video or channel-wide? |
| Character look (outfit, color, outline) | `cast.ts` / `Character.tsx` | Channel-wide: log in `LOCKED.md` |
| Overall look (palette, lighting, depth of field) | `engine/` and set files | Channel-wide: log in `LOCKED.md` |
| Audio (music level, SFX) | `Video.tsx` audio layers (A9) | This video |
| Format or resolution | Composition config and render flags (A10) | This video |
| Script or VO change | Return to the `new-video` skill at STATE 4 or 5 | This video |

4. When a change is channel-wide, warn that it also affects every future video, and that past videos only change if re-rendered.
5. Render a before/after still of each affected shot (`out/<slug>_fix_[shot]_compare.png`) and show it.
6. After approval, re-render the preview (or the final, if the video was already finished) and re-run the A11 checklist.

End with:

> ✅ Fix applied: [what changed]. Approve to re-render the full video, or send more changes.
