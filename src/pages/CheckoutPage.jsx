import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaMoneyBillWave, FaStore } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { branchService } from '../../Services/branchService';
import { orderService } from '../../Services/orderService';
import { clearCart, selectCartItems, selectCartTotalAmount } from '../redux/slices/cartSlice';

// Component for displaying a single branch option
const BranchOption = ({ branch, isSelected, onChange }) => (
  <label 
    className={`border rounded-md p-4 cursor-pointer transition-all font-montserrat ${
      isSelected 
        ? 'border-primary bg-primary/10' 
        : 'border-text/20 hover:border-text/30'
    }`}
  >
    <div className="flex items-center">
      <input
        type="radio"
        name="branch"
        value={branch.id}
        checked={isSelected}
        onChange={onChange}
        className="sr-only"
      />
      <div className="h-5 w-5 rounded-full border border-text/30 mr-3 flex items-center justify-center">
        {isSelected && (
          <div className="h-3 w-3 rounded-full bg-primary"></div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <FaStore className="text-text/70 mr-2" />
          <p className="font-medium text-text">{branch.name}</p>
        </div>
        <div className="mt-1 flex items-start">
          <FaMapMarkerAlt className="text-text/70 mr-2 mt-1" />
          <p className="text-sm text-text/70">{branch.address}, {branch.city}</p>
        </div>
        {branch.status === 'closed' && (
          <p className="text-accent text-sm mt-1">
            This branch is currently closed
          </p>
        )}
      </div>
    </div>
  </label>
);

// Component for displaying a payment method option
const PaymentMethodOption = ({ id, icon: Icon, title, description, isSelected, onClick }) => (
  <div 
    className={`border rounded-md p-4 cursor-pointer flex items-center font-montserrat ${
      isSelected 
        ? 'border-primary bg-primary/10' 
        : 'border-text/20 hover:border-text/30'
    }`}
    onClick={onClick}
  >
    <div className="h-5 w-5 rounded-full border border-text/30 mr-3 flex items-center justify-center">
      {isSelected && (
        <div className="h-3 w-3 rounded-full bg-primary"></div>
      )}
    </div>
    <Icon className="text-text/70 text-xl mr-3" />
    <div>
      <p className="font-medium text-text">{title}</p>
      <p className="text-sm text-text/50">{description}</p>
    </div>
  </div>
);

// Component for displaying a single cart item
const CartItem = ({ item }) => (
  <div className="flex items-start py-2 border-b border-text/20 font-montserrat">
    <img 
      src={item.image} 
      alt={item.name} 
      className="w-16 h-16 object-cover rounded"
      onError={(e) => {
        e.target.src = '/menu1.jpg';
      }}
    />
    <div className="ml-3 flex-1">
      <p className="font-medium text-text">{item.name}</p>
      <p className="text-sm text-text/70">Qty: {item.quantity}</p>
      <p className="font-medium text-text">Rs. {item.price.toFixed(2)}</p>
    </div>
    <div className="font-medium text-text">
      Rs. {(item.price * item.quantity).toFixed(2)}
    </div>
  </div>
);

// Main CheckoutPage component
const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotalAmount);
  
  // Branch states
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [branchLoading, setBranchLoading] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Islamabad',
    zipCode: '',
    notes: ''
  });
  
  // Payment and delivery states
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderType, setOrderType] = useState('delivery');
  
  // Tax state and calculations
  const [taxRate, setTaxRate] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(100);
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchLoading(true);
        const fetchedBranches = await branchService.getBranches();
        
        if (fetchedBranches.length > 0) {
          setBranches(fetchedBranches);
          if (!selectedBranchId && fetchedBranches.length > 0) {
            setSelectedBranchId(fetchedBranches[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setBranchLoading(false);
      }
    };
    
    fetchBranches();
  }, []);
  
  // Get tax rates when payment method or branch changes
  useEffect(() => {
    const fetchTaxRate = async () => {
      try {
        if (selectedBranchId) {
          const taxInfo = await orderService.getBranchTaxes(selectedBranchId);
          if (paymentMethod === 'card') {
            setTaxRate(taxInfo.card_tax || 0);
          } else {
            setTaxRate(taxInfo.cash_tax || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching tax rate:', error);
        setTaxRate(0);
      }
    };
    
    fetchTaxRate();
  }, [paymentMethod, selectedBranchId]);
  
  // Calculate tax amount and final total
  const taxAmount = subtotal * (taxRate / 100);
  const finalTotal = subtotal + taxAmount + (orderType === 'delivery' ? deliveryFee : 0);
  
  // Define order type options
  const orderTypeOptions = [
    { id: 'delivery', label: 'Delivery', description: 'Delivered to your address' },
    { id: 'takeaway', label: 'Takeaway', description: 'Pickup from restaurant' }
  ];
  
  // Define payment method options
  const paymentMethodOptions = [
    { 
      id: 'cash', 
      icon: FaMoneyBillWave, 
      title: 'Cash on Delivery', 
      description: 'Pay when you receive your order' 
    },
    { 
      id: 'card', 
      icon: FaCreditCard, 
      title: 'Credit/Debit Card', 
      description: 'Pay with your card' 
    }
  ];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 11) {
        setFormData({
          ...formData,
          [name]: digitsOnly
        });
      }
    } else if (name === 'zipCode') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 5) {
        setFormData({
          ...formData,
          [name]: digitsOnly
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle branch selection
  const handleBranchChange = (e) => {
    setSelectedBranchId(e.target.value);
    
    if (errors.branch) {
      setErrors({
        ...errors,
        branch: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5}$/.test(formData.zipCode.replace(/[^0-9]/g, ''))) {
      newErrors.zipCode = 'Please enter a valid 5-digit zip code';
    }
    
    if (!selectedBranchId) {
      newErrors.branch = 'Please select a branch';
    }
    
    return newErrors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Place order button clicked");
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      console.log("Form validation errors:", formErrors);
      setErrors(formErrors);
      const firstErrorField = Object.keys(formErrors)[0];
      document.getElementsByName(firstErrorField)?.[0]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    setSubmitError('');
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: cartItems,
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        notes: formData.notes,
        paymentMethod: paymentMethod,
        orderType: orderType,
        branchId: selectedBranchId,
      };
      
      console.log(" submitting order data:", orderData);
      
      const response = await orderService.submitOrder(orderData);
      console.log("API response:", response);
      
      if (response.success) {
        dispatch(clearCart());
        navigate('/order-success', { 
          state: { 
            orderId: response.orderId,
            orderDetails: response.orderDetails
          }
        });
      } else {
        setSubmitError(response.message || 'Failed to place your order. Please try again.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setSubmitError(error.message || 'An error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Early return if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 bg-background">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4 text-text font-poppins">Your cart is empty</h2>
          <p className="mb-6 text-text/70 font-montserrat">Please add some items to your cart before proceeding to checkout.</p>
          <button 
            onClick={() => navigate('/menu')}
            className="bg-primary text-text py-3 px-8 rounded-lg font-bold hover:bg-primary/80 transition font-poppins"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-background">
      {/* Checkout header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center text-sm font-medium mb-4 text-text hover:text-accent transition-colors font-montserrat"
        >
          <FaArrowLeft className="mr-2" /> Back to Cart
        </button>
        <h1 className="text-3xl font-bold text-text font-poppins">Checkout</h1>
      </div>
      
      {/* Display submission error if any */}
      {submitError && (
        <div className="bg-accent/10 border border-accent text-accent px-4 py-3 rounded mb-6" role="alert">
          <p className="font-medium text-accent font-poppins">Order Error</p>
          <p className="text-accent font-montserrat">{submitError}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Customer information form - 2/3 width */}
        <div className="md:col-span-2">
          {/* Branch Selection Section */}
          <div className="bg-secondary rounded-lg shadow-md p-6 mb-6 border border-primary/20">
            <h2 className="text-xl font-bold mb-4 text-text font-poppins">Select Branch</h2>
            
            {branchLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-text/70 font-montserrat">Loading branches...</span>
              </div>
            ) : branches.length > 0 ? (
              <div>
                <p className="text-sm text-text/70 mb-4 font-montserrat">
                  Please select the branch you want to order from:
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {branches.map((branch) => (
                    <BranchOption
                      key={branch.id}
                      branch={branch}
                      isSelected={selectedBranchId === branch.id}
                      onChange={handleBranchChange}
                    />
                  ))}
                </div>
                
                {errors.branch && (
                  <p className="text-accent text-sm mt-2 font-montserrat">{errors.branch}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-text/70 font-montserrat">No branches available. Please try again later.</p>
              </div>
            )}
          </div>
          
          {/* Customer Information Section */}
          <div className="bg-secondary rounded-lg shadow-md p-6 mb-6 border border-primary/20">
            <h2 className="text-xl font-bold mb-4 text-text font-poppins">Shipping Information</h2>
            
            <form id="checkout-form" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Full Name */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1 text-text font-montserrat">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${errors.fullName ? 'border-accent' : 'border-text/20'}`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-accent text-sm mt-1 font-montserrat">{errors.fullName}</p>}
                </div>
                
                {/* Email */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-text font-montserrat">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${errors.email ? 'border-accent' : 'border-text/20'}`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-accent text-sm mt-1 font-montserrat">{errors.email}</p>}
                </div>
                
                {/* Phone */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium mb-1 text-text font-montserrat">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={11}
                    className={`w-full p-3 border rounded-md ${errors.phone ? 'border-accent' : 'border-text/20'}`}
                    placeholder="03XX1234567"
                  />
                  {errors.phone && <p className="text-accent text-sm mt-1 font-montserrat">{errors.phone}</p>}
                </div>
                
                {/* Address */}
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium mb-1 text-text font-montserrat">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${errors.address ? 'border-accent' : 'border-text/20'}`}
                    placeholder="123 Main Street, Apartment 4B"
                  />
                  {errors.address && <p className="text-accent text-sm mt-1 font-montserrat">{errors.address}</p>}
                </div>
                
                {/* City */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="city" className="block text-sm font-medium mb-1 text-text font-montserrat">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${errors.city ? 'border-accent' : 'border-text/20'}`}
                    placeholder="Islamabad"
                  />
                  {errors.city && <p className="text-accent text-sm mt-1 font-montserrat">{errors.city}</p>}
                </div>
                
                {/* Zip Code */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="zipCode" className="block text-sm font-medium mb-1 text-text font-montserrat">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    maxLength={5}
                    className={`w-full p-3 border rounded-md ${errors.zipCode ? 'border-accent' : 'border-text/20'}`}
                    placeholder="44000"
                  />
                  {errors.zipCode && <p className="text-accent text-sm mt-1 font-montserrat">{errors.zipCode}</p>}
                </div>
                
                {/* Order Type Selection */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-3 text-text font-montserrat">
                    Order Type
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {orderTypeOptions.map(option => (
                      <div
                        key={option.id}
                        className={`border rounded-md p-3 cursor-pointer transition-all font-montserrat ${
                          orderType === option.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-text/20 hover:border-text/30'
                        }`}
                        onClick={() => setOrderType(option.id)}
                      >
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full border border-text/30 mr-3 flex items-center justify-center flex-shrink-0">
                            {orderType === option.id && (
                              <div className="h-3 w-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-text">{option.label}</p>
                            <p className="text-sm text-text/50">{option.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Additional Notes */}
                <div className="col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium mb-1 text-text font-montserrat">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border border-text/20 rounded-md"
                    placeholder="Special instructions for delivery or food preparation..."
                  ></textarea>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="mt-8 mb-8">
                <h2 className="text-xl font-bold mb-4 text-text font-poppins">Payment Method</h2>
                
                <div className="space-y-4">
                  {paymentMethodOptions.map(option => (
                    <PaymentMethodOption
                      key={option.id}
                      id={option.id}
                      icon={option.icon}
                      title={option.title}
                      description={option.description}
                      isSelected={paymentMethod === option.id}
                      onClick={() => setPaymentMethod(option.id)}
                    />
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary - 1/3 width */}
        <div className="md:col-span-1">
          <div className="bg-secondary rounded-lg shadow-md p-6 sticky top-20 border border-primary/20">
            <h2 className="text-xl font-bold mb-4 text-text font-poppins">Order Summary</h2>
            
            {/* Product list */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-2 py-4 border-t border-b border-text/20">
              <div className="flex justify-between">
                <span className="text-text/70 font-montserrat">Subtotal</span>
                <span className="text-text font-montserrat">Rs. {subtotal.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-text/70 font-montserrat">Delivery Fee</span>
                  <span className="text-text font-montserrat">Rs. {deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text/70 font-montserrat">Tax ({taxRate}%)</span>
                <span className="text-text font-montserrat">Rs. {taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span className="text-text font-poppins">Total</span>
                <span className="text-text font-poppins">Rs. {finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting || branchLoading || branches.length === 0}
              className={`w-full mt-6 py-3 rounded-md text-center font-bold text-text transition-all font-poppins ${
                isSubmitting || branchLoading || branches.length === 0
                  ? 'bg-text/20 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
            
            <p className="text-xs text-text/50 text-center mt-4 font-montserrat">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;