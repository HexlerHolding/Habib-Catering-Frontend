import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavorites, removeFromFavorites } from '../../redux/slices/favoritesSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const FavoritesPage = () => {
  const favorites = useSelector(selectFavorites);
  const dispatch = useDispatch();
  
  const handleRemoveFromFavorites = (itemId) => {
    dispatch(removeFromFavorites(itemId));
  };
  
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    // Optional: show notification or feedback
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-text">My Favorites</h2>
      
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <FaHeart className="mx-auto text-5xl text-text/30 mb-4" />
          <p className="text-text/50">You haven't added any favorites yet.</p>
          <p className="text-text/50 mt-2">Browse our menu and click the heart icon to add items to your favorites.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div key={item.id} className="border border-text/10 rounded-lg overflow-hidden">
              <div className="flex flex-col ">
                {/* Item image */}
                <div className="w-full bg-text/10">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Item details */}
                <div className="w-full p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-text mb-1">{item.name}</h3>
                    <p className="text-text/50 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <p className="text-accent font-bold">Rs. {item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex flex-col  gap-3  justify-between mt-4">
                    <button 
                      onClick={() => handleRemoveFromFavorites(item.id)}
                      className="flex items-center hover:text-accent/80 text-accent"
                    >
                      <FaHeart className="mr-1" />
                      <span>Remove</span>
                    </button>
                    
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="flex w-full items-center px-3 py-3 sm:py-1 justify-center bg-text text-secondary rounded-lg"
                    >
                      <FaShoppingCart className="mr-1" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
