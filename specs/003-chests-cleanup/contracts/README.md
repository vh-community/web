# Contracts (Static JSON)

This project publishes static JSON files under `/home/senth/git/vh-community-web/public/data/loot_tables/`.

## No OpenAPI

Per FR-003a in `/home/senth/git/vh-community-web/specs/003-chests-cleanup/spec.md`, the repository must not maintain an OpenAPI contract for these files.

## Canonical contracts

The canonical contracts are the TypeScript model definitions in:

- `/home/senth/git/vh-community-web/src/models/jsonIndex.ts`
- `/home/senth/git/vh-community-web/src/models/tieredLootTable.ts`

## Supplemental schemas

For human-readable schema documentation (and optional validation tooling), this folder includes JSON Schema drafts:

- `jsonIndex.schema.json`
- `tieredLootTable.schema.json`
