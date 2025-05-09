import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: JSON.parse(localStorage.getItem('favorites')) || []
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.favorites.some(item => item.id === action.payload.id)) {
        state.favorites.push(action.payload);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    }
  }
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
// Fix the selectFavorites selector to correctly access the state
export const selectFavorites = (state) => state.favorites.favorites;
// Fix the selectIsFavorite selector to correctly access the state structure
export const selectIsFavorite = (state, itemId) => {
  // Check if the favorites slice and the favorites array exist
  if (!state || !state.favorites || !state.favorites.favorites) return false;
  
  // Access the favorites array through the correct path
  return state.favorites.favorites.some(item => item.id === itemId);
}
export default favoritesSlice.reducer;