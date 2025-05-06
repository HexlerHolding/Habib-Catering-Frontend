import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart, 
  clearCart,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity
} from '../redux/slices/cartSlice';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCreditCard, FaMoneyBill, FaShoppingCart } from 'react-icons/fa';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get cart data from Redux store
  const cartItems = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const subtotal = useSelector(selectCartTotalAmount);
  
  // Calculate additional costs
  const deliveryFee = 100; // Fixed delivery fee
  const taxRate = 0.05; // 5% tax
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + deliveryFee + taxAmount;
  
  // Handle removing item from cart with confirmation
  const handleRemoveItem = (id) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      dispatch(removeFromCart(id));
    }
  };
  
  // Handle clearing the entire cart with confirmation
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
    }
  };
  
  // Handle decreasing quantity with confirmation when quantity is 1
  const handleDecreaseQuantity = (item) => {
    if (item.quantity === 1) {
      if (window.confirm('Are you sure you want to remove this item from your cart?')) {
        dispatch(decreaseQuantity(item.id));
      }
    } else {
      dispatch(decreaseQuantity(item.id));
    }
  };
  
  // Handle checkout navigation
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text">Your Cart</h1>
          {cartItems.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="text-accent hover:text-accent/80 text-sm font-medium flex items-center"
            >
              <FaTrash className="mr-1" /> Clear Cart
            </button>
          )}
        </div>
        
        {cartItems.length > 0 ? (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items Section (2/3 width on large screens) */}
            <div className="lg:col-span-2 mb-8 lg:mb-0">
              <div className="bg-secondary rounded-lg shadow-sm p-6 h-screen overflow-y-auto ">
                <h2 className="text-xl font-bold mb-6 text-text">Cart Items ({totalQuantity})</h2>
                
                {/* Cart items list */}
                <div className="space-y-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row border-b pb-6">
                      {/* Product Image and Info */}
                      <div className="flex sm:w-3/5 mb-4 sm:mb-0">
                        <div className="bg-text/5 rounded-lg p-2 w-24 h-24 flex items-center justify-center">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="max-w-full max-h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-lg text-text">{item.name}</h3>
                          <p className="text-sm text-text/60 line-clamp-2 mb-1">{item.description}</p>
                          <p className="text-accent font-bold">Rs. {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      {/* Quantity Controls and Price */}
                      <div className="sm:w-2/5 flex items-start justify-between">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center border border-gray-200 rounded-lg">
                          <button 
                            onClick={() => handleDecreaseQuantity(item)}
                            className="px-3 py-1 border-r border-gray-200 text-text hover:bg-gray-100"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="px-3 py-1 text-text min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            className="px-3 py-1 border-l border-gray-200 text-text hover:bg-gray-100"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        
                        {/* Total Price and Remove Button */}
                        <div className="text-right">
                          <div className="font-bold text-text mb-1">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-accent hover:text-accent/80 text-sm flex items-center ml-auto"
                          >
                            <FaTrash className="mr-1" size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Continue Shopping Link */}
                <div className="mt-8">
                  <Link 
                    to="/menu"
                    className="flex items-center text-text font-medium hover:text-accent transition-colors"
                  >
                    <FaArrowLeft className="mr-2" /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary Section (1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <div className="bg-secondary rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-text">Order Summary</h2>
                
                {/* Price breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-text/70">Subtotal</span>
                    <span className="text-text font-medium">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70">Delivery Fee</span>
                    <span className="text-text font-medium">Rs. {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70">Tax (5%)</span>
                    <span className="text-text font-medium">Rs. {taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="text-text font-bold">Total</span>
                    <span className="text-accent font-bold text-xl">Rs. {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Checkout button */}
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary text-text py-3 px-6 rounded-lg font-bold hover:bg-primary/80 hover:brightness-105 transition mb-4 flex items-center justify-center"
                >
                  <FaCreditCard className="mr-2" /> PROCEED TO CHECKOUT
                </button>
                
                {/* Payment options notice */}
                <div className="text-center text-text/60 text-sm mt-4">
                  <p className="flex items-center justify-center mb-2">
                    <FaCreditCard className="mr-1" /> We accept all major credit cards
                  </p>
                  <p className="flex items-center justify-center">
                    <FaMoneyBill className="mr-1" /> Cash on delivery available
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Empty cart view
          <div className="bg-secondary rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-text/5 w-24 h-24 rounded-full flex items-center justify-center">
                <FaShoppingCart size={48} className="text-text/30" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">Your Cart is Empty</h2>
            <p className="text-text/60 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our menu to find delicious items!
            </p>
            <Link 
              to="/menu"
              className="bg-primary text-text py-3 px-8 rounded-lg font-bold hover:bg-primary/80 transition inline-block"
            >
              Browse Menu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
