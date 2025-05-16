import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCreditCard, FaMinus, FaMoneyBill, FaPlus, FaShoppingCart, FaTicketAlt, FaTimes, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity
} from '../redux/slices/cartSlice';
import { CURRENCY_SYMBOL } from '../data/globalText';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get cart data from Redux store
  const cartItems = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const subtotal = useSelector(selectCartTotalAmount);
  
  // Voucher state
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  
  // Modal state for confirmation
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Helper to open confirmation modal
  const openConfirmModal = ({ title, message, onConfirm }) => {
    setConfirmModal({
      open: true,
      title,
      message,
      onConfirm,
    });
  };

    // Always scroll to top when MenuPage mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper to close modal
  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, open: false });
  };

  // Calculate discount if voucher is applied
  const discountAmount = appliedVoucher ? 
    (appliedVoucher.type === 'percentage' ? (subtotal * appliedVoucher.value / 100) : appliedVoucher.value) : 0;
  
  // Calculate grand total with discount
  const grandTotal = subtotal - discountAmount;
  
  // Handle applying voucher
  const handleApplyVoucher = () => {
    // Mock voucher validation - in a real app, this would be an API call to backend
    setVoucherError('');
    
    // Example vouchers for demonstration - in production, these would come from backend
    const availableVouchers = [
      { code: 'SAVE10', type: 'percentage', value: 10, description: '10% off your order' },
      { code: 'DISCOUNT50', type: 'fixed', value: 50, description: '$ 50 off your order' },
      { code: 'EXTRA20', type: 'percentage', value: 20, description: '20% off your order' }
    ];
    
    const foundVoucher = availableVouchers.find(v => v.code === voucherCode.trim());
    
    if (foundVoucher) {
      setAppliedVoucher(foundVoucher);
      setShowVoucherModal(false);
      // Reset voucher code input
      setVoucherCode('');
    } else {
      setVoucherError('Invalid voucher code. Please try again.');
    }
  };
  
  // Handle removing applied voucher
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
  };
  
  // Handle removing item from cart with confirmation modal
  const handleRemoveItem = (id) => {
    openConfirmModal({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?',
      onConfirm: () => {
        dispatch(removeFromCart(id)); // This removes the whole product from the cart
        closeConfirmModal();
      }
    });
  };
  
  // Handle clearing the entire cart with confirmation modal
  const handleClearCart = () => {
    openConfirmModal({
      title: 'Clear Cart',
      message: 'Are you sure you want to clear your entire cart?',
      onConfirm: () => {
        dispatch(clearCart());
        closeConfirmModal();
      }
    });
  };
  
  // Handle decreasing quantity with confirmation when quantity is 1
  const handleDecreaseQuantity = (item) => {
    if (item.quantity === 1) {
      openConfirmModal({
        title: 'Remove Item',
        message: 'Are you sure you want to remove this item from your cart?',
        onConfirm: () => {
          dispatch(removeFromCart(item.id)); // Remove the whole item if quantity is 1
          closeConfirmModal();
        }
      });
    } else {
      dispatch(decreaseQuantity(item.id));
    }
  };
  
  // Handle checkout navigation
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <div className="min-h-screen pt-14 sm:pt-5 pb-16 mt-9 bg-background">
      <div className="container mx-auto px-4">
        {/* Go Back Arrow */}
        <button
          className="flex items-center text-primary cursor-pointer  hover:text-accent font-medium mb-4 px-2 py-1 rounded transition-colors"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text">Your Cart</h1>
          {cartItems.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="text-accent hover:text-accent/80 cursor-pointer text-sm font-medium flex items-center"
            >
              <FaTrash className="mr-1" /> Clear Cart
            </button>
          )}
        </div>
        
        {cartItems.length > 0 ? (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items Section (2/3 width on large screens) */}
            <div className="lg:col-span-2 mb-8 lg:mb-0">
              <div className="bg-background rounded-lg shadow-sm p-6 h-auto overflow-y-auto ">
                <h2 className="text-xl font-bold mb-6 text-text">Cart Items ({totalQuantity})</h2>
                
                {/* Cart items list */}
                <div className="space-y-6">
                      {console.log("cart items",cartItems)}
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
                          <p className="text-accent font-bold">{CURRENCY_SYMBOL} {item.price.toFixed(2)}</p>
                          {/* Show selected variations if present */}
                          {item.selectedVariations && (
                            <div className="text-xs text-[var(--color-primary)] mt-1">
                              {Object.entries(item.selectedVariations).map(([vName, oName]) => (
                                <div key={vName}>{vName}: <span className="text-[var(--color-accent)]">{oName}</span></div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Quantity Controls and Price */}
                      <div className="sm:w-2/5 flex items-start justify-between">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center border border-text/40 rounded-lg">
                          <button 
                            onClick={() => handleDecreaseQuantity(item)}
                            className="px-3 py-1 border-r cursor-pointer border-text/40 text-text hover:bg-text/10"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="px-3 py-1 text-text min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            className="px-3 py-1 border-l cursor-pointer border-text/40 text-text hover:bg-text/10"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        
                        {/* Total Price and Remove Button */}
                        <div className="text-right">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-accent hover:text-accent/80 cursor-pointer text-sm flex items-center ml-auto"
                          >
                            <FaTrash className="mr-1" size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Voucher Section */}
                {/* <div className="mt-8 border-t pt-6">
                  <button 
                    onClick={() => setShowVoucherModal(true)}
                    className="flex items-center text-xl md:text-2xl text-accent font-medium hover:text-primary/80 transition-colors"
                  >
                    <FaTicketAlt className="mr-2" /> Apply a voucher
                  </button>
                  
                  {appliedVoucher && (
                    <div className="mt-4 bg-primary/10 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium text-text">
                          {appliedVoucher.code} - {appliedVoucher.description}
                        </p>
                        <p className="text-sm text-text/70">
                          Discount: $ {discountAmount.toFixed(2)}
                        </p>
                      </div>
                      <button 
                        onClick={handleRemoveVoucher} 
                        className="text-accent hover:text-accent/80"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div> */}
                
                {/* Continue Shopping Link */}
                {/* <div className="mt-8">
                  <Link 
                    to="/menu"
                    className="flex items-center text-text font-medium hover:text-accent transition-colors"
                  >
                    <FaArrowLeft className="mr-2" /> Continue Shopping
                  </Link>
                </div> */}
              </div>
            </div>
            
            {/* Order Summary Section (1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <div className="bg-background rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-text">Order Summary</h2>
                
                {/* Price breakdown */}
                <div className="space-y-4 mb-6">
                  {/* Show order items */}
                  <div className="space-y-3 pb-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-text">
                        <span className="font-medium">
                          {item.name} <span className="text-text/60">× {item.quantity}</span>
                        </span>
                        <span className="font-medium">{CURRENCY_SYMBOL} {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Subtotal row */}
                  <div className="flex justify-between text-text border-t pt-3">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-medium">{CURRENCY_SYMBOL} {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Show discount if voucher is applied */}
                  {appliedVoucher && (
                    <div className="flex justify-between text-primary">
                      <span className="font-medium">Discount</span>
                      <span className="font-medium">- {CURRENCY_SYMBOL} {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 flex justify-between">
                    <span className="text-text font-bold">Total</span>
                    <span className="text-accent font-bold text-xl">{CURRENCY_SYMBOL} {(subtotal - discountAmount).toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Checkout button */}
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary text-secondary cursor-pointer py-3 px-6 rounded-lg font-bold hover:bg-primary/80 hover:brightness-105 transition mb-4 flex items-center justify-center"
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
          <div className="bg-background rounded-lg shadow-sm p-12 text-center">
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
              className="bg-primary text-secondary py-3 px-8 rounded-lg font-bold hover:bg-primary/80 transition inline-block"
            >
              Browse Menu
            </Link>
          </div>
        )}
      </div>
      
      {/* Voucher Modal */}
      {/* {showVoucherModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-secondary rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-text">Apply Voucher</h3>
              <button 
                onClick={() => setShowVoucherModal(false)}
                className="text-text/60 hover:text-text"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="voucherCode" className="block text-sm font-medium text-text/70 mb-1">
                Enter your voucher code
              </label>
              <input
                type="text"
                id="voucherCode"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="e.g. SAVE10"
                className="w-full p-3 border border-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {voucherError && (
                <p className="text-accent text-sm mt-1">{voucherError}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVoucherModal(false)}
                className="px-4 py-2 text-text/70 hover:text-text"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyVoucher}
                disabled={!voucherCode.trim()}
                className="px-4 py-2 bg-primary text-text rounded-lg disabled:opacity-50 hover:bg-primary/80 transition"
              >
                Apply
              </button>
            </div>
   
            <div className="mt-4 pt-4 border-t border-text/10">
              <p className="text-xs text-text/50 mb-2">Example vouchers (for testing):</p>
              <div className="text-xs text-text/70 space-y-1">
                <p>SAVE10 - 10% off your order</p>
                <p>DISCOUNT50 - $ 50 off your order</p>
                <p>EXTRA20 - 20% off your order</p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
};

export default CartPage;