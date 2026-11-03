# Character construction and animation library

Section numbers (A1–A11) are shared across all Toon Story Studio reference files.

## A4. Character Construction Spec

Characters are built entirely from primitives in a single `<Character>` component. Units are relative to **head radius R = 1**.

### A4.1 Proportions

| Part | Spec |
|---|---|
| Head | Sphere, radius 1.0. Total height ≈ 5.2 R, so the head is ~38% of the figure. |
| Torso | Bean shape (`CapsuleGeometry` radius 0.62, length 0.7, scaled x 1.0 / z 0.85) in the clothing color. Top sits just under the head, overlapping slightly. |
| Neck | None. The head rests on the torso. |
| Arms | Thin black capsules (radius 0.05), upper and lower segments (0.6 + 0.55), so they can bend at the elbow. |
| Hands | Skin-colored spheres (radius 0.16), outlined. |
| Legs | Thin black capsules (radius 0.055), two segments (0.65 + 0.6), knee bend. |
| Feet | Black flattened ellipsoids (0.24 × 0.12 × 0.34), toes pointing slightly outward. |
| Hair | Cap shell: the top part of a sphere (radius 1.03, phi limited to the upper ~45%) in the hair color, with a slight front swoop. Variants: buzz cap, side-part swoop, gray side tufts, bald. |
| Hats | Beanie: half-sphere with a rolled band torus and a pom-pom ball. Others: cowboy hat, chef hat, police cap, crown, knight helmet. |
| Glasses | Two torus rings (radius 0.24, tube 0.05) in `#141414` with a bridge, sitting on the face surface. |
| Clothing details | Flat extruded shapes on the torso surface: V-neck, tie, lapels, hoodie pocket and strings, lab coat pocket and stethoscope, badges. All outlined. |

### A4.2 Face system

The face is drawn in 3D, laid flat on the head sphere. Use the helper below to place features on the sphere surface, facing outward:

```ts
// yaw = left/right angle, pitch = up/down angle (radians), r = head radius
export const onHead = (yaw: number, pitch: number, r = 1, lift = 0.012) => ({
  position: [
    (r + lift) * Math.cos(pitch) * Math.sin(yaw),
    (r + lift) * Math.sin(pitch),
    (r + lift) * Math.cos(pitch) * Math.cos(yaw),
  ] as [number, number, number],
  rotation: [-pitch, yaw, 0, 'YXZ'] as [number, number, number, string],
});
```

| Feature | Spec |
|---|---|
| Eyes (default) | Black flattened ellipsoids (0.1 × 0.13 × 0.03) at yaw ±0.28, pitch 0.05, each with a white highlight dot (0.03) top-right |
| Eyes (shocked) | White sclera disc (0.2) with outline and a small black pupil |
| Happy eyes | Upward arcs (`TorusGeometry` arc = π, tube 0.03) giving the ^^ look |
| Brows | Short thick capsules; hidden on neutral, shown for worried, angry, or smug |
| Mouth | Small arc (torus arc ≈ 0.9π, tube 0.025) at pitch −0.32. Variants: flat line, open oval (dark red inside), wide grin, wobbly worry line |
| Blush | Two soft pink discs at yaw ±0.5, pitch −0.15, 45% opacity, no outline |
| Sweat drop / tears / sparkles | Small emissive or outlined shapes attached on demand |

**Expression presets** (`Face.tsx`):

- `neutral`, `smile`, `happy`, `worried`, `shocked`, `smug`, `angry`, `sad`, `thinking`.
- Expression changes blend over 4–6 frames, implemented as a scale or opacity crossfade.
- **Blink:** every 2.8–4.2 s, with a per-character seeded offset. Eyes go from scaleY 1 → 0.1 → 1 over 6 frames. No blinking while the `shocked` expression is active.
- **Mouth flaps:** only when a character speaks a quoted line. The narrator's voice does not move character mouths.

### A4.3 `<Character>` API

```ts
type CharacterProps = {
  id: string;                 // cast id from cast.ts
  position?: [number, number, number];
  facing?: number;            // radians, 0 = toward camera
  pose?: PoseName;            // 'stand' | 'sit' | 'point' | 'hold' | 'wave' | 'arms-up' | 'shrug' | 'tap' | ...
  expression?: Expression;
  action?: MotionName;        // 'idle' | 'walk' | 'nod' | 'shake' | 'jump' | 'gasp' | 'talk' | 'type' | ...
  actionStart?: number;       // seconds, relative to the shot
  holding?: PropName;         // attaches the prop to the right hand
  scale?: number;
  seed?: number;              // blink and idle offsets
};
```

`cast.ts` defines each recurring character (skin, hair or hat, outfit, accessories, default expression) so they look identical in every video.

### A4.4 Default cast templates

These templates are inspired by the reference look, but they are original. They get approved, renamed, or recolored in STATE 3.

| Template | Look |
|---|---|
| **Everyman** (the "you" character) | Peach skin, dark-brown swoop hair, teal hoodie |
| **Professor / Banker** | Tan skin, black buzz cap, round glasses, navy suit, red tie |
| **Worker** | Peach skin, sage beanie with pom, lavender knit |
| **Doctor / Expert** | Brown skin, gray side-tufts, lab coat, teal collar |
| **Friend A / Friend B** | Mustard V-neck sweater with glasses; coral shirt with a bun |
| **Crowd extras** | Seeded mix of skins, hair, and outfit colors, all from the palette |

---

## A5. Animation Library (`motions.ts`, `poses.ts`)

Every motion is a pure function of `(frame, fps, startSec, seed)` that returns joint rotations and offsets.

| Motion | Behavior |
|---|---|
| `idle` | Torso bob ±1.5% over 2.4 s, slight head tilt sway ±2°, arms hang with a tiny swing |
| `walk` | Leg swing ±28°, opposite arm swing ±22°, body bob 2×/cycle, cycle 0.8 s |
| `nod` / `shake` | Head pitch ±10° ×2 or yaw ±14° ×2 over 0.6 s |
| `talk` | Hand gesture loop plus mouth flap at about 6 Hz with seeded variation |
| `gasp` | Anticipation squash (0.92 y) for 3 frames, then stretch to 1.08, arms up, `shocked` face, hold |
| `jump` | Squash, launch, overshoot, land with a squash |
| `point` | Arm raises with a spring overshoot, holds, index direction toward the target |
| `tap` / `hammer` | Wrist swing ×3 with a small impact pause |
| `type` | Alternating hand bounces at desk height |
| `carry` / `push` | Lean 8°, hands forward, walk cycle slowed by 30% |
| `sit` | Knees at 90°, hands on thighs, bob reduced |

**Principles**

- Every entrance uses anticipation, then action, then overshoot (Remotion `spring()` with damping 12–14).
- Nothing linear except constant camera drift.
- Use secondary motion: hair and hat pom wobble lags 2–3 frames behind head turns.
- Background extras idle at reduced amplitude, with seeded offsets so they never move in sync.
