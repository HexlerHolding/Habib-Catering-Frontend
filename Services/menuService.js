
//import REACT_APP_URL from env like we do in vite

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
  
  // Helper to map POS categories to your existing categories
  mapCategoryIdToName(categoryId) {
    const categoryMap = {
      'pizzas': 'Pizzas',
      'burgers': 'Burgers', 
      'sides': 'Sides',
      'drinks': 'Drinks',
      'desserts': 'Desserts',
      'others': 'Others'
    };
    return categoryMap[categoryId] || 'Others';
  }
};