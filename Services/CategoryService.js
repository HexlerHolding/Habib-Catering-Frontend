class CategoryService {
    constructor() {
      // Map POS categories to your menu categories
      this.categoryMapping = {
        // POS category -> Your category
        'pizza': 'pizzas',
        'burger': 'burgers',
        'side': 'sides',
        'drink': 'drinks',
        'dessert': 'desserts',
        'appetizer': 'sides',
        'beverage': 'drinks',
        'main': 'burgers',
        'default': 'others'
      };
    }
  
    mapPOSCategory(posCategory) {
      if (!posCategory) return 'others';
      
      // Convert to lowercase and try to find a match
      const normalizedCategory = posCategory.toLowerCase();
      
      // Check for exact match first
      if (this.categoryMapping[normalizedCategory]) {
        return this.categoryMapping[normalizedCategory];
      }
      
      // Check for partial matches
      for (const [posKey, yourKey] of Object.entries(this.categoryMapping)) {
        if (normalizedCategory.includes(posKey) || posKey.includes(normalizedCategory)) {
          return yourKey;
        }
      }
      
      return 'others';
    }
  
    async getCategoriesWithCounts(products) {
      const categoryCounts = {};
      
      products.forEach(product => {
        const category = this.mapPOSCategory(product.category);
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      return categoryCounts;
    }
  }
  
  export const categoryService = new CategoryService();