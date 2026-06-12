# Massive Dataset Explorer

> A production-quality full-stack demo that explores **10 lakh (1,000,000) in-memory records** with **live React optimization toggles** — built for senior engineers who want to *see* why each pattern matters.

<img width="2227" height="1165" alt="image" src="https://github.com/user-attachments/assets/cc783cd4-8b66-45d1-8be6-0409a2f1f0ef" />

---

## Purpose

Most portfolio projects are CRUD apps with a README that *claims* performance. This project is different:

1. **Prove scale** — 10 lakh records served from an Express API with cursor pagination, server-side search, filter, and sort.
2. **Prove craft** — Every optimization is real application code, not a mock. Toggle it off and the UI degrades measurably.
3. **Prove judgment** — Architecture separates UI state (Redux), server state (RTK Query), and persistence (IndexedDB) the way production teams do.

**Who is this for?**

- Engineers interviewing for senior frontend roles
- Teams evaluating React 18 + Redux Toolkit + RTK Query at scale
- Anyone learning *when* to use virtualization, memoization, workers, and caching — not just *what* they are

**What you get in the browser**

| Route | Description |
|-------|-------------|
| `/` | Data Explorer — virtualized table + **Control Center** panel (tap any concept card for full details in a modal) |

No sidebar. No separate concepts page. One focused explorer surface.

---

## Quick Start

### Prerequisites

- Node.js 20+ (includes npm)
- pnpm is **optional** — scripts use `npx pnpm` automatically

### Install & run

```bash
git clone <repository-url>
cd massive-dataset-explorer
cp .env.example .env
npm run setup
npm run dev
```

| URL | What |
|-----|------|
| http://localhost:4321 | Explorer (table + control panel + concept modals) |
| http://localhost:4000/api/v1/health | API health + record counts |

**First API start** generates 10 lakh records in memory (~30–60s). Restart only when `RECORD_COUNTS` changes.

### Build & test

```bash
npm run build
npm test           # Vitest (unit + integration)
npm run test:e2e   # Playwright
```

---

## Concepts Used (21 live toggles)

Each switch in the **iOS Control Center** panel controls real code. The tile text tells you the **effect happening right now** (green when ON, red when OFF).

| # | Concept | Category | What it does | Effect when OFF |
|---|---------|----------|--------------|-----------------|
| 1 | **Virtualization** | Performance | TanStack Virtual renders ~30 DOM rows | Every loaded row becomes a DOM node — scroll freezes |
| 2 | **Debouncing** | Network | 300ms delay before search API call | One API call per keystroke |
| 3 | **AbortController** | Network | Cancels stale in-flight fetches | Slow requests overwrite fresh results |
| 4 | **React.memo** | Performance | Skips re-render of cells & headers | All visible cells re-render on scroll |
| 5 | **useCallback** | Performance | Stable handler references for rows | New functions every render break memo chain |
| 6 | **useMemo** | Performance | Caches column layout computations | Grid layout recalculated every render |
| 7 | **useTransition** | Performance | Non-urgent sort state updates | Sort blocks UI on large loaded sets |
| 8 | **useDeferredValue** | Performance | Defers search highlight updates | Highlights update on every debounced keystroke |
| 9 | **Throttling** | Performance | Batches scroll handler work (200ms) | Scroll handlers fire every pixel moved |
| 10 | **React.lazy** | Architecture | Code-splits FilterPanel chunk | Filter code in main bundle (heavier first paint) |
| 11 | **Suspense** | Architecture | Loading overlay while filter chunk loads | No visible pending UI during lazy load |
| 12 | **Web Workers** | Browser | Search parsing off main thread | Input lag on longer queries |
| 13 | **RTK Query Cache** | Architecture | In-memory API response cache | Every revisit refetches from API |
| 14 | **Prefetching** | Network | Warms next page in background | Pages load only when you hit the bottom |
| 15 | **Keep Previous Data** | Architecture | Shows stale rows during refetch | Table blanks between search changes |
| 16 | **Infinite Scroll** | Performance | Auto-loads next page at bottom | Manual "Load more" only |
| 17 | **IntersectionObserver** | Browser | Native API for load-more sentinel | Scroll position math on every scroll tick |
| 18 | **IndexedDB** | Browser | Persists search history & theme | History lost on refresh |
| 19 | **Error Boundary** | Architecture | Isolates table crashes locally | Errors bubble to root shell |
| 20 | **Selective Subscription** | Performance | Shallow Redux selector for panel | Panel re-renders on every highlight pulse |
| 21 | **Auto Retry** | Network | RTK Query retry with exponential backoff | Failed fetches show Retry immediately |

### Additional patterns (always on)

| Pattern | Where | Why |
|---------|-------|-----|
| **Redux Toolkit** | `store/` | UI state: entity, columns, selection, filters, sort |
| **RTK Query** | `store/api/` | Server state: paginated lists, health, metadata |
| **Root Error Boundary** | `ErrorBoundaryRoot.tsx` | Last-resort catch for uncaught render errors |
| **Zod** | `packages/shared` | Shared query/filter validation |
| **Cursor pagination** | `apps/api` | Keyset pagination at 10L scale |
| **Astro Islands** | `pages/*.astro` | Minimal JS shell, React `client:only` |
| **Dexie (IndexedDB)** | `services/indexeddb/` | Search history, preferences, saved filters |
| **Sentry** | `services/sentry/` | Optional error tracking via `PUBLIC_SENTRY_DSN` |
| **MSW + Playwright** | `test/`, `e2e/` | Integration and E2E coverage |

---

## How to use the Control Center

1. Open http://localhost:4321
2. Pick a dataset tab: **Users · Orders · Transactions**
3. Toggle **Virtualization OFF** → scroll the table → feel jank; read the red tile text
4. Toggle **Debouncing OFF** → type in search → watch **API** counter spike
5. Tap any concept card in the control panel for full explanations, benefits, and "try it" steps

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (mobile-responsive, no page scroll)                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Astro shell → ClientApp (React 18, client-only)        │  │
│  │  ┌─────────────────────┐  ┌──────────────────────────┐ │  │
│  │  │ Virtualized table   │  │ iOS Control Center panel │ │  │
│  │  └──────────┬──────────┘  └──────────────────────────┘ │  │
│  │             Redux Toolkit (UI) + RTK Query (server)     │  │
│  │             IndexedDB · Web Workers · Error Boundary      │  │
│  └────────────────────────────┬────────────────────────────┘  │
└───────────────────────────────┼──────────────────────────────┘
                                │ REST / JSON
┌───────────────────────────────▼──────────────────────────────┐
│  Express API (TypeScript)                                    │
│  1,000,000 in-memory records · cursor pagination · search   │
└──────────────────────────────────────────────────────────────┘
```

### Monorepo layout

```
massive-dataset-explorer/
├── apps/
│   ├── api/          # Express + 10L seed data
│   └── web/          # Astro + React frontend
├── packages/
│   └── shared/       # Types, Zod schemas, RECORD_COUNTS
├── package.json
└── README.md
```

### Frontend feature folders

| Folder | Responsibility |
|--------|----------------|
| `app/` | Shell, providers, ClientApp routing glue |
| `features/explorer/` | Virtualized table, infinite scroll, entity tabs |
| `features/concepts/` | Control Center UI, concept definitions, toggles slice |
| `features/search/` | Debounced search, highlighting, workers |
| `features/filters/` | Filter drawer, saved filters |
| `features/sorting/` | Multi-column sort state |
| `features/settings/` | Theme toggle only (no settings page) |
| `store/` | Redux + RTK Query API |
| `services/indexeddb/` | Dexie persistence |
| `workers/` | Search, sort, analytics off main thread |

---

## State management

| Layer | Tool | Contents |
|-------|------|----------|
| UI state | Redux Toolkit | Theme, entity, columns, selection, filter/sort UI |
| Server state | RTK Query | Paginated API data — **never** in Redux slices |
| Persisted | IndexedDB | Search history, preferences, saved filters |
| Ephemeral | Component refs | Virtual scroll position, resize drag |

**Rule:** API rows are not stored in Redux. Components read server data only through RTK Query hooks.

---

## Data scale

| Entity | Count |
|--------|-------|
| Users | 272,727 |
| Orders | 363,636 |
| Transactions | 363,637 |
| **Total** | **1,000,000 (10 lakh)** |

Defined in `packages/shared/src/constants/datasets.ts`. Counts exposed at `GET /api/v1/health`.

---

## API reference

Base URL: `http://localhost:4000/api/v1`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Status + record counts |
| GET | `/meta/fields/:entity` | Column metadata |
| GET | `/:entity` | Paginated list (`users`, `orders`, `transactions`) |
| GET | `/:entity/:id` | Single record |
| GET | `/:entity/stats` | Aggregates |

**List query params:** `cursor`, `limit` (max 100), `sort`, `search`, `filter`, `simulateLatency`

---

## Mobile responsive design

The app is built for **viewport-locked layout** on phones:

- **No page scroll** — `html`/`body` use `100dvh` + `overflow: hidden`
- **Internal scroll only** — table body and control panel scroll inside their panes
- **Hidden scrollbars** — touch scroll works; scrollbars are not shown on small screens
- **Stacked layout** — Control Center sits above the table below 900px width
- **Compact header** — logo, dataset tabs, search, and nav fit without sidebar

Test with Chrome DevTools device mode or a real phone on your LAN.

---

## Performance targets

| Metric | Target |
|--------|--------|
| Scroll FPS (virtualization ON) | ≥ 55 fps |
| DOM rows mounted | ~30 visible |
| API page size | 50 records |
| Search debounce | 300ms |

Live counters in the Control Center: **API calls** and **Renders** this session.

---

## Testing

```
        E2E (Playwright)      ~10%
     Integration (RTL+MSW)   ~30%
    Unit (Vitest)             ~60%
```

E2E covers explorer load, search, sort, filters, infinite scroll, concepts toggles, and axe accessibility.

---

## Accessibility

- WCAG 2.1 AA target
- `role="grid"` with `aria-rowindex`, `aria-sort`, `aria-selected`
- Skip link to main content
- Keyboard sort and row selection
- Focus trap in filter drawer
- `prefers-reduced-motion` respected
- axe-core scan in E2E

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_PORT` | `4000` | Express port |
| `PUBLIC_API_URL` | `http://localhost:4000/api/v1` | Frontend API base |
| `PUBLIC_SENTRY_DSN` | _(empty)_ | Optional Sentry DSN |
| `SIMULATE_LATENCY_MIN` | `20` | Min simulated API latency (ms) |
| `SIMULATE_LATENCY_MAX` | `80` | Max simulated API latency (ms) |

---

## Tradeoffs & future work

| Decision | Why | Migration |
|----------|-----|-----------|
| In-memory API | Zero DB setup for demo | PostgreSQL + keyset pagination |
| Client-only React | Redux incompatible with Astro SSR | Partial SSR for static shell |
| 10L seed at startup | Proves scale in one command | Pre-generated binary snapshot |

---

## License

MIT
