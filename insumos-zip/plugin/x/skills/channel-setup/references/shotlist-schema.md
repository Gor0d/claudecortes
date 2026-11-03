# shotlist.json schema

Write one object per shot. Times are seconds from the start of the VO. Every shot defines a camera for both formats.

```json
{
  "slug": "example-story",
  "fps": 30,
  "shots": [
    {
      "id": "s01",
      "start": 0.0,
      "end": 2.4,
      "line": "[hook line from the approved script]",
      "set": "bank-hall",
      "cast": [
        {"id": "banker", "pose": "stand", "expression": "smile", "action": "idle", "position": [0, 0, 0]}
      ],
      "props": ["desk", "money-jar-glow", "vault-door"],
      "camera": {
        "9x16": {"anchor": "low_fg", "move": "push-in", "fov": 32},
        "16x9": {"anchor": "mid", "move": "drift-left", "fov": 34}
      },
      "focus": "banker",
      "emphasis": ["[word]"],
      "sfx": ["soft-chime@1.2"],
      "transition": "cut"
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `id` | `s01`, `s02`… in order |
| `start` / `end` | Seconds, snapped to word boundaries in `words.json` |
| `line` | The exact words spoken over the shot |
| `set` | A set id from `src/sets/` |
| `cast` | Characters with `pose`, `expression`, `action`, `position` (and optional `facing`, `holding`, `actionStart`) |
| `props` | Prop ids from `src/props/` |
| `camera` | Per-format `anchor`, `move` (`push-in`, `drift-left`, `drift-right`, `punch-in`, `whip`, `orbit`), `fov` |
| `focus` | Cast id the depth of field focuses on |
| `emphasis` | Caption words to scale up or turn gold |
| `sfx` | `name@seconds-into-shot` |
| `transition` | `cut` (default) or `whip` |
