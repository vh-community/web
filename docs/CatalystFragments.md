# Catalyst Fragment Generation in Wooden Chests

## Overview

Catalyst fragments (`the_vault:vault_catalyst_fragment`) can be found in wooden chests inside Vault Hunters. Unlike regular loot items, they are **not part of any loot table pool**. Instead, they are generated as a separate post-loot step in `ClassicLootLogic.generateCatalystFragments()`.

## Prerequisites

For catalyst fragments to have a chance of appearing in a wooden chest, **all** of the following must be true:

1. **Vault level ≥ 20** (configured as `catalystMinLevel` in `vault_chest_meta.json`)
2. **Crystal must allow catalyst generation** — the crystal's `canGenerateCatalystFragments()` must return `true`, which requires either:
   - The crystal has random modifiers (`hasRandomModifiers()` — i.e., an **unmodified vault**), OR
   - The crystal has an `AscensionCrystalObjective`
3. **Not an Architect vault** — if the vault has an `ArchitectObjective` and no `ChanceCatalystModifier`, catalyst fragment generation is disabled

## Probability by Chest Rarity

The chance of receiving a catalyst fragment depends on the **VaultRarity** assigned to the chest after its loot is generated:

| Chest Rarity | Catalyst Fragment Probability |
|--------------|-------------------------------|
| COMMON       | 5%                            |
| RARE         | 20%                           |
| EPIC         | 50%                           |
| OMEGA        | 100%                          |

Source: `the_vault/vault_chest_meta.json` → `catalystChances` → `the_vault:wooden_chest`

## Stack Size

When the probability check passes, exactly **1 catalyst fragment** is added. The stack size is always 1 — there is no count range or uniform distribution like regular loot table items.

## Roll Tiers

Catalyst fragments are **not rolled within any tier** of the wooden chest loot table. The wooden chest loot table has 4 tiers (weight 70, 20, 8, 2), but catalyst fragments bypass this system entirely. They are a simple probability check that runs after the loot table generation is complete.

## Effect of Item Quantity

**Item Quantity does NOT affect catalyst fragments.**

The fragment is added via `data.getLoot().add(new ItemStack(ModItems.VAULT_CATALYST_FRAGMENT))` — a fixed stack of 1. It completely bypasses the `TieredLootTableGenerator` and its item quantity multiplier logic.

## Effect of Item Rarity

Item Rarity has an **indirect effect**:

1. Item Rarity boosts the weights of non-common tiers in the `TieredLootTableGenerator` (tiers at index 1, 2, 3 get their weights multiplied by `1 + itemRarity`)
2. This changes the distribution of rolls across tiers, affecting the CDF (cumulative distribution function) score
3. The CDF score determines the chest's `VaultRarity` (COMMON / RARE / EPIC / OMEGA)
4. Higher VaultRarity → higher catalyst fragment probability

So: **more Item Rarity → better chance of a higher-rarity chest → better chance of catalyst fragments**.

## Timing: Before or After Initial Rolls?

Catalyst fragments are added **AFTER** the initial loot rolls. The generation flow is:

1. `VaultChestTileEntity.generateLootTable()` — runs `TieredLootTableGenerator`, rolls all normal loot, determines VaultRarity from CDF
2. `ChestGenerationEvent` POST phase fires
3. `ClassicLootLogic.onChestPostGenerate()` is called:
   - `generateCatalystFragments()` — appends catalyst fragment to `data.getLoot()` if check passes
   - `generateRelicFragments()` — runs separately
   - `initializeLoot()` — finalizes loot
4. `VaultChestTileEntity.fillLoot()` — places all items (including catalyst fragment) into chest slots

**Conclusion: Catalyst fragments do NOT decrease the number of other items in the chest. They are bonus items added on top of the normal loot.**

## Modifier: ChanceCatalystModifier

The `ChanceCatalystModifier` vault modifier can **additively increase** the catalyst fragment probability. It registers on the `CHEST_CATALYST_GENERATION` event and adds its configured chance value to the base probability before the final roll. This modifier can also enable catalyst fragment generation even when `ADD_CATALYST_FRAGMENTS` is not set (e.g., in modified vaults).

## Source Files

- `iskallia/vault/core/vault/ClassicLootLogic.java` — `generateCatalystFragments()` method
- `iskallia/vault/config/VaultMetaChestConfig.java` — `getCatalystChance()`, `getCatalystMinLevel()`
- `the_vault/vault_chest_meta.json` — configured probabilities and min level
- `iskallia/vault/block/entity/VaultChestTileEntity.java` — chest generation flow
- `iskallia/vault/item/crystal/CrystalData.java` — `canGenerateCatalystFragments()`
- `iskallia/vault/core/vault/modifier/modifier/ChanceCatalystModifier.java` — modifier logic
