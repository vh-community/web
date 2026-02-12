# Amendment: Chests Cleanup

**Related Feature**: `003-chests-cleanup`  
**Created**: 2026-02-12  
**Updated**: 2026-02-12  
**Status**: Draft

This document captures the requested follow-up changes after the Chests feature was merged.

## Refactoring (2026-02-12)

- A001 Refactor the transformer so that no `dist` files are generated. Instead, the `generate:loot-tables` scripts should run the TypeScript files directly, as this makes it easier to debug.
- A002 When transforming the Minecraft loot tables, transform into the `models/tieredLootTable.ts` instead of the `published...` version. The published version should be deleted.
- A006 The transformer should use the `models/tieredLootTable.ts` when exporting the loot tables to avoid duplication of models.
- A003 Instead of structuring code by feature, I want it structured by page. Located under `src/pages/loot-tables/chests/`.
- A004 I want to break out the header and footer into components, located under `src/components/Header.tsx` and `src/components/Footer.tsx`.
- A005 I want to break out the navigation into a component, located under `src/components/Navigation.tsx`.
- A007 Instead of the shared folder in loot-tables, I want the files to be located directly under `src/pages/loot-tables/` since those files will be shared across all loot table pages.
- A008 The generated loot tables are currently named `chest_gilded_chest.json`, rename them `chest_gilded.json` so that it's more concise and makes it easier to see which category the chest belongs to.

## Improve UI/UX (2026-02-12)

- A009 Make the settings user friendly and intuitive to use. Follow best practices for UI/UX design.
- A010 The UI for the settings should be consistent with the rest of the website, and use similar style as found https://vaulthunters.gg/gear for the level. Meaning all settings should follow the same style.
- A011 Separate each chest into its own section with a header.
- A012 Sort order for the chests should be: Wooden, Living, Gilded, Ornate, Hardened, Flesh, Enigma
- A013 Add a search bar to filter the chests by name.
- A014 Display the item name's in a more user friendly way. For example, instead of "minecraft:diamond_sword", display "Diamond Sword".
- A015 The treasure chest should be hidden as it's not currently used in the game.
- A016 Make the table look more visually appealing and similar to the one found on https://vaulthunters.gg/gear. This includes adding borders, fonts, and colors. However, still keep the background color scheme, but maybe improve it if necessary.
