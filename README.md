# 80s Universe Bingo

A neon-soaked retro bingo variant built with TypeScript + PixiJS.

## Features

- 4 tickets, each 16 numbers (unique within each ticket AND globally unique across all tickets, drawn from 1–80)
- Regenerate (♻) button: refresh tickets while in Idle phase
- Buy In button: starts a progressive reveal of 40 called numbers (drawn from the 1–80 pool, no duplicates within calls). Button text shifts to "New Game" while calls are visible. Press again to clear calls and return to Idle while keeping the same tickets
- Called numbers glow / highlight live as they appear
- Ultra‑compressed scrolling calls panel (2 narrow columns) for space efficiency
- 80s aesthetic (neon gradients, pixel font)

## Game Flow
1. Load page: tickets auto-generated (phase = Idle)
2. (Optional) Press ♻ Recycle to regenerate tickets (only when Idle)
3. Press Buy In: a fast progressive reveal (50ms cadence) of 40 random call numbers begins; any matching ticket numbers glow immediately
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
- Number pool size is 80 (adjustable in `BingoGame` constructor). This supports 64 globally unique ticket numbers without overlap.
- Calls are drawn independently from the same 1–80 universe; overlaps with tickets are expected (that creates hits). Calls themselves are unique (no repeats) in the current implementation.
- Reveal speed (50ms) chosen for visual momentum; tweak in `main.ts` if you want slower drama.

## Deployment
This repo is configured for GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

Base path in `vite.config.ts` is set to `/game.videobingo.prototype/` so assets resolve correctly on Pages.

After pushing to `main`, the action builds and publishes `dist`.

Live URLs (after first successful deploy):
- Landing: `https://lewistombolajohnson.github.io/game.videobingo.prototype/`
- Direct game host (`game.html`): `https://lewistombolajohnson.github.io/game.videobingo.prototype/game.html`
- Mobile preview host (`mobile.html`): `https://lewistombolajohnson.github.io/game.videobingo.prototype/mobile.html`

If you see a 404 right after pushing, wait ~1–2 minutes for the workflow to finish.

## Editing & Running Locally
Use `npm run dev` for a fast HMR development server. The base path only affects production build; dev serves at root.

## Adjusting Call Count
Change `callsPerGame` inside `src/BingoGame.ts` if you want more/less than 40 calls. The UI auto-fills the scrolling panel.

## Future Ideas
- Animated number reveal sequence
- Win detection patterns (rows, full ticket, etc.)
- Sound effects & particle bursts
- Mobile adaptive layout tweaks

## Future Ideas
- Animated neon stinger for each hit
- Ticket win pattern detection (rows, full card, speed awards)
- Particle sparkle trails following revealed numbers
- Sound design (FM synth plinks, crowd cheer sample)

Enjoy the synthwave vibes! 🕹️
