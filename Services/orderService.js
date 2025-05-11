const API_URL = import.meta.env.VITE_API_URL;
const POS_API_URL = import.meta.env.VITE_POS_API_URL; // Add this environment variable
//import axios

// Generate a service token for communicating with the POS system
const generateServiceToken = () => {
  try {
    // If you're using a library like jwt-simple or jsonwebtoken in the frontend
    // You can include this logic here, but usually token generation happens on backend
    // For testing, you can hard-code a token or get it from env variables
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
        customer_name: orderData.customer_name || orderData.customerName,
        payment_method: (orderData.payment_method || orderData.paymentMethod || "cash").toLowerCase(),
        order_type: (orderData.order_type || orderData.orderType || "delivery").toLowerCase(),
        tax: taxAmount,
        discount: orderData.discount || 0,
        address: orderData.address,
        
        branch_id: orderData.branchId,
        shop_id: import.meta.env.VITE_DEFAULT_SHOP_ID,
        
        // New optional fields from the updated schema
        customer_phone: orderData.customer_phone || orderData.phone,
        delivery_charges: deliveryFee,
        comment: orderData.comment || orderData.notes || '',
        source_system: "ordering-system",
      };
      
      console.log("Order payload prepared:", JSON.stringify(orderPayload));
      
      // First, submit to our own backend API
      console.log("Submitting to ordering system API:", `${API_URL}/api/public/order/submit`);
      const orderingSystemResponse = await fetch(`${API_URL}/api/public/order/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!orderingSystemResponse.ok) {
        const errorData = await orderingSystemResponse.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
      
      const responseData = await orderingSystemResponse.json();
      
      // Note: The direct POS API call should happen on the backend, not from the frontend
      // This is shown here just for reference but actually should be handled in your backend
      
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
  }
};