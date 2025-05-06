// services/orderService.js
const API_URL = import.meta.env.VITE_API_URL;

export const orderService = {
  /**
   * Submit an order to the backend
   * @param {Object} orderData - Order data from checkout form
   * @returns {Promise} - Promise with order response
   */
  async submitOrder(orderData) {
    try {
      console.log('Submitting order to API:', orderData);
      
      const response = await fetch(`${API_URL}/api/public/order/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting order:', error);
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