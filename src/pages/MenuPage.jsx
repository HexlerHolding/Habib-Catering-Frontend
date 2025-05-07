import React, { useEffect, useState } from 'react';
import { FaHeart, FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { menuService } from '../../Services/menuService';
import CartNotification from '../components/CartNotification';
import { addToCart } from '../redux/slices/cartSlice';

const MenuItem = ({ item, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <div className="bg-secondary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all p-4 flex flex-col h-full">
      <div className="relative">
        {/* Heart icon */}
        <button 
          className="absolute top-2 right-2 "
          onClick={() => setIsLiked(!isLiked)}
        >
          <FaHeart className={`w-6 h-6  ${isLiked ? 'text-accent fill-current' : 'text-secondary'}`} />
        </button>
        
        {/* Image container with slate background */}
        <div className="bg-text/10 rounded-lg p-2 mb-3">
          <img 
            src={item.image}
            alt={item.name}
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.target.src = '/menu1.jpg';
            }}
          />
        </div>
      </div>
      
      <h3 className="font-bold text-lg mb-1 text-text">
        {item.name}
      </h3>
      
      <p className="text-text/50 text-sm mb-3 line-clamp-2 flex-grow">
        {item.description || 'No description available'}
      </p>
      
      <div className="mt-auto">
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
          className="w-full bg-text text-secondary py-2 px-4 rounded-lg font-medium hover:bg-text/80 transition-colors flex items-center justify-center"
          onClick={() => onAddToCart(item)}
        >
          + ADD TO CART
        </button>
      </div>
    </div>
  );
};

const MenuPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItem, setAddedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  
  // Set active category from URL parameter on component mount
  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);
  
  // Fetch menu items and categories from POS
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const fetchedCategories = await menuService.getMenuCategories();
        
        // Add "All" category at the beginning
        const allCategories = [
          { id: 'all', name: 'All' },
          ...fetchedCategories
        ];
        
        setCategories(allCategories);
        
        // Fetch products
        const products = await menuService.getMenuProducts();
        setMenuItems(products);
        setError(null);
      } catch (err) {
        setError('Failed to load menu data');
        console.error('Error loading menu:', err);
        
        // Set default "All" category on error
        setCategories([{ id: 'all', name: 'All' }]);
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []);
  
  // Filter items based on active category and search query
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch = (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Handle adding item to cart
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    setAddedItem(item);
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Show notification when item is added to cart */}
      {addedItem && (
        <CartNotification 
          item={addedItem} 
          onClose={() => setAddedItem(null)} 
        />
      )}
      
      <div className="container mx-auto">
        <div className="sticky top-0 pt-8 pb-2 px-4 bg-background z-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center text-black">
            Our Menu
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center bg-background px-4 py-2 rounded-full shadow-sm">
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
          
          {/* Dynamic Category Tabs - Sticky Section */}
          <div className="flex overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex space-x-2 mx-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 whitespace-nowrap rounded-full font-medium transition-all ${
                    activeCategory === category.id 
                      ? 'bg-primary text-text' 
                      : 'bg-text/10 text-text'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-black">Loading menu...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-accent/50 border border-accent/70 text-accent px-4 py-3 rounded relative mb-6 mx-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Menu Items Grid - Scrollable Section */}
        {!isLoading && !error && (
          <div className="px-4 pt-4 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <div className="text-center py-8">
                <h3 className="text-xl font-medium mb-2 text-black">
                  No items found
                </h3>
                <p className="text-gray-600">
                  Try a different search term or category
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;