export interface TieredLootTable {
  levels: TieredLootTableLevel[];
}

export interface TieredLootTableLevel {
  common: LevelPool;
  rare: LevelPool;
  epic: LevelPool;
  omega: LevelPool;
}

export interface LevelPool {
  weigth: number;
  items: ItemPool[];
}

export interface ItemPool {
  id: string;
  weight: number;
  count: number;
}
