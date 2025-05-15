import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { favoritesService } from '../../../Services/favoritesService';
import { menuService } from '../../../Services/menuService';
import { selectIsAuthenticated, selectToken } from '../../redux/slices/authSlice';
import { addToCart } from '../../redux/slices/cartSlice';

// MenuItem component copied from MenuPage for consistent card UI
const MenuItem = ({ item, onRemoveFavorite, onAddToCart }) => (
  <div className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all p-4 flex flex-col h-full">
    <div className="relative">
      {/* Heart icon for remove */}
      <button
        className="absolute top-2 right-2"
        onClick={() => onRemoveFavorite(item)}
      >
        <FaHeart className="w-6 h-6 cursor-pointer text-accent hover:text-accent/80 fill-current" />
      </button>
      {/* Image container */}
      <div className="bg-text/10 rounded-lg p-2 mb-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-32 object-cover rounded-lg"
          onError={(e) => {
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
        <span className="text-accent font-bold text-xl">
          $ {item.price?.toFixed(2)}
        </span>
      </div>
      <button
        className="w-full bg-primary text-secondary cursor-pointer py-2 px-4 rounded-lg font-medium hover:bg-primary/80 transition-colors flex items-center justify-center"
        onClick={() => onAddToCart(item)}
      >
        {/* <FaShoppingCart className="mr-1" /> */}
        +
        Add to Cart
      </button>
    </div>
  </div>
);

const FavoritesPage = () => {
  const isLoggedIn = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      if (!isLoggedIn || !token) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      try {
        const favIds = await favoritesService.getFavorites(token);
        let favProducts = [];
        if (Array.isArray(favIds) && favIds.length > 0) {
          const allProducts = await menuService.getMenuProducts();
          const favIdStrings = favIds.map(id => id.toString());
          favProducts = allProducts.filter(
            p => favIdStrings.includes((p.id || p._id)?.toString())
          );
        }
        setFavorites(favProducts);
      } catch {
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [isLoggedIn, token]);

  const handleAddToCart = (item) => {
    if (!isLoggedIn || !token) {
      toast.error('You are not logged in, login first');
      return;
    }
    dispatch(addToCart(item));
    toast.success(`${item.name} has been added to your cart`);
  };

  const handleRemoveFromFavorites = async (item) => {
    if (!isLoggedIn || !token) {
      toast.error('You are not logged in, login first');
      return;
    }
    try {
      await favoritesService.removeFavorite(item.id || item._id, token);
      setFavorites(favorites.filter(f => (f.id || f._id) !== (item.id || item._id)));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove favorite');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-text">My Favorites</h2>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-8">
          <FaHeart className="mx-auto text-5xl cursor-pointer text-text/30 mb-4" />
          <p className="text-text/50">You haven't added any favorites yet.</p>
          <p className="text-text/50 mt-2">Browse our menu and click the heart icon to add items to your favorites.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((item) => (
            <MenuItem
              key={item.id || item._id}
              item={item}
              onRemoveFavorite={handleRemoveFromFavorites}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
