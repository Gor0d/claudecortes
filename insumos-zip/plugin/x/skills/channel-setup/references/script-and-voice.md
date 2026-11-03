# Script style guide and voiceover spec

Section numbers (A1–A11) are shared across all Toon Story Studio reference files.

## A8. Script Style Guide (curiosity stories)

### A8.1 Formats

- **Shorts:** 40–58 s, about 120–150 words.
- **Long-form:** 8–12 min, built from 4–7 story "chapters". Each chapter is a complete mini-story using the same formula, joined by a running thread ("…and that wasn't even the strangest one.").

### A8.2 The formula

| Beat | Rule |
|---|---|
| 1. **Hook** | One sentence, ≤ 15 words, a true claim that sounds impossible. Starts mid-idea. No greetings, no "Did you know". |
| 2. **Drop-in** | Put the viewer inside it: "Imagine you…", or a concrete scene with a person and place. |
| 3. **Escalation** | 4–7 short sentences. **Each sentence = one drawable action** (who does what to which object). Include sounds, numbers, and physical details. |
| 4. **Doubt beat** | Someone thinks it's crazy, wrong, or a joke. This creates tension. |
| 5. **"You see,"** | The explanation: the hidden logic that makes it work. |
| 6. **Twist / closer** | One line that reframes the hook, ideally a callback or wordplay. It lands on the final shot. |

### A8.3 Writing rules

- Grade 5–7 reading level. Most sentences are 6–14 words. Present tense where possible.
- Concrete nouns over abstractions ("a jar of gold coins", not "savings").
- No filler transitions ("so basically", "in conclusion").
- No "subscribe" lines in Shorts.
- **Every fact must be true.** Claude lists its sources in the STATE 4 output, never in the VO.
- **Originality:** never rewrite a story that a reference channel already covered. Same formula, different stories.

### A8.4 Title patterns

- "The [Place/Thing] That [Unexpected Verb]"
- "Why [Group] Keep [Surprising Result]"
- "He/She Could [Skill] Just by [Simple Act]"
- "The [Job/Rule] Nobody [Expected Verb]"
- "[Thing A] vs [Thing B]"

Titles are 3–8 words, no clickbait lies, and the title's promise is paid off by the closer.

### A8.5 Topic lanes

Money loopholes, banks and odd collateral, weird laws, historical tricks and traps, inventions with accidental origins, cons that got caught, strange jobs, and how a famous rule or tradition started.

---

## A9. Voiceover Spec (ElevenLabs)

**Claude's job** is to deliver a **clean VO script block**:

- spoken words only;
- line breaks where a breath pause belongs;
- an ellipsis `…` for a dramatic pause;
- no stage directions inside the block.

Under the block, Claude lists the delivery notes.

**Suggested ElevenLabs direction:**

- **Voice:** warm, curious, conversational storyteller. Smiling delivery with a slight playful edge on the twist.
- **Pace:** about 165 wpm. A Short should land at 40–58 s.
- **Settings to start from:** Stability ~0.45, Similarity ~0.75, Style ~0.2, Speaker Boost on. Use the most natural storytelling model available in your account.
- **Lock it:** keep the same voice for every video, for channel consistency. Record the voice name and settings in `style/LOCKED.md`.

**Handoff:**

- The user exports **MP3 (44.1 kHz)** and uploads it as `public/audio/<slug>/vo.mp3`.
- For long-form, one MP3 per chapter is fine (`vo_01.mp3` …).

**Timestamps:**

1. Convert the MP3 to 16 kHz mono WAV with ffmpeg.
2. Run whisper.cpp (`medium.en`) with token-level timestamps and convert the result with `toCaptions()`.
3. **Snap every word to the approved script text**, correcting Whisper's spelling.
4. Save the result as `words.json`.

The video duration is computed from the VO length plus a 0.6 s tail.

**Music & SFX (optional):**

- The user supplies files in `public/music` and `public/sfx`.
- Music bed sits about 18–22 dB under the VO and ducks further under dense lines.
- SFX are light: pops on prop appear, whooshes on whip-pans, a "ding" on the twist, a hammer tap, a vault creak.
- If no files are supplied, render VO-only and list the suggested SFX cues in the shot plan.
