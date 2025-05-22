const API_URL = import.meta.env.VITE_API_URL;

export const branchService = {
  /**
   * Get all branches from the API
   * @returns {Promise<Array>} - Array of branches with validated coordinates
   */
async getBranches() {
  try {
    const response = await fetch(`${API_URL}/api/public/menu/branches`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }
    
    const data = await response.json();
    console.log('Fetched branches:', data);
    const branches = data.branches || [];
    
    return branches.map(branch => {
      if (branch.latitude == null || branch.longitude == null) {
        console.warn(`Branch ${branch.id} - ${branch.name} has missing latitude or longitude`);
      }

      // Log the latitude and longitude
      console.log(`Branch ${branch.id} - ${branch.name} | Latitude: ${branch.latitude}, Longitude: ${branch.longitude}`);
      
      return branch;
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
},

  
  /**
   * Get details for a specific branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Object>} - Branch details with validated coordinates
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
      const branch = data.branch;
      
      if (!branch) {
        return null;
      }
      
      // Validate coordinates
      if (!branch.coordinates || 
          typeof branch.coordinates !== 'object' ||
          !branch.coordinates.lat || 
          !branch.coordinates.lng) {
        console.warn(`Branch ${branch.id} - ${branch.name} has missing or invalid coordinates`);
        
        // Ensure coordinates object exists to prevent destructuring errors
        branch.coordinates = branch.coordinates || {};
      }
      
      return branch;
    } catch (error) {
      console.error('Error fetching branch details:', error);
      return null;
    }
  },
  
  /**
   * Function to validate if branch coordinates are valid
   * @param {Object} branch - Branch object
   * @returns {boolean} - Whether the branch has valid coordinates
   */
  hasValidCoordinates(branch) {
    return (
      branch &&
      branch.coordinates &&
      typeof branch.coordinates === 'object' &&
      typeof branch.coordinates.lat === 'number' &&
      typeof branch.coordinates.lng === 'number'
    );
  }
};

export default branchService;