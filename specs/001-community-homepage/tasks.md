---

description: "Tasks for implementing the Vault Hunters Community Homepage"
---

# Tasks: Vault Hunters Community Homepage

**Input**: Design documents from `/specs/001-community-homepage/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: Tests are OPTIONAL and should only be added if explicitly required by the spec/constitution.
This feature does not require tests (no model-to-model mapping).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] T### [P?] [US?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US#]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm tooling and baseline configuration for the homepage work.

- [ ] T001 Confirm Tailwind v4 + Vite plugin configured in vite.config.ts
- [ ] T002 Confirm global Tailwind import exists in src/index.css
- [ ] T003 [P] Confirm required assets exist in public/ (vh-logo.png, background.webp)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cross-cutting requirements that block all user stories.

- [ ] T004 Define the exact purpose sentence + disclaimer wording in specs/001-community-homepage/spec.md (must remain plain text)
- [ ] T005 Add minimal no-JS fallback content in index.html using a <noscript> block (H1 + purpose + disclaimer + GitHub link)
- [ ] T006 Ensure base CSS does not cause horizontal scrolling at 320px (update src/index.css if needed)

**Checkpoint**: Foundation ready — implement user stories.

---

## Phase 3: User Story 1 - Understand the site quickly (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor immediately understands the site purpose and that it is unofficial.

**Independent Test**: Open the homepage at 320px width and verify above-the-fold contains the H1, purpose text, and plain-text disclaimer. Disable JS and verify core text still appears.

### Implementation (US1)

- [ ] T007 [US1] Implement semantic layout structure (header/main/footer) in src/App.tsx
- [ ] T008 [US1] Render exactly one H1 “Vault Hunters Community” in src/App.tsx
- [ ] T009 [US1] Add purpose description and plain-text unofficial/not-affiliated disclaimer in src/App.tsx (no images for critical text)
- [ ] T010 [US1] Add meaningful alt text for the header logo image in src/App.tsx
- [ ] T011 [US1] Apply mobile-first Tailwind layout (container width, padding, spacing) in src/App.tsx

### Accessibility verification (US1)

- [ ] T012 [US1] Verify keyboard navigation and visible focus styles for all interactive elements (adjust classes in src/App.tsx if needed)
- [ ] T013 [US1] Verify screen-reader structure is logical (header/main/footer landmarks; headings order) in src/App.tsx

**Checkpoint**: US1 complete and independently testable.

---

## Phase 4: User Story 2 - Find the project source (Priority: P2)

**Goal**: Visitor can find and activate the GitHub repository link from the footer.

**Independent Test**: Tab to the footer link and activate it; verify the link text is descriptive and the URL is correct.

### Implementation (US2)

- [ ] T014 [US2] Add footer link with descriptive text “GitHub repository” to https://github.com/vh-community/web in src/App.tsx
- [ ] T015 [US2] Ensure link focus styles are visible and consistent with the site styling in src/App.tsx

**Checkpoint**: US2 complete and independently testable.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks and verification.

- [ ] T016 Ensure “inspiration” constraint is respected (no copied artwork/logos/text; only existing assets) by reviewing src/App.tsx and public/
- [ ] T017 Run `yarn lint` and fix any Biome issues
- [ ] T018 Run `yarn build` and confirm production build succeeds
- [ ] T019 [P] Manual responsive check at 320px and 1440px (no horizontal scroll; layout remains readable)
- [ ] T020 [P] Manual no-JS check (disable JS and verify <noscript> content appears)

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1) → Foundational (Phase 2) → US1 (Phase 3) → US2 (Phase 4) → Polish (Phase 5)

### User Story Dependencies

- US1 depends on Phase 2 (noscript + baseline CSS)
- US2 depends on US1 structure being present (same page), but can be implemented immediately after US1 layout exists

---

## Parallel Opportunities

- Phase 1: T003 can run in parallel.
- Phase 5: T019 and T020 can run in parallel with build/lint once code is stable.

---

## Parallel Example: User Story 1

```bash
# Parallelizable checks for US1 once initial layout exists:
# - Responsive check at 320px
# - Keyboard focus check
# - No-JS fallback check
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 + Phase 2
2. Implement US1 tasks (T007–T013)
3. Validate the independent test for US1

### Incremental Delivery

- Add US2 footer link tasks after US1 is stable
- Finish with Polish tasks and CI verification
