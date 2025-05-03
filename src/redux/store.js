import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';

// Configure the Redux store with our reducers
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
