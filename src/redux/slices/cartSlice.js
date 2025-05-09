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
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.price,
        });
      }
      
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    // Remove item from cart
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice = existingItem.price * existingItem.quantity;
        }
        
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    // Increase quantity of a specific item
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity++;
        item.totalPrice = item.price * item.quantity;
        
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;
        
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    // Decrease quantity of a specific item
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity--;
          item.totalPrice = item.price * item.quantity;
        }
        
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;
        
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    // Remove item completely regardless of quantity
    removeItemCompletely: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        state.items = state.items.filter(item => item.id !== id);
        
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;
        
        localStorage.setItem('cart', JSON.stringify(state));
      }
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
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity, 
  removeItemCompletely, 
  clearCart 
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;

// Selectors for accessing cart state
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
