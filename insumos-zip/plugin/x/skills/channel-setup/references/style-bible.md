# Visual style bible

Section numbers (A1–A11) are shared across all Toon Story Studio reference files.

## A3. Visual Style Bible

**Big idea:** flat, inked cartoon characters living inside real 3D rooms. It reads like a hand-drawn 2D cartoon until the camera moves and you get parallax, depth of field, and real light. Warm, cozy, clean, friendly.

### A3.1 Line and shading

- **Outlines:** solid near-black `#141414` on every character part and on all main prop and set edges.
  - Characters: inverted-hull outline (drei `<Outlines>`), thickness ≈ **2.5–3% of head radius**.
  - Sets and props: drei `<Edges>` (threshold 15–20°) plus `<Outlines>` on rounded props.
- **Shading:** cel / toon. Use `MeshToonMaterial` with a **3-step gradient map** (shadow 0.62, mid 0.85, light 1.0) and nearest filtering. Shadows are soft color steps, never black.
- **Specular:** none on characters. Small, soft highlights only on metal and glass props (vault door, lamp shade, glasses lenses if visible).
- **Ground contact:** soft blob or real soft shadow under every character. Floating characters are a fail.

```ts
// src/engine/toon.ts
import * as THREE from 'three';
export const makeToonGradient = (steps = [0.62, 0.85, 1]) => {
  const data = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => {
    const c = Math.round(v * 255);
    data.set([c, c, c, 255], i * 4);
  });
  const tex = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
};
// Create ONE gradient at module level and share it across all toon materials.
```

### A3.2 Palette (defaults; the Model Brief may override)

| Role | Hex |
|---|---|
| Outline | `#141414` |
| Skin: peach / tan / brown / deep | `#F4D2A6` / `#D9A06B` / `#B8743F` / `#7E4E2B` |
| Cheek blush | `#F09A92` at 45% opacity |
| Hair: black / dark brown / gray | `#1C1C1C` / `#4A3226` / `#BFC6CE` |
| Teal hoodie | `#2F9E9A` |
| Mustard sweater | `#F2B233` |
| Navy suit / red tie / white shirt | `#22408F` / `#E2482F` / `#F6F4EE` |
| Lavender knit | `#B6ADE6` |
| Sage beanie | `#6FAA7C` |
| Lab coat | `#F7F7F4` with teal collar `#2F9E9A` |
| Warm walls: beige / butter / cream | `#E8D3B8` / `#F3D98B` / `#EEE7DB` |
| Wood: floor / desk | `#B7834F` / `#8E5A33` |
| Felt / lamp green | `#4C8A4A` / `#6FD69A` |
| Glow gold | `#FFC94A` |
| Sky through windows | `#9CC7EE` to `#D9ECFA` gradient |

Saturation is medium. Nothing neon, except glow moments (coins, magic, a reveal).

### A3.3 Lighting

- **Interiors:** warm key directional light (`#FFE6C4`, intensity 1.6) from upper side, with soft PCF shadows (map 2048). Add a hemisphere light (sky `#FFF4E2`, ground `#B79A7A`, 0.9) and a weak cool rim (`#CFE3FF`, 0.4) from behind.
- **Exteriors:** sun key (`#FFF1D6`) plus a sky hemisphere. Night scenes get a cool moon key (`#B9C8FF`), a purple-blue hemisphere, and warm practical lights.
- **Practicals:** lamps, screens, and coins use emissive materials so bloom picks them up.

### A3.4 Post FX (in `engine/fx.tsx`)

- **Depth of field:** always on for character shots. Focus is on the speaking or acting character, and background walls are noticeably soft. This is a key part of the look.
- **Bloom:** threshold ~0.85, low intensity. Only emissive things glow.
- **Vignette:** subtle (darkness 0.35).
- **Optional paper grain on walls:** baked into the wall texture, never as an animated overlay.

### A3.5 Textures

Walls and floors get **procedural canvas textures** generated with the seeded RNG. These include a soft mottled paper/plaster grain, faint wood planks, and checker tiles. All textures are low contrast so characters always pop.

### A3.6 Camera language

- **Lens:** use FOV 28–35 for character shots (long-lens feel, flattering, strong blur). Use FOV 40–50 for establishing rooms.
- **Movement:** every shot moves, slowly.
  - Default: slow push-in (5–10% closer over the shot) or a gentle lateral drift (parallax).
  - Never a static camera for more than 1.5 s.
- **Angles:**
  - Eye level for dialogue.
  - Low angle over a foreground prop for "object" beats (a pot, a desk, a ticket).
  - High wide angle for crowds and big reveals (shelves stretching to the ceiling).
- **Accents:** a punch-in (fast 12-frame ease to a close-up) on the twist line. Occasionally a whip-pan transition between locations.
- **Cuts:** hard cuts on clause or sentence boundaries. Shot length is **1.5–3.5 s** for Shorts and **2.5–5 s** for long-form.

### A3.7 Composition per format

| | 9:16 (1080×1920) | 16:9 (1920×1080) |
|---|---|---|
| Subject | Centered; head in upper third | Rule of thirds; two-character staging side by side |
| Two characters | Stack in depth (one near, one far, DOF switch) or use tighter singles | Side by side, facing each other at an angle |
| Foreground | Strong foreground prop at the bottom for depth | Lighter foreground |
| Caption zone | Middle band (y ≈ 50–60%): keep faces above it | Lower band (y ≈ 82–88%) |
