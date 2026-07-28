# CLAUDE.md — Who's Who? (`مين هذا؟`)

## Project Overview

A bilingual (Arabic/English) mobile-first party game built as a single-page React app. Players privately enter trivia about themselves; teams compete across four rounds to guess each other's answers. Designed to be passed around on a phone or displayed on a shared TV.

## Tech Stack

- **React 18** + **Vite 5** (ESM, `"type": "module"`)
- **Plain JavaScript** (JSX, no TypeScript)
- **Tailwind CSS** via CDN (no PostCSS, no `tailwind.config.js`)
- **Lucide React** for icons
- No backend, no database — all state is in-memory

## Project Structure

```
/
├── index.html          # Vite root; sets lang="ar" dir="rtl"; loads Tailwind CDN + Google Fonts
├── src/
│   └── App.jsx         # Entire application (~1,277 lines)
├── public/
│   └── favicon.svg
├── vite.config.js      # Minimal: just @vitejs/plugin-react
└── package.json
```

No subdirectories under `src/`. Everything lives in `App.jsx`.

## App.jsx Architecture

### Key Constants (top of file)
| Constant | Purpose |
|---|---|
| `QUESTIONS` | 4 trivia categories (job, color, food, style) |
| `OPEN_QUESTIONS` | 2 open-ended questions |
| `FACEOFF_QUESTIONS` | 21 face-off challenges |
| `TEAM_META` | Color tokens per team |
| `STR` | Full bilingual string table (Arabic + English) |
| `MAX_ORG_PHOTOS` | 15 — max Round 4 photos |
| `TIMER_DEFAULT` | 30s |
| `FACEOFF_TIMER` | 60s |

### Components
- **`WhosWhoLogo`** — Stylized logo with gold/teal gradient
- **`WhosWho`** — Main app; single large stateful component

### Screen State Machine (`screen` state in `WhosWho`)
| Screen | Description |
|---|---|
| `counts` | Setup: team names, player counts, optional question labels |
| `organizer` | Organizer uploads Round 4 photos (base64 via FileReader) |
| `pass` | "Pass the phone" handoff between players |
| `collecting` | Private data entry per player |
| `rounds` | Round selection hub |
| `round1` | Guess: show name+label → teams guess answer |
| `round2` | Trivia: show answer → teams guess who it belongs to |
| `round3` | Face-Off: 60-second challenges between player pairs |
| `round4` | Photo round: guess whose object is shown |
| `final` | Scoreboard + winner |

### Key Patterns
- **Bilingual:** All UI text comes from `STR[lang].key`. Language toggle sets `lang` state (`'ar'` / `'en'`).
- **TV Mode:** `isTV` flag (auto-detected at ≥1024px or toggled via 📺 button); renders side-by-side landscape layout.
- **Scoring:** `scores: { 1: 0, 2: 0 }` updated via `award(team, points)`. Round 1/2 = 1pt; face-off = 2pts.
- **Timers:** Countdown auto-starts on round entry; pause/reset controls in UI.
- **Styling:** Mix of inline styles and Tailwind utility classes. RTL-aware (`dir="rtl"` on `<html>`).

## Development Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Production build → dist/
npm run preview   # Serve production build locally
```

No lint, test, or typecheck scripts are configured.

## Conventions

- **No TypeScript** — keep plain JS/JSX
- **No separate CSS file** — use Tailwind classes or inline styles
- **No component splitting** — the whole app stays in `App.jsx` unless a feature genuinely warrants extraction
- **Add new strings to `STR`** — always provide both `ar` and `en` values; never hardcode UI text
- **RTL-safe** — test layout changes in both `ar` (RTL) and `en` (LTR) modes
- **TV mode** — test UI changes at wide viewport (≥1024px) as well as mobile

## No Tests

Playwright is a dev dependency (added for a one-off logo script) but there are no test files or test runner config. No tests need to be written or run.

## Git

- Default branch: `main`
- No CI/CD pipelines configured
