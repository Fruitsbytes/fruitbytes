
export const FRUIT_TYPES = [
  'Apple - Red Delicious',
  'Apple - Granny Smith',
  'Apple - Golden Delicious',
  'Grape - Merlot',
  'Grape - Dominga',
  'Grape - Champagne',
  'Banana - Plantain',
  'Banana - Cavendish',
  'Banana - Morado',
  'Orange',
  'Pear',
  'Pineapple',
  'Peach',
  'Grenade',
  'Cherry - Morello',
  'Cherry - Sweetheart',
  'Blueberry',
  'Citrus - lemon',
  'Citrus - Lime',
  'Kiwi',
  'Prickly pear',
  'Dragon Fruit',
  'Coconut',
  'Tomato',
  'Citrus - Buddha\'s hand',
  'Eggplant',
  'Watermelon',
  'Strawberry',
  'Chili - Jalap~no',
  'Chili - Habamero',
  'Chili - Thai',
  'BellPepper  - Green',
  'BellPepper - Yellow',
  'BellPepper - Red',
  'Pumpkin',
  'Raspberry',
  'Blackberry',
  'Abocado',
] as const;

export const FRUIT_FLAVORS = [
  'Fresh',
  'Pickled',
  'Fermented',
  'Sweet',
  'Juicy',
  'Sour',
] as const;

export type FruitType = typeof FRUIT_TYPES[number];
export type FruitFlavor = typeof FRUIT_FLAVORS[number];

export interface Fruit {
  type: FruitType;
  seed: number;
  flavor: FruitFlavor;
}
