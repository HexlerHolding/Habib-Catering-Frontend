import React, { useState } from 'react';
import { FaHeart, FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import CartNotification from '../components/CartNotification';
import { addToCart } from '../redux/slices/cartSlice';

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
      isPopular: true,
    },
    {
      id: 2,
      categoryId: 'pizzas',
      name: 'Pepperoni',
      description: 'Pepperoni slices with extra cheese and our signature sauce',
      price: 13.99,
      image: '/menu2.jpg',
      isPopular: true,
    },
    {
      id: 3,
      categoryId: 'pizzas',
      name: 'BBQ Chicken',
      description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
      price: 14.99,
      image: '/menu3.jpg',
      isPopular: false,
    },
    {
      id: 4,
      categoryId: 'burgers',
      name: 'Classic Cheeseburger',
      description: 'Beef patty, cheddar cheese, lettuce, tomato, and special sauce',
      price: 9.99,
      image: '/menu1.jpg',
      isPopular: true,
    },
    {
      id: 5,
      categoryId: 'burgers',
      name: 'BBQ Bacon Burger',
      description: 'Beef patty, bacon, cheddar, onion rings, and BBQ sauce',
      price: 12.99,
      image: '/menu2.jpg',
      isPopular: true,
    },
    {
      id: 6,
      categoryId: 'sides',
      name: 'Garlic Breadsticks',
      description: 'Warm breadsticks brushed with garlic butter and herbs',
      price: 5.99,
      image: '/menu3.jpg',
      isPopular: false,
    },
    {
      id: 7,
      categoryId: 'sides',
      name: 'Cheese Fries',
      description: 'Crispy fries topped with melted cheese and bacon bits',
      price: 6.99,
      image: '/menu1.jpg',
      isPopular: true,
    },
    {
      id: 8,
      categoryId: 'drinks',
      name: 'Soft Drinks',
      description: 'Choose from a variety of refreshing soft drinks',
      price: 2.49,
      image: '/menu2.jpg',
      isPopular: false,
    },
    {
      id: 9,
      categoryId: 'desserts',
      name: 'Chocolate Brownie',
      description: 'Warm chocolate brownie served with vanilla ice cream',
      price: 6.99,
      image: '/menu3.jpg',
      isPopular: true,
    },
  ],
};

const MenuItem = ({ item, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <div className="bg-secondary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all p-4">
      <div className="relative">
        {/* Heart icon */}
        <button 
          className="absolute top-2 right-2 "
          onClick={() => setIsLiked(!isLiked)}
        >
          <FaHeart className={`w-6 h-6  ${isLiked ? 'text-accent fill-current' : 'text-secondary'}`} />
        </button>
        
        {/* Image container with slate background */}
        <div className="bg-text/10 rounded-lg p-4 mb-4">
          <img 
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      </div>
      
      <h3 className="font-bold text-xl mb-1 text-text">
        {item.name}
      </h3>
      
      <p className="text-text/50 text-sm mb-3 line-clamp-2">
        {item.description}
      </p>
      
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-accent font-bold text-xl">
            Rs. {item.price.toFixed(2)}
          </span>
          {item.isPopular && (
            <span className="ml-2 bg-accent brightness-110 text-secondary text-xs px-2 py-1 rounded">
              Starting Price
            </span>
          )}
        </div>
      </div>
      
      <button 
        className="w-full bg-text text-secondary py-3 px-4 rounded-lg font-medium hover:bg-text/80 transition-colors flex items-center justify-center"
        onClick={() => onAddToCart(item)}
      >
        + ADD TO CART
      </button>
    </div>
  );
};

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItem, setAddedItem] = useState(null); // Track added item for notification
  const dispatch = useDispatch();
  
  // Filter items based on active category and search query
  const filteredItems = menuData.items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Handle adding item to cart
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    setAddedItem(item); // Set the added item to show notification
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Show notification when item is added to cart */}
      {addedItem && (
        <CartNotification 
          item={addedItem} 
          onClose={() => setAddedItem(null)} 
        />
      )}
      
      <div className="container mx-auto">
        <div className="sticky top-0 pt-12 pb-6 px-4 bg-background z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-black">
            Our Menu
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10">
            <div className="flex items-center bg-background px-4 py-3 rounded-full shadow-sm ">
              <FaSearch className="text-text/70 mr-2" />
              <input
                type="text"
                placeholder="Search our menu..."
                className="bg-transparent w-full outline-none text-text/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Category Tabs - Sticky Section */}
          <div className="flex flex-wrap justify-center mb-4">
            <button
              className={`px-5 py-2 mx-1 mb-2 rounded-full font-medium transition-all ${
                activeCategory === 'all' 
                  ? 'bg-primary text-text' 
                  : 'bg-text/10 text-text '
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
                ? 'bg-primary text-text' 
                  : 'bg-text/10 text-text '
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Items Grid - Scrollable Section */}
        <div className="px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItem 
                key={item.id} 
                item={item}
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
          
          {/* No Results Message */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2 text-black">
                No items found
              </h3>
              <p className="text-gray-600">
                Try a different search term or category
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;