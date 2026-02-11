# Implementation Plan: Vault Hunters Community Homepage

**Branch**: `001-community-homepage` | **Date**: 2026-02-11
**Input**: Feature specification in `specs/001-community-homepage/spec.md`

## Summary

Implement a single, content-first homepage with a semantic structure (`header`, `main`, `footer`), styled using Tailwind CSS v4 utility classes. Ensure accessibility (exactly one H1, keyboard focus, meaningful alt text) and progressive enhancement (core text available without JS via a minimal `<noscript>` fallback in `index.html`).

## Technical Context

**Language/Version**: TypeScript (project uses TS via Vite)  
**Primary Dependencies**: React, Vite, Tailwind CSS v4 (`@tailwindcss/vite`)  
**Storage**: N/A (static content)  
**Testing**: Unit tests only, colocated as `*.test.ts` (no contract/integration tests). For this homepage, tests are not required.  
**Target Platform**: Static website (modern browsers, mobile-first)  
**Performance Goals**: Fast first render of core content; avoid heavy animations and third-party embeds  
**Constraints**: No extra UI/component libraries; keep changes small and focused

## Component Structure

### `src/App.tsx` (single-page composition)

- Render a top-level wrapper with `min-h-dvh` (or equivalent) and readable text color.
- **Header**:
  - Include a logo image using an existing asset from `public/`.
  - Render exactly one `<h1>`: “Vault Hunters Community”.
  - Optional short subtitle line under the H1 (not required by spec, but acceptable if it stays minimal).
- **Main**:
  - Short purpose description in plain language.
  - Clear “unofficial / not affiliated” disclaimer as plain text (not only in images).
  - No network requests needed for the core content.
- **Footer**:
  - At least one link with descriptive text “GitHub repository”.
  - Link URL: `https://github.com/vh-community/web`.

### No additional pages

- Do not add routing.
- Do not create extra views/components unless it reduces complexity (single file is acceptable).

## Tailwind Approach (v4)

- Use Tailwind utility classes only; do not add component libraries.
- Prefer mobile-first classnames; add `sm:`+ breakpoints only where needed.
- Layout guidance:
  - Keep content within a centered max-width container (`max-w-*` + `mx-auto`) and horizontal padding (`px-4`).
  - Avoid styles that can induce horizontal overflow at 320px.
- If background imagery is used (existing assets), ensure it does not break readability:
  - Use overlay/background utilities (e.g., semi-transparent backgrounds) for text blocks.

## Accessibility Considerations

- **Exactly one H1** when JS is enabled (React app) and when JS is disabled (fallback).
- Semantic landmarks: `header`, `main`, `footer`.
- Logo image includes meaningful `alt` text.
- Links are keyboard accessible and have visible focus styling (e.g., `focus-visible:ring-*`).
- Do not rely on images alone to communicate the disclaimer.
- Ensure layout works at 320px wide without horizontal scrolling.

## Progressive Enhancement (No-JS Fallback)

### `index.html`

- Add a minimal `<noscript>` block that includes:
  - Site name
  - Purpose description
  - Unofficial/not affiliated disclaimer
  - GitHub repository link

This ensures the core content remains visible if JavaScript is disabled or fails to load, while React enhances when JS is available.

## Verification Steps

Run the following from repo root:

```bash
yarn lint
yarn build
```

Optional local run checks:

```bash
yarn dev
yarn preview
```

Manual verification checklist:

- At 320px width: no horizontal scroll; above-the-fold includes H1 + purpose + disclaimer.
- Keyboard-only: can tab to footer link; visible focus indicator.
- Screen reader: headings/landmarks make sense; disclaimer is read as normal text.
- JS disabled: `<noscript>` content shows site name, purpose, disclaimer, and GitHub link.
