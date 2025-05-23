import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { favoritesService } from '../../Services/favoritesService';
import { menuService } from '../../Services/menuService';
import { selectIsAuthenticated, selectToken } from '../redux/slices/authSlice';
import { addToCart } from '../redux/slices/cartSlice';
import VariationModal from '../components/VariationModal';
import { CURRENCY_SYMBOL } from '../data/globalText';

// if the variation data is not coming from the backend then you can use the dummy data
// start
// import dummyMenuData from '../data/dummyMenuData';
// const dummyCategories = [
//   { id: 'all', name: 'All' },
//   { id: 'cat1', name: 'Main Course' },
//   { id: 'cat2', name: 'Snacks' },
//   { id: 'cat3', name: 'Desserts' },
// ];
// end

const MenuItem = ({ item, isFavorite, onToggleFavorite, onAddToCart, isLoggedIn }) => {
  // console.log('Rendering MenuItem:', item);
    const [imgSrc, setImgSrc] = useState(item.image);
  return (
    <div className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all p-4 flex flex-col h-full">
      <div className="relative">
        {/* Heart icon */}
        <button
          className="absolute top-2 right-2"
          onClick={() => onToggleFavorite(item)}
        >
          <FaHeart className={`w-6 h-6 cursor-pointer ${isFavorite ? 'text-accent fill-current hover:text-accent/80' : 'text-secondary hover:text-secondary/80'}`} />
        </button>
        {/* Image container with slate background */}
        <div className="bg-text/10 rounded-lg p-2 mb-3">
          <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-32 object-cover rounded-lg"
          onError={() => {
            console.warn('Image failed to load:', imgSrc);
            setImgSrc('/menu1.jpg');
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
              {CURRENCY_SYMBOL} {item.price.toFixed(2)}
            </span>
            {item.isPopular && (
              <span className="ml-2 bg-accent brightness-110 text-secondary text-xs px-2 py-1 rounded">
                Starting Price
              </span>
            )}
          </div>
        </div>
        <button
          className="w-full bg-primary text-secondary cursor-pointer py-2 px-4 rounded-lg font-medium hover:bg-primary/80 transition-colors flex items-center justify-center"
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
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [variationItem, setVariationItem] = useState(null);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);

  // Refs for scroll detection
  const sectionRefs = useRef({});
  const isScrollingToSection = useRef(false);

  // Always scroll to top when MenuPage mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Set active category from URL parameter on component mount
  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  
  useEffect(() => {

// if the variation is comming from the backend , then we will uncomment this fetchMenuData function
const fetchMenuData = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await menuService.getMenuCategories();
        const allCategories = [
          { id: 'all', name: 'All' },
          ...fetchedCategories
        ];
        setCategories(allCategories);
        console.log('Fetched categories:', allCategories);
        const products = await menuService.getMenuProducts();
        console.log('Fetched products:', products);
        setMenuItems(products);
        setError(null);
      } catch (err) {
        setError('Failed to load menu data');
        setCategories([{ id: 'all', name: 'All' }]);
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };
  fetchMenuData();

  
  
  // if the variation data is not comming from the backend then you can use the dummy data
  // start
    // setMenuItems(dummyMenuData);
    // setCategories(dummyCategories);
    // setIsLoading(false);
  // end
  }, []);
     


  // Fetch favorites from backend if logged in
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn || !token) {
        setFavoriteIds([]);
        return;
      }
      try {
        const favs = await favoritesService.getFavorites(token);
        // Ensure all IDs are strings for consistent comparison
        setFavoriteIds(favs.map(f => f.toString()));
        console.log('Fetched favorites:', favs);
      } catch {
        setFavoriteIds([]);
      }
    };
    fetchFavorites();
  }, [isLoggedIn, token]);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      // Skip scroll detection only during the brief moment of programmatic scrolling
      if (isScrollingToSection.current) return;

      const scrollPosition = window.scrollY + 250; // Increased offset to account for category headings
      
      // If we're at the top of the page, set "all" as active
      if (window.scrollY < 100) {
        if (activeCategory !== 'all') {
          setActiveCategory('all');
        }
        return;
      }
      
      // Check which section is currently in view
      const categoryIds = Object.keys(sectionRefs.current);
      for (let i = 0; i < categoryIds.length; i++) {
        const categoryId = categoryIds[i];
        const element = sectionRefs.current[categoryId];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          // Start detection from the category heading (earlier in the section)
          const sectionStart = offsetTop - 50; // Start detecting 50px before the actual section
          const sectionEnd = offsetTop + offsetHeight;
          
          if (scrollPosition >= sectionStart && scrollPosition < sectionEnd) {
            if (activeCategory !== categoryId) {
              setActiveCategory(categoryId);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory]);

  // Handle category click with smooth scroll
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    
    if (categoryId === 'all') {
      isScrollingToSection.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Re-enable scroll detection after animation completes
      setTimeout(() => {
        isScrollingToSection.current = false;
      }, 800);
      return;
    }

    const element = sectionRefs.current[categoryId];
    if (element) {
      isScrollingToSection.current = true;
      const headerOffset = 250; // Increased offset to show the category heading
      const elementPosition = element.offsetTop - headerOffset;
      
      window.scrollTo({
        top: Math.max(0, elementPosition), // Ensure we don't scroll to negative position
        behavior: 'smooth'
      });
      
      // Re-enable scroll detection after animation completes
      setTimeout(() => {
        isScrollingToSection.current = false;
      }, 800);
    }
  };

  // Filter items based on search query only (not category for sections view)
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Group items by category
  const groupedItems = categories.reduce((acc, category) => {
    if (category.id === 'all') return acc;
    
    const categoryItems = filteredItems.filter(item => item.categoryId === category.id);
    if (categoryItems.length > 0) {
      acc[category.id] = {
        category,
        items: categoryItems
      };
    }
    return acc;
  }, {});

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    // Allow guests to add to cart (no login check)
    if (item.variations && item.variations.length > 0) {
      setVariationItem(item);
      setShowVariationModal(true);
    } else {
      dispatch(addToCart(item));
      toast.success(`${item.name} has been added to your cart`);
    }
  };

  // Handle saving item with variations
  const handleSaveVariation = (customizedItem) => {
    dispatch(addToCart(customizedItem));
    toast.success(`${customizedItem.name} has been added to your cart`);
  };

  // Handle favorite toggle
  const handleToggleFavorite = async (item) => {
    if (!isLoggedIn || !token) {
      toast.error('You are not logged in, login first');
      return;
    }
    console.log('Toggling favorite for item:', item);
    const isFav = favoriteIds.includes((item.id || item._id)?.toString());
    try {
      if (isFav) {
        await favoritesService.removeFavorite(item.id || item._id, token);
        setFavoriteIds(favoriteIds.filter(id => id !== (item.id || item._id)?.toString()));
        toast.success('Removed from favorites');
      } else {
        await favoritesService.addFavorite(item.id || item._id, token);
        setFavoriteIds([...favoriteIds, (item.id || item._id)?.toString()]);
        toast.success('Added to favorites');
      }
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className="min-h-screen bg-background  pb-20 pt-14">
      <div className="container mx-auto">
        {/* Go Back Arrow */}
        <button
          className="flex items-center ml-3 text-primary cursor-pointer hover:text-accent font-medium mb-2 px-2 py-1 rounded transition-colors"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center text-text">
            Our Menu
        </h1>
        <div className="sticky top-20 pt-8 pb-2 px-4 bg-background z-10">
          
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
                  className={`px-4 py-2 whitespace-nowrap cursor-pointer rounded-full font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-primary text-secondary'
                      : 'bg-text/10 text-text'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
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
        {/* Menu Items by Category Sections - Scrollable Section */}
        {!isLoading && !error && (
          <div className="px-4 pt-4 pb-12">
            {Object.keys(groupedItems).length === 0 && filteredItems.length === 0 ? (
              /* No Results Message */
              <div className="text-center py-8">
                <h3 className="text-xl font-medium mb-2 text-black">
                  No items found
                </h3>
                <p className="text-gray-600">
                  Try a different search term
                </p>
              </div>
            ) : (
              /* Category Sections */
              Object.entries(groupedItems).map(([categoryId, { category, items }]) => (
                <div 
                  key={categoryId} 
                  ref={el => sectionRefs.current[categoryId] = el}
                  className="mb-12"
                >
                  {/* Category Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-text mb-2">
                      {category.name}
                    </h2>
                    <div className="h-1 w-16 bg-primary rounded"></div>
                  </div>
                  
                  {/* Category Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        isFavorite={favoriteIds.includes((item.id || item._id)?.toString())}
                        onToggleFavorite={handleToggleFavorite}
                        onAddToCart={handleAddToCart}
                        isLoggedIn={isLoggedIn}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
            
            {/* Variation Modal */}
            {showVariationModal && variationItem && (
              <VariationModal
                item={variationItem}
                onClose={() => setShowVariationModal(false)}
                onSave={handleSaveVariation}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;