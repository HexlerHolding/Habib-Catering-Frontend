// src/redux/slices/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Set up initial state properly with an empty array for savedAddresses
const initialState = {
  selectedAddress: null,
  savedAddresses: [], // Ensure this is an empty array, not null or undefined
  loading: false,
  error: null
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    // Set the currently selected address for delivery
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    
    // Add a new address to the saved addresses list
    addSavedAddress: (state, action) => {
      // Initialize savedAddresses if it doesn't exist
      if (!state.savedAddresses) {
        state.savedAddresses = [];
      }
      
      // Check if address already exists by ID
      const exists = state.savedAddresses.some(addr => addr.id === action.payload.id);
      if (!exists) {
        state.savedAddresses.push(action.payload);
      }
    },
    
    // Update an address name
    updateAddressName: (state, action) => {
      const { id, name } = action.payload;
      const address = state.savedAddresses.find(addr => addr.id === id);
      if (address) {
        address.name = name;
        
        // If this is the selected address, update that too
        if (state.selectedAddress && state.selectedAddress.id === id) {
          state.selectedAddress.name = name;
        }
      }
    },
    
    // Remove an address from the saved list
    removeAddress: (state, action) => {
      state.savedAddresses = state.savedAddresses.filter(
        address => address.id !== action.payload
      );
      
      // If the deleted address was the selected one, clear the selection
      if (state.selectedAddress && state.selectedAddress.id === action.payload) {
        state.selectedAddress = state.savedAddresses.length > 0 ? state.savedAddresses[0] : null;
      }
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

// Export actions
export const {
  setSelectedAddress,
  addSavedAddress,
  updateAddressName,
  removeAddress,
  setLoading,
  setError
} = locationSlice.actions;

// Export selectors
export const selectSelectedAddress = state => state.location.selectedAddress;
export const selectSavedAddresses = state => 
  state.location && state.location.savedAddresses ? state.location.savedAddresses : [];
export const selectLocationLoading = state => state.location.loading;
export const selectLocationError = state => state.location.error;

// Export reducer
export default locationSlice.reducer;