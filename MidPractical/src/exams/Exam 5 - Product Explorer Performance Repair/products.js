export const CATEGORIES = ['Books', 'Electronics', 'Garden', 'Kitchen', 'Toys'];

const ADJECTIVES = ['Classic', 'Compact', 'Deluxe', 'Eco', 'Premium', 'Rugged', 'Smart', 'Vintage'];

const NOUNS = {
  Books: ['Novel', 'Atlas', 'Cookbook', 'Journal', 'Biography', 'Handbook'],
  Electronics: ['Speaker', 'Charger', 'Headphones', 'Webcam', 'Keyboard', 'Monitor'],
  Garden: ['Trowel', 'Planter', 'Hose', 'Pruner', 'Lantern', 'Sprinkler'],
  Kitchen: ['Skillet', 'Blender', 'Kettle', 'Knife Set', 'Toaster', 'Grater'],
  Toys: ['Puzzle', 'Robot', 'Blocks', 'Kite', 'Board Game', 'Train Set']
};

export const PRODUCT_COUNT = 800;

export const PRODUCTS = Array.from({ length: PRODUCT_COUNT }, (_, index) => {
  const category = CATEGORIES[index % CATEGORIES.length];
  const nouns = NOUNS[category];
  const adjective = ADJECTIVES[(index * 7) % ADJECTIVES.length];
  const noun = nouns[Math.floor(index / CATEGORIES.length) % nouns.length];
  const cents = 500 + ((index * 7919) % 49500);

  return {
    id: index + 1,
    name: `${adjective} ${noun} ${index + 1}`,
    category,
    price: cents / 100
  };
});
