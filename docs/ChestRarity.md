# Chest Rarity System (VaultRarity) in Vault Hunters

## Overview

Every non-treasure vault chest is assigned a **VaultRarity** when opened: COMMON, RARE, EPIC, or OMEGA. This rarity is **not pre-determined** — it is calculated from the actual loot roll distribution using a CDF (Cumulative Distribution Function) score.

## How Rarity is Determined

1. The `TieredLootTableGenerator` rolls items across 4 tier pools (e.g., for wooden chest: weights 70, 20, 8, 2)
2. Each roll randomly picks one of the 4 tiers based on their weights
3. After all rolls, a CDF score is computed — this represents the probability of getting a roll distribution at least as rare as the one that occurred
4. `VaultChestConfig.getRarity(cdf)` maps the CDF score to a VaultRarity using configured thresholds

A **lower CDF** means a luckier (rarer) outcome.

## Rarity Thresholds

From `the_vault/vault_chest.json`:

| Rarity | CDF Condition | Approx. Probability (base stats) |
|--------|---------------|----------------------------------|
| OMEGA  | CDF < 0.03    | ~3%                              |
| EPIC   | CDF < 0.10    | ~7%                              |
| RARE   | CDF < 0.30    | ~20%                             |
| COMMON | CDF ≥ 0.30    | ~70%                             |

**Note:** Due to the discrete nature of the CDF (finite number of possible roll distributions), actual probabilities may differ slightly from these thresholds. With 12–15 rolls across 4 pools (wooden chest), the distribution is smooth enough that these approximations are close.

## What's Different in Each Rarity?

### Loot Quality (Primary Effect)

The rarity is a **label that reflects the roll outcome**, not a modifier applied after the fact. A higher-rarity chest already contains better items because more rolls landed in the higher-tier pools during generation.

For example, in a wooden chest:
- **Tier 0** (weight 70) — common items: wooden chunks, sandy rocks, vault sweets, etc.
- **Tier 1** (weight 20) — rare items: magic silk, carbon nuggets, driftwood, vault plating
- **Tier 2** (weight 8) — epic items: shulker shells, vault essence, silver scraps
- **Tier 3** (weight 2) — omega items: chest scrolls, mod boxes, bounty pearls

An OMEGA chest means an unusually high proportion of rolls went to Tiers 1–3 instead of Tier 0.

### Post-Generation Bonuses

Higher rarity provides better chances for additional bonus items added after the main loot:

**Catalyst Fragment Chance** (wooden chest, unmodified vault, level ≥ 20):

| Rarity | Catalyst Fragment Probability |
|--------|-------------------------------|
| COMMON | 5%                            |
| RARE   | 20%                           |
| EPIC   | 50%                           |
| OMEGA  | 100%                          |

**Companion Relic Fragment Chance:** Scales with rarity (configured separately in `companion_relics.json`).

**Companion Particle Trail Chance:** Scales with rarity (configured separately in `companion_relics.json`).

### Visual & Audio Effects

| Rarity | Sound Effect             | Particles              |
|--------|--------------------------|------------------------|
| COMMON | Standard chest open      | None                   |
| RARE   | `vault_chest_rare_open`  | None                   |
| EPIC   | `vault_chest_epic_open`  | Purple/magenta dust    |
| OMEGA  | `vault_chest_omega_open` | Green dust             |

### Display Name

The chest's display name includes the rarity as a prefix:
- "Wooden Chest" → "Rare Wooden Chest", "Epic Wooden Chest", "Omega Wooden Chest"
- Same pattern for Gilded, Living, Ornate, Altar, Hardened, Enigma, Flesh chests
- Treasure chests always display as "Treasure Chest" (they use a different generator and are always COMMON rarity)

## Does Item Rarity Affect Chest Rarity?

**Yes.** Item Rarity directly increases the probability of getting a higher-rarity chest.

In `TieredLootTableGenerator.generateEntry()`, the weights of **non-common tier pools** (index 1, 2, 3) are multiplied by `(1 + itemRarity)`:

```
adjustedPool weight[0] = base weight (unchanged)
adjustedPool weight[1] = base weight × (1 + itemRarity)
adjustedPool weight[2] = base weight × (1 + itemRarity)
adjustedPool weight[3] = base weight × (1 + itemRarity)
```

For a wooden chest with base weights [70, 20, 8, 2] and 50% Item Rarity:
- Adjusted weights: [70, 30, 12, 3] (total 115)
- Tier 0 probability drops from 70% to ~60.9%
- Higher tiers become more likely → lower CDF → higher VaultRarity chance

**Important:** The CDF is computed against the **base** (unadjusted) weights, but the actual rolls use the **adjusted** weights. This means Item Rarity makes you roll more rare-tier items, and the CDF calculation (which uses base weights) sees this as a very lucky outcome, resulting in a lower CDF and higher rarity classification.

## Does Item Quantity Affect Chest Rarity?

**Not directly.** Item Quantity affects the **number of rolls** (more rolls = more items), but does not change the tier weight distribution. The CDF is computed for the specific number of rolls that occurred, so having more rolls doesn't inherently bias toward a higher or lower CDF.

However, more rolls does slightly affect the CDF distribution shape — with more rolls, extreme outcomes become less likely (law of large numbers), so the CDF values tend to cluster more toward the center. This is a minor statistical effect, not a direct mechanical one.

## Exception: Treasure Chests

Treasure chests use a plain `LootTableGenerator` (not `TieredLootTableGenerator`) and are always assigned `VaultRarity.COMMON`. They do not participate in the CDF-based rarity system.

## Source Files

- `iskallia/vault/config/VaultChestConfig.java` — `getRarity()`, `RARITY_DISTRIBUTION`
- `the_vault/vault_chest.json` — configured rarity thresholds (0.03, 0.10, 0.30)
- `iskallia/vault/core/world/loot/generator/TieredLootTableGenerator.java` — CDF computation, Item Rarity weight boost
- `iskallia/vault/block/entity/VaultChestTileEntity.java` — rarity assignment, sounds, particles, display names
- `iskallia/vault/core/vault/ClassicLootLogic.java` — post-generation rarity-dependent bonuses
- `iskallia/vault/util/VaultRarity.java` — enum: COMMON, RARE, EPIC, OMEGA
