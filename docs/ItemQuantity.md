# Item Quantity

Item Quantity increases the amount of an item you receive from a chest.

It increases both the amount of rolls and the stack size of each roll, so it has a multiplicative effect on the total amount of an item you receive. For example, if you have Item Quantity 2, you will get 2 rolls of the loot table, and each roll will give you 2x the normal amount of items.

## Formula

```javascript
minRoll = floor(minRoll * (1 + itemQuantity))
maxRoll = floor(maxRoll * (1 + itemQuantity))

minStack = floor(minStack * (1 + itemQuantity))
maxStack = floor(maxStack * (1 + itemQuantity))
```
