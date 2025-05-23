import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import locationReducer from './slices/locationSlice';

// Load state from localStorage (excluding location data)
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);
    
    // Always exclude location data from localStorage
    // Location data should always be fresh from API for authenticated users
    const { location, ...stateWithoutLocation } = parsedState;
    
    return stateWithoutLocation;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage (excluding location data)
const saveState = (state) => {
  try {
    // Create a copy of state without location data
    const { location, ...stateWithoutLocation } = state;
    
    // Only persist cart and auth data
    const stateToPersist = {
      cart: stateWithoutLocation.cart,
      auth: stateWithoutLocation.auth
      // Explicitly excluding location data
    };
    
    const serializedState = JSON.stringify(stateToPersist);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    location: locationReducer,
  },
  preloadedState
});

// Subscribe to store changes to save state (excluding location)
store.subscribe(() => {
  saveState(store.getState());
});

export default store;