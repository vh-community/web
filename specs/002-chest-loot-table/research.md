# Research — Loot Table → Chests

This document captures implementation decisions that are *permitted by* (and consistent with) specs/002-chest-loot-table/spec.md, but not always explicitly fixed as requirements.

## Decisions

### Routing / Navigation

- Decision: Use a minimal hash-based route (e.g., `#/loot-table/chests`) implemented inside the existing React app (no new router dependency).
- Rationale: Satisfies FR-001 with minimal tooling and avoids introducing a full routing library for a single new page.
- Alternatives considered:
  - React Router: more conventional, but adds dependency and setup for limited scope.
  - Multi-page Vite build: unnecessary complexity for a small app.

### Level input outside 0–100

- Decision: Clamp Level input into `[0,100]`.
- Rationale: Matches the Edge Case requirement (“clamp or reject and remain stable”) while keeping UX simple and robust.
- Alternatives considered:
  - Reject/validation error: valid, but adds more UI states without clear benefit.

### Source data location for transform

- Decision: Read source loot tables from `the_vault/gen/1.0/loot_tables/` and select files whose names contain `chest`.
- Rationale: Matches FR-009 and aligns with the repository’s current layout.
- Alternatives considered:
  - Scanning the entire `the_vault/` tree: slower and less precise.

### Output location and publication strategy

- Decision: Write derived artifacts to `public/data/loot_tables/`:
  - `index.json`
  - `chest_{id}.json` per chest
- Rationale: Matches FR-002/FR-008 and keeps the web build simple (static fetches from `public/`).
- Alternatives considered:
  - Generate at build time only: would require build hooks and increases coupling.

### Unit test runner

- Decision: Add a minimal unit-test runner (Vitest) only if tests are added.
- Rationale: Constitution requires unit tests for model mapping; Vitest fits Vite + TS best with minimal friction.
- Alternatives considered:
  - Node `node:test`: workable, but TypeScript execution/transpilation adds complexity.

## Notes

- Published chest files represent levels as **segments** (`[minLevel,maxLevel]` + tiered definition) per the spec clarifications.
- Expected values are analytic/deterministic (FR-008a), using the uniform-range expectation rule (FR-021).
