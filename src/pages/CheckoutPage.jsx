import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa';
import { selectCartItems, selectCartTotalAmount } from '../redux/slices/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delivery fee and total calculation
  const deliveryFee = 150;
  const finalTotal = totalAmount + deliveryFee;
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone and zipCode fields
    if (name === 'phone') {
      // Only allow digits and limit to 11 characters
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 11) {
        setFormData({
          ...formData,
          [name]: digitsOnly
        });
      }
    } else if (name === 'zipCode') {
      // Only allow digits and limit to 5 characters
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 5) {
        setFormData({
          ...formData,
          [name]: digitsOnly
        });
      }
    } else {
      // Normal handling for other fields
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
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
    
    return newErrors;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form first
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Proceed with checkout
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create order object
      const orderData = {
        items: cartItems,
        customerDetails: formData,
        paymentMethod,
        orderTotal: totalAmount,
        deliveryFee,
        finalTotal,
        orderDate: new Date(),
        status: 'pending'
      };
      
      // Here you would typically send this data to your backend
      console.log('Order submitted:', orderData);
      
      // Navigate to success page (this would be created separately)
      navigate('/order-success', { state: { orderId: 'ORD-' + Date.now() } });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Early return if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-6">Please add some items to your cart before proceeding to checkout.</p>
          <button 
            onClick={() => navigate('/menu')}
            className="btn-primary"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Checkout header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center text-sm font-medium mb-4 hover:text-accent transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Cart
        </button>
        <h1 className="section-heading">Checkout</h1>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Customer information form - 2/3 width */}
        <div className="md:col-span-2">
          <div className="bg-secondary rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Full Name */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                
                {/* Email */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                {/* Phone */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={11}
                    className={`w-full p-3 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="03XX1234567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                {/* Address */}
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="123 Main Street, Apartment 4B"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                
                {/* City */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="city" className="block text-sm font-medium mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Karachi"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                
                {/* Zip Code */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    maxLength={5}
                    className={`w-full p-3 border rounded-md ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="12345"
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
                
                {/* Additional Notes */}
                <div className="col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Special instructions for delivery or food preparation..."
                  ></textarea>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="mt-8 mb-8">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Credit Card Option */}
                  <div 
                    className={`border rounded-md p-4 cursor-pointer flex items-center ${
                      paymentMethod === 'card' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="h-5 w-5 rounded-full border border-gray-400 mr-3 flex items-center justify-center">
                      {paymentMethod === 'card' && (
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <FaCreditCard className="text-gray-700 text-xl mr-3" />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Pay with your card (secure payment)</p>
                    </div>
                  </div>
                  
                  {/* Cash on Delivery Option */}
                  <div 
                    className={`border rounded-md p-4 cursor-pointer flex items-center ${
                      paymentMethod === 'cash' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <div className="h-5 w-5 rounded-full border border-gray-400 mr-3 flex items-center justify-center">
                      {paymentMethod === 'cash' && (
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <FaMoneyBillWave className="text-gray-700 text-xl mr-3" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary - 1/3 width */}
        <div className="md:col-span-1">
          <div className="bg-secondary rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            {/* Product list */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start py-2 border-b">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="font-medium">Rs. {item.price.toFixed(2)}</p>
                  </div>
                  <div className="font-medium">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-2 py-4 border-t border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs. {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>Rs. {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span>Rs. {finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full mt-6 py-3 rounded-md text-center font-bold text-text transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
