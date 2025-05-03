import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';

const OrderNowButton = () => {
 
  return (
    <Link 
      to="/menu" 
      className={`fixed bottom-6 right-6 z-40 rounded-full flex items-center justify-center shadow-lg  bg-primary hover:brightness-110 transition-all duration-300 transform hover:scale-105 px-5 py-4`}
    >
      <FaShoppingBag className="text-xl mr-2" />
      <span className="font-bold text-lg">ORDER NOW</span>
    </Link>
  );
};

export default OrderNowButton;
