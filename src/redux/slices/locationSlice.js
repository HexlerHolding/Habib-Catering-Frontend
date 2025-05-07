// src/redux/slices/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAddress: localStorage.getItem('selectedAddress') 
    ? JSON.parse(localStorage.getItem('selectedAddress')) 
    : null,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
      localStorage.setItem('selectedAddress', JSON.stringify(action.payload));
    },
  }
});

export const { setSelectedAddress } = locationSlice.actions;
export const selectSelectedAddress = (state) => state.location.selectedAddress;
export default locationSlice.reducer;