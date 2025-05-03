import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Add item to favorites
    addToFavorites: (state, action) => {
      // Check if item already exists
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    // Remove item from favorites
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // Clear all favorites
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;

// Selector to get all favorites
export const selectFavorites = (state) => state.favorites.items;
// Selector to check if an item is favorited
export const selectIsFavorite = (state, itemId) => 
  state.favorites.items.some(item => item.id === itemId);

export default favoritesSlice.reducer;
