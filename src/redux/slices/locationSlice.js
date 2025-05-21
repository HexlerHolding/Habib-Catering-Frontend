// src/redux/slices/locationSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Async thunks for address operations
export const fetchUserAddresses = createAsyncThunk(
  'location/fetchUserAddresses',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/user/addresses/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch addresses');
    }
  }
);

export const saveUserAddress = createAsyncThunk(
  'location/saveUserAddress',
  async ({ userId, address }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(`${API_URL}/user/addresses/${userId}`, 
        { address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to save address');
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  'location/deleteUserAddress',
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.delete(`${API_URL}/user/addresses/${userId}/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete address');
    }
  }
);

export const setUserSelectedAddress = createAsyncThunk(
  'location/setUserSelectedAddress',
  async ({ userId, address }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(`${API_URL}/user/selected-address/${userId}`, 
        { address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.selected_address;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to set selected address');
    }
  }
);

// Update user address name (new async thunk)
export const updateUserAddressName = createAsyncThunk(
  'location/updateUserAddressName',
  async ({ userId, addressId, name }, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      // Find the full address object from current state
      const state = getState();
      const addresses = state.location.savedAddresses || [];
      const address = addresses.find(addr => addr.id === addressId);
      if (!address) throw new Error('Address not found');
      // Update the name
      const updatedAddress = { ...address, name };
      // Use POST to update (not PUT), as per backend
      const response = await axios.post(
        `${API_URL}/user/addresses/${userId}`,
        { address: updatedAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data; // Should return updated addresses array
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to update address name');
    }
  }
);

// Set up initial state properly with an empty array for savedAddresses
const initialState = {
  selectedAddress: JSON.parse(localStorage.getItem('selectedAddress')) || null,
  savedAddresses: JSON.parse(localStorage.getItem('savedAddresses')) || [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    // Set the currently selected address for delivery (local only)
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
      localStorage.setItem('selectedAddress', JSON.stringify(action.payload));
    },
    
    // Add a new address to the saved addresses list (local only)
    addSavedAddress: (state, action) => {
      // Check if address already exists by ID
      const exists = state.savedAddresses.some(addr => addr.id === action.payload.id);
      if (!exists) {
        state.savedAddresses.push(action.payload);
        localStorage.setItem('savedAddresses', JSON.stringify(state.savedAddresses));
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
          localStorage.setItem('selectedAddress', JSON.stringify(state.selectedAddress));
        }
        
        localStorage.setItem('savedAddresses', JSON.stringify(state.savedAddresses));
      }
    },
    
    // Remove an address from the saved list (local only)
    removeAddress: (state, action) => {
      state.savedAddresses = state.savedAddresses.filter(
        address => address.id !== action.payload
      );
      
      // If the deleted address was the selected one, clear the selection
      if (state.selectedAddress && state.selectedAddress.id === action.payload) {
        state.selectedAddress = state.savedAddresses.length > 0 ? state.savedAddresses[0] : null;
        
        if (state.selectedAddress) {
          localStorage.setItem('selectedAddress', JSON.stringify(state.selectedAddress));
        } else {
          localStorage.removeItem('selectedAddress');
        }
      }
      
      localStorage.setItem('savedAddresses', JSON.stringify(state.savedAddresses));
    },
    
    // Clear addresses
    clearAddresses: (state) => {
      state.savedAddresses = [];
      state.selectedAddress = null;
      localStorage.removeItem('savedAddresses');
      localStorage.removeItem('selectedAddress');
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedAddresses = action.payload;
        
        // If there are addresses but no selected address, select the first one
        if (action.payload.length > 0 && !state.selectedAddress) {
          state.selectedAddress = action.payload[0];
          localStorage.setItem('selectedAddress', JSON.stringify(action.payload[0]));
        }
        
        // Update localStorage
        localStorage.setItem('savedAddresses', JSON.stringify(action.payload));
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Save user address
      .addCase(saveUserAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveUserAddress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedAddresses = action.payload;
        
        // Update localStorage
        localStorage.setItem('savedAddresses', JSON.stringify(action.payload));
      })
      .addCase(saveUserAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Delete user address
      .addCase(deleteUserAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedAddresses = action.payload;
        
        // Update localStorage
        localStorage.setItem('savedAddresses', JSON.stringify(action.payload));
        
        // If the selected address was deleted, select the first available one
        if (state.selectedAddress && 
            !action.payload.some(addr => addr.id === state.selectedAddress.id)) {
          state.selectedAddress = action.payload.length > 0 ? action.payload[0] : null;
          
          if (state.selectedAddress) {
            localStorage.setItem('selectedAddress', JSON.stringify(state.selectedAddress));
          } else {
            localStorage.removeItem('selectedAddress');
          }
        }
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Set user selected address
      .addCase(setUserSelectedAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setUserSelectedAddress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedAddress = action.payload;
        localStorage.setItem('selectedAddress', JSON.stringify(action.payload));
      })
      .addCase(setUserSelectedAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update user address name
      .addCase(updateUserAddressName.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserAddressName.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedAddresses = action.payload;
        localStorage.setItem('savedAddresses', JSON.stringify(action.payload));
      })
      .addCase(updateUserAddressName.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  setSelectedAddress,
  addSavedAddress,
  updateAddressName,
  removeAddress,
  clearAddresses
} = locationSlice.actions;

// Export selectors
export const selectSelectedAddress = state => state.location.selectedAddress;
export const selectSavedAddresses = state => state.location.savedAddresses || [];
export const selectLocationStatus = state => state.location.status;
export const selectLocationError = state => state.location.error;

// Export reducer
export default locationSlice.reducer;