
import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { menuService } from '../../Services/menuService';
//import categoryservice
import { categoryService } from '../../Services/CategoryService';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});

  // Define categories (you can also fetch these from POS if needed)
  const menuCategories = [
    { id: 'all', name: 'All' },
    { id: 'pizzas', name: 'Pizzas' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'sides', name: 'Sides' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'others', name: 'Others' }
  ];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const products = await menuService.getMenuProducts();
        setMenuItems(products);
        
        // Get category counts
        const counts = await categoryService.getCategoriesWithCounts(products);
        setCategoryCounts(counts);
        
        setError(null);
      } catch (err) {
        setError('Failed to load menu items');
        console.error('Error loading menu:', err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMenuItems();
  }, []);
  
  // Update category button to show counts:
  {menuCategories.map((category) => (
    <button
      key={category.id}
      className={`px-5 py-2 mx-1 mb-2 rounded-full font-medium transition-all ${
        activeCategory === category.id 
          ? 'bg-accent text-text'
          : 'bg-primary text-text hover:bg-accent'
      }`}
      onClick={() => setActiveCategory(category.id)}
    >
      {category.name}
      {categoryCounts[category.id] > 0 && (
        <span className="ml-2 bg-secondary text-text rounded-full px-2 py-0.5 text-xs">
          {categoryCounts[category.id]}
        </span>
      )}
    </button>
  ))}

  // Filter items based on active category and search query
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const MenuItem = ({ item }) => {
    return (
      <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all p-4 flex flex-col">
        <div className="relative pb-[75%] mb-4">
          <img 
            src={item.image} 
            alt={item.name}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src = item.placeholderImage;
            }}
          />
          {item.isPopular && (
            <div className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded bg-accent text-text">
              POPULAR
            </div>
          )}
        </div>
        
        <h3 className="font-bold text-lg mb-1">
          {item.name}
        </h3>
        
        <p className="text-sm mb-4 flex-grow">
          {item.description}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-xl">
            ${item.price.toFixed(2)}
          </span>
          
          <button className="p-2 rounded-full bg-primary hover:bg-accent text-text">
            <FaPlus />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Our Menu
        </h1>
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p>Loading menu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Menu Content */}
        {!isLoading && !error && (
          <>
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-10">
              <div className="flex items-center px-4 py-2 rounded-full shadow-md bg-white">
                <FaSearch className="mr-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search our menu..."
                  className="bg-transparent w-full outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center mb-8">
              {menuCategories.map((category) => (
                <button
                  key={category.id}
                  className={`px-5 py-2 mx-1 mb-2 rounded-full font-medium transition-all ${
                    activeCategory === category.id 
                      ? 'bg-accent text-text'
                      : 'bg-primary text-text hover:bg-accent'
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
                <h3 className="text-xl font-medium mb-2">
                  No items found
                </h3>
                <p className="text-gray-700">
                  Try a different search term or category
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPage;