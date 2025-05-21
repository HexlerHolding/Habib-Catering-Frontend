const API_URL = import.meta.env.VITE_API_URL;
const POS_API_URL = import.meta.env.VITE_POS_API_URL;
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe instance - Replace with your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLISHABLE_KEY');

// Generate a service token for communicating with the POS system
const generateServiceToken = () => {
  try {
    return import.meta.env.VITE_SERVICE_TOKEN || 'service-token-placeholder';
  } catch (error) {
    console.error('Error generating service token:', error);
    return null;
  }
};

export const orderService = {
  // Set the base URL and service token
  baseURL: POS_API_URL || 'http://localhost:5000', // Fallback to a default URL
  serviceToken: generateServiceToken(),

  /**
   * Create a payment intent for Stripe payment processing
   * @param {Object} paymentData - Payment data for intent creation
   * @param {number} paymentData.amount - Amount in cents
   * @param {string} paymentData.currency - Currency code (e.g., 'pkr', 'usd')
   * @param {string} paymentData.branchId - Branch ID
   * @returns {Promise<Object>} - Response containing client secret
   */
  async createPaymentIntent(paymentData) {
    try {
      console.log("=== ORDER SERVICE - CREATE PAYMENT INTENT ===");
      console.log("Preparing payment intent data...", paymentData);
      
      const response = await fetch(`${API_URL}/api/public/order/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }
      
      const responseData = await response.json();
      console.log("Payment intent created:", responseData);
      
      return responseData;
    } catch (error) {
      console.error("=== PAYMENT INTENT ERROR ===");
      console.error("Error message:", error.message);
      throw error;
    }
  },

  /**
   * Submit an order to the backend
   * @param {Object} orderData - Order data from checkout form
   * @returns {Promise} - Promise with order response
   */
  async submitOrder(orderData) {
    try {
      console.log("=== ORDER SERVICE - SUBMIT ORDER ===");
      console.log("Preparing order data for POS system...");
      
      // Calculate subtotal from items if not provided
      const subtotal = orderData.total || 
                       orderData.totalAmount || 
                       orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Get tax information
      let taxRate = 0;
      try {
        const taxInfo = await this.getBranchTaxes(orderData.branchId);
        taxRate = orderData.paymentMethod === 'card' ? taxInfo.card_tax : taxInfo.cash_tax;
      } catch (err) {
        console.warn('Could not fetch tax rates, using default 0%');
      }
      
      // Calculate tax amount
      const taxAmount = subtotal * (taxRate / 100);
      
      // Delivery fee
      const deliveryFee = orderData.orderType === 'delivery' ? 100 : 0;
      
      // Total amount
      const grandTotal = subtotal + taxAmount + deliveryFee;
      
      // Extract products array or format from items if needed
      const products = orderData.products || orderData.items.map(item => ({
        _id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      // Create order payload for POS system
      const orderPayload = {
        // Required fields that POS controller expects
        products: products,
        total: subtotal,
        grand_total: grandTotal,
        customer_name: orderData.customer_name || orderData.customerName || orderData.fullName,
        payment_method: (orderData.payment_method || orderData.paymentMethod || "cash").toLowerCase(),
        order_type: (orderData.order_type || orderData.orderType || "delivery").toLowerCase(),
        tax: taxAmount,
        discount: orderData.discount || 0,
        address: orderData.address,
        
        branch_id: orderData.branchId,
        shop_id: import.meta.env.VITE_DEFAULT_SHOP_ID,
        
        // New optional fields from the updated schema
        customer_phone: orderData.phone || "", 
        customer_email: orderData.email || "",
        delivery_charges: deliveryFee,
        comment: orderData.comment || orderData.notes || '',
        source_system: "ordering-system",
        
        // Include payment details if Stripe was used
        ...((orderData.paymentMethod === 'card' && orderData.paymentDetails) && {
          payment_details: {
            payment_intent_id: orderData.paymentDetails.paymentIntentId,
            payment_method_id: orderData.paymentDetails.paymentMethodId,
            last_four: orderData.paymentDetails.last4,
            brand: orderData.paymentDetails.brand
          }
        })
      };
      
      console.log("Order payload prepared:", JSON.stringify(orderPayload));
      
      // Submit to our own backend API
      console.log("Submitting to ordering system API:", `${API_URL}/api/public/order/submit`);
      
      // If using card payment, make sure we handle it correctly
      if (orderData.paymentMethod === 'card' && orderData.paymentDetails) {
        // Include the payment details in the submission
        console.log("Including payment details in order submission:", orderData.paymentDetails);
      }
      
      const orderingSystemResponse = await fetch(`${API_URL}/api/public/order/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...orderData,
          orderPayload // Include the formatted payload for POS system
        })
      });
      
      if (!orderingSystemResponse.ok) {
        const errorData = await orderingSystemResponse.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
      
      const responseData = await orderingSystemResponse.json();
      return responseData;
    } catch (error) {
      console.error("=== ORDER SERVICE ERROR ===");
      console.error("Error type:", error.name);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      throw error;
    }
  },
      
  /**
   * Get tax information for a branch
   * @param {string} branchId - ID of the branch
   * @returns {Promise} - Promise with tax info
   */
  async getBranchTaxes(branchId) {
    try {
      const response = await fetch(`${API_URL}/api/public/menu/branch/${branchId}/taxes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tax information');
      }
      
      const data = await response.json();
      return data.taxes;
    } catch (error) {
      console.error('Error fetching tax information:', error);
      // Return default tax rates on error
      return { cash_tax: 0, card_tax: 0 };
    }
  },
  
  /**
   * Verify a payment status with the backend
   * @param {string} paymentIntentId - The Stripe payment intent ID to verify
   * @returns {Promise<Object>} - Response with verification status
   */
  async verifyPayment(paymentIntentId) {
    try {
      const response = await fetch(`${API_URL}/api/public/order/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentIntentId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify payment');
      }
      
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
};