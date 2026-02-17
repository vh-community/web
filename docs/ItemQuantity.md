# Item Quantity

Item Quantity increases the amount of an item you receive from a chest.

It increases both the amount of rolls and the stack size of each roll, so it has a multiplicative effect on the total amount of an item you receive. For example, if you have Item Quantity 2, you will get 2 rolls of the loot table, and each roll will give you 2x the normal amount of items.

## Formula

The game uses stochastic rounding: each whole unit is guaranteed, and the fractional remainder is a probability of +1. The expected value therefore equals the continuous product — no flooring.

```javascript
minRoll = min(54, minRoll * (1 + itemQuantity))
maxRoll = min(54, maxRoll * (1 + itemQuantity))

minStack = minStack * (1 + itemQuantity)
maxStack = maxStack * (1 + itemQuantity)
```
