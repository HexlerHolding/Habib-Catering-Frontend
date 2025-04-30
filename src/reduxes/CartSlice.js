import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { isOpen: false, items: [], tax: null},
  reducers: {
    toggleCart: state => {
      state.isOpen = !state.isOpen;
    },
    addToCart: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (itemIndex >= 0) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        }
      }
    },
    removeItemFromCart: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.items.splice(itemIndex, 1);
      }
    },
    clearCart: state => {
      state.items = [];
    },
    addTax: (state, action) => {
      state.tax = action.payload;
    },
  },
});

export const { toggleCart, addToCart, removeFromCart, removeItemFromCart, clearCart, addTax } = cartSlice.actions;

export default cartSlice.reducer;