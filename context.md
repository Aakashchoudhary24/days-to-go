# days-to — Project Context (handoff for AI coding agents)

Reference docs: `days-to-build-spec.md` (authoritative spec), `design.md` (design-change pass), `idea.md` (original concept). `AGENTS.md` warns this is a non-standard Next.js 16 — read `node_modules/next/dist/docs/` before writing any Next.js code.

## What the project is

A minimal single-page web app for creating, maintaining, and monitoring multiple countdowns to personal deadlines. It answers one question: **"How many days do I have left?"** Single-user, client-only (localStorage), no backend.

## Product philosophy and UX/design principles

- "Minimal as fuck." The countdown itself is the product, not a task manager.
- Monochrome only — in **both** light and dark mode. Never colorize priority (a faint 1px bar) or anything else. No gradients, colorful accents, excessive shadows, or generic dashboard styling.
- Swiss typography + digital-clock feel: Geist `--font-sans` for UI, Geist_Mono `--font-mono` for numbers.
- Hierarchy: remaining-days number dominates → `DAYS TO GO` → live clock → name → deadline (number must be huge and responsive, e.g. `text-[min(30vw,44vh)]` for single).
- Light mode text is deliberately **darker/blacker** than the early mostly-gray build (secondary text uses `text-foreground/70`-ish alphas, not the old `black/45`). Dark mode is a deliberate inversion of the same hierarchy, not a different design.
- Zero countdowns → the creation flow **is** the page.
- A newly created countdown must appear on the stage immediately — pinning must never be a barrier (new countdowns auto-pin, up to 4).
- No generic SaaS/shadcn look — shadcn/ui is initialized and used only where it genuinely helps (currently just the mobile `Popover`).

## Core user flows

1. **Empty**: open app → creation flow (goal name → deadline → priority) → create → straight into the countdown stage.
2. **Existing countdowns**: pinned countdowns fill the stage; a **desktop island** (small vertically-centered floating rail) and a **mobile hamburger menu** list all active countdowns; clicking/selecting an item **selects and pins it** (auto-pins up to 4). Tile `Unpin` removes from stage; `+` header button creates more; tile `Edit` opens editor (edit name/deadline/priority, archive, delete).
3. **Theme**: a header toggle switches light ↔ dark (starts from system preference).

## Tech stack & architecture

- Next.js 16.3.6 (App Router, Turbopack dev), React 19.2.8, TypeScript strict, Tailwind CSS v4 (`@tailwindcss/postcss`, `@import "tailwindcss"` + shadcn imports in globals.css), ESLint (eslint-config-next core-web-vitals + typescript).
- **shadcn/ui** initialized with `pnpm dlx shadcn@latest init --preset b2pQWn7C4 --template next` — style `base-mira` on **Base UI** (@base-ui/react, not Radix), Tabler icons, `class-variance-authority`, `cn`, `tw-animate-css`. Adds `components.json`, `components/ui/*`, `lib/utils.ts`. Only the `popover` component is used by app code so far.
- **next-themes** for light/dark (`components/theme-provider.tsx`: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`).
- Runtime deps: `next`, `react`, `react-dom`, `next-themes`, `@base-ui/react`, `@tabler/icons-react`, `class-variance-authority`, `cn`, `tw-animate-css`, `shadcn`. Fonts via `next/font/google` (Geist, Geist_Mono — the Inter that shadcn init added was removed to preserve the original typography).
- `@/*` path alias → repo root.
- Scripts: `dev`, `build`, `start`, `lint`.

Layout: `app/` has `layout.tsx` (fonts + RootLayout + ThemeProvider + `suppressHydrationWarning`), `page.tsx` (`DaysToProvider` + `AppContent`), `globals.css` (Tailwind v4 + `tw-animate-css` + `shadcn/tailwind.css` imports, monochrome `:root`/`.dark` tokens, `@custom-variant dark`). All logic under `components/` and `lib/countdown/`.

## Components & responsibilities

- `app/page.tsx` — `AppContent`: header, island rail, `<main>` stage, overlays. `<main>` gets `md:pl-24` only when the island nav renders (`hasIsland` = >1 active countdown); there is no bottom-bar clearance anymore.
- `components/theme-provider.tsx` — next-themes wrapper.
- `components/theme-toggle.tsx` — single sun/moon button cycling light↔dark; hydration-safe via `useSyncExternalStore` (Next 16 lint forbids `setState` in effects).
- `components/header.tsx` — `days-to` wordmark; right side: ThemeToggle, mobile-only hamburger (shadcn `Popover`, right-aligned under the header, ~19rem wide, scrollable; items show days/name/selected state + pinned dot; tapping selects AND auto-pins and closes), and `+` create button (visible only when hydrated && countdowns exist && not creating).
- `components/countdown-rail.tsx` — **desktop only** (`hidden md:flex`): small vertically-centered floating **island** (`fixed left-5 top-1/2 -translate-y-1/2`, hairline border, flat `bg-background`, tiny radius, no shadow, detached from page edges). Each item: mono days, truncated name, pinned 1px bar; click selects AND pins. Mobile navigation lives in the header — the old bottom bar is gone.
- `components/countdown-stage.tsx` — pinned layouts 1/2/3/4; dividers are theme-aware `divide-foreground/10` / `border-foreground/10`.
- `components/countdown-tile.tsx` — presentational. Giant mono number scaled by `variant (full|half|quarter)`, priority 1px bar (`bg-foreground/15|45|foreground`), always-visible `Edit`/`Unpin` controls, `+N DAY LATE` / `0 TODAY` states, and a **1px progress hairline** along the tile bottom (`role="progressbar"`, `aria-valuenow`; width set via inline style).
- `components/countdown-creator.tsx` — full-screen 3-step flow (name → date → priority), `Create →` fires `addCountdown`. **Deliberately not a `<form>`** — see Known bugs.
- `components/date-picker.tsx` — native `<input type="date">`, theme-aware underline, `[color-scheme:light] dark:[color-scheme:dark]`.
- `components/priority-selector.tsx` — `role="radiogroup"` LOW/MEDIUM/HIGH; selection via weight/opacity.
- `components/countdown-editor.tsx` — modal form (name/deadline/priority) with Archive/Delete/Cancel/Save; still uses `<form onSubmit>` (submit button is stable).
- `components/ui/` — shadcn scaffold (`button.tsx`, `popover.tsx`); only popover is used by app code.

## State management, persistence, countdown logic

- React Context `DaysToProvider` / `useDaysTo()` in `lib/countdown/store.tsx`. No state library.
- **State**: `countdowns[]`, `selectedCountdownId`, `pinnedCountdownIds[]` (max 4), `isCreating`, `editingCountdownId`, `notice`, `hydrated`, `now` (ticking clock). `remainingTimes` is a derived `Map` (useMemo).
- **Hydration**: `useLayoutEffect` (guarded by `initializedRef`) loads countdowns + pinned from localStorage once, seeds pinned to first active (up to 4) if empty, selects first active, sets `hydrated`. Persistence via effects gated on `hydrated`.
- **Live updates**: `now` state ticked by a 1s `setInterval` (setState only in the interval callback, not in the effect body — satisfies Next 16 lint); `remainingTimes = useMemo(getRemainingTime(c, now))`.
- **Actions**: `addCountdown` creates + auto-pins (<4) + selects + closes creator; `deleteCountdown`/`archiveCountdown` un-pin and re-select; `pinCountdown` capped at 4 with notice; `updateCountdown` persists; `restoreCountdown` has no UI.
- **Persistence** (`lib/countdown/storage.ts`): keys `days-to:v1` (countdowns JSON array) and `days-to:v1:pinned` (string[]). `loadCountdowns` filters malformed records and **normalizes `createdAt`** for legacy entries (missing/invalid → set to load time, so progress starts near 0% and the fix persists on the next save).
- **Model** (`lib/countdown/types.ts`): `Countdown { id, name, deadline "YYYY-MM-DD", priority, createdAt (ISO, always present after normalization), archived? }`; `Status = normal | approaching | final-week | less-than-24h | today | past`; `RemainingTime` now includes **`progress` (0–1)**.
- **Calculations** (`lib/countdown/calculations.ts`): `parseDeadline` = local midnight; `calendarDaysBetween` = floor-difference of local startOfDay; status tiers (≤30/≤7/<24h/0/negative); `formatClock`; NEW `parseCreatedAt` + `progressBetween` — progress = `clamp((now − createdAt) / (deadline − createdAt))`. A newly created countdown starts ≈0%, hits 100% at the deadline, and past deadlines clamp to 1 (does **not** change the `+N DAY LATE` behavior). Unknown `createdAt` → 0. Always derived at render, never persisted.

## Layout / responsive behavior

- Full viewport; 56px header.
- Mobile: no bottom nav — a hamburger in the header opens a right-aligned Popover (max ~19rem wide, scrollable ≤55vh) that never covers the stage; tiles stack normally (4-pinned grid acceptable per spec).
- Desktop: floating island at the left edge (vertically centered); `md:pl-24` gutter on `<main>` only when the island renders.
- Number sizes scale with `min(vw, vh)` per layout variant; `prefers-reduced-motion` globally honored.

## Theme (light / dark)

- Toggled via next-themes (`.dark` class on `<html>`); tokens live in `app/globals.css` `:root` / `.dark` — **monochrome only** (neutral `primary`, muted grays; no colored chart/primary tokens; `--radius: 0.125rem`).
- Light: `--background: #ffffff`, `--foreground: #0a0a0a`. Secondary text is much darker than the early build (labels ≈ `text-foreground/70` → ~#545454 vs the old `black/45` ≈ #8c8c8c; deadline/controls ≈ `text-foreground/50` → ~#858585 vs old `black/30` #b3b3b3).
- Dark: `--background: #0a0a0a`, `--foreground: #f5f5f5` — same hierarchy inverted, not a redesign.
- Convention: use `text-foreground/xx`, `bg-background`, `bg-foreground/xx`, `border-foreground/xx`, `divide-foreground/xx` — alpha-on-foreground is automatically theme-aware. Do not hardcode `black`/`white` (one intentional exception: the editor modal scrim `bg-black/30`).
- `color-scheme` set per theme so native controls (date picker) match.

## What is fully implemented

- Empty→creation flow, all steps, validation, create.
- First-created countdown immediately displayed on stage (auto-pin).
- Stage layouts for 1/2/3/4 pinned countdowns.
- Live ticking countdown, calendar-day math, all deadline states, 24h clock switch, today/past labels.
- Persistence of countdowns + pinned IDs; refresh restores the stage; legacy `createdAt` normalization.
- Island navigation on desktop (select + auto-pin, pinned indicator) — detached, centered, monochrome.
- Mobile hamburger menu (shadcn Popover) replacing the bottom bar; same select + auto-pin behavior.
- Light/dark theme with a header toggle; monochrome tokens; darker/blacker light-mode text.
- 1px lifecycle progress hairline on every countdown tile (0% → new, 100% → deadline, past → 100%).
- Monochrome styling, priority bar, Geist/Geist-Mono.
- Verified: `npm run build` and `npm run lint` pass.

## What is incomplete or missing

- No backend/sync (localStorage only — acceptable per spec for v1).
- Keyboard shortcuts (N / P / ESC) not implemented.
- No motion/transition on create or pin-count layout changes.
- No Settings panel.
- Duplicate-name validation not implemented.
- Archive list / restore UI missing (`archiveCountdown`/`restoreCountdown` exist in the store, but once archived a countdown can only be deleted).
- "approaching" / "final-week" statuses have no distinct visual styling.
- No committed tests (throwaway Playwright acceptance script in `/tmp`).

## Known bugs / technical debt

- **Creator must never use `<form>`/`type="submit"` for Create.** A real (trusted) click on the date-step `Continue →` swaps that button for a submit button mid-click, and Chromium then fires an implicit form submit that skips the priority step and creates with default priority. All creator controls are `type="button"` with explicit handlers; do not reintroduce a submit button in the creator. The editor still correctly uses form submit.
- `showNotice` uses `setTimeout` without cleanup (toast could linger/stale; minor).
- `layout.tsx` still has default "Create Next App" title/description metadata.
- `README.md` is boilerplate from create-next-app.
- No formal migration for localStorage keys (`days-to:v1`, `days-to:v1:pinned`); `loadCountdowns` does light in-place normalization only.
- Date picker affordance/format depends on browser (`type="date"`).
- shadcn scaffold artifacts (`components/ui/button.tsx`, `lib/utils.ts`) are present but unused by app code — safe to remove if unwanted.

## What remains to reach a solid MVP

1. Archive management: show archived list + restore (store already supports it).
2. Deadline/past-date handling polish during creation + duplicate names.
3. Keyboard shortcuts (N, ESC) and accessible overlays (esc close, focus trap, visible focus states).
4. Subtle motion for create→stage and 1→2→3→4 layout changes, respecting reduced-motion.
5. Accessibility sweep: labels, aria states, contrast, keyboard date entry.
6. Mobile QA for the 4-pinned grid and the new hamburger menu.
7. Manual visual QA of the island nav, popover, theme toggle, and progress hairline (light + dark, 1/2/3/4 layouts, past/today deadlines).
8. Polish: real metadata in `layout.tsx`, rewrite `README.md`.

## Important constraints future agents should preserve

- Keep it monochrome in both themes; priority communicated via typography/opacity/geometry only.
- Keep the remaining-days number visually dominant — never shrink it for secondary UI; the progress bar stays a 1px hairline.
- Never make pinning a prerequisite: created countdowns auto-pin (≤4); cap of 4 enforced with a subtle notice.
- Use shadcn only where it genuinely improves the minimal UI (currently just the mobile `Popover`); do not convert the app into generic shadcn/SaaS styling.
- Derive all time values — including `progress` — from stored data (createdAt, deadline) at render time; never persist computed values. Progress lifecycle = `[createdAt → deadline]`.
- Keep localStorage keys stable (`days-to:v1`, `days-to:v1:pinned`); `loadCountdowns` normalizes `createdAt` for legacy records.
- `hydrated` gates persistence/timer; initial render must be hydration-safe (no time-based `useState` initializer; theme toggle uses `useSyncExternalStore` for its mounted check).
- Next.js 16 + React 19: consult `node_modules/next/dist/docs/`; Next 16 ESLint enforces no `setState` synchronously in effects and no setState inside other state updaters — write setters as pure sequential updates.
- Run `npm run build` and `npm run lint` before finishing. Both must pass.

## Git state

- Branch: `main`
- HEAD: the design pass commit (this commit; see `git log -1` — it contains the shadcn init, island nav, light/dark theme, mobile hamburger menu, and progress-bar changes described above).
- Previous HEAD: `23a98ff` — "fix: prevent accidental submit skipping priority step in creator"
- Notable history: design pass commit → `0500094` feat: implement days-to countdown experience → `7f547b3` wip: initial days-to implementation → `d7fa7d5` Initial commit from Create Next App.