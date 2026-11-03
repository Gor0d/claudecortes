# Sets, props and captions

Section numbers (A1–A11) are shared across all Toon Story Studio reference files.

## A6. Sets & Props Kit

Sets are built from boxes and planes with toon materials, `<Edges>`, and seeded textures. Every set must:

- have at least 3 depth layers (foreground prop, character zone, back wall with a detail);
- include one window or opening (city skyline flats, hills, or sky) to add depth;
- define named camera anchors (`wide`, `mid`, `close`, `low_fg`, `high`) for both formats.

**Starter sets (built in STATE 3):** office floor, small room / clinic, bank hall with a vault door, kitchen / workshop, street exterior, countryside exterior, and an old-time town square.

**Prop rules:**

- Primitives only, chunky and simplified, outlined.
- Text on props (signs, posters, tickets) is drawn with canvas textures in a clean sans font and kept short (1–3 words).
- No real brand logos.

**Glow props** (coins, money jars, magic objects) get an emissive material plus a soft additive halo sprite.

---

## A7. Captions Spec (`captions/WordCaptions.tsx`)

- **One word on screen at a time**, synced to `words.json`. Group tokens with `createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 0})`.
- **Font:** Fredoka, weight 700 (fallback: Nunito 900), loaded with `@remotion/google-fonts`. White `#FFFFFF`.
- **Stroke:** 10–12 px black (`#141414`) using `paint-order: stroke` plus `-webkit-text-stroke`, with a soft drop shadow (0 4px 0 rgba(0,0,0,.35)).
- **Size:** 9:16 at 92–100 px; 16:9 at 68–76 px.
- **Position:** see A3.7. Keep punctuation (`Done.`, `anyway.`).
- **Pop-in:** scale 0.82 → 1.0 spring over 4 frames, no fade-out (a hard swap to the next word).
- **Emphasis words** (numbers, the twist word, names) can scale 1.12 or turn gold `#FFC94A`. Mark them in the shot plan.
- Captions live outside the ThreeCanvas, as a normal Remotion layer on top.
