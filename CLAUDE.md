# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Serve production build (http://localhost:4173)
```

No test runner is configured. UI testing is done with Playwright (installed as devDependency):
```bash
node your-test-script.js   # Playwright scripts run directly with Node
```
When running Playwright in this environment: use `executablePath: '/opt/pw-browsers/chromium'`, `args: ['--no-sandbox', '--proxy-server=direct://']`, and `waitUntil: 'domcontentloaded'`.

## Architecture

The entire app lives in **`src/App.jsx`** — one large single-file React 18 SPA with no routing library, no component files, no CSS files. Tailwind CSS is loaded via CDN in `index.html`. The app is deployed on Vercel (auto-deploy from `main` branch).

### Screen state machine

All UI is driven by a single `screen` state string. Each screen renders conditionally inside one `return`. Every screen has two render paths: **`isTV`** (landscape ≥1024px, or manually toggled) shows a fullscreen TV/DeX layout; **`!isTV`** shows the mobile layout (max-w-md column).

Screens in order:
- `counts` → team names + player count setup
- `qr-wait` → organizer waits while players scan QR and self-register
- `organizer` → organizer uploads Round 4 photos
- `pass` → phone-passing screen between private registrations
- `collecting` → private player registration form (phone passed one by one)
- `rounds` → round selection menu
- `round1` → Guessing round (name + attribute shown, teams guess)
- `round2` → Trivia round (answer shown, teams guess whose it is)
- `round3` → Faceoff round (challenges between paired players)
- `round4` → Photo guess round (organizer-uploaded object photos)
- `final` → Scoreboard + winner celebration

### Registration modes

Two ways to collect player data:

1. **Manual (phone-passing):** `organizer` → `pass` → `collecting` (loops per player) → `rounds`. All data stays in React state only.

2. **QR remote:** organizer clicks QR button on `counts` screen → `createQRSession()` writes to Supabase → shows QR code on `qr-wait`. Players open `?join=SESSION_ID` on their own phones → pick team/slot → fill form → `submitJoinForm()` PATCHes `ww_players`. Organizer sees live updates via Supabase Realtime channel `"qr-org-{sessionId}"`. When all slots filled, `startGameFromQR()` pulls filled players into React state and navigates to `rounds`.

### Supabase (QR mode only)

Project: `inqtttbxzjqvsjwnlmkf.supabase.co` (anon key hardcoded in `App.jsx`).

Tables:
- **`ww_sessions`**: `id`, `team1_name`, `team2_name`, `team1_count`, `team2_count`, `q_labels` (jsonb), `open_q_labels` (jsonb), `lang`, `status`
- **`ww_players`**: `id`, `session_id`, `team` (1|2), `player_order`, `name`, `job`, `color`, `food`, `style`, `wish`, `funny`, `fear`, `submitted_at`

Both tables have public RLS (anon can read/write). Realtime uses Phoenix v2 array-format messages `[join_ref, ref, topic, event, payload]` — not JSON objects.

### Multi-window sync (DeX / TV mode)

`BroadcastChannel("who-s-who-v1")` syncs the full game state between open tabs/windows. The organizer can control the game on their phone while a TV shows the fullscreen TV layout. On mount, a new window sends `{ type: "request" }` and receives the full state snapshot. Every state change broadcasts `{ type: "sync", state: {...all state...} }`. The `bcReceiving` ref prevents sync loops.

### Key constants

- `QUESTIONS` (4 items): multiple-choice attributes per player (`job`, `color`, `food`, `style`)
- `OPEN_QUESTIONS` (3 items): free-text questions (`wish`, `funny`, `fear`)
- `FACEOFF_QUESTIONS` (21 items): challenges drawn randomly for Round 3
- `STR.ar` / `STR.en`: all UI strings for Arabic/English toggle
- `TEAM_META`: team colors (gold `#E8A33D` for team 1, teal `#3DB8A8` for team 2)
- `TIMER_DEFAULT = 30`, `FACEOFF_TIMER = 60` (seconds)

### Round mechanics

- **Round 1 & 2**: `buildDeck()` creates all player×question combinations, shuffled. Tracks used combos in `r1UsedCombos` to avoid repeats across replays.
- **Round 3 (Faceoff)**: `buildFaceoffSequence()` pairs team1[i] vs team2[i]. Each pair gets a random challenge from `FACEOFF_QUESTIONS` (21 total, tracked in `faceoffUsedQSet` to avoid repeats). 3 reshuffles allowed per game.
- **Round 4**: Photo deck built from organizer-uploaded images (max 15, stored as base64 data URLs in `organizer.photos`).

### Language

`lang` state (`"ar"` | `"en"`) controls which `STR` object is used. The `dir` variable (`"rtl"` | `"ltr"`) is derived from `lang` and applied to the root container. Question labels (`qLabels`, `openQLabels`) are stored in both languages and passed to Supabase on QR session creation.

## Development branch

Active work goes on branch `claude/new-session-rzdofh`. This branch frequently needs rebasing after squash-merges to `main` — resolve conflicts by keeping the feature branch version.
