# 80s Universe Bingo

A neon-soaked retro bingo variant built with TypeScript + PixiJS.

## Features

- 4 tickets, each 16 numbers (unique within each ticket and also no overlap across tickets, drawn from 1-80)
- Regenerate (♻) button: refresh tickets while in Idle phase
- Buy In button: generates 32 called numbers (sorted) and shows them below; button text shifts to "New Game" while calls are visible. Press again to clear calls and return to Idle maintaining the same tickets
- Called numbers are highlighted on tickets
- 80s aesthetic (neon gradients, pixel font)

## Game Flow
1. Load page: tickets auto-generated (phase = Idle)
2. (Optional) Press ♻ Recycle to regenerate tickets (only when Idle)
3. Press Buy In: 32 random call numbers appear; any matching numbers glow
4. Button now reads New Game. Press it to clear calls (tickets persist)
5. Repeat from step 2

## Development
Install dependencies then run the dev server.

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Assumptions
- Number pool size is 80 (adjustable in `BingoGame` constructor). Provides exactly the standard 1-80 universe while still allowing 64 unique ticket numbers without overlap.
- Calls are drawn independently from the same pool; duplicates between calls and tickets are allowed and desired (to get hits). If you instead want calls guaranteed not to contain numbers absent from tickets, adjust logic accordingly.

## Future Ideas
- Animated number reveal sequence
- Win detection patterns (rows, full ticket, etc.)
- Sound effects & particle bursts
- Mobile adaptive layout tweaks

Enjoy the synthwave vibes! 🕹️
