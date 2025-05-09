import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // Check if we have both token and user in the payload
      const { token, user = null } = action.payload;
      state.token = token;
      
      // Ensure we have a user object with at least phone number
      if (user) {
        // Make sure we store the user data properly
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      } else if (action.payload.phone) {
        // If no user object but we have a phone, create minimal user object
        state.user = { phone: action.payload.phone };
        localStorage.setItem('user', JSON.stringify({ phone: action.payload.phone }));
      }
      
      // Set authenticated state and store token
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      
      console.log("User stored in Redux:", state.user);
    },
    // Add a specific action for registration
    register: (state, action) => {
      const { token, name, phone } = action.payload;
      state.token = token;
      state.user = { name, phone };
      state.isAuthenticated = true;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, phone }));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      
      // Remove from localStorage - handle both token keys
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    }
  }
});

export const { login, logout, updateUser, register } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
