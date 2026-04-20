---
title: "refactor: Inline Tailwind utilities, remove redundant custom CSS"
type: refactor
status: active
date: 2026-04-18
---

# refactor: Inline Tailwind utilities, remove redundant custom CSS

## Overview

`src/input.css` contains 14 `@utility` blocks and several `@layer base` class rules. Several of these express nothing more than layout, spacing, or typography — properties that map 1:1 to standard Tailwind utility classes and belong in the HTML per the CLAUDE.md rule: *"Use tailwindcss classes for styling whenever possible / Limit custom CSS to only what is necessary."*

This refactor moves the convertible classes to inline Tailwind utilities in `src/index.html`, removes the corresponding definitions from `src/input.css`, and deletes one block of dead code. Custom CSS that is genuinely impractical in Tailwind (pseudo-elements, complex gradients, animations, `color-mix()`, CSS variable fallback chains) is left untouched.

The design does not need to be pixel-perfect — minor visual shifts are acceptable.

## Problem Frame

The page currently has two sources of truth for styling: inline Tailwind classes on the footer element, and custom `@utility` / `@layer base` classes for everything else. This makes the HTML hard to read (class names carry no styling information) and the CSS unnecessarily large. Tailwind v4's `@theme` tokens already generate utility classes for every design token (`text-text-bright`, `font-display`, etc.) — they just aren't being used.

## Requirements Trace

- R1. Custom CSS classes that express only layout, spacing, or typography properties with direct Tailwind equivalents are replaced by inline Tailwind classes in the HTML.
- R2. The deleted CSS definitions are removed entirely — no orphaned `@utility` blocks remain.
- R3. CSS that is genuinely impractical to express in Tailwind (pseudo-elements, multi-layer gradients, animations, `color-mix()`, chained CSS variable fallbacks driving shadow/background) remains in `src/input.css`.
- R4. The dead `@utility card-hover` block (never applied in the HTML) is deleted.
- R5. The inline `--card-accent` / `--card-glow` / `--card-glow-wide` CSS custom properties on each card element are preserved — they drive the per-card colour scheme through `.card`, `.card:hover`, and `.card-stripe`.
- R6. The visual appearance is approximately preserved; minor pixel-level shifts are acceptable.

## Scope Boundaries

- No changes to `scripts/build.sh`, `wrangler.toml`, or CI.
- No visual redesign — this is a code organisation refactor only.
- No new Tailwind theme tokens added to `@theme`.
- `card-grid`, `card`, `card-hover` (delete), `card-stripe`, `card-type`, `hero-wordmark`, `hero-tagline`, `kofi-donate`, and all `@layer base` element/pseudo-element rules are **not** converted to inline utilities (see Key Technical Decisions).

## Context & Research

### Relevant Code and Patterns

- `src/input.css` — 449 lines; the CSS source being refactored.
- `src/index.html` — 180 lines; the only HTML file; all class changes land here.
- `CLAUDE.md` — states the rule: use Tailwind classes whenever possible.
- `<footer class="flex flex-col items-center gap-5">` — the one element already following the target pattern; use as the reference model.
- Tailwind v4 `@theme` tokens auto-generate utility classes: `text-text-bright`, `text-text-muted`, `font-display`, `text-text-body`, etc. No arbitrary values needed for colours or fonts.

### Institutional Learnings

- No `docs/solutions/` entries yet.

### External References

- Tailwind v4 detecting classes: https://tailwindcss.com/docs/detecting-classes-in-source-files
  - Tailwind scans `src/index.html` (not gitignored); moving classes from CSS to HTML is safe — the compiler will pick them up automatically.

## Key Technical Decisions

- **Convert `.page-wrapper`**: All six properties (`min-height: 100vh`, `display: flex`, `flex-direction: column`, `align-items: center`, `max-width: 1400px`, `margin: 0 auto`, `padding: 0 1rem`) have direct Tailwind equivalents. `max-w-[1400px]` uses an arbitrary value rather than adding a new theme token — acceptable for a one-off constraint.

- **Convert `@utility hero`**: Pure layout/spacing; all seven properties map 1:1 to standard Tailwind utilities.

- **Convert `@utility card-body`**: Pure layout/spacing. `padding: 1.25rem 1.25rem 1.25rem 1.5rem` becomes `p-5 pl-6` (left side is slightly larger — the asymmetry is intentional to leave room for the card-stripe).

- **Convert `@utility card-icon`**: Three layout properties inline (`w-10 h-10 object-contain`); the single `drop-shadow` becomes an arbitrary filter value `[filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.5))]`. A single-property arbitrary value is acceptable here.

- **Convert `@utility card-name`**: All five properties use theme tokens already generating Tailwind utilities (`font-display`, `text-base`, `font-bold`, `tracking-widest`, `uppercase`, `text-text-bright`).

- **Convert `@utility card-description`**: All four properties have direct Tailwind equivalents (`text-[0.8rem]`, `text-text-muted`, `leading-[1.4]`, `mt-auto`).

- **Convert `@utility footer-colophon`**: All eight properties map to Tailwind. `border-top: 1px solid rgba(255,255,255,0.05)` becomes `border-t border-white/5`.

- **Keep `@utility card-type` in CSS**: The `color: var(--card-accent, var(--color-sunset-magenta))` fallback chain is the key property. It could be expressed as `text-[var(--card-accent,var(--color-sunset-magenta))]` but with only 5 total properties this class is small — keeping it avoids a noisy arbitrary value whose intent is unclear.

- **Keep `@utility card-grid` in CSS**: Responsive CSS Grid with two `@media` breakpoints is technically doable in Tailwind (`grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1`) but the current implementation is readable and the grid is not a candidate for conversion given design sensitivity.

- **Keep `@utility card` in CSS**: The multi-layer `box-shadow` (4 layers) and `background: linear-gradient(145deg, ...)` are the core "arcade cartridge" aesthetic. As arbitrary values these would be extremely verbose and unreadable. Layout properties (`position: relative`, `display: flex`, etc.) could theoretically be split out, but fragmenting a single visual component across CSS + HTML creates maintenance confusion.

- **Keep `@utility card-stripe` in CSS**: Both `background` and `box-shadow` use `var(--card-accent, ...)` fallback chains. The per-card variable pattern requires CSS to resolve; the class as a whole is short and coherent.

- **Keep `@utility hero-wordmark` in CSS**: `width: min(480px, 90vw)` is fine as an arbitrary value, but the chained double `drop-shadow` filter (`drop-shadow(...) drop-shadow(...)`) cannot be composed through Tailwind's filter utilities — it requires a single `filter:` declaration. Keep as `@utility`.

- **Keep `@utility hero-tagline` in CSS**: The gradient text effect requires the three-property combination `-webkit-background-clip: text` + `-webkit-text-fill-color: transparent` + `background-clip: text` applied together. While Tailwind v4 has `bg-clip-text` and `text-transparent`, the three-stop gradient using theme tokens is cleaner as a named utility.

- **Keep `@utility kofi-donate` in CSS**: `color-mix(in srgb, ...)`, multi-layer `box-shadow`, gradient `background`, nested `&:hover`/`&:focus-visible`, and `@media (forced-colors: active)` make this genuinely complex custom CSS. The layout and typography at the top could be inlined, but splitting this component would harm readability.

- **Delete `@utility card-hover`**: This block is never referenced in `src/index.html` or anywhere else. The actual hover behaviour is provided by the `.card:hover, .card:focus-visible` rule in `@layer base`. The two definitions also conflict (`card-hover` references `--card-accent-rgb` which does not exist on any card). Remove entirely.

## Open Questions

### Resolved During Planning

- **Does Tailwind v4 auto-generate utilities for `@theme` tokens?** Yes — `--color-text-bright` in `@theme` generates `text-text-bright`; `--font-display` generates `font-display`; etc. No arbitrary values needed for colours and fonts.
- **Is `card-hover` safe to delete?** Yes — a grep of `src/index.html` confirms `card-hover` is never used as a class. The hover behaviour lives in `@layer base`.

### Deferred to Implementation

- **Exact Tailwind class strings for each element**: The plan specifies which properties move; the implementer chooses the precise class tokens (e.g., whether to use `p-5 pl-6` or `pt-5 pr-5 pb-5 pl-6` for `card-body`).
- **Ordering of inline classes**: Conventions for grouping layout, spacing, and typography within a single `class=""` attribute are left to the implementer — consistency across all converted elements is the goal.

## Implementation Units

- [ ] **Unit 1: Convert `.page-wrapper` to inline Tailwind and remove from CSS**

**Goal:** Replace the `.page-wrapper` `@layer base` class with equivalent Tailwind utilities on the `<div class="page-wrapper">` element in the HTML, and delete the CSS definition.

**Requirements:** R1, R2, R6

**Dependencies:** None

**Files:**
- Modify: `src/index.html`
- Modify: `src/input.css`

**Approach:**
- Map `min-height: 100vh` → `min-h-screen`, `display: flex` → `flex`, `flex-direction: column` → `flex-col`, `align-items: center` → `items-center`, `max-width: 1400px` → `max-w-[1400px]`, `margin: 0 auto` → `mx-auto`, `padding: 0 1rem` → `px-4`.
- Remove the entire `@layer base { .page-wrapper { … } }` block from `src/input.css`.

**Patterns to follow:**
- `<footer class="flex flex-col items-center gap-5">` — the existing inline Tailwind pattern on the footer.

**Test scenarios:**
- Test expectation: none — pure visual/layout; verify manually in browser that the page still centers, has a max-width constraint, and the vertical flex layout is intact.

**Verification:**
- `<div class="page-wrapper">` is gone; element has equivalent Tailwind classes.
- `src/input.css` has no `.page-wrapper` block.
- `npm run build` succeeds without errors.

---

- [ ] **Unit 2: Convert `@utility hero` to inline Tailwind and remove from CSS**

**Goal:** Replace the `hero` utility class on `<header class="hero">` with inline Tailwind utilities.

**Requirements:** R1, R2, R6

**Dependencies:** None

**Files:**
- Modify: `src/index.html`
- Modify: `src/input.css`

**Approach:**
- Map `display: flex` → `flex`, `flex-direction: column` → `flex-col`, `align-items: center` → `items-center`, `justify-content: center` → `justify-center`, `text-align: center` → `text-center`, `padding: 4rem 1rem 3rem` → `pt-16 px-4 pb-12`, `width: 100%` → `w-full`.
- Remove `@utility hero { … }` from `src/input.css`.

**Patterns to follow:**
- Existing footer element for class ordering convention.

**Test scenarios:**
- Test expectation: none — pure layout/spacing; verify manually that the hero section is still centred with expected padding.

**Verification:**
- `<header>` element has no `hero` class; has equivalent Tailwind classes.
- `@utility hero` block is removed from `src/input.css`.

---

- [ ] **Unit 3: Convert `@utility card-body`, `card-icon`, `card-name`, `card-description` to inline Tailwind and remove from CSS**

**Goal:** Replace four card-internal utility classes with inline Tailwind utilities on the corresponding elements inside each card, and remove all four `@utility` definitions.

**Requirements:** R1, R2, R6

**Dependencies:** None (card layout handled by `@utility card` which stays in CSS)

**Files:**
- Modify: `src/index.html`
- Modify: `src/input.css`

**Approach:**
- `card-body`: `flex flex-col flex-1 p-5 pl-6 gap-2` (6 cards × 1 element each).
- `card-icon`: `w-10 h-10 object-contain [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.5))]` (6 cards × 1 element each).
- `card-name`: `font-display text-base font-bold tracking-widest uppercase text-text-bright` (6 cards).
- `card-description`: `text-[0.8rem] text-text-muted leading-[1.4] mt-auto` (6 cards).
- Remove all four `@utility` blocks from `src/input.css`.
- Since all 6 cards share identical structure, use find-and-replace to apply changes consistently.

**Patterns to follow:**
- Existing `card-name` Tailwind equivalent tokens are all generated from `@theme`: `font-display`, `text-text-bright`, `text-text-muted`.

**Test scenarios:**
- Test expectation: none — layout/typography refactor; verify manually that card content (icon, name, type, description) renders the same across all 6 cards.

**Verification:**
- None of the 6 card elements in `src/index.html` reference `card-body`, `card-icon`, `card-name`, or `card-description` classes.
- The four `@utility` blocks are removed from `src/input.css`.
- All 6 cards visually match their pre-refactor appearance.

---

- [ ] **Unit 4: Convert `@utility footer-colophon` to inline Tailwind and remove from CSS**

**Goal:** Replace the `footer-colophon` class on the `<p>` element in the footer with equivalent inline Tailwind utilities.

**Requirements:** R1, R2, R6

**Dependencies:** None

**Files:**
- Modify: `src/index.html`
- Modify: `src/input.css`

**Approach:**
- Map `width: 100%` → `w-full`, `text-align: center` → `text-center`, `padding: 1.5rem 1rem 2rem` → `pt-6 px-4 pb-8`, `font-family: var(--font-display)` → `font-display`, `font-size: 0.65rem` → `text-[0.65rem]`, `letter-spacing: 0.2em` → `tracking-[0.2em]`, `text-transform: uppercase` → `uppercase`, `color: var(--color-text-muted)` → `text-text-muted`, `border-top: 1px solid rgba(255,255,255,0.05)` → `border-t border-white/5`.
- Remove `@utility footer-colophon { … }` from `src/input.css`.

**Patterns to follow:**
- Footer element itself already uses inline Tailwind.

**Test scenarios:**
- Test expectation: none — pure visual; verify manually that the colophon text and top border render correctly.

**Verification:**
- `<p class="footer-colophon">` is replaced with the equivalent Tailwind classes.
- `@utility footer-colophon` block is removed from `src/input.css`.

---

- [ ] **Unit 5: Delete dead `@utility card-hover` block**

**Goal:** Remove the unused `@utility card-hover` definition from `src/input.css`.

**Requirements:** R4

**Dependencies:** None

**Files:**
- Modify: `src/input.css`

**Approach:**
- Confirm `card-hover` does not appear in `src/index.html` as a class attribute.
- Delete lines containing `@utility card-hover { … }` (lines 311–319 in current file).

**Test scenarios:**
- Test expectation: none — deleting dead code; no HTML references to remove.

**Verification:**
- `@utility card-hover` is absent from `src/input.css`.
- `src/index.html` has no reference to `card-hover`.
- `npm run build` succeeds.

## System-Wide Impact

- **Interaction graph:** Static HTML + CSS — no callbacks, middleware, or JS. Changes are purely presentation layer.
- **Unchanged invariants:** `@utility card`, `@utility card-type`, `@utility card-stripe`, `@utility hero-wordmark`, `@utility hero-tagline`, `@utility card-grid`, `@utility kofi-donate`, and all `@layer base` element/pseudo-element rules are untouched. The inline `--card-accent`/`--card-glow`/`--card-glow-wide` CSS variables on card elements are untouched.
- **Tailwind scanner:** Moving classes from CSS `@utility` definitions to `class=""` attributes in `src/index.html` is safe — Tailwind v4 scans `src/index.html` (it is not gitignored) and will pick up all moved classes automatically.
- **State lifecycle risks:** None — static site, no server state.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Arbitrary value classes (`[filter:...]`, `max-w-[1400px]`, `text-[0.8rem]`) silently dropped by Tailwind scan | Run `npm run build` after each unit and inspect `dist/app.css` to confirm the classes appear |
| Missed class reference (one of 6 cards not updated for a converted utility) | Update all 6 cards in a single pass; verify with a grep for the old class name after each unit |
| Visual regression from padding/spacing rounding | The design explicitly allows minor shifts; do a final visual check in the browser |

## Sources & References

- Related code: `src/input.css`, `src/index.html`
- External docs: https://tailwindcss.com/docs/detecting-classes-in-source-files
