<!--
Sync Impact Report

- Version change: 0.3.0 -> 0.3.1
- Modified principles: content updated ->
	- Quality Gates & Testing -> Unit tests only, colocated; no contract/integration tests
	- Constraints & Standards -> Root scripts/ folder for mapping + generation into public/
- Templates updated: .specify/templates/plan-template.md ✅ updated
- Templates pending manual review: .specify/templates/spec-template.md ⚠ pending
	.specify/templates/tasks-template.md ⚠ pending
- Follow-up TODOs:
	- TODO(SCRIPT_WORKFLOW): define extraction -> transformation scripts and paths
	- Confirm any existing command templates under .specify/templates/commands/ (folder missing)
-->

# Vault Hunters Community Website Constitution

## Core Principles

### Content & Accessibility (NON-NEGOTIABLE)

The site MUST prioritize clear, accurate, and accessible content. All user-facing
pages (marketing, docs, and key user flows) MUST meet WCAG 2.1 AA or better, where
practical. Content published to the site MUST include a brief provenance statement
when it is not official (see README). Rationale: Accessibility is a non-optional
requirement for public-facing community content and reduces support burden.

### Minimal Tooling & Reproducible Builds

Build and development tooling MUST be minimal and reproducible. The project uses
Vite for local development and production builds, TypeScript for static typing,
and Biome for linting/formatting. CI pipelines MUST reproduce `yarn run build` and
`yarn run lint` results. Rationale: predictable tooling reduces onboarding
costs and prevents environment-specific failures.

### Enhancement & Performance

Performance optimizations MUST focus on user-perceived performance. The site MUST
load and become interactive quickly on typical connections (3G/4G mobile). Rationale:
fast load times improve user experience and accessibility.

### Quality Gates & Testing

All contributions MUST pass automated quality gates before merge: formatting,
linting, type-check, and a successful production build. Testing is intentionally
minimal: by default, tests are NOT required.

- This project has NO integration tests and NO contract tests.
- Only unit tests are allowed.
- Unit tests MUST be colocated with the file under test, using `*.test.ts` next
	to the implementation (e.g., `mapper.ts` + `mapper.test.ts`).
- Unit tests MUST be added when a change maps one data model into another (for
	example, transforming extracted game configuration into the site's JSON page
	structure).
- If a new spec requires tests beyond the mapping rule above, the spec author
	MUST declare that explicitly in the spec.

PRs MUST include a short testing note describing local verification steps.
Rationale: keep the test surface small while ensuring correctness for critical
data mappings.

### Governance & Versioning

Releases of the site SHALL follow semantic versioning for the published site
artifacts (MAJOR.MINOR.PATCH). Governance changes that alter principles or add
new required behaviors are MAJOR changes; adding new non-breaking principles or
material operational guidance are MINOR; wording fixes and clarifications are
PATCH. Rationale: clear versioning ties policy changes to observable release
history.

## Constraints & Standards

- Technology stack: Vite, React, TypeScript, Biome (format/lint), and Node.
- Package manager: Yarn is currently used (see `yarn.lock`).
- CI MUST run `yarn lint`, `yarn run build`, and `yarn test` (if tests exist)
	on each feature branch before merge.
- Security: Dependencies MUST be reviewed for known vulnerabilities before
	large upgrades; secrets MUST not be committed.
- Vault Hunters extracted configuration: This project will rely on extracted
 	configuration from the Vault Hunters Minecraft Java Mod to generate site
 	content. Raw extracted mod configuration files MUST NEVER be committed to the
 	repository. Instead, transformer in the root `transformer/` folder will be used to
 	convert the extracted configs into simplified JSON page structures consumable
 	by the site. The exact extraction and transformation workflow is TODO and MUST
 	be documented before any automation is merged. Until then, contributors MUST
 	NOT commit any extracted mod config. Rationale: protect license, privacy, and
 	repository hygiene while enabling reproducible content generation.

- Repository layout for data generation: A root `transformer/` folder SHOULD contain
	the mapping/transformation scripts that convert extracted Vault Hunters models
	into simplified domain models and JSON page structures. Generated artifacts
	intended for the website MUST be written into `public/` (or another documented
	build output directory) and treated as derived data. The original configuration
	files will be stored in `vh-configs/` which is part of `.gitignore`.

## Development Workflow

- Branches: feature branches follow `feature/<short-description>` or
	`fix/<short-description>` conventions.
- Pull Requests: PRs MUST include a description, link to related issue/spec,
	and a testing checklist. At least one approving reviewer is REQUIRED for
	non-trivial changes; a maintainer approval is REQUIRED for releases and
	governance amendments.
- CI gates: PRs MUST pass lint, type-check, and build. Merge is blocked until
	gates succeed.
- Releases: Release PRs MUST update `package.json` version (if applicable),
	update `CHANGELOG.md`, and include a concise summary of user-visible changes.

## Governance

Amendments to this constitution MUST be proposed as a documented PR that:

- Describes the proposed change and motivation.
- Lists the affected principles or sections.
- Includes a migration plan for any required developer changes.

Approval: A governance amendment MUST be approved by at least one project
maintainer and pass CI.

Versioning policy:

- MAJOR: Backward-incompatible governance or principle removals/redefinitions.
- MINOR: New principle/section added or material expansion of guidance.
- PATCH: Clarifications, wording fixes, or non-semantic refinements.

**Version**: 0.3.1 | **Ratified**: 2026-02-11 | **Last Amended**: 2026-02-11
