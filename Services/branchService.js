// services/branchService.js
const API_URL = import.meta.env.VITE_API_URL;

export const branchService = {
  /**
   * Get all branches from the API
   * @returns {Promise<Array>} - Array of branches
   */
  async getBranches() {
    try {
      const response = await fetch(`${API_URL}/api/public/menu/branches`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      
      const data = await response.json();
      return data.branches || [];
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  },
  
  /**
   * Get details for a specific branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Object>} - Branch details
   */
  async getBranchDetails(branchId) {
    try {
      if (!branchId) {
        throw new Error('Branch ID is required');
      }
      
      const response = await fetch(`${API_URL}/api/public/menu/branch/${branchId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch branch details');
      }
      
      const data = await response.json();
      return data.branch;
    } catch (error) {
      console.error('Error fetching branch details:', error);
      return null;
    }
  }
};

export default branchService;