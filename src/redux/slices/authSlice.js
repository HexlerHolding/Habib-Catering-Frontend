// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('userToken') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('userToken')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // Extract token and user data from payload
      const { token, user, essentialUserData } = action.payload;
      
      // Store token
      state.token = token;
      
      // Store only essential user data (prefer essentialUserData if available)
      if (essentialUserData) {
        state.user = essentialUserData;
        localStorage.setItem('user', JSON.stringify(essentialUserData));
      } else if (user) {
        // If we don't have essentialUserData, create it from user
        const essentialData = {
          _id: user._id || user.id || '',
          Name: user.Name || user.name || '',
          Phone: user.Phone || user.phone || ''
        };
        
        state.user = essentialData;
        localStorage.setItem('user', JSON.stringify(essentialData));
      }
      
      // Set authenticated state and store token
      state.isAuthenticated = true;
      localStorage.setItem('userToken', token);
    },
    register: (state, action) => {
      const { token, user } = action.payload;
      
      // Store token
      state.token = token;
      
      // Store only essential user data
      if (user) {
        const essentialData = {
          _id: user._id || user.id || '',
          Name: user.Name || user.name || '',
          Phone: user.Phone || user.phone || ''
        };
        
        state.user = essentialData;
        localStorage.setItem('user', JSON.stringify(essentialData));
      }
      
      state.isAuthenticated = true;
      localStorage.setItem('userToken', token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      
      // Remove auth data from localStorage
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Clean up any remaining location data from localStorage
      localStorage.removeItem('selectedAddress');
      localStorage.removeItem('savedAddresses');
      
      // Clean up redux state in localStorage to remove location data
      try {
        const existingState = localStorage.getItem('reduxState');
        if (existingState) {
          const parsedState = JSON.parse(existingState);
          // Remove location data and reset auth
          const cleanState = {
            cart: parsedState.cart || { items: [], totalQuantity: 0, totalAmount: 0 },
            auth: {
              token: null,
              user: null,
              isAuthenticated: false
            }
            // Explicitly not including location
          };
          localStorage.setItem('reduxState', JSON.stringify(cleanState));
        }
      } catch (error) {
        console.log('Error cleaning up redux state on logout:', error);
      }
    },
    updateUser: (state, action) => {
      // Extract only essential data for updates
      const userData = action.payload;
      const essentialData = {
        _id: userData._id || userData.id || state.user?._id || '',
        Name: userData.Name || userData.name || state.user?.Name || '',
        Phone: userData.Phone || userData.phone || state.user?.Phone || ''
      };
      
      state.user = essentialData;
      localStorage.setItem('user', JSON.stringify(essentialData));
    }
  }
});

export const { login, logout, updateUser, register } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectUserId = (state) => state.auth.user?._id;

export default authSlice.reducer;