import { createSlice } from '@reduxjs/toolkit';

// Helper function to calculate totals
const calculateTotals = (items) => {
  let totalQuantity = 0;
  let totalAmount = 0;
  
  items.forEach(item => {
    totalQuantity += item.quantity;
    totalAmount += item.price * item.quantity;
  });
  
  return { totalQuantity, totalAmount };
};

// Initialize state from localStorage if available
const loadCartFromStorage = () => {
  if (typeof window === 'undefined') return { items: [], totalQuantity: 0, totalAmount: 0 };
  
  try {
    const persistedCart = localStorage.getItem('cart');
    if (persistedCart) {
      return JSON.parse(persistedCart);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  
  return { items: [], totalQuantity: 0, totalAmount: 0 };
};

// Initial state
const initialState = loadCartFromStorage();

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        state.items[existingItemIndex].quantity += 1;
      } else {
        // Add new item
        state.items.push({ ...newItem, quantity: 1 });
      }
      
      // Update totals
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    // Increase item quantity
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
      }
      
      // Update totals
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    // Decrease item quantity
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex >= 0) {
        if (state.items[itemIndex].quantity === 1) {
          // Remove item if quantity becomes 0
          state.items = state.items.filter(item => item.id !== id);
        } else {
          // Decrease quantity
          state.items[itemIndex].quantity -= 1;
        }
      }
      
      // Update totals
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    // Remove item from cart
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      
      // Update totals
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      
      // Clear localStorage
      localStorage.removeItem('cart');
    },
  },
});

// Export actions
export const { 
  addToCart, 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart, 
  clearCart 
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;

// Selectors for accessing cart state
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
