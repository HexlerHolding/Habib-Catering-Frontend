// filepath: src/data/dummyMenuData.js
const dummyMenuData = [
  {
    id: '1',
    name: 'Butter Chicken',
    image: 'https://firebasestorage.googleapis.com/v0/b/demo/butter-chicken.jpg',
    description: 'Creamy tomato-based chicken curry cooked with aromatic spices.',
    price: 13.99,
    categoryId: 'cat1',
    isPopular: true,
    variations: [
      {
        name: 'Spice Level',
        options: [
          { name: 'Mild', additionalCharge: 0 },
          { name: 'Medium', additionalCharge: 0 },
          { name: 'Hot', additionalCharge: 0 }
        ]
      },
      {
        name: 'Portion Size',
        options: [
          { name: 'Half', additionalCharge: -4 },
          { name: 'Full', additionalCharge: 0 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Goat Karahi',
    image: 'https://firebasestorage.googleapis.com/v0/b/demo/goat-karahi.jpg',
    description: 'Tender goat pieces stir-fried in wok-style gravy with tomatoes & chilies.',
    price: 18.49,
    categoryId: 'cat1',
    isPopular: false,
    variations: [
      {
        name: 'Spice Level',
        options: [
          { name: 'Medium', additionalCharge: 0 },
          { name: 'Spicy', additionalCharge: 0 }
        ]
      },
      {
        name: 'Portion Size',
        options: [
          { name: 'Half (500 g)', additionalCharge: -5 },
          { name: 'Full (1 kg)', additionalCharge: 0 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Chicken Biryani',
    image: 'https://firebasestorage.googleapis.com/v0/b/demo/chicken-biryani.jpg',
    description: 'Fragrant basmati rice layered with spiced chicken and saffron.',
    price: 9.99,
    categoryId: 'cat1',
    isPopular: false,
    variations: [
      {
        name: 'Raita',
        options: [
          { name: 'Include Raita', additionalCharge: 0.5 },
          { name: 'No Raita', additionalCharge: 0 }
        ]
      },
      {
        name: 'Egg Topping',
        options: [
          { name: 'Add Boiled Egg', additionalCharge: 1 },
          { name: 'No Egg', additionalCharge: 0 }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Masala Fries',
    image: 'https://firebasestorage.googleapis.com/v0/b/demo/masala-fries.jpg',
    description: 'Golden fries tossed in house special masala seasoning.',
    price: 2.99,
    categoryId: 'cat2',
    isPopular: false,
    variations: []
  },
  {
    id: '5',
    name: 'Chocolate Lava Brownie',
    image: 'https://firebasestorage.googleapis.com/v0/b/demo/lava-brownie.jpg',
    description: 'Warm chocolate brownie with molten ganache center.',
    price: 4.99,
    categoryId: 'cat3',
    isPopular: false,
    variations: [
      {
        name: 'Serve With',
        options: [
          { name: 'Vanilla Ice Cream', additionalCharge: 1 },
          { name: 'Whipped Cream', additionalCharge: 0.5 },
          { name: 'Plain', additionalCharge: 0 }
        ]
      }
    ]
  }
];

export default dummyMenuData;
