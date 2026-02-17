# Changelog

## 2026-02-17 Catalyst Fragments And Fixed Item Quantity

### Added

- Catalyst Fragments were not showing up in the wooden loot table since they not part of the loot table for the wooden chest.
  Instead they are added as a bonus item after the loot table rolls.

## Fixes

- Item Quantity did not work properly except at 0%, 100%, 200%, and 300%. This is now fixed and it works properly at all values.

## 2026-02-14 Icons & URLs

### Improvements

- Visual improvements to the loot tables page
  - Add icons for each item in the loot tables
  - Add chest icons in the header per chest type
  - Hovering over an item highlights the item and all roll tiers that drop that item.
- Pages now uses URL routing on their path instead of hashes
- All text on the page has been updated to be more concise and correct.
  - This includes the Home Page
- Navigation and Header now looks better and is now Mobile friendly.

### Added

- Private policy page

## 2026-02-13 Chest UI/UX Improvements

### Changes

- Controls are now bigger and have better, consistent styling.

## 2026-02-12 Improvements to Loot Tables for Chests

### Changes

- Improve UI and UX for controls
- Add search bar to quickly filter out specific items
- Search bar now supports searching by item name in addition to chest.

### Fixes

- Fix: background image stretches to fit the entire page.

## 2026-02-11 Loot Tables for Chests

### Features

- New Loot Tables - Chest page
  - See all loot tables for chests in the game.
  - Controls for
    - Per X chests: How much loot you'll get on an average after looting X chests.
    - Level: What loot drop at your current level.
    - Item Rarity: See how the loot drops changes based on your Item Rarity %.
    - Item Quantity: See how the loot drops changes based on your Item Quantity %.
  - Item drops have a background color based on their tier drop chance.

## 2025-05-02 Initial Release

- Initial release of the project.
