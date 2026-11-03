---
name: new-video
description: This skill should be used when the user wants to start a new Toon Story Studio video, e.g. "new toon video", "make a toon video about…", "give me toon story ideas", "write the script for this toon story", "here's my ElevenLabs voiceover", "sync my voiceover", "timestamp the VO", or "plan the shots". It runs STATE 4–6: topic and script, voiceover handoff and word timestamps, and the shot plan.
metadata:
  version: "0.1.0"
---

# Toon Story Studio: New Video (STATE 4–6)

Shared references are in `../channel-setup/references/` relative to this skill's base directory. Follow the operating rules in `../channel-setup/SKILL.md`: one STATE at a time, an approval line at the end of each, and every decision logged in `style/LOCKED.md`.

## Before starting

Find the project (a folder with `style/MODEL_BRIEF.md`). If none exists, or `style/LOCKED.md` shows the style was never locked, say setup comes first and switch to the `channel-setup` skill. Read `style/MODEL_BRIEF.md` and `style/LOCKED.md`.

## STATE 4: Topic and script

1. Read `script-and-voice.md` (A8).
2. Ask: **Short or long-form?** Any topic in mind?
3. With no topic given, pitch 5 story ideas from the A8.5 lanes. Each gets a working title, the hook line, and why it's surprising. Each must be verified true and not already covered by the reference channel in the Model PDF.
4. After the user picks one, research it and write the script with the A8.2 formula and A8.3 rules.
5. Output: title plus 2 alternatives; the script with beats labeled; word count and estimated duration; a sources list with links; flagged emphasis words.
6. Save `src/videos/<slug>/script.md`. Set `Current STATE: 4 (<slug>)` in `CLAUDE.md`.

End with:

> ✅ STATE 4 done: script ready ([n] words, ~[x] s). Approve it, or send edits before I move to STATE 5 (voiceover).

## STATE 5: Voiceover (ElevenLabs)

1. Output the clean VO block (A9) for copy-paste into ElevenLabs, with the delivery notes and the locked voice and settings from `style/LOCKED.md`. If no voice is locked yet, give the A9 starting settings and ask the user to record the voice they choose.
2. Wait for the MP3. Save it as `public/audio/<slug>/vo.mp3` (long-form: `vo_01.mp3`, `vo_02.mp3`…).
3. Build `public/audio/<slug>/words.json` with the A9 timestamp steps, snapping every word to the approved script text.
4. Report the real duration, words the VO skipped or changed, and pacing problems (e.g. a sentence rushed under 0.25 s per word).

End with:

> ✅ STATE 5 done: VO synced ([x] s, [n] words aligned). Approve to move to STATE 6 (shot plan), or re-upload a new take.

## STATE 6: Shot plan

1. Read `style-bible.md` (A3.6–A3.7) and `shotlist-schema.md`.
2. Break the timeline into shots, cutting on clause boundaries at the A3.6 shot lengths. Each sentence gets at least one shot; the hook and twist may get two.
3. Write `src/videos/<slug>/shotlist.json`.
4. Present the plan as a table: #, time, line, set, cast and action, camera per format, notes. Call out new props or sets the story needs; they get built in STATE 7.
5. Set `Current STATE: 7 (<slug>)`.

End with:

> ✅ STATE 6 done: [n] shots planned. Approve the shot plan, then say "render the toon video" to start building (STATE 7).
