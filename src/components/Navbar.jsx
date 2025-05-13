import { useEffect, useRef, useState } from 'react';
import { FaBars, FaMinus, FaPlus, FaShoppingCart, FaSpinner, FaTrash, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import { decreaseQuantity, increaseQuantity, removeFromCart, selectCartItems, selectCartTotalAmount, selectCartTotalQuantity } from '../redux/slices/cartSlice';
import AddressSelector from './AddressSelector';

const Navbar = ({ toggleSidebar }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cartRef = useRef(null);
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
  
  // Get cart data from Redux store
  const cartItems = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const totalAmount = useSelector(selectCartTotalAmount);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Simulate loading effect when cart is opened
  useEffect(() => {
    if (isCartOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800); // Show loader for 800ms
      
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  // Handle cart dropdown visibility
  const handleCartOpen = () => {
    clearTimeout(timeoutRef.current);
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCartOpen(false);
    }, 300); // Delay before closing
  };

  // Add event listeners to monitor mouse position
  useEffect(() => {
    const cartContainer = cartRef.current;
    
    if (!cartContainer) return;
    
    cartContainer.addEventListener('mouseenter', handleCartOpen);
    cartContainer.addEventListener('mouseleave', handleCartClose);
    
    return () => {
      if (cartContainer) {
        cartContainer.removeEventListener('mouseenter', handleCartOpen);
        cartContainer.removeEventListener('mouseleave', handleCartClose);
      }
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle removing an item from cart
  const handleRemoveItem = (id, event) => {
    event.preventDefault(); // Prevent navigating to cart page
    
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      dispatch(removeFromCart(id));
    }
  };

  // Handle increasing item quantity
  const handleIncreaseQuantity = (id, event) => {
    event.preventDefault(); // Prevent navigating to cart page
    dispatch(increaseQuantity(id));
  };

  // Handle decreasing item quantity
  const handleDecreaseQuantity = (id, event) => {
    event.preventDefault(); // Prevent navigating to cart page
    dispatch(decreaseQuantity(id));
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-24 flex items-center justify-between p-7 z-50 bg-background" style={{ minHeight: '5rem' }}>
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
        <Link to="/" className=" hidden sm:flex items-center">
          <img 
            src='/habiblogo2.jpg'
            alt="Cheezious Logo" 
            className="h-16 w-16 rounded-full"
          />
        </Link>

        {/* Add the AddressSelector component here */}
        <div className='!ml-10'>

  <AddressSelector />
        </div>
      </div>
      
      {/* Desktop navigation - hidden */}
      <div className="hidden items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
      </div>
      
      {/* Cart and Login/Account buttons */}
      <div className="flex items-center space-x-2">
        {/* Cart button with dropdown */}
        <div 
          className="relative"
          ref={cartRef}
        >
          <Link 
            to="/cart"
            className={`flex items-center justify-center px-4 py-2 rounded-xl font-bold bg-primary hover:bg-primary/80 hover:brightness-105`}
          >
            <div className="flex items-center">
              <FaShoppingCart className="text-xl text-secondary" />
              <span className="ml-2 hidden sm:inline text-secondary">CART</span>
              <span className="ml-1 bg-accent text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalQuantity}
              </span>
            </div>
          </Link>
          
          {/* Dropdown menu with Tailwind positioning */}
          <div 
            className={`absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out z-50 origin-top ${
              isCartOpen ? 'opacity-100 scale-100 max-h-96' : 'opacity-0 scale-95 max-h-0 pointer-events-none'
            }`}
          >
            <div className="p-4 hidden sm:block">
              <h3 className="font-bold text-lg border-b pb-2 text-secondary">Your Cart</h3>
              
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <FaSpinner className="text-primary text-3xl animate-spin mb-2" />
                  <p className="text-secondary/70">Loading your cart...</p>
                </div>
              ) : cartItems.length > 0 ? (
                <>
                  <div className="max-h-52 overflow-y-auto py-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                          <div className="ml-2">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-sm text-text/70">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Quantity controls */}
                          <div className="flex items-center bg-text/10 rounded">
                            <button 
                              onClick={(e) => handleDecreaseQuantity(item.id, e)}
                              className="px-2 py-1 text-xs"
                            >
                              <FaMinus size={10} />
                            </button>
                            <span className="px-2 text-sm">{item.quantity}</span>
                            <button 
                              onClick={(e) => handleIncreaseQuantity(item.id, e)}
                              className="px-2 py-1 text-xs"
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>
                          
                          {/* Remove button */}
                          <button 
                            onClick={(e) => handleRemoveItem(item.id, e)}
                            className="text-accent hover:text-red-600"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>$ {totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link 
                      to="/cart" 
                      className="bg-text/10 hover:bg-text/20 text-center py-2 rounded font-medium text-sm"
                    >
                      View Cart
                    </Link>
                    <Link 
                      to="/checkout" 
                      className={`bg-primary hover:bg-primary/80 text-center py-2 rounded font-medium text-sm text-secondary`}
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
                    className={`bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg font-medium text-sm inline-block`}
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Login/Account button */}
        {isAuthenticated ? (
          <Link 
            to="/account/profile"
            className={`flex items-center justify-center px-4 py-2 rounded-xl font-bold bg-primary hover:bg-primary/80 hover:brightness-105 transition duration-300`}
          >
            <FaUser className="text-xl sm:mr-2 text-secondary " />
            <span className="hidden sm:inline text-secondary">ACCOUNT</span>
          </Link>
        ) : (
          <Link 
            to="/login"
            className={`flex items-center justify-center px-4 py-2 rounded-xl font-bold bg-primary hover:bg-primary/80 hover:brightness-105 transition duration-300`}
          >
            <FaUser className="text-xl sm:mr-2" />
            <span className="hidden sm:inline">LOGIN</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;