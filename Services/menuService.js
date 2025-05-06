// services/menuService.js

const API_URL = import.meta.env.VITE_API_URL;

export const menuService = {
  async getMenuProducts() {
    try {
      const response = await fetch(`${API_URL}/api/public/menu/products`);
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching menu products:', error);
      return [];
    }
  },
  
  async getMenuCategories() {
    try {
      const response = await fetch(`${API_URL}/api/public/menu/categories`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      // Return default categories as fallback
      return [
        { id: 'others', name: 'Others' }
      ];
    }
  }
};