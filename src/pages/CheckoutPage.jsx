import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaStore } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/authService';
import { branchService } from '../../Services/branchService';
import { orderService } from '../../Services/orderService';
import CardDetailsModal from '../components/CardDetailsModal';
import { CURRENCY_SYMBOL, PHONE_INPUT_CONFIG } from '../data/globalText';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import { clearCart, selectCartItems, selectCartTotalAmount } from '../redux/slices/cartSlice';
import { selectSavedAddresses, selectSelectedAddress } from '../redux/slices/locationSlice';
import AddressSelector from '../components/AddressSelector';

// Component for displaying a single branch option
const BranchOption = ({ branch, isSelected, onChange }) => (
  <label
    className={`border rounded-md p-4 cursor-pointer transition-all font-montserrat ${isSelected
      ? 'border-primary bg-primary/90 text-secondary'
      : 'border-text/20 hover:border-text/30 text-secondary'
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
          <div className="h-3 w-3 rounded-full bg-white"></div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <FaStore className={`mr-2 ${isSelected ? 'text-secondary' : 'text-text/70'}`} />
          <p className={`font-medium ${isSelected ? 'text-secondary' : 'text-text'}`}>{branch.name}</p>
        </div>
        <div className="mt-1 flex items-start">
          <FaMapMarkerAlt className={`mr-2 mt-1 ${isSelected ? 'text-secondary' : 'text-text/70'}`} />
          <p className={`text-sm ${isSelected ? 'text-secondary' : 'text-text/70'}`}>{branch.address}, {branch.city}</p>
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

// Component for displaying a saved address option
const SavedAddressOption = ({ address, isSelected, onClick }) => (
  <div
    className={`border rounded-md p-4 cursor-pointer flex items-center font-montserrat ${isSelected
      ? 'border-primary bg-primary/90'
      : 'border-text/20 hover:border-text/30'
      }`}
    onClick={onClick}
  >
    <div className="h-5 w-5 rounded-full border border-text/30 mr-3 flex items-center justify-center">
      {isSelected && (
        <div className="h-3 w-3 rounded-full bg-primary"></div>
      )}
    </div>
    <div className="flex-1">
      <div className="flex items-center">
        <p className="font-medium text-text">{address.name || 'Unnamed Location'}</p>
        {address.isDefault && (
          <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
            Default
          </span>
        )}
      </div>
      <p className="text-sm text-text/70 mt-1">
        <FaMapMarkerAlt className="inline-block mr-1 text-primary" />
        {address.address}
      </p>
    </div>
  </div>
);

// Component for displaying a payment method option
const PaymentMethodOption = ({ id, icon: Icon, title, description, isSelected, onClick }) => (
  <div
    className={`border rounded-md p-4 cursor-pointer flex items-center font-montserrat ${isSelected
      ? 'border-primary bg-primary/90 text-secondary'
      : 'border-text/20 hover:border-text/30 text-secondary'
      }`}
    onClick={onClick}
  >
    <div className="h-5 w-5 rounded-full border border-text/30 mr-3 flex items-center justify-center">
      {isSelected && (
        <div className="h-3 w-3 rounded-full bg-secondary"></div>
      )}
    </div>
    <Icon className={`${isSelected ? 'text-secondary' : 'text-text'} text-xl mr-3`} />
    <div>
      <p className={`font-medium ${isSelected ? 'text-secondary' : 'text-text'}`}>{title}</p>
      <p className={`text-sm ${isSelected ? 'text-secondary' : 'text-text/50'}`}>{description}</p>
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
      <p className="font-medium text-text">{CURRENCY_SYMBOL} {item.price.toFixed(2)}</p>
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

  // Address states
  const [showAddressSelectorModal, setShowAddressSelectorModal] = useState(false);
  const savedAddresses = useSelector(selectSavedAddresses);
  const selectedAddressFromStore = useSelector(selectSelectedAddress);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '', // Single address field
    lat:'',
    lng:'',
    notes: ''
  });

  // Payment and delivery states
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderType, setOrderType] = useState('delivery');
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    paymentMethodId: null, // Add this field
  });
  const deliveryCharges = orderType === 'delivery' ? 100 : 0;

  // Tax state and calculations
  const [taxRate, setTaxRate] = useState(0);

  // Form validation state
  const [errors, setErrors] = useState({});

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
const taxAmount = subtotal * (taxRate / 100);
const finalTotal = subtotal + taxAmount + deliveryCharges;

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

const [taxRateFetched, setTaxRateFetched] = useState(false);

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
        setTaxRateFetched(true);
      }
    } catch (error) {
      console.error('Error fetching tax rate:', error);
      setTaxRate(0);
      setTaxRateFetched(true);
    }
  };
  fetchTaxRate();
}, [paymentMethod, selectedBranchId]);

  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          if (!user || !user._id) return;
          
          const profile = await authService.getProfile(user._id);
          console.log('Fetched user profile:', profile);
          
          setFormData(prev => ({
            ...prev,
            fullName: profile.Name || profile.name || '',
            email: profile.Email || profile.email || '',
            phone: profile.Phone || profile.phone || '',
          }));
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated]);
  // Update address field when selectedAddress changes in Redux
  useEffect(() => {
    if (selectedAddressFromStore) {
      setFormData(prev => ({
        ...prev,
        address: selectedAddressFromStore.address,
        lat: selectedAddressFromStore.lat,
        lng: selectedAddressFromStore.lng
      }));
    } else if (!isAuthenticated) {
      setFormData(prev => ({
        ...prev,
        address: '', // Clear address when logged out
        lat: '',
        lng: ''
      }));
    }
  }, [selectedAddressFromStore, isAuthenticated]);

  // Clear address field if selected address is deleted from saved addresses or if no saved addresses remain
useEffect(() => {
  if (
    (selectedAddressFromStore && !savedAddresses.some(addr => addr._id === selectedAddressFromStore._id)) ||
    savedAddresses.length === 0
  ) {
    setFormData(prev => ({
      ...prev,
      address: '',
      lat: '',
      lng: ''
    }));
  }
}, [savedAddresses, selectedAddressFromStore]);
 
  // Define order type options
  const orderTypeOptions = [
    { id: 'delivery', label: 'Delivery', description: 'Delivered to your address' },
    { id: 'takeaway', label: 'Takeaway', description: 'Pickup from restaurant' }
  ];

  // Define payment method options
  const paymentMethodOptions = [
    // {
    //   id: 'cash',
    //   icon: FaMoneyBillWave,
    //   title: 'Cash on Delivery',
    //   description: 'Pay when you receive your order'
    // },
    {
      id: 'card',
      icon: FaCreditCard,
      title: 'Credit/Debit Card',
      description: cardDetails
        ? `Card ending in ${cardDetails.cardNumber.slice(-4)}`
        : 'Pay with your card'
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

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);

    if (method === 'card' && !cardDetails) {
      setShowCardModal(true);
    }
  };

  // Handle card details submission
  const handleCardDetailsSave = (cardData) => {
    setCardDetails(cardData);
    setShowCardModal(false);
  };

  // Show address selector modal - UPDATED
  const handleShowAddressSelector = () => {
    setShowAddressSelectorModal(true);
  };

  // Hide address selector modal - UPDATED
  const handleAddressSelectorClose = () => {
    setShowAddressSelectorModal(false);
  };

  // Handle address selection from AddressSelector - NEW
  const handleAddressSelected = (selectedAddress) => {
    console.log("selected address: ", selectedAddress)
    setFormData(prev => ({
      ...prev,
      address: selectedAddress.address,
      lat:selectedAddress.lat,
      lng:selectedAddress.lng
    }));
    setShowAddressSelectorModal(false);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    // Email is optional but validate format if provided
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';

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

  if (paymentMethod === 'card' && !cardDetails.paymentMethodId) {
    setShowCardModal(true);
    return;
  }

  setSubmitError('');
  setIsSubmitting(true);

  try {
    let paymentResult = { success: true };
    let clientSecret = '';

    // Create PaymentIntent for card payments
    if (paymentMethod === 'card') {
      setPaymentLoading(true);
      console.log('Creating PaymentIntent with amount:', Math.round(finalTotal * 100));
      const response = await orderService.createPaymentIntent({
        amount: Math.round(finalTotal * 100),
        currency: 'usd',
        branchId: selectedBranchId
      });
      if (!response.clientSecret) {
        throw new Error('Could not initiate payment.');
      }
      clientSecret = response.clientSecret;
      setPaymentLoading(false);
    }

    // Confirm card payment
    if (paymentMethod === 'card' && cardDetails.paymentMethodId && clientSecret) {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: cardDetails.paymentMethodId,
      });

      if (error) {
        setSubmitError(error.message || 'Payment failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (paymentIntent.status !== 'succeeded') {
        setSubmitError('Payment processing failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      paymentResult = {
        success: true,
        paymentIntentId: paymentIntent.id,
        paymentMethodId: cardDetails.paymentMethodId,
      };
    }

    const orderData = {
      items: cartItems,
      customerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,      
      address: formData.address,
      lat: formData.lat,
      lng: formData.lng,
      notes: formData.notes,
      paymentMethod: paymentMethod,
      orderType: orderType,
      branchId: selectedBranchId,
      total: subtotal,
      deliveryCharges: deliveryCharges,
      tax: taxAmount,
      grandTotal: finalTotal,
      ...(paymentMethod === 'card' && {
        paymentDetails: {
          paymentIntentId: paymentResult.paymentIntentId,
          paymentMethodId: paymentResult.paymentMethodId,
          last4: cardDetails.last4,
          brand: cardDetails.brand
        }
      })
    };

    console.log("Submitting order data:", orderData);
const grandTotal = subtotal + taxAmount + deliveryCharges;
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
    setPaymentLoading(false);
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
          className="bg-primary text-secondary py-3 px-8 rounded-lg font-bold hover:bg-primary/80 transition font-poppins"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen'>
      {/* Address Selector Modal - UPDATED for proper scrolling */}
      {showAddressSelectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg w-full max-w-lg m-4 max-h-[90vh] overflow-hidden">
            <AddressSelector 
              onAddressSelected={handleAddressSelected}
              onClose={handleAddressSelectorClose}
              forceMapView={!isAuthenticated} // Force map view for non-authenticated users
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 bg-background mt-9">
        {/* Checkout header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center ml-3 text-sm font-medium mb-4 cursor-pointer text-text hover:text-accent transition-colors font-montserrat"
          >
            <FaArrowLeft className="mr-2" /> Back to Cart
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-text font-poppins">Checkout</h1>
        </div>

        {/* Card Details Modal */}
        <CardDetailsModal
          isOpen={showCardModal}
          onClose={() => {
            setShowCardModal(false);
            if (!cardDetails.paymentMethodId) setPaymentMethod('cash');
          }}
          onSave={handleCardDetailsSave}
          clientSecret={clientSecret}
        />

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
            <div className="bg-background rounded-lg shadow-md p-6 mb-6 border border-primary/20">
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
            <div className="bg-background rounded-lg shadow-md p-6 mb-6 border border-primary/20">
              <h2 className="text-xl font-bold mb-4 text-text font-poppins">Customer Information</h2>

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
                      className={`w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded-md ${errors.fullName ? 'border-accent' : 'border-text/20'}`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-accent text-sm mt-1 font-montserrat">{errors.fullName}</p>}
                  </div>
                  
                  {/* Email */}
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-text font-montserrat">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      
                      onChange={handleChange}
                      className={`w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded-md ${errors.email ? 'border-accent' : 'border-text/20'}`}
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
                      readOnly={isAuthenticated}
                      maxLength={PHONE_INPUT_CONFIG.maxLength}
                      className={`w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded-md ${errors.phone ? 'border-accent' : 'border-text/20'}`}
                      placeholder={PHONE_INPUT_CONFIG.placeholder}
                    />
                    {errors.phone && <p className="text-accent text-sm mt-1 font-montserrat">{errors.phone}</p>}
                  </div>

                  {/* Single Address Field with Map Selection Button - UPDATED */}
                  <div className="col-span-2 md:col-span-2">
                    <label htmlFor="address" className="flex justify-between items-center text-sm font-medium mb-1 text-text font-montserrat">
                      <span>Complete Address *</span>
                      <button
                        type="button"
                        onClick={handleShowAddressSelector}
                        className="text-primary hover:text-primary/80 text-sm flex items-center cursor-pointer"
                      >
                        <FaMapMarkerAlt className="mr-1" />
                        {isAuthenticated 
                          ? (selectedAddressFromStore ? 'Change Address' : 'Select from Map')
                          : 'Select from Map'
                        }
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        readOnly
                        className={`w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded-md ${errors.address ? 'border-accent' : 'border-text/20'} sm:pr-40`}
                        placeholder="Enter your complete address"
                      />
                      {selectedAddressFromStore && (
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center">
                          <span className="bg-primary/100 text-secondary text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-md">
                            {selectedAddressFromStore.name || 'Selected'}
                          </span>
                        </div>
                      )}
                    </div>
                    {errors.address && <p className="text-accent text-sm mt-1 font-montserrat">{errors.address}</p>}
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
                          className={`border rounded-md p-3 cursor-pointer transition-all font-montserrat ${orderType === option.id
                            ? 'border-primary bg-primary/90 text-secondary'
                            : 'border-text/20 hover:border-text/30 text-secondary'
                            }`}
                          onClick={() => setOrderType(option.id)}
                        >
                          <div className="flex items-center">
                            <div className="h-5 w-5 rounded-full border border-text/30 mr-3 flex items-center justify-center flex-shrink-0">
                              {orderType === option.id && (
                                <div className="h-3 w-3 rounded-full bg-secondary"></div>
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${orderType === option.id ? 'text-secondary' : 'text-text'}`}>{option.label}</p>
                              <p className={`text-sm ${orderType === option.id ? 'text-secondary' : 'text-text/50'}`}>{option.description}</p>
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
                      className="w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded-md"
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
                        onClick={() => handlePaymentMethodSelect(option.id)}
                      />
                    ))}

                    {paymentMethod === 'card' && cardDetails && (
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowCardModal(true)}
                          className="text-primary hover:text-primary/80 text-sm font-medium font-montserrat"
                        >
                          Change card details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {paymentError && (
                  <div className="mt-2 text-accent text-sm">
                    {paymentError}
                  </div>
                )}
                {paymentLoading && (
                  <div className="mt-2 flex items-center text-text/70">
                    <div className="w-4 h-4 border-2 border-text/30 border-t-text/80 rounded-full animate-spin mr-2"></div>
                    <span>Preparing payment...</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary - 1/3 width */}
          <div className="md:col-span-1">
            <div className="bg-background rounded-lg shadow-md p-6 sticky top-20 border border-primary/20">
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
                  <span className="text-text font-montserrat">{CURRENCY_SYMBOL} {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text/70 font-montserrat">Tax ({taxRate}%)</span>
                  <span className="text-text font-montserrat">{CURRENCY_SYMBOL} {taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text/70 font-montserrat">Delivery Fee</span>
                  <span className="text-text font-montserrat">{CURRENCY_SYMBOL} {deliveryCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2">
                  <span className="text-text font-poppins">Total</span>
                  <span className="text-text font-poppins">{CURRENCY_SYMBOL} {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting || branchLoading || branches.length === 0 || paymentLoading}
                className={`w-full cursor-pointer mt-6 py-3 rounded-md text-center font-bold text-secondary transition-all font-poppins ${isSubmitting || branchLoading || branches.length === 0 || paymentLoading
                    ? 'bg-text/20 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/80 hover:brightness-105'
                  }`}
              >
                {isSubmitting ? 'Processing...' : (paymentLoading ? 'Preparing Payment...' : 'Place Order')}
              </button>

              <p className="text-xs text-text/50 text-center mt-4 font-montserrat">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;