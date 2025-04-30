import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './CartSlice';
import userReducer from './UserSlice';
import locationReducer from './LocationSlice';

export default configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    location: locationReducer,
  },
});
