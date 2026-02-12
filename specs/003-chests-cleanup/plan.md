# Implementation Plan: Chests Cleanup

**Branch**: `003-chests-cleanup`
**Date**: 2026-02-12
**Spec**: `/home/senth/git/vh-community-web/specs/003-chests-cleanup/spec.md`
**Input**: Feature specification from `/home/senth/git/vh-community-web/specs/003-chests-cleanup/spec.md`

## Summary

Refactor the loot-table generator + Chests UI to reduce maintenance cost and improve usability:

- Run the generator from TypeScript source (no committed `transformer/dist` artifacts) (FR-001, A001)
- Unify on canonical TypeScript models in `/home/senth/git/vh-community-web/src/models/` (FR-002, FR-002a)
- Move UI from feature-based folders to page-based folders under `/home/senth/git/vh-community-web/src/pages/` (FR-004, FR-005)
- Extract `Header`, `Footer`, `Navigation` into reusable components (FR-006, FR-007)
- Improve Chests page UX: per-chest sections, ordering, search, friendly item names, improved table styling, and hide Treasure chest by not generating it (FR-009..FR-014)

## Technical Context

**Language/Version**: TypeScript ~5.7.x (project), Node.js 18+ (recommend Node 20 LTS for local dev)  
**Primary Dependencies**: React ^19, Vite ^6, TailwindCSS ^4, Biome ^1.9  
**Storage**: Static JSON under `/home/senth/git/vh-community-web/public/data/loot_tables/` + browser `localStorage` for settings  
**Testing**: No test suite required by constitution; unit tests only if added (colocated `*.test.ts`)  
**Target Platform**: Modern browsers (static site) + local Node.js runtime for transformer scripts  
**Project Type**: Web (Vite + React), hash routing in `/home/senth/git/vh-community-web/src/App.tsx` (no react-router)
**Performance Goals**: Fast interactive load on typical mobile connections; avoid heavy runtime dependencies  
**Constraints**:
- Keep tooling minimal and reproducible (yarn scripts)
- Do not introduce OpenAPI contracts for static JSON files (FR-003a)
- Do not commit raw extracted mod configs from `the_vault/` (constitution)
**Scale/Scope**: Single-page static site with a small number of routes (Home + Loot Table → Chests)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Content & Accessibility**: Plan keeps visible labels, keyboard operability for controls, and preserves accessible semantics for sections/tables.
- **Minimal Tooling & Reproducible Builds**: Plan uses existing Yarn/Vite/TS/Biome tooling; any new tooling is small and scoped to running transformer TS directly.
- **Performance**: UI changes are structural and do not add significant runtime work; keep table rendering memoized and avoid large additional dependencies.
- **Quality Gates**: Proposed work is compatible with `yarn lint` and `yarn build` gates.
- **Testing Policy**: No integration/contract tests will be added; any tests (if any) remain colocated unit tests only.
- **No raw extracted configs committed**: Generator continues to treat `the_vault/` as local-only input and only writes simplified JSON to `public/`.

✅ **Gate result**: PASS (no violations required).

✅ **Post-design re-check**: PASS (design artifacts do not introduce new violations).

## Project Structure

### Documentation (this feature)

```text
/home/senth/git/vh-community-web/specs/003-chests-cleanup/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (JSON schema + notes; NOT OpenAPI)
└── tasks.md             # Phase 2 output (/speckit.tasks) - not created by /speckit.plan
```

### Source Code (repository root)
```text
/home/senth/git/vh-community-web/src/
├── App.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── models/
│   ├── jsonIndex.ts
│   └── tieredLootTable.ts
└── pages/
    └── loot-tables/
        ├── (shared helpers/components)
        └── chests/
            └── (page + page-local logic)

/home/senth/git/vh-community-web/transformer/
└── (mapping + generation scripts: Vault Hunters models -> domain models/pages -> public/)

/home/senth/git/vh-community-web/public/
└── data/loot_tables/ (generated JSON output + index)

# Unit tests (if any) are colocated:
# - /home/senth/git/vh-community-web/src/pages/loot-tables/chests/foo.ts
# - /home/senth/git/vh-community-web/src/pages/loot-tables/chests/foo.test.ts
```

**Structure Decision**: Adopt page-based organization for UI (`src/pages/...`) and keep reusable UI primitives in `src/components/`. Keep canonical JSON contracts in `src/models/` and use them from both transformer and UI.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A — no constitution violations are required for this plan.
