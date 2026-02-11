# Item Rarity

Item Rarity increases the chances of receiving higher rarity items from a chest. It affects the distribution of items across the common, rare, epic, and omega pools in the loot table.

Basically it increases the weight of rare, epic, and omega pools relative to the common pool, so you are more likely to get items from those higher rarity pools when you have a higher Item Rarity.

## Formula

```javascript
commonWeight = commonWeight // Unchanged
rareWeight = rareWeight * (1 + itemRarity)
epicWeight = epicWeight * (1 + itemRarity)
omegaWeight = omegaWeight * (1 + itemRarity)
```

## Example

  ┌─────────────┬────────────────┬─────────────────┬─────────────────┐
  │ Rarity Tier │ 0% Item Rarity │ 10% Item Rarity │ 50% Item Rarity │
  ├─────────────┼────────────────┼─────────────────┼─────────────────┤
  │ Common      │ 70.00%         │ 67.96% (-2.04%) │ 60.87% (-9.13%) │
  ├─────────────┼────────────────┼─────────────────┼─────────────────┤
  │ Uncommon    │ 20.00%         │ 21.36% (+1.36%) │ 26.09% (+6.09%) │
  ├─────────────┼────────────────┼─────────────────┼─────────────────┤
  │ Rare        │ 8.00%          │ 8.54% (+0.54%)  │ 10.43% (+2.43%) │
  ├─────────────┼────────────────┼─────────────────┼─────────────────┤
  │ Epic/Omega  │ 2.00%          │ 2.14% (+0.14%)  │ 2.61% (+0.61%)  │
  └─────────────┴────────────────┴─────────────────┴─────────────────┘
