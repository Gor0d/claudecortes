# Output specs and QC checklist

Section numbers (A1–A11) are shared across all Toon Story Studio reference files.

## A10. Output Specs

| | Shorts | Long-form |
|---|---|---|
| Size | 1080×1920 and 1920×1080 (both rendered) | 1920×1080 (9:16 cutdowns optional) |
| FPS | 30 | 30 |
| Codec | H.264, CRF 18, AAC 192k | H.264, CRF 18, AAC 192k |
| Naming | `out/<slug>_9x16.mp4`, `out/<slug>_16x9.mp4` | `out/<slug>_16x9.mp4` |
| Extras | `<slug>.srt`, title, description, 3 thumbnail frames | Same, plus chapter timestamps |

---

## A11. QC Checklist (run before every preview and final render)

- [ ] No flicker: scrub the timeline back and forth, and confirm frame N renders identically twice.
- [ ] Every character has outlines, grounded shadows, and blinks; no limbs clip through the body.
- [ ] Faces are readable at phone size; the expression matches the line.
- [ ] DOF focus is on the acting character; the background is soft.
- [ ] No shot is static for longer than 1.5 s; cuts land on clause boundaries.
- [ ] Captions are synced to within ±2 frames, sit inside the caption zone, never cover faces in 9:16, and use emphasis words correctly.
- [ ] The 9:16 framing has no characters cut off at the sides; the 16:9 framing has no empty dead space.
- [ ] Colors stay inside the palette; nothing is neon unless it's a glow moment.
- [ ] Audio peaks below −1 dBFS; the VO is clear over music.
- [ ] Facts match the sources listed in STATE 4.
