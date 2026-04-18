---
title: "fix: Make card grid explicitly 3-2-1 responsive columns"
type: fix
status: active
date: 2026-04-18
---

# fix: Make card grid explicitly 3-2-1 responsive columns

## Overview

Replace the `auto-fill / minmax(240px, 1fr)` grid definition with explicit column counts at defined breakpoints: 3 columns on desktop, 2 on tablet, 1 on mobile. The current `auto-fill` approach produces indeterminate column counts depending on viewport width and the 240px minimum, which can yield unexpected layouts (e.g. 4 columns on wide desktops, or an awkward 2+4 wrap on mid-range tablets).

## Requirements Trace

- R1. Card grid shows 3 columns at desktop widths (≥1024px).
- R2. Card grid shows 2 columns at tablet widths (640px–1023px).
- R3. Card grid shows 1 column at mobile widths (<640px).
- R4. All 6 cards remain visible and correctly styled at every breakpoint.
- R5. No changes to card visual styling, hover effects, or HTML structure.

## Scope Boundaries

- Only `src/input.css` changes — specifically the `@utility card-grid` block.
- No changes to `src/index.html`.
- No changes to card styles, spacing, or any other utility.

## Context & Research

### Relevant Code and Patterns

- `src/input.css` — `@utility card-grid` at line 266–272 is the sole target.
- Current declaration: `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`.
- The project uses Tailwind v4 with `@utility` for custom classes. Responsive media queries inside `@utility` blocks are standard Tailwind v4 / native CSS.
- Breakpoint conventions visible in existing CSS: `max-width: 640px` used for mobile atmospheric adjustments in `@layer base`.

## Key Technical Decisions

- **Explicit `repeat(N, 1fr)` at breakpoints over `auto-fill/minmax`:** `auto-fill` cannot guarantee a specific column count — it depends on available width divided by the minimum. With 6 cards and a max-width of 1400px, `minmax(240px, 1fr)` could yield 3, 4, or 5 columns depending on actual rendered width. Explicit counts are deterministic and directly satisfy the requirement.
- **Breakpoints: mobile-first vs desktop-first:** The existing codebase uses `max-width` (desktop-first) for the atmospheric media queries. For consistency, use the same approach here: default to 3 columns, apply `max-width` overrides for smaller viewports.
- **Breakpoint values:** `640px` for the mobile boundary (matches existing `max-width: 640px` in the file) and `1024px` for the tablet/desktop boundary. This gives: ≥1024px → 3 cols, 640–1023px → 2 cols, <640px → 1 col.

## Implementation Units

- [ ] **Unit 1: Update card-grid to explicit responsive column counts**

**Goal:** Replace `auto-fill/minmax` with explicit `repeat(3, 1fr)` at desktop, `repeat(2, 1fr)` at tablet, and `repeat(1, 1fr)` (or `1fr`) at mobile.

**Requirements:** R1, R2, R3, R4, R5

**Dependencies:** None

**Files:**
- Modify: `src/input.css` — `@utility card-grid` block (lines 266–272)

**Approach:**
- Keep `display: grid`, `gap: 1.5rem`, `width: 100%`, and `padding: 0 0 3rem` unchanged.
- Replace `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))` with:
  - Default (desktop, ≥1024px): `repeat(3, 1fr)`
  - `@media (max-width: 1023px)`: `repeat(2, 1fr)`
  - `@media (max-width: 639px)`: `repeat(1, 1fr)` (or just `1fr`)
- Place the media queries inside the `@utility card-grid` block — this is valid in Tailwind v4 `@utility` declarations and standard native CSS nesting.

**Patterns to follow:**
- Existing `@media (max-width: 640px)` usage in `src/input.css` for breakpoint style.
- Existing `@utility` blocks in `src/input.css` for placement/structure.

**Test scenarios:**
- Test expectation: none — this is a pure CSS layout change with no behavioural surface. Verification is visual.

**Verification:**
- At viewport width ≥1024px: all 6 cards appear in exactly 3 columns.
- At viewport width 640–1023px: cards appear in exactly 2 columns (3 rows of 2).
- At viewport width <640px: cards appear in a single column (6 rows of 1).
- No card is clipped, overflowing, or misaligned at any breakpoint.
- Card hover effects, stripe, and glow are unaffected.
- `npm run build` completes without error; `dist/app.css` reflects the updated grid rule.

## Sources & References

- Related code: `src/input.css` (`@utility card-grid`, `@layer base` breakpoint patterns)
