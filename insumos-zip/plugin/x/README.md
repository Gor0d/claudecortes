# Toon Story Studio

Make round-head 3D cartoon story videos entirely in code. The look is inked toon characters inside real 3D rooms, with depth of field, warm light and one-word captions. Scripts are curiosity stories timed to your voiceover. Built on Three.js (React Three Fiber) and Remotion. Renders 9:16 Shorts and 16:9 long-form.

## Requirements

- Claude Code (or a Claude session with a shell) working in a local folder
- Node.js 18+ and ffmpeg
- Voiceover from ElevenLabs or any TTS/recording, uploaded as MP3
- Remotion is free for individuals and companies of up to 3 people; larger companies need a Remotion company license

## Skills

| Skill | Stages | Say something like |
|---|---|---|
| `channel-setup` | STATE 0–3: model PDF, stack install, 4-second style lock, cast/sets library | "set up the toon studio" |
| `new-video` | STATE 4–6: story ideas and script, voiceover sync, shot plan | "new toon video about…" |
| `render-video` | STATE 7–9: build shots with contact sheets, previews, final render and upload package | "render the toon video" |
| `fix-video` | Targeted revisions after a video exists | "change shot 5", "captions are too big" |

Every stage ends with an approval step. Style decisions are saved to `style/LOCKED.md` in the project, so the look stays consistent from video to video.

## First run

1. Prepare a model PDF: 4–10 screenshots of the look you want, 1–3 transcripts of reference videos, and any notes.
2. Say "set up the toon studio" and upload the PDF when asked.
