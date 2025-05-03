import React, { useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';

// Menu categories and items data
const menuData = {
  categories: [
    { id: 'pizzas', name: 'Pizzas' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'sides', name: 'Sides' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'desserts', name: 'Desserts' },
  ],
  items: [
    {
      id: 1,
      categoryId: 'pizzas',
      name: 'Classic Margherita',
      description: 'Fresh tomatoes, mozzarella, basil, and our signature sauce',
      price: 11.99,
      image: '/menu1.jpg',
      placeholderImage: 'https://via.placeholder.com/300x300/FFDE59/222222?text=Margherita',
      isPopular: true,
    },
    {
      id: 2,
      categoryId: 'pizzas',
      name: 'Pepperoni',
      description: 'Pepperoni slices with extra cheese and our signature sauce',
      price: 13.99,
      image: '/menu2.jpg',
      placeholderImage: 'https://via.placeholder.com/300x300/FFDE59/222222?text=Pepperoni',
      isPopular: true,
    },
    {
      id: 3,
      categoryId: 'pizzas',
      name: 'BBQ Chicken',
      description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
      price: 14.99,
      image: '/menu3.jpg',
      placeholderImage: 'https://via.placeholder.com/300x300/FFDE59/222222?text=BBQ+Chicken',
      isPopular: false,
    },
    {
      id: 4,
      categoryId: 'burgers',
      name: 'Classic Cheeseburger',
      description: 'Beef patty, cheddar cheese, lettuce, tomato, and special sauce',
      price: 9.99,
      image: '/menu1.jpg',
      placeholderImage: 'https://via.placeholder.com/300x300/FFDE59/222222?text=Classic+Burger',
      isPopular: true,
    },
    {
      id: 5,
      categoryId: 'burgers',
      name: 'BBQ Bacon Burger',
      description: 'Beef patty, bacon, cheddar, onion rings, and BBQ sauce',
      price: 12.99,
      image: '/menu2.jpg',
      placeholderImage: 'https://via.placeholder.com/300x300/FFDE59/222222?text=BBQ+Bacon',
      isPopular: true,
    },
    {
      id: 6,
      categoryId: 'sides',
      name: 'Garlic Breadsticks',
      description: 'Warm breadsticks brushed with garlic butter and herbs',
      price: 5.99,
      image: '/menu3.jpg',
      placeholderImage: 'https://via.placeholder.com/300x300/FFDE59/222222?text=Breadsticks',
      isPopular: false,
    },
    {
      id: 7,
      categoryId: 'sides',
      name: 'Cheese Fries',
      description: 'Crispy fries topped with melted cheese and bacon bits',
      price: 6.99,
      image: '/menu1.jpg',
      placeholderImage: 'https://via.placeholder.com/300x300/FFDE59/222222?text=Cheese+Fries',
      isPopular: true,
    },
    {
      id: 8,
      categoryId: 'drinks',
      name: 'Soft Drinks',
      description: 'Choose from a variety of refreshing soft drinks',
      price: 2.49,
      image: '/menu2.jpg',
      placeholderImage: 'https://via.placeholder.com/300x300/FFDE59/222222?text=Soft+Drinks',
      isPopular: false,
    },
    {
      id: 9,
      categoryId: 'desserts',
      name: 'Chocolate Brownie',
      description: 'Warm chocolate brownie served with vanilla ice cream',
      price: 6.99,
      image: '/menu3.jpg',
      placeholderImage: 'https://via.placeholder.com/300x300/FFDE59/222222?text=Brownie',
      isPopular: true,
    },
  ],
};

const MenuItem = ({ item }) => {
  
  return (
    <div className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all p-4 flex flex-col `}>
      <div className="relative pb-[75%] mb-4">
        <img 
          src={item.image} 
          alt={item.name}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
       
        />
        {item.isPopular && (
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded  `}>
            POPULAR
          </div>
        )}
      </div>
      
      <h3 className={`font-bold text-lg mb-1 `}>
        {item.name}
      </h3>
      
      <p className={`text-sm mb-4 flex-grow `}>
        {item.description}
      </p>
      
      <div className="flex justify-between items-center mt-auto">
        <span className={`font-bold text-xl `}>
          ${item.price.toFixed(2)}
        </span>
        
        <button className={`p-2 rounded-full `}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState(menuData.categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter items based on active category and search query
  const filteredItems = menuData.items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className={`min-h-screen py-12 px-4`}>
      <div className="container mx-auto">
        <h1 className={`text-3xl md:text-4xl font-bold mb-8 text-center }`}>
          Our Menu
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className={`flex items-center px-4 py-2 rounded-full shadow-md `}>
            <FaSearch className={`mr-2`} />
            <input
              type="text"
              placeholder="Search our menu..."
              className={`bg-transparent w-full outline-none`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <button
            className={`px-5 py-2 mx-1 mb-2 rounded-full font-medium transition-all ${
              activeCategory === 'all' 
                ? `bg-accent text-text`
                : `bg-primary text-text `
            }`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          
          {menuData.categories.map((category) => (
            <button
              key={category.id}
              className={`px-5 py-2 mx-1 mb-2 rounded-full font-medium transition-all ${
                activeCategory === category.id 
                  ? `text-text`
                  : `text-text`
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
        
        {/* No Results Message */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className={`text-xl font-medium mb-2`}>
              No items found
            </h3>
            <p className='text-gray-700'>
              Try a different search term or category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;