import React, { useEffect, useState } from 'react';
import { FaHeart, FaTimes } from 'react-icons/fa';

/**
 * FavoriteNotification - Displays a notification when items are added to favorites
 * @param {Object} item - The item that was added to favorites
 * @param {Function} onClose - Function to close the notification
 * @param {Boolean} isRemoving - Whether the item is being removed from favorites
 */
const FavoriteNotification = ({ item, onClose, isRemoving = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-hide notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for fade-out animation
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div 
      className={`fixed bottom-4 right-4 bg-secondary shadow-lg rounded-lg p-4 max-w-xs w-full z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-accent rounded-md p-2 mr-3">
          <FaHeart className="text-secondary" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-bold text-text">
              {isRemoving ? 'Removed from Favorites' : 'Added to Favorites'}
            </h3>
            <button 
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-text/50 hover:text-text"
            >
              <FaTimes />
            </button>
          </div>
          <p className="text-sm text-text/70 mb-2">
            {item.name} has been {isRemoving ? 'removed from' : 'added to'} your favorites
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoriteNotification;
