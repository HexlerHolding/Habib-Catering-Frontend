import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaShoppingCart, FaUser, FaTrash } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sample cart items - replace with your actual cart data
  const cartItems = [];

  return (
    <nav className="fixed top-0 left-0 w-full h-20 flex items-center justify-between p-7 z-50 bg-background">
      {/* Left section with menu toggle and logo */}
      <div className="flex items-center">
        {/* Menu toggle button */}
        <button 
          className="text-xl flex items-center justify-center mr-4"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src='/logo.webp'
            alt="Cheezious Logo" 
            className="h-10"
          />
          <h1 className='font-bold font-montserrat text-2xl ml-2 text-text'>Cheezious</h1>
        </Link>
      </div>
      
      {/* Desktop navigation - hidden */}
      <div className="hidden items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
      </div>
      
      {/* Cart and Login buttons */}
      <div className="flex items-center space-x-2">
        {/* Cart button with dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setIsCartOpen(true)}
          onMouseLeave={() => setIsCartOpen(false)}
        >
          <Link 
            to="/cart"
            className={`flex items-center justify-center px-4 py-2 rounded-xl font-bold bg-primary hover:bg-primary/80 hover:brightness-105`}
          >
            <div className="flex items-center">
              <FaShoppingCart className="text-xl" />
              <span className="ml-2 hidden sm:inline text-text">CART</span>
              <span className="ml-1 bg-red-500 text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            </div>
          </Link>
          
          {/* Dropdown menu */}
          <div 
            className={`absolute right-0 mt-2 w-64 bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
              isCartOpen ? 'opacity-100 transform translate-y-0 max-h-96' : 'opacity-0 transform -translate-y-2 max-h-0 pointer-events-none'
            }`}
          >
            <div className="p-4">
              <h3 className="font-bold text-lg border-b pb-2 text-text">Your Cart</h3>
              
              {cartItems.length > 0 ? (
                <>
                  <div className="max-h-52 overflow-y-auto py-2">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                          <div className="ml-2">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-text">{item.quantity} x Rs.{item.price}</p>
                          </div>
                        </div>
                        <button className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>Rs.{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link 
                      to="/cart" 
                      className="bg-gray-200 hover:bg-gray-300 text-center py-2 rounded font-medium text-sm"
                    >
                      View Cart
                    </Link>
                    <Link 
                      to="/checkout" 
                      className={`bg-primary hover:bg-primary/50 text-center py-2 rounded font-medium text-sm`}
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  
                  <p className="text-text/70 mb-4">YOUR CART IS EMPTY</p>
                  <p className="text-sm text-text/40 mb-4">Go ahead and explore top categories.</p>
                  <Link 
                    to="/menu" 
                    className={`bg-primary hover:bg-primary/50 px-4 py-2 rounded-lg font-medium text-sm inline-block`}
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Login button */}
        <Link 
          to="/login"
          className={`flex items-center justify-center px-4 py-2 rounded-xl font-bold bg-primary hover:bg-primary/80 hover:brightness-105 transitio`}
        >
          <FaUser className="text-xl sm:mr-2" />
          <span className="hidden sm:inline">LOGIN</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;