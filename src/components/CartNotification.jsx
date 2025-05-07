import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';

/**
 * CartNotification - Displays a notification when items are added to cart
 * @param {Object} item - The item that was added to cart
 * @param {Function} onClose - Function to close the notification
 */
const CartNotification = ({ item, onClose }) => {
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
      className={`fixed bottom-4 right-4 bg-background shadow-lg rounded-lg p-4 max-w-xs w-full z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-primary rounded-md p-2 mr-3">
          <FaShoppingCart className="text-text" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-bold text-text">Added to Cart</h3>
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
          <p className="text-sm text-text/70 mb-2">{item.name} has been added to your cart</p>
          <Link 
            to="/cart"
            className="text-sm text-accent font-medium hover:text-accent/80"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
