---
title: "feat: Add Ko-fi donate button to footer"
type: feat
status: completed
date: 2026-04-18
---

# feat: Add Ko-fi donate button to footer

## Overview

Re-add the Ko-fi donate button that existed on the old site. The button lives in the page footer as a styled link to `https://ko-fi.com/oliflix`, themed to match the synthwave design system. No JavaScript is used — this is a plain `<a>` element with CSS-only styling.

## Problem Frame

The old site included a Ko-fi donate link that was dropped during the synthwave redesign. Users who want to support the Oliflix server have no visible way to do so. Adding the button back to the footer restores that option without disrupting the current design.

## Requirements Trace

- R1. A visible "Buy me a coffee" / Ko-fi link appears in the footer
- R2. The button links to `https://ko-fi.com/oliflix` in a new tab
- R3. The button is styled using existing synthwave design tokens — no third-party scripts, no runtime JS
- R4. The button is accessible with a descriptive `aria-label`
- R5. The existing footer colophon text remains visible

## Scope Boundaries

- No Ko-fi widget or floating button embed (these require `<script>` tags, violating the zero-runtime-JS constraint)
- No changes to the card grid or hero section
- No new image assets required (SVG mark may be inlined or omitted in favour of text)

## Context & Research

### Relevant Code and Patterns

- `src/index.html` — `<footer>` at line 167; currently contains only `<p class="footer-colophon">`
- `src/input.css` — `@utility footer-colophon` at line 391 defines footer text style
- All six service cards follow the external-link pattern: `<a href="…" target="_blank" rel="noopener noreferrer" aria-label="…">`
- Sunset palette tokens: `--color-sunset-magenta: #ff2d78`, `--color-sunset-orange: #ff6b1a`, `--color-sunset-cyan: #00d4ff`
- Ko-fi brand colour `#FF5E5B` sits naturally within the existing magenta–orange range

### Institutional Learnings

- None (`docs/solutions/` does not yet exist)

### External References

- Ko-fi plain link approach: `<a href="https://ko-fi.com/oliflix">Support on Ko-fi</a>` — no script required

## Key Technical Decisions

- **Plain `<a>` not Ko-fi widget:** Ko-fi's hosted widget injects a `<script>` tag, violating the zero-runtime-JS constraint. A styled `<a>` achieves the same goal without any JS.
- **Footer placement, above colophon:** The footer is the conventional home for support/donate links. Placing the button above the colophon text keeps the colophon as the last element, preserving the page's compositional rhythm.
- **Synthwave-mapped colour:** Use `--color-sunset-magenta` / `--color-sunset-orange` gradient rather than Ko-fi's `#FF5E5B` to stay fully within the established palette.
- **Separate `@utility` in `input.css`:** Follows the existing `@utility` pattern for all component styles rather than adding inline styles.

## Open Questions

### Resolved During Planning

- **Ko-fi URL:** `https://ko-fi.com/oliflix` (confirmed by user)
- **Ko-fi icon:** Not required — a text-only or text+heart button is sufficient and avoids adding an asset

### Deferred to Implementation

- **Exact button copy:** "Buy me a coffee", "Support on Ko-fi", or similar — implementer's call, choose something consistent with the playful site tone
- **Hover glow colour:** Whether to use magenta, orange, or a blend — follow the existing card hover pattern as a guide

## Implementation Units

- [ ] **Unit 1: Add Ko-fi donate button styles**

**Goal:** Define a `@utility kofi-donate` block in `src/input.css` that styles the donate button inline with the synthwave theme.

**Requirements:** R3

**Dependencies:** None

**Files:**
- Modify: `src/input.css`

**Approach:**
- Add a `@utility kofi-donate {}` block at the end of the FOOTER section (after `.footer-colophon`)
- Style as a small pill/badge button using `--font-display`, `--color-sunset-magenta`, and `--color-sunset-orange` for a gradient border or background
- Include a CSS-native hover state (`opacity` or subtle `box-shadow` glow) — no JS
- Keep it visually smaller/quieter than the service cards; this is a secondary action

**Patterns to follow:**
- `@utility footer-colophon` in `src/input.css:391` — follow the same block structure
- Card hover pattern in `src/input.css:322` — `.card:hover` / `.card:focus-visible` for the native hover approach

**Test scenarios:**
- Test expectation: none — pure styling utility with no behavioral logic

**Verification:**
- The `kofi-donate` class exists in the compiled `dist/app.css` after build
- The button is visually distinct from the colophon text but not competing with the service cards

---

- [ ] **Unit 2: Add Ko-fi button to footer HTML**

**Goal:** Insert a Ko-fi donate `<a>` element in `src/index.html`'s `<footer>`, above the colophon line.

**Requirements:** R1, R2, R4, R5

**Dependencies:** Unit 1 (styles must exist first)

**Files:**
- Modify: `src/index.html`

**Approach:**
- Insert an `<a>` element inside `<footer>`, before the `<p class="footer-colophon">` line
- `href="https://ko-fi.com/oliflix"`, `target="_blank"`, `rel="noopener noreferrer"`
- `aria-label="Support oliflix on Ko-fi — opens in new tab"` (or equivalent descriptive label)
- Apply `class="kofi-donate"` from Unit 1
- Keep the existing `<p class="footer-colophon">` unchanged below it

**Patterns to follow:**
- External link pattern used on all service cards in `src/index.html:54–159`

**Test scenarios:**
- Happy path: Clicking/activating the link navigates to `https://ko-fi.com/oliflix` in a new tab
- Accessibility: The link has a descriptive `aria-label` that reads correctly in a screen reader (not just "Ko-fi" or an icon with no text)
- Edge case: With `prefers-reduced-motion` set, no animations or transitions are applied to the button
- Integration: The footer renders correctly at all three breakpoints (≥1024px, 640–1023px, <640px) — button and colophon both visible, no layout overflow

**Verification:**
- `src/index.html` footer contains the `<a class="kofi-donate">` before the colophon `<p>`
- Manual browser check: button is visible in footer, link opens `https://ko-fi.com/oliflix` in new tab
- Colophon text remains intact below the button

## System-Wide Impact

- **Interaction graph:** None — purely additive HTML + CSS, no callbacks or JS
- **Unchanged invariants:** Service card grid, hero section, starfield, and all existing footer colophon styling remain untouched

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Ko-fi changes their URL structure | Use the canonical `https://ko-fi.com/oliflix` — no path beyond the username, which is stable |
| Button visually competes with service cards | Keep the button smaller and lower-contrast than the cards; it is a secondary action |

## Sources & References

- Related code: `src/index.html:167` (footer), `src/input.css:391` (footer-colophon utility)
- Ko-fi profile: https://ko-fi.com/oliflix
